# React + Convex + Clerk SaaS Starter

A production-style **Vite + React single-page app** with:

- **Clerk** authentication (`@clerk/clerk-react`) with route guards and a hosted account UI
- **Convex** reactive database with multi-tenant, identity-scoped queries/mutations
- **BYOK LLM** — users store their own provider API key, encrypted at rest with
  AES-256-GCM inside a Convex **Node action**, decrypted only server-side

Same product surface as the other starters in this repo: a landing page, a gated
dashboard with a per-user `projects` list, and a settings page for managing an
encrypted provider key plus an LLM demo.

## Stack

| Concern | Choice |
| --- | --- |
| Build / dev | Vite 6 + `@vitejs/plugin-react` |
| Routing | `react-router-dom` v7 |
| Auth | Clerk (`@clerk/clerk-react`) |
| Data | Convex (`convex/react`, `ConvexProviderWithClerk`) |
| LLM | OpenAI-compatible `/v1/chat/completions` via a Convex Node action |
| Styling | Tailwind CSS |

## Quick start

```bash
npm install
cp .env.example .env.local

# 1. Provision Convex (writes VITE_CONVEX_URL into .env.local)
npx convex dev

# 2. In the Clerk dashboard:
#    - copy the Publishable key into VITE_CLERK_PUBLISHABLE_KEY
#    - create a JWT template named "convex"
#    - copy your Frontend API URL

# 3. In the Convex dashboard (Settings > Environment Variables) set:
#    - CLERK_JWT_ISSUER_DOMAIN = your Clerk Frontend API URL
#    - BYOK_ENCRYPTION_KEY     = openssl rand -base64 32

# 4. Run the app (and keep `npx convex dev` running in another terminal)
npm run dev
```

## How auth + data fit together

`src/main.tsx` wraps the app in `ClerkProvider` → `ConvexProviderWithClerk`, so
every Convex call carries the signed-in user's Clerk token. On the backend,
`convex/auth.config.ts` tells Convex to trust that token, and every function in
`convex/projects.ts` / `convex/providerKeys.ts` calls
`ctx.auth.getUserIdentity()` and scopes data by the Clerk `subject`. There is no
row-level security in Convex — tenancy is enforced in code, on every call.

## BYOK encryption

The provider key never reaches the browser in plaintext after it's saved:

1. `src/components/ProviderKeyForm.tsx` sends the raw key to the
   `llm.saveKey` **action**.
2. `convex/llm.ts` (a `"use node"` action) encrypts it with AES-256-GCM using
   `BYOK_ENCRYPTION_KEY` and stores the ciphertext via an internal mutation.
3. `llm.complete` reads the ciphertext via an internal query, decrypts it, and
   calls the model. The plaintext only ever exists inside the action.

`has` (a public query) returns a boolean so the UI can show status without ever
exposing the ciphertext.

## Generated Convex types

`convex/_generated/` is committed so the template type-checks and builds without
a live deployment. The `prebuild`/`pretypecheck`/`predev` scripts regenerate it
from `convex/schema.ts` via `scripts/gen-convex.cjs`. Once you run
`npx convex dev`, Convex keeps these files up to date.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run dev:backend` | `convex dev` (run alongside `npm run dev`) |
| `npm run build` | Type-check + production build |
| `npm run typecheck` | `tsc --noEmit` |

## Deploy

Deploy the static build (`npm run build` → `dist/`) to any static host (Vercel,
Netlify, Cloudflare Pages). Run `npx convex deploy` for the backend and set the
production env vars (`VITE_CONVEX_URL`, `VITE_CLERK_PUBLISHABLE_KEY`, plus the
Convex dashboard secrets).
