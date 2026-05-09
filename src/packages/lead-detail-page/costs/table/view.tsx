'use client';

import { useMemo, useState } from 'react';
import { formatCents } from '@/utils/costs';
import { formatDateTimeShort } from '@/utils/date-time';
import type { LeadCostLine } from '@/model';
import { CostsTableRow } from './row';

export type CostsTableViewProps = {
  rows: LeadCostLine[];
};

export const CostsTableView = (props: CostsTableViewProps) => {
  const { rows } = props;
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const pagedRows = useMemo(() => {
    return rows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  }, [rows, safePage]);

  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tableHeaderRow}>
            <th className={styles.tableHeader}>Type</th>
            <th className={styles.tableHeader}>Date</th>
            <th className={styles.tableHeaderRight}>Cost</th>
          </tr>
        </thead>
        <tbody>
          {pagedRows.map((row) => (
            <CostsTableRow
              key={row.id}
              line={row}
              dateLabel={formatDateTimeShort(row.created_at)}
              costLabel={formatCents(row.cost_cents)}
            />
          ))}
        </tbody>
      </table>
      {totalPages > 1 ? (
        <div className={styles.paginationRow}>
          <button
            type="button"
            className={styles.paginationButton}
            disabled={safePage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
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
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      ) : null}
    </>
  );
};

const styles = {
  table: `min-w-full divide-y divide-gray-200`,
  tableHeaderRow: `bg-gray-50`,
  tableHeader: `
    px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600
  `,
  tableHeaderRight: `
    px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600
  `,
  paginationRow: `mt-3 flex items-center justify-end gap-2`,
  paginationButton: `
    rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700
    hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed
  `,
  paginationLabel: `text-xs text-gray-600 min-w-[6.5rem] text-center`,
} as const;
