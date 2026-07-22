'use client';

import { Globe, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { LeadBuilderActions } from '@/store/builders/leadBuilder';
import {
  leadHasWebsiteForCrawl,
  WebsiteResearchConfirmationModal,
} from '@/packages/lead-detail-page/at-a-glance/actions/website-research';
import { OnlineProfilesGoogleSearchRow } from './google-search';
import { OnlineProfilesWebsiteRow } from './website';
import { OnlineProfilesGoogleReviewsRow } from './google-reviews';
import { OnlineProfilesFacebookRow } from './facebook';
import { OnlineProfilesFacebookActivityRow } from './facebook-activity';
import { OnlineProfilesInstagramRow } from './instagram';
import { OnlineProfilesLinkedinRow } from './linkedin';

/**
 * Online-profile rows (site pages, website, reviews, Facebook, Facebook activity score, Instagram, LinkedIn).
 */
export const ResearchOnlineProfilesContent = () => {
  const dispatch = useAppDispatch();
  const leadBuilder = useAppSelector((state) => state.leadBuilder);
  const currentLead = useAppSelector((state) => state.currentLead);
  const phase = leadBuilder.researchRunPhase;
  const isBusy = phase !== 'idle';
  const canRun = leadHasWebsiteForCrawl({
    website: currentLead.website,
    websiteUrls: currentLead.website_urls,
  });

  const openConfirmModal = () => {
    if (!canRun || isBusy) return;
    dispatch(LeadBuilderActions.setWebsiteResearchConfirmModalOpen(true));
  };

  const busyLabel =
    phase === 'site_pages'
      ? 'Discovering pages…'
      : phase === 'website'
        ? 'Crawling website…'
        : phase === 'social'
          ? 'Searching social…'
          : 'Running research…';

  const noWebsiteTitle =
    'Set a website on this lead (or discover site pages first) before running research';

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardHeaderLeft}>
          <Globe className="h-4 w-4 text-[#FF7C1E]" />
          <span className={styles.cardTitle}>Online Profiles</span>
        </div>
        <button
          type="button"
          className={styles.runButton}
          disabled={isBusy || !canRun}
          title={
            !canRun
              ? noWebsiteTitle
              : 'Discover site pages (incl. social icons), crawl the website, then Facebook + Instagram'
          }
          aria-label="Run research"
          onClick={openConfirmModal}
        >
          {isBusy ? (
            <>
              <Loader2 className={styles.buttonSpinner} aria-hidden />
              {busyLabel}
            </>
          ) : (
            'Run research'
          )}
        </button>
      </div>
      <div className={styles.profileGrid}>
        <OnlineProfilesGoogleSearchRow />
        <OnlineProfilesWebsiteRow />
        <OnlineProfilesGoogleReviewsRow />
        <OnlineProfilesFacebookRow />
        <OnlineProfilesFacebookActivityRow />
        <OnlineProfilesInstagramRow />
        <OnlineProfilesLinkedinRow />
      </div>
      <WebsiteResearchConfirmationModal />
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
  cardHeader: `flex items-center justify-between gap-3`,
  cardHeaderLeft: `flex items-center gap-2 min-w-0`,
  cardTitle: `text-sm font-semibold text-gray-900`,
  runButton: `
    inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-800
    hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed
  `,
  buttonSpinner: `h-4 w-4 animate-spin`,
  profileGrid: `grid grid-cols-2 lg:grid-cols-3 gap-3`,
};
