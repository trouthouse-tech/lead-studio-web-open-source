# `src/config` — Environment and route constants

Central place for **URL construction** (Express vs Next), **`process.env` wiring**, and **typed frontend paths** used by navigation and links.

## Files

| File | Role |
|------|------|
| **`api.ts`** | `API_CONFIG` (`DEFAULT`, `SERVER_URL`), production guards, helpers (`getMentoraiDataApiBaseUrl`, `getMentoraiServerBaseUrl` for optional Next BFF / server-only code). |
| **`routes.ts`** | Path string constants (`DASHBOARD_PATH`, `FIND_LEADS_PATH`, `LEAD_CONTACT_DETAIL_PATH`, …)—avoid scattering path strings across packages. |
| **`landing-links.ts`** | Marketing URLs (`GITHUB_WEB_REPO_URL`, `DOCS_HUB_URL`, `LUCKEE_URL`, …) and `DASHBOARD_PATH` (re-exported from `routes.ts`). |
| **`index.ts`** | Barrel re-export. |

## Conventions (see `.cursor/architecture/`)

| Topic | ADR |
|-------|-----|
| API base URLs, separation from UI | [004 — API integration](../../.cursor/architecture/004-api-integration.md) |
| Constants vs magic strings | [006 — Constants and utilities](../../.cursor/architecture/006-constants-utilities.md) |

## Environment variables

- **`NEXT_PUBLIC_*`** — Embedded in the **client bundle**. Safe only for **non-secret** values (public API base URLs). Documented in repo root **`.env.example`** and **`SECURITY.md`**.
- **`API_CONFIG.SERVER_URL`** — Browser → **Express** (mentorai-server) for `/api/data/*` and many `src/api` calls. In **dev**, defaults to **`http://localhost:3032`** when `NEXT_PUBLIC_SERVER_URL` is unset (does **not** fall back to `NEXT_PUBLIC_API_URL`—often `:3000` for this Next app).
- **`API_CONFIG.DEFAULT`** — Primarily the **Next app** URL (`NEXT_PUBLIC_API_URL` or localhost:3000)—do not confuse with Express.
- **`getMentoraiServerBaseUrl()`** — **`EXPRESS_SERVER_URL`** first (server-only), then public fallbacks; intended for **`src/app/api/**/route.ts`**, not for leaking secrets to the client.

**Do not** add private keys or tokens under `NEXT_PUBLIC_*`; use server-only vars and read them only in route handlers or server modules.

## Routes constants

- Prefer **`routes.ts`** imports for **`router.push`**, **`Link href`**, breadcrumbs, and emails—keeps renames and typos localized.
- Open contact detail via **`openLeadContactDetailThunk`** then **`router.push(LEAD_CONTACT_DETAIL_PATH)`** (ADR **008**)—no query-string entity ids.

When you add a new **App Router** segment under **`src/app/(dashboard)/`**, add or update a matching constant here if more than one package references the path.

## Checklist (changes here)

- [ ] New **env var**: update **`.env.example`**, root **`README`** security bullets if client-visible, and **`SECURITY.md`** if it changes trust assumptions.
- [ ] New **Express URL helper**: trim trailing slashes consistently (`replace(/\/$/, '')`) like existing helpers.
- [ ] New **route constant**: align segment with **`src/app/.../page.tsx`** path; run search for old hardcoded strings.
- [ ] **Production**: `api.ts` throws if required `NEXT_PUBLIC_*` missing outside build phase—verify **`next build`** still passes (`NEXT_PHASE` guard).

## `routes.ts` vs `src/app`

Path constants should match real **`page.tsx`** routes. A maintained audit lives in **`docs/README.md`** (*Route constants vs `src/app`*); update both when you add or remove dashboard URLs.

## Related

- **`src/api/README.md`** — HTTP clients that consume `API_CONFIG`.
- **`src/store/README.md`** — no env reads in slices; config stays here or in server routes.
- **`docs/README.md`** — route constant audit table.
- **`SECURITY.md`** (repo root) — client-visible env policy.
