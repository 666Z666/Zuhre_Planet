/**
 * tRPC Core Configuration Module (trpc.ts)
 * 
 * Core tRPC initialization and procedure definitions for backend API setup.
 * Provides the foundation for all tRPC router definitions and API procedures.
 * 
 * @module lib/_core/trpc
 * @category Library - Core
 */

import { initTRPC } from '@trpc/server';

// Define the context type
export interface TRPCContext {
  req?: unknown;
  res?: unknown;
  user?: {
    id: number;
    email: string;
    name?: string;
    role: 'admin' | 'escort' | 'customer'; // Fixed role names (client -> customer)
  };
}

export const t = initTRPC.context<TRPCContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  // Authentication check middleware
  if (!ctx.user) {
    throw new Error('UNAUTHORIZED');
  }
  return next({ ctx });
});

export const middleware = t.middleware;
export const mergeRouters = t.mergeRouters;
