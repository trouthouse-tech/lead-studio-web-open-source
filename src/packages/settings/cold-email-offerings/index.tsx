'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  deleteColdEmailOfferingThunk,
  generateColdEmailOfferingThunk,
  getAllColdEmailOfferingsThunk,
  saveColdEmailOfferingThunk,
  updateColdEmailOfferingThunk,
} from '@/store/thunks/cold-email-offerings';
import type { ColdEmailOffering } from '@/model/cold-email-offering';

type DraftFields = {
  title: string;
  hook: string;
  description: string;
};

const emptyDraft = (): DraftFields => ({
  title: '',
  hook: '',
  description: '',
});

/**
 * Settings UI for creating and managing cold email offerings.
 */
export const ColdEmailOfferingsPage = () => {
  const dispatch = useAppDispatch();
  const offeringsById = useAppSelector((state) => state.coldEmailOfferings);

  const [sourceNotes, setSourceNotes] = useState('');
  const [draft, setDraft] = useState<DraftFields>(emptyDraft);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const offerings = useMemo(
    () =>
      Object.values(offeringsById).sort(
        (a, b) => a.sort_order - b.sort_order || a.title.localeCompare(b.title),
      ),
    [offeringsById],
  );

  useEffect(() => {
    void dispatch(getAllColdEmailOfferingsThunk(true));
  }, [dispatch]);

  const handleGenerate = async () => {
    if (!sourceNotes.trim()) {
      toast.error('Paste some notes first.');
      return;
    }
    setGenerating(true);
    try {
      const result = await dispatch(generateColdEmailOfferingThunk(sourceNotes.trim()));
      if (result && typeof result === 'object' && 'status' in result && result.status === 200) {
        setDraft({
          title: result.data.title,
          hook: result.data.hook,
          description: result.data.description,
        });
        setEditingId(null);
        toast.success('Offering generated — edit and save when ready.');
      } else {
        toast.error('Generation failed.');
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!draft.title.trim() || !draft.hook.trim()) {
      toast.error('Title and hook are required.');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        const status = await dispatch(
          updateColdEmailOfferingThunk(editingId, {
            title: draft.title.trim(),
            hook: draft.hook.trim(),
            description: draft.description.trim(),
            source_notes: sourceNotes.trim(),
          }),
        );
        if (status === 200) {
          toast.success('Offering updated.');
          setEditingId(null);
          setDraft(emptyDraft());
          setSourceNotes('');
        } else {
          toast.error('Update failed.');
        }
      } else {
        const status = await dispatch(
          saveColdEmailOfferingThunk({
            title: draft.title.trim(),
            hook: draft.hook.trim(),
            description: draft.description.trim(),
            source_notes: sourceNotes.trim(),
            sort_order: offerings.length,
          }),
        );
        if (status === 200) {
          toast.success('Offering saved.');
          setDraft(emptyDraft());
          setSourceNotes('');
        } else {
          toast.error('Save failed.');
        }
      }
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (offering: ColdEmailOffering) => {
    setEditingId(offering.id);
    setSourceNotes(offering.source_notes);
    setDraft({
      title: offering.title,
      hook: offering.hook,
      description: offering.description,
    });
  };

  const handleArchive = async (offering: ColdEmailOffering) => {
    const status = await dispatch(
      updateColdEmailOfferingThunk(offering.id, { is_archived: true }),
    );
    if (status === 200) {
      toast.success('Offering archived.');
    } else {
      toast.error('Archive failed.');
    }
  };

  const handleDelete = async (offering: ColdEmailOffering) => {
    if (!confirm(`Delete "${offering.title}"?`)) return;
    const status = await dispatch(deleteColdEmailOfferingThunk(offering.id));
    if (status === 200) {
      toast.success('Offering deleted.');
      if (editingId === offering.id) {
        setEditingId(null);
        setDraft(emptyDraft());
        setSourceNotes('');
      }
    } else {
      toast.error('Delete failed.');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setDraft(emptyDraft());
    setSourceNotes('');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Cold email offerings</h1>
      <p className={styles.lead}>
        Define outcome-focused outreach angles for local businesses. Pick one when composing a lead
        contact email to track which pitch you used.
      </p>

      <section className={styles.section}>
        <h2 className={styles.h2}>{editingId ? 'Edit offering' : 'New offering'}</h2>
        <label className={styles.label}>
          Source notes
          <textarea
            className={styles.textarea}
            rows={5}
            value={sourceNotes}
            onChange={(e) => setSourceNotes(e.target.value)}
            placeholder="Paste rough notes: what you sell, who it's for, outcomes (faster lead response, fewer no-shows, hours saved)..."
          />
        </label>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => void handleGenerate()}
            disabled={generating}
          >
            {generating ? 'Generating…' : 'Generate offering'}
          </button>
          {editingId ? (
            <button type="button" className={styles.ghostBtn} onClick={handleCancelEdit}>
              Cancel edit
            </button>
          ) : null}
        </div>

        <label className={styles.label}>
          Title
          <input
            className={styles.input}
            value={draft.title}
            onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Faster lead response"
          />
        </label>
        <label className={styles.label}>
          Hook
          <input
            className={styles.input}
            value={draft.hook}
            onChange={(e) => setDraft((prev) => ({ ...prev, hook: e.target.value }))}
            placeholder="Every lead gets a reply in under 90 seconds, 24/7"
          />
        </label>
        <label className={styles.label}>
          Description
          <textarea
            className={styles.textarea}
            rows={4}
            value={draft.description}
            onChange={(e) => setDraft((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="2–4 sentences on the pain solved and who it's for."
          />
        </label>
        <button
          type="button"
          className={styles.primaryBtn}
          onClick={() => void handleSave()}
          disabled={saving}
        >
          {saving ? 'Saving…' : editingId ? 'Update offering' : 'Save offering'}
        </button>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>Saved offerings ({offerings.filter((o) => !o.is_archived).length})</h2>
        {offerings.length === 0 ? (
          <p className={styles.empty}>No offerings yet. Generate one above.</p>
        ) : (
          <ul className={styles.list}>
            {offerings.map((offering) => (
              <li key={offering.id} className={styles.listItem(offering.is_archived)}>
                <div className={styles.listBody}>
                  <p className={styles.listTitle}>
                    {offering.title}
                    {offering.is_archived ? (
                      <span className={styles.archivedBadge}>Archived</span>
                    ) : null}
                  </p>
                  <p className={styles.listHook}>{offering.hook}</p>
                  {offering.description ? (
                    <p className={styles.listDesc}>{offering.description}</p>
                  ) : null}
                </div>
                <div className={styles.listActions}>
                  <button
                    type="button"
                    className={styles.ghostBtn}
                    onClick={() => handleEdit(offering)}
                  >
                    Edit
                  </button>
                  {!offering.is_archived ? (
                    <button
                      type="button"
                      className={styles.ghostBtn}
                      onClick={() => void handleArchive(offering)}
                    >
                      Archive
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className={styles.dangerBtn}
                    onClick={() => void handleDelete(offering)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

const styles = {
  container: `max-w-3xl space-y-8`,
  title: `text-2xl font-semibold text-zinc-900`,
  lead: `text-sm leading-relaxed text-zinc-600`,
  section: `rounded-lg border border-zinc-200 bg-white p-5 space-y-4`,
  h2: `text-sm font-semibold uppercase tracking-wide text-zinc-500`,
  label: `block text-sm font-medium text-zinc-700 space-y-1.5`,
  input: `w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900`,
  textarea: `w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 resize-y min-h-[6rem]`,
  actions: `flex flex-wrap gap-2`,
  primaryBtn: `rounded-md bg-[#ff7c1e] px-4 py-2 text-sm font-medium text-white hover:bg-[#e66b10] disabled:opacity-50`,
  secondaryBtn: `rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 disabled:opacity-50`,
  ghostBtn: `rounded-md px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100`,
  dangerBtn: `rounded-md px-3 py-1.5 text-sm text-red-700 hover:bg-red-50`,
  empty: `text-sm text-zinc-500`,
  list: `space-y-3`,
  listItem: (archived: boolean) =>
    `flex flex-col gap-3 rounded-md border border-zinc-200 p-4 sm:flex-row sm:items-start sm:justify-between ${
      archived ? 'opacity-60' : ''
    }`,
  listBody: `min-w-0 flex-1 space-y-1`,
  listTitle: `font-medium text-zinc-900 flex items-center gap-2`,
  archivedBadge: `text-[10px] uppercase tracking-wide text-zinc-500 border border-zinc-300 rounded px-1.5 py-0.5`,
  listHook: `text-sm text-zinc-700`,
  listDesc: `text-sm text-zinc-500`,
  listActions: `flex flex-wrap gap-2 shrink-0`,
};
