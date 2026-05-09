import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { Lead } from '@/model';
import type { GoogleMapsScrapeRun } from '@/model';
import { DASHBOARD_ONBOARDING_PREVIEW_ROWS_PER_SECTION } from '@/utils/dashboard';

export type OnboardingLeadGroup = {
  runId: string;
  title: string;
  searchQuery: string;
  leads: Lead[];
};

const selectLeadsMap = (state: RootState) => state.leads;
const selectGoogleMapsScrapeRunsMap = (state: RootState) =>
  state.googleMapsScrapeRuns;
const selectOnboardingScrapeRunIds = (state: RootState) =>
  state.dashboardBuilder.onboardingScrapeRunIds;

/**
 * Groups leads from the current onboarding batch by scrape run, for dashboard preview.
 * Order follows `onboardingScrapeRunIds`. Caps rows per section in the UI layer via slice on leads array.
 */
export const selectOnboardingLeadsGrouped = createSelector(
  [
    selectLeadsMap,
    selectGoogleMapsScrapeRunsMap,
    selectOnboardingScrapeRunIds,
  ],
  (
    leadsMap,
    runsMap,
    runIds
  ): OnboardingLeadGroup[] => {
    const leads = Object.values(leadsMap);
    const byRunId = new Map<string, Lead[]>();

    for (const lead of leads) {
      const rid = lead.search_run_id ?? null;
      if (!rid || !runIds.includes(rid)) continue;
      const list = byRunId.get(rid) ?? [];
      list.push(lead);
      byRunId.set(rid, list);
    }

    const result: OnboardingLeadGroup[] = [];
    for (const runId of runIds) {
      const runLeads = (byRunId.get(runId) ?? []).slice(
        0,
        DASHBOARD_ONBOARDING_PREVIEW_ROWS_PER_SECTION
      );
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
  }
);

export const selectOnboardingPreviewLeadTotal = createSelector(
  [selectOnboardingLeadsGrouped],
  (groups) => groups.reduce((n, g) => n + g.leads.length, 0)
);

/** All leads tied to onboarding run ids (not capped), for copy like "We found N businesses". */
export const selectOnboardingTotalLeadsInBatch = createSelector(
  [selectLeadsMap, selectOnboardingScrapeRunIds],
  (leadsMap, runIds) => {
    const set = new Set(runIds);
    return Object.values(leadsMap).filter(
      (l) => l.search_run_id != null && set.has(l.search_run_id)
    ).length;
  }
);
