export type LeadContactStatus =
  | 'not_contacted'
  | 'contacted'
  | 'in_call_log'
  | 'responded'
  | 'not_responded'
  | 'won'
  | 'lost'
  | 'bad_email';

export type LeadContact = {
  id: string;
  lead_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string | null;
  notes: string | null;
  status: LeadContactStatus;
  created_at: string;
  updated_at: string;
};

export type CreateLeadContactInput = {
  lead_id: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  notes?: string;
  status?: LeadContactStatus;
};
