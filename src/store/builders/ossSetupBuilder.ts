import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type OssSetupStep = 0 | 1 | 2 | 3 | 4;

type OssSetupBuilderState = {
  step: OssSetupStep;
  serverUrl: string;
  setupComplete: boolean;
  lastHealthOk: boolean | null;
  healthError: string | null;
  healthTesting: boolean;
  hydrated: boolean;
};

const initialState: OssSetupBuilderState = {
  step: 0,
  serverUrl: '',
  setupComplete: false,
  lastHealthOk: null,
  healthError: null,
  healthTesting: false,
  hydrated: false,
};

const ossSetupBuilderSlice = createSlice({
  name: 'ossSetupBuilder',
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<OssSetupStep>) => {
      state.step = action.payload;
    },
    setServerUrl: (state, action: PayloadAction<string>) => {
      state.serverUrl = action.payload.replace(/\/$/, '');
    },
    setSetupComplete: (state, action: PayloadAction<boolean>) => {
      state.setupComplete = action.payload;
    },
    setLastHealthOk: (state, action: PayloadAction<boolean | null>) => {
      state.lastHealthOk = action.payload;
    },
    setHealthError: (state, action: PayloadAction<string | null>) => {
      state.healthError = action.payload;
    },
    setHealthTesting: (state, action: PayloadAction<boolean>) => {
      state.healthTesting = action.payload;
    },
    setHydrated: (state, action: PayloadAction<boolean>) => {
      state.hydrated = action.payload;
    },
    resetOssSetup: () => initialState,
  },
});

export const OssSetupBuilderActions = ossSetupBuilderSlice.actions;
export default ossSetupBuilderSlice.reducer;
