'use client';

import { useEffect, useMemo, useState } from 'react';
import { MessageSquare, Send, Sparkles } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  loadLeadContactChatMessagesThunk,
  sendLeadContactChatMessageThunk,
} from '@/store/thunks';
import { formatDateTimeWithTime } from '@/utils/date-time';

/**
 * Chat column for the lead contact studio: thread + composer (scoped to `currentLeadContact`).
 */
export const LeadContactChatColumn = () => {
  const dispatch = useAppDispatch();
  const currentLeadContact = useAppSelector((state) => state.currentLeadContact);
  const leadContactChat = useAppSelector((state) => state.leadContactChat);
  const [draftMessage, setDraftMessage] = useState('');

  const leadContactId = currentLeadContact.id;
  const messages = useMemo(
    () => leadContactChat.messagesByContactId[leadContactId] ?? [],
    [leadContactChat.messagesByContactId, leadContactId],
  );
  const isLoading = leadContactChat.loadingByContactId[leadContactId] ?? false;
  const isPosting = leadContactChat.postingByContactId[leadContactId] ?? false;
  const error = leadContactChat.errorByContactId[leadContactId] ?? null;

  useEffect(() => {
    if (!leadContactId) return;
    void dispatch(loadLeadContactChatMessagesThunk(leadContactId));
  }, [dispatch, leadContactId]);

  const sendMessage = async () => {
    const trimmed = draftMessage.trim();
    if (!leadContactId || !trimmed || isPosting) return;
    setDraftMessage('');
    await dispatch(sendLeadContactChatMessageThunk(leadContactId, trimmed));
  };

  return (
    <div className={styles.column}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <MessageSquare className={styles.titleIcon} />
          AI contact coach
        </h2>
        <p className={styles.subtitle}>
          Ask AI for strategy on how to deliver value to this contact.
        </p>
      </div>

      <div className={styles.threadWrap}>
        {isLoading ? (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>Loading chat...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className={styles.empty}>
            <Sparkles className={styles.emptyIcon} />
            <p className={styles.emptyTitle}>Start the conversation</p>
            <p className={styles.emptySub}>
              Example: &quot;I exchanged two emails with the CEO. How can I deliver value in my
              next follow-up?&quot;
            </p>
          </div>
        ) : (
          <ul className={styles.list}>
            {messages.map((message) => (
              <li
                key={message.id}
                className={message.role === 'user' ? styles.userRow : styles.assistantRow}
              >
                <div className={styles.messageCard}>
                  <p className={styles.messageBody}>{message.content}</p>
                  <span className={styles.time}>{formatDateTimeWithTime(message.rawTime)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.composer}>
        <textarea
          className={styles.textarea}
          rows={3}
          value={draftMessage}
          disabled={isPosting}
          onChange={(event) => setDraftMessage(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              void sendMessage();
            }
          }}
          placeholder={isPosting ? 'AI is replying...' : 'Ask AI how to craft your next response...'}
        />
        <button
          type="button"
          className={styles.sendButton}
          disabled={!draftMessage.trim() || isPosting}
          onClick={() => void sendMessage()}
          aria-label="Send message"
        >
          <Send className={styles.sendIcon} />
        </button>
      </div>
      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  );
};

const styles = {
  column: `
    flex min-w-0 flex-col bg-white
    max-lg:flex-none
    lg:min-h-0 lg:flex-1
  `,
  header: `
    shrink-0 border-b border-gray-200 px-5 py-4
  `,
  title: `
    flex items-center gap-2 text-sm font-semibold text-gray-900
  `,
  titleIcon: `
    h-4 w-4 text-orange-600
  `,
  subtitle: `
    mt-1 text-xs text-gray-500
  `,
  threadWrap: `
    min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-5 py-4
  `,
  empty: `
    flex h-full min-h-[12rem] flex-col items-center justify-center text-center
  `,
  emptyIcon: `
    h-6 w-6 text-orange-500
  `,
  emptyTitle: `
    mt-3 text-sm font-semibold text-gray-900
  `,
  emptySub: `
    mt-1 max-w-xs text-xs text-gray-500
  `,
  list: `
    flex flex-col gap-3
  `,
  userRow: `
    flex justify-end
  `,
  assistantRow: `
    flex justify-start
  `,
  messageCard: `
    max-w-[88%] rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5
  `,
  messageBody: `
    whitespace-pre-wrap text-sm text-gray-700
  `,
  time: `
    mt-2 block text-[11px] text-gray-500
  `,
  composer: `
    flex shrink-0 items-end gap-2 border-t border-gray-200 px-5 py-3
  `,
  textarea: `
    min-h-[76px] flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm
    text-gray-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500
    disabled:bg-gray-50
  `,
  sendButton: `
    flex h-10 w-10 items-center justify-center rounded-lg bg-orange-600 text-white
    disabled:cursor-not-allowed disabled:opacity-50
  `,
  sendIcon: `
    h-4 w-4
  `,
  error: `
    shrink-0 border-t border-gray-200 px-5 py-2 text-xs text-red-600
  `,
} as const;
