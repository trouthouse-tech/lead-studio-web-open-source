'use client';

import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';
import { selectDashboardLatestLeadRows } from '@/store/selectors';
import { RecentLeadsListRow } from '../background-activity/list/row';

/**
 * Home dashboard: up to six leads in a 3×2 grid (three columns from `md` up).
 */
export const DashboardLatestLeadsGrid = () => {
  const rows = useAppSelector(selectDashboardLatestLeadRows);

  return (
    <section className={styles.section} aria-labelledby="dashboard-latest-leads-heading">
      <div className={styles.sectionHeader}>
        <div>
          <h2 id="dashboard-latest-leads-heading" className={styles.sectionTitle}>
            Latest leads
          </h2>
          <p className={styles.sectionSub}>Most recently updated in your workspace.</p>
        </div>
        <Link href="/leads" className={styles.viewAll}>
          View all leads
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>No leads yet.</p>
          <p className={styles.emptyHint}>Add leads from Find leads or your pipeline.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {rows.map((row) => (
            <RecentLeadsListRow key={row.leadId} row={row} />
          ))}
        </div>
      )}
    </section>
  );
};

const styles = {
  section: `
    min-w-0
  `,
  sectionHeader: `
    flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4 mb-4
  `,
  sectionTitle: `
    text-sm font-semibold text-slate-900
  `,
  sectionSub: `
    text-xs text-slate-500 mt-0.5
  `,
  viewAll: `
    text-xs font-medium text-orange-600 hover:text-orange-700 hover:underline shrink-0
  `,
  emptyState: `
    flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/80 py-12 px-4
  `,
  emptyText: `
    text-sm font-medium text-slate-700
  `,
  emptyHint: `
    text-xs text-slate-500 mt-1 text-center
  `,
  grid: `
    grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr
  `,
};
