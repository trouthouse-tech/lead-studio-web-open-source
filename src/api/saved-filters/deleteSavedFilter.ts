import { getMentoraiDataApiBaseUrl } from '@/config/api';
import { requestApi } from '../_shared';
import type { ApiResult } from '../types';

/**
 * DELETE `/api/data/saved-filters/:id` (optional `user_id` query for multi-tenant safety).
 */
export const deleteSavedFilter = async (input: {
  userId?: string;
  id: string;
}): Promise<ApiResult<void>> => {
  const base = getMentoraiDataApiBaseUrl();
  const q = input.userId?.trim()
    ? new URLSearchParams({ user_id: input.userId.trim() })
    : null;
  const url = q
    ? `${base}/api/data/saved-filters/${encodeURIComponent(input.id)}?${q.toString()}`
    : `${base}/api/data/saved-filters/${encodeURIComponent(input.id)}`;

  const result = await requestApi<void>(url, { method: 'DELETE' });
  if (!result.success || result.httpStatus >= 400) return result;
  return { ...result, success: true };
};
