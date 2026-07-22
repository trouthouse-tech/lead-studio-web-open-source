# 004 - API Integration Patterns (Next.js)

## Objective

Define one consistent API integration pattern for **lead-studio-web-open-source** so data flow, typing, and error handling are predictable.

## Required Rules

1. **API functions live in `src/api/{domain}/` only.**
2. **Domain APIs return `ApiResult<T>`** (`ApiResponse<T>` + `httpStatus`) via `requestApi`.
3. **Components never call API functions directly.** Components dispatch thunks; thunks call API functions.
4. **Error handling must be explicit and status-code driven** (`mapApiFailureToThunkStatus`).
5. **JSDoc is required** on exported API functions and thunks.

---

## 1) File and Ownership Pattern

```text
src/
  api/
    _shared/
      types.ts
      parse-api-json.ts
      request-api.ts
      map-api-failure-to-thunk-status.ts
      index.ts
    leads/
      getAllLeads.ts
      index.ts
  store/
    thunks/
      leads/
        getAllLeadsThunk.ts
```

- `src/api/_shared/request-api.ts`: **sole** browser `fetch` for domain APIs.
- `src/api/{domain}/*.ts`: thin wrappers — build URL, call `requestApi`, return `ApiResult<T>`.
- `src/store/thunks/**`: the **only** client-side layer allowed to call `src/api/**`.

**Forbidden:** bare `fetch` in domain API files; `getApiClient` / throw-based clients; HTTP I/O in components or `src/utils/`.

---

## 2) Shared JSON contract

Express returns:

```json
{ "success": true, "data": { ... } }
{ "success": false, "error": "..." }
```

```ts
// src/api/_shared/types.ts
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type ApiResult<T> = ApiResponse<T> & { httpStatus: number };
```

| `httpStatus` | Meaning |
|--------------|---------|
| `200`–`599` | From HTTP response |
| **`0`** | Network failure (`fetch` threw) |

See [011 – Client API error handling](./011-client-api-error-handling.md).

---

## 3) Domain API example

```ts
// src/api/leads/getAllLeads.ts
import { API_CONFIG } from '@/config/api';
import { requestApi } from '@/api/_shared';
import type { Lead } from '@/model';

export const getAllLeads = () =>
  requestApi<Lead[]>(`${API_CONFIG.SERVER_URL}/api/data/leads`);
```

---

## 4) Thunk mapping

```ts
import { mapApiFailureToThunkStatus } from '@/api/_shared';

export const getAllLeadsThunk = (): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch) => {
    const result = await getAllLeads();
    if (!result.success || !result.data) {
      return mapApiFailureToThunkStatus(result);
    }
    dispatch(LeadsActions.setLeads(result.data));
    return 200;
  };
```

---

## Related

- [001 – Redux patterns](./001-redux-patterns.md)
- [011 – Client API error handling](./011-client-api-error-handling.md)
