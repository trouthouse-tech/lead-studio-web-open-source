export type LeadFacebookPostsResearchStep = 'fetch_posts' | 'score_posts' | 'full';

type PostLeadFacebookPostsResearchOptions = {
  step?: LeadFacebookPostsResearchStep;
};

/**
 * Triggers Facebook posts research for a lead (Next.js proxy → Express).
 * Use `fetch_posts` for Apify retrieval only, `score_posts` for AI score from saved posts, or `full` for both.
 */
export const postLeadFacebookPostsResearchForLead = async (
  leadId: string,
  options?: PostLeadFacebookPostsResearchOptions
): Promise<Response> => {
  const body: { step?: LeadFacebookPostsResearchStep } = {};
  if (options?.step) {
    body.step = options.step;
  }
  return fetch(`/api/leads/${encodeURIComponent(leadId)}/lead-facebook-posts-research`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
};
