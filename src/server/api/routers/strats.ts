import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { strategies } from "@/server/db/schema";

 
export const stratRouter = createTRPCRouter({
    hello: publicProcedure
      .input(z.object({ text: z.string() }))
      .query(({ input }) => {
        return {
          greeting: `Hello ${input.text}`,
        };
      }),
  
    create: protectedProcedure
      .input(z.object({ name: z.string().min(1), description: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
        // simulate a slow db call
        await new Promise((resolve) => setTimeout(resolve, 1000));
  
        await ctx.db.insert(strategies).values({        
          strat_name: input.name,
          description: input.description,
          user_id: ctx.session.user.id,
        });
      }),
  
    getAll: protectedProcedure.query(({ ctx }) => {
      return ctx.db.query.strategies.findMany({
        orderBy: (strategies, { desc }) => [desc(strategies.user_id)],
      });
    }),

  });
  
  