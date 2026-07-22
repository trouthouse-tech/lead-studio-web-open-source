# 011 — Client API Error Handling

## Status
Accepted

## Context

Admin CMS API calls in **lead-studio-web-open-source** previously duplicated bare `fetch`, manual JSON parsing, and inconsistent thunk failure mapping. Some code routed through a Next.js BFF catch-all proxy; that pattern is **not** used in sibling admin apps (roads-console, luckee-web primary path).

This ADR defines the **requestApi transport layer** aligned with the luckee how-to: [client-api-error-handling-next-express.md](https://github.com/luckee/mentorai-server/blob/main/data/how-to/client-api-error-handling-next-express.md).

## Decision

### 1) Direct Express from the browser

Lead Studio API calls go **directly** to lead-studio-express-server:

```text
Browser → requestApi → ${API_CONFIG.SERVER_URL}/api/data/*
```

- Env: `API_CONFIG.SERVER_URL`, optional `optional auth headers` (Bearer).
- **No** catch-all Next.js `/api/data/[...path]` proxy for standard admin CRUD.
- Selective Next route handlers are allowed only when server-only secrets require them (roads-seller-web pattern) — not used for leads/contacts in this repo.

### 2) Shared JSON contract

Express handlers return:

```json
{ "success": true, "data": { ... } }
{ "success": false, "error": "..." }
```

Cross-link: [lead-studio-express-server 006-logging-and-error-response-standards.md](../../../lead-studio-express-server/.cursor/architecture/006-logging-and-error-response-standards.md).

HTTP status: `200` success, `400` client error, `500` server error.

### 3) `ApiResult<T>`

```typescript
export type ApiResult<T> = ApiResponse<T> & { httpStatus: number };
```

| `httpStatus` | Meaning |
|--------------|---------|
| `200`–`599` | From HTTP response |
| **`0`** | Browser network failure (`fetch` threw) |

Domain API modules return **`ApiResult<T>`**, not bare `ApiResponse<T>`.

### 4) Transport lives in `src/api/_shared/`

| File | Role |
|------|------|
| `types.ts` | `ApiResponse`, `ApiResult` |
| `parse-api-json.ts` | Safe JSON parse; validate `{ success }` |
| `request-api.ts` | **Only** place that calls `fetch` for domain APIs |
| `map-api-failure-to-thunk-status.ts` | `400` vs `500` helper for thunks |

Domain files under `src/api/leads/`, `src/api/lead-contacts/`, and other domain folders are thin wrappers: build URL via `src/api/config.ts`, call `requestApi`, map domain types.

**Forbidden:** bare `fetch` in domain API files; HTTP I/O in `src/utils/`.

### 5) Thunk mapping

```typescript
const result = await getAllBlogs();
if (!result.success || !result.data) {
  return mapApiFailureToThunkStatus(result);
}
// dispatch success
return 200;
```

- API failures from `requestApi` are **not** thrown — no `reportThunkError` on `!result.success`.
- `catch` blocks are for unexpected bugs only.
- Thunks return `Promise<200 | 400 | 500>` per [001-redux-patterns.md](./001-redux-patterns.md).

### 6) Unexpected thunk error reporting (`reportThunkError`)

Call `reportThunkError` **only** in unexpected `catch` blocks (bugs / thrown exceptions), never on expected `!result.success` / `mapApiFailureToThunkStatus` paths.

```typescript
import { coerceErrorFields, reportThunkError } from '@/api/thunk-errors';

} catch (error) {
  const { message, stack } = coerceErrorFields(error);
  reportThunkError({
    event: 'failedToGetAllLeads',
    message,
    stack,
    thunkName: 'getAllLeadsThunk',
  });
  console.error('❌ getAllLeadsThunk error:', error);
  return 500;
}
```

Rules:

- **Sync void API** — `reportThunkError(body): void`; fire-and-forget `fetch` to `${API_CONFIG.SERVER_URL}/api/data/thunk-errors/report`; never throws (`.catch(() => {})`).
- **Prod only** — no-ops when `process.env.NODE_ENV === 'development'`.
- Unique camelCase `event` per thunk (`failedTo*` + action name).
- Related helpers: `reportUiError` (`src/api/ui-errors/`), `reportApiError` (`src/api/api-errors/`) — same prod-only fire-and-forget pattern.
- **UI ErrorBoundary** — `src/components/error-boundary/` wraps the dashboard layout (`src/app/(dashboard)/layout.tsx`). On catch it calls `reportUiError` with `event`, `message`, `stack`, `routePath`, and `componentName`, then shows a simple fallback UI.

### 7) Non-goals (v1)

- Next.js BFF catch-all for admin CMS

## Related ADRs

- [004-api-integration.md](./004-api-integration.md) — domain layout, thunk-only access
- [001-redux-patterns.md](./001-redux-patterns.md) — status unions
- [010-public-blog-express-fetch.md](./010-public-blog-express-fetch.md) — public marketing reads (separate repo)

## PR checklist

- [ ] Domain API uses `requestApi`; no bare `fetch`
- [ ] Returns `ApiResult<T>`
- [ ] Thunk maps `httpStatus` via `mapApiFailureToThunkStatus` or explicit `=== 400`
- [ ] URL built with `API_CONFIG.SERVER_URL`
- [ ] Unexpected thunk `catch` blocks call `reportThunkError` (prod-only; not on `!result.success`)
