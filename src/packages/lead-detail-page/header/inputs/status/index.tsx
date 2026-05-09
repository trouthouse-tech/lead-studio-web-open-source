'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateLeadThunk } from '@/store/thunks/leads';
import type { Lead } from '@/model';

const STATUS_LABEL: Record<Lead['status'], string> = {
  not_contacted: 'Not contacted',
  contacted: 'Contacted',
  in_call_log: 'In call log',
  not_answered: 'Not answered',
  lost: 'Lost',
  archived: 'Archived',
};

const STATUS_OPTIONS = Object.entries(STATUS_LABEL) as [Lead['status'], string][];

export const StatusInput = () => {
  const dispatch = useAppDispatch();
  const currentLead = useAppSelector((state) => state.currentLead);

  const value = currentLead.status ?? 'not_contacted';

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as Lead['status'];
    if (next === value) return;
    await dispatch(updateLeadThunk(currentLead.id, { status: next }));
  };

  return (
    <select
      value={value}
      onChange={(e) => {
        void handleChange(e);
      }}
      className={styles.select}
      title="Update lead status"
      aria-label="Lead status"
    >
      {STATUS_OPTIONS.map(([optionValue, label]) => (
        <option key={optionValue} value={optionValue}>
          {label}
        </option>
      ))}
    </select>
  );
};

const styles = {
  select: `
    h-7 rounded border border-gray-300 bg-white px-2 text-[11px] font-medium text-gray-800
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    hover:border-gray-400 transition-colors
  `,
};
