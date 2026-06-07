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
npx create-saas-stack my-app --stack react-convex-clerk --install
```

The CLI copies a template into a new directory, rewrites the package name, and
prints next steps. It's a template copier, not a codegen engine. See
[`packages/create`](./packages/create).

Prefer to clone directly? Each template lives under `templates/` and is fully
self-contained — `cd` into one and run `npm install`.

## Templates

| Stack | Auth | Data | LLM | Directory |
| --- | --- | --- | --- | --- |
| **Supabase + Next.js** | Supabase Auth (SSR): email/password + Google OAuth | Postgres + Row Level Security | BYOK, AES-256-GCM (server) | [`templates/supabase-next`](./templates/supabase-next) |
| **Convex + Clerk** (Vite React SPA) | Clerk: email + social, hosted UI | Convex (reactive), tenancy by identity | BYOK, AES-256-GCM (Convex action) | [`templates/react-convex-clerk`](./templates/react-convex-clerk) |
| **T3** (Next.js + tRPC + Prisma + Auth.js) | Auth.js / NextAuth v5: GitHub OAuth | Prisma + SQLite, tenancy by `userId` | BYOK, AES-256-GCM (server) | [`templates/t3`](./templates/t3) |
| **Firebase** (Vite React SPA) | Firebase Auth: Google + email/password | Firestore, rules enforce ownership | BYOK, AES-256-GCM (browser/WebCrypto) | [`templates/firebase-react`](./templates/firebase-react) |

All four share the same product surface — a landing page, gated dashboard with a
multi-tenant `projects` list, and a settings page for managing an encrypted
provider key plus an LLM demo — so you can compare the approaches directly.

### Deploy to Vercel

Set the project's **Root Directory** to the template path when importing.

For the Vite SPA templates (Convex + Clerk, Firebase), Vercel builds the static
output and serves it — set the framework preset to **Vite** when prompted.

| Template | One-click deploy |
| --- | --- |
| Supabase + Next.js | [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/danielt69/nextjs-supabase-saas-starter/tree/main/templates/supabase-next&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY,BYOK_ENCRYPTION_KEY&envDescription=Supabase%20keys%20and%20a%20BYOK%20encryption%20secret&envLink=https://github.com/danielt69/nextjs-supabase-saas-starter/blob/main/templates/supabase-next/.env.example) |
| Convex + Clerk | [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/danielt69/nextjs-supabase-saas-starter/tree/main/templates/react-convex-clerk&env=VITE_CONVEX_URL,VITE_CLERK_PUBLISHABLE_KEY&envDescription=Convex%20deployment%20URL%20and%20Clerk%20publishable%20key&envLink=https://github.com/danielt69/nextjs-supabase-saas-starter/blob/main/templates/react-convex-clerk/.env.example) |
| T3 | [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/danielt69/nextjs-supabase-saas-starter/tree/main/templates/t3&env=DATABASE_URL,NEXTAUTH_SECRET,NEXTAUTH_URL,GITHUB_CLIENT_ID,GITHUB_CLIENT_SECRET,BYOK_ENCRYPTION_KEY&envDescription=Database%20URL%2C%20Auth.js%20secret%2C%20GitHub%20OAuth%2C%20and%20a%20BYOK%20encryption%20secret&envLink=https://github.com/danielt69/nextjs-supabase-saas-starter/blob/main/templates/t3/.env.example) |
| Firebase | [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/danielt69/nextjs-supabase-saas-starter/tree/main/templates/firebase-react&env=VITE_FIREBASE_API_KEY,VITE_FIREBASE_AUTH_DOMAIN,VITE_FIREBASE_PROJECT_ID,VITE_FIREBASE_STORAGE_BUCKET,VITE_FIREBASE_MESSAGING_SENDER_ID,VITE_FIREBASE_APP_ID&envDescription=Firebase%20web%20app%20config&envLink=https://github.com/danielt69/nextjs-supabase-saas-starter/blob/main/templates/firebase-react/.env.example) |

## Repo layout

```
templates/
  supabase-next/      Next.js App Router + Supabase (Postgres + RLS auth)
  react-convex-clerk/ Vite React SPA + Convex (reactive DB) + Clerk auth
  t3/                 Next.js App Router + tRPC + Prisma + Auth.js (GitHub)
  firebase-react/     Vite React SPA + Firebase Auth + Firestore
packages/
  create/             create-saas-stack — zero-dep scaffolding CLI
.github/workflows/
  ci.yml              Matrix: typecheck + build EACH template, no secrets
LICENSE               MIT
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
- **BYOK, encrypted at rest.** A user's provider key is encrypted with
  AES-256-GCM before storage and decrypted only when calling the model. In the
  server-backed templates (Supabase, T3, Convex) this happens server-side and the
  plaintext never reaches the browser. The Firebase SPA has no backend, so it
  encrypts client-side with a per-user WebCrypto key — see its README for the
  production caveat (proxy via a Cloud Function).
- **Type-safe end to end**, with CI that matrix-builds and type-checks every
  template on each push and PR.

## Root scripts

| Command | Description |
| --- | --- |
| `npm run create` | Run the scaffolding CLI |
| `npm run build` | Build all templates |
| `npm run typecheck` | Type-check all templates |
| `npm run build:<template>` / `typecheck:<template>` | Single template |

> The per-template scripts forward via `npm --prefix`, so install that
> template's dependencies first (`npm --prefix templates/<x> install`).

## License

[MIT](./LICENSE)
