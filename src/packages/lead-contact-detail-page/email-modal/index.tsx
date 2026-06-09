'use client';

import { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { LeadContactEmailBuilderActions } from '@/store/builders';
import { CurrentLeadContactEmailActions } from '@/store/current';
import { LeadContactInfoPanel } from './LeadContactInfoPanel';
import { EmailEditorPanel } from './EmailEditorPanel';
import { SentEmailsPanel } from './SentEmailsPanel';
import { SaveToast } from './components/SaveToast';

export const LeadContactEmailModal = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(
    (s) => s.leadContactEmailBuilder.isEmailModalOpen
  );

  const handleClose = useCallback(() => {
    dispatch(LeadContactEmailBuilderActions.closeEmailModal());
    dispatch(CurrentLeadContactEmailActions.reset());
  }, [dispatch]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', onKey);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h1 className={styles.title}>Compose email</h1>
          <button
            type="button"
            onClick={handleClose}
            className={styles.close}
            aria-label="Close"
          >
            <X className={styles.closeIcon} />
          </button>
        </div>
        <LeadContactInfoPanel />
        <div className={styles.columns}>
          <div className={styles.composeColumn}>
            <h2 className={styles.columnTitle}>Current email</h2>
            <EmailEditorPanel />
          </div>
          <div className={styles.historyColumn}>
            <h2 className={styles.columnTitle}>Previous emails</h2>
            <SentEmailsPanel />
          </div>
        </div>
      </div>
      <SaveToast />
    </div>
  );
};

const styles = {
  overlay: `
    fixed inset-0 z-50 flex flex-col bg-white
  `,
  modal: `
    flex flex-col h-full w-full overflow-hidden
  `,
  header: `
    flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0
  `,
  title: `text-lg font-semibold text-gray-900`,
  close: `
    p-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100
    border-none bg-transparent cursor-pointer
  `,
  closeIcon: `h-5 w-5`,
  columns: `
    flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200
  `,
  composeColumn: `
    flex flex-col min-h-0 min-w-0 overflow-hidden
  `,
  historyColumn: `
    flex flex-col min-h-0 min-w-0 overflow-hidden bg-slate-50/50
  `,
  columnTitle: `
    shrink-0 px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide
    border-b border-gray-100 bg-white
  `,
};
