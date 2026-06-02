import type { AppThunk } from '../../store';
import { postLeadFacebookPageResearchForLead } from '@/api/leads';
import { getLeadContactsByLeadIdThunk } from '../lead-contacts';
import { refreshCurrentLeadThunk } from './refreshCurrentLeadThunk';

export type LeadFacebookPageResearchOutcome =
  | { ok: true }
  | { ok: false; message: string };

/**
 * POST lead-facebook-page-research for current lead (Express /api/services/lead-facebook-page-research, Apify page scrape).
 */
export const runLeadFacebookPageResearchThunk = (): AppThunk<
  Promise<LeadFacebookPageResearchOutcome>
> => {
  return async (dispatch, getState) => {
    const leadId = getState().currentLead?.id;
    if (!leadId) {
      return { ok: false, message: 'No lead selected' };
    }

    try {
      const res = await postLeadFacebookPageResearchForLead(leadId);
      const text = await res.text();
      let json: {
        success?: boolean;
        skipped?: boolean;
        reason?: string;
        error?: string;
      } = {};
      try {
        json = JSON.parse(text) as {
          success?: boolean;
          skipped?: boolean;
          reason?: string;
          error?: string;
        };
      } catch {
        return { ok: false, message: 'Invalid response from server' };
      }

      if (res.status === 401) {
        return {
          ok: false,
          message: 'Unauthorized. Check CRON_SECRET configuration.',
        };
      }

      if (!res.ok) {
        return {
          ok: false,
          message: json.error || `Request failed (${res.status})`,
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

      await dispatch(refreshCurrentLeadThunk(leadId));
      await dispatch(getLeadContactsByLeadIdThunk(leadId));

      return { ok: true };
    } catch (error: unknown) {
      console.error('runLeadFacebookPageResearchThunk:', error);
      return {
        ok: false,
        message: error instanceof Error ? error.message : 'Network error',
      };
    }
  };
};
