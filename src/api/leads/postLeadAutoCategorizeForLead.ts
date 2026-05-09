/**
 * Triggers AI auto-categorization for a lead (Next.js proxy -> Express).
 */
export const postLeadAutoCategorizeForLead = async (
  leadId: string
): Promise<Response> => {
  return fetch(`/api/leads/${encodeURIComponent(leadId)}/auto-categorize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
};
