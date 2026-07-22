import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { ToCallLog, ToCallLogStatus } from '@/model/to-call-log';
import type { ApiResult } from '../types';

export type GetAllToCallLogFilters = {
  lead_id?: string;
  lead_contact_id?: string;
  lead_contact_email_queue_id?: string;
  call_status?: ToCallLogStatus;
  limit?: number;
  offset?: number;
};

export const getAllToCallLog = async (
  filters?: GetAllToCallLogFilters
): Promise<ApiResult<ToCallLog[]>> => {
  const params = new URLSearchParams();
    if (filters?.lead_id) params.set('lead_id', filters.lead_id);
    if (filters?.lead_contact_id) {
      params.set('lead_contact_id', filters.lead_contact_id);
    }
    if (filters?.lead_contact_email_queue_id) {
      params.set('lead_contact_email_queue_id', filters.lead_contact_email_queue_id);
    }
    if (filters?.call_status) params.set('call_status', filters.call_status);
    if (typeof filters?.limit === 'number') params.set('limit', String(filters.limit));
    if (typeof filters?.offset === 'number') {
      params.set('offset', String(filters.offset));
    }

    const queryString = params.toString();

  const result = await requestApi<ToCallLog[]>(`${API_CONFIG.SERVER_URL}/api/data/to-call-log${queryString ? `?${queryString}` : ''}`, {});
  if (!result.success || result.httpStatus >= 400) return result;
  return { ...result, data: result.data ?? [] };
};
