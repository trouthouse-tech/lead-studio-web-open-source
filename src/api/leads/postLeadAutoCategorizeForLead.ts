import { API_CONFIG } from '@/config/api';

/**
 * Triggers AI auto-categorization for a lead (Express POST /api/services/lead-auto-categorize).
 */
export const postLeadAutoCategorizeForLead = async (
  leadId: string
): Promise<Response> => {
  return fetch(`${API_CONFIG.SERVER_URL}/api/services/lead-auto-categorize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ leadId }),
  });
};
