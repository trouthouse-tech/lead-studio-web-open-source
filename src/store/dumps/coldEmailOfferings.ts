import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ColdEmailOffering } from '@/model/cold-email-offering';

const initialState: Record<string, ColdEmailOffering> = {};

export const coldEmailOfferingsSlice = createSlice({
  name: 'coldEmailOfferings',
  initialState,
  reducers: {
    setColdEmailOfferings: (
      _state,
      action: PayloadAction<ColdEmailOffering[]>,
    ) => {
      const next: Record<string, ColdEmailOffering> = {};
      for (const row of action.payload) {
        next[row.id] = row;
      }
      return next;
    },
    addColdEmailOffering: (state, action: PayloadAction<ColdEmailOffering>) => {
      state[action.payload.id] = action.payload;
    },
    updateColdEmailOffering: (
      state,
      action: PayloadAction<ColdEmailOffering>,
    ) => {
      state[action.payload.id] = action.payload;
    },
    removeColdEmailOffering: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    clearColdEmailOfferings: () => initialState,
  },
});

export const ColdEmailOfferingsActions = coldEmailOfferingsSlice.actions;
export default coldEmailOfferingsSlice.reducer;
