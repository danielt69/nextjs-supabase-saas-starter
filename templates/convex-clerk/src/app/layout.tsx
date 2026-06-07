import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { getClerkPublishableKey } from "@/lib/env";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next.js + Convex + Clerk SaaS Starter",
  description:
    "A production-style SaaS starter: Clerk auth, multi-tenant Convex data, and BYOK LLM integration.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // `publishableKey` is passed explicitly with a build-safe fallback so a
    // no-secrets build never throws. At runtime your real key is used.
    <ClerkProvider publishableKey={getClerkPublishableKey()}>
      <html lang="en">
        <body className="min-h-screen antialiased">
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
