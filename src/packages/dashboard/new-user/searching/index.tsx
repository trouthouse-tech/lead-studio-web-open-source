'use client';

import { Loader2 } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

const STEPS = ['Locating businesses', 'Fetching details', 'Preparing your list'];

/**
 * Onboarding modal phase: Maps scrape in progress.
 */
export const OnboardingSearching = () => {
  const draftTypes = useAppSelector(
    (s) => s.dashboardBuilder.draftBusinessTypes
  );
  const index = useAppSelector(
    (s) => s.dashboardBuilder.onboardingScrapeIndex
  );
  const total = draftTypes.length;
  const stepIdx =
    total === 0
      ? 0
      : Math.min(STEPS.length - 1, Math.floor((index / total) * STEPS.length));

  const progressPercent = total ? Math.min(100, (index / total) * 100) : 0;

  return (
    <>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <Loader2 className={styles.spinner} aria-hidden />
          <h2 className={styles.title}>Finding businesses…</h2>
        </div>
        <p className={styles.description}>
          Searching Google Maps for your criteria. This may take a minute.
        </p>
        {total > 0 && (
          <p className={styles.progressMeta}>
            Type {index} of {total}
          </p>
        )}
      </div>
      <div className={styles.body}>
        <div
          className={styles.progressTrack}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progressPercent)}
        >
          <div
            className={styles.progressFill}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <ul className={styles.stepList}>
          {STEPS.map((label, i) => (
            <li key={label} className={styles.stepItem}>
              {i < stepIdx ? (
                <span className={styles.stepDone}>✓</span>
              ) : i === stepIdx ? (
                <Loader2 className={styles.stepSpinner} aria-hidden />
              ) : (
                <span className={styles.stepTodo} />
              )}
              <span
                className={
                  i <= stepIdx ? styles.stepLabelActive : styles.stepLabelTodo
                }
              >
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

const styles = {
  header: `
    px-5 py-4 border-b border-slate-100 bg-slate-50
  `,
  titleRow: `
    flex items-center gap-2
  `,
  spinner: `
    h-5 w-5 animate-spin text-slate-700 shrink-0
  `,
  title: `
    text-lg font-semibold text-slate-900
  `,
  description: `
    mt-1 text-sm text-slate-600
  `,
  progressMeta: `
    mt-2 text-sm font-medium text-slate-700
  `,
  body: `
    px-5 py-4 space-y-4
  `,
  progressTrack: `
    h-2 w-full rounded-full bg-slate-200 overflow-hidden
  `,
  progressFill: `
    h-full bg-slate-800 rounded-full transition-[width] duration-300 ease-out
  `,
  stepList: `
    flex flex-wrap gap-x-8 gap-y-2 list-none p-0 m-0
  `,
  stepItem: `
    flex items-center gap-2 text-sm
  `,
  stepDone: `
    text-emerald-600 font-semibold text-xs w-4 text-center
  `,
  stepSpinner: `
    h-4 w-4 animate-spin text-slate-700
  `,
  stepTodo: `
    h-4 w-4 rounded-full border-2 border-slate-200 shrink-0
  `,
  stepLabelActive: `
    text-slate-900 font-medium
  `,
  stepLabelTodo: `
    text-slate-500
  `,
} as const;
