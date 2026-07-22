'use client';

import { useRouter } from 'next/navigation';
import { LEAD_DETAIL_PATH } from '@/config';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { deleteLeadContactThunk } from '@/store/thunks/lead-contacts';
import { setCurrentLeadThunk } from '@/store/thunks/leads';
import type { LeadContact } from '@/model/lead-contact';
import { formatPhoneNumber } from '@/utils/string';
import { formatDateTimeShort } from '@/utils/date-time';
import { STATUS_CONFIG } from '@/utils/lead-contacts';

type LeadContactsTableRowProps = {
  contact: LeadContact;
  index: number;
};

export const LeadContactsTableRow = (props: LeadContactsTableRowProps) => {
  const { contact, index } = props;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const leads = useAppSelector((state) => state.leads);
  const lead = leads[contact.lead_id];
  const statusKey = contact.status ?? 'not_contacted';
  const statusMeta = STATUS_CONFIG[statusKey];

  const handleViewLead = () => {
    dispatch(setCurrentLeadThunk(contact.lead_id));
    router.push(LEAD_DETAIL_PATH);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    await dispatch(deleteLeadContactThunk(contact.id));
  };

  return (
    <tr className={styles.tableRow}>
      <td className={styles.tableCell}>{index + 1}</td>
      <td className={styles.tableCell}>
        <span className={styles.clickableName} onClick={handleViewLead}>
          {contact.name || <span className={styles.emptyValue}>—</span>}
        </span>
      </td>
      <td className={styles.tableCell}>
        {contact.role ? (
          <span className={styles.roleTag}>{contact.role}</span>
        ) : (
          <span className={styles.emptyValue}>—</span>
        )}
      </td>
      <td className={styles.tableCell}>
        <span className={`${styles.statusBadge} ${statusMeta.color}`}>
          {statusMeta.label}
        </span>
      </td>
      <td className={styles.tableCell}>
        {contact.email ? (
          <a href={`mailto:${contact.email}`} className={styles.emailLink}>
            {contact.email}
          </a>
        ) : (
          <span className={styles.emptyValue}>—</span>
        )}
      </td>
      <td className={styles.tableCell}>
        {contact.phone ? (
          <a href={`tel:${contact.phone}`} className={styles.phoneLink}>
            {formatPhoneNumber(contact.phone)}
          </a>
        ) : (
          <span className={styles.emptyValue}>—</span>
        )}
      </td>
      <td className={styles.tableCell}>
        {lead ? (
          <span
            className={styles.clickableName}
            onClick={handleViewLead}
            title={lead.business_name ?? lead.name ?? undefined}
          >
            {lead.business_name ?? lead.name ?? 'Unknown Lead'}
          </span>
        ) : (
          <span className={styles.loadingText}>Loading...</span>
        )}
      </td>
      <td className={styles.tableCell}>
        {formatDateTimeShort(contact.created_at)}
      </td>
      <td className={styles.actionsCell}>
        {contact.notes && (
          <span className={styles.notesIndicator} title="Has notes">
            📝
          </span>
        )}
        <button
          type="button"
          onClick={handleDelete}
          className={styles.deleteButton}
          title="Delete contact"
        >
          🗑️
        </button>
      </td>
    </tr>
  );
};

const styles = {
  tableRow: `
    border-b border-gray-200 transition-colors last:border-b-0 hover:bg-gray-50
  `,
  tableCell: `
    px-3 py-2 text-xs text-gray-700
  `,
  clickableName: `
    cursor-pointer text-xs font-medium text-blue-600 transition-colors hover:text-blue-800 hover:underline
  `,
  roleTag: `
    rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700
  `,
  statusBadge: `
    rounded px-2 py-0.5 text-xs font-medium
  `,
  emptyValue: `
    text-gray-400
  `,
  emailLink: `
    text-blue-600 hover:underline
  `,
  phoneLink: `
    text-blue-600 hover:underline
  `,
  loadingText: `
    text-xs italic text-gray-400
  `,
  actionsCell: `
    px-3 py-2 text-right
  `,
  notesIndicator: `
    mr-1
  `,
  deleteButton: `
    cursor-pointer rounded px-2 py-1 text-xs text-red-600 transition-colors hover:bg-red-50
  `,
};
