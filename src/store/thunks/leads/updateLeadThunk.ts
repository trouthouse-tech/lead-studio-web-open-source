import { coerceErrorFields, reportThunkError } from '@/api/thunk-errors';
import type { AppThunk } from '../../store';
import { updateLead } from '@/api/leads';
import { LeadsActions } from '../../dumps/leads';
import { CurrentLeadActions } from '../../current';
import type { Lead } from '@/model';
import { mapApiFailureToThunkStatus } from '@/api/_shared';

type ResponseType = Promise<200 | 400 | 500>;

export const updateLeadThunk = (
  leadId: string,
  payload: Partial<Lead>
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await updateLead(leadId, payload);

      if (response.success && response.data) {
        dispatch(LeadsActions.updateLead(response.data));
        dispatch(CurrentLeadActions.setCurrentLead(response.data));
        return 200;
      }

      return mapApiFailureToThunkStatus(response);
    } catch (error: unknown) {
      const { message, stack } = coerceErrorFields(error);
      reportThunkError({
        event: 'failedToUpdateLead',
        message,
        stack,
        thunkName: 'updateLeadThunk',
      });
      console.error('❌ updateLeadThunk error:', error);
      return 500;
    }
  };
};
