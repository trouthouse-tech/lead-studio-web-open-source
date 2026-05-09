import type { AppThunk } from '../../store';
import { postLeadDictationNotesResearchForLead } from '@/api/leads';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * POST manual dictation notes research for current lead.
 */
export const runLeadDictationNotesResearchThunk = (
  notes: string
): AppThunk<ResponseType> => {
  return async (_dispatch, getState): ResponseType => {
    const leadId = getState().currentLead?.id;
    if (!leadId || !notes.trim()) {
      return 400;
    }

    try {
      const res = await postLeadDictationNotesResearchForLead(leadId, notes.trim());
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
      console.error('runLeadDictationNotesResearchThunk:', error);
      return 500;
    }
  };
};
