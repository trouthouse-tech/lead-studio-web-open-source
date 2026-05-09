'use client';

import { createPortal } from 'react-dom';
import { ContactCallLogModal } from '../call-log-modal';
import { useContactRowActionsContext } from '../contact-row-actions-context';
import { LeadContactCreateModal } from '../../../../../create';
import { contactRowColumnStyles as styles } from '../../styles';

export const ContactActionsPortal = () => {
  const {
    isMenuOpen,
    closeMenu,
    leadId,
    isEditModalOpen,
    handleCloseEditModal,
    isCallLogModalOpen,
  } = useContactRowActionsContext();

  const portalTarget =
    typeof window !== 'undefined' ? window.document.body : null;

  if (portalTarget == null) {
    return null;
  }

  return createPortal(
    <>
      {isMenuOpen ? (
        <button
          type="button"
          className={styles.backdrop}
          onClick={closeMenu}
          aria-label="Close contact actions menu"
        />
      ) : null}
      <LeadContactCreateModal
        leadId={leadId}
        isOpen={isEditModalOpen}
        isEditing
        onClose={handleCloseEditModal}
      />
      {isCallLogModalOpen ? <ContactCallLogModal /> : null}
    </>,
    portalTarget,
  );
};
