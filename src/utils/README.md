# `src/utils` — Pure utilities

**Domain-grouped, pure helpers** and small **constants** used from **thunks**, **packages**, **`src/components`**, and sometimes **route handlers**. No React hooks, no direct Redux **`useStore`**, no **I/O** (except pure parsing of in-memory values).

## Layout

```text
src/utils/
  <domain>/
    index.ts        # Barrel — prefer import { … } from '@/utils/<domain>'
    constants.ts    # Optional — named constants (ADR 006)
    <name>.ts       # One primary function per file when possible
```

There is **no** single root **`src/utils/index.ts`** — import from **`@/utils/date-time`**, **`@/utils/dashboard-breadcrumbs`**, etc., per ADR **005** (stable paths without mega-barrel).

## Conventions (see `.cursor/architecture/`)

| Topic | ADR |
|-------|-----|
| Extract when used **2+** times; **pure** functions | [006 — Constants and utilities](../../.cursor/architecture/006-constants-utilities.md) |
| One primary function per file, barrel per folder | [005 — File organization](../../.cursor/architecture/005-file-organization.md) |
| Breadcrumb registration helpers | [007 — Redux dashboard breadcrumbs](../../.cursor/architecture/007-redux-dashboard-breadcrumbs.md) (see **`dashboard-breadcrumbs/`**) |

## Domains (examples)

| Folder | Typical use |
|--------|-------------|
| **`date-time/`** | Formatting, relative time |
| **`dashboard-breadcrumbs/`** | `useRegisterStaticDashboardBreadcrumbs`, static trail registration |
| **`leads/`**, **`lead-contacts/`** | Lead/contact-specific pure transforms |
| **`json/`**, **`string/`**, **`phone/`** | Generic formatting and validation |
| **`deployment-profile/`**, **`content/`** | Environment or CMS-adjacent helpers |

## Rules

1. **Purity** — Same inputs → same outputs; no `fetch`, `localStorage` in utils unless you add an ADR exception (browser-only helpers that touch storage belong in a clearly named module and are **not** “pure” in the strict sense—keep those rare and documented).
2. **Not a dumping ground** — If only one package uses a 5-line helper, colocating in the package is fine until reuse justifies extraction.
3. **Constants** — Prefer **`constants.ts`** in the same domain folder (ADR **006**).

## Checklist (new utility)

- [ ] Used (or clearly will be used) in **2+** call sites, or is a **stable public contract** (e.g. breadcrumb helper).
- [ ] Add **`index.ts`** export in the domain folder; avoid deep imports that bypass the barrel.
- [ ] JSDoc on non-obvious public functions.

## Related

- **`src/store/README.md`** — thunks compose **`src/api`** + **`src/utils`**.
- **`src/packages/README.md`** — should call thunks; heavy logic belongs in utils/store, not duplicated in UI.
