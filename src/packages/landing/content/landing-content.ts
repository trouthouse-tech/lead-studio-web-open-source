import type { LandingContent } from './landing-content.types';

export const LANDING_CONTENT: LandingContent = {
  brandName: 'Lead Studio',
  hero: {
    kicker: 'Self-hosted lead CRM',
    titleLines: ['Find the business.', 'Work the follow-up.', 'Keep the trail.'],
    subhead:
      'If you are still copying names out of Google Maps into a spreadsheet, this is the pipeline I ship for teams that want lead data in their own Supabase — not another SaaS export at month-end.',
    primaryCta: 'Open the dashboard',
    secondaryCta: 'Clone on GitHub',
    stats: [
      { label: 'Stack', value: 'Next + Express' },
      { label: 'Database', value: 'Your Supabase' },
      { label: 'License', value: 'MIT' },
    ],
  },
  discover: {
    kicker: '01 — Discover',
    title: 'Stop hunting in browser tabs.',
    body: 'Find Leads searches Google Places for your category and city, then saves what you pick into Commercial Leads. One flow — no copy-paste tour across Maps, Notes, and Sheets.',
    bullets: [
      'Google Places by category + city',
      'Save selected businesses in one click',
      'Filters persist when you come back',
    ],
  },
  pipeline: {
    kicker: '02 — Pipeline',
    title: 'One table for the leads you are actually chasing.',
    body: 'Grouped categories, saved filters, bulk select, and a detail view per lead. The table is the source of truth — not a weekly CSV you reconcile by hand.',
    groups: [
      { name: 'Cafés', count: 24, rows: ['Northside Coffee', 'Bluebird Espresso'] },
      { name: 'Trades', count: 41, rows: ['Halton Plumbing', 'Acme Electric'] },
    ],
  },
  outbound: {
    kicker: '03 — Outbound',
    title: 'Contacts, calls, and email on the same record.',
    cards: [
      {
        tag: 'Contacts',
        title: 'Lead contacts',
        body: 'More than one person per account — role, channel, and where you left off last touch.',
      },
      {
        tag: 'Calls',
        title: 'To Call Log',
        body: 'Queue the call, log the outcome, keep a chronological trail attached to the lead.',
      },
      {
        tag: 'Email',
        title: 'Queue & sent',
        body: 'Stage outbound mail, send when it is ready, archive what went out so you can review later.',
      },
    ],
  },
  selfHost: {
    kicker: '04 — Self-host',
    title: 'Two repos you can run on localhost today.',
    body: 'Next.js for the CRM UI. Express for Supabase, research workers, and the email queue. Fork it, point env vars at your project, keep the rows.',
    terminalLines: [
      'git clone Luckee-Core/lead-studio-web-open-source',
      'git clone Luckee-Core/lead-studio-express-server',
      'npm run dev  # web :3000 · API :3032',
    ],
    docsLink: 'Repos & quickstart',
  },
  howItWorks: {
    kicker: 'How it works',
    title: 'Four steps, most weeks.',
    steps: [
      { title: 'Find', body: 'Pull businesses worth a conversation into the table.' },
      { title: 'Organize', body: 'Category, filter, rank what is worth your time.' },
      { title: 'Reach out', body: 'Log calls, queue email — on the lead, not in a side doc.' },
      { title: 'Review', body: 'Check sent mail, move the pipeline forward.' },
    ],
  },
  ecosystem: {
    kicker: 'Ecosystem',
    body: 'Lead Studio is one open-source studio in the Luckee lineup — focused tools you can self-host when you want the same architecture as Core without the hosted bill.',
    linkLabel: 'luckeeapp.com',
  },
  finalCta: {
    kicker: 'Get started',
    title: 'Your pipeline should not live in a spreadsheet.',
    primaryCta: 'Open the dashboard',
    secondaryCta: 'Clone on GitHub',
    tertiaryCta: 'Luckee open source',
  },
  footer: {
    links: [
      { label: 'GitHub', external: true },
      { label: 'Docs', external: true },
      { label: 'Luckee', external: true },
    ],
    tags: ['© 2026', 'Open source', 'Self-hostable'],
  },
  dashboardMock: {
    title: 'Commercial Leads',
    queuedLabel: '12 queued',
    chips: ['All', 'Cafés', 'Trades', 'Healthcare', 'Retail'],
    groupLabel: 'Group · Cafés (24)',
    rows: [
      { name: 'Northside Coffee Roasters', category: 'Cafés', status: 'New' },
      { name: 'Halton & Sons Plumbing', category: 'Trades', status: 'Contacted' },
      { name: 'Meridian Dental Group', category: 'Healthcare', status: 'Queued' },
      { name: 'Pier 12 Marine Supply', category: 'Retail', status: 'New' },
    ],
    footerLeft: '4 of 218 leads',
    footerRight: 'Find Leads →',
  },
};
