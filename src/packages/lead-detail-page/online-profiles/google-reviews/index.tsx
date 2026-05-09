'use client';

import { ExternalLink, RefreshCw } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

const LABEL = 'Google Reviews';

export const OnlineProfilesGoogleReviewsRow = () => {
  const lead = useAppSelector((state) => state.currentLead);
  const url = lead?.google_reviews_url?.trim() || null;

  return (
    <div className={styles.profileChip}>
      <span className={styles.profileIcon}>📍</span>
      <div className="min-w-0 flex-1">
        <div className={styles.profileLabelRow}>
          <span className={styles.profileLabel}>{LABEL}</span>
          <button
            type="button"
            className={styles.refreshDisabled}
            disabled
            title="Google Reviews search coming soon"
            aria-label="Google Reviews refresh not available yet"
          >
            <RefreshCw className="h-3.5 w-3.5 opacity-40" aria-hidden />
          </button>
        </div>
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className={styles.profileUrl}
          >
            Visit {LABEL}
            <ExternalLink className="h-3 w-3 shrink-0" />
          </a>
        ) : (
          <span className={styles.profileMissing}>Not found</span>
        )}
      </div>
    </div>
  );
};

const styles = {
  profileChip: `
    flex items-start gap-2.5 rounded-md border border-gray-200 p-3
  `,
  profileIcon: `text-base leading-none mt-0.5`,
  profileLabelRow: `
    flex items-center justify-between gap-1 min-w-0
  `,
  profileLabel: `text-xs font-medium text-gray-500 truncate`,
  refreshDisabled: `
    inline-flex shrink-0 items-center justify-center rounded p-0.5 text-gray-400 cursor-not-allowed
  `,
  profileUrl: `
    flex items-center gap-1 text-sm text-blue-600 hover:underline break-all
  `,
  profileMissing: `text-sm text-gray-500 italic`,
};
