import { API_CONFIG } from '@/config/api';
import type { ToCallLog, ToCallLogStatus } from '@/model/to-call-log';
import type { ApiResponse } from '../types';

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
): Promise<ApiResponse<ToCallLog[]>> => {
  try {
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
    const response = await fetch(
      `${API_CONFIG.SERVER_URL}/api/data/to-call-log${queryString ? `?${queryString}` : ''}`
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error:
          errorData.error ||
          errorData.message ||
          `HTTP error! status: ${response.status}`,
      };
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
