import type { AppThunk } from '../../store';
import {
  getLeadById,
  postLeadFacebookPostsResearchForLead,
  type LeadFacebookPostsResearchStep,
} from '@/api/leads';
import { LeadsActions } from '../../dumps/leads';
import { refreshCurrentLeadThunk } from './refreshCurrentLeadThunk';

export type LeadFacebookPostsResearchOutcome =
  | { ok: true; reusedExisting?: boolean }
  | { ok: false; message: string };

type RunLeadFacebookPostsResearchThunkOptions = {
  step?: LeadFacebookPostsResearchStep;
};

/**
 * POST lead-facebook-posts-research (Express /api/services/lead-facebook-posts-research).
 * `step`: `fetch_posts` (Apify only), `score_posts` (AI from saved posts), `full` (both — default for API clients that omit step).
 */
export const runLeadFacebookPostsResearchThunk = (
  leadIdOverride?: string,
  options?: RunLeadFacebookPostsResearchThunkOptions
): AppThunk<Promise<LeadFacebookPostsResearchOutcome>> => {
  return async (dispatch, getState) => {
    const state = getState();
    const leadId = leadIdOverride?.trim() || state.currentLead.id;
    if (!leadId) {
      return { ok: false, message: 'No lead selected' };
    }

    const step = options?.step;

    try {
      const res = await postLeadFacebookPostsResearchForLead(leadId, step ? { step } : undefined);
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

      if (
        step !== 'fetch_posts' &&
        step !== 'score_posts' &&
        json.skipped &&
        json.reason === 'already_succeeded' &&
        json.success
      ) {
        if (state.currentLead.id === leadId) {
          await dispatch(refreshCurrentLeadThunk(leadId));
        } else {
          const refreshed = await getLeadById(leadId);
          if (refreshed.success && refreshed.data) {
            dispatch(LeadsActions.updateLead(refreshed.data));
          }
        }
        return { ok: true, reusedExisting: true };
      }

      if (json.skipped) {
        return {
          ok: false,
          message: json.reason
            ? `Skipped: ${json.reason}`
            : 'Facebook posts research was skipped',
        };
      }

      if (json.success === false) {
        return {
          ok: false,
          message: json.error || 'Facebook posts research failed',
        };
      }

      if (state.currentLead.id === leadId) {
        await dispatch(refreshCurrentLeadThunk(leadId));
      } else {
        const refreshed = await getLeadById(leadId);
        if (refreshed.success && refreshed.data) {
          dispatch(LeadsActions.updateLead(refreshed.data));
        }
      }

      return { ok: true };
    } catch (error: unknown) {
      console.error('runLeadFacebookPostsResearchThunk:', error);
      return {
        ok: false,
        message: error instanceof Error ? error.message : 'Network error',
      };
    }
  };
};
