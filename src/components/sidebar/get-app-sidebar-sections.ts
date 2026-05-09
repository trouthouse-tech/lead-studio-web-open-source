import {
  FIND_LEADS_PATH,
  LEAD_EMAIL_QUEUE_PATH,
  LEAD_SENT_EMAILS_PATH,
  TO_CALL_LOG_PATH,
} from '@/config/routes';
import type { SidebarSection } from './types';

/**
 * Lead Studio nav sections (dashboard + commercial leads workflow).
 */
export const getAppSidebarSections = (): SidebarSection[] => [
  {
    title: 'Lead Studio',
    links: [
      { name: 'Dashboard', href: '/' },
      { name: 'Find leads', href: FIND_LEADS_PATH },
      { name: 'Commercial leads', href: '/leads' },
      { name: 'To Call Log', href: TO_CALL_LOG_PATH },
      { name: 'Lead contacts', href: '/lead-contacts' },
      { name: 'Email queue', href: LEAD_EMAIL_QUEUE_PATH },
      { name: 'Sent emails', href: LEAD_SENT_EMAILS_PATH },
    ],
  },
];
