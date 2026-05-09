'use client';

import { useState } from 'react';
import type { LeadCostType } from '@/model/lead-cost';
import type { PostLeadCostBody } from '@/api/lead-costs';
import { LEAD_COST_TYPE_OPTIONS } from './lead-cost-type-labels';

type AddLeadCostModalProps = {
  isOpen: boolean;
  onClose: () => void;
  leadId: string;
  createManualCost: (body: Omit<PostLeadCostBody, 'lead_id'>) => Promise<boolean>;
  isSaving: boolean;
};

export const AddLeadCostModal = (props: AddLeadCostModalProps) => {
  const { isOpen, onClose, leadId, createManualCost, isSaving } = props;

  const [amountUsd, setAmountUsd] = useState('');
  const [description, setDescription] = useState('');
  const [costType, setCostType] = useState<LeadCostType>('design_tool');
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setAmountUsd('');
    setDescription('');
    setCostType('design_tool');
    setError(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    setError(null);
    const trimmed = description.trim();
    if (!trimmed) {
      setError('Description is required.');
      return;
    }
    const usd = Number.parseFloat(amountUsd);
    if (!Number.isFinite(usd) || usd < 0) {
      setError('Enter a valid dollar amount (0 or more).');
      return;
    }
    const costCents = Math.round(usd * 100);
    const ok = await createManualCost({
      type: costType,
      description: trimmed,
      cost_cents: costCents,
    });
    if (!ok) {
      setError('Could not save. Check your connection and try again.');
      return;
    }
    handleClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay} role="presentation" onClick={handleClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-labelledby="add-cost-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="add-cost-title" className={styles.title}>
          Add lead cost
        </h3>
        <p className={styles.hint}>
          One-time spend tied to this lead (tools, credits, etc.). AI chat usage still appears as
          separate estimated rows.
        </p>

        <label className={styles.label}>
          <span className={styles.labelText}>Amount (USD)</span>
          <input
            type="number"
            min={0}
            step="0.01"
            className={styles.input}
            value={amountUsd}
            onChange={(e) => setAmountUsd(e.target.value)}
            placeholder="1.00"
          />
        </label>

        <label className={styles.label}>
          <span className={styles.labelText}>Type</span>
          <select
            className={styles.input}
            value={costType}
            onChange={(e) => setCostType(e.target.value as LeadCostType)}
          >
            {LEAD_COST_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.label}>
          <span className={styles.labelText}>Description</span>
          <textarea
            className={styles.textarea}
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Lovable credits — mockups emailed after call"
          />
        </label>

        {error ? <p className={styles.error}>{error}</p> : null}

        <div className={styles.footer}>
          <button type="button" className={styles.cancelBtn} onClick={handleClose}>
            Cancel
          </button>
          <button
            type="button"
            className={styles.saveBtn}
            disabled={!leadId || isSaving}
            onClick={() => {
              void handleSubmit();
            }}
          >
            {isSaving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: `
    fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4
  `,
  modal: `
    w-full max-w-md rounded-lg border border-gray-200 bg-white p-5 shadow-lg
  `,
  title: `text-base font-semibold text-gray-900 mb-1`,
  hint: `text-xs text-gray-500 mb-4`,
  label: `flex flex-col gap-1 mb-3`,
  labelText: `text-xs font-medium text-gray-700`,
  input: `
    rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900
    focus:outline-none focus:ring-2 focus:ring-blue-500/30
  `,
  textarea: `
    rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900
    focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-y min-h-[4.5rem]
  `,
  error: `text-xs text-red-600 mb-2`,
  footer: `flex justify-end gap-2 mt-4`,
  cancelBtn: `
    rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700
    hover:bg-gray-50
  `,
  saveBtn: `
    rounded-md border-none bg-blue-600 px-3 py-1.5 text-sm font-medium text-white
    hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
  `,
};
