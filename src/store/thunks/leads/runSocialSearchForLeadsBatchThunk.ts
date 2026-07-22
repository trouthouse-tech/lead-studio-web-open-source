import { LeadBuilderActions } from '@/store/builders';
import type { Lead } from '@/model';
import {
  getFilteredSortedLeadsForList,
  getLeadIdsWithAtLeastOneContactSet,
  getPrimaryWebsiteForLead,
} from '@/utils/leads';
import type { AppThunk } from '../../store';
import {
  runLeadSocialProfilesResearchThunk,
  type LeadSocialSearchPlatform,
} from './runLeadSocialProfilesResearchThunk';

export type RunSocialSearchForLeadsBatchResult =
  | { ok: true; ran: number; succeeded: number; failed: number }
  | { ok: false; status: 400 | 500; message?: string };

type ResponseType = Promise<RunSocialSearchForLeadsBatchResult>;

export type SocialSearchBatchPlatform = LeadSocialSearchPlatform;

/**
 * Lead needs a successful list Facebook Google search (failed runs are retryable).
 */
export const leadNeedsFacebookSearchFromList = (lead: Lead): boolean => {
  if (!getPrimaryWebsiteForLead(lead)) return false;
  return lead.facebook_google_search_attempted !== true;
};

/**
 * Lead needs Instagram URL discovery.
 */
export const leadNeedsInstagramSearchFromList = (lead: Lead): boolean => {
  if (!getPrimaryWebsiteForLead(lead)) return false;
  return !lead.instagram_url?.trim();
};

/**
 * Eligible when the lead still needs Facebook and/or Instagram from the list.
 */
export const leadNeedsSocialSearchFromList = (lead: Lead): boolean =>
  leadNeedsFacebookSearchFromList(lead) || leadNeedsInstagramSearchFromList(lead);

const eligibilityForPlatform = (
  platform: SocialSearchBatchPlatform
): ((lead: Lead) => boolean) =>
  platform === 'facebook'
    ? leadNeedsFacebookSearchFromList
    : leadNeedsInstagramSearchFromList;

/**
 * Sequentially runs Facebook and/or Instagram search for eligible leads in the filtered list.
 */
export const runSocialSearchForLeadsBatchThunk = (
  platform: SocialSearchBatchPlatform
): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    const state = getState();
    if (state.leadBuilder.isLeadsListSocialSearchBatchBusy) {
      return { ok: false, status: 400, message: 'Social search batch already running' };
    }
    if (
      state.leadBuilder.researchRunPhase !== 'idle' ||
      state.leadBuilder.isLeadsListFullResearchBatchBusy
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

    const isEligible = eligibilityForPlatform(platform);
    const targets = sortedLeads.filter(isEligible);

    if (targets.length === 0) {
      return {
        ok: false,
        status: 400,
        message:
          platform === 'facebook'
            ? 'No leads need Facebook search in this view'
            : 'No leads need Instagram search in this view',
      };
    }

    dispatch(LeadBuilderActions.setLeadsListSocialSearchBatchBusy(true));

    let succeeded = 0;
    let failed = 0;

    try {
      for (const lead of targets) {
        dispatch(
          LeadBuilderActions.setLeadsTableRowSocialBusy({ leadId: lead.id, busy: true })
        );
        dispatch(LeadBuilderActions.setResearchRunPhase('social'));
        try {
          const status = await dispatch(
            runLeadSocialProfilesResearchThunk(lead.id, {
              facebookRequestSource: 'leads_table',
              platforms: [platform],
            })
          );
          if (status === 200) {
            succeeded += 1;
          } else {
            failed += 1;
          }
        } catch {
          failed += 1;
        } finally {
          dispatch(
            LeadBuilderActions.setLeadsTableRowSocialBusy({ leadId: lead.id, busy: false })
          );
          dispatch(LeadBuilderActions.setResearchRunPhase('idle'));
        }
      }

      return {
        ok: true,
        ran: targets.length,
        succeeded,
        failed,
      };
    } finally {
      dispatch(LeadBuilderActions.setLeadsListSocialSearchBatchBusy(false));
      dispatch(LeadBuilderActions.setResearchRunPhase('idle'));
    }
  };
};
