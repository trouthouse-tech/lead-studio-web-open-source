export type LeadContactActivityType = 'lead_contact_opened';

export type LeadContactActivity = {
  id: string;
  lead_contact_id: string;
  lead_id: string;
  customer_id: string;
  customer_name: string;
  activity_type: LeadContactActivityType;
  created_at: string;
};
