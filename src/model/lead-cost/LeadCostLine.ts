import type { LeadCostType } from './types';

export type LeadCostLineAi = {
  kind: 'ai_exchange';
  id: string;
  label: string;
  created_at: string;
  cost_cents: number;
  input_tokens: number;
  output_tokens: number;
  model_used: string;
  input_cost_per_million_usd: number | null;
  output_cost_per_million_usd: number | null;
};

export type LeadCostLineLedger = {
  kind: 'ledger';
  id: string;
  label: string;
  created_at: string;
  cost_cents: number;
  entry_source: 'user' | 'ai';
  ledger_type: LeadCostType;
  description: string;
};

export type LeadCostLine = LeadCostLineAi | LeadCostLineLedger;
