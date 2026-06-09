'use client';

import { useMemo } from 'react';
import { Building2, Globe, Mail, Phone, User } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { formatPhoneNumber } from '@/utils/string';
import { NotesList } from './components/NotesList';

type ProfileLink = {
  label: string;
  url: string;
};

const normalizeExternalUrl = (raw: string | null | undefined): string | null => {
  const t = raw?.trim();
  if (!t) return null;
  if (/^https?:\/\//i.test(t)) return t;
  return `https://${t}`;
};

export const LeadContactInfoPanel = () => {
  const currentLead = useAppSelector((s) => s.currentLead);
  const currentLeadContact = useAppSelector((s) => s.currentLeadContact);

  const profileLinks = useMemo<ProfileLink[]>(() => {
    const links: ProfileLink[] = [];
    const website = normalizeExternalUrl(currentLead?.website ?? null);
    if (website) links.push({ label: 'Website', url: website });

    const extra = [
      { label: 'Facebook', url: currentLead?.facebook_url },
      { label: 'Instagram', url: currentLead?.instagram_url },
      { label: 'LinkedIn', url: currentLead?.linkedin_url },
      { label: 'Google Reviews', url: currentLead?.google_reviews_url },
    ];
    extra.forEach(({ label, url }) => {
      const href = normalizeExternalUrl(url ?? null);
      if (href) links.push({ label, url: href });
    });
    return links;
  }, [currentLead]);

  const businessName =
    currentLead?.business_name?.trim() ||
    currentLead?.name?.trim() ||
    'Unknown business';

  return (
    <div className={styles.panel}>
      <section className={styles.section}>
        <h3 className={styles.h}>Business</h3>
        <div className={styles.row}>
          <Building2 className={styles.ico} />
          <span className={styles.val}>{businessName}</span>
        </div>
        {currentLead?.description?.trim() ? (
          <p className={styles.summary}>{currentLead.description.trim()}</p>
        ) : null}
      </section>

      {profileLinks.length > 0 ? (
        <section className={styles.section}>
          <h3 className={styles.h}>Links</h3>
          <div className={styles.links}>
            {profileLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkBtn}
              >
                <Globe className={styles.linkIco} />
                {link.label}
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <section className={styles.section}>
        <h3 className={styles.h}>Contact</h3>
        <div className={styles.contactRows}>
          <div className={styles.row}>
            <User className={styles.ico} />
            <span className={styles.val}>
              {currentLeadContact.name || '—'}
            </span>
          </div>
          {currentLeadContact.email ? (
            <div className={styles.row}>
              <Mail className={styles.ico} />
              <a
                href={`mailto:${currentLeadContact.email}`}
                className={styles.link}
              >
                {currentLeadContact.email}
              </a>
            </div>
          ) : null}
          {currentLeadContact.phone ? (
            <div className={styles.row}>
              <Phone className={styles.ico} />
              <a
                href={`tel:${currentLeadContact.phone}`}
                className={styles.link}
              >
                {formatPhoneNumber(currentLeadContact.phone)}
              </a>
            </div>
          ) : null}
        </div>
      </section>

      <section className={styles.notesSection}>
        <NotesList />
      </section>
    </div>
  );
};

const styles = {
  panel: `
    shrink-0 border-b border-gray-100 bg-slate-50/80 px-6 py-4
    grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4
  `,
  section: `min-w-0`,
  notesSection: `min-w-0 md:col-span-2 xl:col-span-1`,
  h: `text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2`,
  row: `flex items-center gap-2 text-sm`,
  contactRows: `space-y-2`,
  ico: `h-4 w-4 text-gray-400 shrink-0`,
  val: `text-gray-900 truncate`,
  summary: `mt-2 text-xs text-gray-600 line-clamp-3 leading-relaxed`,
  links: `flex flex-wrap gap-2`,
  linkBtn: `
    inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-blue-700
    bg-white rounded-lg border border-blue-100 hover:bg-blue-50
  `,
  linkIco: `h-3.5 w-3.5 shrink-0`,
  link: `text-sm text-blue-600 hover:underline truncate`,
};
