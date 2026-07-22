import type { AppThunk } from '../../store';
import { getLeadById } from '@/api/leads';
import { CurrentLeadActions } from '../../current';
import { LeadsActions } from '../../dumps/leads';
import { mapApiFailureToThunkStatus } from '@/api/_shared';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Reloads a lead from the API into currentLead and the leads dump.
 */
export const refreshCurrentLeadThunk = (leadId: string): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    const res = await getLeadById(leadId);
    if (!res.success || !res.data) {
      return mapApiFailureToThunkStatus(res);
    }
    dispatch(CurrentLeadActions.setCurrentLead(res.data));
    dispatch(LeadsActions.updateLead(res.data));
    return 200;
  };
};
