import { router, protectedProcedure } from '../router.core';
import { db } from '@/drizzle/db';
import * as schema from '@/drizzle/schema';
import { and, desc, eq, sql } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

/**
 * Mesajlaşma Router
 *
 * Gerçek zamanlı mesajlaşma, sohbet ve bildirim yönetimi
 */

function parseParticipantIds(participantIdsRaw: string): number[] {
  try {
    const parsed = JSON.parse(participantIdsRaw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value));
  } catch {
    return [];
  }
}

function buildParticipantIds(userA: number, userB: number): string {
  return JSON.stringify([userA, userB].sort((a, b) => a - b));
}

export const messagingRouter = router({
  /**
   * Sohbet listesini getir
   */
  getConversations: protectedProcedure
    .input(z.object({ limit: z.number().int().min(1).max(100).default(50) }))
    .query(async ({ ctx, input }) => {
      const conversations = await db.query.chatConversations.findMany({
        // participant_ids JSON string alanında kullanıcı id'sini ara
        // Fixed: LIKE '%1%' wrongly matches [12,34] or [21,5]. Use boundary patterns instead.
        where: sql`(${schema.chatConversations.participantIds} LIKE ${`[${ctx.user.id},%`} OR ${schema.chatConversations.participantIds} LIKE ${`%,${ctx.user.id}]`})`,
        orderBy: (conversation, { desc }) => [desc(conversation.lastMessageAt), desc(conversation.createdAt)],
        limit: input.limit,
        with: {
          messages: {
            orderBy: (message, { desc }) => [desc(message.createdAt)],
            limit: 1,
          },
        },
      });

      return conversations.map((conversation) => {
        const participantIds = parseParticipantIds(conversation.participantIds);
        const otherParticipantId = participantIds.find((id) => id !== ctx.user.id) ?? null;

        return {
          id: conversation.id,
          otherParticipantId,
          lastMessage: conversation.messages[0] ?? null,
          updatedAt: conversation.lastMessageAt ?? conversation.createdAt,
          unreadCount: 0, // TODO: Okunmamış mesaj sayısını hesapla
        };
      });
    }),

  /**
   * Belirli bir sohbetin mesajlarını getir
   */
  getMessages: protectedProcedure
    .input(
      z.object({
        conversationId: z.number(),
        limit: z.number().int().min(1).max(100).default(50),
        offset: z.number().int().min(0).default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const conversation = await db.query.chatConversations.findFirst({
        where: eq(schema.chatConversations.id, input.conversationId),
      });

      if (!conversation) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Sohbet bulunamadı' });
      }

      const participantIds = parseParticipantIds(conversation.participantIds);
      if (!participantIds.includes(ctx.user.id)) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Bu sohbete erişim yetkiniz yok',
        });
      }

      const messages = await db.query.chatMessages.findMany({
        where: and(
          eq(schema.chatMessages.conversationId, input.conversationId),
          eq(schema.chatMessages.isDeleted, false),
        ),
        orderBy: [desc(schema.chatMessages.createdAt)],
        limit: input.limit,
        offset: input.offset,
      });

      return messages.reverse();
    }),

  /**
   * Yeni mesaj gönder
   */
  sendMessage: protectedProcedure
    .input(
      z.object({
        conversationId: z.number(),
        content: z.string().min(1).max(5000),
        attachmentUrl: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const conversation = await db.query.chatConversations.findFirst({
        where: eq(schema.chatConversations.id, input.conversationId),
      });

      if (!conversation) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Sohbet bulunamadı' });
      }

      const participantIds = parseParticipantIds(conversation.participantIds);
      if (!participantIds.includes(ctx.user.id)) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Bu sohbete mesaj gönderme yetkiniz yok',
        });
      }

      await db.insert(schema.chatMessages).values({
        conversationId: input.conversationId,
        senderId: ctx.user.id,
        content: input.content,
        mediaUrl: input.attachmentUrl ?? null,
        isRead: false,
      });

      await db
        .update(schema.chatConversations)
        .set({ lastMessageAt: new Date() })
        .where(eq(schema.chatConversations.id, input.conversationId));

      return { success: true, message: 'Mesaj gönderildi' };
    }),

  /**
   * Sohbet oluştur veya mevcut sohbeti getir
   */
  getOrCreateConversation: protectedProcedure
    .input(z.object({ otherUserId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (input.otherUserId === ctx.user.id) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Kendinizle sohbet başlatamazsınız',
        });
      }

      const participantIds = buildParticipantIds(ctx.user.id, input.otherUserId);

      const existingConversation = await db.query.chatConversations.findFirst({
        where: eq(schema.chatConversations.participantIds, participantIds),
      });

      if (existingConversation) {
        return { id: existingConversation.id, created: false };
      }

      const [newConversation] = await db
        .insert(schema.chatConversations)
        .values({
          participantIds,
          lastMessageAt: new Date(),
        })
        .returning({ id: schema.chatConversations.id });

      return { id: newConversation.id, created: true };
    }),

  /**
   * Mesajı okundu olarak işaretle
   */
  markAsRead: protectedProcedure
    .input(z.object({ messageId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const message = await db.query.chatMessages.findFirst({
        where: eq(schema.chatMessages.id, input.messageId),
      });

      if (!message) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Mesaj bulunamadı' });
      }

      if (!message.conversationId) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Mesaj sohbete bağlı değil' });
      }

      const conversation = await db.query.chatConversations.findFirst({
        where: eq(schema.chatConversations.id, message.conversationId),
      });

      if (!conversation) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Sohbet bulunamadı' });
      }

      const participantIds = parseParticipantIds(conversation.participantIds);
      if (!participantIds.includes(ctx.user.id)) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Bu mesajı okundu işaretleme yetkiniz yok',
        });
      }

      await db
        .update(schema.chatMessages)
        .set({ isRead: true, readAt: new Date() })
        .where(eq(schema.chatMessages.id, input.messageId));

      return { success: true };
    }),

  /**
   * Sohbeti sil
   */
  deleteConversation: protectedProcedure
    .input(z.object({ conversationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const conversation = await db.query.chatConversations.findFirst({
        where: eq(schema.chatConversations.id, input.conversationId),
      });

      if (!conversation) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Sohbet bulunamadı' });
      }

      const participantIds = parseParticipantIds(conversation.participantIds);
      if (!participantIds.includes(ctx.user.id)) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Bu sohbeti silme yetkiniz yok',
        });
      }

      await db
        .delete(schema.chatMessages)
        .where(eq(schema.chatMessages.conversationId, input.conversationId));

      await db
        .delete(schema.chatConversations)
        .where(eq(schema.chatConversations.id, input.conversationId));

      return { success: true, message: 'Sohbet silindi' };
    }),

  /**
   * Mesajı sil
   */
  deleteMessage: protectedProcedure
    .input(z.object({ messageId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const message = await db.query.chatMessages.findFirst({
        where: eq(schema.chatMessages.id, input.messageId),
      });

      if (!message) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Mesaj bulunamadı' });
      }

      if (message.senderId !== ctx.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Bu mesajı silme yetkiniz yok',
        });
      }

      await db.delete(schema.chatMessages).where(eq(schema.chatMessages.id, input.messageId));

      return { success: true, message: 'Mesaj silindi' };
    }),

  /**
   * Mesajı düzenle
   */
  editMessage: protectedProcedure
    .input(
      z.object({
        messageId: z.number(),
        content: z.string().min(1).max(5000),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const message = await db.query.chatMessages.findFirst({
        where: eq(schema.chatMessages.id, input.messageId),
      });

      if (!message) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Mesaj bulunamadı' });
      }

      if (message.senderId !== ctx.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Bu mesajı düzenleme yetkiniz yok',
        });
      }

      await db
        .update(schema.chatMessages)
        .set({ content: input.content })
        .where(eq(schema.chatMessages.id, input.messageId));

      return { success: true, message: 'Mesaj düzenlendi' };
    }),
});

export type MessagingRouter = typeof messagingRouter;
