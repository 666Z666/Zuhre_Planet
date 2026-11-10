import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/drizzle/db';
import * as schema from '@/drizzle/schema';
import { router, publicProcedure, protectedProcedure } from '../router.core';

const defaultCategories = [
  {
    name: 'Genel Sohbet',
    slug: 'genel',
    description: 'Topluluk duyuruları, tanışma başlıkları ve genel sohbetler.',
    displayOrder: 1,
  },
  {
    name: 'Topluluk Rehberi',
    slug: 'rehber',
    description: 'Kurallar, güvenlik tavsiyeleri ve platform kullanım ipuçları.',
    displayOrder: 2,
  },
  {
    name: 'Öneriler ve Geri Bildirim',
    slug: 'oneriler',
    description: 'Ürün geliştirme önerileri ve deneyim geri bildirimleri.',
    displayOrder: 3,
  },
];

function slugify(value: string) {
  return value
    .toLocaleLowerCase('tr-TR')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function ensureDefaultCategories() {
  const categories = await db.query.forumCategories.findMany({
    orderBy: (table, { asc }) => [asc(table.displayOrder), asc(table.id)],
  });

  if (categories.length > 0) {
    return categories;
  }

  await db.insert(schema.forumCategories).values(defaultCategories);

  return db.query.forumCategories.findMany({
    orderBy: (table, { asc }) => [asc(table.displayOrder), asc(table.id)],
  });
}

async function buildUniqueTopicSlug(baseValue: string) {
  const baseSlug = slugify(baseValue) || `konu-${Date.now()}`;
  let candidate = baseSlug;
  let counter = 1;

  while (await db.query.forumTopics.findFirst({ where: eq(schema.forumTopics.slug, candidate) })) {
    counter += 1;
    candidate = `${baseSlug}-${counter}`;
  }

  return candidate;
}

export const forumRouter = router({
  getCategories: publicProcedure.query(async () => {
    const categories = await ensureDefaultCategories();
    const topics = await db.query.forumTopics.findMany({
      with: {
        posts: true,
      },
    });

    return categories.map((category) => {
      const categoryTopics = topics.filter((topic) => topic.categoryId === category.id);
      const postCount = categoryTopics.reduce((total, topic) => total + (topic.posts?.length || 0), 0);

      return {
        id: String(category.id),
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        createdAt: category.createdAt?.toISOString() || new Date(0).toISOString(),
        topicCount: categoryTopics.length,
        postCount,
      };
    });
  }),

  getTopics: publicProcedure
    .input(z.object({
      categorySlug: z.string().min(1),
    }))
    .query(async ({ input }) => {
      await ensureDefaultCategories();

      const category = await db.query.forumCategories.findFirst({
        where: eq(schema.forumCategories.slug, input.categorySlug),
      });

      if (!category) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Forum kategorisi bulunamadı.',
        });
      }

      const topics = await db.query.forumTopics.findMany({
        where: eq(schema.forumTopics.categoryId, category.id),
        with: {
          author: { columns: { id: true, fullName: true, role: true } },
          posts: {
            with: {
              author: { columns: { id: true, fullName: true, role: true } },
            },
            orderBy: (table, { asc }) => [asc(table.createdAt)],
          },
        },
        orderBy: (table, { desc }) => [desc(table.isSticky), desc(table.createdAt)],
      });

      return {
        category: {
          id: String(category.id),
          name: category.name,
          slug: category.slug,
          description: category.description || '',
        },
        topics: topics.map((topic) => {
          const lastPost = topic.posts?.[topic.posts.length - 1];

          return {
            id: String(topic.id),
            title: topic.title,
            slug: topic.slug,
            isSticky: Boolean(topic.isSticky),
            isLocked: Boolean(topic.isLocked),
            viewCount: topic.viewCount || 0,
            createdAt: topic.createdAt?.toISOString() || new Date(0).toISOString(),
            author: topic.author
              ? {
                  id: String(topic.author.id),
                  fullName: topic.author.fullName || `Üye #${topic.author.id}`,
                }
              : null,
            replyCount: Math.max(0, (topic.posts?.length || 1) - 1),
            lastPostAt: lastPost?.createdAt?.toISOString() || topic.createdAt?.toISOString() || new Date(0).toISOString(),
            lastPostAuthor: lastPost?.author
              ? {
                  id: String(lastPost.author.id),
                  fullName: lastPost.author.fullName || `Üye #${lastPost.author.id}`,
                }
              : null,
          };
        }),
      };
    }),

  getTopicDetails: publicProcedure
    .input(z.object({
      slug: z.string().min(1),
    }))
    .query(async ({ input }) => {
      const topic = await db.query.forumTopics.findFirst({
        where: eq(schema.forumTopics.slug, input.slug),
        with: {
          category: true,
          author: { columns: { id: true, fullName: true, role: true } },
          posts: {
            with: {
              author: { columns: { id: true, fullName: true, role: true } },
            },
            orderBy: (table, { asc }) => [asc(table.createdAt)],
          },
        },
      });

      if (!topic) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Konu bulunamadı.',
        });
      }

      await db.update(schema.forumTopics)
        .set({ viewCount: (topic.viewCount || 0) + 1 })
        .where(eq(schema.forumTopics.id, topic.id));

      return {
        topic: {
          id: String(topic.id),
          title: topic.title,
          slug: topic.slug,
          viewCount: (topic.viewCount || 0) + 1,
          isLocked: Boolean(topic.isLocked),
          createdAt: topic.createdAt?.toISOString() || new Date(0).toISOString(),
          author: topic.author
            ? {
                id: String(topic.author.id),
                fullName: topic.author.fullName || `Üye #${topic.author.id}`,
              }
            : null,
          category: {
            id: String(topic.category.id),
            name: topic.category.name,
            slug: topic.category.slug,
          },
        },
        posts: topic.posts.map((post) => ({
          id: String(post.id),
          content: post.content,
          createdAt: post.createdAt?.toISOString() || new Date(0).toISOString(),
          author: post.author
            ? {
                id: String(post.author.id),
                fullName: post.author.fullName || `Üye #${post.author.id}`,
              }
            : null,
        })),
      };
    }),

  createTopic: protectedProcedure
    .input(z.object({
      categoryId: z.number(),
      title: z.string().min(5).max(160),
      content: z.string().min(10).max(10000),
    }))
    .mutation(async ({ ctx, input }) => {
      const category = await db.query.forumCategories.findFirst({
        where: eq(schema.forumCategories.id, input.categoryId),
      });

      if (!category) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Seçilen kategori bulunamadı.',
        });
      }

      const slug = await buildUniqueTopicSlug(input.title);
      const [topic] = await db.insert(schema.forumTopics).values({
        categoryId: category.id,
        authorId: ctx.user.id,
        title: input.title.trim(),
        slug,
      }).returning();

      await db.insert(schema.forumPosts).values({
        topicId: topic.id,
        authorId: ctx.user.id,
        content: input.content.trim(),
      });

      return {
        id: String(topic.id),
        slug: topic.slug,
      };
    }),

  addPost: protectedProcedure
    .input(z.object({
      topicId: z.number(),
      content: z.string().min(2).max(10000),
    }))
    .mutation(async ({ ctx, input }) => {
      const topic = await db.query.forumTopics.findFirst({
        where: eq(schema.forumTopics.id, input.topicId),
      });

      if (!topic) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Konu bulunamadı.',
        });
      }

      if (topic.isLocked) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Bu konu yeni cevaplara kapalı.',
        });
      }

      const [post] = await db.insert(schema.forumPosts).values({
        topicId: topic.id,
        authorId: ctx.user.id,
        content: input.content.trim(),
      }).returning();

      return {
        id: String(post.id),
        topicId: String(post.topicId),
        content: post.content,
        createdAt: post.createdAt?.toISOString() || new Date(0).toISOString(),
      };
    }),

  getPosts: publicProcedure.query(async () => {
    const posts = await db.query.forumPosts.findMany({
      limit: 20,
      with: {
        topic: true,
        author: { columns: { id: true, fullName: true, role: true } },
      },
      orderBy: (table, { desc }) => [desc(table.createdAt)],
    });

    return posts.map((post) => ({
      id: String(post.id),
      title: post.topic?.title || 'Başlıksız konu',
      content: post.content,
      category: post.topicId ? String(post.topicId) : '',
      author: post.author?.fullName || 'Anonim',
      createdAt: post.createdAt?.toISOString() || new Date(0).toISOString(),
    }));
  }),

  deletePost: protectedProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const post = await db.query.forumPosts.findFirst({
        where: eq(schema.forumPosts.id, input.id),
      });

      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Mesaj bulunamadı.',
        });
      }

      if (post.authorId !== ctx.user.id && ctx.user.role !== 'admin') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Bu mesajı silme yetkiniz yok.',
        });
      }

      await db.delete(schema.forumPosts).where(eq(schema.forumPosts.id, input.id));

      return { success: true };
    }),
});
