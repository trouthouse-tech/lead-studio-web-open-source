# `src/store` — Redux

Single **`configureStore`** for the app: **normalized entity dumps**, **`current*`** slices for editing, **builders** (e.g. breadcrumb trail), **filters**, and **thunks** that call **`src/api`**. Import **`useAppDispatch`**, **`useAppSelector`**, and types from **`@/store`** (see **`index.ts`**).

## Layout

| Area | Role |
|------|------|
| **`store.ts`** | `configureStore`, **`RootState`**, **`AppDispatch`**, **`AppThunk`** |
| **`reducer.ts`** | Combines slice reducers |
| **`hooks.ts`** | Typed **`useAppDispatch`** / **`useAppSelector`** |
| **`dumps/`** | Normalized **`Record<id, Entity>`** collections |
| **`current/`** | Single-record editing state (**`currentLead`**, …) — avoid storing large objects in builder slices (see project rules) |
| **`builders/`** | UI builders (e.g. **`breadcrumbBuilder`**) — **serializable** only (ADR **007**) |
| **`filters/`** | List / table filter state |
| **`thunks/<domain>/`** | Async side effects; call **`src/api`**, dispatch slice actions |
| **`config/`** | Store-level config if any |

**No `selectors/`** — derive with `useMemo` in packages (ADR **001**).

## Conventions (see `.cursor/architecture/`)

| Topic | ADR |
|-------|-----|
| Manual thunks, **`AppThunk<Promise<200 \| 400 \| 500>>`**, no **`createAsyncThunk`** | [001 — Redux patterns](../../.cursor/architecture/001-redux-patterns.md) |
| Breadcrumb builder state | [007 — Redux dashboard breadcrumbs](../../.cursor/architecture/007-redux-dashboard-breadcrumbs.md) |
| File layout vs **`src/packages`** | [005 — File organization](../../.cursor/architecture/005-file-organization.md) |

## Rules

1. **Thunks** live under **`src/store/thunks/<domain>/`**, not inside **`src/packages`** (this repo’s pattern).
2. **Reducers stay dumb** — no heavy business logic; use thunks for orchestration and **`src/utils`** for pure transforms.
3. **Serializable state** in slices Redux DevTools can record; **`serializableCheck`** is off in **`store.ts`** for **`Blob`/`File`** (see comment there)—do not use that as an excuse to store functions in plain slices.
4. **Entity updates** go through defined actions; keep import boundaries clean to avoid cycles (**`store` → `api` → `model`**, not the reverse from `api` into store modules at init).

## Checklist (new flow)

- [ ] Add or extend a **slice** / **dump** / **current** module as needed; register in **`reducer.ts`**.
- [ ] Add **thunk** under **`thunks/<domain>/`** returning **200 / 400 / 500** per ADR **001**.
- [ ] Wire **`src/api`** client calls in the thunk; map responses to **`src/model`** shapes before dispatching.
- [ ] If the feature needs **breadcrumb** behavior, follow ADR **007** and **`src/utils/dashboard-breadcrumbs`**.

## Related

- **`src/packages/README.md`** — dispatches thunks from UI.
- **`src/api/README.md`** — HTTP clients thunks call.
- **`src/utils/README.md`** — pure helpers used inside thunks and packages.
- **`src/model/README.md`** — types for entities in dumps / `current*`.
