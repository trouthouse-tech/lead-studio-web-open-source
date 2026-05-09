'use client';

import { useAppDispatch } from '@/store/hooks';
import { openCreateLeadModalThunk } from '@/store/thunks/leads';

export const LeadsHeaderAddLeadButton = () => {
  const dispatch = useAppDispatch();

  return (
    <button
      type="button"
      className={styles.addButton}
      onClick={() => {
        void dispatch(openCreateLeadModalThunk());
      }}
    >
      Add lead
    </button>
  );
};

const styles = {
  addButton: `
    shrink-0 rounded-md border border-[#FF7C1E] bg-[#FF7C1E] px-2 py-1 text-xs font-medium text-white
    hover:bg-[#e66b10]
  `,
};
