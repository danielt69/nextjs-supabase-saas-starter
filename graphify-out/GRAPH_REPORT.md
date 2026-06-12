# Graph Report - nextjs-supabase-saas-starter  (2026-06-12)

## Corpus Check
- 141 files · ~36,338 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 689 nodes · 740 edges · 86 communities (56 shown, 30 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `961ca19b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 81|Community 81]]

## God Nodes (most connected - your core abstractions)
1. `createClient()` - 20 edges
2. `compilerOptions` - 18 edges
3. `compilerOptions` - 17 edges
4. `compilerOptions` - 16 edges
5. `compilerOptions` - 16 edges
6. `useAuth()` - 13 edges
7. `scripts` - 12 edges
8. `scripts` - 11 edges
9. `What You Must Do When Invoked` - 11 edges
10. `What You Must Do When Invoked` - 11 edges

## Surprising Connections (you probably didn't know these)
- `DashboardLayout()` --calls--> `useAuth()`  [INFERRED]
  templates/firebase-react/src/components/DashboardLayout.tsx → templates/firebase-react/src/contexts/AuthContext.tsx
- `LlmDemo()` --calls--> `useAuth()`  [INFERRED]
  templates/firebase-react/src/components/LlmDemo.tsx → templates/firebase-react/src/contexts/AuthContext.tsx
- `Projects()` --calls--> `useAuth()`  [INFERRED]
  templates/firebase-react/src/components/Projects.tsx → templates/firebase-react/src/contexts/AuthContext.tsx
- `ProviderKeyForm()` --calls--> `useAuth()`  [INFERRED]
  templates/firebase-react/src/components/ProviderKeyForm.tsx → templates/firebase-react/src/contexts/AuthContext.tsx
- `DashboardPage()` --calls--> `isSupabaseConfigured()`  [INFERRED]
  templates/supabase-next/src/app/(dashboard)/dashboard/page.tsx → templates/supabase-next/src/lib/env.ts

## Import Cycles
- None detected.

## Communities (86 total, 30 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.08
Nodes (27): GET(), GoogleButton(), createProject(), deleteProject(), Database, Json, getServiceRoleKey(), getSupabaseAnonKey() (+19 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (38): dependencies, @auth/prisma-adapter, next, next-auth, @prisma/client, react, react-dom, superjson (+30 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (19): complete, decryptSecret(), encryptSecret(), getKey(), saveKey, create, list, remove (+11 more)

### Community 3 - "Community 3"
Cohesion: 0.06
Nodes (31): dependencies, @clerk/clerk-react, convex, react, react-dom, react-router-dom, description, devDependencies (+23 more)

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (14): AppRouter, createCaller, createTRPCContext(), protectedProcedure, t, Session, auth, { auth: uncachedAuth, handlers, signIn, signOut } (+6 more)

### Community 5 - "Community 5"
Cohesion: 0.14
Nodes (17): Project, ProtectedRoute(), AuthContext, AuthProvider(), AuthState, useAuth(), firebaseConfig, app (+9 more)

### Community 6 - "Community 6"
Cohesion: 0.08
Nodes (25): dependencies, firebase, react, react-dom, react-router-dom, description, devDependencies, autoprefixer (+17 more)

### Community 7 - "Community 7"
Cohesion: 0.08
Nodes (24): dependencies, next, react, react-dom, @supabase/ssr, @supabase/supabase-js, description, devDependencies (+16 more)

### Community 8 - "Community 8"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 9 - "Community 9"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 10 - "Community 10"
Cohesion: 0.09
Nodes (22): compilerOptions, allowImportingTsExtensions, baseUrl, isolatedModules, jsx, lib, module, moduleDetection (+14 more)

### Community 11 - "Community 11"
Cohesion: 0.10
Nodes (20): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleDetection, moduleResolution (+12 more)

### Community 12 - "Community 12"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 13 - "Community 13"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 14 - "Community 14"
Cohesion: 0.11
Nodes (18): description, keywords, license, name, private, scripts, build, build:firebase-react (+10 more)

### Community 15 - "Community 15"
Cohesion: 0.16
Nodes (7): metadata, createQueryClient(), api, getQueryClient(), RouterInputs, RouterOutputs, TRPCReactProvider()

### Community 16 - "Community 16"
Cohesion: 0.17
Nodes (11): bin, create-saas-stack, description, engines, node, files, keywords, license (+3 more)

### Community 17 - "Community 17"
Cohesion: 0.31
Nodes (9): copyTemplate(), main(), parseArgs(), rewritePackageName(), SCRIPT_DIR, SKIP, STACKS, templatesRoot() (+1 more)

### Community 18 - "Community 18"
Cohesion: 0.20
Nodes (9): Architecture, Environment variables, Features, License, Next.js + Supabase SaaS Starter, Point it at a fresh Supabase project, Project structure, Quick start (+1 more)

### Community 19 - "Community 19"
Cohesion: 0.33
Nodes (8): dec, deriveKey(), enc, fromBase64(), SALT, toBase64(), decryptSecret(), encryptSecret()

### Community 20 - "Community 20"
Cohesion: 0.22
Nodes (8): BYOK encryption, Deploy, Generated Convex types, How auth + data fit together, Quick start, React + Convex + Clerk SaaS Starter, Scripts, Stack

### Community 21 - "Community 21"
Cohesion: 0.22
Nodes (8): Deploy to Vercel, Design principles (shared by every template), License, Quick start (scaffold a new app), Repo layout, Root scripts, SaaS Starters, Templates

### Community 22 - "Community 22"
Cohesion: 0.25
Nodes (7): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 23 - "Community 23"
Cohesion: 0.25
Nodes (7): A note on BYOK security, Deploy, Getting started, React + Firebase SaaS Starter, Scripts, Stack, What's inside

### Community 24 - "Community 24"
Cohesion: 0.25
Nodes (7): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 26 - "Community 26"
Cohesion: 0.29
Nodes (6): BYOK encryption, How it fits together, Production / PostgreSQL, Quick start, Scripts, T3 SaaS Starter

### Community 27 - "Community 27"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 28 - "Community 28"
Cohesion: 0.33
Nodes (4): DataModel, Doc, Id, TableNames

### Community 29 - "Community 29"
Cohesion: 0.33
Nodes (5): ActionCtx, DatabaseReader, DatabaseWriter, MutationCtx, QueryCtx

### Community 30 - "Community 30"
Cohesion: 0.53
Nodes (4): getClerkPublishableKey(), getConvexUrl(), isConfigured(), root

### Community 31 - "Community 31"
Cohesion: 0.40
Nodes (4): create-saas-stack, Options, Usage, What it does

### Community 32 - "Community 32"
Cohesion: 0.60
Nodes (3): decryptSecret(), encryptSecret(), getKey()

### Community 33 - "Community 33"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 34 - "Community 34"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 35 - "Community 35"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 36 - "Community 36"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 37 - "Community 37"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 38 - "Community 38"
Cohesion: 0.50
Nodes (3): For /graphify explain, For /graphify path, graphify reference: query, path, explain

### Community 39 - "Community 39"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 40 - "Community 40"
Cohesion: 0.83
Nodes (3): decryptSecret(), encryptSecret(), getKey()

## Knowledge Gaps
- **385 isolated node(s):** `name`, `version`, `private`, `description`, `license` (+380 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **30 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `name`, `version`, `private` to the rest of the system?**
  _385 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.08489795918367347 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.07308377896613191 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.0625 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.10804597701149425 - nodes in this community are weakly interconnected._
- **Should `Community 5` be split into smaller, more focused modules?**
  _Cohesion score 0.14039408866995073 - nodes in this community are weakly interconnected._