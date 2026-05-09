import type { LovableDesignPromptResult } from '@/model';
import { postLeadLovableDesignPromptForLead } from '@/api/leads';
import type { AppThunk } from '../../store';

type ResponseType = Promise<LovableDesignPromptResult | null>;

/**
 * Generates a single paste-ready Lovable prompt from dictated business notes for the current lead.
 */
export const runLeadLovableDesignPromptThunk = (notes: string): AppThunk<ResponseType> => {
  return async (_dispatch, getState): ResponseType => {
    const leadId = getState().currentLead?.id;
    if (!leadId || !notes.trim()) {
      return null;
    }

    try {
      return await postLeadLovableDesignPromptForLead(leadId, notes.trim());
    } catch (error: unknown) {
      console.error('runLeadLovableDesignPromptThunk:', error);
      return null;
    }
  };
};
