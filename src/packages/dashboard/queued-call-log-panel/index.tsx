'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Phone } from 'lucide-react';
import { LEAD_DETAIL_PATH, TO_CALL_LOG_PATH } from '@/config';
import { store } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getAllLeadContactsThunk } from '@/store/thunks/lead-contacts';
import { getAllLeadsThunk, setCurrentLeadThunk } from '@/store/thunks/leads';
import { formatDateMedium } from '@/utils/date-time';
import { getTelHref } from '@/utils/phone/get-tel-href';

const DASHBOARD_QUEUED_LIMIT = 30;

const truncate = (text: string, maxLen: number) => {
  const t = text.trim();
  if (t.length <= maxLen) return t;
  return `${t.slice(0, maxLen - 1)}…`;
};

/**
 * Call queue for the home dashboard: queued items as a compact table.
 */
export const DashboardQueuedCallLogPanel = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const leads = useAppSelector((state) => state.leads);
  const leadContacts = useAppSelector((state) => state.leadContacts);
  const toCallLogsRecord = useAppSelector((state) => state.toCallLogs);
  const { hasLoadedAll, isFetchingAll } = useAppSelector(
    (state) => state.toCallLogBuilder
  );

  const isInitialCallLogLoading = !hasLoadedAll && isFetchingAll;

  useEffect(() => {
    const { leads: leadsMap, leadContacts: contactsMap } = store.getState();
    const tasks: Array<Promise<200 | 400 | 500>> = [];
    if (Object.keys(leadsMap).length === 0) {
      tasks.push(dispatch(getAllLeadsThunk()));
    }
    if (Object.keys(contactsMap).length === 0) {
      tasks.push(dispatch(getAllLeadContactsThunk()));
    }
    if (tasks.length > 0) {
      void Promise.all(tasks);
    }
  }, [dispatch]);

  const sorted = useMemo(() => {
    const queued = Object.values(toCallLogsRecord).filter(
      (row) => row.call_status === 'queued'
    );
    return [...queued]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, DASHBOARD_QUEUED_LIMIT);
  }, [toCallLogsRecord]);

  const handleOpenLead = (leadId: string) => {
    dispatch(setCurrentLeadThunk(leadId));
    router.push(LEAD_DETAIL_PATH);
  };

  return (
    <aside className={styles.panel} aria-label="Queued calls">
      <div className={styles.panelHeader}>
        <div>
          <h2 className={styles.heading}>Call queue</h2>
          <p className={styles.subheading}>Queued items only</p>
        </div>
        <Link href={TO_CALL_LOG_PATH} className={styles.viewAll}>
          Full log
        </Link>
      </div>

      <div className={styles.tableScroll}>
        {isInitialCallLogLoading ? (
          <p className={styles.muted}>Loading…</p>
        ) : sorted.length === 0 ? (
          <p className={styles.muted}>{`No queued calls. You're caught up.`}</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Contact</th>
                <th className={styles.th}>Lead</th>
                <th className={styles.thPhone}>Call</th>
                <th className={styles.th}>Notes</th>
                <th className={styles.thDate}>Queued</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((item) => {
                const contact = leadContacts[item.lead_contact_id];
                const lead = leads[item.lead_id];
                const phoneTel = getTelHref(contact?.phone);
                const leadLabel = lead?.business_name || lead?.name || 'Lead';
                const contactName = contact?.name || 'Unknown contact';
                return (
                  <tr key={item.id} className={styles.tr}>
                    <td className={styles.td}>{contactName}</td>
                    <td className={styles.td}>
                      <button
                        type="button"
                        className={styles.leadLink}
                        onClick={() => handleOpenLead(item.lead_id)}
                      >
                        {leadLabel}
                      </button>
                    </td>
                    <td className={styles.tdPhone}>
                      {phoneTel && contact?.phone ? (
                        <a
                          href={phoneTel}
                          className={styles.phoneBtn}
                          aria-label={`Call ${contactName}`}
                        >
                          <Phone className={styles.phoneIcon} aria-hidden />
                        </a>
                      ) : (
                        <span className={styles.dash}>—</span>
                      )}
                    </td>
                    <td className={styles.tdNotes}>
                      {item.notes.trim() ? truncate(item.notes, 80) : '—'}
                    </td>
                    <td className={styles.tdDate}>{formatDateMedium(item.created_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </aside>
  );
};

const styles = {
  panel: `
    rounded-xl border border-slate-200 bg-white p-4 shadow-sm
    flex flex-col min-h-0 min-w-0 w-full
  `,
  panelHeader: `
    flex items-start justify-between gap-2 shrink-0 pb-3 border-b border-slate-100
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
  muted: `
    text-xs text-slate-500 py-3 px-1
  `,
  tableScroll: `
    mt-3 min-h-0 flex-1 overflow-x-auto overflow-y-auto max-h-[min(70vh,560px)]
  `,
  table: `
    w-full min-w-[520px] border-collapse text-left text-xs
  `,
  th: `
    sticky top-0 z-[1] bg-slate-50 px-2 py-2 font-semibold text-slate-600 border-b border-slate-200 whitespace-nowrap
  `,
  thPhone: `
    sticky top-0 z-[1] bg-slate-50 px-2 py-2 font-semibold text-slate-600 border-b border-slate-200 text-center w-12
  `,
  thDate: `
    sticky top-0 z-[1] bg-slate-50 px-2 py-2 font-semibold text-slate-600 border-b border-slate-200 whitespace-nowrap w-[7.5rem]
  `,
  tr: `
    border-b border-slate-100 last:border-b-0 hover:bg-slate-50/80
  `,
  td: `
    px-2 py-2 align-middle text-slate-800 max-w-[10rem] truncate
  `,
  tdPhone: `
    px-2 py-2 align-middle text-center w-12
  `,
  tdNotes: `
    px-2 py-2 align-middle text-slate-600 max-w-[14rem]
  `,
  tdDate: `
    px-2 py-2 align-middle text-slate-500 whitespace-nowrap tabular-nums
  `,
  leadLink: `
    text-left font-medium text-orange-600 hover:text-orange-700 hover:underline
    border-0 bg-transparent p-0 cursor-pointer truncate max-w-[12rem] block
  `,
  phoneBtn: `
    inline-flex h-8 w-8 items-center justify-center rounded-md mx-auto
    border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-orange-600
  `,
  phoneIcon: `
    h-3.5 w-3.5
  `,
  dash: `
    text-slate-300
  `,
};
