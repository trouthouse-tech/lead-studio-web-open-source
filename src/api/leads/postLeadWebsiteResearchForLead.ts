/**
 * Triggers manual website crawl + AI description for a lead (Next.js proxy → Express).
 */
export const postLeadWebsiteResearchForLead = async (
  leadId: string
): Promise<Response> => {
  return fetch(`/api/leads/${encodeURIComponent(leadId)}/lead-website-research`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
};
