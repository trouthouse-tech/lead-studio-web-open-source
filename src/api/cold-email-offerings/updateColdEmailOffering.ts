import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { ColdEmailOffering } from '@/model/cold-email-offering';
import type { ApiResult } from '../types';

export type UpdateColdEmailOfferingInput = {
  title?: string;
  hook?: string;
  description?: string;
  source_notes?: string;
  sort_order?: number;
  is_archived?: boolean;
};

/**
 * PATCH `/api/data/cold-email-offerings/:id`
 */
export const updateColdEmailOffering = async (
  id: string,
  input: UpdateColdEmailOfferingInput,
): Promise<ApiResult<ColdEmailOffering>> => {
  const result = await requestApi<ColdEmailOffering>(`${API_CONFIG.SERVER_URL}/api/data/cold-email-offerings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
  if (!result.success || result.httpStatus >= 400) return result;
  return result;
};
