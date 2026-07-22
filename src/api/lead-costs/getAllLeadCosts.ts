import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { LeadCost } from '@/model/lead-cost';
import type { ApiResult } from '../types';

export type GetAllLeadCostsParams = {
  lead_id?: string;
};

/**
 * Fetches all lead costs from the server.
 * Expects backend GET /api/data/lead-costs (e.g. tht-express-server lead-costs router).
 */
export const getAllLeadCosts = async (
  params?: GetAllLeadCostsParams
): Promise<ApiResult<LeadCost[]>> => {
  const searchParams = new URLSearchParams();
    if (params?.lead_id) searchParams.append('leadId', params.lead_id);
    const queryString = searchParams.toString();
    const url = `${API_CONFIG.SERVER_URL}/api/data/lead-costs${queryString ? `?${queryString}` : ''}`;

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
