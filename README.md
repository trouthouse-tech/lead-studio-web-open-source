# Lead Studio Web (open source)

Next.js front end for **Lead Studio** — the self-hosted lead CRM that pairs with [**lead-studio-express-server**](https://github.com/Luckee-Core/lead-studio-express-server).

For **solo founders and owner-operators** still stitching together Google Maps, spreadsheets, and sent-mail folders: discover businesses, track contacts, queue outbound email, and log calls in one self-hosted dashboard. Redux for app state, feature UI in `src/packages`, HTTP clients in `src/api` (browser → Express). Copy and positioning: **`mentorai-server/data/context/lead-studio-copy-voice.md`**.

See **`SECURITY.md`** before you point this at anything beyond localhost.

## Run it locally

```bash
npm install
npm run dev
```

- Marketing landing: [http://localhost:3000](http://localhost:3000)
- App dashboard: **`/dashboard`**
- First-run wizard: **[http://localhost:3000/setup](http://localhost:3000/setup)** — confirms your Express URL and health check before the dashboard opens

Copy **`.env.example`** → **`.env.local`**. Set **`NEXT_PUBLIC_SERVER_URL`** to your Express base URL (dev default when unset: `http://localhost:3032`).

### Full dev stack (Mac)

Use **[Luckee Dev Hub](https://github.com/Luckee-Core/luckee-hub)** to run Express + Next.js, open Cursor, and launch Chrome for Lead Studio (and other studios). See **[`scripts/README.md`](scripts/README.md)**.

Outbound email is sent by Express using a Google Workspace **service account** — configure secrets on the server, not in this web app. See **`mentorai-server/data/how-to/lead-studio-email-sending.md`** and the express `src/services/email/README.md` when you wire sending.

## Repo layout

| Path | What lives here |
|------|-----------------|
| **`src/app`** | App Router pages and layouts — see **`src/app/README.md`** |
| **`src/components`** | Shared dashboard shell (`AppLayout`, sidebar, header) — **`src/components/README.md`** |
| **`src/packages`** | Feature modules (screens/workflows) — **`src/packages/README.md`** |
| **`src/model`** | Shared domain **`type`** definitions — **`src/model/README.md`** |
| **`src/api`** | `fetch` / `apiClient` wrappers — **`src/api/README.md`** |
| **`src/store`** | Redux slices, thunks, dumps — **`src/store/README.md`** |
| **`src/utils`** | Pure helpers by domain — **`src/utils/README.md`** |
| **`src/config`** | URLs, env, route constants — **`src/config/README.md`** |
| **`docs`** | Hub + security index — **`docs/README.md`** |

Architecture ADRs: **`.cursor/architecture/README.md`**. Agent rules: **`.cursor/rules/AGENTS.md`**.

## Pair with Express

This repo is half of a two-repo setup. The other half is [**lead-studio-express-server**](https://github.com/Luckee-Core/lead-studio-express-server) (Supabase, research workers, email queue).

| Resource | Link |
|----------|------|
| Pair quickstart | [`docs/oss-quickstart.md`](https://github.com/Luckee-Core/lead-studio-express-server/blob/main/docs/oss-quickstart.md) |
| Studio map (all Luckee OSS repos) | [`getting-started`](https://github.com/Luckee-Core/getting-started) |
| OSS governance (checklists, wire contract) | [`mentorai-server/data/open-source/`](https://github.com/trouthouse-tech/mentorai-server/tree/main/data/open-source) |

License: MIT — see **`LICENSE`**.

## Local development and trust

Written for **solo or trusted-team use on your machine** by default. Run Next and Express on **`127.0.0.1`** (or behind a firewall) until Express enforces real authentication.

**Client vs server secrets**

- **`NEXT_PUBLIC_*` variables ship in the browser bundle.** Never put private API keys or server-only secrets there. Use server-only env (no `NEXT_PUBLIC_` prefix) in **`app/api/**/route.ts`** or on Express.
- **`src/api`** does not attach `Authorization` headers by itself. It assumes your Express policy — often “open on localhost” during development. Treat any API reachable from the LAN or the public internet as **requiring auth, HTTPS, CORS, and rate limits** before you expose it.

**Where HTTP traffic goes**

All CRM and research clients in `src/api/` call `API_CONFIG.SERVER_URL` (from `NEXT_PUBLIC_SERVER_URL`) + `/api/data/...` or `/api/services/...`. There is no Next.js BFF for lead flows in this OSS slice.

**Before a wider or production deploy**

- Enforce **authZ** on Express for every mutating and sensitive read route.
- Add **`app/api`** proxies with body size limits and auth if you introduce a BFF layer.
- Run **`npm audit`** before releases; keep lockfiles committed.
- Fill in the maintainer email placeholder in **`SECURITY.md`** if GitHub private advisories are not enough.

## Use as a GitHub template

Repo → Settings → General → check **Template repository**.
