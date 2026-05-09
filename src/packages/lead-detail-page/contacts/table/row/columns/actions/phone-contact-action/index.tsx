'use client';

import { useContactRowActionsContext } from '../contact-row-actions-context';
import { contactRowColumnStyles as styles } from '../../styles';

export const PhoneContactAction = () => {
  const { contact } = useContactRowActionsContext();

  return (
    <button type="button" className={styles.menuItem} disabled>
      {contact.phone ? `Phone: ${contact.phone}` : 'Phone: not set'}
    </button>
  );
};
