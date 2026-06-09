'use client';

import { useEffect, useMemo } from 'react';
import { Mail, Plus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { LeadContactEmailBuilderActions } from '@/store/builders';
import { CurrentLeadContactEmailActions } from '@/store/current';
import { getLeadSentEmailsByContactIdThunk } from '@/store/thunks/lead-sent-emails';
import { getLeadContactEmailsByContactIdThunk } from '@/store/thunks/lead-contact-emails';
import { formatDateTimeWithTime } from '@/utils/date-time';

export const LeadContactEmails = () => {
  const dispatch = useAppDispatch();
  const currentLeadContact = useAppSelector((s) => s.currentLeadContact);
  const currentLead = useAppSelector((s) => s.currentLead);
  const leadSentEmails = useAppSelector((s) => s.leadSentEmails);
  const leadContactEmails = useAppSelector((s) => s.leadContactEmails);

  const hasSentToContact = useMemo(() => {
    return Object.values(leadSentEmails).some(
      (sent) => sent.lead_contact_id === currentLeadContact.id,
    );
  }, [leadSentEmails, currentLeadContact.id]);

  const emailRows = useMemo(() => {
    return Object.values(leadContactEmails)
      .filter((email) => email.lead_contact_id === currentLeadContact.id)
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      )
      .map((email) => {
        const sentCount = Object.values(leadSentEmails).filter(
          (sent) =>
            sent.lead_contact_id === currentLeadContact.id &&
            sent.lead_email_id === email.id,
        ).length;
        return { email, sentCount };
      });
  }, [leadContactEmails, leadSentEmails, currentLeadContact.id]);

  useEffect(() => {
    if (!currentLeadContact.id) return;
    void dispatch(getLeadSentEmailsByContactIdThunk(currentLeadContact.id));
    void dispatch(getLeadContactEmailsByContactIdThunk(currentLeadContact.id));
  }, [dispatch, currentLeadContact.id]);

  const composeNew = () => {
    dispatch(CurrentLeadContactEmailActions.reset());
    dispatch(
      CurrentLeadContactEmailActions.updateFields({
        lead_id: currentLead?.id ?? '',
        lead_contact_id: currentLeadContact.id,
        subject: '',
      })
    );
    dispatch(LeadContactEmailBuilderActions.setPreviewEmailId(null));
    dispatch(LeadContactEmailBuilderActions.openEmailModal());
  };

  const openExisting = (emailId: string) => {
    const selected = Object.values(leadContactEmails).find((e) => e.id === emailId);
    if (!selected) return;
    dispatch(CurrentLeadContactEmailActions.setEmail(selected));
    dispatch(LeadContactEmailBuilderActions.setPreviewEmailId(selected.id));
    dispatch(LeadContactEmailBuilderActions.openEmailModal());
  };

  return (
    <div className={styles.rail}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Emails</h2>
          <p className={styles.subtitle}>
            {hasSentToContact
              ? 'Open a draft to edit, or create a new email for this contact.'
              : 'Create a draft, then save and send from the composer.'}
          </p>
        </div>
        <div className={styles.headerActions}>
          <button type="button" onClick={composeNew} className={styles.compose}>
            <Plus className={styles.composeIcon} />
            Create new
          </button>
        </div>
      </div>
      {emailRows.length === 0 ? (
        <div className={styles.empty}>
          <Mail className={styles.emptyIcon} />
          <p className={styles.emptyTitle}>No draft emails yet</p>
          <p className={styles.emptyHint}>Create your first email for this contact.</p>
          <div className={styles.emptyActions}>
            <button type="button" onClick={composeNew} className={styles.compose2}>
              Create new
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.list}>
          {emailRows.map(({ email, sentCount }) => (
            <button
              key={email.id}
              type="button"
              className={styles.emailRow}
              onClick={() => openExisting(email.id)}
            >
              <p className={styles.emailSubject}>
                {email.subject.trim() || 'Untitled email'}
              </p>
              <p className={styles.emailMeta}>
                Updated {formatDateTimeWithTime(email.updated_at)} • Sent {sentCount}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  rail: `
    flex h-full min-h-[32rem] min-w-0 flex-col rounded-xl border border-gray-200 bg-white
  `,
  header: `
    flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-5 py-4
  `,
  title: `text-sm font-semibold text-gray-900`,
  subtitle: `mt-1 text-xs text-gray-500`,
  headerActions: `flex flex-wrap items-center gap-2`,
  compose: `
    inline-flex items-center gap-2 rounded-lg bg-orange-600 px-3 py-2 text-xs font-semibold text-white
    hover:bg-orange-700 border-none cursor-pointer
  `,
  composeIcon: `h-4 w-4 shrink-0`,
  empty: `flex flex-1 flex-col items-center justify-center px-4 text-center`,
  emptyIcon: `h-14 w-14 text-gray-200 mb-3`,
  emptyTitle: `text-base font-medium text-gray-900`,
  emptyHint: `text-sm text-gray-500 mt-1 max-w-sm`,
  emptyActions: `mt-4 flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:justify-center`,
  compose2: `
    rounded-lg border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700
    hover:bg-orange-100 cursor-pointer
  `,
  list: `
    min-h-0 flex-1 space-y-2 overflow-y-auto px-3 py-3
  `,
  emailRow: `
    w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-left
    hover:border-orange-200 hover:bg-orange-50/40 cursor-pointer
  `,
  emailSubject: `
    text-sm font-medium text-gray-900
  `,
  emailMeta: `
    mt-1 text-xs text-gray-500
  `,
};
