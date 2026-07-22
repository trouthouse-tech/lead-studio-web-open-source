import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { LeadAiExchangeCostRow } from '@/model';
import type { ApiResult } from '../types';

/**
 * GET /api/data/leads/:leadId/ai-exchange-costs — contact chat, website at-a-glance, and Google profile
 * SERP resolution AI rows with tokens.
 */
export const getLeadAiExchangeCostsForLead = async (
  leadId: string,
): Promise<ApiResult<LeadAiExchangeCostRow[]>> => {
  const url = `${API_CONFIG.SERVER_URL}/api/data/leads/${encodeURIComponent(leadId)}/ai-exchange-costs`;

  const result = await requestApi<LeadAiExchangeCostRow[]>(url, {
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
