# React + Firebase SaaS Starter

A Vite single-page app with Firebase Authentication, multi-tenant data in
Firestore, and a bring-your-own-key (BYOK) LLM demo.

## Stack

- **Vite 6** + **React 19** + **TypeScript**
- **react-router-dom v7** for routing
- **Firebase v11** — Auth (Google OAuth + email/password) and Firestore
- **Tailwind CSS** for styling
- **WebCrypto (AES-256-GCM)** for client-side BYOK encryption

## What's inside

- Landing page (`/`)
- Sign in / sign up (`/sign-in`) — Google popup and email/password
- Protected `/dashboard` — a per-user `projects` collection with live
  `onSnapshot` updates
- Protected `/settings` — store an LLM provider key (encrypted) and run a demo
  completion against an OpenAI-compatible API

Auth state is driven by an `onAuthStateChanged` context, and a `<ProtectedRoute>`
wrapper redirects unauthenticated users to `/sign-in`. Firestore security rules
enforce per-user ownership.

## Getting started

1. Create a Firebase project at <https://console.firebase.google.com>.
2. Enable **Authentication** → Sign-in methods: **Google** and
   **Email/Password**.
3. Create a **Cloud Firestore** database.
4. Add a **Web app** and copy the config values.
5. Copy the env file and fill it in:

   ```bash
   cp .env.example .env.local
   ```

6. Install and run:

   ```bash
   npm install
   npm run dev
   ```

7. Deploy the security rules (requires the Firebase CLI):

   ```bash
   npx firebase deploy --only firestore:rules
   ```

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — type-check and build for production
- `npm run typecheck` — type-check only
- `npm run preview` — preview the production build

## A note on BYOK security

This template has no backend, so the provider key is encrypted **in the browser**
with an AES-256-GCM key derived (PBKDF2) from the signed-in user's Firebase uid,
then stored in Firestore. That keeps the plaintext key out of the database and
scopes it to the user — acceptable for a starter/demo. For production secrets,
proxy the provider call through a **Cloud Function** with a server-held key so the
key is never present in the client. See `src/lib/crypto.ts` for details.

## Deploy

The build output is a static SPA in `dist/`. Deploy to Firebase Hosting
(`firebase deploy`), Vercel, Netlify, or any static host. For non-Firebase hosts,
add a catch-all rewrite to `index.html` so client-side routes work.
