import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ToCallLogBuilderState = {
  /** True after the first successful full-list fetch (may be empty). */
  hasLoadedAll: boolean;
  isFetchingAll: boolean;
};

const initialState: ToCallLogBuilderState = {
  hasLoadedAll: false,
  isFetchingAll: false,
};

export const toCallLogBuilderSlice = createSlice({
  name: 'toCallLogBuilder',
  initialState,
  reducers: {
    setHasLoadedAll: (state, action: PayloadAction<boolean>) => {
      state.hasLoadedAll = action.payload;
    },
    setIsFetchingAll: (state, action: PayloadAction<boolean>) => {
      state.isFetchingAll = action.payload;
    },
    reset: () => initialState,
  },
});

export const ToCallLogBuilderActions = toCallLogBuilderSlice.actions;
export default toCallLogBuilderSlice.reducer;
