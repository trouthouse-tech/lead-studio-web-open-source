import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { LeadCategory } from '@/model';
import type { ApiResult } from '../types';

export type UpdateLeadCategoryInput = {
  name: string;
  normalizedName: string;
};

export const updateLeadCategory = async (
  id: string,
  input: UpdateLeadCategoryInput,
  apiBaseUrl?: string
): Promise<ApiResult<LeadCategory>> => {
  const baseUrl = apiBaseUrl ?? API_CONFIG.SERVER_URL;
  const result = await requestApi<LeadCategory>(`${baseUrl}/api/data/lead-categories/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: input.name,
          normalized_name: input.normalizedName,
        }),
      });
  if (!result.success || result.httpStatus >= 400) return result;
  return result;
};
