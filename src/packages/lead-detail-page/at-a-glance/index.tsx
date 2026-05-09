'use client';

import { useAppSelector } from '@/store/hooks';
import { hasAtAGlanceContent } from '@/utils/leads';
import { KeyFactsSection } from './facts';
import { AtAGlanceCardHeader } from './header';
import { LegacyTagsCrawlSection } from './legacy-tags-crawl';
import { NonStructuredMessage } from './non-structured-message';
import { SuggestedWorkflowsSection } from './suggested-workflows';
import { WatchoutsSection } from './watchouts';

/**
 * Structured AI fields from `lead.summary` (JSON on `leads.summary`).
 * Short prose lives on `lead.description` (lead header).
 */
export const ResearchSummarySection = () => {
  const lead = useAppSelector((state) => state.currentLead);
  const hasStructured = hasAtAGlanceContent(lead);

  if (!hasStructured) {
    return <NonStructuredMessage />;
  }

  return (
    <div className={styles.card}>
      <AtAGlanceCardHeader />

      <KeyFactsSection />
      <LegacyTagsCrawlSection />
      <WatchoutsSection />
      <SuggestedWorkflowsSection />
    </div>
  );
};

const styles = {
  card: `
    rounded-lg border border-gray-200 bg-white p-5 space-y-4
  `,
};
