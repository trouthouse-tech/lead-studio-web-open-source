import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Lead } from '@/model';
import { createEmptyLead } from './create-empty-lead';

type CurrentLeadState = Lead;

const initialState: CurrentLeadState = createEmptyLead();

export const currentLeadSlice = createSlice({
  name: 'currentLead',
  initialState,
  reducers: {
    setCurrentLead: (_state, action: PayloadAction<Lead>) => {
      return action.payload;
    },
    updateCurrentLead: (state, action: PayloadAction<Partial<Lead>>) => {
      return { ...state, ...action.payload };
    },
    reset: () => createEmptyLead(),
  },
});

export const CurrentLeadActions = currentLeadSlice.actions;
export default currentLeadSlice.reducer;
