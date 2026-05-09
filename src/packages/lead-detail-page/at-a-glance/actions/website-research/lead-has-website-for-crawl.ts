/**
 * True if the lead has a primary website or at least one URL from e.g. Google search.
 */
export const leadHasWebsiteForCrawl = (params: {
  website: string | null | undefined;
  websiteUrls: string[] | undefined;
}): boolean => {
  if (params.website?.trim()) return true;
  return (params.websiteUrls ?? []).some((u) => typeof u === 'string' && u.trim().length > 0);
};
