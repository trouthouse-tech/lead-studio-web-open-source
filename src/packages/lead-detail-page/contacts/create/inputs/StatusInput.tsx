'use client';

import {
  LEAD_CONTACT_STATUS_LABELS,
  LEAD_CONTACT_STATUS_ORDER,
  type LeadContactStatus,
} from '@/model/lead-contact';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { CurrentLeadContactActions } from '@/store/current';

const STATUS_OPTIONS = LEAD_CONTACT_STATUS_ORDER.map((value) => ({
  value,
  label: LEAD_CONTACT_STATUS_LABELS[value],
}));

export const ContactStatusInput = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.currentLeadContact.status);

  return (
    <label className={styles.fieldGroup}>
      <span className={styles.label}>Status</span>
      <select
        value={status}
        onChange={(event) =>
          dispatch(
            CurrentLeadContactActions.updateCurrentLeadContact({
              status: event.target.value as LeadContactStatus,
            })
          )
        }
        className={styles.select}
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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
  select: `
    rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900
    focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20
  `,
};
