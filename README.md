# Lead Studio Web (open source)

Next.js app for **Lead Studio**: Redux, dashboard routes under `src/app`, feature UI in `src/packages`, and HTTP clients in **`src/api`** (browser → Express and/or same-origin Next routes). See **`SECURITY.md`** for how to report issues and what “supported” means for local vs production.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the **marketing landing**; the app dashboard is at **`/dashboard`**. Point **`NEXT_PUBLIC_SERVER_URL`** at **lead-studio-express-server**; default in code is `http://localhost:3032` when unset in development. Copy **`.env.example`** to `.env.local` and adjust. Email sending uses a Workspace service account on express — see **`docs/email-sending.md`**.

## Layout

- **`src/app`** — App Router pages and layouts (see **`src/app/README.md`** for conventions vs `.cursor/architecture`)
- **`src/components`** — Shared dashboard shell (`AppLayout`, sidebar, header); see **`src/components/README.md`**
- **`src/packages`** — Feature modules (screens/workflows); see **`src/packages/README.md`**
- **`src/model`** — Shared domain **`type`** definitions (entities, breadcrumbs); see **`src/model/README.md`**
- **`src/api`** — `fetch` / `apiClient` wrappers; see **`src/api/README.md`**
- **`src/store`** — Redux (slices, thunks, dumps); see **`src/store/README.md`**
- **`src/utils`** — Pure helpers by domain; see **`src/utils/README.md`**
- **`src/config`** — `api.ts` (URLs + env), `routes.ts` (path constants); see **`src/config/README.md`**
- **`docs`** — Hub + security index; see **`docs/README.md`**

### Documentation map (per-folder guides)

| Path | Topics |
|------|--------|
| [`src/app/README.md`](src/app/README.md) | App Router, thin pages, breadcrumbs |
| [`src/components/README.md`](src/components/README.md) | Shared shell vs packages |
| [`src/packages/README.md`](src/packages/README.md) | Feature modules, thunks layout |
| [`src/model/README.md`](src/model/README.md) | Domain types |
| [`src/api/README.md`](src/api/README.md) | HTTP clients, env |
| [`src/store/README.md`](src/store/README.md) | Redux, thunks, dumps |
| [`src/utils/README.md`](src/utils/README.md) | Pure utilities |
| [`src/config/README.md`](src/config/README.md) | URLs, route constants |
| [`docs/README.md`](docs/README.md) | Documentation hub (`docs/` only) |
| [`docs/security/README.md`](docs/security/README.md) | Security doc index |

Architecture ADRs: **`.cursor/architecture/README.md`**. Agent rules: **`.cursor/rules/AGENTS.md`**.

## Local development and trust

This repo is written for **solo or trusted-team use on your machine** by default: Next and Express should listen on **`127.0.0.1`** (or sit behind a firewall) **until** Express enforces real authentication.

- **`NEXT_PUBLIC_*` variables are embedded in the client bundle.** Never put private API keys or server-only secrets in them. Use server-only env vars (no `NEXT_PUBLIC_` prefix) in **`app/api/**/route.ts`** or on Express.
- **`src/api`** does not attach `Authorization` headers by itself; it assumes your **Express** (or BFF) policy—often “open on localhost” during development. Treat any API reachable from the LAN or internet as **requiring auth, HTTPS, CORS, and rate limits** before you expose it.

### Where HTTP traffic goes

1. **Browser → Express** — Many calls use `API_CONFIG.SERVER_URL` + `/api/data/...` (mentorai-server style).
2. **Browser → Next (same origin)** — Some lead/research helpers use relative **`/api/leads/...`**. Those hit the Next origin unless you add matching **`app/api`** route handlers or change those clients to call **`API_CONFIG.SERVER_URL`** on Express instead.

### Elevated / future (before wider or production deploy)

- Enforce **authZ** on Express for every mutating and sensitive read route; prefer **cookies or short-lived tokens** with clear same-site / CORS rules if the app and API differ by origin.
- Add **`app/api`** proxies with **body size limits**, **auth** (e.g. session or shared secret for cron-style routes), and **allowlists** for any outbound URL (integrations, n8n, etc.).
- Run **`npm audit`** (or `pnpm audit`) before releases; keep lockfiles committed.
- Forks and production deploys: fill in the **maintainer email placeholder** in **`SECURITY.md`** if GitHub private advisories are not enough; optionally add **`security.txt`** on your deployed domain (see **`SECURITY.md`**).

## As GitHub template

If you reuse this repo as a template: Repo → Settings → General → check **Template repository**.
