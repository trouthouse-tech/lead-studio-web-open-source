import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type DashboardOnboardingPhase =
  | 'collect_intent'
  | 'searching'
  | 'preview'
  | 'idle';

type DashboardBuilderState = {
  onboardingPhase: DashboardOnboardingPhase;
  /** Set true after `initializeDashboardOnboardingThunk` finishes (avoids wrong-phase flash). */
  onboardingHydrated: boolean;
  draftPostalCode: string;
  draftBusinessTypes: string[];
  onboardingScrapeRunIds: string[];
  onboardingError: string | null;
  /** 1-based index of the business type currently being scraped during batch */
  onboardingScrapeIndex: number;
  showOnboardingWizard: boolean;
};

const initialState: DashboardBuilderState = {
  onboardingPhase: 'idle',
  onboardingHydrated: false,
  draftPostalCode: '',
  draftBusinessTypes: [],
  onboardingScrapeRunIds: [],
  onboardingError: null,
  onboardingScrapeIndex: 0,
  showOnboardingWizard: true,
};

const dashboardBuilderSlice = createSlice({
  name: 'dashboardBuilder',
  initialState,
  reducers: {
    setOnboardingPhase: (
      state,
      action: PayloadAction<DashboardOnboardingPhase>
    ) => {
      state.onboardingPhase = action.payload;
    },
    setDraftPostalCode: (state, action: PayloadAction<string>) => {
      state.draftPostalCode = action.payload;
    },
    setDraftBusinessTypes: (state, action: PayloadAction<string[]>) => {
      state.draftBusinessTypes = action.payload;
    },
    setOnboardingError: (state, action: PayloadAction<string | null>) => {
      state.onboardingError = action.payload;
    },
    appendOnboardingScrapeRunId: (state, action: PayloadAction<string>) => {
      if (!state.onboardingScrapeRunIds.includes(action.payload)) {
        state.onboardingScrapeRunIds.push(action.payload);
      }
    },
    resetOnboardingScrapeRunIds: (state) => {
      state.onboardingScrapeRunIds = [];
    },
    setOnboardingScrapeIndex: (state, action: PayloadAction<number>) => {
      state.onboardingScrapeIndex = action.payload;
    },
    setShowOnboardingWizard: (state, action: PayloadAction<boolean>) => {
      state.showOnboardingWizard = action.payload;
    },
    setOnboardingHydrated: (state, action: PayloadAction<boolean>) => {
      state.onboardingHydrated = action.payload;
    },
    resetOnboardingDraft: (state) => {
      state.draftPostalCode = '';
      state.draftBusinessTypes = [];
      state.onboardingError = null;
    },
  },
});

export const DashboardBuilderActions = dashboardBuilderSlice.actions;
export default dashboardBuilderSlice.reducer;
