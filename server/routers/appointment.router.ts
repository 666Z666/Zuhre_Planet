 
import { router, protectedProcedure } from '../router.core';
import { z } from 'zod';
import { db } from '@/drizzle/db';
import * as schema from '@/drizzle/schema';
import { eq, and, or, desc, sql } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

export const appointmentRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        escortId: z.number(),
        date: z.string(),
        time: z.string(),
        duration: z.number().min(30),
        notes: z.string().optional(),
        price: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const customerId = ctx.user.id;
      const [newAppointment] = await db.insert(schema.appointments).values({
        customerId,
        escortId: input.escortId,
        date: input.date,
        time: input.time,
        duration: input.duration,
        notes: input.notes,
        price: input.price,
        status: 'pending',
      }).returning();

      return newAppointment;
    }),

  list: protectedProcedure
    .input(
      z.object({
        status: z.enum(schema.appointmentStatusEnum.enumValues).optional(),
        limit: z.number().int().min(1).max(100).default(20),
        page: z.number().int().min(1).default(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const { status, limit, page } = input;

      // appointments.escortId references escortProfiles.id (NOT users.id)
      // We must resolve the user's escortProfile.id first to match correctly
      const escortProfile = ctx.user.role === 'escort'
        ? await db.query.escortProfiles.findFirst({
            where: eq(schema.escortProfiles.userId, userId),
            columns: { id: true },
          })
        : null;

      const whereConditions = [
        or(
          eq(schema.appointments.customerId, userId),
          // Use escortProfile.id if user is an escort, otherwise this branch never matches
          ...(escortProfile ? [eq(schema.appointments.escortId, escortProfile.id)] : [])
        )!,
      ];

      if (status) {
          whereConditions.push(eq(schema.appointments.status, status));
      }

      const appointments = await db.query.appointments.findMany({
        where: and(...whereConditions as any),
        orderBy: [desc(schema.appointments.createdAt)],
        limit: limit,
        offset: (page - 1) * limit,
        with: {
            customer: { columns: { fullName: true, email: true } },
            escort: { columns: { stageName: true, displayName: true } }
        }
      });

      return appointments;
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        appointmentId: z.number(),
        status: z.enum(schema.appointmentStatusEnum.enumValues),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { appointmentId, status } = input;
      const userId = ctx.user.id;

      const [appointment] = await db.select().from(schema.appointments).where(eq(schema.appointments.id, appointmentId));

      if (!appointment) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Randevu bulunamadı.' });
      }

      // appointments.escortId = escortProfiles.id (NOT users.id) — resolve correctly
      let isEscortOwner = false;
      if (ctx.user.role === 'escort') {
        const escortProfile = await db.query.escortProfiles.findFirst({
          where: eq(schema.escortProfiles.userId, userId),
          columns: { id: true },
        });
        isEscortOwner = escortProfile?.id === appointment.escortId;
      }

      if (appointment.customerId !== userId && !isEscortOwner) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Bu randevuyu güncelleme yetkiniz yok.' });
      }

      if (status === 'confirmed' && !isEscortOwner) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Sadece escort randevuyu onaylayabilir.' });
      }

      const [updatedAppointment] = await db.update(schema.appointments)
        .set({ status })
        .where(eq(schema.appointments.id, appointmentId))
        .returning();

      // --- GAMIFICATION: Randevu tamamlandığında Sadakat Puanı ekle ---
      if (status === 'completed' && appointment.status !== 'completed') {
          const escortProfile = await db.query.escortProfiles.findFirst({
              where: eq(schema.escortProfiles.id, appointment.escortId!)
          });

          // Escort için puan
          if (escortProfile) {
              await db.update(schema.users)
                  .set({ loyaltyPoints: sql`${schema.users.loyaltyPoints} + 100` })
                  .where(eq(schema.users.id, escortProfile.userId));
                  
              await db.insert(schema.loyaltyTransactions).values({
                  userId: escortProfile.userId,
                  amount: 100,
                  type: 'earn',
                  description: 'Randevu başarıyla tamamlandı',
                  relatedAppointmentId: appointment.id
              });
          }

          // Müşteri için puan
          if (appointment.customerId) {
              await db.update(schema.users)
                  .set({ loyaltyPoints: sql`${schema.users.loyaltyPoints} + 100` })
                  .where(eq(schema.users.id, appointment.customerId));
                  
              await db.insert(schema.loyaltyTransactions).values({
                  userId: appointment.customerId,
                  amount: 100,
                  type: 'earn',
                  description: 'Hizmet alımı tamamlandı',
                  relatedAppointmentId: appointment.id
              });
          }
      }

      return updatedAppointment;
    }),
});

export type AppointmentRouter = typeof appointmentRouter;





