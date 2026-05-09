import type { LeadContact } from '@/model';

/**
 * Primary-contact draft for manual lead creation (`currentLeadContact` while modal is open).
 */
export const buildManualLeadCreationDraftContact = (): LeadContact => ({
  id: '',
  lead_id: '',
  name: '',
  email: null,
  phone: null,
  role: null,
  notes: null,
  status: 'not_contacted',
  created_at: '',
  updated_at: '',
});
