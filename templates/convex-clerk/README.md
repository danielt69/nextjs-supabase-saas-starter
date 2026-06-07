# Next.js + Convex + Clerk SaaS Starter

A clean, production-style SaaS starter built on the **Next.js App Router**, **Convex** (reactive database + serverless functions), and **Clerk** (authentication). It demonstrates the patterns most SaaS apps actually need: hosted auth, multi-tenant data with per-request authorization, and a **bring-your-own-key (BYOK)** LLM integration with secrets encrypted at rest.

Fork it, point it at a Convex deployment and a Clerk app, and you have a working foundation in minutes.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/danielt69/nextjs-supabase-saas-starter/tree/main/templates/convex-clerk&env=NEXT_PUBLIC_CONVEX_URL,NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,CLERK_SECRET_KEY,CLERK_JWT_ISSUER_DOMAIN,BYOK_ENCRYPTION_KEY&envDescription=Convex%20URL%2C%20Clerk%20keys%2C%20and%20a%20BYOK%20encryption%20secret&envLink=https://github.com/danielt69/nextjs-supabase-saas-starter/blob/main/templates/convex-clerk/.env.example)

> When deploying on Vercel, set the project's **Root Directory** to `templates/convex-clerk`.

## Features

- **Clerk Auth** — email + social sign-in, a hosted account UI (`<SignIn />`, `<SignUp />`, `<UserButton />`), and route gating via `clerkMiddleware` in `proxy.ts`. `auth()` / `currentUser()` are used server-side; `useAuth` powers the Convex client.
- **Multi-tenant Convex** — `orgs` / `orgMembers` / `projects` documents. Convex has no SQL joins or row-level security, so tenancy is enforced explicitly in **every** query and mutation against the authenticated Clerk identity (`ctx.auth.getUserIdentity()`). A workspace is created lazily on the user's first project. The projects list is **reactive** — it updates live via `useQuery`.
- **BYOK LLM** — a settings page where a user stores their own provider API key, **encrypted at rest with AES-256-GCM** before it is written to Convex. A demo feature decrypts it server-side only and calls any OpenAI-compatible model. The plaintext never returns to the browser.
- **Type-safe** — TypeScript end-to-end with Convex's generated types (`convex/_generated`).
- **Build-safe env** — clients are lazily initialized with placeholder-safe fallbacks, so `npm run build` and CI pass **without any real secrets present**.
- **CI** — GitHub Actions runs typecheck + build on every push and PR.

## Architecture

```
                         ┌─────────────────────────────┐
  Browser  ──request──▶  │  proxy.ts (clerkMiddleware)  │  authenticate,
                         │  gate /dashboard, /settings  │  gate routes
                         └──────────────┬──────────────┘
                                        │
                  ┌─────────────────────▼─────────────────────┐
                  │            Next.js App Router              │
                  │                                            │
                  │  Server Components / Actions / Routes      │
                  │   └─ @clerk/nextjs/server  auth()          │
                  │   └─ convex/nextjs fetchQuery/fetchMutation│
                  │        (Clerk "convex" JWT as bearer token)│
                  │  Client Components                         │
                  │   └─ convex/react  useQuery/useMutation    │
                  │        (ConvexProviderWithClerk)           │
                  └───────────┬───────────────────┬───────────┘
                              │ JWT               │ JWT
                  ┌───────────▼──────┐  ┌─────────▼───────────┐
                  │      Clerk       │  │       Convex        │
                  │  users, sessions │  │  orgs · orgMembers  │
                  │  social + email  │  │  projects           │
                  │  JWT template    │  │  providerKeys       │
                  │   "convex"       │  │  (AES-256-GCM blob)  │
                  └──────────────────┘  └─────────────────────┘
```

Auth flow: Clerk issues a JWT from the **"convex"** template; `ConvexProviderWithClerk` attaches it to client calls, and server code attaches it via `getToken({ template: "convex" })`. Convex validates it against `convex/auth.config.ts` (`CLERK_JWT_ISSUER_DOMAIN`) and exposes the identity as `ctx.auth.getUserIdentity()`.

BYOK key flow: plaintext key → `src/lib/crypto.ts` AES-256-GCM encrypt (Next.js server) → stored as ciphertext in Convex `providerKeys` → decrypted **only** server-side when calling `src/lib/llm.ts`. The plaintext never returns to the browser.

## Quick start

```bash
git clone https://github.com/danielt69/nextjs-supabase-saas-starter.git
cd nextjs-supabase-saas-starter/templates/convex-clerk
cp .env.example .env.local   # fill in your values (see below)
npm install
npx convex dev               # in one terminal: provisions Convex + writes NEXT_PUBLIC_CONVEX_URL
npm run dev                  # in another: http://localhost:3000
```

The app builds and runs even before you add real values — protected pages show a friendly "configure your env" notice instead of crashing.

## Set up Convex + Clerk

1. **Convex:** run `npx convex dev`. It creates a deployment, writes `NEXT_PUBLIC_CONVEX_URL` to `.env.local`, and regenerates `convex/_generated`.
2. **Clerk:** create an app at [clerk.com](https://clerk.com). Copy the **Publishable key** and **Secret key** into `.env.local`. Enable email and at least one social provider under **User & Authentication**.
3. **JWT template:** in the Clerk dashboard, go to **JWT Templates → New template → Convex**. Name it exactly `convex`. Copy the **Issuer** (your Clerk Frontend API URL) into `CLERK_JWT_ISSUER_DOMAIN`.
4. **Tell Convex about Clerk:** in the Convex dashboard (**Settings → Environment Variables**), set `CLERK_JWT_ISSUER_DOMAIN` to the same value. `convex/auth.config.ts` reads it to validate tokens.
5. **Encryption secret:** generate one for `BYOK_ENCRYPTION_KEY`:
   ```bash
   openssl rand -base64 32
   ```
6. `npm run dev`, sign up, and you'll land on a workspace with a live `projects` list and a BYOK settings page.

## Environment variables

Every variable is documented in [`.env.example`](./.env.example). Copy it to `.env.local`.

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_CONVEX_URL` | yes | Convex deployment URL (public). Written by `npx convex dev`. |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | yes | Clerk publishable key (public). |
| `CLERK_SECRET_KEY` | server | Clerk secret key. **Server-only.** |
| `CLERK_JWT_ISSUER_DOMAIN` | yes | Clerk Frontend API URL. Used by Convex to validate tokens. Also set it in the Convex dashboard. |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | optional | Defaults to `/sign-in` (ships in the app). |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | optional | Defaults to `/sign-up` (ships in the app). |
| `BYOK_ENCRYPTION_KEY` | yes | Secret used to derive the AES-256-GCM key for encrypting BYOK provider keys. Generate with `openssl rand -base64 32`. |

> **Secret hygiene:** only `.env.example` (placeholders) is committed. `.env*` files are git-ignored. Never commit real keys.

## Project structure

```
convex/
  schema.ts               orgs · orgMembers · projects · providerKeys
  auth.config.ts          Clerk token validation (CLERK_JWT_ISSUER_DOMAIN)
  _helpers.ts             requireIdentity / getMyOrgId (tenancy guards)
  projects.ts             multi-tenant queries + mutations
  providerKeys.ts         BYOK ciphertext storage (per user)
  _generated/             Convex codegen (committed so it builds out of the box)
src/
  app/
    layout.tsx            ClerkProvider + ConvexClientProvider
    page.tsx              Landing page
    sign-in/ · sign-up/   Clerk hosted auth (catch-all routes)
    (dashboard)/
      layout.tsx          Auth-gated shell + UserButton
      dashboard/          Projects (reactive, multi-tenant)
      settings/           BYOK key management + LLM demo + server actions
  components/             ConvexClientProvider, Projects, ProviderKeyForm, LlmDemo
  lib/
    env.ts               Build-safe env access
    crypto.ts            AES-256-GCM encrypt/decrypt for BYOK
    llm.ts               Generic OpenAI-compatible LLM call
    convexServer.ts      Clerk "convex" token for server-side Convex calls
  proxy.ts               Next.js 16 proxy: clerkMiddleware + route gating
scripts/gen-convex.cjs   Offline regenerator for convex/_generated
.github/workflows/ci.yml Typecheck + build (at the repo root)
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js dev server |
| `npm run dev:backend` | `convex dev` — watch + push Convex functions |
| `npm run build` | Production build (passes without real secrets) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run codegen` | `convex codegen` (regenerate `convex/_generated`) |

> `convex/_generated` is committed so the template type-checks and builds immediately after `git clone` + `npm install`, before you run `npx convex dev`. Once you connect a deployment, `npx convex dev` keeps it in sync.

## License

[MIT](../../LICENSE)
