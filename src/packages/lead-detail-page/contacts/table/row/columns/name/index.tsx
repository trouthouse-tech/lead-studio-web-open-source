'use client';

import type { LeadContact } from '@/model/lead-contact';
import { contactRowColumnStyles as styles } from '../styles';

type NameColumnProps = {
  contact: LeadContact;
};

export const NameColumn = (props: NameColumnProps) => {
  const { contact } = props;

  const contactMetaParts = [contact.email, contact.phone].filter(
    (value): value is string => Boolean(value && value.trim())
  );
  const contactMetaLabel = contactMetaParts.join(' · ');

  return (
    <td className={styles.cell}>
      <div className={styles.nameCell}>
        <p className={styles.name}>{contact.name || 'Unnamed contact'}</p>
        {contactMetaLabel ? (
          <p className={styles.contactMeta} title={contactMetaLabel}>
            {contactMetaLabel}
          </p>
        ) : null}
      </div>
    </td>
  );
};
