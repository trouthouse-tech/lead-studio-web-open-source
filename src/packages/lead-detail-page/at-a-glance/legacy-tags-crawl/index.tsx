'use client';

import { useAppSelector } from '@/store/hooks';
import { hasWebsiteFactsContent } from '@/utils/leads';

/**
 * Legacy crawl highlight tags when structured website facts are not present on the lead.
 */
export const LegacyTagsCrawlSection = () => {
  const lead = useAppSelector((state) => state.currentLead);
  const highlights = lead.summary?.highlights?.filter((h) => h?.trim()) ?? [];

  if (hasWebsiteFactsContent(lead) || highlights.length === 0) {
    return null;
  }

  return (
    <div>
      <p className={styles.miniLabel}>Tags (legacy crawl)</p>
      <div className={styles.tagRow}>
        {highlights.map((h) => (
          <span key={h} className={styles.tag}>
            {h}
          </span>
        ))}
      </div>
    </div>
  );
};

const styles = {
  miniLabel: `text-xs font-medium text-gray-500 mb-1.5`,
  tagRow: `flex flex-wrap gap-1.5`,
  tag: `
    inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800
  `,
};
