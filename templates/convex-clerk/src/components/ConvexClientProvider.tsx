"use client";

import { ReactNode } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";
import { getConvexUrl } from "@/lib/env";

// Build-safe: falls back to a placeholder URL when NEXT_PUBLIC_CONVEX_URL is
// absent, so `next build` succeeds without real secrets. Client construction is
// cheap and the client is only exercised at runtime once a user is signed in.
const convex = new ConvexReactClient(getConvexUrl());

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}
