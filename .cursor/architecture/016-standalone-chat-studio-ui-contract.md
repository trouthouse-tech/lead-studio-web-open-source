# ADR 016: Standalone chat studio UI contract (inline shell)

## Status

Accepted

## Context

Chat-driven studios in Luckee and in OSS forks (`icp-studio-web`, `knowledge-studio-open-source`) need a **shared visual and structural contract** so the coach + workspace layout stays consistent without introducing fragile abstractions.

## Decision

### 1. No slot-style layout shell

Do **not** implement or document a reusable React component whose API is **prop-driven panes**, for example:

- `chatColumn`, `builderColumn`, or `topBar` passed as `ReactNode` / render props / “slots” objects.

Each studio’s package root (**e.g.** `src/packages/<studio>/index.tsx`) must use **inline JSX**: a fixed sequence of elements (`root` → `shell` → `chatPane` → optional `divider` → `builderPane`) with **direct imports** of concrete components (`<FooChatColumn />`, `<FooBuilderColumn />`). Duplicating the same Tailwind / `styles` strings across studios is **acceptable** and preferred over a generic `<StudioShell />` wrapper.

### 2. Normative shell geometry (desktop)

Reference implementations in this repo:

- [`src/packages/icp-studio/index.tsx`](../../src/packages/icp-studio/index.tsx) (ICP; `root` includes `bg-zinc-50`)
- [`src/packages/youtube-studio/index.tsx`](../../src/packages/youtube-studio/index.tsx) (YouTube transcript; `root` without duplicate shell bg on outer—`shell` carries `bg-zinc-50`)

Shared tokens (names are conventional; classes should match these roles):

| Region | Role |
|--------|------|
| `root` | Full-width flex column; `min-w-0`; on `lg`: `min-h-0 flex-1` so the studio fills the dashboard main area. |
| `shell` | `bg-zinc-50`; `lg:flex-row lg:gap-5 lg:overflow-hidden`; stacks vertically on small screens. |
| `chatPane` | **~55%** on `lg` (`lg:max-w-[55%]`, `lg:flex-1`); `border border-gray-200`; holds the chat column **inner** UI (header strip, thread, composer). |
| `divider` | `hidden lg:block`; vertical rule between panes. |
| `builderPane` | **~45%** on `lg` (`lg:w-[45%] lg:max-w-[45%]`); `overflow-hidden` + `rounded-sm` on the **outer** builder container. |

**Mobile:** panes stack; chat pane is typically first in DOM order (chat-first).

### 3. Scroll ownership

- **Chat thread:** scroll lives **inside** the chat column (e.g. a `threadWrap` / messages region with `lg:min-h-0 lg:flex-1 lg:overflow-y-auto`), not the whole window. See [`src/packages/icp-studio/workspace/chat-column/index.tsx`](../../src/packages/icp-studio/workspace/chat-column/index.tsx).
- **Builder:** outer builder wrapper is `overflow-hidden`; **inner** body uses `flex-1 min-h-0 overflow-y-auto` for sections / forms. See [`src/packages/icp-studio/builder-column/index.tsx`](../../src/packages/icp-studio/builder-column/index.tsx).

### 4. Chrome: single outer card

Do **not** wrap builder content in a second full “card” (`rounded-xl` + heavy border) inside `builderPane` if the product already treats the pane as the outer chrome—avoid **double borders** (see playbook anti-pattern).

### 5. Required files (standalone Next app)

Minimum surface for one studio in an OSS-style app (names may vary; responsibilities must exist):

| Area | Responsibility |
|------|----------------|
| `src/app/(dashboard)/<route>/page.tsx` | Thin route: app chrome (`AppLayout`, often `fullWidth`) + studio package root. |
| `src/packages/<studio>/index.tsx` | **Inline** two-pane shell + route-level modals only; no slot-props shell. |
| `src/packages/<studio>/chat-column/` (or `workspace/` + chat pieces) | Thread, composer, loading/error UI; optional in-column title strip. |
| `src/packages/<studio>/builder-column/` (or `workspace/right-panel/`) | Builder header / sections / save actions; inner vertical scroll. |
| Optional `top-bar/` | Global actions that must not live inside either column. |
| `src/store/` | `current*` for session entity; dumps/builders; thunks for load / send / save (status `200 \| 400 \| 500` per project rules). |
| `src/api/<domain>/` | Fetch helpers; env base URL (e.g. `NEXT_PUBLIC_SERVER_URL`). |

**Backend (separate repo):** Express domain router, `src/data` CRUD, migrations, AI config—see [`mentorai-server/docs/creating-chat-driven-ai-studios-playbook.md`](../../../mentorai-server/docs/creating-chat-driven-ai-studios-playbook.md) for the full-stack checklist.

### 6. OSS alignment

Standalone repos **icp-studio-web** and **knowledge-studio-open-source** should match this **inline** shell contract so they stay visually aligned with Luckee; each repo’s README links here for the UI contract.

## Consequences

- New studios copy the **DOM structure and class roles** from ICP or YouTube package roots rather than importing a layout factory.
- Documentation and AI prompts must **not** reference `IcpStudioLayout` or `{ chatColumn, builderColumn }` APIs; point to this ADR and the concrete `index.tsx` files above.

## Related

- [`mentorai-server/docs/creating-chat-driven-ai-studios-playbook.md`](../../../mentorai-server/docs/creating-chat-driven-ai-studios-playbook.md)
- [`mentorai-server/docs/chat-driven-ai-studios-thread-summary.md`](../../../mentorai-server/docs/chat-driven-ai-studios-thread-summary.md) (narrative; layout section should stay consistent with this ADR)
