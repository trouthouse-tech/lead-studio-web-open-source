import type { Lead } from '@/model';

/**
 * Sentinel `Lead` when nothing is selected (`id === ''`) or after `reset`.
 * Matches manual-create draft shape so forms and detail UI can assume a full `Lead` object.
 */
export const createEmptyLead = (): Lead => ({
  id: '',
  name: null,
  business_name: '',
  address: null,
  website: null,
  has_quote_form: false,
  has_chat_bot: false,
  has_phone_quote: false,
  notes: null,
  description: null,
  status: 'not_contacted',
  idempotency_key: '',
  created_at: '',
  updated_at: '',
});
