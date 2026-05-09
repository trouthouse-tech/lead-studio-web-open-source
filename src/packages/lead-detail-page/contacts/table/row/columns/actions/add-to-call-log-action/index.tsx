'use client';

import type { MouseEvent } from 'react';
import { useContactRowActionsContext } from '../contact-row-actions-context';
import { contactRowColumnStyles as styles } from '../../styles';

export const AddToCallLogAction = () => {
  const { closeMenu, handleOpenCallLogModal } = useContactRowActionsContext();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    closeMenu();
    handleOpenCallLogModal();
  };

  return (
    <button type="button" className={styles.menuItem} onClick={handleClick}>
      Add to call log
    </button>
  );
};
