'use client';

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { formatCents } from '@/utils/costs';
import { useCostsForCurrentLead } from './use-costs-for-current-lead';
import { CostLinesTable } from './table';
import { AddLeadCostModal } from './add-lead-cost-modal';

/**
 * Lead detail costs: header actions + scrollable cost lines table for the current lead.
 */
export const CostsTable = () => {
  const { costs, isLoading, leadId, refresh, isSaving, createManualCost } =
    useCostsForCurrentLead();
  const [addOpen, setAddOpen] = useState(false);

  const totalCostCents = costs.reduce((sum, row) => sum + row.cost_cents, 0);

  const handleRefresh = async () => {
    if (!leadId || isLoading) return;
    await refresh();
  };

  return (
    <section className={styles.section} aria-labelledby="lead-detail-costs-heading">
      <div className={styles.sectionHeader}>
        <div className={styles.sectionHeadingWrap}>
          <h2 id="lead-detail-costs-heading" className={styles.sectionTitle}>
            Costs
          </h2>
          <button
            type="button"
            className={styles.refreshIconButton}
            onClick={() => {
              void handleRefresh();
            }}
            disabled={!leadId || isLoading}
            title="Refresh costs"
            aria-label="Refresh costs"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`}
              aria-hidden
            />
          </button>
        </div>
        <div className={styles.sectionAction}>
          <button
            type="button"
            className={styles.addButton}
            disabled={!leadId || isSaving}
            onClick={() => setAddOpen(true)}
          >
            Add Cost
          </button>
        </div>
      </div>
      <div className={styles.tableViewport}>
        <div className={styles.tableShell}>
          <div className={styles.tableContainer}>
            {!leadId ? (
              <div className={styles.emptyState}>
                <p className={styles.emptyTitle}>No lead selected</p>
              </div>
            ) : isLoading && costs.length === 0 ? (
              <div className={styles.loadingState}>Loading costs…</div>
            ) : costs.length === 0 ? (
              <div className={styles.emptyState}>
                <p className={styles.emptyTitle}>No costs recorded yet</p>
                <p className={styles.emptyDescription}>
                  Estimated AI usage from contact chat, email drafts, website “at a glance,” Google
                  profile search, and Facebook post scoring appears here automatically. Add one-off
                  spend (tools, credits, ads) with Add Cost.
                </p>
              </div>
            ) : (
              <CostLinesTable rows={costs} />
            )}
          </div>
        </div>
      </div>
      {costs.length > 0 ? (
        <p className={styles.totalLine}>Total CAC: {formatCents(totalCostCents)}</p>
      ) : null}
      <AddLeadCostModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        leadId={leadId}
        createManualCost={createManualCost}
        isSaving={isSaving}
      />
    </section>
  );
};

const styles = {
  section: `space-y-3`,
  sectionHeader: `flex flex-wrap items-center justify-between gap-3`,
  sectionHeadingWrap: `flex items-center gap-2`,
  sectionTitle: `text-sm font-semibold text-gray-900 uppercase tracking-wider`,
  sectionAction: `shrink-0`,
  tableShell: `
    overflow-hidden rounded-lg border border-gray-200
  `,
  tableViewport: `
    max-h-[24rem] overflow-y-auto
  `,
  tableContainer: `overflow-x-auto`,
  loadingState: `text-center py-8 text-sm text-gray-500`,
  emptyState: `text-center py-8 bg-gray-50`,
  emptyTitle: `font-medium text-gray-700 mb-1 text-sm`,
  emptyDescription: `text-xs text-gray-500 max-w-md mx-auto px-2`,
  totalLine: `mt-2 text-sm font-bold text-black text-right`,
  refreshIconButton: `
    inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white
    text-gray-600 hover:bg-gray-50 hover:text-gray-800
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
  addButton: `
    rounded-md border-none bg-blue-600 px-3 py-1.5 text-xs font-medium text-white
    transition-colors hover:bg-blue-700 cursor-pointer
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
};
