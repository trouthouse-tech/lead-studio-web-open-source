import type { LeadContact } from '@/model/lead-contact';
import type { PersistedLeadContactsFilters } from './persisted-lead-contacts-filters';

/**
 * Sorts all contacts by `created_at` desc, then applies persisted list filters.
 */
export const getFilteredSortedLeadContactsForList = (
  record: Record<string, LeadContact>,
  filters: PersistedLeadContactsFilters
): LeadContact[] => {
  const sorted = Object.values(record).sort((a, b) => {
    const dateA =
      typeof a.created_at === 'string' ? new Date(a.created_at) : a.created_at;
    const dateB =
      typeof b.created_at === 'string' ? new Date(b.created_at) : b.created_at;
    return dateB.getTime() - dateA.getTime();
  });

  const q = filters.searchFilter.trim().toLowerCase();

  return sorted.filter((contact) => {
    if (
      filters.statusFilter !== 'all' &&
      (contact.status ?? 'not_contacted') !== filters.statusFilter
    ) {
      return false;
    }
    if (!q) return true;
    const hay = [contact.name, contact.email, contact.role, contact.phone]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return hay.includes(q);
  });
};
