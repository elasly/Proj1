import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { sql } from "drizzle-orm";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { indicator, strategies } from "@/server/db/schema";

export const queriesRouter = createTRPCRouter({

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(posts).values({
        name: input.name,
        createdById: ctx.session.user.id,
      });
    }),

  getIndGroups: publicProcedure.query(async ({ ctx }) => {
    const groups = await ctx.db
    .selectDistinctOn([indicator.group])
    .from(indicator).orderBy(indicator.group);
    
    return groups.map(group => ({ ...group, group: group.group?.trim() }));
}),
    

    getIndicatorsOfGroup: publicProcedure
    .input(z.object({ group: z.string() }))
    .query(async ({ ctx, input }) => {
      const trimmedGroup = input.group.trim();
      
      const Indicators = await ctx.db
        .selectDistinct({ name: indicator.name })
        .from(indicator)
        .where(
          sql`TRIM(${indicator.group}) = ${trimmedGroup}`
        );
      
      return Indicators;
    }),
 
      getIndicatorsDetails: publicProcedure
      .input(z.object({ name: z.string() }))
      .query(async ({ ctx, input }) => {
      const IndicatorDetails = await ctx.db.select().from(indicator).where(eq(indicator.name, input.name.trim()));
      return IndicatorDetails;
    }),

    getUserStrategies: protectedProcedure
    .query(async ({ ctx }) => {
      const userStrategies = await ctx.db
        .select()
        .from(strategies)
        .where(eq(strategies.user_id, ctx.session.user.id));
      
      return userStrategies;
    }),

    deleteStrategy: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(strategies).where(eq(strategies.id, input.id));
    }),

    saveStrategy: protectedProcedure
  .input(z.array(z.object({
    name: z.string(),
    description: z.string(),
    entryRules: z.array(z.any()),
    exitRules: z.array(z.any()),
    riskManagement: z.array(z.any())
  })))
  .mutation(async ({ ctx, input }) => {
    console.log(`Saving strategy: ${JSON.stringify(input)}`);
    for (const strategy of input) {
    const { name, description, entryRules, exitRules, riskManagement } = strategy;
    
    const userId = ctx.session.user.id;
      
    try {
      // Check if strategy with this name already exists for the user
      const existingStrategy = await ctx.db.select()
        .from(strategies)
        .where(and(
          eq(strategies.strat_name, name),
          eq(strategies.user_id, userId)
        ))
        .execute()
        .then((result) => result[0])
        .catch((error) => {
          console.error("Database query error:", error);
          throw new Error("Failed to check for existing strategy");
        });

      if (existingStrategy)  {
        // Update existing strategy
        await ctx.db.update(strategies).set({
          description: description,
          entryRules: entryRules,
          exitRules: exitRules,
          riskManagement: riskManagement,
          updatedAt: new Date()
        }).where(eq(strategies.id, existingStrategy.id));

        return existingStrategy;
      } else {
        // Insert new strategy
        const [newStrategy] = await ctx.db.insert(strategies).values({
          strat_name: name,
          description: description,
          user_id: userId,
          entryRules: entryRules,
          exitRules: exitRules,
          riskManagement: riskManagement,
          createdAt: new Date(),
          updatedAt: new Date()
        }).returning();

        return newStrategy;
      }
    } catch (error) {
      console.error("Error saving strategy:", error);
      throw new Error("Failed to save strategy");
    }
  }
}),
// help me create the query/procedure to update the strategy 
  updateStrategy: protectedProcedure
    .input(z.object({
      id: z.number(),
      strat_name: z.string().optional(),
      description: z.string().optional(),
      entryRules: z.array(z.any()).optional(),
      exitRules: z.array(z.any()).optional(),
      riskManagement: z.array(z.any()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      const userId = ctx.session.user.id;

      try {
        // Check if the strategy exists and belongs to the user
        const existingStrategy = await ctx.db.select()
          .from(strategies)
          .where(and(
            eq(strategies.id, id),
            eq(strategies.user_id, userId)
          ))
          .execute()
          .then((result) => result[0]);

        if (!existingStrategy) {
          throw new Error("Strategy not found or you don't have permission to update it");
        }

        // Update the strategy
        const [updatedStrategy] = await ctx.db.update(strategies)
          .set({
            ...updateData,
            updatedAt: new Date()
          })
          .where(eq(strategies.id, id))
          .returning();

        return updatedStrategy;
      } catch (error) {
        console.error("Error updating strategy:", error);
        throw new Error("Failed to update strategy");
      }
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),   
});