import type { AppThunk } from '../../store';
import { postLeadWebsiteResearchForLead } from '@/api/leads';

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

    try {
      const res = await postLeadWebsiteResearchForLead(leadId);
      const text = await res.text();
      let json: { success?: boolean } = {};
      try {
        json = JSON.parse(text) as { success?: boolean };
      } catch {
        return 400;
      }

      if (!res.ok) {
        return res.status >= 500 ? 500 : 400;
      }

      if (json.success === false) {
        return 400;
      }

      return 200;
    } catch (error: unknown) {
      console.error('runLeadWebsiteResearchThunk:', error);
      return 500;
    }
  };
};
