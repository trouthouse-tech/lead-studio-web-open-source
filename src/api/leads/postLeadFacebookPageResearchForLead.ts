/**
 * Triggers Facebook page scrape for a lead (Next.js proxy → Express, persists research row).
 */
export const postLeadFacebookPageResearchForLead = async (
  leadId: string
): Promise<Response> => {
  return fetch(
    `/api/leads/${encodeURIComponent(leadId)}/lead-facebook-page-research`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    }
  );
};
