export type LeadGoogleSearchPlatform = 'facebook' | 'instagram' | 'linkedin';

export type FacebookGoogleSearchRequestSource = 'leads_table' | 'lead_detail';

type PostOptions = {
  platform: LeadGoogleSearchPlatform;
  /** Facebook only: `leads_table` enforces one run from the leads list row; omit or `lead_detail` for lead detail (repeatable). */
  facebookRequestSource?: FacebookGoogleSearchRequestSource;
};

/**
 * Triggers manual Google SERP research for one online profile (Next.js proxy → Express).
 */
export const postLeadGoogleSearchForLead = async (
  leadId: string,
  options: PostOptions
): Promise<Response> => {
  const body: {
    platform: LeadGoogleSearchPlatform;
    facebookRequestSource?: FacebookGoogleSearchRequestSource;
  } = { platform: options.platform };
  if (options.platform === 'facebook' && options.facebookRequestSource) {
    body.facebookRequestSource = options.facebookRequestSource;
  }

  return fetch(`/api/leads/${encodeURIComponent(leadId)}/lead-google-search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
};
