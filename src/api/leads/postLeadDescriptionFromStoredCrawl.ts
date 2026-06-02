import { API_CONFIG } from '@/config/api';

/**
 * Triggers description AI from last stored website crawl (Express POST /api/services/lead-description-from-stored-crawl). No Apify.
 */
export const postLeadDescriptionFromStoredCrawl = async (
  leadId: string
): Promise<Response> => {
  return fetch(`${API_CONFIG.SERVER_URL}/api/services/lead-description-from-stored-crawl`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ leadId }),
  });
};
