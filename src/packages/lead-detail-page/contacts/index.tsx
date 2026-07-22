'use client';

import { useMemo, useState } from 'react';
import { Users } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { CurrentLeadContactActions } from '@/store/current';
import { LeadContactsTable } from './table';
import { LeadContactCreateModal } from './create';

export const Contacts = () => {
  const currentLead = useAppSelector((state) => state.currentLead);
  const leadContactsRecord = useAppSelector((state) => state.leadContacts);

  const leadId = currentLead.id;

  const contacts = useMemo(() => {
    return Object.values(leadContactsRecord)
      .filter((contact) => contact.lead_id === leadId)
      .sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
  }, [leadContactsRecord, leadId]);

  return (
    <section className={styles.panel} aria-labelledby="lead-detail-contacts-heading">
      <div className={styles.sectionHeader}>
        <h2 id="lead-detail-contacts-heading" className={styles.sectionTitle}>
          Contacts
        </h2>
        <div className={styles.sectionAction}>
          <ContactsAddButton />
        </div>
      </div>
      {contacts.length === 0 ? (
        <div className={styles.emptyState}>
          <Users className={styles.emptyIcon} />
          <p className={styles.emptyTitle}>No contacts yet</p>
          <p className={styles.emptyHint}>
            Add your first contact for this lead to start outreach.
          </p>
        </div>
      ) : (
        <>
          <div className={styles.tableViewport}>
            <LeadContactsTable />
          </div>
        </>
      )}
    </section>
  );
};

const styles = {
  panel: `space-y-3`,
  sectionHeader: `flex flex-wrap items-center justify-between gap-3`,
  sectionTitle: `text-sm font-semibold text-gray-900 uppercase tracking-wider`,
  sectionAction: `shrink-0`,
  addButton: `
    rounded-md border-none bg-blue-600 px-3 py-1.5 text-xs font-medium text-white
    transition-colors hover:bg-blue-700 cursor-pointer
  `,
  emptyState: `
    flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-200 py-10
  `,
  emptyIcon: `
    h-8 w-8 text-gray-300
  `,
  emptyTitle: `
    text-sm font-medium text-gray-900
  `,
  emptyHint: `
    text-sm text-gray-500
  `,
  tableViewport: `
    overflow-visible
  `,
};

export const ContactsAddButton = () => {
  const dispatch = useAppDispatch();
  const currentLead = useAppSelector((state) => state.currentLead);
  const leadId = currentLead.id;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    dispatch(CurrentLeadContactActions.reset());
  };

  const handleCreateContact = () => {
    dispatch(CurrentLeadContactActions.reset());
    dispatch(
      CurrentLeadContactActions.updateCurrentLeadContact({
        lead_id: leadId,
        id: '',
        name: '',
        email: null,
        phone: null,
        role: null,
        notes: null,
        status: 'not_contacted',
        created_at: '',
        updated_at: '',
      })
    );
    setIsModalOpen(true);
  };

  return (
    <>
      <button type="button" onClick={handleCreateContact} className={styles.addButton}>
        Add Contact
      </button>
      <LeadContactCreateModal
        leadId={leadId}
        isOpen={isModalOpen}
        isEditing={false}
        onClose={handleCloseModal}
      />
    </>
  );
};
