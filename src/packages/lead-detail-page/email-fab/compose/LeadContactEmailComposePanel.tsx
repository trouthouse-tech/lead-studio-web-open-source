'use client';

// FAB compose UI; canonical twin lives in `lead-contact-detail-page/email-modal/LeadContactEmailComposePanel`.
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { DateTime } from 'luxon';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { CurrentLeadContactEmailActions } from '@/store/current';
import { LeadContactEmailBuilderActions } from '@/store/builders';
import {
  getLeadContactEmailsByContactIdThunk,
  saveCurrentLeadContactEmailThunk,
} from '@/store/thunks/lead-contact-emails';
import { getLeadSentEmailsByContactIdThunk } from '@/store/thunks/lead-sent-emails';
import { getAllLeadContactEmailQueueThunk } from '@/store/thunks/lead-contact-email-queue';
import { updateLeadContactStatusThunk } from '@/store/thunks/lead-contacts';
import { updateLeadThunk } from '@/store/thunks/leads';
import type { AddToQueueScheduleFor } from '@/api/lead-contact-email-queue';
import {
  countQueuedByEstDay,
  findNextEstDayUnderCap,
  MAX_QUEUED_EMAILS_PER_EST_DAY,
} from '@/utils/lead-contact-email-queue';
import { addLeadContactEmailToQueueThunk } from '@/store/thunks/lead-contact-email-queue';
import {
  sendLeadContactEmailNowThunk,
  uploadLeadContactEmailAttachmentThunk,
} from '@/store/thunks/lead-contact-emails';
import { tiptapContentToPlainText } from '@/utils/content';
import {
  EmailSubjectInput,
  EmailBodyInput,
  EmailAttachmentInput,
  EmailSendingIdentitySelect,
} from './inputs';

type Props = {
  /** `drawer` matches `fab` layout (toast on save, compact actions) for the sent-emails right panel. */
  variant: 'modal' | 'fab' | 'drawer';
  onCancel?: () => void;
};

export const LeadContactEmailComposePanel = (props: Props) => {
  const { variant, onCancel } = props;
  const dispatch = useAppDispatch();
  const currentLead = useAppSelector((s) => s.currentLead);
  const currentLeadContact = useAppSelector((s) => s.currentLeadContact);
  const currentEmail = useAppSelector((s) => s.currentLeadContactEmail);
  const isSaving = useAppSelector((s) => s.leadContactEmailBuilder.isSaving);
  const queueItemsById = useAppSelector((s) => s.leadContactEmailQueue);

  const leadId = currentLead.id;
  const contactId = currentLeadContact.id;
  const contactName = currentLeadContact.name;
  const contactEmailAddr = currentLeadContact.email;

  const [sending, setSending] = useState(false);
  const [queuing, setQueuing] = useState(false);
  const [queueMenuOpen, setQueueMenuOpen] = useState(false);
  const [customDate, setCustomDate] = useState('');
  const queueMenuRef = useRef<HTMLDivElement>(null);
  const queueMenuWasOpenRef = useRef(false);

  const queuedCountsByEstDay = useMemo(
    () => countQueuedByEstDay(Object.values(queueItemsById)),
    [queueItemsById]
  );

  const estNow = DateTime.now().setZone('America/New_York');
  const todayYmd = estNow.toFormat('yyyy-MM-dd');
  const tomorrowYmd = estNow.plus({ days: 1 }).toFormat('yyyy-MM-dd');
  const todayQueued = queuedCountsByEstDay.get(todayYmd) ?? 0;
  const tomorrowQueued = queuedCountsByEstDay.get(tomorrowYmd) ?? 0;

  useEffect(() => {
    if (!contactId) return;
    void dispatch(getLeadContactEmailsByContactIdThunk(contactId));
    void dispatch(getLeadSentEmailsByContactIdThunk(contactId));
  }, [contactId, dispatch]);

  useEffect(() => {
    const wasOpen = queueMenuWasOpenRef.current;
    queueMenuWasOpenRef.current = queueMenuOpen;
    if (!queueMenuOpen || wasOpen) return;
    void dispatch(getAllLeadContactEmailQueueThunk());
    setCustomDate(
      DateTime.now().setZone('America/New_York').plus({ days: 1 }).toFormat('yyyy-MM-dd')
    );
  }, [queueMenuOpen, dispatch]);

  useEffect(() => {
    if (!queueMenuOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      const el = queueMenuRef.current;
      if (el && !el.contains(e.target as Node)) {
        setQueueMenuOpen(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [queueMenuOpen]);

  useEffect(() => {
    if (!queueMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setQueueMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [queueMenuOpen]);

  const handleSave = async () => {
    if (!currentEmail.subject.trim()) {
      alert('Please enter a subject.');
      return;
    }
    if (!leadId || !contactId) return;

    dispatch(LeadContactEmailBuilderActions.setSaving(true));
    const pendingFile = currentEmail.pendingAttachmentFile;

    const result = await dispatch(
      saveCurrentLeadContactEmailThunk({
        id: currentEmail.id || undefined,
        lead_id: leadId,
        lead_contact_id: contactId,
        subject: currentEmail.subject,
        body: currentEmail.body,
        campaign_ids: currentEmail.campaign_ids,
        email_sending_identity_id: currentEmail.email_sending_identity_id.trim()
          ? currentEmail.email_sending_identity_id.trim()
          : null,
      })
    );

    const ok =
      result && typeof result === 'object' && 'status' in result && result.status === 200;
    const savedEmail =
      ok && 'email' in result && result.email ? result.email : null;
    const emailId = savedEmail?.id ?? currentEmail.id;

    if (ok && savedEmail) {
      let newAttId: string | null = null;
      if (pendingFile && emailId) {
        const up = await dispatch(
          uploadLeadContactEmailAttachmentThunk({
            file: pendingFile,
            lead_contact_email_id: emailId,
            lead_id: leadId,
            lead_contact_id: contactId,
          }),
        );
        if (up.status === 200 && up.data) {
          newAttId = up.data.id;
        }
        dispatch(CurrentLeadContactEmailActions.setPendingAttachmentFile(null));
      }

      if (variant === 'fab' || variant === 'drawer') {
        toast.success('Email saved');
      } else {
        dispatch(LeadContactEmailBuilderActions.showSaveToast('Email saved'));
        setTimeout(() => {
          dispatch(LeadContactEmailBuilderActions.hideSaveToast());
        }, 2800);
      }

      const nextIds = newAttId
        ? [...currentEmail.attachment_ids, newAttId]
        : currentEmail.attachment_ids;
      dispatch(
        CurrentLeadContactEmailActions.updateFields({
          id: savedEmail.id,
          lead_id: savedEmail.lead_id,
          lead_contact_id: savedEmail.lead_contact_id,
          subject: savedEmail.subject,
          body: savedEmail.body,
          campaign_ids: savedEmail.campaign_ids ?? [],
          email_sending_identity_id: savedEmail.email_sending_identity_id ?? '',
          attachment_ids: nextIds,
          pendingAttachmentFile: null,
        })
      );
    }

    dispatch(LeadContactEmailBuilderActions.setSaving(false));
  };

  const handleSendNow = async () => {
    if (!currentEmail.id) {
      alert('Save the email first.');
      return;
    }
    if (!confirm('Send this email now?')) return;
    setSending(true);
    try {
      const res = await dispatch(
        sendLeadContactEmailNowThunk({
          lead_contact_email_id: currentEmail.id,
          persona_id: null,
        }),
      );
      if (res.ok) {
        await dispatch(updateLeadContactStatusThunk(contactId, 'contacted'));
        if (leadId) {
          await dispatch(updateLeadThunk(leadId, { status: 'contacted' }));
        }
        alert('Sent.');
        void dispatch(getLeadSentEmailsByContactIdThunk(contactId));
      } else {
        alert(res.error || 'Send failed');
      }
    } finally {
      setSending(false);
    }
  };

  const enqueueCustomEmail = async (params: {
    schedule_for: AddToQueueScheduleFor;
    schedule_date?: string;
  }) => {
    const res = await dispatch(
      addLeadContactEmailToQueueThunk({
        lead_contact_id: contactId,
        lead_id: leadId,
        persona_id: null,
        lead_contact_email_id: currentEmail.id,
        schedule_for: params.schedule_for,
        schedule_date: params.schedule_date,
      }),
    );
    if (res.ok) {
      await dispatch(updateLeadContactStatusThunk(contactId, 'contacted'));
      if (leadId) {
        await dispatch(updateLeadThunk(leadId, { status: 'contacted' }));
      }
      void dispatch(getAllLeadContactEmailQueueThunk());
    }
    return { success: res.ok, error: res.ok ? undefined : res.error };
  };

  const runQueue = async (params: {
    schedule_for: AddToQueueScheduleFor;
    schedule_date?: string;
  }) => {
    if (!currentEmail.id) {
      toast.error('Save the email first.');
      return;
    }
    setQueuing(true);
    try {
      const res = await enqueueCustomEmail(params);
      if (res.success) {
        toast.success('Added to queue.');
        setQueueMenuOpen(false);
      } else {
        toast.error(res.error || 'Queue failed.');
      }
    } finally {
      setQueuing(false);
    }
  };

  const onQueueNextSlot = () => {
    void runQueue({ schedule_for: 'default' });
  };

  const onQueueToday = () => {
    if (todayQueued >= MAX_QUEUED_EMAILS_PER_EST_DAY) {
      const next = findNextEstDayUnderCap(
        queuedCountsByEstDay,
        todayYmd,
        MAX_QUEUED_EMAILS_PER_EST_DAY
      );
      setCustomDate(next);
      toast.error(
        `Today is at the daily queue suggestion limit (${MAX_QUEUED_EMAILS_PER_EST_DAY}). The next open Eastern day is pre-filled below — adjust if needed, then use Queue on this date.`
      );
      return;
    }
    void runQueue({ schedule_for: 'today' });
  };

  const onQueueTomorrow = () => {
    if (tomorrowQueued >= MAX_QUEUED_EMAILS_PER_EST_DAY) {
      const next = findNextEstDayUnderCap(
        queuedCountsByEstDay,
        tomorrowYmd,
        MAX_QUEUED_EMAILS_PER_EST_DAY
      );
      setCustomDate(next);
      toast.error(
        `Tomorrow is at the daily queue suggestion limit (${MAX_QUEUED_EMAILS_PER_EST_DAY}). The next open Eastern day is pre-filled below — adjust if needed, then use Queue on this date.`
      );
      return;
    }
    void runQueue({ schedule_for: 'tomorrow' });
  };

  const onQueueCustomDate = () => {
    const ymd = customDate.trim();
    if (!ymd) {
      toast.error('Choose a date.');
      return;
    }
    void runQueue({ schedule_for: 'date', schedule_date: ymd });
  };

  const handleCreateNew = () => {
    const bodyHasContent = tiptapContentToPlainText(currentEmail.body).trim().length > 0;
    const hasContent =
      Boolean(currentEmail.id) ||
      currentEmail.subject.trim().length > 0 ||
      bodyHasContent ||
      currentEmail.pendingAttachmentFile !== null ||
      currentEmail.attachment_ids.length > 0;

    if (!hasContent) return;

    if (
      !window.confirm('Discard the current email and start a new draft?')
    ) {
      return;
    }

    setQueueMenuOpen(false);
    dispatch(CurrentLeadContactEmailActions.reset());
    dispatch(
      CurrentLeadContactEmailActions.updateFields({
        lead_id: leadId,
        lead_contact_id: contactId,
        subject: '',
      })
    );
  };

  const panelClass =
    variant === 'modal' ? styles.panelModal : styles.panelFab;
  const actionsClass =
    variant === 'modal' ? styles.actions : styles.actionsFab;

  return (
    <div className={panelClass}>
      <div className={styles.to}>
        <span className={styles.toLabel}>To</span>
        <span className={styles.toVal}>
          {contactName || 'Contact'}
          {contactEmailAddr ? ` · ${contactEmailAddr}` : ''}
        </span>
      </div>
      <div className={styles.fromRow}>
        <EmailSendingIdentitySelect />
      </div>
      <div className={styles.fields}>
        <EmailSubjectInput />
        <EmailBodyInput />
        <EmailAttachmentInput />
      </div>
      <div className={actionsClass}>
        {variant === 'modal' && onCancel ? (
          <button type="button" onClick={onCancel} className={styles.cancel}>
            Cancel
          </button>
        ) : null}
        <button
          type="button"
          onClick={handleCreateNew}
          disabled={isSaving || sending || queuing}
          className={styles.createNew}
        >
          Create new
        </button>
        <button
          type="button"
          onClick={handleSendNow}
          disabled={sending || !currentEmail.id}
          className={styles.send}
        >
          {sending ? 'Sending…' : 'Send now'}
        </button>
        <div className={styles.queueMenuWrap} ref={queueMenuRef}>
          <button
            type="button"
            onClick={() => setQueueMenuOpen((o) => !o)}
            disabled={queuing || !currentEmail.id}
            className={styles.queueMenuTrigger}
            aria-expanded={queueMenuOpen}
            aria-haspopup="menu"
          >
            {queuing ? 'Queuing…' : 'Queue email'}
            <ChevronDown className={styles.queueMenuChevron} aria-hidden />
          </button>
          {queueMenuOpen ? (
            <div className={styles.queueMenu} role="menu">
              <button
                type="button"
                role="menuitem"
                className={styles.queueMenuItem}
                disabled={queuing}
                onClick={onQueueNextSlot}
              >
                <span className={styles.queueMenuItemTitle}>Next in queue</span>
                <span className={styles.queueMenuItemHint}>
                  After the latest scheduled send (any day)
                </span>
              </button>
              <button
                type="button"
                role="menuitem"
                className={styles.queueMenuItem}
                disabled={queuing}
                onClick={onQueueToday}
              >
                <span className={styles.queueMenuItemTitle}>
                  Today (Eastern){' '}
                  <span className={styles.queueMenuCount}>({todayQueued} queued)</span>
                </span>
                <span className={styles.queueMenuItemHint}>
                  After other mail queued for today, or as soon as allowed
                </span>
              </button>
              <button
                type="button"
                role="menuitem"
                className={styles.queueMenuItem}
                disabled={queuing}
                onClick={onQueueTomorrow}
              >
                <span className={styles.queueMenuItemTitle}>
                  Tomorrow (Eastern){' '}
                  <span className={styles.queueMenuCount}>({tomorrowQueued} queued)</span>
                </span>
                <span className={styles.queueMenuItemHint}>
                  After other mail queued for tomorrow, or 8:00 AM Eastern
                </span>
              </button>
              <div className={styles.queueDateBlock}>
                <label className={styles.queueDateLabel} htmlFor="queue-custom-date">
                  Or pick a date (Eastern calendar)
                </label>
                <div className={styles.queueDateRow}>
                  <input
                    id="queue-custom-date"
                    type="date"
                    className={styles.queueDateInput}
                    min={todayYmd}
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    disabled={queuing}
                  />
                  <button
                    type="button"
                    className={styles.queueDateButton}
                    disabled={queuing || !customDate}
                    onClick={onQueueCustomDate}
                  >
                    Queue on this date
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className={variant === 'modal' ? styles.save : styles.saveFab}
        >
          {isSaving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  );
};

const styles = {
  panelModal: `p-5 overflow-y-auto bg-white border-x border-gray-100 min-h-[320px] lg:min-h-0`,
  panelFab: `
    flex flex-col flex-1 min-h-0 h-full overflow-y-auto bg-white p-4
  `,
  to: `
    mb-3 px-3 py-2 rounded-lg bg-sky-50 border border-sky-100 text-sm
  `,
  toLabel: `text-xs font-semibold text-sky-700 uppercase mr-2`,
  toVal: `text-sky-950`,
  fromRow: `
    mb-3 px-3 py-2 rounded-lg bg-amber-50/80 border border-amber-100 flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-3
  `,
  fromLabel: `text-xs font-semibold text-amber-900 uppercase shrink-0`,
  fromHint: `text-sm text-amber-900/80 flex-1 min-w-0`,
  fields: `space-y-3 mb-4`,
  actions: `
    flex flex-wrap items-center gap-2 pt-4 border-t border-gray-100
  `,
  actionsFab: `
    flex flex-wrap items-center gap-1.5 pt-3 border-t border-gray-100
  `,
  cancel: `
    px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100
    border-none bg-transparent cursor-pointer
  `,
  createNew: `
    px-3 py-1.5 text-xs font-medium text-gray-700 rounded-lg
    border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer disabled:opacity-45
    sm:px-4 sm:py-2 sm:text-sm
  `,
  send: `
    px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 rounded-lg
    hover:bg-emerald-700 border-none cursor-pointer disabled:opacity-45
    sm:px-4 sm:py-2 sm:text-sm
  `,
  queueMenuWrap: `relative inline-block`,
  queueMenuTrigger: `
    inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-800 bg-blue-50 rounded-lg
    hover:bg-blue-100 border border-blue-100 cursor-pointer disabled:opacity-45
    sm:px-4 sm:py-2 sm:text-sm
  `,
  queueMenuChevron: `h-4 w-4 shrink-0 opacity-70`,
  queueMenu: `
    absolute left-0 bottom-full mb-1 z-20 w-[min(100vw-2rem,20rem)] rounded-xl border border-gray-200 bg-white py-2 shadow-lg
    sm:left-auto sm:right-0
  `,
  queueMenuItem: `
    w-full text-left px-3 py-2 border-none bg-transparent cursor-pointer hover:bg-gray-50
    disabled:opacity-45 disabled:cursor-not-allowed
  `,
  queueMenuItemTitle: `block text-sm font-semibold text-gray-900`,
  queueMenuCount: `font-normal text-gray-500`,
  queueMenuItemHint: `block text-xs text-gray-500 mt-0.5`,
  queueDateBlock: `px-3 pt-2 mt-1 border-t border-gray-100`,
  queueDateLabel: `block text-xs font-medium text-gray-600 mb-1.5`,
  queueDateRow: `flex flex-col gap-2 sm:flex-row sm:items-center`,
  queueDateInput: `
    flex-1 min-w-0 rounded-lg border border-gray-200 px-2 py-1.5 text-sm text-gray-900
  `,
  queueDateButton: `
    shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg text-indigo-900 bg-indigo-50
    border border-indigo-100 hover:bg-indigo-100 cursor-pointer disabled:opacity-45
    sm:text-sm
  `,
  save: `
    px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg
    hover:bg-blue-700 border-none cursor-pointer disabled:opacity-45 ml-auto
  `,
  saveFab: `
    px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg
    hover:bg-blue-700 border-none cursor-pointer disabled:opacity-45 ml-auto
    sm:px-4 sm:py-2 sm:text-sm
  `,
};
