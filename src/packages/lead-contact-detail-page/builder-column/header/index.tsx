'use client';

import { useAppSelector } from '@/store/hooks';
import { ContactMenu } from '../../components/ContactMenu';
import { StatusDropdown } from '../../components/StatusDropdown';

/**
 * Contact name, role, comms, and actions — top of the builder column (studio context bar).
 */
export const LeadContactBuilderColumnHeader = () => {
  const currentLeadContact = useAppSelector((s) => s.currentLeadContact);

  const email = currentLeadContact.email?.trim() || 'No email';
  const phone = currentLeadContact.phone?.trim() || 'No phone';

  return (
    <div className={styles.wrap}>
      <div className={styles.bar}>
        <div className={styles.titleBlock}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{currentLeadContact.name || 'Unnamed contact'}</h1>
            {currentLeadContact.role ? (
              <span className={styles.role}>{currentLeadContact.role}</span>
            ) : null}
          </div>
          <p className={styles.comms}>
            {currentLeadContact.email?.trim() ? (
              <a href={`mailto:${currentLeadContact.email.trim()}`} className={styles.link}>
                {email}
              </a>
            ) : (
              <span>{email}</span>
            )}
            <span className={styles.dot} aria-hidden>
              ·
            </span>
            {currentLeadContact.phone?.trim() ? (
              <a href={`tel:${currentLeadContact.phone.trim()}`} className={styles.link}>
                {phone}
              </a>
            ) : (
              <span>{phone}</span>
            )}
          </p>
        </div>
        <div className={styles.actions}>
          <StatusDropdown />
          <ContactMenu />
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrap: `shrink-0 border-b border-gray-200 bg-white px-4 py-3`,
  bar: `
    flex flex-wrap items-start justify-between gap-3
  `,
  titleBlock: `
    min-w-0 flex-1 flex flex-col gap-1.5
  `,
  titleRow: `
    flex flex-wrap items-center gap-1.5 min-w-0
  `,
  title: `
    text-sm font-semibold text-gray-900 truncate
  `,
  role: `
    text-[11px] font-medium text-gray-600 truncate
  `,
  actions: `
    flex shrink-0 items-center gap-1.5
  `,
  comms: `
    text-xs text-gray-600 leading-snug
  `,
  link: `
    text-blue-600 hover:underline
  `,
  dot: `
    mx-1.5 text-gray-400
  `,
} as const;
