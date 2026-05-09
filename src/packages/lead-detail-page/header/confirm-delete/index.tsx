'use client';

import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { LeadBuilderActions } from '@/store/builders';
import { CurrentLeadActions } from '@/store/current';
import { deleteLeadThunk } from '@/store/thunks/leads';

export const LeadDeleteConfirmModal = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const currentLead = useAppSelector((state) => state.currentLead);
  const isOpen = useAppSelector((state) => state.leadBuilder.isLeadDeleteConfirmModalOpen);
  const isDeleting = useAppSelector((state) => state.leadBuilder.isDeletingLead);

  if (!isOpen || !currentLead.id) {
    return null;
  }

  const leadDisplayName =
    currentLead.business_name || currentLead.name || 'this lead';

  const handleCancel = () => {
    dispatch(LeadBuilderActions.setLeadDeleteConfirmModalOpen(false));
  };

  const handleConfirm = async () => {
    if (isDeleting || !currentLead.id) return;
    dispatch(LeadBuilderActions.setIsDeletingLead(true));
    const result = await dispatch(deleteLeadThunk(currentLead.id));
    dispatch(LeadBuilderActions.setLeadDeleteConfirmModalOpen(false));
    if (result === 200) {
      dispatch(CurrentLeadActions.reset());
      router.push('/leads');
      return;
    }
    window.alert('Failed to delete lead. Please try again.');
  };

  return (
    <div className={styles.confirmOverlay}>
      <div className={styles.confirmModal}>
        <h3 className={styles.confirmTitle}>Delete Lead</h3>
        <p className={styles.confirmMessage}>
          Are you sure you want to delete <strong>{leadDisplayName}</strong>?
          This action cannot be undone.
        </p>
        <div className={styles.confirmButtons}>
          <button
            type="button"
            onClick={handleCancel}
            className={styles.confirmCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              void handleConfirm();
            }}
            className={styles.confirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  confirmOverlay: `
    fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4
  `,
  confirmModal: `bg-white rounded-lg shadow-xl max-w-md w-full p-6`,
  confirmTitle: `text-lg font-semibold text-gray-900 mb-2`,
  confirmMessage: `text-sm text-gray-700 mb-4`,
  confirmButtons: `flex justify-end gap-2`,
  confirmCancel: `
    px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded
    hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
    disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
  `,
  confirmDelete: `
    px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700
    transition-colors focus:outline-none focus:ring-2 focus:ring-red-500
    disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer
  `,
};
