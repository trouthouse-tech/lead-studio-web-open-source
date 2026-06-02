import { API_CONFIG } from '@/config/api';

/**
 * Triggers AI summary from dictation notes and updates `leads.summary` + `leads.description` (Express POST /api/services/lead-dictation-notes-research).
 */
export const postLeadDictationNotesResearchForLead = async (
  leadId: string,
  notes: string
): Promise<Response> => {
  return fetch(`${API_CONFIG.SERVER_URL}/api/services/lead-dictation-notes-research`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ leadId, notes }),
  });
};
