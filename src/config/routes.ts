/**
 * Frontend route paths. Use these instead of hardcoded strings for navigation.
 */
export const FIND_LEADS_PATH = '/leads/find';

export const LEAD_DETAIL_PATH = '/lead-detail-page';

/** Commercial leads → To Call Log */
export const TO_CALL_LOG_PATH = '/leads/to-call-log';

/** Legacy `/lead-emails` — redirects to the queue route */
export const LEAD_EMAILS_PATH = '/lead-emails';

/** Outbound email queue (scheduled / processing) */
export const LEAD_EMAIL_QUEUE_PATH = '/lead-emails/queue';

/** Sent outbound emails */
export const LEAD_SENT_EMAILS_PATH = '/lead-emails/sent';

/** Query: `?leadId=&contactId=` */
export const LEAD_CONTACT_DETAIL_PATH = '/lead-contact-detail-page';

export const buildLeadContactDetailHref = (
  leadId: string,
  contactId: string
): string =>
  `${LEAD_CONTACT_DETAIL_PATH}?leadId=${encodeURIComponent(leadId)}&contactId=${encodeURIComponent(contactId)}`;
