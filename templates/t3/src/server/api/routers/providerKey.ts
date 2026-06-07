import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { encryptSecret } from "@/lib/crypto";

export const providerKeyRouter = createTRPCRouter({
  status: protectedProcedure.query(async ({ ctx }) => {
    const row = await ctx.db.providerKey.findUnique({
      where: { userId: ctx.session.user.id },
    });
    return { hasKey: Boolean(row) };
  }),

  save: protectedProcedure
    .input(z.object({ apiKey: z.string().min(1, "API key is required.") }))
    .mutation(async ({ ctx, input }) => {
      // Encrypt server-side before persisting; plaintext never hits the DB.
      const encryptedKey = encryptSecret(input.apiKey.trim());
      await ctx.db.providerKey.upsert({
        where: { userId: ctx.session.user.id },
        create: { userId: ctx.session.user.id, encryptedKey },
        update: { encryptedKey },
      });
    }),

  remove: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.providerKey.deleteMany({
      where: { userId: ctx.session.user.id },
    });
  }),
});
