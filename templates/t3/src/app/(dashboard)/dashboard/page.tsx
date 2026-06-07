import { Projects } from "@/components/Projects";
import { LlmDemo } from "@/components/LlmDemo";

export default function DashboardPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8">
      <section>
        <h1 className="text-2xl font-bold">Projects</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Scoped to your account via tRPC&apos;s protectedProcedure and stored
          in Prisma.
        </p>
      </section>
      <Projects />
      <LlmDemo />
    </div>
  );
}
