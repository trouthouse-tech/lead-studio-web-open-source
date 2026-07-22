'use client';

import { useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { runFullResearchForUnresearchedLeadsBatchThunk } from '@/store/thunks/leads';
import {
  getFilteredSortedLeadsForList,
  getLeadIdsWithAtLeastOneContactSet,
  getPrimaryWebsiteForLead,
} from '@/utils/leads';

/**
 * Runs full research once per lead in the current filtered list that has a website and has
 * never had website research attempted (`website_research_attempted`).
 */
export const LeadsHeaderResearchLeadsButton = () => {
  const dispatch = useAppDispatch();
  const leadsRecord = useAppSelector((state) => state.leads);
  const leadContactsRecord = useAppSelector((state) => state.leadContacts);
  const leadCategories = useAppSelector((state) => state.leadCategories);
  const leadsFilters = useAppSelector((state) => state.leadsFilters);
  const leadBuilder = useAppSelector((state) => state.leadBuilder);
  const busy = leadBuilder.isLeadsListFullResearchBatchBusy;
  const researchGloballyBusy =
    leadBuilder.researchRunPhase !== 'idle' ||
    leadBuilder.isLeadsListSocialSearchBatchBusy;

  const eligibleCount = useMemo(() => {
    const leadsList = Object.values(leadsRecord);
    const leadIdsWithAtLeastOneContact =
      getLeadIdsWithAtLeastOneContactSet(leadContactsRecord);
    const sorted = getFilteredSortedLeadsForList({
      leads: leadsList,
      leadCategories,
      filters: {
        selectedCategoryIds: leadsFilters.selectedCategoryIds,
        selectedStatus: leadsFilters.selectedStatus,
        searchFilter: leadsFilters.searchFilter,
        qualityFilter: leadsFilters.qualityFilter,
        websiteFilter: leadsFilters.websiteFilter,
        leadContactFilter: leadsFilters.leadContactFilter,
        facebookGoogleSearchFilter: leadsFilters.facebookGoogleSearchFilter,
        playwrightUrlDiscoveryFilter: leadsFilters.playwrightUrlDiscoveryFilter,
        websiteResearchFilter: leadsFilters.websiteResearchFilter,
      },
      leadIdsWithAtLeastOneContact,
      sortColumn: 'quality_score',
      sortDirection: 'desc',
    });
    return sorted.filter(
      (lead) =>
        !!getPrimaryWebsiteForLead(lead) && lead.website_research_attempted !== true
    ).length;
  }, [leadsRecord, leadContactsRecord, leadCategories, leadsFilters]);

  const disabled = busy || researchGloballyBusy || eligibleCount === 0;

  const handleClick = async (): Promise<void> => {
    if (disabled) return;

    const ok = window.confirm(
      `Run full research on ${eligibleCount} lead${eligibleCount === 1 ? '' : 's'} that have not been researched yet? Includes site pages, website crawl, Facebook (email/phone scrape), and Instagram. Already-researched leads are skipped.`
    );
    if (!ok) return;

    const result = await dispatch(runFullResearchForUnresearchedLeadsBatchThunk());
    if (!result.ok) {
      toast.error(result.message ?? 'Research batch failed');
      return;
    }

    if (result.failed === 0) {
      toast.success(
        `Research finished for ${result.succeeded} lead${result.succeeded === 1 ? '' : 's'}`
      );
      return;
    }

    toast.warning(
      `Research finished: ${result.succeeded} succeeded, ${result.failed} failed`
    );
  };

  return (
    <button
      type="button"
      className={styles.researchButton}
      disabled={disabled}
      title={
        eligibleCount === 0
          ? 'No unresearched leads with a website in the current view'
          : `Run full research once on ${eligibleCount} unresearched lead${eligibleCount === 1 ? '' : 's'}`
      }
      onClick={() => {
        void handleClick();
      }}
    >
      {busy ? <Loader2 className={styles.loader} aria-hidden /> : null}
      <span>Research{eligibleCount > 0 ? ` (${eligibleCount})` : ''}</span>
    </button>
  );
};

const styles = {
  researchButton: `
    inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md border border-gray-300 bg-white
    px-2 py-1 text-xs font-medium text-gray-800
    hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed
  `,
  loader: `h-3.5 w-3.5 animate-spin shrink-0`,
};
