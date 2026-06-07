/**
 * Centralized, build-safe env access.
 *
 * `vite build` must succeed even when no real values are present (CI, preview
 * before env is wired). Vite inlines `import.meta.env.VITE_*` at build time; we
 * fall back to empty strings so the bundle compiles, and gate the app on
 * `isConfigured()` so the running app shows a friendly notice instead of
 * crashing on an unconfigured Firebase SDK.
 */

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "",
};

export function isConfigured(): boolean {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
}
