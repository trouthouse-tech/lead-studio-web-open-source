import type { LandingContent } from './landing-content.types';

export const LANDING_CONTENT: LandingContent = {
  brandName: 'Lead Studio',
  hero: {
    kicker: 'Open-source lead generation',
    titleLines: ['Find leads.', 'Follow up.', 'Close the loop.'],
    subhead:
      'Self-hostable CRM for commercial outbound — discover businesses, track contacts, queue emails, and log calls without spreadsheets or SaaS lock-in.',
    primaryCta: 'Open Lead Studio',
    secondaryCta: 'View on GitHub',
    stats: [
      { label: 'Self-hostable', value: 'Your infra' },
      { label: 'Full pipeline', value: 'End-to-end' },
      { label: 'Open source', value: 'MIT licensed' },
    ],
  },
  discover: {
    kicker: '01 — Discover',
    title: 'Stop hunting in browser tabs.',
    body: 'Find Leads searches Google Places for businesses in your category and city, then saves selected results directly into your Commercial Leads table — no copy-pasting, no scattered docs.',
    bullets: [
      'Google Places discovery',
      'One-click save to pipeline',
      'Persistent filters across sessions',
    ],
  },
  pipeline: {
    kicker: '02 — Pipeline',
    title: "One table for every lead you're chasing.",
    body: 'Grouped categories, saved filters, bulk select, and a full lead detail view. The Commercial Leads table is your single source of truth — no exports, no sync jobs.',
    groups: [
      { name: 'Cafés', count: 24, rows: ['Northside Coffee', 'Bluebird Espresso'] },
      { name: 'Trades', count: 41, rows: ['Halton Plumbing', 'Acme Electric'] },
    ],
  },
  outbound: {
    kicker: '03 — Outbound',
    title: 'Contacts, calls, and email — connected.',
    cards: [
      {
        tag: 'Contacts',
        title: 'Lead contacts',
        body: 'Multiple contacts per lead with role, channel, and last-touch context.',
      },
      {
        tag: 'Calls',
        title: 'To Call Log',
        body: 'Queue calls, mark outcomes, and keep a chronological trail per lead.',
      },
      {
        tag: 'Email',
        title: 'Queue & sent',
        body: 'Stage outbound emails, send when ready, archive everything sent.',
      },
    ],
  },
  selfHost: {
    kicker: '04 — Self-host',
    title: 'Next.js frontend. Express API. Your stack.',
    body: 'Two repos. Standard tooling. Deploy to your own infrastructure — no vendor accounts, no telemetry, no upsells.',
    terminalLines: [
      'git clone lead-studio-web-open-source',
      'git clone lead-studio-express-server',
      'npm run dev',
    ],
    docsLink: 'Documentation & repos',
  },
  howItWorks: {
    kicker: 'How it works',
    title: 'Four steps, every week.',
    steps: [
      { title: 'Find', body: 'Discover businesses worth reaching out to.' },
      { title: 'Organize', body: 'Categorize, filter, prioritize.' },
      { title: 'Reach out', body: 'Log calls, queue emails.' },
      { title: 'Iterate', body: 'Review sent mail, keep the pipeline moving.' },
    ],
  },
  ecosystem: {
    kicker: 'Ecosystem',
    body: 'Lead Studio is one open-source studio in the Luckee ecosystem — a growing set of focused, self-hostable tools for operators.',
    linkLabel: 'luckeeapp.com',
  },
  finalCta: {
    kicker: 'Get started',
    title: "Your pipeline shouldn't live in a spreadsheet.",
    primaryCta: 'Open Lead Studio',
    secondaryCta: 'View on GitHub',
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
