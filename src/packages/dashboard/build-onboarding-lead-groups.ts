import type { Lead, GoogleMapsScrapeRun } from '@/model';
import { filterLeadsFromGoogleMapsScrapeRun } from '@/utils/leads';

export type OnboardingLeadGroup = {
  runId: string;
  title: string;
  searchQuery: string;
  leads: Lead[];
};

/**
 * Leads for a scrape run: prefer search_run_id, fall back to gmaps idempotency prefix.
 */
const leadsForScrapeRun = (leads: Lead[], runId: string): Lead[] => {
  const bySearchRun = leads.filter((l) => l.search_run_id === runId);
  if (bySearchRun.length > 0) {
    return bySearchRun;
  }
  return filterLeadsFromGoogleMapsScrapeRun(leads, runId);
};

/**
 * Groups leads from the current onboarding batch by scrape run (all rows).
 */
export const buildOnboardingLeadsGrouped = (
  leadsMap: Record<string, Lead>,
  runsMap: Record<string, GoogleMapsScrapeRun>,
  runIds: string[],
): OnboardingLeadGroup[] => {
  const leads = Object.values(leadsMap);
  const result: OnboardingLeadGroup[] = [];

  for (const runId of runIds) {
    const runLeads = leadsForScrapeRun(leads, runId);
    const run: GoogleMapsScrapeRun | undefined = runsMap[runId];
    const title = run?.name ?? run?.searchQuery ?? 'Results';
    const searchQuery = run?.searchQuery ?? '';
    result.push({
      runId,
      title,
      searchQuery,
      leads: runLeads,
    });
  }

  return result;
};

/**
 * All leads tied to onboarding run ids.
 */
export const countOnboardingTotalLeadsInBatch = (
  leadsMap: Record<string, Lead>,
  runIds: string[],
): number => {
  const leads = Object.values(leadsMap);
  let total = 0;
  for (const runId of runIds) {
    total += leadsForScrapeRun(leads, runId).length;
  }
  return total;
};
