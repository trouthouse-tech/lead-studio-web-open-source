'use client';

import { LeadContactsTableRow } from './row';
import { useLeadContactsTableData } from './hook';

export const LeadContactsTable = () => {
  const { visibleContacts, totalCount } = useLeadContactsTableData();

  if (totalCount === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyText}>No contacts found</p>
      </div>
    );
  }

  if (visibleContacts.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyText}>No contacts match your filters</p>
        <p className={styles.emptyHint}>
          Try adjusting your filters or reset them to see all contacts.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.tableHeaderCell}>#</th>
            <th className={styles.tableHeaderCell}>Name</th>
            <th className={styles.tableHeaderCell}>Role</th>
            <th className={styles.tableHeaderCell}>Status</th>
            <th className={styles.tableHeaderCell}>Email</th>
            <th className={styles.tableHeaderCell}>Phone</th>
            <th className={styles.tableHeaderCell}>Lead</th>
            <th className={styles.tableHeaderCell}>Added</th>
            <th className={styles.tableHeaderCell}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {visibleContacts.map((contact, index) => (
            <LeadContactsTableRow key={contact.id} contact={contact} index={index} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  emptyState: `
    bg-white border border-gray-300 rounded p-8 text-center
  `,
  emptyText: `
    text-gray-500 text-xs
  `,
  emptyHint: `
    text-gray-400 text-xs mt-1.5
  `,
  tableWrapper: `
    bg-white rounded border border-gray-300 overflow-hidden
  `,
  table: `
    w-full border-collapse text-xs
  `,
  tableHeaderCell: `
    px-3 py-2 text-left text-[10px] font-semibold text-gray-600
    uppercase tracking-wide bg-gray-100 border-b border-gray-300
    whitespace-nowrap
  `,
};
