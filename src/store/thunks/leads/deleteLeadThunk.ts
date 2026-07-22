import { coerceErrorFields, reportThunkError } from '@/api/thunk-errors';
import type { AppThunk } from '../../store';
import { deleteLead } from '@/api/leads';
import { LeadsActions } from '../../dumps/leads';
import { mapApiFailureToThunkStatus } from '@/api/_shared';

type ResponseType = Promise<200 | 400 | 500>;

export const deleteLeadThunk = (leadId: string): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await deleteLead(leadId);

      if (response.success) {
        dispatch(LeadsActions.deleteLead(leadId));
        return 200;
      }

      return mapApiFailureToThunkStatus(response);
    } catch (error: unknown) {
      const { message, stack } = coerceErrorFields(error);
      reportThunkError({
        event: 'failedToDeleteLead',
        message,
        stack,
        thunkName: 'deleteLeadThunk',
      });
      console.error('❌ deleteLeadThunk error:', error);
      return 500;
    }
  };
};
