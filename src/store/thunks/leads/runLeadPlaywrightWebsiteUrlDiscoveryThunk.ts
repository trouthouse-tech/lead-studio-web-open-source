import { mapApiFailureToThunkStatus } from '@/api/_shared';
import {
  postLeadPlaywrightWebsiteUrlDiscoveryForLead,
  type PostLeadPlaywrightWebsiteUrlDiscoveryResponseBody,
} from '@/api/leads';
import type { AppThunk } from '../../store';

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

    const result = await postLeadPlaywrightWebsiteUrlDiscoveryForLead(leadId);

    if (!result.success) {
      const json = (result.data ?? result) as PostLeadPlaywrightWebsiteUrlDiscoveryResponseBody;
      return {
        ok: false,
        status: mapApiFailureToThunkStatus(result),
        error: typeof json.error === 'string' ? json.error : result.error,
        message: typeof json.message === 'string' ? json.message : undefined,
      };
    }

    const json = (result.data ?? result) as PostLeadPlaywrightWebsiteUrlDiscoveryResponseBody;

    if (json.success === false) {
      return {
        ok: false,
        status: 500,
        error: typeof json.error === 'string' ? json.error : undefined,
        message: typeof json.message === 'string' ? json.message : undefined,
      };
    }

    return {
      ok: true,
      leadUpdated: json.leadUpdated === true,
      linkCount: typeof json.linkCount === 'number' ? json.linkCount : 0,
    };
  };
};
