# `src/api` — HTTP clients

This folder holds **browser-facing `fetch` helpers** and a small **`apiClient`** (`client/createApiClient.ts`) used by Redux thunks and UI. It does **not** define Express or Next route handlers.

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
