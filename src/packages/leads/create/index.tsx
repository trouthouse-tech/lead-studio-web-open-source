'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { LeadBuilderActions } from '@/store/builders';
import { CurrentLeadActions, CurrentLeadContactActions } from '@/store/current';
import { createManualLeadThunk } from '@/store/thunks/leads';
import {
  CreateLeadBusinessNameInput,
  CreateLeadAddressInput,
  CreateLeadWebsiteInput,
  CreateLeadContactNameInput,
  CreateLeadContactEmailInput,
  CreateLeadContactPhoneInput,
} from './inputs';

export const CreateLeadModal = () => {
  const dispatch = useAppDispatch();
  const leadBuilder = useAppSelector((state) => state.leadBuilder);
  const isOpen = leadBuilder.isAddLeadModalOpen;
  const currentLead = useAppSelector((state) => state.currentLead);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    dispatch(LeadBuilderActions.setAddLeadModalOpen(false));
    dispatch(CurrentLeadActions.reset());
    dispatch(CurrentLeadContactActions.reset());
    setError(null);
    setIsSubmitting(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!currentLead.business_name?.trim()) {
      setError('Business name is required.');
      return;
    }
    setIsSubmitting(true);
    const status = await dispatch(createManualLeadThunk());
    setIsSubmitting(false);
    if (status === 200) {
      close();
      return;
    }
    setError('Could not create lead. Check your connection and try again.');
  };

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-lead-title"
      onClick={(ev) => {
        if (ev.target === ev.currentTarget) close();
      }}
    >
      <div className={styles.modal}>
        <h2 id="add-lead-title" className={styles.title}>
          Add lead
        </h2>
        <p className={styles.subtitle}>Enter business and primary contact details.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Business</legend>
            <CreateLeadBusinessNameInput />
            <CreateLeadAddressInput />
            <CreateLeadWebsiteInput />
          </fieldset>

          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Contact</legend>
            <CreateLeadContactNameInput />
            <CreateLeadContactEmailInput />
            <CreateLeadContactPhoneInput />
          </fieldset>

          {error ? <p className={styles.error}>{error}</p> : null}

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={close}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : 'Create lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: `
    fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4
  `,
  modal: `
    max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-xl
  `,
  title: `text-lg font-semibold text-gray-900`,
  subtitle: `mt-1 text-sm text-gray-600`,
  form: `mt-4 space-y-4`,
  fieldset: `space-y-3 rounded-md border border-gray-200 p-3`,
  legend: `px-1 text-xs font-semibold uppercase tracking-wide text-gray-500`,
  error: `text-sm text-red-600`,
  actions: `flex justify-end gap-2 pt-2`,
  cancelButton: `
    rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700
    hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50
  `,
  submitButton: `
    rounded-md border border-[#FF7C1E] bg-[#FF7C1E] px-4 py-2 text-sm font-medium text-white
    hover:bg-[#e66b10] disabled:cursor-not-allowed disabled:opacity-50
  `,
};
