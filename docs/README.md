# Documentation hub

Start here for **navigation-only** docs. Implementation patterns live next to code (**`src/*/README.md`**) and in **`.cursor/architecture/`**.

## Canonical index

The full **per-folder source guide** table (App Router, packages, store, security, …) is in the repository root **[`README.md`](../README.md)** — scroll to **Documentation map (per-folder guides)**.

## What lives under `docs/`

| Path | Purpose |
|------|---------|
| **[`security/README.md`](security/README.md)** | Links to **`SECURITY.md`**, trust model in root README, and **`src/api`** |

Copy and positioning for Lead Studio UI/landing: **`mentorai-server/data/context/lead-studio-copy-voice.md`** (with **`drafting-constraints.md`**).

Add new top-level doc folders here (playbooks, runbooks) and link them from this file when they are stable.

## Email sending

See **`mentorai-server/data/how-to/lead-studio-email-sending.md`** — Workspace service account on express (no Gmail OAuth connect in the web app). In-app checklist: `/settings/email`.

## API server

Lead Studio OSS web calls this Express API directly via `NEXT_PUBLIC_SERVER_URL` (dev default `http://localhost:3032`).

- **Repo:** [lead-studio-express-server](https://github.com/Luckee-Core/lead-studio-express-server) — run `npm run dev` on port 3032.
- **No Next.js BFF:** research and commercial-queue clients in `src/api/leads/` POST/GET Express paths under `/api/services/*` and `/api/data/*`.

Legacy `mentorai-server` Luckee-only routes removed from the private server (residential leads, lead digest, services studio, user background studio) are **not** ported here.

## Route constants vs `src/app` (audit)

**[`src/config/routes.ts`](../src/config/routes.ts)** exports path constants for navigation. They should stay aligned with real **`src/app/**/page.tsx`** segments.

**Marketing** (`src/app/page.tsx`):

`/` — public landing (`src/packages/landing`)

**Implemented in `src/app/(dashboard)/` today** (representative paths):

`/dashboard`, `/leads`, `/leads/find`, `/leads/to-call-log`, `/lead-detail-page`, `/lead-contacts`, `/lead-contact-detail-page`, `/lead-emails`, `/lead-emails/queue`, `/lead-emails/sent`, `/settings/email`

**`routes.ts` exports** (`DASHBOARD_PATH`, `FIND_LEADS_PATH`, `LEAD_DETAIL_PATH`, `TO_CALL_LOG_PATH`, email paths, `LEAD_CONTACT_DETAIL_PATH`) match the segments above. Contact detail navigation uses Redux + a static path: see [ADR 008](../.cursor/architecture/008-detail-page-routing.md) and `openLeadContactDetailThunk` (set `currentLeadContact`, then `router.push(LEAD_CONTACT_DETAIL_PATH)`). External marketing links live in **`src/config/landing-links.ts`**. When you add or remove a route, update **`routes.ts`**, **`landing-links.ts`** (if applicable), and this list.

## Related

- **[`.cursor/architecture/README.md`](../.cursor/architecture/README.md)** — ADRs
- **[`.cursor/rules/AGENTS.md`](../.cursor/rules/AGENTS.md)** — agent / contributor rules
