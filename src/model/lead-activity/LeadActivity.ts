export type LeadActivityType = 'lead_opened';

export type LeadActivity = {
  id: string;
  lead_id: string;
  customer_id: string;
  customer_name: string;
  activity_type: LeadActivityType;
  created_at: string;
};
