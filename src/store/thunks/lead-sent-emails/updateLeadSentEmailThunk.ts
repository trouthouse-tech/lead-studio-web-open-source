import { coerceErrorFields, reportThunkError } from '@/api/thunk-errors';
import { mapApiFailureToThunkStatus } from '@/api/_shared';
import type { AppThunk } from '@/store';
import { LeadSentEmailsActions } from '../../dumps/leadSentEmails';
import {
  updateLeadSentEmail,
  type UpdateLeadSentEmailInput,
} from '@/api/lead-sent-emails';

type ResponseType = Promise<200 | 400 | 500>;

export const updateLeadSentEmailThunk = (
  sentEmailId: string,
  updates: UpdateLeadSentEmailInput
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await updateLeadSentEmail(sentEmailId, updates);

      if (response.success && response.data) {
        const row = {
          ...response.data,
          persona_id: response.data.persona_id ?? null,
        };
        dispatch(LeadSentEmailsActions.updateLeadSentEmail(row));
        return 200;
      }

      return mapApiFailureToThunkStatus(response);
    } catch (error: unknown) {
      const { message, stack } = coerceErrorFields(error);
      reportThunkError({
        event: 'failedToUpdateLeadSentEmail',
        message,
        stack,
        thunkName: 'updateLeadSentEmailThunk',
      });
      console.error('❌ updateLeadSentEmailThunk error:', error);
      return 500;
    }
  };
};
