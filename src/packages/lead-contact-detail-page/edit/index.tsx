'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { LeadContactBuilderActions } from '@/store/builders';
import { ContactEditForm } from '../components/ContactEditForm';

export const LeadContactEditModal = () => {
  const dispatch = useAppDispatch();
  const leadContactBuilder = useAppSelector((state) => state.leadContactBuilder);
  const isEditing = leadContactBuilder.isEditing;

  if (!isEditing) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Edit contact</h2>
          <button
            type="button"
            onClick={() => dispatch(LeadContactBuilderActions.setEditing(false))}
            className={styles.closeButton}
          >
            Close
          </button>
        </div>
        <ContactEditForm />
      </div>
    </div>
  );
};

const styles = {
  overlay: `
    fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4
  `,
  modal: `
    w-full max-w-2xl rounded-xl border border-gray-200 bg-white p-5 shadow-xl
  `,
  header: `
    mb-4 flex items-center justify-between
  `,
  title: `
    text-lg font-semibold text-gray-900
  `,
  closeButton: `
    rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700
    hover:bg-gray-50 cursor-pointer
  `,
};
