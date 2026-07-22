'use client';

import type { MouseEvent } from 'react';
import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { LeadBuilderActions } from '@/store/builders';
import { FindLeads } from '@/packages/find-leads';

/**
 * Modal shell for Google Maps lead search on the commercial leads list.
 */
export const FindLeadsModal = () => {
  const dispatch = useAppDispatch();
  const leadBuilder = useAppSelector((state) => state.leadBuilder);
  const open = leadBuilder.isFindLeadsModalOpen;

  const close = useCallback(() => {
    dispatch(LeadBuilderActions.setFindLeadsModalOpen(false));
  }, [dispatch]);

  const handleBackdropMouseDown = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        close();
      }
    },
    [close]
  );

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, close]);

  if (!open) {
    return null;
  }

  return (
    <div
      className={styles.backdrop}
      role="presentation"
      onMouseDown={handleBackdropMouseDown}
    >
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="find-leads-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 id="find-leads-modal-title" className={styles.title}>
            Find leads
          </h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={close}
            aria-label="Close find leads"
          >
            <span aria-hidden>✕</span>
          </button>
        </div>
        <div className={styles.body}>
          <FindLeads />
        </div>
      </div>
    </div>
  );
};

const styles = {
  backdrop: `
    fixed inset-0 z-50 flex items-start justify-center overflow-y-auto
    bg-black/40 px-3 py-8 sm:py-12
  `,
  dialog: `
    w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl border border-gray-200
    bg-white shadow-xl p-4 sm:p-5
  `,
  header: `flex items-center justify-between gap-3 mb-4`,
  title: `text-lg font-semibold text-gray-900`,
  closeButton: `
    flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-200
    bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 cursor-pointer text-sm
  `,
  body: `w-full`,
};
