import type { LeadContactStatus } from '@/model/lead-contact';
import { STATUS_CONFIG } from './statusConfig';

const STORAGE_KEY = 'luckee.lead-contacts.filters.v1';

const ALLOWED_STATUS = new Set<string>([
  ...Object.keys(STATUS_CONFIG),
  'all',
]);

export type PersistedLeadContactsFilters = {
  searchFilter: string;
  statusFilter: LeadContactStatus | 'all';
};

export type LeadContactsFiltersStorageSnapshot = PersistedLeadContactsFilters;

/**
 * Normalizes an arbitrary JSON object into persisted lead-contact list filters.
 */
export const parsePersistedLeadContactsFiltersPayload = (
  parsed: unknown
): PersistedLeadContactsFilters | null => {
  if (!parsed || typeof parsed !== 'object') {
    return null;
  }
  const o = parsed as Record<string, unknown>;

  const searchFilter = typeof o.searchFilter === 'string' ? o.searchFilter : '';

  let statusFilter: LeadContactStatus | 'all' = 'all';
  if (typeof o.statusFilter === 'string' && ALLOWED_STATUS.has(o.statusFilter)) {
    statusFilter = o.statusFilter as LeadContactStatus | 'all';
  }

  return {
    searchFilter,
    statusFilter,
  };
};

/**
 * Read persisted lead-contact list filters from localStorage.
 */
export const readPersistedLeadContactsFilters = (): LeadContactsFiltersStorageSnapshot | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as unknown;
    return parsePersistedLeadContactsFiltersPayload(parsed);
  } catch {
    return null;
  }
};

/**
 * Persist lead-contact list filters to localStorage.
 */
export const writePersistedLeadContactsFilters = (
  snapshot: LeadContactsFiltersStorageSnapshot
): void => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // ignore quota / private mode
  }
};
