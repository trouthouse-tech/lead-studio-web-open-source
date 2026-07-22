'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { CurrentLeadContactActions } from '@/store/current';

export const CreateLeadContactNameInput = () => {
  const dispatch = useAppDispatch();
  const currentLeadContact = useAppSelector((state) => state.currentLeadContact);
  const name = currentLeadContact.name;

  return (
    <label className={styles.label}>
      Name
      <input
        type="text"
        value={name}
        onChange={(e) =>
          dispatch(
            CurrentLeadContactActions.updateCurrentLeadContact({
              name: e.target.value,
            })
          )
        }
        className={styles.input}
        autoComplete="name"
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
