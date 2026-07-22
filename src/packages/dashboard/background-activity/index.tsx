'use client';

import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { buildRecentLeadRows } from '../build-dashboard-lead-rows';
import { RecentLeadsList } from './list';

export const DashboardBackgroundActivity = () => {
  const leadActivities = useAppSelector((state) => state.leadActivities);
  const leads = useAppSelector((state) => state.leads);

  const recentLeadRows = useMemo(
    () => buildRecentLeadRows(leadActivities, leads),
    [leadActivities, leads],
  );

  return (
    <div className={styles.stack}>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Recent Leads</h2>
        {recentLeadRows.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>No recent lead activity yet.</p>
          </div>
        ) : (
          <RecentLeadsList rows={recentLeadRows} />
        )}
      </div>
    </div>
  );
};

const styles = {
  stack: `
    space-y-6
  `,
  section: `
    block
  `,
  sectionTitle: `
    mb-3 text-sm font-medium text-slate-500
  `,
  emptyState: `
    flex items-center justify-center rounded-lg border border-slate-200 bg-white py-12
  `,
  emptyText: `
    text-center text-sm text-slate-500
  `,
};
