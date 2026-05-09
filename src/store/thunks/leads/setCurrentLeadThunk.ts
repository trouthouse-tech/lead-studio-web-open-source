import type { AppThunk } from '../../store';
import { CurrentLeadActions } from '../../current';
import { createEmptyLead } from '../../current/create-empty-lead';
import { LeadBuilderActions } from '../../builders';
import { logLeadActivityThunk } from '../lead-activities';
import { loadLeadWebsiteScrapeLatestSummaryThunk } from './loadLeadWebsiteScrapeLatestSummaryThunk';

type ResponseType = Promise<200>;

/**
 * Sets the current lead in Redux from the leads dump by id.
 * Call when a lead is selected (e.g. from the leads list or when opening the detail page by URL).
 * Also resets lead detail UI state and loads website scrape summary for the lead.
 */
export const setCurrentLeadThunk = (leadId: string): AppThunk<ResponseType> => {
  return (dispatch, getState): ResponseType => {
    const lead = getState().leads[leadId] ?? createEmptyLead();
    dispatch(CurrentLeadActions.setCurrentLead(lead));
    dispatch(LeadBuilderActions.setIsEditing(false));
    dispatch(LeadBuilderActions.setResearchRunPhase('idle'));
    dispatch(LeadBuilderActions.setWebsiteScrapeLatestSummary(null));
    dispatch(LeadBuilderActions.setWebsiteScrapeLatestLoading(false));
    dispatch(LeadBuilderActions.setWebsiteResearchConfirmModalOpen(false));
    if (lead.id) {
      void dispatch(
        logLeadActivityThunk({
          leadId: lead.id,
          customerName: lead.business_name || 'Unknown customer',
        })
      );
      void dispatch(loadLeadWebsiteScrapeLatestSummaryThunk());
    }
    return Promise.resolve(200);
  };
};
