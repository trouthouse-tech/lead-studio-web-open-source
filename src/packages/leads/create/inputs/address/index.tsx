'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { CurrentLeadActions } from '@/store/current';

export const CreateLeadAddressInput = () => {
  const dispatch = useAppDispatch();
  const address = useAppSelector((state) => state.currentLead.address ?? '');

  return (
    <label className={styles.label}>
      Address
      <input
        type="text"
        value={address}
        onChange={(e) =>
          dispatch(
            CurrentLeadActions.updateCurrentLead({
              address: e.target.value.trim() === '' ? null : e.target.value,
            })
          )
        }
        className={styles.input}
        autoComplete="street-address"
      />
    </label>
  );
};

const styles = {
  label: `flex flex-col gap-1 text-sm font-medium text-gray-700`,
  input: `
    w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-normal text-gray-900
    focus:border-[#FF7C1E] focus:outline-none focus:ring-2 focus:ring-[#FF7C1E]
  `,
};
