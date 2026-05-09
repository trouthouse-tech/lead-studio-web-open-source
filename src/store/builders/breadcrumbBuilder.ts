import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { BreadcrumbSegment, BreadcrumbTrailBase } from '@/model/breadcrumb';

type BreadcrumbBuilderState = {
  base: BreadcrumbTrailBase | null;
  segments: BreadcrumbSegment[];
};

const initialState: BreadcrumbBuilderState = {
  base: null,
  segments: [],
};

type SetTrailPayload = {
  base: BreadcrumbTrailBase | null;
  segments: BreadcrumbSegment[];
};

export const breadcrumbBuilderSlice = createSlice({
  name: 'breadcrumbBuilder',
  initialState,
  reducers: {
    setTrail: (state, action: PayloadAction<SetTrailPayload>) => {
      state.base = action.payload.base;
      state.segments = action.payload.segments;
    },
    reset: () => initialState,
  },
});

export const BreadcrumbBuilderActions = breadcrumbBuilderSlice.actions;
export default breadcrumbBuilderSlice.reducer;
