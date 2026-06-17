import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { DateRangeFilter } from '@/utils/date-time';

export type StatCardFilter =
  | 'bounced'
  | 'unique_opens'
  | 'total_opens'
  | 'not_opened'
  | null;

type LeadSentEmailsBuilderState = {
  dateRangeFilter: DateRangeFilter;
  statCardFilter: StatCardFilter;
  /** When true, only rows whose lead has exactly one sent email in the store (follow-up queue). */
  onlySingleSentPerLead: boolean;
  /** Filter by cold email offering id; empty string means all. */
  coldEmailOfferingFilterId: string;
};

const initialState: LeadSentEmailsBuilderState = {
  dateRangeFilter: 'this_week',
  statCardFilter: null,
  onlySingleSentPerLead: false,
  coldEmailOfferingFilterId: '',
};

const leadSentEmailsBuilderSlice = createSlice({
  name: 'leadSentEmailsBuilder',
  initialState,
  reducers: {
    setDateRangeFilter: (state, action: PayloadAction<DateRangeFilter>) => {
      state.dateRangeFilter = action.payload;
    },
    clearDateRangeFilter: (state) => {
      state.dateRangeFilter = null;
    },
    setStatCardFilter: (state, action: PayloadAction<StatCardFilter>) => {
      state.statCardFilter = action.payload;
    },
    clearStatCardFilter: (state) => {
      state.statCardFilter = null;
    },
    setOnlySingleSentPerLead: (state, action: PayloadAction<boolean>) => {
      state.onlySingleSentPerLead = action.payload;
    },
    setColdEmailOfferingFilterId: (state, action: PayloadAction<string>) => {
      state.coldEmailOfferingFilterId = action.payload;
    },
  },
});

export const LeadSentEmailsBuilderActions =
  leadSentEmailsBuilderSlice.actions;
export default leadSentEmailsBuilderSlice.reducer;
