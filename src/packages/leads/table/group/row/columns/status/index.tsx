'use client';

import { useCallback } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { updateLeadThunk } from '@/store/thunks/leads';
import type { Lead } from '@/model';
import { LEAD_STATUSES } from '@/utils/leads/constants';
import { leadsTableRowColumnStyles as styles } from '../styles';

type LeadsTableRowStatusColumnProps = {
  lead: Lead;
};

export const LeadsTableRowStatusColumn = (props: LeadsTableRowStatusColumnProps) => {
  const { lead } = props;
  const dispatch = useAppDispatch();

  const handleStatusChange = useCallback(
    async (e: React.ChangeEvent<HTMLSelectElement>) => {
      const next = e.target.value as Lead['status'];
      if (next === lead.status) return;
      await dispatch(updateLeadThunk(lead.id, { status: next }));
    },
    [dispatch, lead.id, lead.status]
  );

  return (
    <td className={styles.tableCellCenter} onClick={(e) => e.stopPropagation()}>
      <select
        value={lead.status ?? 'not_contacted'}
        onChange={(e) => {
          void handleStatusChange(e);
        }}
        onClick={(e) => e.stopPropagation()}
        className={styles.statusSelect}
        title="Update lead status"
        aria-label="Lead status"
      >
        {LEAD_STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </td>
  );
};
