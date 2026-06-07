# Next.js + Supabase SaaS Starter

A clean, production-style SaaS starter built on the **Next.js App Router** and **Supabase**. It demonstrates the patterns most SaaS apps actually need: cookie-based SSR auth, multi-tenant data protected by Row Level Security, and a **bring-your-own-key (BYOK)** LLM integration with secrets encrypted at rest.

Fork it, point it at a fresh Supabase project, and you have a working foundation in minutes.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/danielt69/nextjs-supabase-saas-starter/tree/main/templates/supabase-next&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY,BYOK_ENCRYPTION_KEY&envDescription=Supabase%20keys%20and%20a%20BYOK%20encryption%20secret&envLink=https://github.com/danielt69/nextjs-supabase-saas-starter/blob/main/templates/supabase-next/.env.example)

> When deploying on Vercel, set the project's **Root Directory** to `templates/supabase-next`.

## Features

- **Supabase Auth (SSR)** — email/password **and** Google OAuth via `@supabase/ssr`. Middleware refreshes the session on every request; Server Components read it; protected routes are gated.
- **Multi-tenant + RLS** — `orgs` / `org_members` / `projects` schema. A new workspace + owner membership is created automatically on signup. Every row is scoped by org membership through Row Level Security, so the public anon key can only ever touch authorized data.
- **BYOK LLM** — a settings page where a user stores their own provider API key, **encrypted at rest with AES-256-GCM** before it hits Postgres. A demo feature decrypts it server-side only and calls any OpenAI-compatible model.
- **Type-safe** — TypeScript end-to-end with hand-written DB types (swap in `supabase gen types` output).
- **Build-safe env** — clients are lazily initialized with placeholder-safe fallbacks, so `npm run build` and CI pass **without any real secrets present**.
- **CI** — GitHub Actions runs typecheck + build on every push and PR.

## Architecture

```
                         ┌─────────────────────────────┐
  Browser  ──request──▶  │  proxy.ts (Next 16 proxy)   │  refresh session,
                         │  (updateSession)            │  gate /dashboard,/settings
                         └──────────────┬──────────────┘
                                        │ cookies
                  ┌─────────────────────▼─────────────────────┐
                  │            Next.js App Router              │
                  │                                            │
                  │  Server Components / Actions / Routes      │
                  │   └─ lib/supabase/server.ts  (anon, RLS)   │
                  │   └─ lib/supabase/server.ts  (service key) │
                  │  Client Components                         │
                  │   └─ lib/supabase/client.ts  (browser)     │
                  └─────────────────────┬─────────────────────┘
                                        │ HTTPS (RLS enforced)
                  ┌─────────────────────▼─────────────────────┐
                  │                 Supabase                   │
                  │  Postgres + RLS:                           │
                  │   orgs · org_members · projects            │
                  │   provider_keys (AES-256-GCM ciphertext)   │
                  │  Auth (email/password + Google OAuth)      │
                  └────────────────────────────────────────────┘
```

BYOK key flow: plaintext key → `lib/crypto.ts` AES-256-GCM encrypt (server) → stored as ciphertext in `provider_keys` → decrypted **only** server-side when calling `lib/llm.ts`. The plaintext never returns to the browser.

## Quick start

```bash
git clone https://github.com/danielt69/nextjs-supabase-saas-starter.git
cd nextjs-supabase-saas-starter/templates/supabase-next
cp .env.example .env.local   # fill in your values (see below)
npm install
npm run dev                  # http://localhost:3000
```

The app builds and runs even before you add real Supabase values — protected pages show a friendly "configure your env" notice instead of crashing.

## Point it at a fresh Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. **Project Settings → API**: copy the Project URL, the `anon` key, and the `service_role` key into `.env.local`.
3. Apply the schema. Either run the SQL in `supabase/migrations/0001_init.sql` in the Supabase **SQL Editor**, or use the CLI:
   ```bash
   supabase link --project-ref <your-ref>
   supabase db push
   ```
4. **Authentication → Providers → Google**: enable it and paste your Google OAuth client id/secret. Add `http://localhost:3000/auth/callback` (and your production URL) to the provider's allowed redirect URLs.
5. Generate a BYOK encryption secret and set `BYOK_ENCRYPTION_KEY`:
   ```bash
   openssl rand -base64 32
   ```
6. `npm run dev`, create an account, and you'll land on a workspace with a `projects` list and a BYOK settings page.

## Environment variables

Every variable is documented in [`.env.example`](./.env.example). Copy it to `.env.local`.

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Supabase project URL (public). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | Supabase anon/public key (public, RLS-protected). |
| `SUPABASE_SERVICE_ROLE_KEY` | server | Service-role key. **Server-only**, bypasses RLS. Never expose to the client. |
| `BYOK_ENCRYPTION_KEY` | yes | Secret used to derive the AES-256-GCM key for encrypting BYOK provider keys. Generate with `openssl rand -base64 32`. |
| `GOOGLE_OAUTH_CLIENT_ID` | optional | Reference value; configured in the Supabase dashboard. |
| `GOOGLE_OAUTH_CLIENT_SECRET` | optional | Reference value; configured in the Supabase dashboard. |
| `NEXT_PUBLIC_SITE_URL` | optional | Public base URL used for OAuth redirects. |

> **Secret hygiene:** only `.env.example` (placeholders) is committed. `.env*` files are git-ignored. Never commit real keys.

## Project structure

```
src/
  app/
    page.tsx                  Landing page
    login/ · signup/          Auth pages + server actions
    auth/callback/route.ts    OAuth/PKCE code exchange
    auth/signout/route.ts     Sign out
    (dashboard)/
      layout.tsx              Auth-gated shell
      dashboard/              Projects (multi-tenant, RLS) + actions
      settings/               BYOK key management + LLM demo + actions
  components/                 GoogleButton, LlmDemo
  lib/
    env.ts                    Build-safe env access
    crypto.ts                 AES-256-GCM encrypt/decrypt for BYOK
    llm.ts                    Generic OpenAI-compatible LLM call
    database.types.ts         Typed schema
    supabase/                 browser / server / session-proxy clients
  proxy.ts                    Next.js 16 proxy: session refresh + route gating
supabase/migrations/          SQL schema + RLS policies
.github/workflows/ci.yml      Typecheck + build (at the repo root, matrix-built)
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (passes without real secrets) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | Next.js lint |

## License

[MIT](../../LICENSE)
