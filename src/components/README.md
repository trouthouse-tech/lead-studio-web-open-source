# `src/components` — Shared shell UI

Cross-feature UI used by multiple **`src/packages`** routes: **dashboard chrome** (sidebar, header, breadcrumbs), navigation helpers, and tab shells—not domain features (leads, contacts, etc.).

## Conventions (see `.cursor/architecture/`)

| Topic | ADR |
|-------|-----|
| What belongs here vs **`src/packages`** | [002 — Component composition](../../.cursor/architecture/002-component-composition.md) |
| Tailwind / styles object patterns | [003 — Styling rules](../../.cursor/architecture/003-styling-rules.md) |
| Barrel **`index.ts`** exports | [005 — File organization](../../.cursor/architecture/005-file-organization.md) |
| **`AppLayout`** + breadcrumb resolution | [007 — Redux dashboard breadcrumbs](../../.cursor/architecture/007-redux-dashboard-breadcrumbs.md) |

## Boundaries

**Put in `src/components/`**

- **`AppLayout`** — sidebar + header + breadcrumb bar; pathname-driven resets (see ADR 007).
- **`sidebar/`**, **`app-layout-header/`**, **`detail-page-tabs/`** — reusable chrome.
- **`navigation/`** — pure helpers (`get-navigation-links`, pathname matching, default crumb for path).

**Put in `src/packages/<feature>/`**

- Screens, tables, modals, and feature-specific state wiring for a domain (leads, emails, etc.).

**Avoid**

- Calling **`src/api`** directly from shared components unless you add an ADR-approved exception (prefer thunks from route/package).

## Barrel

**`index.ts`** re-exports the public surface; import from `@/components` in app routes.

## Checklist (new component here)

- [ ] Truly **cross-feature**; if only one package uses it long-term, consider **`packages/<feature>/`** instead.
- [ ] No domain-specific copy or Redux slices imported from a single feature—keep shell generic.
- [ ] Styling follows ADR **003** (Tailwind / `styles` objects per project rules).
- [ ] **`'use client'`** only when hooks, browser APIs, or Redux are required.

## Related

- **`src/packages/README.md`** — feature modules vs shared shell (this folder).
- **`src/store/README.md`**, **`src/utils/README.md`** — breadcrumbs and resolver hooks align with ADR **007** utilities.
- **`src/app/README.md`** — how routes compose `AppLayout` and breadcrumbs.
