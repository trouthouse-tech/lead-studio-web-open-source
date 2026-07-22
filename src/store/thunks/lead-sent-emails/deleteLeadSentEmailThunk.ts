import { coerceErrorFields, reportThunkError } from '@/api/thunk-errors';
import type { AppThunk } from '@/store';
import { LeadSentEmailsActions } from '../../dumps/leadSentEmails';
import { deleteLeadSentEmail } from '@/api/lead-sent-emails';

type ResponseType = Promise<200 | 400 | 500>;

export const deleteLeadSentEmailThunk = (id: string): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      await deleteLeadSentEmail(id);
      dispatch(LeadSentEmailsActions.removeLeadSentEmail(id));
      return 200;
    } catch (error: unknown) {
      const { message, stack } = coerceErrorFields(error);
      reportThunkError({
        event: 'failedToDeleteLeadSentEmail',
        message,
        stack,
        thunkName: 'deleteLeadSentEmailThunk',
      });
      console.error('❌ deleteLeadSentEmailThunk error:', error);
      return 500;
    }
  };
};
