import { createSlice } from "@reduxjs/toolkit";

const initialState: Record<string, never> = {};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
});

export const appReducer = appSlice.reducer;
