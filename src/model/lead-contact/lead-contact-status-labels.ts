import type { LeadContactStatus } from './LeadContact';

/** Stable UI order for selects and filters. */
export const LEAD_CONTACT_STATUS_ORDER: LeadContactStatus[] = [
  'not_contacted',
  'contacted',
  'in_call_log',
  'responded',
  'not_responded',
  'won',
  'lost',
  'bad_email',
];

/** Human-readable labels for `LeadContactStatus` (single source of truth). */
export const LEAD_CONTACT_STATUS_LABELS: Record<LeadContactStatus, string> = {
  not_contacted: 'Not contacted',
  contacted: 'Contacted',
  in_call_log: 'In call log',
  responded: 'Responded',
  not_responded: 'No response',
  won: 'Won',
  lost: 'Lost',
  bad_email: 'Bad email',
};
