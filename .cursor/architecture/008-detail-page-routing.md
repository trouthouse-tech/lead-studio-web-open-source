# 008 - Detail page routing (static paths, Redux `current*`)

## Status

Accepted

## Context

Dynamic App Router segments (`/orders/[id]`, `/users/[userId]`) and query-param identity (`?orderId=`) couple URLs to entity ids. **lead-studio-web-open-source** uses **static detail routes** (`/lead-detail-page`, `/lead-contact-detail-page`) and stores the open entity in a **`current*`** Redux slice (`currentLead`, `currentLeadContact`) instead.

## Decision

### 1) Forbidden route patterns

❌ Do not use:

```text
src/app/orders/[id]/page.tsx
src/app/users/[userId]/page.tsx
src/app/jobs/[jobId]/page.tsx
```

❌ Do not use query params as the source of truth for which row is open:

```text
/orders?orderId=abc
/orders/detail?id=abc
```

### 2) Required pattern

✅ Use a **static** segment named `{entity}-detail-page` (kebab-case):

```text
src/app/order-detail-page/page.tsx
src/app/user-detail-page/page.tsx
src/app/job-detail-page/page.tsx
```

✅ Define path constants (e.g. `src/config/routes.ts`):

```ts
export const ORDERS_PATH = '/orders';
export const ORDER_DETAIL_PAGE_PATH = '/order-detail-page';
```

### 3) Opening a detail screen

1. Dispatch a thunk that sets the **`current*`** slice (load from dump/API if needed).
2. `router.push(ORDER_DETAIL_PAGE_PATH)` from the client component.

```ts
export const openOrderDetailThunk =
  (orderId: string): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch, getState) => {
    const order = getState().orders[orderId];
    if (!order) {
      // fetch + upsert dump, then set current
    }
    dispatch(CurrentOrderActions.setCurrentOrder(order));
    return 200;
  };
```

```tsx
const dispatch = useAppDispatch();
const router = useRouter();

const onRowClick = (id: string) => {
  void dispatch(openOrderDetailThunk(id)).then((status) => {
    if (status === 200) router.push(ORDER_DETAIL_PAGE_PATH);
  });
};
```

### 4) Detail package reads Redux only

- `src/packages/order-detail-page/` reads **`currentOrder`** (whole slice per [001](./001-redux-patterns.md)).
- No `useParams()`, no `useSearchParams()` for entity id on the detail page.

### 5) App pages stay thin

```tsx
// src/app/order-detail-page/page.tsx
import { OrderDetailPage } from '@/packages/order-detail-page';

export default function Page() {
  return <OrderDetailPage />;
}
```

### Lead Studio paths

| Constant | Path | Current slice |
|----------|------|---------------|
| `LEAD_DETAIL_PATH` | `/lead-detail-page` | `currentLead` |
| `LEAD_CONTACT_DETAIL_PATH` | `/lead-contact-detail-page` | `currentLeadContact` |

Open via thunk + `router.push(LEAD_*_PATH)` with **no** query-string entity ids.

## Consequences

- No shareable deep links to a specific row unless a future ADR adds an explicit URL contract.
- Navigation chrome may need **both** list and detail paths in `activePathPrefix` / breadcrumb config.
- Entity id lives in **`current*`** and **`builders`** primitives only — never in the URL for detail.

## References

- [001 – Redux patterns](./001-redux-patterns.md) — `current*` slices
- [002 – Component composition](./002-component-composition.md) — thin `app/` pages
