import { coerceErrorFields, reportThunkError } from '@/api/thunk-errors';
import type { AppThunk } from '../../store';
import { getAllLeadContacts } from '@/api/lead-contacts';
import { LeadContactsActions } from '../../dumps/leadContacts';
import { mapApiFailureToThunkStatus } from '@/api/_shared';

type ResponseType = Promise<200 | 400 | 500>;

export const getAllLeadContactsThunk = (): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await getAllLeadContacts();

      if (response.success && response.data) {
        dispatch(LeadContactsActions.addLeadContacts(response.data));
        return 200;
      }

      if (
        response.error?.includes('not available yet') ||
        response.error?.includes('not found') ||
        response.error?.includes('Invalid response')
      ) {
        dispatch(LeadContactsActions.addLeadContacts([]));
        return 200;
      }

      return mapApiFailureToThunkStatus(response);
    } catch (error: unknown) {
      const { message, stack } = coerceErrorFields(error);
      reportThunkError({
        event: 'failedToGetAllLeadContacts',
        message,
        stack,
        thunkName: 'getAllLeadContactsThunk',
      });
      console.error('❌ getAllLeadContactsThunk error:', error);
      return 500;
    }
  };
};
