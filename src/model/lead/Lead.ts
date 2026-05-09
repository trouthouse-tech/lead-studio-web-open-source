export type LeadStatus =
  | 'not_contacted'
  | 'not_answered'
  | 'contacted'
  | 'in_call_log'
  | 'lost'
  | 'archived';

export type WorkflowRecommendation = {
  workflow_name: string;
  reason: string;
};

/**
 * Labeled fields extracted from the website (plain strings; "Unknown" when not inferable).
 * Keys match JSON from mentorai-server website overview.
 */
export type LeadSummaryWebsiteFacts = {
  residential_vs_commercial?: string | null;
  service_area?: string | null;
  years_in_business?: string | null;
  primary_services?: string | null;
  certifications_or_licenses?: string | null;
  team_size?: string | null;
  business_model?: string | null;
};

/**
 * Structured AI output persisted on the lead as JSON (`leads.summary` in Postgres).
 * Populated by website research / business-overview flows alongside `Lead.description`
 * (short prose blurb, also AI).
 */
export type LeadSummary = {
  /** Longer narrative; often overlaps with `Lead.description` — UI prefers `description` for the header blurb. */
  content: string;
  /** Legacy website crawl tags; superseded by `facts` when present. */
  highlights: string[];
  /** Legacy; not shown in Research "At a glance" — use lead-level opportunities elsewhere if needed. */
  opportunities: string[];
  /** Structured key facts (residential vs commercial, service area, etc.). */
  facts?: LeadSummaryWebsiteFacts | null;
  concerns: string[];
  recommended_workflows?: WorkflowRecommendation[];
  generated_at: string;
  source_data: {
    notes_count: number;
    scrapes_count: number;
  };
};

export type Lead = {
  id: string;
  name: string | null;
  business_name: string;
  address: string | null;
  website: string | null;
  /** From Google research; primary site may still be in `website`. */
  website_urls?: string[];
  facebook_url?: string | null;
  /** From API: a `facebook_google_search` row with source `leads_table` exists (list-row one-shot). */
  facebook_google_search_attempted?: boolean;
  /** From API: any `lead_playwright_website_url_discovery` row exists (one Playwright URL discovery per lead). */
  playwright_website_url_discovery_attempted?: boolean;
  /** From API: any `website_scrape_runs` row exists (website crawl / research triggered at least once). */
  website_research_attempted?: boolean;
  instagram_url?: string | null;
  linkedin_url?: string | null;
  google_reviews_url?: string | null;
  has_quote_form: boolean;
  has_chat_bot: boolean;
  has_phone_quote: boolean;
  notes: string | null;
  /**
   * Short AI summary (e.g. 2–3 sentences) from website crawl / research; stored as `leads.description`.
   */
  description: string | null;
  status: LeadStatus;
  archive_reason?: string | null;
  idempotency_key: string;
  search_run_id?: string | null;
  category_id?: string | null;
  category_name?: string | null;
  quality_score?: number | null;
  /** Denormalized opportunity labels (e.g. pipeline tags); not the same as website AI "opportunities". */
  opportunities?: string[];
  /** JSON (`leads.summary`): structured AI extraction — highlights, concerns, workflows, etc. */
  summary?: LeadSummary | null;
  /** Set server-side when crawl, AI description, FB (if URL), and valid contact exist. */
  is_ready_for_lead_digest?: boolean;
  /** Cached AI copy for digest email (ICP + why call). */
  lead_digest_call_reason?: string | null;
  lead_digest_call_reason_generated_at?: string | null;
  created_at: string;
  updated_at: string;
};

export type LeadOpportunityId =
  | 'website_redo'
  | 'admin_automation'
  | 'report_automation'
  | 'software_app';

export const LEAD_OPPORTUNITY_OPTIONS: { id: LeadOpportunityId; label: string }[] = [
  { id: 'website_redo', label: 'Website redo' },
  { id: 'admin_automation', label: 'Admin automation' },
  { id: 'report_automation', label: 'Report automation' },
  { id: 'software_app', label: 'Software app' },
];
