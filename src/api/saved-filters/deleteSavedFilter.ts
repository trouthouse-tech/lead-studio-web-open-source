import { getMentoraiDataApiBaseUrl } from '@/config/api';
import type { ApiResponse } from '../types';

/**
 * DELETE `/api/data/saved-filters/:id` (optional `user_id` query for multi-tenant safety).
 */
export const deleteSavedFilter = async (input: {
  userId?: string;
  id: string;
}): Promise<ApiResponse<void>> => {
  try {
    const base = getMentoraiDataApiBaseUrl();
    const q = input.userId?.trim()
      ? new URLSearchParams({ user_id: input.userId.trim() })
      : null;
    const url = q
      ? `${base}/api/data/saved-filters/${encodeURIComponent(input.id)}?${q.toString()}`
      : `${base}/api/data/saved-filters/${encodeURIComponent(input.id)}`;
    const res = await fetch(url, { method: 'DELETE' });
    const json = (await res.json()) as { success?: boolean; error?: string };
    if (!res.ok) {
      return { success: false, error: json.error || `HTTP ${res.status}` };
    }
    return { success: true, data: undefined };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    return { success: false, error: message };
  }
};
