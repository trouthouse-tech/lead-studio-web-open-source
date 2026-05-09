# `src/model` — Domain types

**Serializable domain shapes** shared by **`src/store`** (dumps / `current*` slices), **`src/api`** (response typing and mapping), and **`src/packages`** (UI). This folder is **types-first**: prefer **`type`** over `interface` for consistency with project conventions.

## Layout

```text
src/model/
  index.ts              # Barrel — import from `@/model`
  shared/               # Cross-entity helpers (timestamps, shared user, structured-response)
  breadcrumb/           # Redux-safe trail segments (ADR 007)
  lead/                 # Lead, LeadCategory, SavedFilter, …
  lead-contact/
  …                     # One folder per aggregate / bounded context
```

Each subfolder should expose an **`index.ts`** that re-exports its public types; **`index.ts`** at the root composes the public model surface.

## Conventions (see `.cursor/architecture/`)

| Topic | ADR |
|-------|-----|
| Redux state references model shapes | [001 — Redux patterns](../../.cursor/architecture/001-redux-patterns.md) |
| Where types live vs packages | [005 — File organization](../../.cursor/architecture/005-file-organization.md) |
| Serializable breadcrumb segments (no functions in Redux) | [007 — Redux dashboard breadcrumbs](../../.cursor/architecture/007-redux-dashboard-breadcrumbs.md) |

## Rules

1. **No React imports** in `src/model` — keep types usable on server and client.
2. **No secrets or env reads** — configuration stays in **`src/config`**.
3. **Barrel imports** — Consumers use `import type { Lead } from '@/model'` (or value imports for const enums if any), not deep paths like `@/model/lead/Lead`, unless re-export rules make an exception for a one-off.
4. **API ↔ TypeScript naming** — Express/Postgres may use **`snake_case`**; mapping to **`camelCase`** often happens in **`src/api`** or thunks when building objects for Redux. Document field correspondence in JSDoc on the **`type`** when non-obvious (see `Lead` / `LeadSummary` examples).

## Special cases

- **`breadcrumb/`** — Discriminated unions for **`breadcrumbBuilder`** state; must stay **JSON-serializable** (ADR **007**).
- **`shared/`** — Small reusable pieces (`Timestamps`, etc.), not a dumping ground for feature logic.

## Checklist (new entity or field)

- [ ] Add or extend **`type`** in `src/model/<domain>/`** with JSDoc if the shape mirrors a server contract.
- [ ] Export from **`src/model/<domain>/index.ts`** and **`src/model/index.ts`**.
- [ ] Update **`src/store`** dumps / slices types if persisted state changes.
- [ ] Update **`src/api`** mappers if response mapping changed—keep **`model`** as the UI/store source of truth for **domain** naming after mapping.

## Related

- **`src/packages/README.md`** — feature UI that consumes **`@/model`** types.
- **`src/store/README.md`** — normalized entities keyed by id; references model types.
- **`src/utils/README.md`** — pure transforms that should not duplicate domain shapes ad hoc.
- **`src/api/README.md`** — HTTP layer that maps wire formats to model-friendly objects.
