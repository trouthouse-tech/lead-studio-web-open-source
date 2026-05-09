import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type LeadContactsFiltersBuilderState = {
  hasActiveFilters: boolean;
};

const initialState: LeadContactsFiltersBuilderState = {
  hasActiveFilters: false,
};

export const leadContactsFiltersBuilderSlice = createSlice({
  name: 'leadContactsFiltersBuilder',
  initialState,
  reducers: {
    setHasActiveFilters: (state, action: PayloadAction<boolean>) => {
      state.hasActiveFilters = action.payload;
    },
    reset: () => initialState,
  },
});

export const LeadContactsFiltersBuilderActions = leadContactsFiltersBuilderSlice.actions;
export default leadContactsFiltersBuilderSlice.reducer;
