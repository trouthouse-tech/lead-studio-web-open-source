import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { LeadContactStatus } from '@/model/lead-contact';
import type { PersistedLeadContactsFilters } from '@/utils/lead-contacts';

export type LeadContactsFiltersState = PersistedLeadContactsFilters;

const filterInitial: PersistedLeadContactsFilters = {
  searchFilter: '',
  statusFilter: 'all',
};

const initialState: LeadContactsFiltersState = {
  ...filterInitial,
};

export const leadContactsFiltersSlice = createSlice({
  name: 'leadContactsFilters',
  initialState,
  reducers: {
    hydrateFromPersisted: (state, action: PayloadAction<LeadContactsFiltersState>) => {
      Object.assign(state, action.payload);
    },
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.searchFilter = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<LeadContactStatus | 'all'>) => {
      state.statusFilter = action.payload;
    },
    clearFilters: () => initialState,
    reset: () => initialState,
  },
});

export const LeadContactsFiltersActions = leadContactsFiltersSlice.actions;
export default leadContactsFiltersSlice.reducer;
