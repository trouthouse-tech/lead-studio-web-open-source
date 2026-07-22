'use client';

import { Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { LeadBuilderActions } from '@/store/builders';
import { runLeadOnlineProfilesResearchThunk } from '@/store/thunks/leads';
import type { Lead } from '@/model';
import { getLeadResearchIndicators, getPrimaryWebsiteForLead } from '@/utils/leads';
import { leadsTableResearchStyles as rs } from '../research-styles';

type Props = {
  lead: Lead;
};

/**
 * Leads table: single full-research action (site pages → crawl → at-a-glance).
 */
export const LeadsTableRowResearchFull = (props: Props) => {
  const { lead } = props;
  const dispatch = useAppDispatch();
  const leadBuilder = useAppSelector((s) => s.leadBuilder);
  const researchRunPhase = leadBuilder.researchRunPhase;
  const batchBusy =
    leadBuilder.isLeadsListFullResearchBatchBusy ||
    leadBuilder.isLeadsListSocialSearchBatchBusy;
  const busy = leadBuilder.leadsTableRowSummaryBusyByLeadId[lead.id] === true;
  const researchIndicators = getLeadResearchIndicators(lead);
  const hasResearchSignal =
    researchIndicators.atAGlance || researchIndicators.websiteSummaryRecord;
  const canRun = !!getPrimaryWebsiteForLead(lead);
  const researchGloballyBusy = researchRunPhase !== 'idle' || batchBusy;

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canRun || researchGloballyBusy) return;

    const ok = window.confirm(
      'Run full research? Discovers site pages (incl. social icons), crawls the website, fills at-a-glance, then searches Facebook (scrapes email/phone) and Instagram. This can take a few minutes.'
    );
    if (!ok) return;

    dispatch(
      LeadBuilderActions.setLeadsTableRowSummaryBusy({ leadId: lead.id, busy: true })
    );
    try {
      const status = await dispatch(runLeadOnlineProfilesResearchThunk(lead.id));
      if (status !== 200) {
        toast.error('Research failed');
        return;
      }
      toast.success('Research finished');
    } finally {
      dispatch(
        LeadBuilderActions.setLeadsTableRowSummaryBusy({ leadId: lead.id, busy: false })
      );
    }
  };

  return (
    <span className={rs.researchButtonWrap}>
      <button
        type="button"
        className={rs.researchIconButton}
        disabled={!canRun || researchGloballyBusy}
        title={
          !canRun
            ? 'Set a website on the lead first'
            : hasResearchSignal
              ? 'Full research (site pages + crawl + at a glance) · Data on lead'
              : 'Full research (site pages + crawl + at a glance)'
        }
        aria-label="Run full research for this lead"
        onClick={handleClick}
      >
        {busy ? (
          <Loader2 className={`${rs.researchIcon} animate-spin`} aria-hidden />
        ) : (
          <Sparkles className={rs.researchIcon} aria-hidden />
        )}
      </button>
      {hasResearchSignal && !busy ? (
        <span
          className={rs.researchDataDot}
          title="Crawl or structured summary on lead"
          aria-hidden
        />
      ) : null}
    </span>
  );
};
