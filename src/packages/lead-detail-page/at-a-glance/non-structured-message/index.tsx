'use client';

import { Sparkles } from 'lucide-react';
import { ResearchWebsiteResearchButton } from '../actions/website-research';
import { ResearchVoiceOverviewButton } from '../voice-overview';

/**
 * Shown when the lead has no structured at-a-glance JSON yet (facts, legacy tags, watchouts, workflows).
 */
export const NonStructuredMessage = () => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <Sparkles className="h-4 w-4 shrink-0 text-[#FF7C1E]" />
        <div className={styles.cardHeaderBody}>
          <div className={styles.titleRow}>
            <span className={styles.cardTitle}>At a glance</span>
            <div className={styles.headerActions}>
              <ResearchVoiceOverviewButton />
              <ResearchWebsiteResearchButton variant="icon" />
            </div>
          </div>
          <p className={styles.cardSubtitle}>
            After website research finishes, the server saves structured fields on this lead (service
            area, residential vs commercial, and other scan lines). Open the lead again or refresh if
            you just ran research — nothing shows here until that JSON exists on the lead.
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
  titleRow: `flex items-center justify-between gap-2 min-w-0`,
  headerActions: `inline-flex items-center gap-1`,
  cardTitle: `text-sm font-semibold text-gray-900`,
  cardSubtitle: `text-xs text-gray-500 mt-0.5`,
};
