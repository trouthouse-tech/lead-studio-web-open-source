export type ToCallLogStatus = 'queued' | 'called' | 'skipped' | 'voicemail';

export type ToCallLog = {
  id: string;
  lead_id: string;
  lead_contact_id: string;
  lead_contact_email_queue_id: string | null;
  /** Prep before the call */
  notes: string;
  /** During or right after the live call (omitted until migration 115 is applied) */
  call_notes?: string | null;
  call_status: ToCallLogStatus;
  called_at: string | null;
  created_at: string;
  updated_at: string;
};
