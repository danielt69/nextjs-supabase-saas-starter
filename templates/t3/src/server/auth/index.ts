import NextAuth from "next-auth";
import { cache } from "react";
import { authConfig } from "./config";

const { auth: uncachedAuth, handlers, signIn, signOut } = NextAuth(authConfig);

// Cache `auth()` per request so multiple callers (layout, tRPC context) share
// one lookup.
const auth = cache(uncachedAuth);

export { auth, handlers, signIn, signOut };
