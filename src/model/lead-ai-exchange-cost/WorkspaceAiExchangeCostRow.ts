import type { LeadAiExchangeCostSource } from './LeadAiExchangeCostRow';

export type WorkspaceAiExchangeCostRow = {
  id: string;
  lead_id: string;
  lead_business_name: string;
  source: LeadAiExchangeCostSource;
  label: string;
  created_at: string;
  input_tokens: number;
  output_tokens: number;
  model_used: string;
};
