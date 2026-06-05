'use client';

type EnvStepProps = {
  serverUrl: string;
  onServerUrlChange: (url: string) => void;
  onBack: () => void;
  onNext: () => void;
};

export const EnvStep = (props: EnvStepProps) => {
  const { serverUrl, onServerUrlChange, onBack, onNext } = props;

  return (
    <section className={styles.section}>
      <h2 className={styles.h2}>Express API URL</h2>
      <p className={styles.p}>
        Browser calls use <code className={styles.code}>NEXT_PUBLIC_SERVER_URL</code>. Set the
        same value in <code className={styles.code}>.env.local</code> and confirm it here.
      </p>
      <label htmlFor="oss-server-url" className={styles.label}>
        API base URL
      </label>
      <input
        id="oss-server-url"
        type="url"
        className={styles.input}
        value={serverUrl}
        onChange={(e) => onServerUrlChange(e.target.value)}
        placeholder="http://localhost:3032"
      />
      <p className={styles.hint}>Default dev port is 3032.</p>
      <div className={styles.actions}>
        <button type="button" className={styles.secondaryButton} onClick={onBack}>
          Back
        </button>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={onNext}
          disabled={!serverUrl.trim()}
        >
          Next
        </button>
      </div>
    </section>
  );
};

const styles = {
  section: `max-w-xl`,
  h2: `text-2xl font-semibold text-gray-900 mb-3`,
  p: `text-gray-600 mb-4 leading-relaxed`,
  label: `block text-sm font-medium text-gray-700 mb-1`,
  input: `
    w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900
    focus:outline-none focus:ring-2 focus:ring-orange-500
  `,
  hint: `text-sm text-gray-500 mt-2 mb-6`,
  code: `text-sm bg-gray-100 px-1 rounded`,
  actions: `flex gap-3 mt-4`,
  primaryButton: `
    px-4 py-2 rounded-md bg-orange-500 text-white font-medium
    hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed
  `,
  secondaryButton: `
    px-4 py-2 rounded-md border border-gray-300 text-gray-700
    hover:bg-gray-50
  `,
};
