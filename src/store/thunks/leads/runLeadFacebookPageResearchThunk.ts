import { postLeadFacebookPageResearchForLead } from '@/api/leads';
import { getLeadContactsByLeadIdThunk } from '../lead-contacts';
import type { AppThunk } from '../../store';
import { refreshLeadRecordThunk } from './refreshLeadRecordThunk';

export type LeadFacebookPageResearchOutcome =
  | { ok: true }
  | { ok: false; message: string };

/**
 * POST lead-facebook-page-research (Apify page scrape for email/phone).
 * Pass `targetLeadId` from list rows; otherwise uses `currentLead.id`.
 */
export const runLeadFacebookPageResearchThunk = (
  targetLeadId?: string
): AppThunk<Promise<LeadFacebookPageResearchOutcome>> => {
  return async (dispatch, getState) => {
    const leadId = targetLeadId ?? getState().currentLead?.id;
    if (!leadId) {
      return { ok: false, message: 'No lead selected' };
    }

    const result = await postLeadFacebookPageResearchForLead(leadId);
    const json = (result.data ?? result) as {
      success?: boolean;
      skipped?: boolean;
      reason?: string;
      error?: string;
    };

    if (result.httpStatus === 401) {
      return {
        ok: false,
        message: 'Unauthorized. Check CRON_SECRET configuration.',
      };
    }

    if (!result.success) {
      return {
        ok: false,
        message: json.error || result.error || `Request failed (${result.httpStatus})`,
      };
    }

    if (json.skipped) {
      return {
        ok: false,
        message: json.reason
          ? `Skipped: ${json.reason}`
          : 'Facebook page scrape was skipped',
      };
    }

    if (json.success === false) {
      return {
        ok: false,
        message: json.error || 'Facebook page scrape failed',
      };
    }

    await dispatch(
      refreshLeadRecordThunk(leadId, { reloadWebsiteScrapeSummaryIfViewing: true })
    );
    await dispatch(getLeadContactsByLeadIdThunk(leadId));

    return { ok: true };
  };
};
