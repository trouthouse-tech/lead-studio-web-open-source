'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { CurrentLeadContactActions } from '@/store/current';

export const ContactNameInput = () => {
  const dispatch = useAppDispatch();
  const name = useAppSelector((state) => state.currentLeadContact.name ?? '');

  return (
    <label className={styles.fieldGroup}>
      <span className={styles.label}>Name</span>
      <input
        type="text"
        value={name}
        onChange={(event) =>
          dispatch(
            CurrentLeadContactActions.updateCurrentLeadContact({
              name: event.target.value,
            })
          )
        }
        className={styles.input}
        placeholder="Contact name"
      />
    </label>
  );
};

const styles = {
  fieldGroup: `
    flex flex-col gap-1
  `,
  label: `
    text-xs font-medium text-gray-600
  `,
  input: `
    rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900
    focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20
  `,
};
