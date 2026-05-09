export type RecurringCostBillingInterval = 'monthly' | 'yearly' | 'weekly' | 'custom';

export type RecurringCost = {
  id: string;
  name: string;
  vendor: string | null;
  amount_cents: number;
  billing_interval: RecurringCostBillingInterval;
  interval_months: number | null;
  currency: string;
  started_at: string;
  next_renewal_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
};
