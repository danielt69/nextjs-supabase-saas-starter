import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { decryptSecret } from "@/lib/crypto";
import { callLlm } from "@/lib/llm";

export const llmRouter = createTRPCRouter({
  complete: protectedProcedure
    .input(z.object({ prompt: z.string().min(1, "Prompt is required.") }))
    .mutation(async ({ ctx, input }) => {
      const row = await ctx.db.providerKey.findUnique({
        where: { userId: ctx.session.user.id },
      });
      if (!row) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No provider key saved. Add one on the Settings page.",
        });
      }

      const apiKey = decryptSecret(row.encryptedKey);
      const text = await callLlm({
        apiKey,
        prompt: input.prompt,
        baseUrl: process.env.LLM_BASE_URL,
        model: process.env.LLM_MODEL,
      });
      return { text };
    }),
});
