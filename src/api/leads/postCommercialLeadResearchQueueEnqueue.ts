import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { ApiResult } from '../types';

export type PostCommercialLeadResearchQueueEnqueueResponseBody = {
  success?: boolean;
  batchId?: string;
  insertedCount?: number;
  error?: string;
  message?: string;
};

/**
 * Enqueues one commercial lead research row per lead (Express POST /api/data/commercial-lead-research-queue/enqueue); worker runs via cron.
 */
export const postCommercialLeadResearchQueueEnqueue = async (
  leadIds: string[]
): Promise<ApiResult<{ success?: boolean; error?: string }>> => {
  return requestApi<{ success?: boolean; error?: string }>(`${API_CONFIG.SERVER_URL}/api/data/commercial-lead-research-queue/enqueue`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ leadIds }),
  });
};
