'use client';

import { useState, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { MoreHorizontal } from 'lucide-react';
import type { ToCallLog, ToCallLogStatus } from '@/model/to-call-log';
import type { LeadContact } from '@/model/lead-contact';
import { useAppDispatch } from '@/store/hooks';
import {
  updateToCallLogThunk,
  deleteToCallLogThunk,
} from '@/store/thunks/to-call-log';

type Props = {
  item: ToCallLog;
  contact: LeadContact | undefined;
};

const STATUS_LABELS: Record<ToCallLogStatus, string> = {
  queued: 'Queued',
  called: 'Called',
  skipped: 'Skipped',
  voicemail: 'Voicemail',
};

export const ToCallLogItemActions = (props: Props) => {
  const { item, contact } = props;
  const dispatch = useAppDispatch();
  const email = contact?.email?.trim() || '';
  const phone = contact?.phone?.trim() || '';

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(
    null
  );
  const [isEditPreCallNotesOpen, setIsEditPreCallNotesOpen] = useState(false);
  const [preCallNotesDraft, setPreCallNotesDraft] = useState('');
  const [isSavingPreCallNotes, setIsSavingPreCallNotes] = useState(false);
  const [isEditCallNotesOpen, setIsEditCallNotesOpen] = useState(false);
  const [callNotesDraft, setCallNotesDraft] = useState('');
  const [isSavingCallNotes, setIsSavingCallNotes] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
    setMenuPosition(null);
  };

  const handleToggleMenu = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (isMenuOpen) {
      closeMenu();
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const menuWidth = 220;
    const menuHeight = 320;
    const pad = 8;
    let left = rect.right - menuWidth;
    if (left < pad) left = pad;
    let top = rect.bottom + 6;
    if (window.innerHeight - top < menuHeight) {
      top = rect.top - menuHeight - 6;
    }
    if (top < pad) top = pad;
    setMenuPosition({ top, left });
    setIsMenuOpen(true);
  };

  const handleEditPreCallNotes = () => {
    closeMenu();
    setPreCallNotesDraft(item.notes);
    setIsEditPreCallNotesOpen(true);
  };

  const handleSavePreCallNotes = async () => {
    const trimmed = preCallNotesDraft.trim();
    if (!trimmed) {
      alert('Pre-call notes cannot be empty.');
      return;
    }
    setIsSavingPreCallNotes(true);
    const status = await dispatch(updateToCallLogThunk(item.id, { notes: trimmed }));
    setIsSavingPreCallNotes(false);
    if (status !== 200) {
      alert('Failed to save pre-call notes');
      return;
    }
    setIsEditPreCallNotesOpen(false);
  };

  const handleEditCallNotes = () => {
    closeMenu();
    setCallNotesDraft(item.call_notes ?? '');
    setIsEditCallNotesOpen(true);
  };

  const handleSaveCallNotes = async () => {
    setIsSavingCallNotes(true);
    const trimmed = callNotesDraft.trim();
    const status = await dispatch(
      updateToCallLogThunk(item.id, {
        call_notes: trimmed ? trimmed : null,
      }),
    );
    setIsSavingCallNotes(false);
    if (status !== 200) {
      alert('Failed to save call notes');
      return;
    }
    setIsEditCallNotesOpen(false);
  };

  const handleEmail = () => {
    closeMenu();
    if (!email) return;
    window.location.href = `mailto:${email}`;
  };

  const handleCall = () => {
    closeMenu();
    if (!phone) return;
    const digits = phone.replace(/[^\d+]/g, '');
    if (!digits) return;
    window.location.href = `tel:${digits}`;
  };

  const handleOpenStatus = () => {
    closeMenu();
    setIsStatusOpen(true);
  };

  const handleSetStatus = async (call_status: ToCallLogStatus) => {
    const status = await dispatch(updateToCallLogThunk(item.id, { call_status }));
    if (status !== 200) {
      alert('Failed to update status');
      return;
    }
    setIsStatusOpen(false);
  };

  const handleDelete = async () => {
    closeMenu();
    if (!window.confirm('Remove this row from the call log?')) return;
    setIsDeleting(true);
    const status = await dispatch(deleteToCallLogThunk(item.id));
    setIsDeleting(false);
    if (status !== 200) {
      alert('Failed to delete');
    }
  };

  const portalTarget = typeof window !== 'undefined' ? document.body : null;

  const portal =
    portalTarget != null
      ? createPortal(
          <>
            {isMenuOpen ? (
              <button
                type="button"
                className={styles.backdrop}
                aria-label="Close menu"
                onClick={closeMenu}
              />
            ) : null}
            {isEditPreCallNotesOpen ? (
              <div
                className={styles.modalOverlay}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isSavingPreCallNotes) setIsEditPreCallNotesOpen(false);
                }}
              >
                <div
                  className={styles.modal}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className={styles.modalTitle}>Pre-call notes</h3>
                  <p className={styles.modalHint}>
                    Context before you dial (pitch angles, objections, etc.).
                  </p>
                  <textarea
                    value={preCallNotesDraft}
                    onChange={(e) => setPreCallNotesDraft(e.target.value)}
                    className={styles.textarea}
                    rows={5}
                    disabled={isSavingPreCallNotes}
                  />
                  <div className={styles.modalActions}>
                    <button
                      type="button"
                      className={styles.btnSecondary}
                      onClick={() => setIsEditPreCallNotesOpen(false)}
                      disabled={isSavingPreCallNotes}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className={styles.btnPrimary}
                      onClick={() => void handleSavePreCallNotes()}
                      disabled={isSavingPreCallNotes}
                    >
                      {isSavingPreCallNotes ? 'Saving…' : 'Save'}
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
            {isEditCallNotesOpen ? (
              <div
                className={styles.modalOverlay}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isSavingCallNotes) setIsEditCallNotesOpen(false);
                }}
              >
                <div
                  className={styles.modalWide}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className={styles.modalTitle}>Call notes</h3>
                  <p className={styles.modalHint}>
                    What they said and next steps—save anytime during or after the call.
                  </p>
                  <textarea
                    value={callNotesDraft}
                    onChange={(e) => setCallNotesDraft(e.target.value)}
                    className={styles.textareaTall}
                    rows={10}
                    disabled={isSavingCallNotes}
                    placeholder="Type while you talk; save and reopen to add more."
                  />
                  <div className={styles.modalActions}>
                    <button
                      type="button"
                      className={styles.btnSecondary}
                      onClick={() => setIsEditCallNotesOpen(false)}
                      disabled={isSavingCallNotes}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className={styles.btnPrimary}
                      onClick={() => void handleSaveCallNotes()}
                      disabled={isSavingCallNotes}
                    >
                      {isSavingCallNotes ? 'Saving…' : 'Save'}
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
            {isStatusOpen ? (
              <div
                className={styles.modalOverlay}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsStatusOpen(false);
                }}
              >
                <div
                  className={styles.modal}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className={styles.modalTitle}>Change status</h3>
                  <p className={styles.modalHint}>
                    Current: {STATUS_LABELS[item.call_status]}
                  </p>
                  <div className={styles.statusButtons}>
                    {(
                      ['queued', 'called', 'skipped', 'voicemail'] as const
                    ).map((status) => (
                      <button
                        key={status}
                        type="button"
                        className={
                          item.call_status === status
                            ? styles.statusBtnActive
                            : styles.statusBtn
                        }
                        onClick={() => void handleSetStatus(status)}
                      >
                        {STATUS_LABELS[status]}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    className={styles.btnSecondaryFull}
                    onClick={() => setIsStatusOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : null}
          </>,
          portalTarget
        )
      : null;

  return (
    <>
      <div className={styles.wrap} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={handleToggleMenu}
          className={styles.trigger}
          disabled={isDeleting}
          aria-label="Row actions"
        >
          <MoreHorizontal className={styles.triggerIcon} />
        </button>
        {isMenuOpen && menuPosition ? (
          <div
            className={styles.menu}
            style={{ top: menuPosition.top, left: menuPosition.left }}
          >
            <button
              type="button"
              className={styles.menuItem}
              onClick={handleEditPreCallNotes}
            >
              Edit pre-call notes
            </button>
            <button type="button" className={styles.menuItem} onClick={handleEditCallNotes}>
              Edit call notes
            </button>
            <button
              type="button"
              className={styles.menuItem}
              onClick={handleEmail}
              disabled={!email}
            >
              {email ? `Email: ${email}` : 'Email: not set'}
            </button>
            <button
              type="button"
              className={styles.menuItem}
              onClick={handleCall}
              disabled={!phone}
            >
              {phone ? `Call: ${phone}` : 'Call: not set'}
            </button>
            <button type="button" className={styles.menuItem} onClick={handleOpenStatus}>
              Change status
            </button>
            <button type="button" className={styles.menuItemDelete} onClick={handleDelete}>
              Delete
            </button>
          </div>
        ) : null}
      </div>
      {portal}
    </>
  );
};

const styles = {
  wrap: `relative inline-flex`,
  trigger: `
    border-none bg-transparent p-1 text-gray-500 cursor-pointer rounded
    transition-colors hover:text-gray-800 hover:bg-gray-100
    disabled:cursor-not-allowed disabled:opacity-50
  `,
  triggerIcon: `h-4 w-4`,
  menu: `
    fixed z-[70] min-w-[14rem] max-w-[min(20rem,calc(100vw-1rem))] overflow-hidden rounded-md border border-gray-200
    bg-white shadow-lg py-1
  `,
  backdrop: `
    fixed inset-0 z-[60] border-none bg-transparent p-0 cursor-default
  `,
  menuItem: `
    w-full border-none bg-white px-3 py-2 text-left text-xs text-gray-700 cursor-pointer
    transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400
  `,
  menuItemDelete: `
    w-full border-none bg-white px-3 py-2 text-left text-xs text-red-600 cursor-pointer
    transition-colors hover:bg-red-50
  `,
  modalOverlay: `
    fixed inset-0 z-[80] flex items-center justify-center bg-black/30 p-4
  `,
  modal: `
    w-full max-w-md rounded-lg border border-gray-200 bg-white p-4 shadow-xl
  `,
  modalWide: `
    w-full max-w-lg rounded-lg border border-gray-200 bg-white p-4 shadow-xl
  `,
  modalTitle: `text-sm font-semibold text-gray-900`,
  modalHint: `mt-1 text-xs text-gray-500`,
  textarea: `
    mt-3 w-full rounded border border-gray-300 p-2 text-sm text-gray-900
    focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
  `,
  textareaTall: `
    mt-3 w-full rounded border border-gray-300 p-2 text-sm text-gray-900
    focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
    min-h-[12rem]
  `,
  modalActions: `mt-3 flex items-center justify-end gap-2`,
  btnSecondary: `
    rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700
    hover:bg-gray-50 disabled:opacity-60
  `,
  btnPrimary: `
    rounded border border-blue-600 bg-blue-600 px-3 py-1.5 text-xs font-medium text-white
    hover:bg-blue-700 disabled:opacity-60
  `,
  statusButtons: `mt-3 flex flex-col gap-2`,
  statusBtn: `
    w-full rounded border border-gray-200 bg-white px-3 py-2 text-left text-sm text-gray-800
    hover:bg-gray-50
  `,
  statusBtnActive: `
    w-full rounded border border-blue-500 bg-blue-50 px-3 py-2 text-left text-sm font-medium text-blue-900
  `,
  btnSecondaryFull: `
    mt-3 w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700
    hover:bg-gray-50
  `,
};
