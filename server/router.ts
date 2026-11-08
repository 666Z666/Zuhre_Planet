import { router, publicProcedure, protectedProcedure, adminProcedure } from './router.core';
import * as schema from '@/drizzle/schema';

// Import Sub-Routers
import { authRouter } from './routers/auth.router';
import { escortRouter } from './routers/escort.router';
import { appointmentRouter } from './routers/appointment.router';
import { adminRouter } from './routers/admin.router';
// import { adminActionsRouter } from './routers/admin_actions.router'; // Merged into adminRouter
import { forumRouter } from './routers/forum.router';
import { chatRouter } from './routers/chat.router';
import { messagingRouter } from './routers/messaging.router';
import { mediaRouter } from './routers/media.router';
import { verificationRouter } from './routers/verification.router';
import { moderationRouter } from './routers/moderation.router';
import { subscriptionRouter } from './routers/subscription.router';

import { loyaltyRouter } from './routers/loyalty.router';
import { contactRouter } from './routers/contact.router';
import { safetyRouter } from './routers/safety.router';

export { router, publicProcedure, protectedProcedure, adminProcedure };

// 4. Main Application Router
export const appRouter = router({
  auth: authRouter,
  escort: escortRouter,
  appointment: appointmentRouter,
  admin: adminRouter,
  // adminActions: adminActionsRouter, // Merged into adminRouter
  forum: forumRouter,
  chat: chatRouter,
  messaging: messagingRouter,
  media: mediaRouter,
  verification: verificationRouter,
  moderation: moderationRouter,
  subscription: subscriptionRouter,
  loyalty: loyaltyRouter,
  contact: contactRouter,
  safety: safetyRouter,
  health: publicProcedure.query(async ({ ctx }) => {
    try {
      await ctx.db
        .select({ id: schema.escortProfiles.id })
        .from(schema.escortProfiles)
        .limit(1);
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: 'connected',
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }),
});

export type AppRouter = typeof appRouter;
