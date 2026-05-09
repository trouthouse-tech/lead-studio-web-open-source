import type { AppThunk } from '../../store';
import {
  postCommercialLeadResearchQueueEnqueue,
  type PostCommercialLeadResearchQueueEnqueueResponseBody,
} from '@/api/leads';
import { getAllLeadsThunk } from './getAllLeadsThunk';

export type RunLeadResearchPipelineResult =
  | {
      ok: true;
      batchId?: string;
      insertedCount?: number;
    }
  | { ok: false; status: 400 | 500; message?: string };

type ResponseType = Promise<RunLeadResearchPipelineResult>;

/**
 * Enqueues one commercial lead research row per selected lead (cron/worker runs processing).
 */
export const runLeadResearchPipelineThunk = (): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    const leadIds = getState().leadBuilder.selectedLeadIds;
    if (leadIds.length === 0) {
      return { ok: false, status: 400, message: 'Select at least one lead' };
    }

    try {
      const res = await postCommercialLeadResearchQueueEnqueue(leadIds);
      const text = await res.text();
      let json: PostCommercialLeadResearchQueueEnqueueResponseBody = {};
      try {
        json = JSON.parse(text) as PostCommercialLeadResearchQueueEnqueueResponseBody;
      } catch {
        return { ok: false, status: 500, message: 'Invalid response' };
      }

      if (!res.ok) {
        return {
          ok: false,
          status: res.status >= 500 ? 500 : 400,
          message:
            typeof json.message === 'string'
              ? json.message
              : typeof json.error === 'string'
                ? json.error
                : undefined,
        };
      }

      if (json.success === false) {
        return {
          ok: false,
          status: 400,
          message: typeof json.error === 'string' ? json.error : undefined,
        };
      }

      await dispatch(getAllLeadsThunk());

      return {
        ok: true,
        batchId: typeof json.batchId === 'string' ? json.batchId : undefined,
        insertedCount: typeof json.insertedCount === 'number' ? json.insertedCount : undefined,
      };
    } catch (error: unknown) {
      console.error('runLeadResearchPipelineThunk:', error);
      return { ok: false, status: 500 };
    }
  };
};
