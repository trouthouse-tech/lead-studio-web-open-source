import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { WebsiteScrapeLatestSummary } from '@/api/leads';

export const LEAD_RESEARCH_RUN_PHASES = [
  'idle',
  'site_pages',
  'website',
  'social',
  'description',
] as const;

export type LeadResearchRunPhase = (typeof LEAD_RESEARCH_RUN_PHASES)[number];

type LeadBuilderState = {
  selectedLeadIds: string[];
  leadsTableMenuOpenId: string | null;
  isSavingLeadDetail: boolean;
  /** When false, lead detail header shows compact read-only summary; when true, full edit form. */
  isEditing: boolean;
  /** Website research pipeline (and description-from-crawl) busy state for lead detail Research tab. */
  researchRunPhase: LeadResearchRunPhase;
  websiteScrapeLatestSummary: WebsiteScrapeLatestSummary | null;
  websiteScrapeLatestLoading: boolean;
  /** Confirm modal before POST lead-website-research (crawl + description AI). */
  isWebsiteResearchConfirmModalOpen: boolean;
  /** Lead detail header: confirm before DELETE lead. */
  isLeadDeleteConfirmModalOpen: boolean;
  /** True while deleteLeadThunk is in flight from that modal. */
  isDeletingLead: boolean;
  isAddLeadModalOpen: boolean;
  /** Find leads (Google Maps search) modal on the commercial leads list. */
  isFindLeadsModalOpen: boolean;
  /** True while batch AI auto-categorize (uncategorized header action) is running. */
  isUncategorizedBatchCategorizing: boolean;
  /** True while leads-list batch full research is running (once per unresearched lead). */
  isLeadsListFullResearchBatchBusy: boolean;
  /** True while leads-list bulk Facebook/Instagram social search is running. */
  isLeadsListSocialSearchBatchBusy: boolean;
  /** Leads table: per-lead full-research spinner while discovery + crawl are in flight. */
  leadsTableRowSummaryBusyByLeadId: Record<string, boolean>;
  /** Leads table: per-lead social search spinner. */
  leadsTableRowSocialBusyByLeadId: Record<string, boolean>;
};

const initialState: LeadBuilderState = {
  selectedLeadIds: [],
  leadsTableMenuOpenId: null,
  isSavingLeadDetail: false,
  isEditing: false,
  researchRunPhase: 'idle',
  websiteScrapeLatestSummary: null,
  websiteScrapeLatestLoading: false,
  isWebsiteResearchConfirmModalOpen: false,
  isLeadDeleteConfirmModalOpen: false,
  isDeletingLead: false,
  isAddLeadModalOpen: false,
  isFindLeadsModalOpen: false,
  isUncategorizedBatchCategorizing: false,
  isLeadsListFullResearchBatchBusy: false,
  isLeadsListSocialSearchBatchBusy: false,
  leadsTableRowSummaryBusyByLeadId: {},
  leadsTableRowSocialBusyByLeadId: {},
};

export const leadBuilderSlice = createSlice({
  name: 'leadBuilder',
  initialState,
  reducers: {
    clearLeadSelection: (state) => {
      state.selectedLeadIds = [];
    },
    selectAllLeads: (state, action: PayloadAction<string[]>) => {
      state.selectedLeadIds = action.payload;
    },
    toggleLeadSelection: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const idx = state.selectedLeadIds.indexOf(id);
      if (idx === -1) {
        state.selectedLeadIds.push(id);
      } else {
        state.selectedLeadIds.splice(idx, 1);
      }
    },
    setLeadsTableMenuOpenId: (state, action: PayloadAction<string | null>) => {
      state.leadsTableMenuOpenId = action.payload;
    },
    setIsSavingLeadDetail: (state, action: PayloadAction<boolean>) => {
      state.isSavingLeadDetail = action.payload;
    },
    setIsEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },
    setResearchRunPhase: (state, action: PayloadAction<LeadResearchRunPhase>) => {
      state.researchRunPhase = action.payload;
    },
    setWebsiteScrapeLatestSummary: (
      state,
      action: PayloadAction<WebsiteScrapeLatestSummary | null>
    ) => {
      state.websiteScrapeLatestSummary = action.payload;
    },
    setWebsiteScrapeLatestLoading: (state, action: PayloadAction<boolean>) => {
      state.websiteScrapeLatestLoading = action.payload;
    },
    setWebsiteResearchConfirmModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isWebsiteResearchConfirmModalOpen = action.payload;
    },
    setLeadDeleteConfirmModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isLeadDeleteConfirmModalOpen = action.payload;
      if (!action.payload) {
        state.isDeletingLead = false;
      }
    },
    setIsDeletingLead: (state, action: PayloadAction<boolean>) => {
      state.isDeletingLead = action.payload;
    },
    setAddLeadModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isAddLeadModalOpen = action.payload;
    },
    setFindLeadsModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isFindLeadsModalOpen = action.payload;
    },
    setUncategorizedBatchCategorizing: (state, action: PayloadAction<boolean>) => {
      state.isUncategorizedBatchCategorizing = action.payload;
    },
    setLeadsListFullResearchBatchBusy: (state, action: PayloadAction<boolean>) => {
      state.isLeadsListFullResearchBatchBusy = action.payload;
    },
    setLeadsListSocialSearchBatchBusy: (state, action: PayloadAction<boolean>) => {
      state.isLeadsListSocialSearchBatchBusy = action.payload;
    },
    setLeadsTableRowSummaryBusy: (
      state,
      action: PayloadAction<{ leadId: string; busy: boolean }>
    ) => {
      const { leadId, busy } = action.payload;
      if (!busy) {
        delete state.leadsTableRowSummaryBusyByLeadId[leadId];
      } else {
        state.leadsTableRowSummaryBusyByLeadId[leadId] = true;
      }
    },
    setLeadsTableRowSocialBusy: (
      state,
      action: PayloadAction<{ leadId: string; busy: boolean }>
    ) => {
      const { leadId, busy } = action.payload;
      if (!busy) {
        delete state.leadsTableRowSocialBusyByLeadId[leadId];
      } else {
        state.leadsTableRowSocialBusyByLeadId[leadId] = true;
      }
    },
    reset: () => initialState,
  },
});

export const LeadBuilderActions = leadBuilderSlice.actions;
export default leadBuilderSlice.reducer;
