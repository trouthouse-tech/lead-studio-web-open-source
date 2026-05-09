import type { Lead } from '@/model';
import { getPrimaryWebsiteForLead } from './getPrimaryWebsiteForLead';
import { hasWebsiteFactsContent } from './website-facts-labels';

/**
 * Lead has a stored Facebook profile URL (from Google search + optional scrape).
 */
export const hasFacebookProfileLink = (lead: Lead): boolean =>
  Boolean(lead.facebook_url?.trim());

/**
 * Same rule as OnlineProfilesGoogleSearchRow: extra same-domain URLs beyond the primary site.
 */
export const hasSameDomainDiscoveryResults = (lead: Lead): boolean => {
  const website = getPrimaryWebsiteForLead(lead);
  return (lead.website_urls ?? []).some((url) => {
    if (!url?.trim()) return false;
    if (!website) return true;
    return url.trim() !== website.trim();
  });
};

/**
 * Matches ResearchSummarySection: structured facts, legacy highlights, concerns, or workflows.
 */
export const hasAtAGlanceContent = (lead: Lead): boolean => {
  const summary = lead.summary;

  const hasFacts = hasWebsiteFactsContent(lead);

  const legacyHighlights = summary?.highlights?.filter((h) => h?.trim()) ?? [];
  const showLegacyHighlights = !hasFacts && legacyHighlights.length > 0;

  const concerns = summary?.concerns?.filter((c) => c?.trim()) ?? [];
  const workflows =
    summary?.recommended_workflows?.filter((w) => w?.workflow_name?.trim()) ?? [];

  return (
    hasFacts ||
    showLegacyHighlights ||
    concerns.length > 0 ||
    workflows.length > 0
  );
};

/**
 * Server persisted a summary object with a generation timestamp (crawl/AI touched the lead).
 */
export const hasWebsiteSummaryRecord = (lead: Lead): boolean =>
  Boolean(lead.summary?.generated_at?.trim());

export type LeadResearchIndicators = {
  facebook: boolean;
  googleDiscovery: boolean;
  atAGlance: boolean;
  websiteSummaryRecord: boolean;
};

/**
 * All client-side research completion signals for table/detail UI.
 */
export const getLeadResearchIndicators = (lead: Lead): LeadResearchIndicators => ({
  facebook: hasFacebookProfileLink(lead),
  googleDiscovery: hasSameDomainDiscoveryResults(lead),
  atAGlance: hasAtAGlanceContent(lead),
  websiteSummaryRecord: hasWebsiteSummaryRecord(lead),
});
