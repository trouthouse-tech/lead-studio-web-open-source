import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { PersistedLeadsFilters } from '@/utils/leads';
import type {
  LeadContactFilterValue,
  LeadFacebookSearchFilterValue,
  LeadQualityFilterValue,
  LeadUrlDiscoveryFilterValue,
  LeadWebsiteFilterValue,
  LeadWebsiteResearchFilterValue,
} from '@/utils/leads/constants';

export type LeadsFiltersState = PersistedLeadsFilters & {
  activeSavedFilterId: string | null;
};

const filterInitial: PersistedLeadsFilters = {
  selectedCategoryIds: [],
  selectedStatus: null,
  searchFilter: '',
  qualityFilter: 'all',
  websiteFilter: 'all',
  leadContactFilter: 'all',
  facebookGoogleSearchFilter: 'all',
  playwrightUrlDiscoveryFilter: 'all',
  websiteResearchFilter: 'all',
};

const initialState: LeadsFiltersState = {
  ...filterInitial,
  activeSavedFilterId: null,
};

export const leadsFiltersSlice = createSlice({
  name: 'leadsFilters',
  initialState,
  reducers: {
    hydrateFromPersisted: (state, action: PayloadAction<LeadsFiltersState>) => {
      Object.assign(state, action.payload);
    },
    setActiveSavedFilterId: (state, action: PayloadAction<string | null>) => {
      state.activeSavedFilterId = action.payload;
    },
    setSelectedCategoryIds: (state, action: PayloadAction<string[]>) => {
      state.selectedCategoryIds = action.payload;
    },
    setSelectedStatus: (state, action: PayloadAction<string | null>) => {
      state.selectedStatus = action.payload;
    },
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.searchFilter = action.payload;
    },
    setQualityFilter: (state, action: PayloadAction<LeadQualityFilterValue>) => {
      state.qualityFilter = action.payload;
    },
    setWebsiteFilter: (state, action: PayloadAction<LeadWebsiteFilterValue>) => {
      state.websiteFilter = action.payload;
    },
    setLeadContactFilter: (state, action: PayloadAction<LeadContactFilterValue>) => {
      state.leadContactFilter = action.payload;
    },
    setFacebookGoogleSearchFilter: (
      state,
      action: PayloadAction<LeadFacebookSearchFilterValue>
    ) => {
      state.facebookGoogleSearchFilter = action.payload;
    },
    setPlaywrightUrlDiscoveryFilter: (
      state,
      action: PayloadAction<LeadUrlDiscoveryFilterValue>
    ) => {
      state.playwrightUrlDiscoveryFilter = action.payload;
    },
    setWebsiteResearchFilter: (
      state,
      action: PayloadAction<LeadWebsiteResearchFilterValue>
    ) => {
      state.websiteResearchFilter = action.payload;
    },
    toggleCategorySelection: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const idx = state.selectedCategoryIds.indexOf(id);
      if (idx === -1) {
        state.selectedCategoryIds.push(id);
      } else {
        state.selectedCategoryIds.splice(idx, 1);
      }
    },
    clearFilters: () => initialState,
    reset: () => initialState,
  },
});

export const LeadsFiltersActions = leadsFiltersSlice.actions;
export default leadsFiltersSlice.reducer;
