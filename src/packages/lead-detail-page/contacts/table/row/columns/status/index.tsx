'use client';

import { LEAD_CONTACT_STATUS_LABELS, type LeadContact } from '@/model/lead-contact';
import { contactRowColumnStyles as styles } from '../styles';

type StatusColumnProps = {
  contact: LeadContact;
};

export const StatusColumn = (props: StatusColumnProps) => {
  const { contact } = props;

  return (
    <td className={styles.cell}>
      <span className={styles.statusBadge}>
        {LEAD_CONTACT_STATUS_LABELS[contact.status]}
      </span>
    </td>
  );
};
