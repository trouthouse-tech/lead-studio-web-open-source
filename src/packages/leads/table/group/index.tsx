'use client';

import { useState, useMemo } from 'react';
import type { Lead } from '@/model';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { LeadBuilderActions } from '@/store/builders';
import { LeadsTableRow } from './row';

type LeadsTableGroupProps = {
  categoryId: string | null;
  leads: Lead[];
};

export const LeadsTableGroup = (props: LeadsTableGroupProps) => {
  const { categoryId, leads } = props;
  const dispatch = useAppDispatch();
  const [isExpanded, setIsExpanded] = useState(true);
  const leadBuilder = useAppSelector((state) => state.leadBuilder);
  const selectedLeadIds = leadBuilder.selectedLeadIds;
  const leadCategories = useAppSelector((state) => state.leadCategories);

  const category = useMemo(
    () => (categoryId ? leadCategories.find((c) => c.id === categoryId) : null),
    [categoryId, leadCategories]
  );
  const categoryName =
    categoryId === null ? 'Uncategorized' : (category?.name ?? 'Unknown');
  const allSelected = useMemo(
    () =>
      leads.length > 0 && leads.every((lead) => selectedLeadIds.includes(lead.id)),
    [leads, selectedLeadIds]
  );
  const someSelected = useMemo(() => {
    const n = leads.filter((lead) => selectedLeadIds.includes(lead.id)).length;
    return n > 0 && n < leads.length;
  }, [leads, selectedLeadIds]);

  if (leads.length === 0) return null;

  const handleToggleAll = () => {
    if (allSelected) {
      dispatch(
        LeadBuilderActions.selectAllLeads(
          selectedLeadIds.filter((id) => !leads.some((l) => l.id === id))
        )
      );
    } else {
      dispatch(
        LeadBuilderActions.selectAllLeads([
          ...new Set([...selectedLeadIds, ...leads.map((l) => l.id)]),
        ])
      );
    }
  };

  return (
    <>
      <tr className={styles.groupHeader}>
        <td className={styles.checkboxCell}>
          <input
            type="checkbox"
            checked={allSelected}
            ref={(input) => {
              if (input) input.indeterminate = someSelected;
            }}
            onChange={handleToggleAll}
            className={styles.checkbox}
            title={
              allSelected
                ? 'Deselect all in this category'
                : 'Select all in this category'
            }
          />
        </td>
        <td className={styles.groupHeaderCell} colSpan={4}>
          <button
            type="button"
            onClick={() => setIsExpanded((v) => !v)}
            className={styles.expandButton}
            title={isExpanded ? 'Collapse group' : 'Expand group'}
          >
            {isExpanded ? '▼' : '▶'}
          </button>
          <span className={styles.categoryIcon}>📁</span>
          <span className={styles.categoryName}>{categoryName}</span>
          <span className={styles.groupStats}>
            ({leads.length} lead{leads.length !== 1 ? 's' : ''})
          </span>
        </td>
        <td className={styles.groupHeaderCell} colSpan={4} />
      </tr>
      {isExpanded &&
        leads.map((lead, index) => (
          <LeadsTableRow key={lead.id} lead={lead} index={index} />
        ))}
    </>
  );
};

const styles = {
  groupHeader: `bg-gray-50 border-b-2 border-gray-300`,
  checkboxCell: `px-2 text-center`,
  checkbox: `cursor-pointer`,
  groupHeaderCell: `px-3 py-2`,
  expandButton: `
    mr-2 px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200
    rounded transition-colors cursor-pointer font-mono text-xs border-none bg-transparent
  `,
  categoryIcon: `mr-2 text-base`,
  categoryName: `font-semibold text-gray-900 text-sm`,
  groupStats: `ml-2 text-xs text-gray-600`,
};
