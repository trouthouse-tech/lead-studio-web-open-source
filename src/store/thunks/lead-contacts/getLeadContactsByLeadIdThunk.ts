import { coerceErrorFields, reportThunkError } from '@/api/thunk-errors';
import type { AppThunk } from '../../store';
import { getLeadContactsByLeadId } from '@/api/lead-contacts';
import { LeadContactsActions } from '../../dumps/leadContacts';
import { mapApiFailureToThunkStatus } from '@/api/_shared';

type ResponseType = Promise<200 | 400 | 500>;

export const getLeadContactsByLeadIdThunk = (
  leadId: string
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await getLeadContactsByLeadId(leadId);

      if (response.success) {
        const list = Array.isArray(response.data) ? response.data : [];
        dispatch(LeadContactsActions.addLeadContacts(list));
        return 200;
      }

      return mapApiFailureToThunkStatus(response);
    } catch (error: unknown) {
      const { message, stack } = coerceErrorFields(error);
      reportThunkError({
        event: 'failedToGetLeadContactsByLeadId',
        message,
        stack,
        thunkName: 'getLeadContactsByLeadIdThunk',
      });
      console.error('❌ getLeadContactsByLeadIdThunk error:', error);
      return 500;
    }
  };
};
