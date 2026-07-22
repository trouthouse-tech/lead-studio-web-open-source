'use client';

import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { LeadBuilderActions } from '@/store/builders/leadBuilder';
import { runLeadOnlineProfilesResearchThunk } from '@/store/thunks/leads';
import { leadHasWebsiteForCrawl } from '../lead-has-website-for-crawl';

const MODAL_TITLE_ID = 'online-profiles-research-confirm-title';

/**
 * Confirms site-pages discovery + website crawl/AI before starting the run.
 * Open state: {@link LeadBuilderActions.setWebsiteResearchConfirmModalOpen}.
 */
export const WebsiteResearchConfirmationModal = () => {
  const dispatch = useAppDispatch();
  const leadBuilder = useAppSelector((state) => state.leadBuilder);
  const isOpen = leadBuilder.isWebsiteResearchConfirmModalOpen;
  const phase = leadBuilder.researchRunPhase;

  const currentLead = useAppSelector((state) => state.currentLead);
  const leadId = currentLead.id;
  const website = currentLead.website;
  const websiteUrls = currentLead.website_urls;

  if (!isOpen) return null;

  const canRun = leadHasWebsiteForCrawl({ website, websiteUrls });

  const close = () => {
    dispatch(LeadBuilderActions.setWebsiteResearchConfirmModalOpen(false));
  };

  const handleConfirm = () => {
    close();
    void (async () => {
      if (!leadId || phase !== 'idle' || !canRun) return;

      const status = await dispatch(runLeadOnlineProfilesResearchThunk());
      if (status !== 200) {
        toast.error('Research failed');
        return;
      }

      toast.success('Research finished');
    })();
  };

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby={MODAL_TITLE_ID}
    >
      <div className={styles.modal}>
        <h3 id={MODAL_TITLE_ID} className={styles.title}>
          Run research?
        </h3>
        <div className={styles.body}>
          <p className={styles.p}>
            The server will discover extra site pages from this lead&apos;s website (and Facebook /
            Instagram links in the nav or footer when present), crawl those pages plus the primary
            site, and save a website scrape run.
          </p>
          <p className={styles.p}>
            If the crawl succeeds, AI fills <strong>at a glance</strong> on the lead and may add
            contacts found on the site. Then it searches Facebook (and scrapes the page for email /
            phone) and Instagram. This can take a few minutes.
          </p>
        </div>
        <div className={styles.buttons}>
          <button type="button" className={styles.cancel} onClick={close}>
            Cancel
          </button>
          <button type="button" className={styles.confirm} onClick={handleConfirm}>
            Start research
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: `
    fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4
  `,
  modal: `bg-white rounded-lg shadow-xl max-w-lg w-full p-6`,
  title: `text-lg font-semibold text-gray-900 mb-3`,
  body: `space-y-3 mb-6`,
  p: `text-sm text-gray-700 leading-relaxed`,
  buttons: `flex justify-end gap-2`,
  cancel: `
    px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md
    hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
  `,
  confirm: `
    px-4 py-2 text-sm font-medium text-white bg-[#FF7C1E] rounded-md border-none
    hover:bg-[#e66b10] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
  `,
};
