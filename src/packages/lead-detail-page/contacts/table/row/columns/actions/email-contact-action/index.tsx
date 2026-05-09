'use client';

import type { MouseEvent } from 'react';
import { useContactRowActionsContext } from '../contact-row-actions-context';
import { contactRowColumnStyles as styles } from '../../styles';

export const EmailContactAction = () => {
  const { contact, closeMenu, handleEmailContact } = useContactRowActionsContext();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    closeMenu();
    handleEmailContact();
  };

  return (
    <button
      type="button"
      className={styles.menuItem}
      onClick={handleClick}
      disabled={!contact.email}
    >
      {contact.email ? `Email: ${contact.email}` : 'Email: not set'}
    </button>
  );
};
