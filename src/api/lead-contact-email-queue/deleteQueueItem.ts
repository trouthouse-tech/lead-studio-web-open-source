import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { ApiResult } from '../types';

export const deleteQueueItem = async (
  id: string
): Promise<ApiResult<void>> => {
  const result = await requestApi<void>(`${API_CONFIG.SERVER_URL}/api/data/lead-contact-email-queue/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
  if (!result.success || result.httpStatus >= 400) return result;
  return { ...result, success: true };
};
