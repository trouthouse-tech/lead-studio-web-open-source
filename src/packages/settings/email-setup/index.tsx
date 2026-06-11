'use client';

import Link from 'next/link';
import {
  GITHUB_EXPRESS_REPO_URL,
  LEAD_STUDIO_EMAIL_SENDING_DOC_URL,
} from '@/config/landing-links';

/**
 * Read-only checklist: Workspace service account sending (no Gmail OAuth connect UI).
 */
export const EmailSetup = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Email setup</h1>
      <p className={styles.lead}>
        Outbound lead email is sent by <strong>lead-studio-express-server</strong> using a Google
        Workspace <strong>service account</strong> (domain-wide delegation). Configure secrets on
        the server, not in this web app.
      </p>

      <section className={styles.section}>
        <h2 className={styles.h2}>1. Express server env</h2>
        <ul className={styles.list}>
          <li>
            <code>GMAIL_SERVICE_ACCOUNT_JSON</code> or <code>GMAIL_SERVICE_ACCOUNT_JSON_BASE64</code>
          </li>
          <li>
            <code>GMAIL_SEND_AS_EMAIL</code> — default From mailbox
          </li>
          <li>
            Optional per-row env keys from <code>email_sending_identities</code> in Supabase
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>2. Google Admin</h2>
        <p className={styles.p}>
          Grant the service account client ID domain-wide delegation with{' '}
          <code>https://www.googleapis.com/auth/gmail.send</code>
          {` `}
          (and <code>gmail.readonly</code> if you use reply tracking).
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>3. Point this app at Express</h2>
        <pre className={styles.pre}>{`NEXT_PUBLIC_SERVER_URL=http://localhost:3032`}</pre>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>4. Smoke test (optional)</h2>
        <pre className={styles.pre}>{`curl -X POST http://localhost:3032/api/email/test \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $CRON_SECRET" \\
  -d '{"to":"you@example.com"}'`}</pre>
      </section>

      <p className={styles.footer}>
        Full steps:{' '}
        <a
          href={LEAD_STUDIO_EMAIL_SENDING_DOC_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          lead-studio-email-sending.md
        </a>
        {' · '}
        <Link href={`${GITHUB_EXPRESS_REPO_URL}/blob/main/src/services/email/README.md`}>
          express server email README
        </Link>
      </p>
    </div>
  );
};

const styles = {
  container: `max-w-2xl space-y-6`,
  title: `text-2xl font-semibold text-gray-900`,
  lead: `text-sm text-gray-600 leading-relaxed`,
  section: `rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-3`,
  h2: `text-base font-medium text-gray-900`,
  p: `text-sm text-gray-600 leading-relaxed`,
  list: `list-disc pl-5 text-sm text-gray-700 space-y-1`,
  pre: `rounded-lg bg-gray-50 border border-gray-200 p-3 text-xs text-gray-800 overflow-x-auto`,
  footer: `text-sm text-gray-600`,
  link: `text-orange-600 hover:text-orange-700 underline`,
};
