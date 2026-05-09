'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { CurrentLeadContactActions } from '@/store/current';

export const ContactPhoneInput = () => {
  const dispatch = useAppDispatch();
  const phone = useAppSelector((state) => state.currentLeadContact.phone ?? '');

  return (
    <label className={styles.fieldGroup}>
      <span className={styles.label}>Phone</span>
      <input
        type="tel"
        value={phone}
        onChange={(event) =>
          dispatch(
            CurrentLeadContactActions.updateCurrentLeadContact({
              phone: event.target.value,
            })
          )
        }
        className={styles.input}
        placeholder="Phone number"
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
