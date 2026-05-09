export type OneTimeCostCategory = 'prepaid_credit' | 'hardware' | 'software' | 'other';

export type OneTimeCost = {
  id: string;
  vendor: string;
  description: string | null;
  amount_cents: number;
  currency: string;
  purchased_at: string;
  category: OneTimeCostCategory;
  notes: string | null;
  created_at: string;
  updated_at: string;
};
