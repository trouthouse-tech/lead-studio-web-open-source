'use client';

import { Mic, Square } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { runLeadLovableDesignPromptThunk } from '@/store/thunks/leads';
import { toast } from 'sonner';

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

const MODAL_TITLE_ID = 'lead-design-prompt-title';

export type DictateDesignPromptModalProps = {
  open: boolean;
  onClose: () => void;
};

export const DictateDesignPromptModal = (props: DictateDesignPromptModalProps) => {
  const { open, onClose } = props;
  const dispatch = useAppDispatch();
  const [isListening, setIsListening] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [notes, setNotes] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const closeModal = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
    onClose();
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
        setNotes((prev) => `${prev}${prev ? ' ' : ''}${transcriptChunk.trim()}`.trim());
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

  const generatePrompt = () => {
    void (async () => {
      const trimmed = notes.trim();
      if (!trimmed || isGenerating) {
        return;
      }

      setIsGenerating(true);
      setGeneratedPrompt('');
      try {
        const result = await dispatch(runLeadLovableDesignPromptThunk(trimmed));
        if (!result?.prompt) {
          toast.error('Could not generate design prompt');
          return;
        }
        setGeneratedPrompt(result.prompt);
        toast.success('Prompt ready — copy and paste into your tool');
      } finally {
        setIsGenerating(false);
      }
    })();
  };

  const copyPrompt = () => {
    const text = generatedPrompt.trim();
    if (!text) {
      return;
    }
    void (async () => {
      try {
        await navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
      } catch {
        toast.error('Could not copy — select the text manually');
      }
    })();
  };

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    if (!open) {
      setNotes('');
      setGeneratedPrompt('');
      setIsListening(false);
      recognitionRef.current?.stop();
    }
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby={MODAL_TITLE_ID}
    >
      <div className={styles.modal}>
        <h3 id={MODAL_TITLE_ID} className={styles.modalTitle}>
          Design prompt
        </h3>
        <p className={styles.modalSubtitle}>
          Describe the business, audience, services, and tone. We generate one detailed prompt you can paste
          into any AI coding or design tool (site builders, v0, Cursor, and similar). The model usually
          assumes a local service marketing site with Home, Services, Portfolio, and Contact—adjust your
          notes if you want something different.
        </p>

        <textarea
          className={styles.textarea}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={7}
          placeholder="Example: Residential HVAC in Austin, family-owned 12 years, focus on fast emergency repairs and maintenance plans..."
        />

        <div className={styles.modalActions}>
          <button
            type="button"
            className={isListening ? styles.modalStopBtn : styles.modalPrimaryBtn}
            onClick={toggleListening}
            disabled={isGenerating}
          >
            {isListening ? (
              <>
                <Square className="h-3.5 w-3.5" aria-hidden />
                Stop listening
              </>
            ) : (
              <>
                <Mic className="h-3.5 w-3.5" aria-hidden />
                Start dictation
              </>
            )}
          </button>
          <button
            type="button"
            className={styles.modalPrimaryBtn}
            onClick={generatePrompt}
            disabled={!notes.trim() || isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate design prompt'}
          </button>
          <button type="button" className={styles.modalSecondaryBtn} onClick={closeModal} disabled={isGenerating}>
            Close
          </button>
        </div>

        {generatedPrompt ? (
          <div className={styles.outputBox}>
            <div className={styles.outputHeader}>
              <p className={styles.outputTitle}>Generated prompt</p>
              <button type="button" className={styles.copyButton} onClick={copyPrompt}>
                Copy
              </button>
            </div>
            <textarea
              className={styles.outputTextarea}
              readOnly
              rows={14}
              value={generatedPrompt}
              aria-label="Generated design prompt"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

const styles = {
  overlay: `
    fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4
  `,
  modal: `
    max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-gray-200 bg-white p-6 shadow-xl
  `,
  modalTitle: `text-lg font-semibold text-gray-900`,
  modalSubtitle: `mt-1 text-sm text-gray-600`,
  textarea: `
    mt-4 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800
    focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30
  `,
  modalActions: `mt-3 flex flex-wrap items-center gap-2`,
  modalPrimaryBtn: `
    inline-flex items-center gap-1.5 rounded-md border border-orange-200 bg-orange-50 px-3 py-2 text-sm font-medium
    text-orange-900 hover:bg-orange-100 transition-colors disabled:cursor-not-allowed disabled:opacity-50
  `,
  modalStopBtn: `
    inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium
    text-red-800 hover:bg-red-100 transition-colors disabled:cursor-not-allowed disabled:opacity-50
  `,
  modalSecondaryBtn: `
    rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-800
    hover:bg-gray-100 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50
  `,
  outputBox: `mt-5 rounded-lg border border-gray-200 bg-gray-50 p-3`,
  outputHeader: `flex items-center justify-between gap-2`,
  outputTitle: `text-xs font-semibold uppercase tracking-wide text-gray-700`,
  copyButton: `
    inline-flex items-center gap-1 rounded-md border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-medium
    text-orange-900 hover:bg-orange-100 transition-colors
  `,
  outputTextarea: `
    mt-2 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 font-mono
    focus:outline-none focus:ring-2 focus:ring-orange-400/20
  `,
} as const;
