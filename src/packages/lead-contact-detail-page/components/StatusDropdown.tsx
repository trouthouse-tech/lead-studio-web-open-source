'use client';

import { ChevronDown } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { LeadContactBuilderActions } from '@/store/builders';
import { updateLeadContactStatusThunk } from '@/store/thunks/lead-contacts';
import {
  LEAD_CONTACT_STATUS_LABELS,
  LEAD_CONTACT_STATUS_ORDER,
  type LeadContactStatus,
} from '@/model/lead-contact';

const CONTACT_STATUSES = LEAD_CONTACT_STATUS_ORDER.map((value) => ({
  value,
  label: LEAD_CONTACT_STATUS_LABELS[value],
}));

export const StatusDropdown = () => {
  const dispatch = useAppDispatch();
  const { isStatusMenuOpen, isUpdatingStatus } = useAppSelector(
    (s) => s.leadContactBuilder
  );
  const currentLeadContact = useAppSelector((s) => s.currentLeadContact);

  const handleChange = async (next: LeadContactStatus) => {
    dispatch(LeadContactBuilderActions.setStatusMenuOpen(false));
    if (next === currentLeadContact.status) return;
    await dispatch(updateLeadContactStatusThunk(currentLeadContact.id, next));
  };

  const label =
    LEAD_CONTACT_STATUS_LABELS[currentLeadContact.status] ?? currentLeadContact.status;

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        onClick={() =>
          dispatch(
            LeadContactBuilderActions.setStatusMenuOpen(!isStatusMenuOpen)
          )
        }
        disabled={isUpdatingStatus}
        className={styles.trigger}
      >
        {isUpdatingStatus ? '…' : label}
        <ChevronDown className={styles.chev} />
      </button>
      {isStatusMenuOpen && (
        <>
          <button
            type="button"
            className={styles.backdrop}
            aria-label="Close menu"
            onClick={() =>
              dispatch(LeadContactBuilderActions.setStatusMenuOpen(false))
            }
          />
          <div className={styles.menu}>
            {CONTACT_STATUSES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => handleChange(s.value)}
                className={`${styles.item} ${
                  currentLeadContact.status === s.value ? styles.itemOn : ''
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  wrap: `relative`,
  trigger: `
    inline-flex h-6 items-center gap-1 rounded border border-gray-200 bg-white px-2 text-[11px] font-medium
    text-gray-700 transition-colors hover:bg-gray-50 cursor-pointer
  `,
  chev: `h-3 w-3 opacity-70`,
  backdrop: `fixed inset-0 z-10 cursor-default border-none bg-transparent p-0`,
  menu: `
    absolute left-0 top-full mt-1 z-20 min-w-[11rem] py-1 rounded-lg border border-gray-200
    bg-white shadow-lg
  `,
  item: `
    w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 border-none bg-transparent cursor-pointer
  `,
  itemOn: `bg-gray-50 font-medium`,
};
