import { z } from 'zod';
import { createTRPCRouter, adminProcedure } from '../trpc';
import { sendMail } from '@/utils/send-mail';

export const emailRouter = createTRPCRouter({
  sendIndividualEmail: adminProcedure
    .input(z.object({
      from: z.string(),
      userId: z.string(),
      subject: z.string(),
      text: z.string(),
      html: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, input.userId),
      });

      if (!user?.email) {
        throw new Error('User not found or email not available');
      }

      await sendMail({
        from: input.from,
        to: user.email,
        subject: input.subject,
        text: input.text,
        html: input.html,
      });

      return { success: true };
    }),

  sendCampaign: adminProcedure
    .input(z.object({
        from: z.string(),
        userId: z.string().array(),
        subject: z.string(),
        text: z.string(),
        html: z.string(),
      }))
    .mutation(async ({ ctx, input }) => {
      const users = await ctx.db.query.users.findMany({
        where: (users, { inArray }) => inArray(users.id, input.userId),
      });

      for (const user of users) {
        if (user.email) {
          await sendMail({
            from: input.from,
            to: user.email,
            subject: input.subject,
            text: input.text,
            html: input.html,
          });
        }
      }

      return { success: true };
    }),

  getUsers: adminProcedure.query(async ({ ctx }) => {
      return ctx.db.query.users.findMany();
     
    }),
});