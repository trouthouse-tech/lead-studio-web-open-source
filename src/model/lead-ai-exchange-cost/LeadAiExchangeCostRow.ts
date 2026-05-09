export type LeadAiExchangeCostSource =
  | 'lead_contact_chat'
  | 'lead_website_ai'
  | 'lead_google_search_ai'
  | 'lead_facebook_posts_ai'
  | 'lead_contact_email_draft_ai'
  | 'services_studio_coach';

export type LeadAiExchangeCostRow = {
  id: string;
  source: LeadAiExchangeCostSource;
  label: string;
  created_at: string;
  input_tokens: number;
  output_tokens: number;
  model_used: string;
};
