'use client';

import { Mic, Square, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { refreshCurrentLeadThunk, runLeadDictationNotesResearchThunk } from '@/store/thunks/leads';

type SpeechRecognitionEventResult = {
  isFinal: boolean;
  0: {
    transcript: string;
  };
};

type SpeechRecognitionEventLike = Event & {
  resultIndex: number;
  results: SpeechRecognitionEventResult[];
};

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

type WindowWithSpeech = Window & {
  SpeechRecognition?: SpeechRecognitionCtor;
  webkitSpeechRecognition?: SpeechRecognitionCtor;
};

const MODAL_TITLE_ID = 'voice-overview-title';

/**
 * Lets users dictate a quick value-opportunity overview from website notes.
 */
export const ResearchVoiceOverviewButton = () => {
  const dispatch = useAppDispatch();
  const leadId = useAppSelector((state) => state.currentLead.id);
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [overviewNotes, setOverviewNotes] = useState('');
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const closeModal = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
    setIsOpen(false);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognitionWindow = window as WindowWithSpeech;
    const RecognitionCtor =
      recognitionWindow.SpeechRecognition ?? recognitionWindow.webkitSpeechRecognition;

    if (!RecognitionCtor) {
      toast.error('Voice dictation is not available in this browser');
      return;
    }

    const recognition = new RecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let transcriptChunk = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        if (result.isFinal) {
          transcriptChunk += `${result[0].transcript.trim()} `;
        }
      }

      if (transcriptChunk.trim()) {
        setOverviewNotes((prev) => `${prev}${prev ? ' ' : ''}${transcriptChunk.trim()}`.trim());
      }
    };

    recognition.onerror = () => {
      toast.error('Voice dictation hit an error. Try again.');
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const handleGenerateAtAGlance = () => {
    void (async () => {
      const notes = overviewNotes.trim();
      if (!leadId || !notes || isSubmitting) {
        return;
      }

      setIsSubmitting(true);
      try {
        const status = await dispatch(runLeadDictationNotesResearchThunk(notes));
        if (status !== 200) {
          toast.error('Could not generate at a glance from dictation notes');
          return;
        }

        const refreshStatus = await dispatch(refreshCurrentLeadThunk(leadId));
        if (refreshStatus !== 200) {
          toast.error('Generated overview, but refreshing the lead failed');
          return;
        }

        toast.success('At a glance updated from dictation notes');
        closeModal();
      } finally {
        setIsSubmitting(false);
      }
    })();
  };

  return (
    <>
      <button
        type="button"
        className={styles.iconTrigger}
        title="Voice-dictate your overview"
        aria-label="Voice-dictate overview"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(true);
        }}
      >
        <Mic className="h-3.5 w-3.5" aria-hidden />
      </button>

      {isOpen && (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby={MODAL_TITLE_ID}>
          <div className={styles.modal}>
            <h3 id={MODAL_TITLE_ID} className={styles.title}>
              Talk through your website overview
            </h3>
            <p className={styles.subtitle}>
              Share what you noticed across their web presence and where you can add value. You can
              dictate, type, or mix both.
            </p>

            <div className={styles.promptBox}>
              <p className={styles.promptTitle}>Helpful prompts</p>
              <ul className={styles.promptList}>
                <li>What services are clearly visible?</li>
                <li>What feels outdated, confusing, or missing?</li>
                <li>What immediate opportunities could you help with?</li>
              </ul>
            </div>

            <textarea
              className={styles.textarea}
              value={overviewNotes}
              onChange={(event) => setOverviewNotes(event.target.value)}
              placeholder="Example: They have solid social proof but weak offer clarity above the fold..."
              rows={8}
            />

            <div className={styles.actions}>
              <button type="button" className={styles.secondary} onClick={() => setOverviewNotes('')}>
                <Trash2 className="h-3.5 w-3.5" aria-hidden />
                Clear
              </button>
              <button
                type="button"
                className={isListening ? styles.stopButton : styles.listenButton}
                onClick={toggleListening}
                disabled={isSubmitting}
              >
                {isListening ? (
                  <>
                    <Square className="h-3.5 w-3.5" aria-hidden />
                    Stop listening
                  </>
                ) : (
                  <>
                    <Mic className="h-3.5 w-3.5" aria-hidden />
                    Start voice dictation
                  </>
                )}
              </button>
              <button
                type="button"
                className={styles.submitButton}
                onClick={handleGenerateAtAGlance}
                disabled={!overviewNotes.trim() || isSubmitting}
              >
                {isSubmitting ? 'Generating...' : 'Generate at a glance'}
              </button>
              <button type="button" className={styles.secondary} onClick={closeModal} disabled={isSubmitting}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  iconTrigger: `
    inline-flex shrink-0 items-center justify-center rounded p-0.5 text-gray-500
    hover:text-[#FF7C1E] hover:bg-orange-50
  `,
  overlay: `
    fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4
  `,
  modal: `bg-white rounded-lg shadow-xl max-w-2xl w-full p-6`,
  title: `text-lg font-semibold text-gray-900`,
  subtitle: `text-sm text-gray-600 mt-1 mb-4`,
  promptBox: `rounded-md border border-orange-100 bg-orange-50 p-3 mb-4`,
  promptTitle: `text-xs font-semibold uppercase tracking-wide text-orange-900 mb-1.5`,
  promptList: `list-disc list-inside text-xs text-orange-900/90 space-y-0.5`,
  textarea: `
    w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800
    focus:outline-none focus:ring-2 focus:ring-[#FF7C1E] focus:border-[#FF7C1E]
  `,
  actions: `mt-4 flex items-center justify-end gap-2`,
  secondary: `
    inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-gray-300 bg-white text-sm text-gray-700
    hover:bg-gray-50
  `,
  listenButton: `
    inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-[#FF7C1E] bg-[#FF7C1E] text-sm text-white
    hover:bg-[#e66b10]
  `,
  stopButton: `
    inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-red-500 bg-red-500 text-sm text-white
    hover:bg-red-600
  `,
  submitButton: `
    inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-[#1f7a3d] bg-[#1f7a3d] text-sm text-white
    hover:bg-[#196533] disabled:opacity-50 disabled:cursor-not-allowed
  `,
};
