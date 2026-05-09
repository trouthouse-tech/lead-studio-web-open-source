# ADR 007: Redux-driven dashboard breadcrumbs

## Status

Accepted

## Context

Dashboard screens render inside `AppLayout`, which previously accepted `breadcrumbs` and `baseBreadcrumbOverride` props. Dropdown switchers required `menuItems` with `onSelect` closures, which cannot live in Redux. Many routes repeated similar breadcrumb arrays.

## Decision

1. **`breadcrumbBuilder` slice** (`src/store/builders/breadcrumbBuilder.ts`) holds a serializable trail: optional `base` (`label` + optional `href`) and `segments` typed in `src/model/breadcrumb/index.ts`.
2. **Resolution in the client layer**: `useResolvedDashboardBreadcrumbs` (`src/components/app-layout-header/use-resolved-dashboard-breadcrumbs.ts`) reads the builder plus entity dumps and returns `AppLayoutBreadcrumb[]`, attaching `onSelect` only at read time. Entity dropdowns use `resolveEntitySwitcherBreadcrumb` (`src/utils/dashboard-breadcrumbs/resolve-entity-switcher-breadcrumb.ts`); non-entity menus (e.g. time-tracking view) stay as dedicated segment kinds in the hook.
3. **Route ownership**: `app/(dashboard)/**/page.tsx` files register trails with `useEffect` (detail pages) or `useRegisterStaticDashboardBreadcrumbs` (`src/utils/dashboard-breadcrumbs/`) for static crumbs. They reset on unmount where appropriate.
4. **Stale trail guard**: `AppLayout` dispatches `BreadcrumbBuilderActions.reset()` in a `useLayoutEffect` keyed on `pathname` so the trail never survives a client-side route change before the next page registers.
5. **Nav-only fallback**: When the builder trail is empty, `AppLayout` shows a single crumb from `resolveDefaultNavBreadcrumbForPathname` so list pages without explicit registration still match the sidebar section.
6. **Presentation**: `BreadcrumbBar` contains dropdown/open-menu behavior; `AppLayoutHeader` composes the sidebar toggle with it.

## Consequences

- New entity dropdown kinds require: extend `BreadcrumbEntitySwitcherKind`, add a handler row to `entitySwitcherRegistry` in `resolve-entity-switcher-breadcrumb.ts` (list source + `setCurrent*Thunk`), and register from the route with `entityKind` matching that row.
- Non-entity menus that need routing (e.g. future patterns) can add a new serializable `kind` and branch in the resolver hook (see `timeTrackingView`).
- Do not store functions or React nodes in `breadcrumbBuilder` state.

## Checklist: new dashboard page

1. **List / section page (no trail)** — do nothing; nav fallback covers it if the path is mapped in `resolveDefaultNavBreadcrumbForPathname`.
2. **Static trail** (fixed labels + links) — in the page (client): `useRegisterStaticDashboardBreadcrumbs([...])` or `dispatch(BreadcrumbBuilderActions.setTrail({ base, segments }))` with `staticLink` / `plainText` segments only; cleanup on unmount if the page owns the trail exclusively.
3. **Detail page with entity switcher** — extend model kinds if needed, add registry row, then `setTrail` with an `entitySwitcher` segment (`entityKind`, `currentId`, optional `isPendingSelection`). Switcher behavior is selected by `entityKind`, not inferred from the URL.

## Related files

- Narrative (canonical post): in **mentorai-server**, `data/published/dashboard-navigation/blog-app-layout-dashboard-navigation.md`
- Model: `src/model/breadcrumb/index.ts`
- Slice: `src/store/builders/breadcrumbBuilder.ts`
- Resolver: `src/components/app-layout-header/use-resolved-dashboard-breadcrumbs.ts`
- Entity switcher registry: `src/utils/dashboard-breadcrumbs/resolve-entity-switcher-breadcrumb.ts`
- Static helper: `src/utils/dashboard-breadcrumbs/`
- Nav base helper: `src/components/navigation/resolve-default-nav-breadcrumb-for-pathname.ts`
