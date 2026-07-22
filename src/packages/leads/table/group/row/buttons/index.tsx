'use client';

import type { Lead } from '@/model';
import { leadsTableResearchStyles as rs } from './research-styles';
import { LeadsTableRowResearchFull } from './full-research';
import { LeadsTableRowResearchSocial } from './social';

type Props = {
  lead: Lead;
};

/**
 * Leads table research actions — full website research, then social (FB + IG).
 */
export const LeadsTableRowResearchButtons = (props: Props) => {
  const { lead } = props;

  return (
    <div className={rs.researchButtons}>
      <LeadsTableRowResearchFull lead={lead} />
      <LeadsTableRowResearchSocial lead={lead} />
    </div>
  );
};
