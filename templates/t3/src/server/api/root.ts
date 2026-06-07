import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { projectRouter } from "@/server/api/routers/project";
import { providerKeyRouter } from "@/server/api/routers/providerKey";
import { llmRouter } from "@/server/api/routers/llm";

export const appRouter = createTRPCRouter({
  project: projectRouter,
  providerKey: providerKeyRouter,
  llm: llmRouter,
});

export type AppRouter = typeof appRouter;

/**
 * Server-side caller, e.g. for use in React Server Components:
 *   const trpc = createCaller(await createTRPCContext({ headers: ... }))
 */
export const createCaller = createCallerFactory(appRouter);
