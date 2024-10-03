import { postRouter } from "@/server/api/routers/post";
import { binanceRouter } from "@/server/api/routers/bainance";
import { stratRouter } from "@/server/api/routers/strats";
import { userExtraDataRouter } from "@/server/api/routers/userExtraData";
import { emailRouter } from "@/server/api/routers/email";


import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { subscriptionRouter } from "./routers/subscription";
import { queriesRouter } from "./routers/queries";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  binance: binanceRouter,
  strats: stratRouter,
  userExtraData: userExtraDataRouter,
  email: emailRouter,
  subscription: subscriptionRouter,
  queries: queriesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
