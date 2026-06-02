import { API_CONFIG } from '@/config/api';

/**
 * Triggers manual website crawl + AI description for a lead (Express POST /api/services/lead-website-research).
 */
export const postLeadWebsiteResearchForLead = async (
  leadId: string
): Promise<Response> => {
  return fetch(`${API_CONFIG.SERVER_URL}/api/services/lead-website-research`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ leadId }),
  });
};
