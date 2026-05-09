/**
 * Triggers description AI from last stored website crawl (Next.js proxy → Express). No Apify.
 */
export const postLeadDescriptionFromStoredCrawl = async (
  leadId: string
): Promise<Response> => {
  return fetch(
    `/api/leads/${encodeURIComponent(leadId)}/lead-description-from-stored-crawl`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    }
  );
};
