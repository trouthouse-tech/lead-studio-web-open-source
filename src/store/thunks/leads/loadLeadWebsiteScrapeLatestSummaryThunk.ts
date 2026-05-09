import { getLeadWebsiteScrapeLatest } from '@/api/leads';
import { LeadBuilderActions } from '../../builders';
import type { AppThunk } from '../../store';

type ResponseType = Promise<void>;

/**
 * Loads latest website scrape summary for `currentLead.id` into leadBuilder.
 */
export const loadLeadWebsiteScrapeLatestSummaryThunk = (): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    const leadId = getState().currentLead.id;
    if (!leadId) {
      dispatch(LeadBuilderActions.setWebsiteScrapeLatestSummary(null));
      dispatch(LeadBuilderActions.setWebsiteScrapeLatestLoading(false));
      return;
    }

    dispatch(LeadBuilderActions.setWebsiteScrapeLatestLoading(true));
    const res = await getLeadWebsiteScrapeLatest(leadId);
    dispatch(LeadBuilderActions.setWebsiteScrapeLatestLoading(false));

    if (res.success && res.data) {
      dispatch(LeadBuilderActions.setWebsiteScrapeLatestSummary(res.data));
    } else {
      dispatch(LeadBuilderActions.setWebsiteScrapeLatestSummary(null));
    }
  };
};
