'use client';

import type { MouseEvent } from 'react';
import { useContactRowActionsContext } from '../contact-row-actions-context';
import { contactRowColumnStyles as styles } from '../../styles';

export const EditContactAction = () => {
  const { closeMenu, handleEditContact } = useContactRowActionsContext();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    closeMenu();
    handleEditContact();
  };

  return (
    <button type="button" className={styles.menuItem} onClick={handleClick}>
      Edit
    </button>
  );
};
