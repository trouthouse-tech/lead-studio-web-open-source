'use client';

import { AddToCallLogAction } from '../add-to-call-log-action';
import { useContactRowActionsContext } from '../contact-row-actions-context';
import { DeleteContactAction } from '../delete-contact-action';
import { EditContactAction } from '../edit-contact-action';
import { EmailContactAction } from '../email-contact-action';
import { PhoneContactAction } from '../phone-contact-action';
import { contactRowColumnStyles as styles } from '../../styles';

export const FloatingMenu = () => {
  const { isMenuOpen, menuPosition } = useContactRowActionsContext();

  if (!isMenuOpen || !menuPosition) {
    return null;
  }

  return (
    <div
      className={styles.menu}
      style={{ top: menuPosition.top, left: menuPosition.left }}
      onClick={(event) => event.stopPropagation()}
    >
      <AddToCallLogAction />
      <EmailContactAction />
      <PhoneContactAction />
      <EditContactAction />
      <DeleteContactAction />
    </div>
  );
};
