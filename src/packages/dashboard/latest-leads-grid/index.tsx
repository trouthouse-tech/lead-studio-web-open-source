'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LEAD_DETAIL_PATH } from '@/config';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectDashboardLatestLeadRows } from '@/store/selectors';
import { setCurrentLeadThunk } from '@/store/thunks/leads';
import { getLeadStatusLabel } from '@/packages/leads/table/group/row/columns/lead-status-label';
import { formatDateMedium } from '@/utils/date-time';

const truncate = (text: string, maxLen: number) => {
  const t = text.trim();
  if (t.length <= maxLen) return t;
  return `${t.slice(0, maxLen - 1)}…`;
};

/**
 * Home dashboard: up to six leads in a compact table.
 */
export const DashboardLatestLeadsGrid = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const rows = useAppSelector(selectDashboardLatestLeadRows);

  const handleOpenLead = (leadId: string) => {
    dispatch(setCurrentLeadThunk(leadId));
    router.push(LEAD_DETAIL_PATH);
  };

  return (
    <section className={styles.panel} aria-labelledby="dashboard-latest-leads-heading">
      <div className={styles.panelHeader}>
        <div>
          <h2 id="dashboard-latest-leads-heading" className={styles.heading}>
            Latest leads
          </h2>
          <p className={styles.subheading}>Most recently updated in your workspace.</p>
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
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Lead</th>
                <th className={styles.thSummary}>Summary</th>
                <th className={styles.th}>Contact</th>
                <th className={styles.th}>Status</th>
                <th className={styles.thDate}>Updated</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.leadId} className={styles.tr}>
                  <td className={styles.td}>
                    <button
                      type="button"
                      className={styles.leadLink}
                      onClick={() => handleOpenLead(row.leadId)}
                    >
                      {row.leadName}
                    </button>
                  </td>
                  <td className={styles.tdSummary}>
                    {truncate(row.leadSummary, 100)}
                  </td>
                  <td className={styles.td}>
                    {row.topContactName ? (
                      <span className={styles.contactWrap}>
                        <span className={styles.contactName}>{row.topContactName}</span>
                        {row.topContactEmail ? (
                          <span className={styles.contactEmail}>{row.topContactEmail}</span>
                        ) : null}
                      </span>
                    ) : (
                      <span className={styles.dash}>—</span>
                    )}
                  </td>
                  <td className={styles.td}>
                    {getLeadStatusLabel(row.status)}
                  </td>
                  <td className={styles.tdDate}>
                    {formatDateMedium(row.lastActivityAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

const styles = {
  panel: `
    flex flex-col min-h-0 min-w-0 w-full
  `,
  panelHeader: `
    flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4
    shrink-0 pb-3
  `,
  heading: `
    text-sm font-semibold text-slate-900
  `,
  subheading: `
    text-xs text-slate-500 mt-0.5
  `,
  viewAll: `
    text-xs font-medium text-orange-600 hover:text-orange-700 hover:underline shrink-0
  `,
  emptyState: `
    flex flex-col items-center justify-center py-12 px-4 mt-3
  `,
  emptyText: `
    text-sm font-medium text-slate-700
  `,
  emptyHint: `
    text-xs text-slate-500 mt-1 text-center
  `,
  tableScroll: `
    mt-3 min-h-0 flex-1 overflow-x-auto overflow-y-auto max-h-[min(70vh,560px)]
  `,
  table: `
    w-full min-w-[640px] border-collapse text-left text-xs
  `,
  th: `
    sticky top-0 z-[1] bg-slate-50 px-2 py-2 font-semibold text-slate-600 border-b border-slate-200 whitespace-nowrap
  `,
  thSummary: `
    sticky top-0 z-[1] bg-slate-50 px-2 py-2 font-semibold text-slate-600 border-b border-slate-200 min-w-[12rem]
  `,
  thDate: `
    sticky top-0 z-[1] bg-slate-50 px-2 py-2 font-semibold text-slate-600 border-b border-slate-200 whitespace-nowrap w-[7.5rem]
  `,
  tr: `
    border-b border-slate-100 last:border-b-0 hover:bg-slate-50/80
  `,
  td: `
    px-2 py-2 align-middle text-slate-800 max-w-[12rem]
  `,
  tdSummary: `
    px-2 py-2 align-middle text-slate-600 max-w-[18rem]
  `,
  tdDate: `
    px-2 py-2 align-middle text-slate-500 whitespace-nowrap tabular-nums
  `,
  leadLink: `
    text-left font-medium text-orange-600 hover:text-orange-700 hover:underline
    border-0 bg-transparent p-0 cursor-pointer truncate max-w-[12rem] block
  `,
  contactWrap: `
    flex min-w-0 flex-col gap-0.5
  `,
  contactName: `
    truncate font-medium text-slate-800
  `,
  contactEmail: `
    truncate text-slate-500
  `,
  dash: `
    text-slate-300
  `,
};
