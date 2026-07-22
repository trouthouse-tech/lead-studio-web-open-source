import { LeadBuilderActions } from '@/store/builders';
import { getLeadContactsByLeadIdThunk } from '@/store/thunks/lead-contacts';
import type { AppThunk } from '../../store';
import { refreshLeadRecordThunk } from './refreshLeadRecordThunk';
import { runLeadPlaywrightWebsiteUrlDiscoveryThunk } from './runLeadPlaywrightWebsiteUrlDiscoveryThunk';
import { runLeadSocialProfilesResearchThunk } from './runLeadSocialProfilesResearchThunk';
import { runLeadWebsiteResearchThunk } from './runLeadWebsiteResearchThunk';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Full lead research: Playwright site-pages (+ nav/footer social icons), website crawl +
 * AI at-a-glance, then Facebook (Google + Apify email/phone) and Instagram URL search.
 * Pass `targetLeadId` from list rows; otherwise uses `currentLead.id`.
 */
export const runLeadOnlineProfilesResearchThunk = (
  targetLeadId?: string
): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    const leadId = targetLeadId ?? getState().currentLead?.id;
    if (!leadId) {
      return 400;
    }

    try {
      // Always (re)run discovery so caps/scoring upgrades can expand prior results.
      // Also harvests Facebook/Instagram profile links from nav/footer when empty.
      dispatch(LeadBuilderActions.setResearchRunPhase('site_pages'));
      const discovery = await dispatch(runLeadPlaywrightWebsiteUrlDiscoveryThunk(leadId));
      if (!discovery.ok) {
        return discovery.status;
      }

      const refreshAfterDiscovery = await dispatch(
        refreshLeadRecordThunk(leadId, { reloadWebsiteScrapeSummaryIfViewing: true })
      );
      if (refreshAfterDiscovery !== 200) {
        return refreshAfterDiscovery;
      }

      dispatch(LeadBuilderActions.setResearchRunPhase('website'));
      const websiteStatus = await dispatch(runLeadWebsiteResearchThunk(leadId));
      if (websiteStatus !== 200) {
        return websiteStatus;
      }

      const refreshStatus = await dispatch(
        refreshLeadRecordThunk(leadId, { reloadWebsiteScrapeSummaryIfViewing: true })
      );
      if (refreshStatus !== 200) {
        return refreshStatus;
      }

      dispatch(LeadBuilderActions.setResearchRunPhase('social'));
      const socialStatus = await dispatch(
        runLeadSocialProfilesResearchThunk(leadId, {
          facebookRequestSource: 'lead_detail',
        })
      );
      if (socialStatus !== 200) {
        return socialStatus;
      }

      await dispatch(getLeadContactsByLeadIdThunk(leadId));

      return 200;
    } finally {
      dispatch(LeadBuilderActions.setResearchRunPhase('idle'));
    }
  };
};
