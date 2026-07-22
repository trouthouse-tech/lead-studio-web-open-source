import { coerceErrorFields, reportThunkError } from '@/api/thunk-errors';
import { postLeadAutoCategorizeBatch } from '@/api/leads';
import { LeadBuilderActions } from '@/store/builders';
import {
  getFilteredSortedLeadsForList,
  getLeadIdsWithAtLeastOneContactSet,
} from '@/utils/leads';
import type { AppThunk } from '../../store';
import { updateLeadThunk } from './updateLeadThunk';

const BATCH_SIZE = 10;

export type AutoCategorizeUncategorizedBatchResult =
  | { ok: true; updated: number; skipped: number }
  | { ok: false; status: 400 | 500; message?: string };

type ResponseType = Promise<AutoCategorizeUncategorizedBatchResult>;

/**
 * AI-suggest categories for up to 10 uncategorized leads in the current filtered list (default table sort).
 */
export const autoCategorizeUncategorizedBatchThunk = (): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    const state = getState();
    const leadsRecord = state.leads;
    const leadContactsRecord = state.leadContacts;
    const leadCategories = state.leadCategories;
    const {
      selectedCategoryIds,
      selectedStatus,
      searchFilter,
      qualityFilter,
      websiteFilter,
      leadContactFilter,
      facebookGoogleSearchFilter,
      playwrightUrlDiscoveryFilter,
      websiteResearchFilter,
    } = state.leadsFilters;

    if (!selectedCategoryIds.includes('uncategorized')) {
      return { ok: false, status: 400, message: 'Uncategorized filter not active' };
    }
    if (leadCategories.length === 0) {
      return { ok: false, status: 400, message: 'No categories defined' };
    }

    const leadsList = Object.values(leadsRecord);
    const leadIdsWithAtLeastOneContact =
      getLeadIdsWithAtLeastOneContactSet(leadContactsRecord);
    const sortedLeads = getFilteredSortedLeadsForList({
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

    const targets = sortedLeads
      .filter((lead) => !lead.category_id && !lead.category_name)
      .slice(0, BATCH_SIZE);

    if (targets.length === 0) {
      return {
        ok: false,
        status: 400,
        message: 'No uncategorized leads in this view',
      };
    }

    dispatch(LeadBuilderActions.setUncategorizedBatchCategorizing(true));
    try {
      const categories = leadCategories.map((c) => ({
        id: c.id,
        name: c.name,
        normalized_name: c.normalized_name,
      }));
      const leadsPayload = targets.map((l) => ({
        id: l.id,
        business_name: l.business_name,
        description: l.description ?? null,
        website: l.website ?? null,
        address: l.address ?? null,
        summary: l.summary ?? null,
      }));

      const res = await postLeadAutoCategorizeBatch(categories, leadsPayload);

      if (!res.success || !Array.isArray(res.assignments)) {
        return {
          ok: false,
          status: 500,
          message: res.error ?? 'Batch categorization failed',
        };
      }

      let updated = 0;
      let skipped = 0;
      for (const row of res.assignments) {
        if (!row.categoryId) {
          skipped += 1;
          continue;
        }
        const cat = leadCategories.find((c) => c.id === row.categoryId);
        if (!cat) {
          skipped += 1;
          continue;
        }
        const status = await dispatch(
          updateLeadThunk(row.leadId, {
            category_id: cat.id,
            category_name: cat.name,
          })
        );
        if (status === 200) {
          updated += 1;
        } else {
          skipped += 1;
        }
      }

      return { ok: true, updated, skipped };
    } catch (error: unknown) {
      const { message, stack } = coerceErrorFields(error);
      reportThunkError({
        event: 'failedToAutoCategorizeUncategorizedBatch',
        message,
        stack,
        thunkName: 'autoCategorizeUncategorizedBatchThunk',
      });
      console.error('autoCategorizeUncategorizedBatchThunk:', error);
      return { ok: false, status: 500 };
    } finally {
      dispatch(LeadBuilderActions.setUncategorizedBatchCategorizing(false));
    }
  };
};
