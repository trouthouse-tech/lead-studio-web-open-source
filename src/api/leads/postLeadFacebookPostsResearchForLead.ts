import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { ApiResult } from '../types';

export type LeadFacebookPostsResearchStep = 'fetch_posts' | 'score_posts' | 'full';

type PostLeadFacebookPostsResearchOptions = {
  step?: LeadFacebookPostsResearchStep;
  force?: boolean;
};

/**
 * Triggers Facebook posts research for a lead (Express POST /api/services/lead-facebook-posts-research).
 * Use `fetch_posts` for Apify retrieval only, `score_posts` for AI score from saved posts, or `full` for both.
 */
export const postLeadFacebookPostsResearchForLead = async (
  leadId: string,
  options?: PostLeadFacebookPostsResearchOptions
): Promise<ApiResult<{ success?: boolean; error?: string }>> => {
  const body: {
    leadId: string;
    step?: LeadFacebookPostsResearchStep;
    force?: boolean;
  } = { leadId };
  if (options?.step) {
    body.step = options.step;
  }
  if (options?.force === true) {
    body.force = true;
  }

  return requestApi<{ success?: boolean; error?: string }>(`${API_CONFIG.SERVER_URL}/api/services/lead-facebook-posts-research`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
};
