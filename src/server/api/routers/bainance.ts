import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";
import { OHLCVSchema } from '@/types/types';


export const binanceRouter = createTRPCRouter({
    getOHLCV: publicProcedure
      .input(z.object({
        symbol: z.string(),
        interval: z.string(),
        limit: z.number().optional(),
      }))
      .query(async ({ input }) => {
        const { symbol, interval, limit } = input;
        const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}${limit ? `&limit=${limit}` : ''}`);
        const data = await response.json();
        return z.array(OHLCVSchema).parse(data);
      }),
  });