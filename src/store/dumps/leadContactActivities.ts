import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { LeadContactActivity } from '@/model';

const initialState: Record<string, LeadContactActivity> = {};

export const leadContactActivitiesSlice = createSlice({
  name: 'leadContactActivities',
  initialState,
  reducers: {
    setLeadContactActivities: (
      _state,
      action: PayloadAction<LeadContactActivity[]>
    ) => {
      const nextState: Record<string, LeadContactActivity> = {};
      action.payload.forEach((activity) => {
        nextState[activity.id] = activity;
      });
      return nextState;
    },
    addLeadContactActivity: (
      state,
      action: PayloadAction<LeadContactActivity>
    ) => {
      state[action.payload.id] = action.payload;
    },
    clearLeadContactActivities: () => initialState,
  },
});

export const LeadContactActivitiesActions = leadContactActivitiesSlice.actions;
export default leadContactActivitiesSlice.reducer;
