'use client';

import {
  GETTING_STARTED_REPO_URL,
  GITHUB_EXPRESS_REPO_URL,
  GITHUB_WEB_REPO_URL,
  OSS_QUICKSTART_URL,
} from '@/config/landing-links';

type IntroStepProps = {
  onNext: () => void;
};

export const IntroStep = (props: IntroStepProps) => {
  const { onNext } = props;

  return (
    <section className={styles.section}>
      <h2 className={styles.h2}>Welcome to Lead Studio</h2>
      <p className={styles.p}>
        This open-source slice pairs a Next.js CRM with an Express API (Supabase + research
        workers). This wizard verifies your stack before you use the dashboard.
      </p>
      <ul className={styles.list}>
        <li>
          Web repo:{' '}
          <a href={GITHUB_WEB_REPO_URL} className={styles.link} target="_blank" rel="noreferrer">
            lead-studio-web-open-source
          </a>
        </li>
        <li>
          API repo:{' '}
          <a href={GITHUB_EXPRESS_REPO_URL} className={styles.link} target="_blank" rel="noreferrer">
            lead-studio-express-server
          </a>
        </li>
        <li>
          Pair quickstart:{' '}
          <a href={OSS_QUICKSTART_URL} className={styles.link} target="_blank" rel="noreferrer">
            docs/oss-quickstart.md
          </a>
        </li>
        <li>
          Luckee studio map:{' '}
          <a href={GETTING_STARTED_REPO_URL} className={styles.link} target="_blank" rel="noreferrer">
            getting-started
          </a>
        </li>
      </ul>
      <button type="button" className={styles.primaryButton} onClick={onNext}>
        Get started
      </button>
    </section>
  );
};

const styles = {
  section: `
    max-w-xl
  `,
  h2: `
    text-2xl font-semibold text-gray-900 mb-3
  `,
  p: `
    text-gray-600 mb-4 leading-relaxed
  `,
  list: `
    list-disc pl-5 text-gray-600 space-y-2 mb-6
  `,
  link: `
    text-orange-600 hover:text-orange-700 underline
  `,
  primaryButton: `
    px-4 py-2 rounded-md bg-orange-500 text-white font-medium
    hover:bg-orange-600
  `,
};
