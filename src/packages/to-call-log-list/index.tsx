'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ToCallLog, ToCallLogStatus } from '@/model/to-call-log';
import { store } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getAllLeadContactsThunk } from '@/store/thunks/lead-contacts';
import { getAllLeadsThunk, setCurrentLeadThunk } from '@/store/thunks/leads';
import { getAllToCallLogThunk } from '@/store/thunks/to-call-log';
import { LEAD_DETAIL_PATH } from '@/config';
import { formatDateTimeWithTime } from '@/utils/date-time';
import { getTelHref } from '@/utils/phone/get-tel-href';
import { ToCallLogItemActions } from './item-actions';

type StatusFilterValue = 'all' | ToCallLogStatus;

const STATUS_FILTER_OPTIONS: { value: StatusFilterValue; label: string }[] = [
  { value: 'queued', label: 'Queued' },
  { value: 'called', label: 'Called' },
  { value: 'voicemail', label: 'Voicemail' },
  { value: 'skipped', label: 'Skipped' },
  { value: 'all', label: 'All' },
];

export const ToCallLogList = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const leads = useAppSelector((state) => state.leads);
  const leadContacts = useAppSelector((state) => state.leadContacts);
  const toCallLogsRecord = useAppSelector((state) => state.toCallLogs);
  const { hasLoadedAll, isFetchingAll } = useAppSelector(
    (state) => state.toCallLogBuilder
  );

  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('queued');
  const [searchQuery, setSearchQuery] = useState('');

  const isInitialCallLogLoading = !hasLoadedAll && isFetchingAll;

  useEffect(() => {
    void dispatch(getAllToCallLogThunk());
  }, [dispatch]);

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

  const handleForceRefresh = useCallback(() => {
    void dispatch(getAllToCallLogThunk({ force: true }));
  }, [dispatch]);

  const toCallLog = useMemo((): ToCallLog[] => {
    return Object.values(toCallLogsRecord);
  }, [toCallLogsRecord]);

  const sortedItems = useMemo(() => {
    const filtered =
      statusFilter === 'all'
        ? toCallLog
        : toCallLog.filter((row) => row.call_status === statusFilter);
    return [...filtered].sort((a, b) => {
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
  }, [toCallLog, statusFilter]);

  const displayItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return sortedItems;
    return sortedItems.filter((item) => {
      const contact = leadContacts[item.lead_contact_id];
      const lead = leads[item.lead_id];
      const haystack = [
        contact?.name,
        contact?.email,
        contact?.phone,
        lead?.business_name,
        lead?.name,
        lead?.description,
        item.notes,
        item.call_notes,
        item.call_status,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [sortedItems, searchQuery, leadContacts, leads]);

  const handleOpenLead = (leadId: string) => {
    dispatch(setCurrentLeadThunk(leadId));
    router.push(LEAD_DETAIL_PATH);
  };

  const emptyForStatus =
    !isInitialCallLogLoading && sortedItems.length === 0
      ? 'No call log entries for this status.'
      : null;
  const emptyForSearch =
    !isInitialCallLogLoading &&
    sortedItems.length > 0 &&
    displayItems.length === 0
      ? 'No entries match your search.'
      : null;

  return (
    <div className={styles.container}>
      <div className={styles.filtersContainer}>
        <div className={styles.filtersRow}>
          <div className={styles.leftFilters}>
            <input
              id="to-call-log-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Contact, lead, notes…"
              className={styles.searchInput}
              autoComplete="off"
              aria-label="Search call log"
            />
            <select
              id="to-call-log-status"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as StatusFilterValue)
              }
              className={styles.filterSelect}
              aria-label="Call status filter"
            >
              {STATUS_FILTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            className={styles.refreshButton}
            onClick={handleForceRefresh}
            disabled={isFetchingAll}
            aria-label="Refresh call log"
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {isInitialCallLogLoading ? (
        <div className={styles.emptyState}>Loading call log...</div>
      ) : emptyForStatus ? (
        <div className={styles.emptyState}>{emptyForStatus}</div>
      ) : emptyForSearch ? (
        <div className={styles.emptyState}>{emptyForSearch}</div>
      ) : (
        <div className={styles.contentWrap}>
          <div className={styles.mobileCards}>
            {displayItems.map((item) => {
              const contact = leadContacts[item.lead_contact_id];
              const lead = leads[item.lead_id];
              const phoneTel = getTelHref(contact?.phone);
              return (
                <div key={item.id} className={styles.mobileCard}>
                  <div className={styles.mobileCardTop}>
                    <p className={styles.mobileContactName}>
                      {contact?.name || 'Unknown Contact'}
                    </p>
                    <div className={styles.mobileCardActions}>
                      <span className={styles.mobileStatus}>
                        {item.call_status.toUpperCase()}
                      </span>
                      <ToCallLogItemActions item={item} contact={contact} />
                    </div>
                  </div>
                  <p className={styles.mobileLine}>
                    <span className={styles.mobileLabel}>Email:</span>{' '}
                    {contact?.email || 'No email'}
                  </p>
                  <p className={styles.mobileLine}>
                    <span className={styles.mobileLabel}>Phone:</span>{' '}
                    {phoneTel && contact?.phone ? (
                      <a href={phoneTel} className={styles.phoneLink}>
                        {contact.phone}
                      </a>
                    ) : (
                      'No phone'
                    )}
                  </p>
                  <p className={styles.mobileLine}>
                    <span className={styles.mobileLabel}>Lead:</span>{' '}
                    <button
                      type="button"
                      className={styles.leadButton}
                      onClick={() => handleOpenLead(item.lead_id)}
                    >
                      {lead?.business_name || lead?.name || 'Unknown Lead'}
                    </button>
                  </p>
                  <p className={styles.mobileLine}>
                    <span className={styles.mobileLabel}>Description:</span>{' '}
                    {lead?.description?.trim() || 'No description'}
                  </p>
                  <p className={styles.mobileLine}>
                    <span className={styles.mobileLabel}>Pre-call:</span> {item.notes}
                  </p>
                  <p className={styles.mobileLine}>
                    <span className={styles.mobileLabel}>Call notes:</span>{' '}
                    {item.call_notes?.trim() || '—'}
                  </p>
                  <p className={styles.mobileCreatedAt}>
                    {formatDateTimeWithTime(item.created_at)}
                  </p>
                </div>
              );
            })}
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.tableHeader}>Contact</th>
                  <th className={styles.tableHeader}>Contact Email</th>
                  <th className={styles.tableHeader}>Contact Phone</th>
                  <th className={styles.tableHeader}>Lead</th>
                  <th className={styles.tableHeader}>Lead Description</th>
                  <th className={styles.tableHeader}>Status</th>
                  <th className={styles.tableHeader}>Pre-call notes</th>
                  <th className={styles.tableHeader}>Call notes</th>
                  <th className={styles.tableHeader}>Created</th>
                  <th className={styles.tableHeaderActions} aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {displayItems.map((item) => {
                  const contact = leadContacts[item.lead_contact_id];
                  const lead = leads[item.lead_id];
                  const phoneTel = getTelHref(contact?.phone);
                  return (
                    <tr key={item.id} className={styles.tableRow}>
                      <td className={styles.tableCell}>
                        {contact?.name || 'Unknown Contact'}
                      </td>
                      <td className={styles.tableCell}>
                        {contact?.email || 'No email'}
                      </td>
                      <td className={styles.tableCell}>
                        {phoneTel && contact?.phone ? (
                          <a href={phoneTel} className={styles.phoneLink}>
                            {contact.phone}
                          </a>
                        ) : (
                          'No phone'
                        )}
                      </td>
                      <td className={styles.tableCell}>
                        <button
                          type="button"
                          className={styles.leadButton}
                          onClick={() => handleOpenLead(item.lead_id)}
                        >
                          {lead?.business_name || lead?.name || 'Unknown Lead'}
                        </button>
                      </td>
                      <td className={styles.tableCell}>
                        {lead?.description?.trim() || 'No description'}
                      </td>
                      <td className={styles.tableCell}>
                        {item.call_status.toUpperCase()}
                      </td>
                      <td className={styles.tableCell}>{item.notes}</td>
                      <td className={styles.tableCell}>
                        {item.call_notes?.trim() ? item.call_notes : '—'}
                      </td>
                      <td className={styles.tableCell}>
                        {formatDateTimeWithTime(item.created_at)}
                      </td>
                      <td className={styles.tableCellActions}>
                        <ToCallLogItemActions item={item} contact={contact} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: `
    w-full space-y-3
  `,
  filtersContainer: `
    w-full
  `,
  filtersRow: `
    flex items-center justify-between gap-4 flex-wrap
  `,
  leftFilters: `
    flex gap-2 items-center flex-wrap min-w-0 flex-1
  `,
  searchInput: `
    h-7 min-w-0 w-full max-w-md flex-1 px-2 text-xs
    border border-gray-300 rounded
    focus:outline-none focus:ring-1 focus:ring-blue-500
    bg-white text-gray-900
    placeholder:text-gray-400
  `,
  filterSelect: `
    h-7 shrink-0 px-2 py-1 text-xs sm:w-40
    border border-gray-300 rounded
    focus:outline-none focus:ring-1 focus:ring-blue-500
    bg-white text-gray-900
    cursor-pointer
  `,
  refreshButton: `
    h-7 px-3 text-xs font-medium shrink-0
    text-gray-700 bg-white border border-gray-300 rounded
    hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500
    cursor-pointer
  `,
  contentWrap: `
    space-y-3
  `,
  mobileCards: `
    space-y-2
    md:hidden
  `,
  mobileCard: `
    rounded border border-gray-300 bg-white p-3
  `,
  mobileCardTop: `
    mb-2 flex items-start justify-between gap-2
  `,
  mobileCardActions: `
    flex shrink-0 items-center gap-0.5
  `,
  mobileContactName: `
    text-sm font-semibold text-gray-900
  `,
  mobileStatus: `
    inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-700
  `,
  mobileLine: `
    mt-1 text-xs text-gray-700
  `,
  mobileLabel: `
    font-semibold text-gray-900
  `,
  mobileCreatedAt: `
    mt-2 text-[10px] text-gray-500
  `,
  tableWrap: `
    bg-white rounded border border-gray-300 overflow-hidden
    hidden md:block
  `,
  table: `
    w-full border-collapse text-xs
  `,
  tableHeader: `
    px-3 py-2 text-left text-[10px] font-semibold text-gray-600
    uppercase tracking-wide bg-gray-100 border-b border-gray-300
    whitespace-nowrap
  `,
  tableHeaderActions: `
    w-10 px-2 py-2 text-right text-[10px] font-semibold text-gray-600
    uppercase tracking-wide bg-gray-100 border-b border-gray-300
    whitespace-nowrap
  `,
  tableRow: `
    border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors
  `,
  tableCell: `
    px-3 py-2 text-xs text-gray-700 align-top
  `,
  tableCellActions: `
    px-2 py-2 text-right align-top w-10
  `,
  leadButton: `
    text-blue-600 hover:text-blue-800 hover:underline transition-colors cursor-pointer
    border-none bg-transparent p-0 text-left
  `,
  phoneLink: `
    text-blue-600 hover:text-blue-800 hover:underline transition-colors
  `,
  emptyState: `
    bg-white border border-gray-300 rounded p-8 text-center text-xs text-gray-500
  `,
};
