'use client';

import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { LeadContactEmails } from '../emails/LeadContactEmails';
import { LeadContactBuilderColumnHeader } from './header';

type ProfileLink = {
  label: string;
  url: string | null | undefined;
};

/**
 * Builder column: contact header + business context, profiles, emails (mirrors YouTube studio builder).
 */
export const LeadContactBuilderColumn = () => {
  const currentLead = useAppSelector((state) => state.currentLead);

  const profileLinks = useMemo<ProfileLink[]>(
    () => [
      { label: 'Facebook', url: currentLead?.facebook_url },
      { label: 'Instagram', url: currentLead?.instagram_url },
      { label: 'LinkedIn', url: currentLead?.linkedin_url },
      { label: 'Google Reviews', url: currentLead?.google_reviews_url },
    ],
    [currentLead],
  );

  const availableProfileLinks = profileLinks.filter((link) => Boolean(link.url?.trim()));

  return (
    <div className={styles.column}>
      <LeadContactBuilderColumnHeader />
      <div className={styles.scroll}>
        <div className={styles.cardGrid}>
          <section className={styles.card}>
            <h3 className={styles.cardTitle}>Business Summary</h3>
            <p className={styles.businessName}>
              {currentLead?.business_name?.trim() || currentLead?.name?.trim() || 'Unknown business'}
            </p>
            <p className={styles.summaryText}>
              {currentLead?.description?.trim() || 'No summary available yet.'}
            </p>
          </section>

          <section className={styles.card}>
            <h3 className={styles.cardTitle}>Online Profiles</h3>
            <div className={styles.profileList}>
              {availableProfileLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.url || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.profileLinkButton}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </section>

          <section className={styles.emailCard}>
            <LeadContactEmails />
          </section>
        </div>
      </div>
    </div>
  );
};

const styles = {
  column: `
    flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden
  `,
  scroll: `
    flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-y-contain px-1 py-4
  `,
  cardGrid: `grid grid-cols-1 gap-4`,
  card: `
    rounded-xl border border-gray-200 bg-white p-5 shadow-sm
  `,
  emailCard: `min-w-0`,
  cardTitle: `text-sm font-semibold text-gray-900`,
  businessName: `
    mt-2 text-base font-medium text-gray-900
  `,
  summaryText: `
    mt-1 text-sm leading-6 text-gray-700
  `,
  profileList: `mt-3 flex flex-wrap items-center gap-3`,
  profileLinkButton: `
    border-none bg-transparent p-0 text-sm font-medium text-blue-600
    cursor-pointer hover:underline
  `,
} as const;
