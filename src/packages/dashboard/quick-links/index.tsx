'use client';

import Link from 'next/link';
import { Users, Mail, Phone, Send, UserCircle } from 'lucide-react';
import {
  LEAD_EMAIL_QUEUE_PATH,
  LEAD_SENT_EMAILS_PATH,
  TO_CALL_LOG_PATH,
} from '@/config/routes';

const LINKS = [
  {
    label: 'Commercial leads',
    description: 'View your pipeline',
    href: '/leads',
    Icon: Users,
  },
  {
    label: 'Call List',
    description: 'Queued calls',
    href: TO_CALL_LOG_PATH,
    Icon: Phone,
  },
  {
    label: 'Lead contacts',
    description: 'People and roles',
    href: '/lead-contacts',
    Icon: UserCircle,
  },
  {
    label: 'Email queue',
    description: 'Scheduled outbound sends',
    href: LEAD_EMAIL_QUEUE_PATH,
    Icon: Mail,
  },
  {
    label: 'Sent emails',
    description: 'Delivery history',
    href: LEAD_SENT_EMAILS_PATH,
    Icon: Send,
  },
] as const;

export const DashboardQuickLinks = () => {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Quick links</h2>
      <div className={styles.grid}>
        {LINKS.map(({ label, description, href, Icon }) => (
          <Link key={href} href={href} className={styles.card}>
            <div className={styles.iconWrap}>
              <Icon className={styles.icon} aria-hidden />
            </div>
            <div className={styles.text}>
              <p className={styles.label}>{label}</p>
              <p className={styles.desc}>{description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

const styles = {
  section: ``,
  heading: `
    text-sm font-medium text-slate-500 mb-3
  `,
  grid: `
    grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3
  `,
  card: `
    flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4
    hover:shadow-sm transition-shadow
  `,
  iconWrap: `
    flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-100
  `,
  icon: `
    h-4 w-4 text-slate-600
  `,
  text: `
    min-w-0
  `,
  label: `
    text-sm font-medium text-slate-900 truncate
  `,
  desc: `
    text-xs text-slate-500 truncate
  `,
};
