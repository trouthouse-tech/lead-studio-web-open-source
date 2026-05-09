'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { runLeadResearchPipelineThunk } from '@/store/thunks/leads';

export const LeadsHeaderResearchLeadsButton = () => {
  const dispatch = useAppDispatch();
  const selectedLeadIds = useAppSelector((state) => state.leadBuilder.selectedLeadIds);
  const [busy, setBusy] = useState(false);

  const disabled = selectedLeadIds.length === 0 || busy;

  const handleClick = async () => {
    if (disabled) return;
    setBusy(true);
    try {
      const result = await dispatch(runLeadResearchPipelineThunk());
      if (!result.ok) {
        toast.error(result.message ?? 'Failed to queue research');
        return;
      }
      const n = result.insertedCount ?? selectedLeadIds.length;
      toast.success(
        `Queued ${n} lead${n === 1 ? '' : 's'} for research — processing runs on the server`
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      className={styles.researchButton}
      disabled={disabled}
      onClick={() => {
        void handleClick();
      }}
    >
      {busy ? <Loader2 className={styles.loader} aria-hidden /> : null}
      <span>Research</span>
    </button>
  );
};

const styles = {
  researchButton: `
    inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md border border-gray-300 bg-white
    px-2 py-1 text-xs font-medium text-gray-800
    hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed
  `,
  loader: `h-3.5 w-3.5 animate-spin shrink-0`,
};
