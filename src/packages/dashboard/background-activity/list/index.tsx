'use client';

import type { RecentLeadRow } from '../../build-dashboard-lead-rows';
import { RecentLeadsListRow } from './row';

type RecentLeadsListProps = {
  rows: RecentLeadRow[];
};

export const RecentLeadsList = (props: RecentLeadsListProps) => {
  const { rows } = props;

  return (
    <div className={styles.list}>
      {rows.map((row) => (
        <RecentLeadsListRow key={row.leadId} row={row} />
      ))}
    </div>
  );
};

const styles = {
  list: `
    grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3
  `,
};
