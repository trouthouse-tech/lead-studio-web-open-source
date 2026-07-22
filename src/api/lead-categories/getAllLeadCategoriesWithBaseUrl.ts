import { requestApi } from '../_shared';
import type { LeadCategory } from '@/model';
import type { ApiResult } from '../types';

/**
 * Fetch categories with explicit base URL (server-side scraper upload).
 */
export const getAllLeadCategoriesWithBaseUrl = async (
  apiBaseUrl: string
): Promise<ApiResult<LeadCategory[]>> => {
  const result = await requestApi<LeadCategory[]>(`${apiBaseUrl}/api/data/lead-categories`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!result.success || result.httpStatus >= 400) {
    return { ...result, error: result.error ?? 'Failed to get lead categories' };
  }
  const list = result.data ?? [];
  return { ...result, data: Array.isArray(list) ? list : [] };
};
