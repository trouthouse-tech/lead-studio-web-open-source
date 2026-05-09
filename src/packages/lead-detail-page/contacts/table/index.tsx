'use client';

import { useMemo, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { ContactsTableRow } from './row';

const PAGE_SIZE = 10;

export const LeadContactsTable = () => {
  const currentLead = useAppSelector((state) => state.currentLead);
  const leadContactsRecord = useAppSelector((state) => state.leadContacts);
  const [page, setPage] = useState(1);

  const leadId = currentLead.id;
  const contacts = useMemo(() => {
    return Object.values(leadContactsRecord)
      .filter((contact) => contact.lead_id === leadId)
      .sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
  }, [leadContactsRecord, leadId]);

  const totalPages = Math.max(1, Math.ceil(contacts.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedContacts = contacts.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  return (
    <div>
      <div className={styles.tableShell}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.headerRow}>
              <th className={styles.headerCell}>Name</th>
              <th className={styles.headerCell}>Title</th>
              <th className={styles.headerCell}>Status</th>
              <th className={styles.headerCellActions}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pagedContacts.map((contact) => (
              <ContactsTableRow key={contact.id} contact={contact} />
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 ? (
        <div className={styles.paginationRow}>
          <button
            type="button"
            className={styles.paginationButton}
            disabled={safePage <= 1}
            onClick={() => setPage((value) => Math.max(1, value - 1))}
          >
            Prev
          </button>
          <span className={styles.paginationLabel}>
            Page {safePage} of {totalPages}
          </span>
          <button
            type="button"
            className={styles.paginationButton}
            disabled={safePage >= totalPages}
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
};

const styles = {
  tableShell: `
    relative overflow-x-auto overflow-y-visible rounded-lg border border-gray-200
  `,
  table: `
    min-w-full divide-y divide-gray-200
  `,
  headerRow: `
    bg-gray-50
  `,
  headerCell: `
    px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600
  `,
  headerCellActions: `
    w-16 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600
  `,
  paginationRow: `
    mt-3 flex items-center justify-end gap-2
  `,
  paginationButton: `
    rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700
    hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed
  `,
  paginationLabel: `
    text-xs text-gray-600 min-w-[6.5rem] text-center
  `,
};
