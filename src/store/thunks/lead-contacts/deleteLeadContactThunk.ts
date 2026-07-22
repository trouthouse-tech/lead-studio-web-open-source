import { coerceErrorFields, reportThunkError } from '@/api/thunk-errors';
import type { AppThunk } from '../../store';
import { deleteLeadContact } from '@/api/lead-contacts';
import { LeadContactsActions } from '../../dumps/leadContacts';
import { mapApiFailureToThunkStatus } from '@/api/_shared';

type ResponseType = Promise<200 | 400 | 500>;

export const deleteLeadContactThunk = (
  contactId: string
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await deleteLeadContact(contactId);

      if (response.success) {
        dispatch(LeadContactsActions.removeLeadContact(contactId));
        return 200;
      }

      return mapApiFailureToThunkStatus(response);
    } catch (error: unknown) {
      const { message, stack } = coerceErrorFields(error);
      reportThunkError({
        event: 'failedToDeleteLeadContact',
        message,
        stack,
        thunkName: 'deleteLeadContactThunk',
      });
      console.error('❌ deleteLeadContactThunk error:', error);
      return 500;
    }
  };
};
