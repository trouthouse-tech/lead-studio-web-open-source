'use client';

import { ExternalLink } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

const LABEL = 'Website';

export const OnlineProfilesWebsiteRow = () => {
  const lead = useAppSelector((state) => state.currentLead);
  const url =
    lead.website?.trim() ||
    (lead.website_urls && lead.website_urls[0]?.trim()) ||
    null;

  return (
    <div className={styles.profileChip}>
      <span className={styles.profileIcon}>🌐</span>
      <div className="min-w-0 flex-1">
        <div className={styles.profileLabelRow}>
          <span className={styles.profileLabel}>{LABEL}</span>
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
  profileUrl: `
    flex items-center gap-1 text-sm text-blue-600 hover:underline break-all
  `,
  profileMissing: `text-sm text-gray-500 italic`,
};
