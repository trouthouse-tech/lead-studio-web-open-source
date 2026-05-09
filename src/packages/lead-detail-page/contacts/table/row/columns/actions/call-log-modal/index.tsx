'use client';

import { useContactRowActionsContext } from '../contact-row-actions-context';
import { contactRowColumnStyles as styles } from '../../styles';

export const ContactCallLogModal = () => {
  const {
    contact,
    callLogNotes,
    setCallLogNotes,
    isSavingCallLog,
    handleCloseCallLogModal,
    handleSaveCallLog,
  } = useContactRowActionsContext();

  return (
    <div
      className={styles.callLogModalOverlay}
      onClick={(event) => {
        event.stopPropagation();
        handleCloseCallLogModal();
      }}
    >
      <div
        className={styles.callLogModal}
        onClick={(event) => event.stopPropagation()}
      >
        <h3 className={styles.callLogModalTitle}>Add to call log</h3>
        <p className={styles.callLogModalSubtitle}>
          Save notes for {contact.name || contact.email || 'this contact'}.
        </p>
        <textarea
          value={callLogNotes}
          onChange={(event) => setCallLogNotes(event.target.value)}
          className={styles.callLogNotesInput}
          placeholder="Add notes for your next call..."
          rows={5}
        />
        <div className={styles.callLogModalActions}>
          <button
            type="button"
            className={styles.callLogCancelButton}
            onClick={handleCloseCallLogModal}
            disabled={isSavingCallLog}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.callLogSaveButton}
            onClick={() => void handleSaveCallLog()}
            disabled={isSavingCallLog}
          >
            {isSavingCallLog ? 'Saving...' : 'Add to call log'}
          </button>
        </div>
      </div>
    </div>
  );
};
