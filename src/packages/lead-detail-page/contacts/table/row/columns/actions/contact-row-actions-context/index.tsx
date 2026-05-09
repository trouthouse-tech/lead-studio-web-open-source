'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createToCallLogThunk } from '@/store/thunks/to-call-log';
import { deleteLeadContactThunk, updateLeadContactThunk } from '@/store/thunks/lead-contacts';
import { updateLeadThunk } from '@/store/thunks/leads';
import { CurrentLeadContactActions, CurrentLeadContactEmailActions } from '@/store/current';
import { LeadDetailEmailFabActions } from '@/store/builders';
import type { LeadContact } from '@/model/lead-contact';

export type ContactRowActionsContextValue = {
  contact: LeadContact;
  leadId: string;
  isMenuOpen: boolean;
  menuPosition: { top: number; left: number } | null;
  closeMenu: () => void;
  handleToggleMenu: (event: MouseEvent<HTMLButtonElement>) => void;
  handleEmailContact: () => void;
  handleEditContact: () => void;
  handleDeleteContact: () => Promise<void>;
  handleOpenCallLogModal: () => void;
  handleCloseCallLogModal: () => void;
  handleSaveCallLog: () => Promise<void>;
  handleCloseEditModal: () => void;
  isEditModalOpen: boolean;
  isCallLogModalOpen: boolean;
  callLogNotes: string;
  setCallLogNotes: (value: string) => void;
  isSavingCallLog: boolean;
};

const ContactRowActionsContext = createContext<ContactRowActionsContextValue | null>(
  null,
);

export const useContactRowActionsContext = (): ContactRowActionsContextValue => {
  const value = useContext(ContactRowActionsContext);
  if (!value) {
    throw new Error('useContactRowActionsContext must be used within ContactRowActionsProvider');
  }
  return value;
};

type ContactRowActionsProviderProps = {
  contact: LeadContact;
  children: ReactNode;
};

export const ContactRowActionsProvider = (props: ContactRowActionsProviderProps) => {
  const { contact, children } = props;
  const dispatch = useAppDispatch();
  const leadId = useAppSelector((state) => state.currentLead.id);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCallLogModalOpen, setIsCallLogModalOpen] = useState(false);
  const [callLogNotes, setCallLogNotes] = useState('');
  const [isSavingCallLog, setIsSavingCallLog] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    setMenuPosition(null);
  }, []);

  const handleEmailContact = useCallback(() => {
    if (!contact.email || !contact.id || !leadId) return;
    dispatch(CurrentLeadContactActions.setLeadContact(contact));
    dispatch(CurrentLeadContactEmailActions.reset());
    dispatch(
      CurrentLeadContactEmailActions.updateFields({
        lead_id: leadId,
        lead_contact_id: contact.id,
      }),
    );
    dispatch(LeadDetailEmailFabActions.expand());
  }, [contact, dispatch, leadId]);

  const handleDeleteContact = useCallback(async () => {
    if (!contact.id) return;
    const shouldDelete = window.confirm(`Delete contact "${contact.name}"?`);
    if (!shouldDelete) return;
    await dispatch(deleteLeadContactThunk(contact.id));
  }, [contact.id, contact.name, dispatch]);

  const handleEditContact = useCallback(() => {
    dispatch(CurrentLeadContactActions.setLeadContact(contact));
    setIsEditModalOpen(true);
  }, [contact, dispatch]);

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    dispatch(CurrentLeadContactActions.reset());
  }, [dispatch]);

  const handleOpenCallLogModal = useCallback(() => {
    setCallLogNotes('');
    setIsCallLogModalOpen(true);
  }, []);

  const handleCloseCallLogModal = useCallback(() => {
    setIsCallLogModalOpen(false);
    setCallLogNotes('');
    setIsSavingCallLog(false);
  }, []);

  const handleSaveCallLog = useCallback(async () => {
    const notes = callLogNotes.trim();
    if (!notes) {
      alert('Please add notes before saving.');
      return;
    }
    if (!leadId || !contact.id) return;

    setIsSavingCallLog(true);
    const result = await dispatch(
      createToCallLogThunk({
        lead_id: leadId,
        lead_contact_id: contact.id,
        notes,
        call_status: 'queued',
      }),
    );
    setIsSavingCallLog(false);

    if (!result.ok) {
      alert(result.error || 'Failed to add to call log');
      return;
    }

    await dispatch(updateLeadContactThunk(contact.id, { status: 'in_call_log' }));
    if (leadId) {
      await dispatch(updateLeadThunk(leadId, { status: 'in_call_log' }));
    }

    handleCloseCallLogModal();
  }, [callLogNotes, contact.id, dispatch, handleCloseCallLogModal, leadId]);

  const handleToggleMenu = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();

      if (isMenuOpen) {
        closeMenu();
        return;
      }

      const rect = event.currentTarget.getBoundingClientRect();
      const menuWidth = 240;
      const menuHeight = 172;
      const viewportPadding = 8;

      let left = rect.right - menuWidth;
      if (left < viewportPadding) {
        left = viewportPadding;
      }

      let top = rect.bottom + 6;
      if (window.innerHeight - top < menuHeight) {
        top = rect.top - menuHeight - 6;
      }

      if (top < viewportPadding) {
        top = viewportPadding;
      }

      setMenuPosition({ top, left });
      setIsMenuOpen(true);
    },
    [closeMenu, isMenuOpen],
  );

  const value = useMemo(
    (): ContactRowActionsContextValue => ({
      contact,
      leadId,
      isMenuOpen,
      menuPosition,
      closeMenu,
      handleToggleMenu,
      handleEmailContact,
      handleEditContact,
      handleDeleteContact,
      handleOpenCallLogModal,
      handleCloseCallLogModal,
      handleSaveCallLog,
      handleCloseEditModal,
      isEditModalOpen,
      isCallLogModalOpen,
      callLogNotes,
      setCallLogNotes,
      isSavingCallLog,
    }),
    [
      contact,
      leadId,
      isMenuOpen,
      menuPosition,
      closeMenu,
      handleToggleMenu,
      handleEmailContact,
      handleEditContact,
      handleDeleteContact,
      handleOpenCallLogModal,
      handleCloseCallLogModal,
      handleSaveCallLog,
      handleCloseEditModal,
      isEditModalOpen,
      isCallLogModalOpen,
      callLogNotes,
      isSavingCallLog,
    ],
  );

  return (
    <ContactRowActionsContext.Provider value={value}>
      {children}
    </ContactRowActionsContext.Provider>
  );
};
