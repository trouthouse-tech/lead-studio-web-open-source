import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { ApiResult } from '../types';

/**
 * Triggers AI auto-categorization for a lead (Express POST /api/services/lead-auto-categorize).
 */
export const postLeadAutoCategorizeForLead = async (
  leadId: string
): Promise<ApiResult<{ success?: boolean; error?: string }>> => {
  return requestApi<{ success?: boolean; error?: string }>(`${API_CONFIG.SERVER_URL}/api/services/lead-auto-categorize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ leadId }),
  });
};
