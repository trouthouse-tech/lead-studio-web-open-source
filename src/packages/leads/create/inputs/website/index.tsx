'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { CurrentLeadActions } from '@/store/current';

export const CreateLeadWebsiteInput = () => {
  const dispatch = useAppDispatch();
  const currentLead = useAppSelector((state) => state.currentLead);
  const website = currentLead.website ?? '';

  return (
    <label className={styles.label}>
      Website
      <input
        type="url"
        value={website}
        onChange={(e) =>
          dispatch(
            CurrentLeadActions.updateCurrentLead({
              website: e.target.value.trim() === '' ? null : e.target.value,
            })
          )
        }
        className={styles.input}
        placeholder="https://"
        autoComplete="url"
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
