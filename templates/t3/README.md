# T3 SaaS Starter

A production-style **T3 stack** app:

- **Next.js** App Router + TypeScript + Tailwind
- **tRPC v11** — end-to-end type-safe API
- **Prisma v6** + SQLite for local dev (PostgreSQL-ready)
- **NextAuth v5** (Auth.js) with a GitHub provider and database sessions
- **BYOK LLM** — users store their own provider API key, encrypted at rest with
  AES-256-GCM, decrypted only inside a tRPC procedure

Same product surface as the other starters in this repo: a landing page, a gated
dashboard with a per-user `projects` list, and a settings page for managing an
encrypted provider key plus an LLM demo.

## Quick start

```bash
npm install
cp .env.example .env

# Fill in .env:
#   NEXTAUTH_SECRET        openssl rand -base64 32
#   GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET   from a GitHub OAuth app
#   BYOK_ENCRYPTION_KEY    openssl rand -base64 32

# Create the SQLite database from the committed migration
npx prisma migrate dev

npm run dev
```

Create a GitHub OAuth app at <https://github.com/settings/developers> with the
callback URL `http://localhost:3000/api/auth/callback/github`.

## How it fits together

- **Auth.** `src/server/auth/` configures NextAuth with the Prisma adapter and a
  GitHub provider, using database sessions. `auth()` is used in server
  components and in the tRPC context.
- **API.** `src/server/api/trpc.ts` builds the context (`db`, `session`) and a
  `protectedProcedure` that throws `UNAUTHORIZED` without a session. Routers
  live in `src/server/api/routers/`.
- **Tenancy.** Every query/mutation filters by `ctx.session.user.id`, so a user
  only ever reads or writes their own rows.
- **Client.** `src/trpc/react.tsx` wires up the typed React Query hooks
  (`api.project.list.useQuery()`, etc.). Dashboard widgets are client
  components; the pages and layout are server components that gate on `auth()`.

## BYOK encryption

1. `ProviderKeyForm` sends the raw key to the `providerKey.save` mutation.
2. `src/lib/crypto.ts` encrypts it with AES-256-GCM (`BYOK_ENCRYPTION_KEY`); the
   ciphertext is stored in the `ProviderKey` table.
3. `llm.complete` reads the row, decrypts server-side, and calls the model. The
   plaintext never returns to the browser; `providerKey.status` only exposes a
   boolean.

## Production / PostgreSQL

Change the datasource in `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Point `DATABASE_URL` at your Postgres instance and run `npx prisma migrate deploy`.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Dev server (runs `prisma generate` first) |
| `npm run build` | Production build (runs `prisma generate` first) |
| `npm run typecheck` | `tsc --noEmit` (runs `prisma generate` first) |
| `npm run db:migrate` | `prisma migrate dev` |
| `npm run db:push` | `prisma db push` |
