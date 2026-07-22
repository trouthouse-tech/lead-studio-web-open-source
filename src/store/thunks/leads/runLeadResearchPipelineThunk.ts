import { mapApiFailureToThunkStatus } from '@/api/_shared';
import {
  postCommercialLeadResearchQueueEnqueue,
  type PostCommercialLeadResearchQueueEnqueueResponseBody,
} from '@/api/leads';
import type { AppThunk } from '../../store';
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

    const result = await postCommercialLeadResearchQueueEnqueue(leadIds);

    if (!result.success) {
      const json = (result.data ?? result) as PostCommercialLeadResearchQueueEnqueueResponseBody;
      return {
        ok: false,
        status: mapApiFailureToThunkStatus(result),
        message:
          typeof json.message === 'string'
            ? json.message
            : typeof json.error === 'string'
              ? json.error
              : result.error,
      };
    }

    const json = (result.data ?? result) as PostCommercialLeadResearchQueueEnqueueResponseBody;

    if (json.success === false) {
      return {
        ok: false,
        status: 500,
        message: typeof json.error === 'string' ? json.error : undefined,
      };
    }

    await dispatch(getAllLeadsThunk());

    return {
      ok: true,
      batchId: typeof json.batchId === 'string' ? json.batchId : undefined,
      insertedCount: typeof json.insertedCount === 'number' ? json.insertedCount : undefined,
    };
  };
};
