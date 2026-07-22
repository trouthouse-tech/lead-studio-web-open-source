import { coerceErrorFields, reportThunkError } from '@/api/thunk-errors';
import type { AppThunk } from '@/store';
import { LeadSentEmailsActions } from '../../dumps/leadSentEmails';
import { getAllLeadSentEmails } from '@/api/lead-sent-emails';
import { mapApiFailureToThunkStatus } from '@/api/_shared';

type ResponseType = Promise<200 | 400 | 500>;

export const getAllLeadSentEmailsThunk = (): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await getAllLeadSentEmails();

      if (response.success && response.data) {
        const normalized = response.data.map((item) => ({
          ...item,
          persona_id: item.persona_id ?? null,
        }));
        dispatch(LeadSentEmailsActions.addLeadSentEmails(normalized));
        return 200;
      }

      if (
        response.error?.includes('not found') ||
        response.error?.includes('Invalid response')
      ) {
        dispatch(LeadSentEmailsActions.addLeadSentEmails([]));
        return 200;
      }

      return mapApiFailureToThunkStatus(response);
    } catch (error: unknown) {
      const { message, stack } = coerceErrorFields(error);
      reportThunkError({
        event: 'failedToGetAllLeadSentEmails',
        message,
        stack,
        thunkName: 'getAllLeadSentEmailsThunk',
      });
      console.error('❌ getAllLeadSentEmailsThunk error:', error);
      return 500;
    }
  };
};
