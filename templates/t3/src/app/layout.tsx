import "./globals.css";
import type { Metadata } from "next";
import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
  title: "T3 SaaS Starter",
  description:
    "Next.js App Router + tRPC + Prisma + NextAuth, with a BYOK LLM demo.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
