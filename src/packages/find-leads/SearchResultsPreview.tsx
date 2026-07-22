'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, Loader2, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { CurrentGoogleMapsScrapeRunActions } from '@/store/current/currentGoogleMapsScrapeRun';
import type { GoogleMapsScrapeRun } from '@/model';

export const SearchResultsPreview = () => {
  const dispatch = useAppDispatch();
  const googleMapsScraperBuilder = useAppSelector((s) => s.googleMapsScraperBuilder);
  const isScraping = googleMapsScraperBuilder.isScraping;
  const currentScrapeRun = useAppSelector((s) => s.currentGoogleMapsScrapeRun) as GoogleMapsScrapeRun | null;

  const dismissSuccess = () => {
    dispatch(CurrentGoogleMapsScrapeRunActions.setGoogleMapsScrapeRun(null));
  };

  if (isScraping) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingBanner}>
          <Loader2 className={styles.loadingIcon} aria-hidden />
          <p className={styles.loadingText}>Scraping Google Maps and creating leads…</p>
        </div>
      </div>
    );
  }

  if (!currentScrapeRun || currentScrapeRun.status !== 'completed') {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.successBanner}>
        <CheckCircle2 className={styles.successIcon} aria-hidden />
        <div className={styles.successBody}>
          <p className={styles.successLine}>
            Scrape complete — {currentScrapeRun.resultsCount} businesses found,{' '}
            {currentScrapeRun.businessesImported} leads created.
          </p>
          <Link href="/leads" className={styles.successLink}>
            View leads <ArrowRight className={styles.linkIcon} aria-hidden />
          </Link>
        </div>
        <button
          type="button"
          onClick={dismissSuccess}
          className={styles.dismiss}
          aria-label="Dismiss"
        >
          <X className={styles.iconSm} />
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: `w-full mb-4`,
  loadingBanner: `
    flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3
  `,
  loadingIcon: `h-5 w-5 text-blue-600 animate-spin shrink-0`,
  loadingText: `text-sm font-medium text-blue-900`,
  successBanner: `
    flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4
  `,
  successIcon: `h-5 w-5 text-green-600 mt-0.5 shrink-0`,
  successBody: `flex-1 min-w-0`,
  successLine: `text-sm font-medium text-green-900`,
  successLink: `
    inline-flex items-center gap-1 text-sm text-green-800 underline hover:no-underline mt-1
  `,
  linkIcon: `h-3.5 w-3.5`,
  dismiss: `ml-auto text-green-600 hover:text-green-800 p-1 rounded shrink-0`,
  iconSm: `h-4 w-4`,
};
