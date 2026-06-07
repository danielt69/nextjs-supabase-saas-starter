# SaaS Starters

A small collection of **production-style SaaS starters**, each on a different
stack, plus a zero-dependency CLI to scaffold one into a new project. Every
template demonstrates the patterns most SaaS apps actually need — authentication,
multi-tenant data with per-request authorization, and a **bring-your-own-key
(BYOK)** LLM integration with secrets encrypted at rest.

> The repo is named `nextjs-supabase-saas-starter` for historical reasons. Now
> that it hosts more than one stack, a name like `saas-starters` would fit
> better — a rename is suggested but intentionally **not** done here to avoid
> breaking existing links and the Vercel deploy URLs.

## Quick start (scaffold a new app)

```bash
npm create saas-stack@latest
# or
npx create-saas-stack my-app --stack convex-clerk --install
```

The CLI copies a template into a new directory, rewrites the package name, and
prints next steps. It's a template copier, not a codegen engine. See
[`packages/create`](./packages/create).

Prefer to clone directly? Each template lives under `templates/` and is fully
self-contained — `cd` into one and run `npm install`.

## Templates

| Stack | Auth | Data | LLM | Directory |
| --- | --- | --- | --- | --- |
| **Supabase + Next.js** | Supabase Auth (SSR): email/password + Google OAuth | Postgres + Row Level Security | BYOK, AES-256-GCM | [`templates/supabase-next`](./templates/supabase-next) |
| **Convex + Clerk** | Clerk: email + social, hosted UI | Convex (reactive), tenancy by identity | BYOK, AES-256-GCM | [`templates/convex-clerk`](./templates/convex-clerk) |

Both share the same product surface — a landing page, gated dashboard with a
multi-tenant `projects` list, and a settings page for managing an encrypted
provider key plus an LLM demo — so you can compare the two approaches directly.

### Deploy to Vercel

Set the project's **Root Directory** to the template path when importing.

| Template | One-click deploy |
| --- | --- |
| Supabase + Next.js | [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/danielt69/nextjs-supabase-saas-starter/tree/main/templates/supabase-next&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY,BYOK_ENCRYPTION_KEY&envDescription=Supabase%20keys%20and%20a%20BYOK%20encryption%20secret&envLink=https://github.com/danielt69/nextjs-supabase-saas-starter/blob/main/templates/supabase-next/.env.example) |
| Convex + Clerk | [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/danielt69/nextjs-supabase-saas-starter/tree/main/templates/convex-clerk&env=NEXT_PUBLIC_CONVEX_URL,NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,CLERK_SECRET_KEY,CLERK_JWT_ISSUER_DOMAIN,BYOK_ENCRYPTION_KEY&envDescription=Convex%20URL%2C%20Clerk%20keys%2C%20and%20a%20BYOK%20encryption%20secret&envLink=https://github.com/danielt69/nextjs-supabase-saas-starter/blob/main/templates/convex-clerk/.env.example) |

## Repo layout

```
templates/
  supabase-next/     Next.js App Router + Supabase (Postgres + RLS auth)
  convex-clerk/      Next.js App Router + Convex (reactive DB) + Clerk auth
packages/
  create/            create-saas-stack — zero-dep scaffolding CLI
.github/workflows/
  ci.yml             Matrix: typecheck + build EACH template, no secrets
LICENSE              MIT
```

The templates are deliberately **not** npm workspaces. Each is fully
self-contained with its own `package-lock.json`, so it builds in isolation after
a plain `git clone` or after the CLI copies it out — which is exactly what the
"independently-runnable" guarantee requires. The root `package.json` is a private
orchestrator that just forwards to each template (`npm run build`,
`npm run typecheck`, `npm run create`).

## Design principles (shared by every template)

- **Independently runnable.** `npm install && npm run build` and
  `npm run typecheck` pass with **no real secrets present**. Clients are lazily
  initialized with placeholder-safe fallbacks; protected pages show a friendly
  "configure your env" notice instead of crashing.
- **Secrets stay out of git.** Only `.env.example` (placeholders) is committed;
  all `.env*` files are git-ignored.
- **BYOK, encrypted at rest.** A user's provider key is encrypted server-side
  with AES-256-GCM before storage and decrypted **only** server-side when calling
  the model. The plaintext never returns to the browser.
- **Type-safe end to end**, with CI that matrix-builds and type-checks every
  template on each push and PR.

## Root scripts

| Command | Description |
| --- | --- |
| `npm run create` | Run the scaffolding CLI |
| `npm run build` | Build both templates |
| `npm run typecheck` | Type-check both templates |
| `npm run build:<template>` / `typecheck:<template>` | Single template |

> The per-template scripts forward via `npm --prefix`, so install that
> template's dependencies first (`npm --prefix templates/<x> install`).

## License

[MIT](./LICENSE)
