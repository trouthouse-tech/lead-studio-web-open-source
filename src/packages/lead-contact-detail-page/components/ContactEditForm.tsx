'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { LeadContactBuilderActions } from '@/store/builders';
import { CurrentLeadContactActions } from '@/store/current';
import { updateLeadContactFieldsThunk } from '@/store/thunks/lead-contacts';
import {
  LEAD_CONTACT_STATUS_LABELS,
  LEAD_CONTACT_STATUS_ORDER,
  type LeadContactStatus,
} from '@/model/lead-contact';

const CONTACT_STATUSES = LEAD_CONTACT_STATUS_ORDER.map((value) => ({
  value,
  label: LEAD_CONTACT_STATUS_LABELS[value],
}));

export const ContactEditForm = () => {
  const dispatch = useAppDispatch();
  const { isSaving } = useAppSelector((s) => s.leadContactBuilder);
  const c = useAppSelector((s) => s.currentLeadContact);

  const save = async () => {
    await dispatch(
      updateLeadContactFieldsThunk(c.id, {
        name: c.name,
        email: c.email,
        phone: c.phone,
        role: c.role,
        status: c.status,
      })
    );
  };

  return (
    <div className={styles.box}>
      <div className={styles.grid}>
        <label className={styles.field}>
          <span className={styles.label}>Name</span>
          <input
            type="text"
            value={c.name}
            onChange={(e) =>
              dispatch(
                CurrentLeadContactActions.updateCurrentLeadContact({
                  name: e.target.value,
                })
              )
            }
            className={styles.input}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Role</span>
          <input
            type="text"
            value={c.role ?? ''}
            onChange={(e) =>
              dispatch(
                CurrentLeadContactActions.updateCurrentLeadContact({
                  role: e.target.value || null,
                })
              )
            }
            className={styles.input}
            placeholder="e.g. Owner"
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Email</span>
          <input
            type="email"
            value={c.email ?? ''}
            onChange={(e) =>
              dispatch(
                CurrentLeadContactActions.updateCurrentLeadContact({
                  email: e.target.value || null,
                })
              )
            }
            className={styles.input}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Phone</span>
          <input
            type="tel"
            value={c.phone ?? ''}
            onChange={(e) =>
              dispatch(
                CurrentLeadContactActions.updateCurrentLeadContact({
                  phone: e.target.value || null,
                })
              )
            }
            className={styles.input}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Status</span>
          <select
            value={c.status}
            onChange={(e) =>
              dispatch(
                CurrentLeadContactActions.updateCurrentLeadContact({
                  status: e.target.value as LeadContactStatus,
                })
              )
            }
            className={styles.input}
          >
            {CONTACT_STATUSES.map((statusOption) => (
              <option key={statusOption.value} value={statusOption.value}>
                {statusOption.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className={styles.actions}>
        <button
          type="button"
          onClick={() =>
            dispatch(LeadContactBuilderActions.setEditing(false))
          }
          className={styles.cancel}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={save}
          disabled={isSaving}
          className={styles.save}
        >
          {isSaving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  );
};

const styles = {
  box: ``,
  grid: `grid grid-cols-1 md:grid-cols-2 gap-4`,
  field: `flex flex-col gap-1`,
  label: `text-xs font-medium text-gray-600`,
  input: `
    px-3 py-2 text-sm border border-gray-200 rounded-lg
    focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none
  `,
  actions: `flex justify-end gap-2 mt-4`,
  cancel: `
    px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100
    border-none bg-transparent cursor-pointer
  `,
  save: `
    px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg
    hover:bg-blue-700 border-none cursor-pointer disabled:opacity-50
  `,
};
