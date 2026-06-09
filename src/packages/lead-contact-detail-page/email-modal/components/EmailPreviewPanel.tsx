'use client';

import { useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { CurrentLeadContactEmailActions } from '@/store/current';
import { LeadContactEmailBuilderActions } from '@/store/builders';
import type { LeadContactEmail, TiptapContent } from '@/model/lead-contact-email';
import type { LeadSentEmail } from '@/model/lead-sent-email';
import { formatDateTimeWithTime } from '@/utils/date-time';

type Props = {
  email: LeadContactEmail | null;
  sentRecord?: LeadSentEmail | null;
};

const parseBody = (body: LeadContactEmail['body']): TiptapContent => {
  if (!body) {
    return { type: 'doc', content: [{ type: 'paragraph' }] };
  }
  if (typeof body === 'string') {
    try {
      return JSON.parse(body) as TiptapContent;
    } catch {
      return { type: 'doc', content: [{ type: 'paragraph' }] };
    }
  }
  return body;
};

const statusLabel = (sent?: LeadSentEmail | null) => {
  if (!sent) return 'Saved (not sent)';
  if (sent.delivery_status === 'opened') return 'Opened';
  if (sent.delivery_status === 'bounced') return 'Bounced';
  if (sent.delivery_status === 'delivered') return 'Delivered';
  return 'Sent';
};

const ReadOnlyBody = (props: { body: TiptapContent }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight,
    ],
    content: props.body,
    editable: false,
    immediatelyRender: false,
    editorProps: {
      attributes: { class: styles.editorInner },
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.commands.setContent(props.body);
  }, [editor, props.body]);

  if (!editor) return null;

  return (
    <div className={styles.editorBox}>
      <EditorContent editor={editor} />
    </div>
  );
};

export const EmailPreviewPanel = (props: Props) => {
  const { email, sentRecord } = props;
  const dispatch = useAppDispatch();
  const currentEmail = useAppSelector((s) => s.currentLeadContactEmail);

  const handleOverride = useCallback(() => {
    if (!email) return;

    const isDraft =
      !currentEmail.id &&
      (currentEmail.subject.trim().length > 0 ||
        currentEmail.pendingAttachmentFile !== null ||
        currentEmail.attachment_ids.length > 0);

    if (isDraft) {
      if (
        !window.confirm(
          'Replace your current draft with this email? Unsaved changes will be lost.'
        )
      ) {
        return;
      }
    } else if (currentEmail.id && currentEmail.id !== email.id) {
      if (
        !window.confirm(
          'Replace the current email in the editor with this one? Unsaved changes will be lost.'
        )
      ) {
        return;
      }
    }

    dispatch(CurrentLeadContactEmailActions.setEmail(email));
    dispatch(LeadContactEmailBuilderActions.setPreviewEmailId(email.id));
  }, [currentEmail, dispatch, email]);

  if (!email) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>Select an email to preview</p>
        <p className={styles.emptyHint}>
          Click a previous email in the list to compare it with your current draft.
        </p>
      </div>
    );
  }

  const date = sentRecord ? sentRecord.sent_at : email.created_at;
  const body = parseBody(email.body);
  const isCurrentEditorEmail = currentEmail.id === email.id;

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h4 className={styles.subject}>{email.subject || '(No subject)'}</h4>
          <div className={styles.meta}>
            <span>{formatDateTimeWithTime(date)}</span>
            <span className={styles.stat}>{statusLabel(sentRecord)}</span>
          </div>
        </div>
        {!isCurrentEditorEmail ? (
          <button
            type="button"
            onClick={handleOverride}
            className={styles.override}
          >
            Override current form
          </button>
        ) : (
          <span className={styles.loadedBadge}>Loaded in editor</span>
        )}
      </div>
      <div className={styles.body}>
        <ReadOnlyBody body={body} />
      </div>
    </div>
  );
};

const styles = {
  panel: `
    flex flex-col min-h-0 h-full bg-white
  `,
  header: `
    flex items-start justify-between gap-3 px-4 py-3 border-b border-gray-100 shrink-0
  `,
  headerText: `min-w-0 flex-1`,
  subject: `text-sm font-semibold text-gray-900 truncate`,
  meta: `flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500`,
  stat: `font-medium text-gray-600`,
  override: `
    shrink-0 px-3 py-1.5 text-xs font-medium text-amber-900 bg-amber-50 rounded-lg
    border border-amber-200 hover:bg-amber-100 cursor-pointer
    sm:text-sm sm:px-4 sm:py-2
  `,
  loadedBadge: `
    shrink-0 px-3 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 rounded-lg
    border border-emerald-100
  `,
  body: `flex-1 min-h-0 overflow-y-auto p-4`,
  editorBox: `
    border border-gray-200 rounded-xl bg-gray-50/50 min-h-[200px]
  `,
  editorInner: [
    'outline-none p-4 min-h-[200px] prose prose-sm max-w-none',
    '[&_p]:my-2 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6',
    '[&_a]:text-blue-600 [&_a]:underline',
  ].join(' '),
  empty: `
    flex flex-col items-center justify-center h-full min-h-[240px] px-6 text-center
    bg-white
  `,
  emptyTitle: `text-sm font-medium text-gray-700`,
  emptyHint: `text-xs text-gray-500 mt-2 max-w-xs`,
};
