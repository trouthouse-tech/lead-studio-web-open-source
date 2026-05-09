import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type LeadDetailEmailFabState = {
  isExpanded: boolean;
  /** Prevents repeated auto-AI bootstrap for the same lead in one session. */
  autoAiAttemptedLeadId: string | null;
};

const initialState: LeadDetailEmailFabState = {
  isExpanded: false,
  autoAiAttemptedLeadId: null,
};

const leadDetailEmailFabSlice = createSlice({
  name: 'leadDetailEmailFab',
  initialState,
  reducers: {
    expand: (state) => {
      state.isExpanded = true;
    },
    collapse: (state) => {
      state.isExpanded = false;
    },
    setAutoAiAttemptedLeadId: (state, action: PayloadAction<string | null>) => {
      state.autoAiAttemptedLeadId = action.payload;
    },
    resetForLeadChange: (state) => {
      state.isExpanded = false;
      state.autoAiAttemptedLeadId = null;
    },
    reset: () => initialState,
  },
});

export const LeadDetailEmailFabActions = leadDetailEmailFabSlice.actions;
export default leadDetailEmailFabSlice.reducer;
