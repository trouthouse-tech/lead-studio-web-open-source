import type { AppThunk } from '../../store';
import { getLeadById } from '@/api/leads';
import { CurrentLeadActions } from '../../current';
import { LeadsActions } from '../../dumps/leads';
import { loadLeadWebsiteScrapeLatestSummaryThunk } from './loadLeadWebsiteScrapeLatestSummaryThunk';
import { mapApiFailureToThunkStatus } from '@/api/_shared';

type RefreshLeadRecordOptions = {
  /** When the open detail lead is this id, refresh latest scrape panel data (e.g. after website research). */
  reloadWebsiteScrapeSummaryIfViewing?: boolean;
};

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Fetches a lead and updates the leads dump. Updates `currentLead` only when it already
 * matches this id (so list quick-actions do not hijack another open lead).
 */
export const refreshLeadRecordThunk = (
  leadId: string,
  options?: RefreshLeadRecordOptions
): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    const res = await getLeadById(leadId);
    if (!res.success || !res.data) {
      return mapApiFailureToThunkStatus(res);
    }
    dispatch(LeadsActions.updateLead(res.data));
    if (getState().currentLead?.id === leadId) {
      dispatch(CurrentLeadActions.setCurrentLead(res.data));
      if (options?.reloadWebsiteScrapeSummaryIfViewing) {
        void dispatch(loadLeadWebsiteScrapeLatestSummaryThunk());
      }
    }
    return 200;
  };
};
