# `src/app` — App Router

Next.js **App Router** entry: root layout, home route, and dashboard routes under **`(dashboard)/`**.

## Conventions (see `.cursor/architecture/`)

| Topic | ADR |
|-------|-----|
| Thin **`page.tsx`** (feature UI in `src/packages`) | [002 — Component composition](../../.cursor/architecture/002-component-composition.md) |
| Folder layout (`app/` vs `packages/` vs `components/`) | [005 — File organization](../../.cursor/architecture/005-file-organization.md) |
| **Breadcrumbs** on dashboard routes | [007 — Redux dashboard breadcrumbs](../../.cursor/architecture/007-redux-dashboard-breadcrumbs.md) |

## Layout shape

- **`layout.tsx`** — Root HTML shell: fonts, `ReduxProvider`, `RootToaster`. Keep **Server Components** unless you need client-only APIs here.
- **`(dashboard)/layout.tsx`** — Pass-through wrapper for dashboard segments; keep minimal.
- **`page.tsx`** — Prefer **thin**: import a package screen + `AppLayout`, optionally register breadcrumbs.

## `"use client"` on pages

Dashboard pages use **`'use client'`** because they:

- Wrap content in **`AppLayout`** (client: pathname, sidebar, breadcrumbs).
- Register breadcrumbs (**`useRegisterStaticDashboardBreadcrumbs`** or **`BreadcrumbBuilderActions`** + `useEffect` per ADR 007).

That is intentional; do not add unrelated data-fetch or business logic in route files—keep orchestration limited to **routing shell + breadcrumb registration** per ADR 007.

## Checklist (new or changed route)

- [ ] Feature UI lives under **`src/packages/<feature>/`**, not inlined in `page.tsx`.
- [ ] Breadcrumb behavior matches ADR **007** (static helper vs `setTrail` vs entity switcher).
- [ ] No **`fetch`/thunks** in `page.tsx` except breadcrumb registration—use packages + thunks for data.
- [ ] New API routes belong in **`src/app/api/**/route.ts`** (see ADR **004**).

## Related

- **`src/packages/README.md`** — where feature UI lives; Redux/API layout for this repo.
- **`src/components/README.md`** — shared shell (`AppLayout`, sidebar, header).
- **`src/config/README.md`** — `API_CONFIG`, route path constants, env rules.
- **`src/model/README.md`** — shared domain `type` definitions for store and UI.
- **`src/store/README.md`**, **`src/utils/README.md`** — Redux and pure helpers used by routes indirectly via packages.
- **`SECURITY.md`** (repo root) — trust model for client/server boundaries.
