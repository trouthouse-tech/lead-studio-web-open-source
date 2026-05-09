/**
 * Triggers same-domain website URL discovery for one lead (Next.js proxy → Express).
 */
export const postLeadSameDomainUrlDiscoveryForLead = async (
  leadId: string
): Promise<Response> => {
  return fetch(`/api/leads/${encodeURIComponent(leadId)}/lead-same-domain-url-discovery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
};
