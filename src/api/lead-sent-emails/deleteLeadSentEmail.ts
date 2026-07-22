import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { ApiResult } from '../types';

/**
 * Deletes a lead sent email by ID.
 */
export const deleteLeadSentEmail = async (id: string): Promise<ApiResult<void>> => {
  const result = await requestApi<void>(
    `${API_CONFIG.SERVER_URL}/api/data/lead-sent-emails/${id}`,
    { method: 'DELETE', headers: { 'Content-Type': 'application/json' } },
  );

  if (!result.success || result.httpStatus >= 400) {
    return {
      ...result,
      success: false,
      error: result.error ?? 'Failed to delete lead sent email',
    };
  }

  return { ...result, success: true };
};
