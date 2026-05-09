import type { LeadCostType } from './types';

export type { LeadCostType } from './types';
export type { LeadCostLine, LeadCostLineAi, LeadCostLineLedger } from './LeadCostLine';

export type LeadCost = {
  id: string;
  lead_id: string;
  type: LeadCostType;
  description: string | null;
  cost_cents: number;
  entry_source?: 'user' | 'ai';
  created_at: string;
};
