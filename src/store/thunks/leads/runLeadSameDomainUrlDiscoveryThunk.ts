import type { AppThunk } from '../../store';
import {
  postLeadSameDomainUrlDiscoveryForLead,
  type PostLeadSameDomainUrlDiscoveryResponseBody,
} from '@/api/leads';

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

    try {
      const res = await postLeadSameDomainUrlDiscoveryForLead(leadId);
      const text = await res.text();
      let json: PostLeadSameDomainUrlDiscoveryResponseBody = {};
      try {
        json = JSON.parse(text) as PostLeadSameDomainUrlDiscoveryResponseBody;
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
      console.error('runLeadSameDomainUrlDiscoveryThunk:', error);
      return { ok: false, status: 500 };
    }
  };
};
