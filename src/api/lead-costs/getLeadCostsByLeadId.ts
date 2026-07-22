import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { LeadCost } from '@/model/lead-cost';
import type { ApiResult } from '../types';

/**
 * Fetches all lead costs for a specific lead.
 * Expects backend GET /api/data/lead-costs/lead/:leadId
 */
export const getLeadCostsByLeadId = async (
  leadId: string
): Promise<ApiResult<LeadCost[]>> => {
  const url = `${API_CONFIG.SERVER_URL}/api/data/lead-costs/lead/${leadId}`;

  const result = await requestApi<LeadCost[]>(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  if (!result.success && result.httpStatus === 404) {
    return { success: true, data: [], httpStatus: 404 };
  }
  if (!result.success && result.error?.includes('Invalid JSON')) {
    return { success: true, data: [], httpStatus: result.httpStatus };
  }
  if (!result.success || result.httpStatus >= 400) return result;
  return { ...result, data: result.data ?? [] };
};
