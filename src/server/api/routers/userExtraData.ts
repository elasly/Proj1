import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { extra_data } from "@/server/db/schema";

export const userExtraDataRouter = createTRPCRouter({
  saveExtraData: protectedProcedure
    .input(
      z.object({
        phoneNumber: z.string().optional(),
        birthdate: z.date().optional(),
        occupation: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { phoneNumber, birthdate, occupation } = input;
      const userId = ctx.session.user.id;

      await ctx.db.insert(extra_data).values({
        userId,
        phoneNumber,
        birthdate,
        occupation,
      }).onConflictDoUpdate({
        target: extra_data.userId,
        set: {
          phoneNumber,
          birthdate,
          occupation,
          updatedAt: new Date(),
        },
      });

      return { success: true };
    }),
    getUserExtraData: protectedProcedure.query(async ({ ctx }) => {
      const userId = ctx.session.user.id;

      const extraData = await ctx.db.select().from(extra_data).where({
        userId,
      }).limit(1);

      return extraData;
    }),
});