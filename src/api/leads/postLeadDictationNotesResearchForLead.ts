/**
 * Triggers AI summary from dictation notes and updates `leads.summary` + `leads.description`.
 */
export const postLeadDictationNotesResearchForLead = async (
  leadId: string,
  notes: string
): Promise<Response> => {
  return fetch(`/api/leads/${encodeURIComponent(leadId)}/lead-dictation-notes-research`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ notes }),
  });
};
