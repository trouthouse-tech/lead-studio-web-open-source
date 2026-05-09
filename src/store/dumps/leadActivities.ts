import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { LeadActivity } from '@/model';

const initialState: Record<string, LeadActivity> = {};

export const leadActivitiesSlice = createSlice({
  name: 'leadActivities',
  initialState,
  reducers: {
    setLeadActivities: (_state, action: PayloadAction<LeadActivity[]>) => {
      const nextState: Record<string, LeadActivity> = {};
      action.payload.forEach((activity) => {
        nextState[activity.id] = activity;
      });
      return nextState;
    },
    addLeadActivity: (state, action: PayloadAction<LeadActivity>) => {
      state[action.payload.id] = action.payload;
    },
    clearLeadActivities: () => initialState,
  },
});

export const LeadActivitiesActions = leadActivitiesSlice.actions;
export default leadActivitiesSlice.reducer;
