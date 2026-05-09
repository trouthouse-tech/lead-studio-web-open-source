import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/** Minimal CMS page row for optional marketing/site features (not exported from model). */
type SitePage = {
  slug: string;
  title?: string;
};

type SiteContentState = {
  sitePages: SitePage[];
  hasFetchedSitePages: boolean;
  activePageSlug: string | null;
  isSitePagesLoading: boolean;
  isPageContentLoading: boolean;
};

const initialState: SiteContentState = {
  sitePages: [],
  hasFetchedSitePages: false,
  activePageSlug: null,
  isSitePagesLoading: false,
  isPageContentLoading: false,
};

export const siteContentSlice = createSlice({
  name: 'siteContent',
  initialState,
  reducers: {
    resetSiteContent: () => initialState,
    setSitePages: (state, action: PayloadAction<SitePage[]>) => {
      state.sitePages = action.payload;
    },
    setHasFetchedSitePages: (state, action: PayloadAction<boolean>) => {
      state.hasFetchedSitePages = action.payload;
    },
    setActivePageSlug: (state, action: PayloadAction<string | null>) => {
      state.activePageSlug = action.payload;
    },
    setIsSitePagesLoading: (state, action: PayloadAction<boolean>) => {
      state.isSitePagesLoading = action.payload;
    },
    setIsPageContentLoading: (state, action: PayloadAction<boolean>) => {
      state.isPageContentLoading = action.payload;
    },
  },
});

export const SiteContentActions = siteContentSlice.actions;
export default siteContentSlice.reducer;
