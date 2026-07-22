import { mapApiFailureToThunkStatus } from '@/api/_shared';
import { postLeadWebsiteResearchForLead } from '@/api/leads';
import type { AppThunk } from '../../store';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * POST manual website research (Express /api/services/lead-website-research).
 * Pass `targetLeadId` from list rows; otherwise uses `currentLead.id`.
 */
export const runLeadWebsiteResearchThunk = (targetLeadId?: string): AppThunk<ResponseType> => {
  return async (_dispatch, getState): ResponseType => {
    const leadId = targetLeadId ?? getState().currentLead?.id;
    if (!leadId) {
      return 400;
    }

    const result = await postLeadWebsiteResearchForLead(leadId);
    if (!result.success) {
      return mapApiFailureToThunkStatus(result);
    }

    const json = (result.data ?? result) as { success?: boolean };
    if (json.success === false) {
      return 500;
    }

    return 200;
  };
};
