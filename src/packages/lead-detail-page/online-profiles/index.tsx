'use client';

import { Globe } from 'lucide-react';
import { OnlineProfilesGoogleSearchRow } from './google-search';
import { OnlineProfilesWebsiteRow } from './website';
import { OnlineProfilesGoogleReviewsRow } from './google-reviews';
import { OnlineProfilesFacebookRow } from './facebook';
import { OnlineProfilesFacebookActivityRow } from './facebook-activity';
import { OnlineProfilesInstagramRow } from './instagram';
import { OnlineProfilesLinkedinRow } from './linkedin';
import { OnlineProfilesDesignPromptRow } from './design-prompt';

/**
 * Online-profile rows (site pages, website, reviews, Facebook, Facebook activity score, Instagram, LinkedIn, design prompt).
 */
export const ResearchOnlineProfilesContent = () => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <Globe className="h-4 w-4 text-[#FF7C1E]" />
        <span className={styles.cardTitle}>Online Profiles</span>
      </div>
      <div className={styles.profileGrid}>
        <OnlineProfilesGoogleSearchRow />
        <OnlineProfilesWebsiteRow />
        <OnlineProfilesGoogleReviewsRow />
        <OnlineProfilesFacebookRow />
        <OnlineProfilesFacebookActivityRow />
        <OnlineProfilesInstagramRow />
        <OnlineProfilesLinkedinRow />
        <OnlineProfilesDesignPromptRow />
      </div>
    </div>
  );
};

export const ResearchOnlineProfilesSection = () => {
  return <ResearchOnlineProfilesContent />;
};

const styles = {
  card: `
    rounded-lg border border-gray-200 bg-white p-5 space-y-4
  `,
  cardHeader: `flex items-center gap-2`,
  cardTitle: `text-sm font-semibold text-gray-900`,
  profileGrid: `grid grid-cols-2 lg:grid-cols-3 gap-3`,
};
