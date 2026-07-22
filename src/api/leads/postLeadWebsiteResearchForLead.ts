import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { ApiResult } from '../types';

/**
 * Triggers manual website crawl + AI description for a lead (Express POST /api/services/lead-website-research).
 */
export const postLeadWebsiteResearchForLead = async (
  leadId: string
): Promise<ApiResult<{ success?: boolean; error?: string }>> => {
  return requestApi<{ success?: boolean; error?: string }>(`${API_CONFIG.SERVER_URL}/api/services/lead-website-research`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ leadId }),
  });
};
