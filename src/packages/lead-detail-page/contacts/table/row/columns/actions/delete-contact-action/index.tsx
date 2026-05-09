'use client';

import type { MouseEvent } from 'react';
import { useContactRowActionsContext } from '../contact-row-actions-context';
import { contactRowColumnStyles as styles } from '../../styles';

export const DeleteContactAction = () => {
  const { closeMenu, handleDeleteContact } = useContactRowActionsContext();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    closeMenu();
    void handleDeleteContact();
  };

  return (
    <button type="button" className={styles.menuItemDelete} onClick={handleClick}>
      Delete
    </button>
  );
};
