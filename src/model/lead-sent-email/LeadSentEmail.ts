export type LeadSentEmailStatus =
  | 'sent'
  | 'responded_won'
  | 'responded_lost'
  | 'not_responded';

export type LeadSentEmailDeliveryStatus =
  | 'sent'
  | 'delivered'
  | 'bounced'
  | 'deferred'
  | 'opened';

export type LeadSentEmail = {
  id: string;
  lead_email_id: string;
  lead_contact_id: string;
  /** Email Persona Studio profile id used when the outbound was composed or sent, if known. */
  persona_id: string | null;
  campaign_id: string | null;
  campaign_email_variation_id: string | null;
  status: LeadSentEmailStatus;
  sent_at: Date | string;
  created_at: Date | string;
  updated_at: Date | string;
  from_name?: string | null;
  from_email?: string | null;
  email_sending_identity_id?: string | null;
  variation_id?: number | null;
  /** Gmail API message id. */
  sg_message_id?: string | null;
  opened_at?: Date | string | null;
  opened_count?: number | null;
  /** Delivery lifecycle: sent, delivered, bounced, deferred, opened */
  delivery_status?: LeadSentEmailDeliveryStatus | null;
  cold_email_offering_id?: string | null;
  cold_email_offering?: {
    id: string;
    title: string;
    hook: string;
  } | null;
};
