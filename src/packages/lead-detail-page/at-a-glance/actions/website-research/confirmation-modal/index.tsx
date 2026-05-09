'use client';

import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { LeadBuilderActions } from '@/store/builders/leadBuilder';
import {
  loadLeadWebsiteScrapeLatestSummaryThunk,
  refreshCurrentLeadThunk,
  runLeadWebsiteResearchThunk,
} from '@/store/thunks/leads';
import { getLeadContactsByLeadIdThunk } from '@/store/thunks/lead-contacts';
import { leadHasWebsiteForCrawl } from '../lead-has-website-for-crawl';

const MODAL_TITLE_ID = 'website-research-confirm-title';

/**
 * Explains server-side website crawl + description AI before starting the run.
 * Open state: {@link LeadBuilderActions.setWebsiteResearchConfirmModalOpen}.
 */
export const WebsiteResearchConfirmationModal = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(
    (state) => state.leadBuilder.isWebsiteResearchConfirmModalOpen
  );
  const phase = useAppSelector((state) => state.leadBuilder.researchRunPhase);
  const leadId = useAppSelector((state) => state.currentLead.id);
  const website = useAppSelector((state) => state.currentLead.website);
  const websiteUrls = useAppSelector((state) => state.currentLead.website_urls);
  if (!isOpen) return null;

  const canRun = leadHasWebsiteForCrawl({ website, websiteUrls });

  const close = () => {
    dispatch(LeadBuilderActions.setWebsiteResearchConfirmModalOpen(false));
  };

  const handleConfirm = () => {
    close();
    void (async () => {
      if (!leadId || phase !== 'idle' || !canRun) return;
      dispatch(LeadBuilderActions.setResearchRunPhase('website'));
      try {
        const status = await dispatch(runLeadWebsiteResearchThunk());
        if (status !== 200) {
          toast.error('Website research failed');
          return;
        }

        const refreshStatus = await dispatch(refreshCurrentLeadThunk(leadId));
        if (refreshStatus !== 200) {
          toast.error('Website research finished but refreshing the lead failed');
          return;
        }

        await dispatch(getLeadContactsByLeadIdThunk(leadId));

        await dispatch(loadLeadWebsiteScrapeLatestSummaryThunk());
        toast.success('Website research finished');
      } finally {
        dispatch(LeadBuilderActions.setResearchRunPhase('idle'));
      }
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
          Run website research?
        </h3>
        <div className={styles.body}>
          <p className={styles.p}>
            The server will visit this lead&apos;s primary website and any extra URLs stored on the
            lead (for example from Google search), capture page text, and save a website scrape run.
          </p>
          <p className={styles.p}>
            If the crawl succeeds, an AI step may rewrite the lead&apos;s <strong>description</strong>{' '}
            from that content. This can take a minute.
          </p>
        </div>
        <div className={styles.buttons}>
          <button type="button" className={styles.cancel} onClick={close}>
            Cancel
          </button>
          <button type="button" className={styles.confirm} onClick={handleConfirm}>
            Start website research
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
