import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { ApiResult } from '../types';

export const deleteLeadContact = async (
  contactId: string
): Promise<ApiResult<void>> => {
  const result = await requestApi<void>(`${API_CONFIG.SERVER_URL}/api/data/lead-contacts/${contactId}`, { method: 'DELETE' });
  if (!result.success && result.error?.includes('Invalid JSON')) {
    return { ...result, error: 'Invalid response' };
  }
  if (!result.success || result.httpStatus >= 400) return result;
  return { ...result, success: true };
};
