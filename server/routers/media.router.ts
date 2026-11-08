 
import { router, protectedProcedure } from '../router.core';
import { z } from 'zod';
import { db } from '@/drizzle/db';
import * as schema from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { TIER_LIMITS, type TierLevel } from '../lib/tiers';

/**
 * AI İşleme Simülatörü / API Wrapper
 * Gerçekte burada Photoroom, Picsart veya Cloudinary API çağrısı yapılacak.
 */
async function processImageAI(imageUrl: string, action: 'remove_bg' | 'retouch' | 'mask_face') {
    // Simüle edilmiş AI işlem süresi
    await new Promise(resolve => setTimeout(resolve, 1500));
    // İşlem sonrası yeni URL döner (şimdilik orijinali modifiye edilmiş gibi simüle ediyoruz)
    return `${imageUrl}?ai_processed=${action}_${Date.now()}`;
}

export const mediaRouter = router({
    /**
     * Register a newly uploaded photo in the database
     */
    registerPhoto: protectedProcedure
        .input(z.object({
            url: z.string().url(),
            profileId: z.number().optional()
        }))
        .mutation(async ({ input, ctx }) => {
            // Sahiplik ve Tier (Üyelik) sınırı kontrolü
            const profile = await db.query.escortProfiles.findFirst({
                where: eq(schema.escortProfiles.userId, ctx.user.id),
                with: { photos: true }
            });
            if (!profile) {
                throw new TRPCError({ code: 'FORBIDDEN', message: 'Escort profiliniz bulunamadı.' });
            }

            // Üyelik Seviyesine (Tier) Göre Kısıtlamalar — escort.router TIER_LIMITS ile senkronize
            const tierKey = (profile.tier ?? 'free') as TierLevel;
            const currentLimit = (TIER_LIMITS[tierKey] ?? TIER_LIMITS.free).photoLimit;
            const photoCount = profile.photos.length;
            if (photoCount >= currentLimit) {
                throw new TRPCError({
                  code: 'FORBIDDEN',
                  message: `${profile.tier?.toUpperCase() ?? 'FREE'} üyeler en fazla ${currentLimit} fotoğraf yükleyebilir. Daha fazlası için üyeliğinizi yükseltin.`
                });
            }

            const [photo] = await db.insert(schema.escortPhotos).values({
                url: input.url,
                profileId: profile.id,
                isFaceHidden: false,
                privacyLevel: 'public'
            }).returning();

            return photo;
        }),

    /**
     * Apply AI Retouch / Background Removal
     */
    applyAIEffect: protectedProcedure
        .input(z.object({
            photoId: z.number(),
            effect: z.enum(['remove_bg', 'retouch'])
        }))
        .mutation(async ({ input, ctx }) => {
            const [photo] = await db.select().from(schema.escortPhotos).where(eq(schema.escortPhotos.id, input.photoId));
            if (!photo) throw new TRPCError({ code: 'NOT_FOUND', message: 'Fotoğraf bulunamadı.' });

            // Sahiplik kontrolü
            const profile = await db.query.escortProfiles.findFirst({
                where: eq(schema.escortProfiles.id, photo.profileId!)
            });
            if (!profile || profile.userId !== ctx.user.id) {
                throw new TRPCError({ code: 'FORBIDDEN', message: 'Bu fotoğrafı düzenleme yetkiniz yok.' });
            }

            const processedUrl = await processImageAI(photo.url, input.effect);

            await db.update(schema.escortPhotos)
                .set({ url: processedUrl })
                .where(eq(schema.escortPhotos.id, input.photoId));

            return { success: true, newUrl: processedUrl };
        }),

    /**
     * Toggle Face Mask & Privacy
     * Yüzü gizler/açar ve maskelenmiş versiyonu oluşturur
     */
    toggleFacePrivacy: protectedProcedure
        .input(z.object({
            photoId: z.number(),
            isHidden: z.boolean(),
            maskStyle: z.string().optional()
        }))
        .mutation(async ({ input, ctx }) => {
            const [photo] = await db.select().from(schema.escortPhotos).where(eq(schema.escortPhotos.id, input.photoId));
            if (!photo) throw new TRPCError({ code: 'NOT_FOUND' });

            // Sahiplik kontrolü
            const profile = await db.query.escortProfiles.findFirst({
                where: eq(schema.escortProfiles.id, photo.profileId!)
            });
            if (!profile || profile.userId !== ctx.user.id) {
                throw new TRPCError({ code: 'FORBIDDEN', message: 'Bu fotoğrafı düzenleme yetkiniz yok.' });
            }

            let maskedUrl = photo.maskedUrl;
            if (input.isHidden && !maskedUrl) {
                maskedUrl = await processImageAI(photo.url, 'mask_face');
            }

            await db.update(schema.escortPhotos)
                .set({
                    isFaceHidden: input.isHidden,
                    maskedUrl: input.isHidden ? (maskedUrl ?? null) : null
                })
                .where(eq(schema.escortPhotos.id, input.photoId));

            return { success: true, isHidden: input.isHidden, maskedUrl };
        }),

    /**
     * Set Photo Privacy Level
     * Orijinal hali kimlere görünecek?
     */
    setPrivacyLevel: protectedProcedure
        .input(z.object({
            photoId: z.number(),
            level: z.enum(['public', 'members', 'gold'])
        }))
        .mutation(async ({ input, ctx }) => {
            // Sahiplik kontrolü
            const [photo] = await db.select().from(schema.escortPhotos).where(eq(schema.escortPhotos.id, input.photoId));
            if (!photo) throw new TRPCError({ code: 'NOT_FOUND' });

            const profile = await db.query.escortProfiles.findFirst({
                where: eq(schema.escortProfiles.id, photo.profileId!)
            });
            if (!profile || profile.userId !== ctx.user.id) {
                throw new TRPCError({ code: 'FORBIDDEN', message: 'Bu fotoğrafı düzenleme yetkiniz yok.' });
            }

            await db.update(schema.escortPhotos)
                .set({ privacyLevel: input.level })
                .where(eq(schema.escortPhotos.id, input.photoId));

            return { success: true };
        })
});





