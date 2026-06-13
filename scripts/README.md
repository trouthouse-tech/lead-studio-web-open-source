# Local dev launcher

Use **Luckee Dev Hub** to run Lead Studio (Express + Next.js), open Cursor, and launch Chrome.

**Full documentation:** [`mentorai-server/data/how-to/central-hub/`](https://github.com/trouthouse-tech/mentorai-server/tree/main/data/how-to/central-hub) — start at [setup-and-run.md](https://github.com/trouthouse-tech/mentorai-server/blob/main/data/how-to/central-hub/setup-and-run.md).

## Quick start

```bash
cd luckee-hub-express-server && cp hub.local.json.example hub.local.json
# Add lead-studio paths to hub.local.json (see central-hub/hub-local-config.md)
zsh luckee-hub/scripts/start-luckee-hub-dev.sh
```

Open [http://localhost:4100](http://localhost:4100) → **Run** on Lead Studio.

Ensure `.env` in **lead-studio-express-server** and `.env.local` in this web repo.

Debug log: `/tmp/luckee-hub/launcher.log`
