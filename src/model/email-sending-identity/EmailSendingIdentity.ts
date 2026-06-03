/**
 * Public row from GET /api/data/email-sending-identities (From picker).
 */
export type EmailSendingIdentity = {
  id: string;
  label: string;
  from_email: string;
  sort_order: number;
};
