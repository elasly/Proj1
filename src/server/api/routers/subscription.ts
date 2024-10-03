import { z } from 'zod';
import { adminProcedure, createTRPCRouter } from '../trpc';
import { checkFeatureAccess } from '@/utils/checkFeatureAccess';

export const subscriptionRouter = createTRPCRouter({
  checkFeatureAccess: adminProcedure
    .input(z.object({ featureName: z.string() }))
    .query(async ({ ctx, input }) => {
      return checkFeatureAccess(ctx.session.user.id, input.featureName);
    }),

    createTier: adminProcedure
      .input(z.object({
        name: z.string().min(1, 'Name is required'),
        price: z.number().min(0, 'Price must be non-negative'),
        features: z.record(z.boolean()),
      }))
      .mutation(async ({ ctx, input }) => {
        // Implement the logic to create a new subscription tier
        return { success: true };
      }),

    getTiers: adminProcedure.query(async ({ ctx }) => {
      // Implement the logic to fetch all subscription tiers
      return { success: true };
    }),

    updateTier: adminProcedure
      .input(z.object({
        id: z.string(),
        name: z.string().min(1, 'Name is required'),
        price: z.number().min(0, 'Price must be non-negative'),
        features: z.record(z.boolean()),
      }))
      .mutation(async ({ ctx, input }) => {
        // Implement the logic to update an existing subscription tier
        return { success: true };
      }),

  // Add more subscription-related procedures here
});