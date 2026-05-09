'use client';

import type { LeadContact } from '@/model/lead-contact';
import { ContactActionsPortal } from './actions-portal';
import { ContactRowActionsProvider } from './contact-row-actions-context';
import { FloatingMenu } from './floating-menu';
import { MenuTrigger } from './menu-trigger';
import { contactRowColumnStyles as styles } from '../styles';

type ActionsColumnProps = {
  contact: LeadContact;
};

export const ActionsColumn = (props: ActionsColumnProps) => {
  const { contact } = props;

  return (
    <ContactRowActionsProvider contact={contact}>
      <>
        <td className={styles.actionsCell}>
          <div className={styles.menuWrap}>
            <MenuTrigger />
            <FloatingMenu />
          </div>
        </td>
        <ContactActionsPortal />
      </>
    </ContactRowActionsProvider>
  );
};
