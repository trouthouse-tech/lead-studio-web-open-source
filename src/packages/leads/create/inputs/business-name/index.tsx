'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { CurrentLeadActions } from '@/store/current';

export const CreateLeadBusinessNameInput = () => {
  const dispatch = useAppDispatch();
  const businessName = useAppSelector(
    (state) => state.currentLead.business_name ?? ''
  );

  return (
    <label className={styles.label}>
      Business name *
      <input
        type="text"
        value={businessName}
        onChange={(e) =>
          dispatch(
            CurrentLeadActions.updateCurrentLead({ business_name: e.target.value })
          )
        }
        className={styles.input}
        autoComplete="organization"
        required
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
