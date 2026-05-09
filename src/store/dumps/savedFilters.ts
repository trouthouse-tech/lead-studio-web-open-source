import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SavedFilter } from '@/model';

type State = Record<string, SavedFilter>;

const initialState: State = {};

export const savedFiltersSlice = createSlice({
  name: 'savedFilters',
  initialState,
  reducers: {
    setSavedFilters: (_state, action: PayloadAction<SavedFilter[]>) => {
      const next: State = {};
      for (const row of action.payload) {
        next[row.id] = row;
      }
      return next;
    },
    upsertSavedFilter: (state, action: PayloadAction<SavedFilter>) => {
      state[action.payload.id] = action.payload;
    },
    removeSavedFilter: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    reset: () => initialState,
  },
});

export const SavedFiltersActions = savedFiltersSlice.actions;
export default savedFiltersSlice.reducer;
