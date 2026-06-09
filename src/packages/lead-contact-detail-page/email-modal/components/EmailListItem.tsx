'use client';

import { useCallback } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { LeadContactEmailBuilderActions } from '@/store/builders';
import type { LeadContactEmail } from '@/model/lead-contact-email';
import type { LeadSentEmail } from '@/model/lead-sent-email';
import { formatDateTimeWithTime } from '@/utils/date-time';
import { tiptapContentToPlainText } from '@/utils/content';

type Props = {
  email: LeadContactEmail;
  sentRecord?: LeadSentEmail | null;
  isSelected?: boolean;
};

const statusLabel = (sent?: LeadSentEmail | null) => {
  if (!sent) return 'Saved';
  if (sent.delivery_status === 'opened') return 'Opened';
  if (sent.delivery_status === 'bounced') return 'Bounced';
  if (sent.delivery_status === 'delivered') return 'Delivered';
  return 'Sent';
};

const preview = (body: LeadContactEmail['body']) => {
  if (!body) return '';
  try {
    const c =
      typeof body === 'string'
        ? (JSON.parse(body) as LeadContactEmail['body'])
        : body;
    return tiptapContentToPlainText(c).slice(0, 120);
  } catch {
    return '';
  }
};

export const EmailListItem = (props: Props) => {
  const { email, sentRecord, isSelected = false } = props;
  const dispatch = useAppDispatch();

  const date = sentRecord ? sentRecord.sent_at : email.created_at;

  const onClick = useCallback(() => {
    dispatch(LeadContactEmailBuilderActions.setPreviewEmailId(email.id));
  }, [email.id, dispatch]);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={`${styles.item} ${isSelected ? styles.selected : ''}`}
    >
      <div className={styles.sub}>{email.subject || '(No subject)'}</div>
      {preview(email.body) ? (
        <div className={styles.prev}>{preview(email.body)}</div>
      ) : null}
      <div className={styles.meta}>
        <span>{formatDateTimeWithTime(date)}</span>
        <span className={styles.stat}>{statusLabel(sentRecord)}</span>
      </div>
    </div>
  );
};

const styles = {
  item: `
    p-3 bg-white rounded-xl border border-gray-200 mb-2 cursor-pointer
    hover:border-blue-300 hover:bg-sky-50/40 transition-colors text-left
  `,
  selected: `
    border-blue-400 bg-sky-50 ring-1 ring-blue-200
  `,
  sub: `text-sm font-medium text-gray-900`,
  prev: `text-xs text-gray-500 mt-1 line-clamp-2`,
  meta: `flex justify-between gap-2 mt-2 text-xs text-gray-500`,
  stat: `text-gray-600 font-medium`,
};
