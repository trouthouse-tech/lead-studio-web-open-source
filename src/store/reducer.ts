import { combineReducers } from '@reduxjs/toolkit';

import {
  googleMapsScrapeRuns,
  leadActivities,
  leadCategories,
  leadContactActivities,
  leadContactChat,
  leadContactEmailAttachments,
  leadContactEmailQueue,
  leadContactEmails,
  leadContacts,
  leadSentEmails,
  leads,
  llmModels,
  savedFilters,
  toCallLogs,
} from './dumps';

import {
  currentGoogleMapsScrapeRun,
  currentLead,
  currentLeadContact,
  currentLeadContactEmail,
} from './current';

import {
  breadcrumbBuilder,
  dashboardBuilder,
  googleMapsScraperBuilder,
  leadBuilder,
  leadContactBuilder,
  leadContactEmailBuilder,
  leadContactsFiltersBuilder,
  leadDetailEmailFab,
  leadSentEmailsBuilder,
  leadsFiltersBuilder,
  toCallLogBuilder,
} from './builders';

import { leadsFilters, leadContactsFilters } from './filters';

/**
 * Lead Studio root reducer: commercial leads, contacts, email queue, dashboard, and related UI builders only.
 */
const rootReducer = combineReducers({
  leads,
  leadCategories,
  leadContacts,
  leadActivities,
  leadContactActivities,
  leadSentEmails,
  leadContactEmailQueue,
  leadContactEmails,
  leadContactChat,
  leadContactEmailAttachments,
  savedFilters,
  llmModels,
  googleMapsScrapeRuns,
  toCallLogs,

  currentLead,
  currentLeadContact,
  currentLeadContactEmail,
  currentGoogleMapsScrapeRun,

  leadBuilder,
  leadsFiltersBuilder,
  leadContactsFiltersBuilder,
  leadSentEmailsBuilder,
  leadContactBuilder,
  leadContactEmailBuilder,
  googleMapsScraperBuilder,
  dashboardBuilder,
  leadDetailEmailFab,
  breadcrumbBuilder,
  toCallLogBuilder,

  leadsFilters,
  leadContactsFilters,
});

export default rootReducer;
