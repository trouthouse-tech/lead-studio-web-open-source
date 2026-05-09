'use client';

import { Loader2, RefreshCw } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { LeadBuilderActions } from '@/store/builders/leadBuilder';
import { WebsiteResearchConfirmationModal } from './confirmation-modal';
import { leadHasWebsiteForCrawl } from './lead-has-website-for-crawl';

type ResearchWebsiteResearchButtonProps = {
  /** `icon` = compact refresh in card header (same idea as Facebook profile refresh). */
  variant?: 'default' | 'icon';
};

/**
 * Playwright crawl + AI summary from `currentLead` website / `website_urls`.
 */
export const ResearchWebsiteResearchButton = (props: ResearchWebsiteResearchButtonProps) => {
  const { variant = 'default' } = props;
  const dispatch = useAppDispatch();
  const phase = useAppSelector((state) => state.leadBuilder.researchRunPhase);
  const website = useAppSelector((state) => state.currentLead.website);
  const websiteUrls = useAppSelector((state) => state.currentLead.website_urls);

  const canRun = leadHasWebsiteForCrawl({ website, websiteUrls });

  const isBusy = phase !== 'idle';
  const showSpinner = isBusy && phase === 'website';

  const openConfirmModal = () => {
    if (!canRun || isBusy) return;
    dispatch(LeadBuilderActions.setWebsiteResearchConfirmModalOpen(true));
  };

  const noWebsiteTitle =
    'Set a website on this lead (or run Google search first) before crawling';

  if (variant === 'icon') {
    return (
      <>
        <button
          type="button"
          className={styles.iconTrigger}
          disabled={isBusy || !canRun}
          title={!canRun ? noWebsiteTitle : 'Run website research (crawl + AI summary)'}
          aria-label="Run website research"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            openConfirmModal();
          }}
        >
          {showSpinner ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" aria-hidden />
          )}
        </button>
        <WebsiteResearchConfirmationModal />
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        className={styles.runButton}
        disabled={isBusy || !canRun}
        title={!canRun ? noWebsiteTitle : undefined}
        onClick={openConfirmModal}
      >
        {showSpinner ? (
          <>
            <Loader2 className={styles.buttonSpinner} />
            Website crawl…
          </>
        ) : (
          'Run website research'
        )}
      </button>
      <WebsiteResearchConfirmationModal />
    </>
  );
};

const styles = {
  runButton: `
    inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800
    hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed
  `,
  iconTrigger: `
    inline-flex shrink-0 items-center justify-center rounded p-0.5 text-gray-500
    hover:text-[#FF7C1E] hover:bg-orange-50 disabled:opacity-40 disabled:cursor-not-allowed
  `,
  buttonSpinner: `h-4 w-4 animate-spin`,
};
