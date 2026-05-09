import { redirect } from 'next/navigation';
import { LEAD_EMAIL_QUEUE_PATH } from '@/config/routes';

/**
 * `/lead-emails` redirects to the queue surface (bookmarks / old links).
 */
export default function LeadEmailsIndexPage() {
  redirect(LEAD_EMAIL_QUEUE_PATH);
}
