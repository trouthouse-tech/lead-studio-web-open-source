'use client';

import { Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { LeadBuilderActions } from '@/store/builders';
import {
  refreshLeadRecordThunk,
  runLeadWebsiteResearchThunk,
} from '@/store/thunks/leads';
import { getLeadContactsByLeadIdThunk } from '@/store/thunks/lead-contacts';
import type { Lead } from '@/model';
import { getLeadResearchIndicators } from '@/utils/leads';
import { leadsTableResearchStyles as rs } from '../research-styles';

type Props = {
  lead: Lead;
};

export const LeadsTableRowResearchSummarize = (props: Props) => {
  const { lead } = props;
  const dispatch = useAppDispatch();
  const researchRunPhase = useAppSelector((s) => s.leadBuilder.researchRunPhase);
  const summaryBusy = useAppSelector(
    (s) => s.leadBuilder.leadsTableRowSummaryBusyByLeadId[lead.id] === true
  );
  const researchIndicators = getLeadResearchIndicators(lead);
  const hasWebsiteResearchSignal =
    researchIndicators.atAGlance || researchIndicators.websiteSummaryRecord;
  const canRunWebsiteResearch =
    !!lead.website?.trim() ||
    (lead.website_urls ?? []).some(
      (u) => typeof u === 'string' && u.trim().length > 0
    );
  const websiteResearchGloballyBusy = researchRunPhase !== 'idle';

  const handleWebsiteSummaryResearch = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canRunWebsiteResearch || websiteResearchGloballyBusy) return;
    const ok = window.confirm(
      'Run website research? The server will crawl this lead’s site (and extra URLs on the lead), then AI may update the description and structured “at a glance” fields. This can take about a minute.'
    );
    if (!ok) return;

    dispatch(
      LeadBuilderActions.setLeadsTableRowSummaryBusy({ leadId: lead.id, busy: true })
    );
    dispatch(LeadBuilderActions.setResearchRunPhase('website'));
    try {
      const status = await dispatch(runLeadWebsiteResearchThunk(lead.id));
      if (status !== 200) {
        toast.error('Website research failed');
        return;
      }

      const refreshStatus = await dispatch(
        refreshLeadRecordThunk(lead.id, {
          reloadWebsiteScrapeSummaryIfViewing: true,
        })
      );
      if (refreshStatus !== 200) {
        toast.error('Website research finished but refreshing the lead failed');
        return;
      }

      await dispatch(getLeadContactsByLeadIdThunk(lead.id));
      toast.success('Website research finished');
    } finally {
      dispatch(
        LeadBuilderActions.setLeadsTableRowSummaryBusy({ leadId: lead.id, busy: false })
      );
      dispatch(LeadBuilderActions.setResearchRunPhase('idle'));
    }
  };

  return (
    <span className={rs.researchButtonWrap}>
      <button
        type="button"
        className={rs.researchIconButton}
        disabled={!canRunWebsiteResearch || websiteResearchGloballyBusy}
        title={
          !canRunWebsiteResearch
            ? 'Set a website or run site page discovery first'
            : hasWebsiteResearchSignal
              ? 'Website crawl + AI summary (at a glance) · Crawl/summary data on lead'
              : 'Website crawl + AI summary (at a glance)'
        }
        aria-label="Run website research for at a glance summary"
        onClick={handleWebsiteSummaryResearch}
      >
        {summaryBusy ? (
          <Loader2 className={`${rs.researchIcon} animate-spin`} aria-hidden />
        ) : (
          <Sparkles className={rs.researchIcon} aria-hidden />
        )}
      </button>
      {hasWebsiteResearchSignal && !summaryBusy ? (
        <span
          className={rs.researchDataDot}
          title="Crawl or structured summary on lead"
          aria-hidden
        />
      ) : null}
    </span>
  );
};
