# Next.js — Agent Rules (Lead Studio Web)

BEFORE implementing ANY feature, you MUST:
1. Read `.cursor/architecture/README.md`.
2. Read the relevant ADRs (**001–008**, **011**, **016**).
3. Follow documented patterns EXACTLY; if no pattern exists, add an ADR first.

## Redux — zero selector functions

- **No** `createSelector`, Reselect, `src/store/selectors/`, or `**/selectors.ts`.
- **`useAppSelector` only** as `(state) => state.<sliceKey>` — one whole top-level slice per call, **no** transforms inside the callback.
- **Derive** with `useMemo` in components (`Object.values`, `[id]` lookup, filters, joins).
- **No** view-models or joined row types stored in Redux.

## Routing — static detail pages

- **Never** `src/app/{entity}/[id]/page.tsx` or `[orderId]` dynamic segments.
- **Use** `src/app/{entity}-detail-page/page.tsx` (e.g. `/lead-detail-page`, `/lead-contact-detail-page`).
- Detail screen reads **`current*`** from Redux; open via thunk + `router.push(DETAIL_PAGE_PATH)`.
- **No** `useParams` / `useSearchParams` for entity id on detail pages.

## Utils — generic only

- `src/utils/{capability}/` — `date/`, `string/`, `number/` (formatters, parsers, clamps).
- **Not** `src/utils/{table}/` — no `utils/leads/format-lead-status.ts`.
- Table/screen-specific formatters live in **`src/packages/{feature}/`**.

## Non-negotiable rules

### Redux
1. Flat layers: `dumps/`, `current/`, `builders/`, `config/` (and `filters/` when needed) per [001](../architecture/001-redux-patterns.md).
2. Manual thunks only (`AppThunk<Promise<200 | 400 | 500>>`); no `createAsyncThunk`.
3. Async side effects in thunks only, not components.

### Components
1. Thin `src/app/**/page.tsx`; feature UI in `src/packages/<feature>/`.
2. Shared UI in `src/components/`.
3. Call thunks directly — no custom hooks that only wrap thunks.
4. `export const` components; `type` not `interface`.

### Styling
1. Styles object pattern per [003](../architecture/003-styling-rules.md).
2. No inline `style={{}}` except truly dynamic one-off values; no per-component CSS modules.

### API
1. Domain APIs MUST use `requestApi` from `src/api/_shared/`; NEVER bare `fetch` or `getApiClient` in domain files.
2. Domain APIs MUST return `ApiResult<T>`; thunks MUST map failures with `mapApiFailureToThunkStatus`.
3. Components never call `src/api/**` directly.

### Files
1. kebab-case, one export per file, barrel `index.ts` per folder per [005](../architecture/005-file-organization.md).

Before editing **user-facing copy**, read mentorai-server copy-voice and drafting-constraints docs when applicable.

## Quick reference

- Architecture index → `.cursor/architecture/README.md`
- Redux → `.cursor/architecture/001-redux-patterns.md`
- Components → `.cursor/architecture/002-component-composition.md`
- Styling → `.cursor/architecture/003-styling-rules.md`
- API integration → `.cursor/architecture/004-api-integration.md`
- File organization → `.cursor/architecture/005-file-organization.md`
- Constants / utilities → `.cursor/architecture/006-constants-utilities.md`
- Dashboard breadcrumbs → `.cursor/architecture/007-redux-dashboard-breadcrumbs.md`
- Detail page routing → `.cursor/architecture/008-detail-page-routing.md`
- Client API error handling → `.cursor/architecture/011-client-api-error-handling.md`
- Chat studio UI contract → `.cursor/architecture/016-standalone-chat-studio-ui-contract.md`
