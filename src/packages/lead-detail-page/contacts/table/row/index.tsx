'use client';

import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logLeadContactActivityThunk } from '@/store/thunks';
import { openLeadContactDetailThunk } from '@/store/thunks/lead-contacts';
import { LEAD_CONTACT_DETAIL_PATH } from '@/config/routes';
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
  const currentLead = useAppSelector((state) => state.currentLead);
  const leadId = currentLead.id;
  const leadBusinessName = currentLead.business_name || 'Unknown customer';
  const router = useRouter();

  const handleRowClick = () => {
    void dispatch(
      logLeadContactActivityThunk({
        leadContactId: contact.id,
        leadId,
        customerName: leadBusinessName,
      }),
    );
    void dispatch(openLeadContactDetailThunk(leadId, contact.id)).then((status) => {
      if (status === 200) {
        router.push(LEAD_CONTACT_DETAIL_PATH);
      }
    });
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
