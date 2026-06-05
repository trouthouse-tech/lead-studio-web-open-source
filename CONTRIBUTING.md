# Contributing

Thanks for helping improve Lead Studio Web.

## Before you code

1. Read [`.cursor/architecture/README.md`](.cursor/architecture/README.md) and [`.cursor/rules/AGENTS.md`](.cursor/rules/AGENTS.md).
2. Per-folder guides: see the documentation map in [`README.md`](README.md).
3. OSS standards: [mentorai-server `data/open-source/`](https://github.com/trouthouse-tech/mentorai-server/tree/main/data/open-source).

## Patterns (short)

- Routes in `src/app/` stay thin; feature UI in `src/packages/`.
- Redux in `src/store/`; manual thunks only (no `createAsyncThunk`).
- HTTP clients in `src/api/` — browser calls Express via `NEXT_PUBLIC_SERVER_URL`.
- Never put server secrets in `NEXT_PUBLIC_*`.
- Follow ADRs for styling, file organization, and API integration.

## Pull requests

1. Run `npm run build` and `npm run typecheck` when touching TypeScript.
2. Update README or `docs/` for new routes, env vars, or trust-boundary changes.
3. Keep PRs focused; match style in touched files.

## Security

Report vulnerabilities per [`SECURITY.md`](SECURITY.md).
