'use client';

import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { LeadBuilderActions } from '@/store/builders';
import type { Lead } from '@/model';
import { LeadsTableGroup } from './group';
import { useLeadsTableData } from './hook';

export const LeadsTable = () => {
  const dispatch = useAppDispatch();
  const leadBuilder = useAppSelector((state) => state.leadBuilder);
  const selectedLeadIds = leadBuilder.selectedLeadIds;
  const leadCategories = useAppSelector((state) => state.leadCategories);

  const {
    sortedLeads,
    sortColumn,
    sortDirection,
    handleSort,
    hasFiltersSubset,
  } = useLeadsTableData();

  const leadsByCategory = useMemo(() => {
    const map = new Map<string | null, Lead[]>();
    sortedLeads.forEach((lead) => {
      const categoryId = lead.category_id ?? null;
      if (!map.has(categoryId)) map.set(categoryId, []);
      map.get(categoryId)!.push(lead);
    });
    return map;
  }, [sortedLeads]);

  const categoryIds = useMemo(() => {
    return Array.from(leadsByCategory.keys()).sort((a, b) => {
      if (a === null) return 1;
      if (b === null) return -1;
      const catA = leadCategories.find((c) => c.id === a);
      const catB = leadCategories.find((c) => c.id === b);
      return (catA?.name ?? '').localeCompare(catB?.name ?? '');
    });
  }, [leadsByCategory, leadCategories]);

  const allSelected = useMemo(
    () =>
      sortedLeads.length > 0 &&
      sortedLeads.every((lead) => selectedLeadIds.includes(lead.id)),
    [sortedLeads, selectedLeadIds]
  );

  const handleSelectAll = () => {
    if (allSelected) {
      dispatch(LeadBuilderActions.clearLeadSelection());
    } else {
      dispatch(
        LeadBuilderActions.selectAllLeads(sortedLeads.map((lead) => lead.id))
      );
    }
  };

  if (sortedLeads.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyTitle}>
          {hasFiltersSubset
            ? 'No leads match your filters'
            : 'No leads found'}
        </p>
        <p className={styles.emptyDescription}>
          {hasFiltersSubset
            ? 'Try adjusting your filters or clear them to see all leads.'
            : 'Open Find Leads or add one manually — keep the pipeline here, not in another spreadsheet.'}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.checkboxHeader}>
              <input
                type="checkbox"
                checked={allSelected}
                ref={(input) => {
                  if (input) {
                    input.indeterminate =
                      selectedLeadIds.length > 0 && !allSelected;
                  }
                }}
                onChange={handleSelectAll}
                className={styles.checkbox}
                title={allSelected ? 'Deselect all' : 'Select all'}
              />
            </th>
            <th className={styles.rowNumberHeader}>#</th>
            <th
              className={styles.sortableHeader}
              onClick={() => handleSort('business_name')}
            >
              <span>Business Name</span>
              <span className={styles.sortIcon}>
                {sortColumn === 'business_name'
                  ? sortDirection === 'asc'
                    ? ' ↑'
                    : ' ↓'
                  : ' ↕'}
              </span>
            </th>
            <th className={styles.tableHeader}>Category</th>
            <th className={styles.tableHeader}>Status</th>
            <th
              className={styles.sortableHeaderCenter}
              onClick={() => handleSort('quality_score')}
            >
              <span>Quality</span>
              <span className={styles.sortIcon}>
                {sortColumn === 'quality_score'
                  ? sortDirection === 'asc'
                    ? ' ↑'
                    : ' ↓'
                  : ' ↕'}
              </span>
            </th>
            <th className={styles.tableHeader}>Contacts</th>
            <th className={styles.tableHeaderCenter}>Research</th>
            <th className={styles.tableHeader} aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {categoryIds.map((categoryId) => (
            <LeadsTableGroup
              key={categoryId ?? 'uncategorized'}
              categoryId={categoryId}
              leads={leadsByCategory.get(categoryId) ?? []}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  tableContainer: `
    bg-white rounded border border-gray-300 overflow-x-auto overflow-y-visible
  `,
  table: `w-full border-collapse text-sm relative`,
  checkboxHeader: `
    px-2 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wide
    bg-gray-100 border-b border-gray-300 w-12
  `,
  checkbox: `cursor-pointer`,
  rowNumberHeader: `
    px-2 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide
    bg-gray-100 border-b border-gray-300 w-8
  `,
  tableHeader: `
    px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide
    bg-gray-100 border-b border-gray-300
  `,
  tableHeaderCenter: `
    px-3 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wide
    bg-gray-100 border-b border-gray-300 whitespace-nowrap
  `,
  sortableHeader: `
    px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide
    bg-gray-100 border-b border-gray-300 cursor-pointer hover:bg-gray-200 transition-colors select-none
  `,
  sortableHeaderCenter: `
    px-3 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wide
    bg-gray-100 border-b border-gray-300 cursor-pointer hover:bg-gray-200 transition-colors select-none
  `,
  sortIcon: `ml-1 text-gray-400 text-[10px]`,
  emptyState: `bg-white rounded border border-gray-300 p-8 text-center`,
  emptyTitle: `text-lg font-semibold text-gray-900 mb-2`,
  emptyDescription: `text-sm text-gray-600`,
};
