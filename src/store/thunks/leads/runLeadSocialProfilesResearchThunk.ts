import type { FacebookGoogleSearchRequestSource } from '@/api/leads';
import { getLeadContactsByLeadIdThunk } from '@/store/thunks/lead-contacts';
import type { AppThunk } from '../../store';
import { refreshLeadRecordThunk } from './refreshLeadRecordThunk';
import { runLeadFacebookPageResearchThunk } from './runLeadFacebookPageResearchThunk';
import { runLeadGoogleSearchResearchThunk } from './runLeadGoogleSearchResearchThunk';

type ResponseType = Promise<200 | 400 | 500>;

export type LeadSocialSearchPlatform = 'facebook' | 'instagram';

export type RunLeadSocialProfilesResearchOptions = {
  /**
   * Facebook Google search source. `leads_table` = one-shot from list/bulk.
   * Default `lead_detail` (repeatable; Apify runs when a profile URL exists).
   */
  facebookRequestSource?: FacebookGoogleSearchRequestSource;
  /**
   * Which platforms to run. Default both. Use `['facebook']` or `['instagram']` for mass actions.
   */
  platforms?: LeadSocialSearchPlatform[];
};

/**
 * Facebook Google SERP (+ Apify page scrape for email/phone) and/or Instagram URL search.
 * Site-icon URLs on the lead are preferred; Google fills gaps; Apify scrapes Facebook contacts.
 */
export const runLeadSocialProfilesResearchThunk = (
  targetLeadId?: string,
  options?: RunLeadSocialProfilesResearchOptions
): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    const leadId = targetLeadId ?? getState().currentLead?.id;
    if (!leadId) {
      return 400;
    }

    const platforms = options?.platforms ?? ['facebook', 'instagram'];
    const runFacebook = platforms.includes('facebook');
    const runInstagram = platforms.includes('instagram');

    const facebookRequestSource = options?.facebookRequestSource ?? 'lead_detail';
    const leadBefore = getState().leads[leadId];
    // List one-shot: skip Google only after a successful list attempt that already stored a URL.
    // Failed runs (e.g. missing APIFY token) must retry; detail always re-runs.
    const skipFacebookGoogle =
      facebookRequestSource === 'leads_table' &&
      leadBefore?.facebook_google_search_attempted === true &&
      Boolean(leadBefore?.facebook_url?.trim());

    if (runFacebook) {
      if (!skipFacebookGoogle) {
        const facebookResult = await dispatch(
          runLeadGoogleSearchResearchThunk('facebook', leadId, {
            facebookRequestSource,
          })
        );
        await dispatch(
          refreshLeadRecordThunk(leadId, { reloadWebsiteScrapeSummaryIfViewing: true })
        );

        // Google failed but site icons may already have facebook_url — still scrape for email/phone.
        const leadMid = getState().leads[leadId];
        if (!facebookResult.ok && leadMid?.facebook_url?.trim()) {
          await dispatch(runLeadFacebookPageResearchThunk(leadId));
          await dispatch(
            refreshLeadRecordThunk(leadId, { reloadWebsiteScrapeSummaryIfViewing: true })
          );
        }
      } else if (leadBefore?.facebook_url?.trim()) {
        // List one-shot already used: scrape page for email/phone when URL exists.
        await dispatch(runLeadFacebookPageResearchThunk(leadId));
        await dispatch(
          refreshLeadRecordThunk(leadId, { reloadWebsiteScrapeSummaryIfViewing: true })
        );
      }
    }

    if (runInstagram) {
      const leadAfterFacebook = getState().leads[leadId];
      if (!leadAfterFacebook?.instagram_url?.trim()) {
        await dispatch(runLeadGoogleSearchResearchThunk('instagram', leadId));
        await dispatch(
          refreshLeadRecordThunk(leadId, { reloadWebsiteScrapeSummaryIfViewing: true })
        );
      }
    }

    await dispatch(getLeadContactsByLeadIdThunk(leadId));
    return 200;
  };
};
