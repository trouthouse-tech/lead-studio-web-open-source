'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  createLeadContactThunk,
  updateLeadContactThunk,
} from '@/store/thunks/lead-contacts';
import { CurrentLeadContactActions } from '@/store/current';
import { ContactEmailInput, ContactNameInput, ContactPhoneInput, ContactStatusInput } from './inputs';

type LeadContactCreateModalProps = {
  leadId: string;
  isOpen: boolean;
  isEditing: boolean;
  onClose: () => void;
};

export const LeadContactCreateModal = (props: LeadContactCreateModalProps) => {
  const { leadId, isOpen, isEditing, onClose } = props;
  const dispatch = useAppDispatch();
  const currentLeadContact = useAppSelector((state) => state.currentLeadContact);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    const name = currentLeadContact.name?.trim() ?? '';
    const email = currentLeadContact.email?.trim() ?? '';
    const phone = currentLeadContact.phone?.trim() ?? '';

    if (!name && !email && !phone) {
      alert('Please add at least name, email, or phone.');
      return;
    }

    setIsSaving(true);

    if (isEditing && currentLeadContact.id) {
      const result = await dispatch(
        updateLeadContactThunk(currentLeadContact.id, {
          name: name || 'Unknown',
          email: email || null,
          phone: phone || null,
          status: currentLeadContact.status,
        })
      );
      if (result === 200) {
        dispatch(CurrentLeadContactActions.reset());
        onClose();
      }
      setIsSaving(false);
      return;
    }

    const result = await dispatch(
      createLeadContactThunk({
        lead_id: leadId,
        name: name || 'Unknown',
        email: email || undefined,
        phone: phone || undefined,
        status: currentLeadContact.status,
      })
    );

    if (result === 200) {
      dispatch(CurrentLeadContactActions.reset());
      onClose();
    }

    setIsSaving(false);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3 className={styles.title}>
            {isEditing ? 'Edit contact' : 'Add contact'}
          </h3>
          <p className={styles.subtitle}>
            Save a contact for this lead and update outreach status.
          </p>
        </div>

        <div className={styles.content}>
          <ContactNameInput />
          <ContactPhoneInput />
          <ContactEmailInput />
          <ContactStatusInput />
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            onClick={onClose}
            className={styles.cancelButton}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className={styles.saveButton}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : isEditing ? 'Save changes' : 'Create contact'}
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
  modal: `
    w-full max-w-lg rounded-lg bg-white p-6 shadow-xl
  `,
  header: `
    mb-4
  `,
  title: `
    text-lg font-semibold text-gray-900
  `,
  subtitle: `
    mt-1 text-sm text-gray-500
  `,
  content: `
    space-y-4
  `,
  footer: `
    mt-6 flex justify-end gap-2
  `,
  cancelButton: `
    rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer
    transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60
  `,
  saveButton: `
    rounded-md border-none bg-blue-600 px-4 py-2 text-sm font-medium text-white cursor-pointer
    transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60
  `,
};
