import { API_CONFIG } from '@/config/api';

/**
 * Triggers same-domain website URL discovery for one lead (Express POST /api/services/lead-same-domain-url-discovery).
 */
export const postLeadSameDomainUrlDiscoveryForLead = async (
  leadId: string
): Promise<Response> => {
  return fetch(`${API_CONFIG.SERVER_URL}/api/services/lead-same-domain-url-discovery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ leadId }),
  });
};
