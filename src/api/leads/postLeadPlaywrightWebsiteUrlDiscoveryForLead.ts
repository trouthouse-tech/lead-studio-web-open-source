/**
 * Triggers Playwright nav/footer website URL discovery for one lead (Next.js proxy → Express).
 */
export const postLeadPlaywrightWebsiteUrlDiscoveryForLead = async (
  leadId: string
): Promise<Response> => {
  return fetch(
    `/api/leads/${encodeURIComponent(leadId)}/lead-playwright-website-url-discovery`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    }
  );
};
