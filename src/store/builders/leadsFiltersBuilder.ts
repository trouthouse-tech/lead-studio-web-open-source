import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type LeadsFiltersBuilderState = {
  isFiltersModalOpen: boolean;
  hasActiveFilters: boolean;
};

const initialState: LeadsFiltersBuilderState = {
  isFiltersModalOpen: false,
  hasActiveFilters: false,
};

export const leadsFiltersBuilderSlice = createSlice({
  name: 'leadsFiltersBuilder',
  initialState,
  reducers: {
    setFiltersModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isFiltersModalOpen = action.payload;
    },
    setHasActiveFilters: (state, action: PayloadAction<boolean>) => {
      state.hasActiveFilters = action.payload;
    },
    reset: () => initialState,
  },
});

export const LeadsFiltersBuilderActions = leadsFiltersBuilderSlice.actions;
export default leadsFiltersBuilderSlice.reducer;
