'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { CurrentLeadActions } from '@/store/current';

export const FacebookUrlInput = () => {
  const dispatch = useAppDispatch();
  const currentLead = useAppSelector((state) => state.currentLead);

  return (
    <label className={styles.fieldGroup}>
      <span className={styles.label}>Facebook URL</span>
      <input
        type="text"
        value={currentLead?.facebook_url ?? ''}
        onChange={(e) =>
          dispatch(
            CurrentLeadActions.updateCurrentLead({
              facebook_url: e.target.value || null,
            })
          )
        }
        className={styles.input}
        placeholder="https://facebook.com/..."
      />
    </label>
  );
};

const styles = {
  fieldGroup: `flex flex-col gap-1`,
  label: `text-xs font-medium text-gray-600`,
  input: `
    px-2.5 py-1.5 text-sm border border-gray-300 rounded
    focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none
  `,
};
