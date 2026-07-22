'use client';

import { Sparkles } from 'lucide-react';

export const AtAGlanceCardHeader = () => {
  return (
    <div className={styles.cardHeader}>
      <Sparkles className="h-4 w-4 shrink-0 text-[#FF7C1E]" />
      <div className={styles.cardHeaderBody}>
        <span className={styles.cardTitle}>At a glance</span>
        <p className={styles.cardSubtitle}>Key facts from the website crawl (stored on the lead)</p>
      </div>
    </div>
  );
};

const styles = {
  cardHeader: `flex items-start gap-2`,
  cardHeaderBody: `min-w-0 flex-1 space-y-0.5`,
  cardTitle: `text-sm font-semibold text-gray-900`,
  cardSubtitle: `text-xs text-gray-500 mt-0.5`,
};
