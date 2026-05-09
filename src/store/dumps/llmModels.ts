import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { LlmModel } from '@/model';

type LlmModelsState = Record<string, LlmModel>;

const initialState: LlmModelsState = {};

const toLlmModelsMap = (models: LlmModel[]): LlmModelsState => {
  return models.reduce<LlmModelsState>((acc, model) => {
    acc[model.model] = model;
    return acc;
  }, {});
};

export const llmModelsSlice = createSlice({
  name: 'llmModels',
  initialState,
  reducers: {
    setLlmModels: (_state, action: PayloadAction<LlmModel[]>) => {
      return toLlmModelsMap(action.payload);
    },
    reset: () => initialState,
  },
});

export const LlmModelsActions = llmModelsSlice.actions;
export default llmModelsSlice.reducer;
