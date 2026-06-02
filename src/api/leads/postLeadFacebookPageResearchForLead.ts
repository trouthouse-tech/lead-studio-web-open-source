import { API_CONFIG } from '@/config/api';

/**
 * Triggers Facebook page scrape for a lead (Express POST /api/services/lead-facebook-page-research).
 */
export const postLeadFacebookPageResearchForLead = async (
  leadId: string
): Promise<Response> => {
  return fetch(`${API_CONFIG.SERVER_URL}/api/services/lead-facebook-page-research`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ leadId }),
  });
};
