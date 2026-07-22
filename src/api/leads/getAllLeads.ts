import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { Lead } from '@/model';
import type { ApiResult } from '../types';

export const getAllLeads = async (): Promise<ApiResult<Lead[]>> => {
  const result = await requestApi<Lead[]>(`${API_CONFIG.SERVER_URL}/api/data/leads`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  if (!result.success && result.httpStatus === 404) {
    return { success: true, data: [], httpStatus: 404 };
  }
  if (!result.success && result.error?.includes('Invalid JSON')) {
    return {
      success: false,
      error: 'API endpoint not found or returned invalid response',
      httpStatus: result.httpStatus,
    };
  }
  if (!result.success || result.httpStatus >= 400) return result;
  return { ...result, data: result.data ?? [] };
};
