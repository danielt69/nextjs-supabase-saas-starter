/**
 * Server-side auth configuration for Convex.
 *
 * Convex validates incoming Clerk access tokens against this provider. Set
 * CLERK_JWT_ISSUER_DOMAIN in the Convex dashboard (Settings > Environment
 * Variables) to your Clerk Frontend API URL, e.g.
 *   https://your-subdomain.clerk.accounts.dev
 *
 * `applicationID: "convex"` must match the name of the JWT template you create
 * in the Clerk dashboard (JWT Templates > New template > Convex).
 */
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: "convex",
    },
  ],
};
