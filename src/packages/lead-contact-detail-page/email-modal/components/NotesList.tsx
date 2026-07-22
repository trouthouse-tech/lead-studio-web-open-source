'use client';

import { StickyNote } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

/** Contact notes in the email modal top bar. */
export const NotesList = () => {
  const currentLeadContact = useAppSelector((s) => s.currentLeadContact);
  const notes = currentLeadContact.notes;
  if (!notes?.trim()) {
    return (
      <div className={styles.empty}>
        <StickyNote className={styles.icon} />
        <p className={styles.text}>No notes on this contact.</p>
      </div>
    );
  }
  return (
    <div className={styles.box}>
      <h3 className={styles.h}>Notes</h3>
      <p className={styles.body}>{notes}</p>
    </div>
  );
};

const styles = {
  empty: `flex items-center gap-2 text-gray-400`,
  icon: `h-4 w-4 shrink-0 opacity-50`,
  text: `text-xs`,
  box: ``,
  h: `text-xs font-semibold text-gray-500 uppercase mb-2`,
  body: `text-sm text-gray-700 whitespace-pre-wrap max-h-24 overflow-y-auto leading-relaxed`,
};
