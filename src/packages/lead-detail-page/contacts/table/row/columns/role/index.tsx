'use client';

import type { LeadContact } from '@/model/lead-contact';
import { contactRowColumnStyles as styles } from '../styles';

type RoleColumnProps = {
  contact: LeadContact;
};

export const RoleColumn = (props: RoleColumnProps) => {
  const { contact } = props;

  return <td className={styles.cellMuted}>{contact.role || 'No title'}</td>;
};
