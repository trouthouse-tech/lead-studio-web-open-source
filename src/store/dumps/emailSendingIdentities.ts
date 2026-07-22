import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { EmailSendingIdentity } from '@/model/email-sending-identity';

type State = Record<string, EmailSendingIdentity>;

const initialState: State = {};

const slice = createSlice({
  name: 'emailSendingIdentities',
  initialState,
  reducers: {
    setEmailSendingIdentities: (
      _state,
      action: PayloadAction<EmailSendingIdentity[]>,
    ) => {
      const next: State = {};
      for (const row of action.payload) {
        next[row.id] = row;
      }
      return next;
    },
    reset: () => initialState,
  },
});

export const EmailSendingIdentitiesActions = slice.actions;
export default slice.reducer;
