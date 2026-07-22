'use client';

import { useMemo, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { getDateRangeForFilter, toTimestamp } from '@/utils/date-time';
import { LeadSentEmailRow } from './LeadSentEmailRow';
import type { LeadContact } from '@/model';
import type { LeadSentEmail } from '@/model/lead-sent-email';

type SortColumn = 'sent_at' | 'status' | 'delivery_status';
type SortDirection = 'asc' | 'desc';

const resolveLeadIdForSentEmail = (
  email: LeadSentEmail,
  leadContactsById: Record<string, LeadContact>
): string | null => {
  const contact = leadContactsById[email.lead_contact_id];
  const leadId = contact?.lead_id?.trim();
  return leadId || null;
};

export const LeadSentEmailsList = () => {
  const leadSentEmailsRecord = useAppSelector((state) => state.leadSentEmails);
  const leadContactsById = useAppSelector((state) => state.leadContacts);
  const leadSentEmailsBuilder = useAppSelector((state) => state.leadSentEmailsBuilder);
  const dateRangeFilter = leadSentEmailsBuilder.dateRangeFilter;
  const statCardFilter = leadSentEmailsBuilder.statCardFilter;
  const onlySingleSentPerLead = leadSentEmailsBuilder.onlySingleSentPerLead;
  const coldEmailOfferingFilterId = leadSentEmailsBuilder.coldEmailOfferingFilterId;

  const [sortColumn, setSortColumn] = useState<SortColumn>('sent_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const sentEmails = useMemo(() => {
    const allEmails = Object.values(leadSentEmailsRecord) as LeadSentEmail[];

    const leadIdCounts = new Map<string, number>();
    for (const email of allEmails) {
      const leadId = resolveLeadIdForSentEmail(email, leadContactsById);
      if (!leadId) {
        continue;
      }
      leadIdCounts.set(leadId, (leadIdCounts.get(leadId) ?? 0) + 1);
    }
    const leadIdsWithExactlyOneSent = new Set<string>();
    for (const [leadId, count] of leadIdCounts) {
      if (count === 1) {
        leadIdsWithExactlyOneSent.add(leadId);
      }
    }

    let filtered = allEmails;

    if (dateRangeFilter) {
      const range = getDateRangeForFilter(dateRangeFilter);
      if (range) {
        filtered = filtered.filter((email) => {
          const sentTime = toTimestamp(email.sent_at);
          return sentTime >= range.start && sentTime <= range.end;
        });
      }
    }

    if (statCardFilter) {
      switch (statCardFilter) {
        case 'bounced':
          filtered = filtered.filter((e) => e.delivery_status === 'bounced');
          break;
        case 'unique_opens': {
          const opened = filtered.filter((e) => e.delivery_status === 'opened');
          const seenContacts = new Set<string>();
          filtered = opened.filter((e) => {
            if (seenContacts.has(e.lead_contact_id)) return false;
            seenContacts.add(e.lead_contact_id);
            return true;
          });
          break;
        }
        case 'total_opens':
          filtered = filtered.filter((e) => e.delivery_status === 'opened');
          break;
        case 'not_opened':
          filtered = filtered.filter((e) => e.delivery_status !== 'opened');
          break;
      }
    }

    if (onlySingleSentPerLead) {
      filtered = filtered.filter((email) => {
        const leadId = resolveLeadIdForSentEmail(email, leadContactsById);
        return leadId != null && leadIdsWithExactlyOneSent.has(leadId);
      });
    }

    if (coldEmailOfferingFilterId) {
      filtered = filtered.filter(
        (email) => email.cold_email_offering_id === coldEmailOfferingFilterId,
      );
    }

    return filtered;
  }, [
    leadSentEmailsRecord,
    leadContactsById,
    dateRangeFilter,
    statCardFilter,
    onlySingleSentPerLead,
    coldEmailOfferingFilterId,
  ]);

  const sortedEmails = useMemo(() => {
    return [...sentEmails].sort((a, b) => {
      let comparison = 0;
      if (sortColumn === 'sent_at') {
        comparison = toTimestamp(a.sent_at) - toTimestamp(b.sent_at);
      } else if (sortColumn === 'status') {
        const statusA = a.status ?? '';
        const statusB = b.status ?? '';
        comparison = statusA.localeCompare(statusB);
      } else if (sortColumn === 'delivery_status') {
        const deliveryA = a.delivery_status ?? '';
        const deliveryB = b.delivery_status ?? '';
        comparison = deliveryA.localeCompare(deliveryB);
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [sentEmails, sortColumn, sortDirection]);

  if (sortedEmails.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyText}>No sent emails found</p>
        <p className={styles.emptySubtext}>
          Sent emails will appear here once emails are sent to leads.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.rowNumberHeader}>#</th>
            <th
              className={`${styles.tableHeaderCell} ${styles.sortableHeader}`}
              onClick={() => handleSort('status')}
            >
              <div className={styles.headerContent}>
                Status
                {sortColumn === 'status' && (
                  <span className={styles.sortIndicator}>
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </th>
            <th
              className={`${styles.tableHeaderCell} ${styles.sortableHeader}`}
              onClick={() => handleSort('delivery_status')}
            >
              <div className={styles.headerContent}>
                Delivery
                {sortColumn === 'delivery_status' && (
                  <span className={styles.sortIndicator}>
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </th>
            <th className={styles.tableHeaderCell}>Contact</th>
            <th className={styles.tableHeaderCell}>Lead</th>
            <th
              className={`${styles.tableHeaderCell} ${styles.sortableHeader}`}
              onClick={() => handleSort('sent_at')}
            >
              <div className={styles.headerContent}>
                Sent At
                {sortColumn === 'sent_at' && (
                  <span className={styles.sortIndicator}>
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </th>
            <th className={styles.tableHeaderCell}>From Name</th>
            <th className={styles.tableHeaderCell}>Offering</th>
            <th className={styles.tableHeaderCell}>Variation</th>
            <th className={styles.tableHeaderCell}>Campaign</th>
            <th className={styles.tableHeaderCell}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedEmails.map((email, index) => (
            <tr key={email.id} className={styles.tableRow}>
              <td className={styles.rowNumberCell}>{index + 1}</td>
              <LeadSentEmailRow email={email} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  tableWrapper: `
    bg-white rounded border border-gray-300 overflow-hidden
  `,
  table: `
    w-full border-collapse text-xs
  `,
  rowNumberHeader: `
    px-2 py-2 text-left text-[10px] font-semibold text-gray-600
    uppercase tracking-wide bg-gray-100 border-b border-gray-300
    whitespace-nowrap w-8
  `,
  tableHeaderCell: `
    px-3 py-2 text-left text-[10px] font-semibold text-gray-600
    uppercase tracking-wide bg-gray-100 border-b border-gray-300
    whitespace-nowrap
  `,
  sortableHeader: `
    cursor-pointer hover:bg-gray-200 transition-colors
    user-select-none
  `,
  headerContent: `
    flex items-center gap-1
  `,
  sortIndicator: `
    text-gray-500 text-xs
  `,
  rowNumberCell: `
    px-2 py-2 text-xs text-gray-500 tabular-nums
  `,
  tableRow: `
    hover:bg-gray-50 transition-colors
    border-b border-gray-200 last:border-b-0
  `,
  emptyState: `
    bg-white border border-gray-300 rounded p-8 text-center
  `,
  emptyText: `
    text-gray-500 text-xs
  `,
  emptySubtext: `
    text-gray-400 text-xs mt-1.5
  `,
};
