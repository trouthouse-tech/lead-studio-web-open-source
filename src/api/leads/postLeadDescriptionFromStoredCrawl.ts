import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { ApiResult } from '../types';

/**
 * Triggers description AI from last stored website crawl (Express POST /api/services/lead-description-from-stored-crawl). No Apify.
 */
export const postLeadDescriptionFromStoredCrawl = async (
  leadId: string
): Promise<ApiResult<{ success?: boolean; error?: string }>> => {
  return requestApi<{ success?: boolean; error?: string }>(`${API_CONFIG.SERVER_URL}/api/services/lead-description-from-stored-crawl`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ leadId }),
  });
};
