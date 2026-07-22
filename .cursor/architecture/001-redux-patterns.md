# 001 - Redux Patterns (Next.js)

## Status
Accepted

## Context
This ADR defines mandatory Redux patterns for **lead-studio-web-open-source** so async flows, slice state, and reducer behavior remain predictable across features.

## Decision

### 1) Use manual thunks only (`createAsyncThunk` is forbidden)
All async flows must be implemented as handwritten thunk functions. Do not use `createAsyncThunk`.

✅ **Do**
```ts
// src/store/thunks/crm/job-thunks.ts
import type { AppThunk } from "@/store";
import { JobsActions } from "@/store/dumps/jobs";
import { listJobsApi } from "@/api/job";

export const refreshJobsThunk = (): AppThunk<Promise<200 | 400 | 500>> => async (dispatch) => {
  const result = await listJobsApi();
  if (!result.success || !result.data) {
    return 500;
  }
  dispatch(JobsActions.upsertJobs(result.data));
  return 200;
};
```

❌ **Don't**
```ts
import { createAsyncThunk } from "@reduxjs/toolkit";

export const refreshJobs = createAsyncThunk("jobs/refresh", async () => {
  const response = await fetch("/api/data/job/list");
  return response.json();
});
```

---

### 2) Every thunk must use this signature: `AppThunk<Promise<200 | 400 | 500>>`
Thunk return values are status-code unions. This keeps dispatch call sites explicit and consistent.

✅ **Do**
```ts
import type { AppThunk } from "@/store";

export const updateJobThunk =
  (input: { id: string; status: JobStatus }): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch) => {
    const result = await updateJobApi(input);
    if (!result.success || !result.data) {
      return result.httpStatus === 400 ? 400 : 500;
    }
    dispatch(JobsActions.upsertJob(result.data));
    return 200;
  };
```

❌ **Don't**
```ts
export const updateJob = () => async () => {
  return true; // ambiguous return contract
};
```

---

### 3) Flat state layers: dumps, current, builders, config
State is organized as **top-level slices** under `src/store/`, not nested `dumps/current/builders` keys inside a single feature slice.

| Layer | Location | Holds |
|-------|----------|--------|
| **Dumps** | `src/store/dumps/{entity}.ts` | `Record<id, Entity>` — normalized catalogs from API |
| **Current** | `src/store/current/{entity}.ts` | Full domain object for the open detail screen |
| **Builders** | `src/store/builders/{feature}Builder.ts` | UI flags, wizard steps, modal open state — **primitives only** |
| **Config** | `src/store/config/` | Env / app-level settings |

✅ **Do**
```ts
// src/store/dumps/jobs.ts
type JobsState = Record<string, Job>;

// src/store/current/currentJob.ts
type CurrentJobState = Job;

// src/store/builders/studioBuilder.ts
type StudioBuilderState = {
  isCreateGraphicModalOpen: boolean;
  listLoadStatus: "idle" | "loading" | "error";
};
```

```ts
// src/store/reducer.ts
const rootReducer = combineReducers({
  jobs: jobsReducer,
  currentJob: currentJobReducer,
  studioBuilder: studioBuilderReducer,
});
```

Sentinel: `currentJob.id === ""` means no job selected.

❌ **Don't**
```ts
// Nested dumps/current inside one slice (legacy — do not add)
type OrdersState = {
  dumps: { list: Order[] };
  current: { selectedOrderId: string | null };
  builders: { step: string };
};
```

---

### 4) Current slices hold the editing object; builders hold primitives only
For detail screens, store the full entity in a dedicated `current*` slice. Builder slices hold IDs, booleans, strings, and literal unions — never nested objects or maps.

✅ **Do**
```ts
// Opening a job detail screen
dispatch(CurrentJobActions.setCurrentJob(job));
router.push(JOB_DETAIL_PAGE_PATH);

// Modal UI state separate from the entity
dispatch(StudioBuilderActions.openCreateGraphicModal());
```

❌ **Don't**
```ts
// Storing the editing entity in the same slice as modal state
type BuilderState = {
  isEditModalOpen: boolean;
  editingJob: Job; // forbidden — use currentJob slice
};
```

---

### 5) Zero selector functions (strict)

**Selector count in this template: zero.** That means:

| Forbidden | Allowed |
|-----------|---------|
| `createSelector` / Reselect | — |
| `src/store/selectors/` or `**/selectors.ts` | — |
| `useAppSelector` with transforms (`.filter`, `Object.values`, `[id]`, joins) | `useAppSelector` reading **one whole top-level slice** only |
| Storing view-models in Redux (`JobRow`, joined types) | `useMemo` in the component after reading raw slices |

✅ **Do** — identity slice reads + `useMemo` in the component:

```tsx
const jobs = useAppSelector((state) => state.jobs);
const currentJob = useAppSelector((state) => state.currentJob);
const companies = useAppSelector((state) => state.companies);

const jobList = useMemo(() => Object.values(jobs), [jobs]);

const companyName = useMemo(() => {
  const id = currentJob.companyId;
  return id ? companies[id]?.name : undefined;
}, [currentJob.companyId, companies]);
```

❌ **Don't** — derived logic inside `useAppSelector`:

```tsx
const jobList = useAppSelector((state) => Object.values(state.jobs)); // ❌
const job = useAppSelector((state) => state.jobs[jobId]); // ❌
const openJobs = useAppSelector((state) =>
  Object.values(state.jobs).filter((j) => j.status === "OPEN"),
); // ❌
```

```ts
// src/store/selectors/job-selectors.ts  ❌
export const selectOpenJobs = createSelector(...);
```

**Rule:** Each `useAppSelector` call passes `(state) => state.<sliceKey>` with **no** property access, indexing, or transformations on `state` inside the callback. Derive in `useMemo` (or inline in JSX for trivial cases).

Entity-specific display shaping (e.g. “Job #123 — Draft”) belongs in the **package** component layer, not in selector modules and not in `src/utils/{entity}/`.

---

### 6) Reducers must be logic-free (business logic belongs in thunks)
Reducers only apply payloads and set flags. Validation, branching, transformation, and side effects must live in thunks/services.

✅ **Do**
```ts
const jobsSlice = createSlice({
  name: "jobs",
  initialState: {} as Record<string, Job>,
  reducers: {
    upsertJob(state, action: PayloadAction<Job>) {
      state[action.payload.id] = action.payload;
    },
  },
});
```

❌ **Don't**
```ts
upsertJob(state, action) {
  const deduped = new Map(Object.values(state).map((j) => [j.id, j]));
  // business logic in reducer (forbidden)
}
```

---

### 7) Modal and wizard state in builders
Modal open/close, loading flags, and step enums belong in builder slices. The entity being edited always lives in a `current*` slice.

---

## Consequences
- Async control flow is explicit and easier to trace.
- Thunk return contracts are stable (`200 | 400 | 500`) and easy to consume in UI orchestration.
- Flat layers (`dumps/`, `current/`, `builders/`) match the codebase and reduce onboarding friction.
- Reducers stay deterministic and simple to test.
- Single source of truth per entity id in dumps; detail screens read `current*` plus dumps.
