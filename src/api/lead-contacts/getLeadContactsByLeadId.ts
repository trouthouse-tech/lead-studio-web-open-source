import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { LeadContact } from '@/model/lead-contact';
import type { ApiResult } from '../types';

/**
 * GET lead contacts for one lead (Express GET /api/data/lead-contacts/lead/:leadId).
 */
export const getLeadContactsByLeadId = async (
  leadId: string
): Promise<ApiResult<LeadContact[]>> => {
  const result = await requestApi<LeadContact[]>(`${API_CONFIG.SERVER_URL}/api/data/lead-contacts/lead/${encodeURIComponent(leadId)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
  if (!result.success && result.error?.includes('Invalid JSON')) {
    return { ...result, error: 'Invalid response' };
  }
  if (!result.success || result.httpStatus >= 400) return result;
  return { ...result, data: result.data ?? [] };
};
