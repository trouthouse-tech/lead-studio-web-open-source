'use client';

import { GITHUB_EXPRESS_REPO_URL } from '@/config/landing-links';

type DatabaseStepProps = {
  onBack: () => void;
  onNext: () => void;
};

export const DatabaseStep = (props: DatabaseStepProps) => {
  const { onBack, onNext } = props;

  const sqlReadmeUrl = `${GITHUB_EXPRESS_REPO_URL}/blob/main/sql/README.md`;

  return (
    <section className={styles.section}>
      <h2 className={styles.h2}>Supabase schema</h2>
      <p className={styles.p}>
        Create a Supabase project and run the SQL bundle in order (starts with{' '}
        <code className={styles.code}>sql/001_users_and_credits.sql</code>).
      </p>
      <ol className={styles.list}>
        <li>Copy <code className={styles.code}>SUPABASE_URL</code> and service role key into express <code className={styles.code}>.env</code></li>
        <li>Open Supabase SQL Editor and follow <a href={sqlReadmeUrl} className={styles.link} target="_blank" rel="noreferrer">sql/README.md</a></li>
        <li>Set <code className={styles.code}>ANTHROPIC_API_KEY</code> on express for research features</li>
      </ol>
      <div className={styles.actions}>
        <button type="button" className={styles.secondaryButton} onClick={onBack}>
          Back
        </button>
        <button type="button" className={styles.primaryButton} onClick={onNext}>
          I ran the SQL
        </button>
      </div>
    </section>
  );
};

const styles = {
  section: `max-w-xl`,
  h2: `text-2xl font-semibold text-gray-900 mb-3`,
  p: `text-gray-600 mb-4 leading-relaxed`,
  list: `list-decimal pl-5 text-gray-600 space-y-2 mb-6`,
  link: `text-orange-600 hover:text-orange-700 underline`,
  code: `text-sm bg-gray-100 px-1 rounded`,
  actions: `flex gap-3 mt-4`,
  primaryButton: `
    px-4 py-2 rounded-md bg-orange-500 text-white font-medium hover:bg-orange-600
  `,
  secondaryButton: `
    px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50
  `,
};
