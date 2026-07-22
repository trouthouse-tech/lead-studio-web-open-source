# `src/api` — HTTP clients

This folder holds **browser-facing HTTP helpers** built on **`requestApi`** (`_shared/request-api.ts`) and consumed by Redux thunks and UI. It does **not** define Express or Next route handlers.

## Transport layer (`src/api/_shared/`)

| File | Role |
|------|------|
| `types.ts` | `ApiResponse<T>`, `ApiResult<T>` (`httpStatus` included) |
| `parse-api-json.ts` | Safe JSON parse from `fetch` `Response` |
| `request-api.ts` | **Only** place that calls `fetch` for domain APIs; never throws |
| `map-api-failure-to-thunk-status.ts` | Maps failed `ApiResult` to thunk status `400` vs `500` |

Domain modules under `src/api/leads/`, `src/api/lead-contacts/`, etc. build URLs (via `src/config/api.ts`), call `requestApi`, and return **`ApiResult<T>`**.

Thunks should check `result.success` and use `mapApiFailureToThunkStatus(result)` on failure — not `.ok`, `.text()`, or thrown errors from API helpers.

See **`.cursor/architecture/011-client-api-error-handling.md`** for the full contract.

## Security and configuration

- **Trust model, env vars, and production checklist:** see **`README.md`** at the repo root (*Local development and trust*).
- **Disclosure and reporting:** see **`SECURITY.md`** at the repo root.
- **API base URL and `NEXT_PUBLIC_*` behavior:** **`src/config/api.ts`** (`API_CONFIG.SERVER_URL`, production guards); overview **`src/config/README.md`**.

Do not put server-only secrets in this layer; anything consumed here from `NEXT_PUBLIC_*` is visible in the client bundle.

## Related

- **`src/packages/README.md`** — features dispatch thunks that call these clients.
- **`src/store/README.md`** — thunks that wrap these API functions.
- **`src/utils/README.md`** — pure parsing/formatting after fetch when needed.
- **`src/config/README.md`** — env split (`SERVER_URL` vs Next app URL), `routes.ts`, checklists.
- **`src/model/README.md`** — domain types after mapping response JSON to app shapes.
