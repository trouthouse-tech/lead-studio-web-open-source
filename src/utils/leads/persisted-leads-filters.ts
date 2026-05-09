import type {
  LeadContactFilterValue,
  LeadFacebookSearchFilterValue,
  LeadQualityFilterValue,
  LeadUrlDiscoveryFilterValue,
  LeadWebsiteFilterValue,
  LeadWebsiteResearchFilterValue,
} from './constants';
import {
  CONTACT_FILTER_OPTIONS,
  FACEBOOK_SEARCH_FILTER_OPTIONS,
  LEAD_STATUSES,
  QUALITY_FILTER_OPTIONS,
  URL_DISCOVERY_FILTER_OPTIONS,
  WEBSITE_FILTER_OPTIONS,
  WEBSITE_RESEARCH_FILTER_OPTIONS,
} from './constants';

const STORAGE_KEY = 'luckee.leads.filters.v1';

export type PersistedLeadsFilters = {
  selectedCategoryIds: string[];
  selectedStatus: string | null;
  searchFilter: string;
  qualityFilter: LeadQualityFilterValue;
  websiteFilter: LeadWebsiteFilterValue;
  leadContactFilter: LeadContactFilterValue;
  facebookGoogleSearchFilter: LeadFacebookSearchFilterValue;
  playwrightUrlDiscoveryFilter: LeadUrlDiscoveryFilterValue;
  websiteResearchFilter: LeadWebsiteResearchFilterValue;
};

/** Snapshot stored in localStorage (optional `activeSavedFilterId` for UX restore). */
export type LeadsFiltersStorageSnapshot = PersistedLeadsFilters & {
  activeSavedFilterId?: string | null;
};

const ALLOWED_STATUS = new Set(LEAD_STATUSES.map((s) => s.value));
const ALLOWED_QUALITY = new Set<LeadQualityFilterValue>(
  QUALITY_FILTER_OPTIONS.map((o) => o.value)
);
const ALLOWED_WEBSITE = new Set<LeadWebsiteFilterValue>(
  WEBSITE_FILTER_OPTIONS.map((o) => o.value)
);
const ALLOWED_CONTACT = new Set<LeadContactFilterValue>(
  CONTACT_FILTER_OPTIONS.map((o) => o.value)
);
const ALLOWED_FACEBOOK_SEARCH = new Set<LeadFacebookSearchFilterValue>(
  FACEBOOK_SEARCH_FILTER_OPTIONS.map((o) => o.value)
);
const ALLOWED_URL_DISCOVERY = new Set<LeadUrlDiscoveryFilterValue>(
  URL_DISCOVERY_FILTER_OPTIONS.map((o) => o.value)
);
const ALLOWED_WEBSITE_RESEARCH = new Set<LeadWebsiteResearchFilterValue>(
  WEBSITE_RESEARCH_FILTER_OPTIONS.map((o) => o.value)
);

const isStringArray = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every((x) => typeof x === 'string');

/**
 * Normalizes an arbitrary JSON object into `PersistedLeadsFilters` (for API rows + localStorage).
 */
export const parsePersistedLeadsFiltersPayload = (parsed: unknown): PersistedLeadsFilters | null => {
  if (!parsed || typeof parsed !== 'object') {
    return null;
  }
  const o = parsed as Record<string, unknown>;

  const selectedCategoryIds = isStringArray(o.selectedCategoryIds) ? o.selectedCategoryIds : [];

  const searchFilter = typeof o.searchFilter === 'string' ? o.searchFilter : '';

  let selectedStatus: string | null = null;
  if (o.selectedStatus === null || o.selectedStatus === '') {
    selectedStatus = null;
  } else if (
    typeof o.selectedStatus === 'string' &&
    ALLOWED_STATUS.has(o.selectedStatus)
  ) {
    selectedStatus = o.selectedStatus;
  }

  const qualityFilter =
    typeof o.qualityFilter === 'string' && ALLOWED_QUALITY.has(o.qualityFilter as LeadQualityFilterValue)
      ? (o.qualityFilter as LeadQualityFilterValue)
      : 'all';

  const websiteFilter =
    typeof o.websiteFilter === 'string' && ALLOWED_WEBSITE.has(o.websiteFilter as LeadWebsiteFilterValue)
      ? (o.websiteFilter as LeadWebsiteFilterValue)
      : 'all';

  const leadContactFilter =
    typeof o.leadContactFilter === 'string' &&
    ALLOWED_CONTACT.has(o.leadContactFilter as LeadContactFilterValue)
      ? (o.leadContactFilter as LeadContactFilterValue)
      : 'all';

  const facebookGoogleSearchFilter =
    typeof o.facebookGoogleSearchFilter === 'string' &&
    ALLOWED_FACEBOOK_SEARCH.has(o.facebookGoogleSearchFilter as LeadFacebookSearchFilterValue)
      ? (o.facebookGoogleSearchFilter as LeadFacebookSearchFilterValue)
      : 'all';

  const playwrightUrlDiscoveryFilter =
    typeof o.playwrightUrlDiscoveryFilter === 'string' &&
    ALLOWED_URL_DISCOVERY.has(o.playwrightUrlDiscoveryFilter as LeadUrlDiscoveryFilterValue)
      ? (o.playwrightUrlDiscoveryFilter as LeadUrlDiscoveryFilterValue)
      : 'all';

  const websiteResearchFilter =
    typeof o.websiteResearchFilter === 'string' &&
    ALLOWED_WEBSITE_RESEARCH.has(o.websiteResearchFilter as LeadWebsiteResearchFilterValue)
      ? (o.websiteResearchFilter as LeadWebsiteResearchFilterValue)
      : 'all';

  return {
    selectedCategoryIds,
    selectedStatus,
    searchFilter,
    qualityFilter,
    websiteFilter,
    leadContactFilter,
    facebookGoogleSearchFilter,
    playwrightUrlDiscoveryFilter,
    websiteResearchFilter,
  };
};

const parseActiveSavedFilterId = (o: Record<string, unknown>): string | null => {
  const v = o.activeSavedFilterId;
  if (v === null || v === '') return null;
  if (typeof v === 'string' && v.trim()) return v.trim();
  return null;
};

/**
 * Read persisted leads list filters from localStorage. Returns null if missing or invalid filter payload.
 */
export const readPersistedLeadsFilters = (): LeadsFiltersStorageSnapshot | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }
    const o = parsed as Record<string, unknown>;
    const filters = parsePersistedLeadsFiltersPayload(o);
    if (!filters) {
      return null;
    }
    return {
      ...filters,
      activeSavedFilterId: parseActiveSavedFilterId(o),
    };
  } catch {
    return null;
  }
};

/**
 * Persist leads list filters (and optional active saved-filter id) to localStorage.
 */
export const writePersistedLeadsFilters = (snapshot: LeadsFiltersStorageSnapshot): void => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // ignore quota / private mode
  }
};
