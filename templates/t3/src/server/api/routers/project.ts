import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const projectRouter = createTRPCRouter({
  list: protectedProcedure.query(({ ctx }) =>
    ctx.db.project.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { createdAt: "desc" },
    })
  ),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required."),
        description: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) =>
      ctx.db.project.create({
        data: {
          name: input.name.trim(),
          description: input.description?.trim() || null,
          userId: ctx.session.user.id,
        },
      })
    ),

  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // deleteMany with the userId in the filter enforces tenancy: a user can
      // only ever delete their own rows.
      await ctx.db.project.deleteMany({
        where: { id: input.id, userId: ctx.session.user.id },
      });
    }),
});
