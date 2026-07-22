import { LeadBuilderActions } from '@/store/builders';
import {
  getFilteredSortedLeadsForList,
  getLeadIdsWithAtLeastOneContactSet,
  getPrimaryWebsiteForLead,
} from '@/utils/leads';
import type { AppThunk } from '../../store';
import { runLeadOnlineProfilesResearchThunk } from './runLeadOnlineProfilesResearchThunk';

export type RunFullResearchForUnresearchedLeadsBatchResult =
  | { ok: true; ran: number; succeeded: number; failed: number }
  | { ok: false; status: 400 | 500; message?: string };

type ResponseType = Promise<RunFullResearchForUnresearchedLeadsBatchResult>;

/**
 * Sequentially runs full research (site pages → crawl → at-a-glance) for each lead in the
 * current filtered leads list that has a website and has never had website research attempted.
 * Skips leads with `website_research_attempted` so this list-page action only runs once per lead.
 */
export const runFullResearchForUnresearchedLeadsBatchThunk =
  (): AppThunk<ResponseType> => {
    return async (dispatch, getState): ResponseType => {
      const state = getState();
      if (state.leadBuilder.isLeadsListFullResearchBatchBusy) {
        return { ok: false, status: 400, message: 'Research batch already running' };
      }
      if (
        state.leadBuilder.researchRunPhase !== 'idle' ||
        state.leadBuilder.isLeadsListSocialSearchBatchBusy
      ) {
        return { ok: false, status: 400, message: 'Research already in progress' };
      }

      const leadsList = Object.values(state.leads);
      const leadIdsWithAtLeastOneContact = getLeadIdsWithAtLeastOneContactSet(
        state.leadContacts
      );
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

      const sortedLeads = getFilteredSortedLeadsForList({
        leads: leadsList,
        leadCategories: state.leadCategories,
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

      const targets = sortedLeads.filter(
        (lead) =>
          !!getPrimaryWebsiteForLead(lead) && lead.website_research_attempted !== true
      );

      if (targets.length === 0) {
        return {
          ok: false,
          status: 400,
          message: 'No unresearched leads with a website in this view',
        };
      }

      dispatch(LeadBuilderActions.setLeadsListFullResearchBatchBusy(true));

      let succeeded = 0;
      let failed = 0;

      try {
        for (const lead of targets) {
          dispatch(
            LeadBuilderActions.setLeadsTableRowSummaryBusy({
              leadId: lead.id,
              busy: true,
            })
          );
          try {
            const status = await dispatch(runLeadOnlineProfilesResearchThunk(lead.id));
            if (status === 200) {
              succeeded += 1;
            } else {
              failed += 1;
            }
          } catch {
            failed += 1;
          } finally {
            dispatch(
              LeadBuilderActions.setLeadsTableRowSummaryBusy({
                leadId: lead.id,
                busy: false,
              })
            );
          }
        }

        return {
          ok: true,
          ran: targets.length,
          succeeded,
          failed,
        };
      } finally {
        dispatch(LeadBuilderActions.setLeadsListFullResearchBatchBusy(false));
      }
    };
  };
