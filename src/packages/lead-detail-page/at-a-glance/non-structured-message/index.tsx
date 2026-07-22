'use client';

import { Sparkles } from 'lucide-react';

/**
 * Shown when the lead has no structured at-a-glance JSON yet (facts, legacy tags, watchouts, workflows).
 */
export const NonStructuredMessage = () => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <Sparkles className="h-4 w-4 shrink-0 text-[#FF7C1E]" />
        <div className={styles.cardHeaderBody}>
          <span className={styles.cardTitle}>At a glance</span>
          <p className={styles.cardSubtitle}>
            Run research from Online Profiles to crawl the website, discover site pages, and fill
            structured fields here (service area, residential vs commercial, and other scan lines).
            Refresh or reopen the lead if you just finished a run — nothing shows until that JSON
            exists on the lead.
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: `
    rounded-lg border border-gray-200 bg-white p-5 space-y-4
  `,
  cardHeader: `flex items-start gap-2`,
  cardHeaderBody: `min-w-0 flex-1 space-y-0.5`,
  cardTitle: `text-sm font-semibold text-gray-900`,
  cardSubtitle: `text-xs text-gray-500 mt-0.5`,
};
