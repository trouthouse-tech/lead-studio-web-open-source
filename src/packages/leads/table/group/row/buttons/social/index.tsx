'use client';

import { Loader2, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { LeadBuilderActions } from '@/store/builders';
import {
  leadNeedsSocialSearchFromList,
  runLeadSocialProfilesResearchThunk,
} from '@/store/thunks/leads';
import type { Lead } from '@/model';
import { getLeadResearchIndicators, getPrimaryWebsiteForLead } from '@/utils/leads';
import { leadsTableResearchStyles as rs } from '../research-styles';

type Props = {
  lead: Lead;
};

/**
 * Leads table: one-shot Facebook + Instagram social search (Google; Facebook Apify for email/phone).
 */
export const LeadsTableRowResearchSocial = (props: Props) => {
  const { lead } = props;
  const dispatch = useAppDispatch();
  const leadBuilder = useAppSelector((s) => s.leadBuilder);
  const researchRunPhase = leadBuilder.researchRunPhase;
  const batchBusy =
    leadBuilder.isLeadsListSocialSearchBatchBusy ||
    leadBuilder.isLeadsListFullResearchBatchBusy;
  const busy = leadBuilder.leadsTableRowSocialBusyByLeadId[lead.id] === true;
  const researchIndicators = getLeadResearchIndicators(lead);
  const hasInstagram = researchIndicators.instagram;
  const hasSocialSignal = researchIndicators.facebook || hasInstagram;
  const canRun = !!getPrimaryWebsiteForLead(lead) && leadNeedsSocialSearchFromList(lead);
  const researchGloballyBusy = researchRunPhase !== 'idle' || batchBusy;

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canRun || researchGloballyBusy) return;

    const ok = window.confirm(
      'Search Facebook and Instagram for this lead? Facebook also scrapes the page for email/phone when found. This runs once from the list.'
    );
    if (!ok) return;

    dispatch(LeadBuilderActions.setLeadsTableRowSocialBusy({ leadId: lead.id, busy: true }));
    dispatch(LeadBuilderActions.setResearchRunPhase('social'));
    try {
      const status = await dispatch(
        runLeadSocialProfilesResearchThunk(lead.id, {
          facebookRequestSource: 'leads_table',
        })
      );
      if (status !== 200) {
        toast.error('Social search failed');
        return;
      }
      toast.success('Social search finished');
    } finally {
      dispatch(
        LeadBuilderActions.setLeadsTableRowSocialBusy({ leadId: lead.id, busy: false })
      );
      dispatch(LeadBuilderActions.setResearchRunPhase('idle'));
    }
  };

  return (
    <span className={rs.researchButtonWrap}>
      <button
        type="button"
        className={rs.researchIconButton}
        disabled={!canRun || researchGloballyBusy}
        title={
          !getPrimaryWebsiteForLead(lead)
            ? 'Set a website on the lead first'
            : !canRun
              ? 'Facebook/Instagram already searched for this lead'
              : hasSocialSignal
                ? 'Search Facebook + Instagram · Profile links on lead'
                : 'Search Facebook + Instagram (once from list)'
        }
        aria-label="Search Facebook and Instagram for this lead"
        onClick={handleClick}
      >
        {busy ? (
          <Loader2 className={`${rs.researchIcon} animate-spin`} aria-hidden />
        ) : (
          <Share2 className={rs.researchIcon} aria-hidden />
        )}
      </button>
      {hasSocialSignal && !busy ? (
        <span
          className={rs.researchDataDot}
          title={
            [
              researchIndicators.facebook ? 'Facebook URL' : null,
              hasInstagram ? 'Instagram URL' : null,
            ]
              .filter(Boolean)
              .join(' · ') || 'Social profiles on lead'
          }
          aria-hidden
        />
      ) : null}
    </span>
  );
};
