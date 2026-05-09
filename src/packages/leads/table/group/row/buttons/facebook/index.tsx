'use client';

import { ExternalLink, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { LeadBuilderActions } from '@/store/builders';
import {
  refreshLeadRecordThunk,
  runLeadGoogleSearchResearchThunk,
} from '@/store/thunks/leads';
import { getLeadContactsByLeadIdThunk } from '@/store/thunks/lead-contacts';
import type { Lead } from '@/model';
import {
  FACEBOOK_GOOGLE_SEARCH_RUN_DISABLED_TITLE,
  getLeadResearchIndicators,
} from '@/utils/leads';
import { leadsTableResearchStyles as rs } from '../research-styles';

type Props = {
  lead: Lead;
};

export const LeadsTableRowResearchFacebook = (props: Props) => {
  const { lead } = props;
  const dispatch = useAppDispatch();
  const researchBusyKind = useAppSelector(
    (s) => s.leadBuilder.leadsTableRowResearchBusyByLeadId[lead.id]
  );
  const researchIndicators = getLeadResearchIndicators(lead);
  const facebookGoogleSearchAlreadyUsed =
    lead.facebook_google_search_attempted === true;
  const researchBusy = researchBusyKind !== undefined;

  const handleOpenFacebookProfile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const facebookUrl = lead.facebook_url?.trim();
    if (!facebookUrl) return;
    const url = facebookUrl.startsWith('http')
      ? facebookUrl
      : `https://${facebookUrl}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleFacebookResearch = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (facebookGoogleSearchAlreadyUsed || researchBusy) return;
    dispatch(
      LeadBuilderActions.setLeadsTableRowResearchBusy({
        leadId: lead.id,
        kind: 'facebook',
      })
    );
    try {
      const result = await dispatch(
        runLeadGoogleSearchResearchThunk('facebook', lead.id, {
          facebookRequestSource: 'leads_table',
        })
      );
      if (!result.ok) {
        if (result.error === 'website_required') {
          toast.error(
            result.message ??
              'Add a website on this lead before searching for profile links.'
          );
        } else if (
          result.error === 'facebook_search_already_attempted' ||
          result.error === 'facebook_search_already_completed'
        ) {
          toast.error(
            result.message ??
              'Facebook search from the list can only be run once per lead. Open the lead to search again from Online profiles.'
          );
        } else {
          toast.error(result.message ?? 'Facebook search failed');
        }
        return;
      }

      const refreshStatus = await dispatch(refreshLeadRecordThunk(lead.id));
      if (refreshStatus !== 200) {
        toast.error('Search finished but refreshing the lead failed');
        return;
      }

      if (result.facebookApifySkipped === 'lead_has_complete_contact') {
        toast.info(
          'Facebook page scrape skipped — a contact already has both email and phone.'
        );
      } else if (result.facebookApifySkipped === 'lead_has_contacts') {
        toast.info(
          'Facebook page scrape skipped — this lead already has contacts. Run website research first to capture email/phone from the site.'
        );
      } else if (result.facebookApifyError) {
        toast.warning(
          `Google search finished; Facebook page scrape failed: ${result.facebookApifyError}`
        );
      } else {
        if (result.facebookContactCreated || result.facebookContactMerged) {
          await dispatch(getLeadContactsByLeadIdThunk(lead.id));
        }
        if (result.leadUpdated) {
          toast.success(
            result.facebookContactCreated
              ? 'Facebook URL updated and contact saved from Facebook page'
              : result.facebookContactMerged
                ? 'Facebook URL updated — merged email/phone onto existing contact'
                : 'Profile link updated from Google'
          );
        } else {
          toast.success(
            result.facebookContactCreated
              ? 'Contact saved from Facebook page'
              : result.facebookContactMerged
                ? 'Updated an existing contact with Facebook details'
                : 'Search finished — no matching Facebook URL found'
          );
        }
      }
    } finally {
      dispatch(
        LeadBuilderActions.setLeadsTableRowResearchBusy({
          leadId: lead.id,
          kind: null,
        })
      );
    }
  };

  const isFacebookSpinning = researchBusyKind === 'facebook';

  return (
    <span className={rs.researchButtonWrap}>
      <button
        type="button"
        className={rs.researchIconButton}
        disabled={facebookGoogleSearchAlreadyUsed || researchBusy}
        title={
          facebookGoogleSearchAlreadyUsed
            ? FACEBOOK_GOOGLE_SEARCH_RUN_DISABLED_TITLE
            : researchIndicators.facebook
              ? 'Google search for Facebook page, then scrape when applicable · Facebook URL on lead'
              : 'Google search for Facebook page, then scrape when applicable'
        }
        aria-label="Facebook search and scrape"
        onClick={handleFacebookResearch}
      >
        {isFacebookSpinning ? (
          <Loader2 className={`${rs.researchIcon} animate-spin`} aria-hidden />
        ) : (
          <span className={rs.facebookGlyph} aria-hidden>
            f
          </span>
        )}
      </button>
      {researchIndicators.facebook &&
      !!lead.facebook_url?.trim() &&
      !isFacebookSpinning ? (
        <button
          type="button"
          onClick={handleOpenFacebookProfile}
          className={rs.researchHoverAction}
          title="Open Facebook in new tab"
          aria-label="Open Facebook in new tab"
        >
          <ExternalLink className={rs.researchHoverActionIcon} aria-hidden />
        </button>
      ) : null}
    </span>
  );
};
