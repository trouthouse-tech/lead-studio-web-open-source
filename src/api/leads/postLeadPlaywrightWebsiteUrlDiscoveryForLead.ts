import { API_CONFIG } from '@/config/api';

/**
 * Triggers Playwright nav/footer website URL discovery for one lead (Express POST /api/services/lead-playwright-website-url-discovery).
 */
export const postLeadPlaywrightWebsiteUrlDiscoveryForLead = async (
  leadId: string
): Promise<Response> => {
  return fetch(
    `${API_CONFIG.SERVER_URL}/api/services/lead-playwright-website-url-discovery`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId }),
    }
  );
};
