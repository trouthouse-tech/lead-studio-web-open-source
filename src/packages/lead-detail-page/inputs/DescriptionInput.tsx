'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { CurrentLeadActions } from '@/store/current';

export const DescriptionInput = () => {
  const dispatch = useAppDispatch();
  const currentLead = useAppSelector((state) => state.currentLead);

  return (
    <label className={styles.fieldGroupFull}>
      <span className={styles.label}>Description</span>
      <textarea
        value={currentLead?.description ?? ''}
        onChange={(e) =>
          dispatch(
            CurrentLeadActions.updateCurrentLead({
              description: e.target.value || null,
            })
          )
        }
        className={styles.textarea}
        rows={3}
        placeholder="Lead description"
      />
    </label>
  );
};

const styles = {
  fieldGroupFull: `flex flex-col gap-1`,
  label: `text-xs font-medium text-gray-600`,
  textarea: `
    px-2.5 py-1.5 text-sm border border-gray-300 rounded resize-y
    focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none
  `,
};
