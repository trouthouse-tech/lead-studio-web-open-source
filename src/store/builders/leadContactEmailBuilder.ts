import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type LeadContactEmailBuilderState = {
  isEmailModalOpen: boolean;
  isSaving: boolean;
  saveToastVisible: boolean;
  saveToastMessage: string;
  /** Selected saved email id for read-only preview (does not replace compose draft). */
  previewEmailId: string | null;
};

const initialState: LeadContactEmailBuilderState = {
  isEmailModalOpen: false,
  isSaving: false,
  saveToastVisible: false,
  saveToastMessage: '',
  previewEmailId: null,
};

const leadContactEmailBuilderSlice = createSlice({
  name: 'leadContactEmailBuilder',
  initialState,
  reducers: {
    openEmailModal: (state) => {
      state.isEmailModalOpen = true;
    },
    closeEmailModal: (state) => {
      state.isEmailModalOpen = false;
      state.previewEmailId = null;
    },
    setPreviewEmailId: (state, action: PayloadAction<string | null>) => {
      state.previewEmailId = action.payload;
    },
    setSaving: (state, action: PayloadAction<boolean>) => {
      state.isSaving = action.payload;
    },
    showSaveToast: (state, action: PayloadAction<string>) => {
      state.saveToastVisible = true;
      state.saveToastMessage = action.payload;
    },
    hideSaveToast: (state) => {
      state.saveToastVisible = false;
      state.saveToastMessage = '';
    },
    reset: (state) => {
      state.isEmailModalOpen = false;
      state.isSaving = false;
      state.saveToastVisible = false;
      state.saveToastMessage = '';
      state.previewEmailId = null;
    },
  },
});

export const LeadContactEmailBuilderActions =
  leadContactEmailBuilderSlice.actions;
export default leadContactEmailBuilderSlice.reducer;
