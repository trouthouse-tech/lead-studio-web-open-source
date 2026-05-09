'use client';

import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logLeadContactActivityThunk } from '@/store/thunks';
import { buildLeadContactDetailHref } from '@/config/routes';
import type { LeadContact } from '@/model/lead-contact';
import {
  ActionsColumn,
  NameColumn,
  RoleColumn,
  StatusColumn,
  contactRowColumnStyles as styles,
} from './columns';

type ContactsTableRowProps = {
  contact: LeadContact;
};

export const ContactsTableRow = (props: ContactsTableRowProps) => {
  const { contact } = props;
  const dispatch = useAppDispatch();
  const leadId = useAppSelector((state) => state.currentLead.id);
  const leadBusinessName = useAppSelector(
    (state) => state.currentLead.business_name || 'Unknown customer'
  );
  const router = useRouter();

  const handleRowClick = () => {
    void dispatch(
      logLeadContactActivityThunk({
        leadContactId: contact.id,
        leadId,
        customerName: leadBusinessName,
      }),
    );
    router.push(buildLeadContactDetailHref(leadId, contact.id));
  };

  return (
    <tr className={styles.row} onClick={handleRowClick}>
      <NameColumn contact={contact} />
      <RoleColumn contact={contact} />
      <StatusColumn contact={contact} />
      <ActionsColumn contact={contact} />
    </tr>
  );
};
