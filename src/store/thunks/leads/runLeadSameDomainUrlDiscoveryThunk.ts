import { mapApiFailureToThunkStatus } from '@/api/_shared';
import {
  postLeadSameDomainUrlDiscoveryForLead,
  type PostLeadSameDomainUrlDiscoveryResponseBody,
} from '@/api/leads';
import type { AppThunk } from '../../store';

export type RunLeadSameDomainUrlDiscoveryResult =
  | { ok: true; leadUpdated: boolean; linkCount: number }
  | { ok: false; status: 400 | 500; error?: string; message?: string };

type ResponseType = Promise<RunLeadSameDomainUrlDiscoveryResult>;

/**
 * POST same-domain website URL discovery for a lead.
 * Pass `targetLeadId` from list rows; otherwise uses `currentLead.id`.
 */
export const runLeadSameDomainUrlDiscoveryThunk = (
  targetLeadId?: string
): AppThunk<ResponseType> => {
  return async (_dispatch, getState): ResponseType => {
    const leadId = targetLeadId ?? getState().currentLead?.id;
    if (!leadId) {
      return { ok: false, status: 400 };
    }

    const result = await postLeadSameDomainUrlDiscoveryForLead(leadId);

    if (!result.success) {
      const json = (result.data ?? result) as PostLeadSameDomainUrlDiscoveryResponseBody;
      return {
        ok: false,
        status: mapApiFailureToThunkStatus(result),
        error: typeof json.error === 'string' ? json.error : result.error,
        message: typeof json.message === 'string' ? json.message : undefined,
      };
    }

    const json = (result.data ?? result) as PostLeadSameDomainUrlDiscoveryResponseBody;

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
