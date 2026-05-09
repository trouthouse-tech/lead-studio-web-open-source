import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { LeadContactChatMessage } from '@/model';

export type LeadContactChatState = {
  messagesByContactId: Record<string, LeadContactChatMessage[]>;
  loadingByContactId: Record<string, boolean>;
  postingByContactId: Record<string, boolean>;
  errorByContactId: Record<string, string | null>;
};

const initialState: LeadContactChatState = {
  messagesByContactId: {},
  loadingByContactId: {},
  postingByContactId: {},
  errorByContactId: {},
};

export const leadContactChatSlice = createSlice({
  name: 'leadContactChat',
  initialState,
  reducers: {
    setLoadingForContact: (
      state,
      action: PayloadAction<{ leadContactId: string; isLoading: boolean }>,
    ) => {
      state.loadingByContactId[action.payload.leadContactId] =
        action.payload.isLoading;
    },
    setPostingForContact: (
      state,
      action: PayloadAction<{ leadContactId: string; isPosting: boolean }>,
    ) => {
      state.postingByContactId[action.payload.leadContactId] =
        action.payload.isPosting;
    },
    setErrorForContact: (
      state,
      action: PayloadAction<{ leadContactId: string; error: string | null }>,
    ) => {
      state.errorByContactId[action.payload.leadContactId] = action.payload.error;
    },
    setMessagesForContact: (
      state,
      action: PayloadAction<{
        leadContactId: string;
        messages: LeadContactChatMessage[];
      }>,
    ) => {
      state.messagesByContactId[action.payload.leadContactId] =
        action.payload.messages;
    },
    clearForContact: (state, action: PayloadAction<string>) => {
      delete state.messagesByContactId[action.payload];
      delete state.loadingByContactId[action.payload];
      delete state.postingByContactId[action.payload];
      delete state.errorByContactId[action.payload];
    },
    reset: () => initialState,
  },
});

export const LeadContactChatActions = leadContactChatSlice.actions;
export default leadContactChatSlice.reducer;
