# `src/packages` — Feature modules

**Domain-owned UI and behavior** for Lead Studio: one folder per **screen or workflow** (e.g. **`leads/`**, **`lead-detail-page/`**, **`dashboard/`**). Route files under **`src/app`** import the package’s main export and wrap it in **`AppLayout`**—they do not duplicate feature UI.

## Layout (typical)

```text
src/packages/<feature>/
  index.tsx           # Main exported component (required) — use named export: `export const Leads = …`
  …                   # Subfolders: table/, filters/, header/, modals/, etc.
```

- Prefer **`index.tsx`** as the entry (not `index.ts`) for feature roots that render React.
- Split large UIs into subcomponents in the same package; keep **`src/components/`** for **cross-feature** chrome only (see **`src/components/README.md`**).

## Conventions (see `.cursor/architecture/`)

| Topic | ADR |
|-------|-----|
| Thin **`page.tsx`**, fat package | [002 — Component composition](../../.cursor/architecture/002-component-composition.md) |
| Named exports, barrels | [005 — File organization](../../.cursor/architecture/005-file-organization.md) |
| Manual thunks, no `createAsyncThunk` | [001 — Redux patterns](../../.cursor/architecture/001-redux-patterns.md) |

## Redux and API in *this* repo

ADR **002** shows optional **`store/`** and **`api/`** *inside* a package; **Lead Studio centralizes** those:

| Concern | Location |
|---------|----------|
| Slices, builders, dumps | **`src/store/`** |
| Thunks | **`src/store/thunks/<domain>/`** |
| HTTP clients | **`src/api/<domain>/`** |
| Domain **`type`**s | **`src/model/`** |

Packages **dispatch** thunks via **`useAppDispatch`** / **`useAppSelector`** from **`@/store/hooks`** and import thunks from **`@/store/thunks/...`**. Do not add thin **hooks whose only job is wrapping one thunk** (ADR **002**).

## Styling

Follow ADR **003**: Tailwind utility strings (often collected in a **`styles`** object **below** the component). No separate `.css` files per feature unless an ADR allows it.

## Checklist (new or expanded feature)

- [ ] New UI lives under **`src/packages/<feature>/`**, not **`src/components/`**, unless it is reused across unrelated domains.
- [ ] **`src/app/(dashboard)/.../page.tsx`** only wires **`AppLayout`**, breadcrumbs, and **`import { YourScreen } from '@/packages/your-feature'`**.
- [ ] New async flows: add or reuse thunks in **`src/store/thunks`**, **`AppThunk`** return codes **`200 | 400 | 500`** per ADR **001**.
- [ ] New entities: extend **`src/model`**, **`src/api`**, and store dumps/slices as needed.
- [ ] If **`src/config/routes.ts`** needs a new path constant for navigation, add it there.

## Examples (non-exhaustive)

- **`dashboard/`** — Home dashboard shell and widgets.
- **`leads/`** — Commercial leads list, filters, create lead.
- **`lead-detail-page/`**, **`lead-contact-detail-page/`** — Detail workspaces.

## Related

- **`src/app/README.md`** — route + breadcrumb ownership.
- **`src/model/README.md`** — types packages consume from **`@/model`**.
- **`src/store/README.md`** — thunks, slices, dumps; ADR **001**.
