'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { store } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  CurrentLeadContactActions,
  CurrentLeadContactEmailActions,
} from '@/store/current';
import { LeadDetailEmailFabActions } from '@/store/builders';
import { getAllLeadSentEmailsThunk } from '@/store/thunks/lead-sent-emails';
import { getLeadContactEmailsByContactIdThunk } from '@/store/thunks/lead-contact-emails';
import { EmailListItem } from './compose/EmailListItem';
import { LeadContactEmailComposePanel } from './compose/LeadContactEmailComposePanel';
import type { LeadContact } from '@/model/lead-contact';
import type { LeadSentEmail } from '@/model/lead-sent-email';

const EMAIL_FETCH_BATCH = 5;

const sortContactsByCreatedAt = (contacts: LeadContact[]) =>
  [...contacts].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

const normalizeExternalUrl = (raw: string | null | undefined): string | null => {
  const t = raw?.trim();
  if (!t) return null;
  if (/^https?:\/\//i.test(t)) return t;
  return `https://${t}`;
};

export const EmailFab = () => {
  const dispatch = useAppDispatch();
  const lead = useAppSelector((s) => s.currentLead);
  const isExpanded = useAppSelector((s) => s.leadDetailEmailFab.isExpanded);
  const leadContactsRecord = useAppSelector((s) => s.leadContacts);
  const leadContactEmails = useAppSelector((s) => s.leadContactEmails);
  const leadSentEmails = useAppSelector((s) => s.leadSentEmails);
  const currentLeadContact = useAppSelector((s) => s.currentLeadContact);

  const [hydrating, setHydrating] = useState(false);

  const leadId = lead?.id ?? '';
  const contacts = useMemo(() => {
    if (!leadId) return [];
    return sortContactsByCreatedAt(
      Object.values(leadContactsRecord).filter((c) => c.lead_id === leadId)
    );
  }, [leadContactsRecord, leadId]);

  const contactId = currentLeadContact.id;
  const contactIdsKey = useMemo(
    () => contacts.map((c) => c.id).join(','),
    [contacts]
  );

  const emailsForContact = useMemo(() => {
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
    const m: Record<string, LeadSentEmail> = {};
    Object.values(leadSentEmails)
      .filter((se) => se.lead_contact_id === contactId)
      .forEach((se) => {
        m[se.lead_email_id] = se;
      });
    return m;
  }, [leadSentEmails, contactId]);

  const websiteHref = useMemo(
    () => normalizeExternalUrl(lead?.website ?? null),
    [lead?.website]
  );

  const facebookHref = useMemo(
    () => normalizeExternalUrl(lead?.facebook_url ?? null),
    [lead?.facebook_url]
  );

  useEffect(() => {
    if (!leadId) return;
    dispatch(LeadDetailEmailFabActions.resetForLeadChange());
  }, [leadId, dispatch]);

  const bootstrapOnceRef = useRef(false);

  useEffect(() => {
    bootstrapOnceRef.current = false;
  }, [leadId]);

  useEffect(() => {
    if (!isExpanded) {
      bootstrapOnceRef.current = false;
    }
  }, [isExpanded]);

  useEffect(() => {
    if (!isExpanded || !leadId || contacts.length === 0) {
      return;
    }

    let cancelled = false;
    const run = async () => {
      setHydrating(true);
      try {
        const contactsForLead = sortContactsByCreatedAt(
          Object.values(store.getState().leadContacts).filter(
            (c) => c.lead_id === leadId
          )
        );
        if (contactsForLead.length === 0) {
          return;
        }

        await dispatch(getAllLeadSentEmailsThunk());
        if (cancelled) return;

        for (let i = 0; i < contactsForLead.length; i += EMAIL_FETCH_BATCH) {
          if (cancelled) return;
          const batch = contactsForLead.slice(i, i + EMAIL_FETCH_BATCH);
          await Promise.all(
            batch.map((c) => dispatch(getLeadContactEmailsByContactIdThunk(c.id)))
          );
        }
        if (cancelled) return;

        const st = store.getState();
        const contactIdSet = new Set(contactsForLead.map((c) => c.id));
        const hasDraft = Object.values(st.leadContactEmails).some((e) =>
          contactIdSet.has(e.lead_contact_id)
        );
        const hasSent = Object.values(st.leadSentEmails).some((s) =>
          contactIdSet.has(s.lead_contact_id)
        );

        if (!hasDraft && !hasSent) {
          const first = contactsForLead[0];
          if (first && !bootstrapOnceRef.current) {
            bootstrapOnceRef.current = true;
            dispatch(CurrentLeadContactActions.setLeadContact(first));
            dispatch(CurrentLeadContactEmailActions.reset());
            dispatch(
              CurrentLeadContactEmailActions.updateFields({
                lead_id: leadId,
                lead_contact_id: first.id,
              })
            );
          }
          if (cancelled) return;
        } else {
          const cur = st.currentLeadContact;
          const curValid =
            cur.lead_id === leadId &&
            contactsForLead.some((c) => c.id === cur.id);
          const first = contactsForLead[0];

          if (!curValid && first) {
            dispatch(CurrentLeadContactActions.setLeadContact(first));
            const after = store.getState();
            const list = Object.values(after.leadContactEmails)
              .filter((e) => e.lead_contact_id === first.id)
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
            if (list[0]) {
              dispatch(CurrentLeadContactEmailActions.setEmail(list[0]));
            } else {
              dispatch(CurrentLeadContactEmailActions.reset());
              dispatch(
                CurrentLeadContactEmailActions.updateFields({
                  lead_id: leadId,
                  lead_contact_id: first.id,
                })
              );
            }
          } else if (curValid && cur.id) {
            const list = Object.values(store.getState().leadContactEmails)
              .filter((e) => e.lead_contact_id === cur.id)
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
            if (list[0]) {
              dispatch(CurrentLeadContactEmailActions.setEmail(list[0]));
            } else {
              dispatch(CurrentLeadContactEmailActions.reset());
              dispatch(
                CurrentLeadContactEmailActions.updateFields({
                  lead_id: leadId,
                  lead_contact_id: cur.id,
                })
              );
            }
          }
        }
      } finally {
        if (!cancelled) {
          setHydrating(false);
        }
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [isExpanded, leadId, contactIdsKey, contacts.length, dispatch]);

  const handleExpand = useCallback(() => {
    if (!leadId || contacts.length === 0) {
      toast.message('Add a contact to compose email.');
      return;
    }
    dispatch(LeadDetailEmailFabActions.expand());
  }, [dispatch, leadId, contacts.length]);

  const handleCollapse = useCallback(() => {
    dispatch(LeadDetailEmailFabActions.collapse());
  }, [dispatch]);

  const handleContactChange = useCallback(
    (nextId: string) => {
      const c = contacts.find((x) => x.id === nextId);
      if (!c) return;
      dispatch(CurrentLeadContactActions.setLeadContact(c));
      const list = Object.values(store.getState().leadContactEmails)
        .filter((e) => e.lead_contact_id === c.id)
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
      if (list[0]) {
        dispatch(CurrentLeadContactEmailActions.setEmail(list[0]));
      } else {
        dispatch(CurrentLeadContactEmailActions.reset());
        dispatch(
          CurrentLeadContactEmailActions.updateFields({
            lead_id: leadId,
            lead_contact_id: c.id,
          })
        );
      }
    },
    [contacts, dispatch, leadId]
  );

  if (!leadId) {
    return null;
  }

  const fabDisabled = contacts.length === 0;

  return (
    <div className={styles.anchor}>
      {isExpanded ? (
        <div className={styles.shellExpanded}>
          <div className={styles.panel}>
            <div className={styles.chrome}>
              <span className={styles.chromeTitle}>Email</span>
              <div className={styles.chromeRight}>
                {websiteHref ? (
                  <a
                    href={websiteHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.textLink}
                  >
                    Website
                  </a>
                ) : null}
                {facebookHref ? (
                  <a
                    href={facebookHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.textLink}
                  >
                    Facebook
                  </a>
                ) : null}
                <button
                  type="button"
                  className={styles.iconBtn}
                  aria-label="Minimize"
                  onClick={handleCollapse}
                >
                  <ChevronDown className={styles.iconBtnGlyph} aria-hidden />
                </button>
              </div>
            </div>
            {contacts.length > 1 ? (
              <label className={styles.contactField}>
                <span className={styles.contactLabel}>Contact</span>
                <select
                  className={styles.contactSelect}
                  value={contactId}
                  onChange={(e) => handleContactChange(e.target.value)}
                >
                  {contacts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name || 'Contact'}
                      {c.email ? ` · ${c.email}` : ''}
                    </option>
                  ))}
                </select>
              </label>
            ) : contacts.length === 1 ? (
              <div className={styles.contactReadonly}>
                <span className={styles.contactLabel}>Contact</span>
                <span className={styles.contactReadonlyVal}>
                  {contacts[0].name || 'Contact'}
                  {contacts[0].email ? ` · ${contacts[0].email}` : ''}
                </span>
              </div>
            ) : null}

            {hydrating ? (
              <p className={styles.hydrating}>Loading…</p>
            ) : null}

            <div className={styles.mainSplit}>
              <div className={styles.composeWrap}>
                <LeadContactEmailComposePanel variant="fab" />
              </div>
              <aside className={styles.timeline} aria-label="Email activity">
                <h3 className={styles.timelineTitle}>
                  Activity ({emailsForContact.length})
                </h3>
                <div className={styles.timelineScroll}>
                  {emailsForContact.length === 0 ? (
                    <p className={styles.timelineEmpty}>No emails yet.</p>
                  ) : (
                    emailsForContact.map((email) => (
                      <EmailListItem
                        key={email.id}
                        email={email}
                        sentRecord={sentByEmailId[email.id] ?? null}
                      />
                    ))
                  )}
                </div>
              </aside>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className={styles.fab}
          disabled={fabDisabled}
          aria-label="Open email composer"
          title={fabDisabled ? 'Add a contact first' : 'Email'}
          onClick={handleExpand}
        >
          <Mail className={styles.fabIcon} aria-hidden />
        </button>
      )}
    </div>
  );
};

const styles = {
  anchor: `fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none`,
  shellExpanded: `
    pointer-events-auto transition-all duration-300 ease-out
    w-[min(100vw-1.5rem,840px)] max-h-[min(100vh-4rem,1280px)]
  `,
  panel: `
    flex flex-col min-h-0 w-full h-[min(100vh-4rem,1280px)] max-h-[min(100vh-4rem,1280px)]
    rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden
  `,
  chrome: `
    flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-100
    bg-gray-50 shrink-0
  `,
  chromeTitle: `text-sm font-semibold text-gray-900 shrink-0`,
  chromeRight: `flex items-center gap-4 shrink-0`,
  textLink: `
    text-sm font-medium text-blue-600 hover:text-blue-800 underline-offset-2
    hover:underline
  `,
  iconBtn: `
    p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-200/80
    border-none bg-transparent cursor-pointer
  `,
  iconBtnGlyph: `h-5 w-5`,
  contactField: `px-4 pt-3 pb-2 flex flex-col gap-1 shrink-0`,
  contactLabel: `text-xs font-semibold text-gray-500 uppercase tracking-wide`,
  contactSelect: `
    text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-900
  `,
  contactReadonly: `px-4 pt-3 pb-2 flex flex-col gap-1 shrink-0`,
  contactReadonlyVal: `text-sm text-gray-800`,
  hydrating: `px-4 text-sm text-gray-500 shrink-0`,
  mainSplit: `
    flex flex-row flex-1 min-h-0 min-w-0 overflow-hidden
  `,
  composeWrap: `
    flex flex-col flex-1 min-w-0 min-h-0 overflow-hidden
  `,
  timeline: `
    flex flex-col min-h-0 w-[min(32%,300px)] min-w-[220px] max-w-[320px] shrink-0
    border-l border-gray-100 pl-3 pr-2 pt-2 pb-3
  `,
  timelineTitle: `text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2 shrink-0`,
  timelineScroll: `min-h-0 flex-1 overflow-y-auto pr-1 -mr-1`,
  timelineEmpty: `text-sm text-gray-500 italic py-2`,
  fab: `
    pointer-events-auto flex items-center justify-center shrink-0
    w-14 h-14 rounded-full shadow-lg border border-blue-200
    bg-blue-600 text-white hover:bg-blue-700 cursor-pointer
    disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-blue-600
    transition-transform duration-300 ease-out hover:scale-105
  `,
  fabIcon: `h-6 w-6`,
};
