import { API_CONFIG } from '@/config/api';

export type LeadGoogleSearchPlatform = 'facebook' | 'instagram' | 'linkedin';

export type FacebookGoogleSearchRequestSource = 'leads_table' | 'lead_detail';

type PostOptions = {
  platform: LeadGoogleSearchPlatform;
  /** Facebook only: `leads_table` enforces one run from the leads list row; omit or `lead_detail` for lead detail (repeatable). */
  facebookRequestSource?: FacebookGoogleSearchRequestSource;
};

/**
 * Triggers manual Google SERP research for one online profile (Express POST /api/services/lead-google-search/:platform).
 */
export const postLeadGoogleSearchForLead = async (
  leadId: string,
  options: PostOptions
): Promise<Response> => {
  const body: {
    leadId: string;
    facebookRequestSource?: FacebookGoogleSearchRequestSource;
  } = { leadId };
  if (options.platform === 'facebook' && options.facebookRequestSource) {
    body.facebookRequestSource = options.facebookRequestSource;
  }

  return fetch(
    `${API_CONFIG.SERVER_URL}/api/services/lead-google-search/${options.platform}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );
};
