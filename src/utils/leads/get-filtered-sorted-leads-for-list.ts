import type { Lead, LeadCategory } from '@/model';
import type {
  LeadContactFilterValue,
  LeadFacebookSearchFilterValue,
  LeadQualityFilterValue,
  LeadUrlDiscoveryFilterValue,
  LeadWebsiteFilterValue,
  LeadWebsiteResearchFilterValue,
} from './constants';

export type LeadsListSortColumn = 'business_name' | 'updated_at' | 'quality_score';
export type LeadsListSortDirection = 'asc' | 'desc';

export type LeadsListFilterParams = {
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

const getTime = (date: string | undefined): number =>
  date ? new Date(date).getTime() : 0;

/**
 * Apply the same category/status/search/quality/website/contact/research filters as the leads table, then sort.
 */
export const getFilteredSortedLeadsForList = (input: {
  leads: Lead[];
  leadCategories: LeadCategory[];
  filters: LeadsListFilterParams;
  /** Lead ids that have ≥1 contact in the `leadContacts` dump (see `getLeadIdsWithAtLeastOneContactSet`). */
  leadIdsWithAtLeastOneContact: Set<string>;
  sortColumn: LeadsListSortColumn;
  sortDirection: LeadsListSortDirection;
}): Lead[] => {
  const {
    leads,
    leadCategories,
    filters: {
      selectedCategoryIds,
      selectedStatus,
      searchFilter,
      qualityFilter,
      websiteFilter,
      leadContactFilter,
      facebookGoogleSearchFilter,
      playwrightUrlDiscoveryFilter,
      websiteResearchFilter,
    },
    leadIdsWithAtLeastOneContact,
    sortColumn,
    sortDirection,
  } = input;

  let filtered = leads;

  if (selectedStatus) {
    filtered = filtered.filter((lead) => lead.status === selectedStatus);
  }

  if (selectedCategoryIds.length > 0) {
    filtered = filtered.filter((lead) => {
      if (
        selectedCategoryIds.includes('uncategorized') &&
        !lead.category_id &&
        !lead.category_name
      ) {
        return true;
      }
      if (lead.category_id && selectedCategoryIds.includes(lead.category_id)) {
        return true;
      }
      if (!lead.category_id && lead.category_name) {
        const match = leadCategories.find(
          (cat) =>
            selectedCategoryIds.includes(cat.id) &&
            lead.category_name?.toLowerCase() === cat.name.toLowerCase()
        );
        if (match) return true;
      }
      return false;
    });
  }

  if (searchFilter) {
    const q = searchFilter.toLowerCase();
    filtered = filtered.filter(
      (lead) =>
        lead.business_name?.toLowerCase().includes(q) ||
        lead.website?.toLowerCase().includes(q) ||
        lead.name?.toLowerCase().includes(q)
    );
  }

  if (websiteFilter === 'has') {
    filtered = filtered.filter((lead) => !!lead.website?.trim());
  } else if (websiteFilter === 'missing') {
    filtered = filtered.filter((lead) => !lead.website?.trim());
  }

  if (leadContactFilter === 'has') {
    filtered = filtered.filter((lead) => leadIdsWithAtLeastOneContact.has(lead.id));
  } else if (leadContactFilter === 'missing') {
    filtered = filtered.filter((lead) => !leadIdsWithAtLeastOneContact.has(lead.id));
  }

  if (facebookGoogleSearchFilter === 'attempted') {
    filtered = filtered.filter((lead) => lead.facebook_google_search_attempted === true);
  } else if (facebookGoogleSearchFilter === 'not_attempted') {
    filtered = filtered.filter((lead) => !lead.facebook_google_search_attempted);
  }

  if (playwrightUrlDiscoveryFilter === 'attempted') {
    filtered = filtered.filter(
      (lead) => lead.playwright_website_url_discovery_attempted === true
    );
  } else if (playwrightUrlDiscoveryFilter === 'not_attempted') {
    filtered = filtered.filter((lead) => !lead.playwright_website_url_discovery_attempted);
  }

  if (websiteResearchFilter === 'attempted') {
    filtered = filtered.filter((lead) => lead.website_research_attempted === true);
  } else if (websiteResearchFilter === 'not_attempted') {
    filtered = filtered.filter((lead) => !lead.website_research_attempted);
  }

  if (qualityFilter === 'unscored') {
    filtered = filtered.filter(
      (lead) => lead.quality_score === undefined || lead.quality_score === null
    );
  } else if (qualityFilter === '<30') {
    filtered = filtered.filter(
      (lead) => lead.quality_score != null && lead.quality_score < 30
    );
  } else if (qualityFilter === '30-50') {
    filtered = filtered.filter(
      (lead) =>
        lead.quality_score != null &&
        lead.quality_score >= 30 &&
        lead.quality_score <= 50
    );
  } else if (qualityFilter === '51-70') {
    filtered = filtered.filter(
      (lead) =>
        lead.quality_score != null &&
        lead.quality_score >= 51 &&
        lead.quality_score <= 70
    );
  } else if (qualityFilter === '71+') {
    filtered = filtered.filter(
      (lead) => lead.quality_score != null && lead.quality_score >= 71
    );
  }

  return [...filtered].sort((a, b) => {
    let comparison = 0;
    if (sortColumn === 'business_name') {
      comparison = (a.business_name || '')
        .toLowerCase()
        .localeCompare((b.business_name || '').toLowerCase());
    } else if (sortColumn === 'quality_score') {
      comparison = (a.quality_score ?? -1) - (b.quality_score ?? -1);
    } else {
      comparison = getTime(a.updated_at) - getTime(b.updated_at);
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });
};
