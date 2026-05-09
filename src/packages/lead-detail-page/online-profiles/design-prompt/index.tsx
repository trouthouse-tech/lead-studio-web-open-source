'use client';

import { useState } from 'react';
import { Mic } from 'lucide-react';
import { DictateDesignPromptModal } from '@/packages/lead-detail-page/design-prompt';

const LABEL = 'Design prompt';

/**
 * Online-profile grid tile: mic opens the dictate → generate flow for a paste-ready agent prompt.
 */
export const OnlineProfilesDesignPromptRow = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className={styles.gridCell}>
      <div className={styles.profileChip}>
        <span className={styles.profileIcon} aria-hidden>
          ✨
        </span>
        <div className="min-w-0 flex-1">
          <div className={styles.profileLabelRow}>
            <span className={styles.profileLabel}>{LABEL}</span>
            <button
              type="button"
              className={styles.iconTrigger}
              title="Voice-dictate design prompt"
              aria-label="Voice-dictate design prompt"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setModalOpen(true);
              }}
            >
              <Mic className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>
        </div>
      </div>
      <DictateDesignPromptModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

const styles = {
  gridCell: `min-w-0`,
  profileChip: `
    flex items-start gap-2.5 rounded-md border border-gray-200 p-3
  `,
  profileIcon: `text-base leading-none mt-0.5`,
  profileLabelRow: `
    flex items-center justify-between gap-1 min-w-0
  `,
  profileLabel: `text-xs font-medium text-gray-500 truncate`,
  iconTrigger: `
    inline-flex shrink-0 items-center justify-center rounded p-0.5 text-gray-500
    hover:text-[#FF7C1E] hover:bg-orange-50
  `,
};
