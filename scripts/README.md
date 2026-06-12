# Local dev launcher

Use **[Luckee Dev Hub](https://github.com/Luckee-Core/luckee-hub)** + **[luckee-hub-express-server](https://github.com/Luckee-Core/luckee-hub-express-server)** to start Lead Studio (Express + Next.js), open your Cursor workspace, and launch Chrome.

## Setup

```bash
# Clone luckee-hub and luckee-hub-express-server (see getting-started repo)
cd luckee-hub-express-server
cp hub.local.json.example hub.local.json
# Edit hub.local.json — set webDir / expressDir / workspaceFile for lead-studio
```

Ensure `.env` exists in **lead-studio-express-server** and `.env.local` in this repo.

## Run

```bash
zsh luckee-hub/scripts/start-luckee-hub-dev.sh
# Or install Desktop app: zsh luckee-hub/scripts/install-luckee-hub-dev-app.sh
```

Open [http://localhost:4100](http://localhost:4100) and press **Run** on Lead Studio.

Debug log: `/tmp/luckee-hub/launcher.log`
