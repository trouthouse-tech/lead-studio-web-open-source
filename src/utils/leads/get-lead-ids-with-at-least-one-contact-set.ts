import type { LeadContact } from '@/model';

/**
 * Returns the set of lead ids that have at least one row in the normalized `leadContacts` dump.
 */
export const getLeadIdsWithAtLeastOneContactSet = (
  contactsById: Record<string, LeadContact>
): Set<string> => {
  const ids = new Set<string>();
  for (const c of Object.values(contactsById)) {
    ids.add(c.lead_id);
  }
  return ids;
};
