# Architecture Documentation

This folder contains Architecture Decision Records (ADRs) for our Next.js codebase. Each ADR documents a decision, why it was made, and how to apply it consistently.

## Why ADRs?

ADRs keep implementation consistent across the project by documenting:

- **What** standard we follow
- **Why** we chose it
- **How** to apply it in everyday development

## Next.js ADR Index

1. [Redux patterns](./001-redux-patterns.md) — Global state boundaries, slice design, and store usage.
2. [Component composition](./002-component-composition.md) — Client boundaries, colocation, and reusable UI structure.
3. [Styling rules](./003-styling-rules.md) — Tailwind conventions, composition, and tokens.
4. [API integration](./004-api-integration.md) — API layer patterns, typing, and UI/data separation.
5. [File organization](./005-file-organization.md) — Folder boundaries, naming rules, and import conventions.
6. [Constants and utilities](./006-constants-utilities.md) — Shared constants, pure helpers, and extraction rules.
7. [Redux dashboard breadcrumbs](./007-redux-dashboard-breadcrumbs.md) — Serializable trail, resolver hook, route registration.
8. [Standalone chat studio UI contract](./016-standalone-chat-studio-ui-contract.md) — Inline two-pane shell (55/45), scroll ownership, no slot-prop layout components; OSS alignment.

## How to Use

1. Open the ADR most relevant to your feature.
2. Follow the approved patterns in implementation.
3. Add new ADRs here whenever architectural decisions change.

**Per-folder source guides** (where code for each layer lives): see the **Documentation map** in the repository root **`README.md`** (links to every **`src/*/README.md`**).
