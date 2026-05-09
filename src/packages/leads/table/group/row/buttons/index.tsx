'use client';

import type { Lead } from '@/model';
import { leadsTableResearchStyles as rs } from './research-styles';
import { LeadsTableRowResearchFacebook } from './facebook';
import { LeadsTableRowResearchDiscoverUrls } from './discover-urls';
import { LeadsTableRowResearchSummarize } from './summarize';

type Props = {
  lead: Lead;
};

/**
 * Leads table research actions (Facebook SERP, Playwright URL discovery, website summarize).
 * Busy flags for the first two live in `leadBuilder.leadsTableRowResearchBusyByLeadId`; summarize uses
 * `leadsTableRowSummaryBusyByLeadId` plus global `researchRunPhase`.
 */
export const LeadsTableRowResearchButtons = (props: Props) => {
  const { lead } = props;

  return (
    <div className={rs.researchButtons}>
      <LeadsTableRowResearchFacebook lead={lead} />
      <LeadsTableRowResearchDiscoverUrls lead={lead} />
      <LeadsTableRowResearchSummarize lead={lead} />
    </div>
  );
};
