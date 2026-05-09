import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ToCallLog } from '@/model/to-call-log';

type ToCallLogsState = Record<string, ToCallLog>;

const initialState: ToCallLogsState = {};

export const toCallLogsSlice = createSlice({
  name: 'toCallLogs',
  initialState,
  reducers: {
    setToCallLogs: (_state, action: PayloadAction<ToCallLog[]>) => {
      const next: ToCallLogsState = {};
      action.payload.forEach((row) => {
        next[row.id] = row;
      });
      return next;
    },
    upsertToCallLog: (state, action: PayloadAction<ToCallLog>) => {
      state[action.payload.id] = action.payload;
    },
    removeToCallLog: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    reset: () => initialState,
  },
});

export const ToCallLogsActions = toCallLogsSlice.actions;
export default toCallLogsSlice.reducer;
