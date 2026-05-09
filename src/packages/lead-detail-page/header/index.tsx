'use client';

import { useAppSelector } from '@/store/hooks';
import { truncateLeadHeaderBlurb } from '@/utils/leads';
import { LeadDeleteConfirmModal } from './confirm-delete';
import { ActionsMenu, ScoreInput, StatusInput } from './inputs';

const display = (v: string | null | undefined) =>
  v && String(v).trim() !== '' ? v : '—';

export const DetailHeader = () => {
  const currentLead = useAppSelector((state) => state.currentLead);

  const rawBlurb =
    currentLead.description?.trim() || currentLead.summary?.content?.trim() || '';
  const aiSummaryBlurb = rawBlurb ? truncateLeadHeaderBlurb(rawBlurb) : '';

  return (
    <>
      <div className={styles.headerCard}>
        <div className={styles.oneLine}>
          <div className={styles.titleRow}>
            <h2 className={styles.businessTitle}>{display(currentLead.business_name)}</h2>
            {currentLead.category_name ? (
              <span className={styles.categorySubtext}>{currentLead.category_name}</span>
            ) : (
              <span className={styles.categorySubtextEmpty}>No category</span>
            )}
          </div>
          <div className={styles.headerActions}>
            <StatusInput />
            <ScoreInput />
            <ActionsMenu />
          </div>
        </div>

        {aiSummaryBlurb ? (
          <p className={styles.aiBlurb}>{aiSummaryBlurb}</p>
        ) : (
          <p className={styles.aiBlurbEmpty}>
            No AI summary yet — run website research on the Research tab.
          </p>
        )}
      </div>

      <LeadDeleteConfirmModal />
    </>
  );
};

const styles = {
  headerCard: `
    bg-white rounded border border-gray-300 py-2 px-3 mb-3 space-y-2
  `,
  oneLine: `
    flex flex-wrap items-center justify-between gap-x-3 gap-y-1 min-h-0
  `,
  headerActions: `flex shrink-0 items-center gap-1.5`,
  titleRow: `flex flex-wrap items-center gap-1.5 min-w-0 flex-1`,
  businessTitle: `text-sm font-semibold text-gray-900 truncate`,
  categorySubtext: `text-xs text-gray-500 truncate`,
  categorySubtextEmpty: `text-xs text-gray-400 italic`,
  aiBlurb: `
    text-sm text-gray-600 leading-snug line-clamp-3 pr-1
  `,
  aiBlurbEmpty: `
    text-xs text-gray-400 italic leading-snug
  `,
};
