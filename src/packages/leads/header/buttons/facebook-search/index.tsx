'use client';

import { useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  leadNeedsFacebookSearchFromList,
  runSocialSearchForLeadsBatchThunk,
} from '@/store/thunks/leads';
import {
  getFilteredSortedLeadsForList,
  getLeadIdsWithAtLeastOneContactSet,
} from '@/utils/leads';

/**
 * Bulk Facebook search for leads in the current filtered view that still need it.
 */
export const LeadsHeaderFacebookSearchButton = () => {
  const dispatch = useAppDispatch();
  const leadsRecord = useAppSelector((state) => state.leads);
  const leadContactsRecord = useAppSelector((state) => state.leadContacts);
  const leadCategories = useAppSelector((state) => state.leadCategories);
  const leadsFilters = useAppSelector((state) => state.leadsFilters);
  const leadBuilder = useAppSelector((state) => state.leadBuilder);
  const busy = leadBuilder.isLeadsListSocialSearchBatchBusy;
  const researchGloballyBusy =
    leadBuilder.researchRunPhase !== 'idle' ||
    leadBuilder.isLeadsListFullResearchBatchBusy;

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
    return sorted.filter(leadNeedsFacebookSearchFromList).length;
  }, [leadsRecord, leadContactsRecord, leadCategories, leadsFilters]);

  const disabled = busy || researchGloballyBusy || eligibleCount === 0;

  const handleClick = async (): Promise<void> => {
    if (disabled) return;

    const ok = window.confirm(
      `Search Facebook on ${eligibleCount} lead${eligibleCount === 1 ? '' : 's'}? Scrapes email/phone when a page is found. Already-searched leads are skipped.`
    );
    if (!ok) return;

    const result = await dispatch(runSocialSearchForLeadsBatchThunk('facebook'));
    if (!result.ok) {
      toast.error(result.message ?? 'Facebook search batch failed');
      return;
    }

    if (result.failed === 0) {
      toast.success(
        `Facebook search finished for ${result.succeeded} lead${result.succeeded === 1 ? '' : 's'}`
      );
      return;
    }

    toast.warning(
      `Facebook search finished: ${result.succeeded} succeeded, ${result.failed} failed`
    );
  };

  return (
    <button
      type="button"
      className={styles.button}
      disabled={disabled}
      title={
        eligibleCount === 0
          ? 'No leads need Facebook search in the current view'
          : `Search Facebook once on ${eligibleCount} lead${eligibleCount === 1 ? '' : 's'}`
      }
      onClick={() => {
        void handleClick();
      }}
    >
      {busy ? <Loader2 className={styles.loader} aria-hidden /> : null}
      <span>Facebook{eligibleCount > 0 ? ` (${eligibleCount})` : ''}</span>
    </button>
  );
};

const styles = {
  button: `
    inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md border border-gray-300 bg-white
    px-2 py-1 text-xs font-medium text-gray-800
    hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed
  `,
  loader: `h-3.5 w-3.5 animate-spin shrink-0`,
};
