/**
 * True when the app has the credentials it needs to actually sign users in.
 * Used to show a friendly "configure your env" notice instead of a broken
 * sign-in button when the template is run before secrets are filled in.
 */
export function isConfigured(): boolean {
  return Boolean(
    process.env.NEXTAUTH_SECRET &&
      process.env.GITHUB_CLIENT_ID &&
      process.env.GITHUB_CLIENT_SECRET
  );
}
