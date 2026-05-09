'use client';

import { MoreHorizontal } from 'lucide-react';
import { useContactRowActionsContext } from '../contact-row-actions-context';
import { contactRowColumnStyles as styles } from '../../styles';

export const MenuTrigger = () => {
  const { handleToggleMenu } = useContactRowActionsContext();

  return (
    <button
      type="button"
      onClick={handleToggleMenu}
      className={styles.menuTrigger}
      title="Open actions"
    >
      <MoreHorizontal className={styles.menuIcon} />
    </button>
  );
};
