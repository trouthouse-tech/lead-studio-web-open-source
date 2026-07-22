import { coerceErrorFields, reportThunkError } from '@/api/thunk-errors';
import type { AppThunk } from '../../store';
import { createLeadContact } from '@/api/lead-contacts';
import { LeadContactsActions } from '../../dumps/leadContacts';
import { CurrentLeadContactActions } from '../../current';
import type { CreateLeadContactInput } from '@/model/lead-contact';
import { mapApiFailureToThunkStatus } from '@/api/_shared';

type ResponseType = Promise<200 | 400 | 500>;

export const createLeadContactThunk = (
  input: CreateLeadContactInput
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await createLeadContact(input);

      if (response.success && response.data) {
        dispatch(LeadContactsActions.updateLeadContact(response.data));
        dispatch(CurrentLeadContactActions.reset());
        return 200;
      }

      return mapApiFailureToThunkStatus(response);
    } catch (error: unknown) {
      const { message, stack } = coerceErrorFields(error);
      reportThunkError({
        event: 'failedToCreateLeadContact',
        message,
        stack,
        thunkName: 'createLeadContactThunk',
      });
      console.error('❌ createLeadContactThunk error:', error);
      return 500;
    }
  };
};
