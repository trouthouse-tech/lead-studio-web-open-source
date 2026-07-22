import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { LeadContactEmailQueue } from '@/model/lead-contact-email-queue';
import type { ApiResult } from '../types';

export type GetQueueItemsFilters = {
  status?: 'queued' | 'sending' | 'sent' | 'failed';
  lead_id?: string;
  lead_contact_id?: string;
  campaign_id?: string;
  limit?: number;
  offset?: number;
};

/**
 * Fetches all lead contact email queue items.
 * If endpoint is missing (404) or non-JSON, returns empty array.
 */
export const getAllQueueItems = async (
  filters?: GetQueueItemsFilters
): Promise<ApiResult<LeadContactEmailQueue[]>> => {
  const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.lead_id) params.append('lead_id', filters.lead_id);
    if (filters?.lead_contact_id)
      params.append('lead_contact_id', filters.lead_contact_id);
    if (filters?.campaign_id) params.append('campaign_id', filters.campaign_id);
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.offset) params.append('offset', String(filters.offset));

    const url = `${API_CONFIG.SERVER_URL}/api/data/lead-contact-email-queue${params.toString() ? `?${params.toString()}` : ''}`;

  const result = await requestApi<LeadContactEmailQueue[]>(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  if (!result.success && result.httpStatus === 404) {
    return { success: true, data: [], httpStatus: 404 };
  }
  if (!result.success && result.error?.includes('Invalid JSON')) {
    return { success: true, data: [], httpStatus: result.httpStatus };
  }
  if (!result.success || result.httpStatus >= 400) return result;
  return { ...result, data: result.data ?? [] };
};
