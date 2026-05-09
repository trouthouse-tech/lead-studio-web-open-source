'use client';

import type { Lead } from '@/model';
import { leadsTableRowColumnStyles as styles } from '../styles';
import { getLeadStatusLabel } from '../lead-status-label';

type LeadsTableRowStatusColumnProps = {
  lead: Lead;
};

export const LeadsTableRowStatusColumn = (props: LeadsTableRowStatusColumnProps) => {
  const { lead } = props;
  return (
    <td className={styles.tableCellCenter}>
      <span className={styles.statusValue}>{getLeadStatusLabel(lead.status)}</span>
    </td>
  );
};
