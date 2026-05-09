import type { AppThunk } from '../../store';
import {
  postLeadGoogleSearchForLead,
  type FacebookGoogleSearchRequestSource,
  type LeadGoogleSearchPlatform,
  type PostLeadGoogleSearchResponseBody,
} from '@/api/leads';

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
 * Flow: Next.js POST `/api/leads/:leadId/lead-google-search` → Express `/api/services/lead-google-search`
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

    try {
      const res = await postLeadGoogleSearchForLead(leadId, {
        platform,
        ...(platform === 'facebook' && thunkOptions?.facebookRequestSource
          ? { facebookRequestSource: thunkOptions.facebookRequestSource }
          : {}),
      });
      const text = await res.text();
      let json: PostLeadGoogleSearchResponseBody = {};
      try {
        json = JSON.parse(text) as PostLeadGoogleSearchResponseBody;
      } catch {
        return { ok: false, status: 400 };
      }

      if (!res.ok) {
        return {
          ok: false,
          status: res.status >= 500 ? 500 : 400,
          error: typeof json.error === 'string' ? json.error : undefined,
          message: typeof json.message === 'string' ? json.message : undefined,
        };
      }

      if (json.success === false) {
        return {
          ok: false,
          status: 400,
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
    } catch (error: unknown) {
      console.error('runLeadGoogleSearchResearchThunk:', error);
      return { ok: false, status: 500 };
    }
  };
};
