'use client';

import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { LeadBuilderActions } from '@/store/builders';
import { LeadsActions } from '@/store/dumps/leads';
import { LEAD_DETAIL_PATH } from '@/config';
import {
  setCurrentLeadThunk,
  updateLeadThunk,
  deleteLeadThunk,
} from '@/store/thunks/leads';
import type { Lead } from '@/model';

type LeadsTableRowMenuProps = {
  lead: Lead;
};

export const LeadsTableRowMenu = (props: LeadsTableRowMenuProps) => {
  const { lead } = props;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const name = lead.business_name || lead.name || 'Lead';

  const closeMenu = () => {
    dispatch(LeadBuilderActions.setLeadsTableMenuOpenId(null));
  };

  const handleView = () => {
    closeMenu();
    void dispatch(setCurrentLeadThunk(lead.id));
    router.push(LEAD_DETAIL_PATH);
  };

  const handleEdit = () => {
    closeMenu();
    dispatch(setCurrentLeadThunk(lead.id));
    router.push(LEAD_DETAIL_PATH);
  };

  const handleArchive = async () => {
    if (
      confirm(
        `Are you sure you want to archive "${lead.business_name || lead.name || 'this lead'}"? This will hide the lead from the main list.`
      )
    ) {
      closeMenu();
      const status = await dispatch(
        updateLeadThunk(lead.id, { status: 'archived' })
      );
      if (status === 200) {
        dispatch(LeadsActions.deleteLead(lead.id));
      }
    }
  };

  const handleDelete = async () => {
    if (
      confirm(
        `Are you sure you want to delete "${lead.business_name || lead.name || 'this lead'}"?`
      )
    ) {
      closeMenu();
      await dispatch(deleteLeadThunk(lead.id));
    }
  };

  return (
    <div
      className={styles.menu}
      role="menu"
      aria-label={`Actions for ${name}`}
    >
      <button
        type="button"
        onClick={handleView}
        className={styles.menuItem}
        role="menuitem"
      >
        View
      </button>
      <button
        type="button"
        onClick={handleEdit}
        className={styles.menuItem}
        role="menuitem"
      >
        Edit
      </button>
      <button
        type="button"
        onClick={handleArchive}
        className={styles.menuItem}
        role="menuitem"
      >
        Archive
      </button>
      <button
        type="button"
        onClick={handleDelete}
        className={styles.menuItemDanger}
        role="menuitem"
      >
        Delete
      </button>
    </div>
  );
};

const styles = {
  menu: `
    absolute right-0 top-full mt-1 z-50 min-w-40
    bg-white border border-gray-200 rounded shadow-lg py-1
  `,
  menuItem: `
    w-full text-left px-3 py-2 text-sm text-gray-700
    hover:bg-gray-100 transition-colors
    border-none bg-transparent cursor-pointer
  `,
  menuItemDanger: `
    w-full text-left px-3 py-2 text-sm text-red-600
    hover:bg-red-50 transition-colors
    border-none bg-transparent cursor-pointer
  `,
};
