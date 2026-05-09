'use client';

import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectOnboardingLeadsGrouped,
  selectOnboardingTotalLeadsInBatch,
} from '@/store/selectors';
import { DashboardBuilderActions } from '@/store/builders/dashboardBuilder';
import { OnboardingLeadRow } from './row';

export const OnboardingLeadsPreview = () => {
  const dispatch = useAppDispatch();
  const groups = useAppSelector(selectOnboardingLeadsGrouped);
  const totalInBatch = useAppSelector(selectOnboardingTotalLeadsInBatch);

  const handleDismiss = () => {
    dispatch(DashboardBuilderActions.setOnboardingPhase('idle'));
    dispatch(DashboardBuilderActions.setShowOnboardingWizard(false));
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.title}>Review your first leads</h2>
        <p className={styles.description}>
          We found {totalInBatch} business
          {totalInBatch === 1 ? '' : 'es'} across {groups.length} search
          {groups.length === 1 ? '' : 'es'}. Here is a preview (up to five per
          category).
        </p>
      </div>
      <div className={styles.cardBody}>
        {totalInBatch === 0 ? (
          <p className={styles.empty}>
            No leads were linked to these searches yet. Open{' '}
            <Link href="/leads/find" className={styles.emptyLink}>
              Find leads
            </Link>{' '}
            to review runs, or check{' '}
            <Link href="/leads" className={styles.emptyLink}>
              All leads
            </Link>
            .
          </p>
        ) : (
          groups.map((group) => (
            <div key={group.runId} className={styles.section}>
              <h3 className={styles.sectionTitle}>{group.title}</h3>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.th}>Business</th>
                      <th className={styles.th}>Address</th>
                      <th className={styles.th}>Quality</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.leads.map((lead) => (
                      <OnboardingLeadRow key={lead.id} lead={lead} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>
      <div className={styles.actions}>
        <Link href="/leads" className={styles.primaryLink}>
          View all leads
        </Link>
        <button type="button" onClick={handleDismiss} className={styles.secondaryBtn}>
          Done
        </button>
      </div>
    </div>
  );
};

const styles = {
  card: `
    rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden
  `,
  cardHeader: `
    px-5 py-4 border-b border-slate-100 bg-slate-50
  `,
  title: `
    text-lg font-semibold text-slate-900
  `,
  description: `
    mt-1 text-sm text-slate-600
  `,
  cardBody: `
    px-5 py-4 space-y-6
  `,
  empty: `
    text-sm text-slate-600
  `,
  emptyLink: `
    text-slate-900 font-medium underline underline-offset-2 hover:text-slate-700
  `,
  section: ``,
  sectionTitle: `
    text-sm font-semibold text-slate-900 mb-2
  `,
  tableWrap: `
    rounded-lg border border-slate-200 overflow-hidden
  `,
  table: `
    w-full text-sm
  `,
  th: `
    text-left px-4 py-2 font-medium text-slate-500 bg-slate-50/80
  `,
  actions: `
    flex flex-wrap items-center gap-3 px-5 py-4 border-t border-slate-100 bg-slate-50/50
  `,
  primaryLink: `
    inline-flex items-center justify-center rounded-lg bg-slate-900 text-white
    text-sm font-medium px-4 py-2 hover:bg-slate-800 transition-colors
  `,
  secondaryBtn: `
    text-sm font-medium text-slate-600 hover:text-slate-900 underline-offset-2 hover:underline
  `,
};
