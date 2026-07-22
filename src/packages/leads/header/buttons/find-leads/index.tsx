'use client';

import { useAppDispatch } from '@/store/hooks';
import { LeadBuilderActions } from '@/store/builders';

/**
 * Opens the Find leads (Google Maps search) modal from the commercial leads toolbar.
 */
export const LeadsHeaderFindLeadsButton = () => {
  const dispatch = useAppDispatch();

  return (
    <button
      type="button"
      className={styles.findButton}
      onClick={() => {
        dispatch(LeadBuilderActions.setFindLeadsModalOpen(true));
      }}
    >
      Find leads
    </button>
  );
};

const styles = {
  findButton: `
    inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md border border-gray-300 bg-white
    px-2 py-1 text-xs font-medium text-gray-800
    hover:bg-gray-50
  `,
};
