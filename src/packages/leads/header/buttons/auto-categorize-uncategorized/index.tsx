'use client';

import { useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { autoCategorizeUncategorizedBatchThunk } from '@/store/thunks/leads';
import {
  getFilteredSortedLeadsForList,
  getLeadIdsWithAtLeastOneContactSet,
} from '@/utils/leads';

export const LeadsHeaderAutoCategorizeUncategorizedButton = () => {
  const dispatch = useAppDispatch();
  const leadsRecord = useAppSelector((state) => state.leads);
  const leadContactsRecord = useAppSelector((state) => state.leadContacts);
  const leadCategories = useAppSelector((state) => state.leadCategories);
  const selectedCategoryIds = useAppSelector(
    (state) => state.leadsFilters.selectedCategoryIds
  );
  const selectedStatus = useAppSelector((state) => state.leadsFilters.selectedStatus);
  const searchFilter = useAppSelector((state) => state.leadsFilters.searchFilter);
  const qualityFilter = useAppSelector((state) => state.leadsFilters.qualityFilter);
  const websiteFilter = useAppSelector((state) => state.leadsFilters.websiteFilter);
  const leadContactFilter = useAppSelector((state) => state.leadsFilters.leadContactFilter);
  const facebookGoogleSearchFilter = useAppSelector(
    (state) => state.leadsFilters.facebookGoogleSearchFilter
  );
  const playwrightUrlDiscoveryFilter = useAppSelector(
    (state) => state.leadsFilters.playwrightUrlDiscoveryFilter
  );
  const websiteResearchFilter = useAppSelector(
    (state) => state.leadsFilters.websiteResearchFilter
  );
  const busy = useAppSelector((state) => state.leadBuilder.isUncategorizedBatchCategorizing);

  const visible =
    selectedCategoryIds.includes('uncategorized') && leadCategories.length > 0;

  const uncategorizedCount = useMemo(() => {
    if (!visible) {
      return 0;
    }
    const leadsList = Object.values(leadsRecord);
    const leadIdsWithAtLeastOneContact =
      getLeadIdsWithAtLeastOneContactSet(leadContactsRecord);
    const sorted = getFilteredSortedLeadsForList({
      leads: leadsList,
      leadCategories,
      filters: {
        selectedCategoryIds,
        selectedStatus,
        searchFilter,
        qualityFilter,
        websiteFilter,
        leadContactFilter,
        facebookGoogleSearchFilter,
        playwrightUrlDiscoveryFilter,
        websiteResearchFilter,
      },
      leadIdsWithAtLeastOneContact,
      sortColumn: 'quality_score',
      sortDirection: 'desc',
    });
    return sorted.filter((lead) => !lead.category_id && !lead.category_name).length;
  }, [
    visible,
    leadsRecord,
    leadContactsRecord,
    leadCategories,
    selectedCategoryIds,
    selectedStatus,
    searchFilter,
    qualityFilter,
    websiteFilter,
    leadContactFilter,
    facebookGoogleSearchFilter,
    playwrightUrlDiscoveryFilter,
    websiteResearchFilter,
  ]);

  if (!visible) {
    return null;
  }

  const disabled = busy || uncategorizedCount === 0;

  const handleClick = async (): Promise<void> => {
    if (disabled) {
      return;
    }
    const result = await dispatch(autoCategorizeUncategorizedBatchThunk());
    if (!result.ok) {
      toast.error(result.message ?? 'Auto-categorize failed');
      return;
    }
    const skippedPart =
      result.skipped > 0
        ? ` (${result.skipped} with no category or update failed)`
        : '';
    toast.success(
      `Updated ${result.updated} lead${result.updated === 1 ? '' : 's'}${skippedPart}`
    );
  };

  return (
    <button
      type="button"
      className={styles.button}
      disabled={disabled}
      title={
        uncategorizedCount === 0
          ? 'No uncategorized leads in the current view'
          : 'AI: assign up to 10 uncategorized leads to existing categories'
      }
      onClick={() => {
        void handleClick();
      }}
    >
      {busy ? <Loader2 className={styles.loader} aria-hidden /> : null}
      <span>Auto-categorize</span>
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
