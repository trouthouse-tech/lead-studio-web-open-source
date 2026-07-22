/**
 * Frontend route paths. Use these instead of hardcoded strings for navigation.
 */
export { DASHBOARD_PATH } from './landing-links';

export const FIND_LEADS_PATH = '/leads/find';

export const LEAD_DETAIL_PATH = '/lead-detail-page';

/** Commercial leads → Call List */
export const TO_CALL_LOG_PATH = '/leads/to-call-log';

/** Legacy `/lead-emails` — redirects to the queue route */
export const LEAD_EMAILS_PATH = '/lead-emails';

/** Outbound email queue (scheduled / processing) */
export const LEAD_EMAIL_QUEUE_PATH = '/lead-emails/queue';

/** Sent outbound emails */
export const LEAD_SENT_EMAILS_PATH = '/lead-emails/sent';

/** Workspace service account setup (read-only docs in app) */
export const EMAIL_SETUP_PATH = '/settings/email';

/** Cold email outreach offerings catalog */
export const COLD_EMAIL_OFFERINGS_PATH = '/settings/cold-email-offerings';

/** Static contact detail — identity in Redux `currentLeadContact` (ADR 008) */
export const LEAD_CONTACT_DETAIL_PATH = '/lead-contact-detail-page';
