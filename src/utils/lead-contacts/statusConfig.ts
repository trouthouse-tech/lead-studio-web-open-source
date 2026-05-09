import {
  LEAD_CONTACT_STATUS_LABELS,
  type LeadContactStatus,
} from '@/model/lead-contact';

export const STATUS_CONFIG: Record<
  LeadContactStatus,
  { label: string; color: string }
> = {
  not_contacted: {
    label: LEAD_CONTACT_STATUS_LABELS.not_contacted,
    color: 'bg-gray-100 text-gray-700',
  },
  contacted: {
    label: LEAD_CONTACT_STATUS_LABELS.contacted,
    color: 'bg-blue-100 text-blue-800',
  },
  in_call_log: {
    label: LEAD_CONTACT_STATUS_LABELS.in_call_log,
    color: 'bg-violet-100 text-violet-800',
  },
  responded: {
    label: LEAD_CONTACT_STATUS_LABELS.responded,
    color: 'bg-green-100 text-green-800',
  },
  not_responded: {
    label: LEAD_CONTACT_STATUS_LABELS.not_responded,
    color: 'bg-yellow-100 text-yellow-800',
  },
  won: { label: LEAD_CONTACT_STATUS_LABELS.won, color: 'bg-emerald-100 text-emerald-800' },
  lost: { label: LEAD_CONTACT_STATUS_LABELS.lost, color: 'bg-red-100 text-red-800' },
  bad_email: {
    label: LEAD_CONTACT_STATUS_LABELS.bad_email,
    color: 'bg-orange-100 text-orange-900',
  },
};
