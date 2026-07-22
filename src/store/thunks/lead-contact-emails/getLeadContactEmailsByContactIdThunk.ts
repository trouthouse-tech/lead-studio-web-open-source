import { coerceErrorFields, reportThunkError } from '@/api/thunk-errors';
import type { AppThunk } from '@/store';
import { LeadContactEmailsActions } from '../../dumps/leadContactEmails';
import { getLeadContactEmailsByContactId } from '@/api/lead-contact-emails';
import { mapApiFailureToThunkStatus } from '@/api/_shared';

type ResponseType = Promise<200 | 400 | 500>;

export const getLeadContactEmailsByContactIdThunk = (
  contactId: string
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await getLeadContactEmailsByContactId(contactId);
      if (!response.success || !response.data) {
        return mapApiFailureToThunkStatus(response);
      }
      dispatch(LeadContactEmailsActions.addLeadContactEmails(response.data));
      return 200;
    } catch (error) {
      const { message, stack } = coerceErrorFields(error);
      reportThunkError({
        event: 'failedToGetLeadContactEmailsByContactId',
        message,
        stack,
        thunkName: 'getLeadContactEmailsByContactIdThunk',
      });
      console.error('getLeadContactEmailsByContactIdThunk:', error);
      return 500;
    }
  };
};
