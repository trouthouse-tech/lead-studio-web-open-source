'use client';

import type { Lead } from '@/model';
import { LeadsTableRowResearchButtons } from '../../buttons';
import { leadsTableResearchStyles as researchStyles } from '../../buttons/research-styles';

type LeadsTableRowResearchColumnProps = {
  lead: Lead;
};

export const LeadsTableRowResearchColumn = (
  props: LeadsTableRowResearchColumnProps
) => {
  const { lead } = props;
  return (
    <td
      className={researchStyles.researchCell}
      onClick={(e) => e.stopPropagation()}
    >
      <LeadsTableRowResearchButtons lead={lead} />
    </td>
  );
};
