'use client';

import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { EmailListItem } from './components/EmailListItem';
import { EmailPreviewPanel } from './components/EmailPreviewPanel';

export const SentEmailsPanel = () => {
  const currentLeadContact = useAppSelector((s) => s.currentLeadContact);
  const leadSentEmails = useAppSelector((s) => s.leadSentEmails);
  const leadContactEmails = useAppSelector((s) => s.leadContactEmails);
  const previewEmailId = useAppSelector(
    (s) => s.leadContactEmailBuilder.previewEmailId
  );
  const contactId = currentLeadContact.id;

  const emails = useMemo(() => {
    return Object.values(leadContactEmails)
      .filter((e) => e.lead_contact_id === contactId)
      .sort((a, b) => {
        const da =
          typeof a.created_at === 'string'
            ? new Date(a.created_at)
            : a.created_at;
        const db =
          typeof b.created_at === 'string'
            ? new Date(b.created_at)
            : b.created_at;
        return db.getTime() - da.getTime();
      });
  }, [leadContactEmails, contactId]);

  const sentByEmailId = useMemo(() => {
    const m: Record<string, (typeof leadSentEmails)[string]> = {};
    Object.values(leadSentEmails)
      .filter((se) => se.lead_contact_id === contactId)
      .forEach((se) => {
        m[se.lead_email_id] = se;
      });
    return m;
  }, [leadSentEmails, contactId]);

  const previewEmail = useMemo(
    () => emails.find((e) => e.id === previewEmailId) ?? null,
    [emails, previewEmailId]
  );

  const previewSentRecord = previewEmail
    ? sentByEmailId[previewEmail.id] ?? null
    : null;

  return (
    <div className={styles.panel}>
      <div className={styles.listColumn}>
        <div className={styles.listHeader}>
          <span className={styles.count}>{emails.length} saved</span>
        </div>
        <div className={styles.list}>
          {emails.length === 0 ? (
            <p className={styles.empty}>No saved emails yet.</p>
          ) : (
            emails.map((email) => (
              <EmailListItem
                key={email.id}
                email={email}
                sentRecord={sentByEmailId[email.id] ?? null}
                isSelected={previewEmailId === email.id}
              />
            ))
          )}
        </div>
      </div>
      <div className={styles.previewColumn}>
        <EmailPreviewPanel
          email={previewEmail}
          sentRecord={previewSentRecord}
        />
      </div>
    </div>
  );
};

const styles = {
  panel: `
    flex-1 min-h-0 grid grid-cols-1 md:grid-cols-[minmax(220px,280px)_1fr]
  `,
  listColumn: `
    flex flex-col min-h-0 border-b md:border-b-0 md:border-r border-gray-200 bg-slate-50/80
  `,
  listHeader: `
    shrink-0 px-4 py-2 border-b border-gray-100
  `,
  count: `text-xs font-medium text-gray-500`,
  list: `flex-1 min-h-0 overflow-y-auto p-3`,
  empty: `text-sm text-gray-500 italic py-4 px-1`,
  previewColumn: `min-h-0 min-w-0 overflow-hidden`,
};
