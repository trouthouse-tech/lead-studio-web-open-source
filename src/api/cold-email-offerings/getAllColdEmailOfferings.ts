import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { ColdEmailOffering } from '@/model/cold-email-offering';
import type { ApiResult } from '../types';

/**
 * GET `/api/data/cold-email-offerings`
 */
export const getAllColdEmailOfferings = async (
  includeArchived = false,
): Promise<ApiResult<ColdEmailOffering[]>> => {
  const qs = includeArchived ? '?include_archived=true' : '';

  const result = await requestApi<ColdEmailOffering[]>(`${API_CONFIG.SERVER_URL}/api/data/cold-email-offerings${qs}`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
  if (!result.success || result.httpStatus >= 400) return result;
  return { ...result, data: result.data ?? [] };
};
