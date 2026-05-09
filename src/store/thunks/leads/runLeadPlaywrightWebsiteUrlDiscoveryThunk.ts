import type { AppThunk } from '../../store';
import {
  postLeadPlaywrightWebsiteUrlDiscoveryForLead,
  type PostLeadPlaywrightWebsiteUrlDiscoveryResponseBody,
} from '@/api/leads';

export type RunLeadPlaywrightWebsiteUrlDiscoveryResult =
  | { ok: true; leadUpdated: boolean; linkCount: number }
  | {
      ok: false;
      status: 400 | 500;
      error?: string;
      message?: string;
    };

type ResponseType = Promise<RunLeadPlaywrightWebsiteUrlDiscoveryResult>;

/**
 * POST Playwright website URL discovery (nav/footer) for a lead.
 * Pass `targetLeadId` from list rows; otherwise uses `currentLead.id`.
 */
export const runLeadPlaywrightWebsiteUrlDiscoveryThunk = (
  targetLeadId?: string
): AppThunk<ResponseType> => {
  return async (_dispatch, getState): ResponseType => {
    const leadId = targetLeadId ?? getState().currentLead?.id;
    if (!leadId) {
      return { ok: false, status: 400 };
    }

    try {
      const res = await postLeadPlaywrightWebsiteUrlDiscoveryForLead(leadId);
      const text = await res.text();
      let json: PostLeadPlaywrightWebsiteUrlDiscoveryResponseBody = {};
      try {
        json = JSON.parse(text) as PostLeadPlaywrightWebsiteUrlDiscoveryResponseBody;
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

      return {
        ok: true,
        leadUpdated: json.leadUpdated === true,
        linkCount: typeof json.linkCount === 'number' ? json.linkCount : 0,
      };
    } catch (error: unknown) {
      console.error('runLeadPlaywrightWebsiteUrlDiscoveryThunk:', error);
      return { ok: false, status: 500 };
    }
  };
};
