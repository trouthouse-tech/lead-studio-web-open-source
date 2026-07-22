import { mapApiFailureToThunkStatus } from '@/api/_shared';
import {
  postLeadGoogleSearchForLead,
  type FacebookGoogleSearchRequestSource,
  type LeadGoogleSearchPlatform,
  type PostLeadGoogleSearchResponseBody,
} from '@/api/leads';
import type { AppThunk } from '../../store';

export type RunLeadGoogleSearchResearchResult =
  | {
      ok: true;
      leadUpdated: boolean;
      /** SERP organic-style rows returned from Express (Custom Search JSON API on mentorai-server). */
      linkCount?: number;
      /** True when the server resolved a profile URL for this run. */
      hasProfiles?: boolean;
      facebookApifySkipped?: string;
      facebookApifyError?: string;
      facebookContactCreated?: boolean;
      facebookContactMerged?: boolean;
    }
  | { ok: false; status: 400 | 500; error?: string; message?: string };

type ResponseType = Promise<RunLeadGoogleSearchResearchResult>;

/**
 * POST lead Google search for one platform — updates that profile URL when found.
 * Pass `targetLeadId` from list rows; otherwise uses `currentLead.id`.
 *
 * Flow: browser POST `${API_CONFIG.SERVER_URL}/api/services/lead-google-search/:platform` with `{ leadId }`
 * → mentorai-server `processGoogleSerpScrape` (Programmable Search / Custom Search JSON API) → AI URL pick → optional Apify (Facebook page). The browser never calls Google directly.
 */
export type RunLeadGoogleSearchResearchThunkOptions = {
  facebookRequestSource?: FacebookGoogleSearchRequestSource;
};

export const runLeadGoogleSearchResearchThunk = (
  platform: LeadGoogleSearchPlatform,
  targetLeadId?: string,
  thunkOptions?: RunLeadGoogleSearchResearchThunkOptions
): AppThunk<ResponseType> => {
  return async (_dispatch, getState): ResponseType => {
    const leadId = targetLeadId ?? getState().currentLead?.id;
    if (!leadId) {
      return { ok: false, status: 400 };
    }

    const result = await postLeadGoogleSearchForLead(leadId, {
      platform,
      ...(platform === 'facebook' && thunkOptions?.facebookRequestSource
        ? { facebookRequestSource: thunkOptions.facebookRequestSource }
        : {}),
    });

    if (!result.success) {
      const json = (result.data ?? result) as PostLeadGoogleSearchResponseBody;
      return {
        ok: false,
        status: mapApiFailureToThunkStatus(result),
        error: typeof json.error === 'string' ? json.error : result.error,
        message: typeof json.message === 'string' ? json.message : undefined,
      };
    }

    const json = (result.data ?? result) as PostLeadGoogleSearchResponseBody;

    if (json.success === false) {
      return {
        ok: false,
        status: 500,
        error: typeof json.error === 'string' ? json.error : undefined,
        message: typeof json.message === 'string' ? json.message : undefined,
      };
    }

    if (json.skipped) {
      return { ok: true, leadUpdated: false };
    }

    const linkCount = typeof json.linkCount === 'number' ? json.linkCount : undefined;

    return {
      ok: true,
      leadUpdated: json.leadUpdated === true,
      linkCount,
      hasProfiles: json.hasProfiles === true,
      facebookApifySkipped:
        typeof json.facebookApifySkipped === 'string'
          ? json.facebookApifySkipped
          : undefined,
      facebookApifyError:
        typeof json.facebookApifyError === 'string' ? json.facebookApifyError : undefined,
      facebookContactCreated: json.facebookContactCreated === true,
      facebookContactMerged: json.facebookContactMerged === true,
    };
  };
};
