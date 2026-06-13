import type { LandingContent } from './landing-content.types';

export const LANDING_CONTENT: LandingContent = {
  brandName: 'Lead Studio',
  hero: {
    kicker: 'Free software · run it yourself',
    titleLines: ['Keep track of your leads.'],
    subhead:
      'Find businesses near you and save them to one list. Log calls, queue email, and see the full history on each lead. Open source. You run it. Your data stays in your database.',
    primaryCta: 'Open the app',
    secondaryCta: 'Setup guide',
    stats: [
      { label: 'Find', value: 'Businesses near you' },
      { label: 'Track', value: 'Calls & email' },
      { label: 'Price', value: 'Free (MIT)' },
    ],
  },
  discover: {
    kicker: 'Find',
    title: 'Search your city, save the names.',
    body: 'Search by category and city. Save businesses into your lead list in one click. Your filters and groups are still there when you come back.',
    bullets: [
      'Search by what you sell and where you sell it',
      'Save names in one click',
      'Your filters are still there next time you open the app',
    ],
  },
  pipeline: {
    kicker: 'List',
    title: 'Sort, filter, and open any lead.',
    body: 'Group by category. Filter what you are working this week. Open a lead and see contacts, calls, and email on the same page.',
    groups: [
      { name: 'Cafés', count: 24, rows: ['Northside Coffee', 'Bluebird Espresso'] },
      { name: 'Trades', count: 41, rows: ['Halton Plumbing', 'Acme Electric'] },
    ],
  },
  outbound: {
    kicker: 'Follow up',
    title: 'Calls and email stay on the name.',
    cards: [
      {
        tag: 'Contacts',
        title: 'People at the business',
        body: 'Owner, manager, front desk. Note who you talked to and how to reach them.',
      },
      {
        tag: 'Calls',
        title: 'To Call Log',
        body: 'Who to call today. What happened when you did. Still on the same page as the business.',
      },
      {
        tag: 'Email',
        title: 'Sent mail',
        body: 'Write the email, send it when ready, see what went out later without digging through Gmail.',
      },
    ],
  },
  selfHost: {
    kicker: 'Install',
    title: 'Run it on your own computer.',
    body: 'Lead Studio is open source. Run it on a laptop to try it, or on a server you control. Your lead list lives in your database. The setup guide walks through install step by step.',
    terminalLines: [
      'git clone Luckee-Core/lead-studio-web-open-source',
      'git clone Luckee-Core/lead-studio-express-server',
      'npm run dev  # web :3000 · API :3032',
    ],
    docsLink: 'Setup guide',
  },
  howItWorks: {
    kicker: 'Weekly habit',
    title: 'What you can do with it.',
    steps: [
      { title: 'Add names', body: 'Find businesses worth a call and put them in the list.' },
      { title: 'Sort the list', body: 'Group by type. Work the ones that matter this week.' },
      { title: 'Call and email', body: 'Log the call. Send the mail. It stays on that name.' },
      { title: 'Pick up next week', body: 'Open the list again. You can see what already happened.' },
    ],
  },
  ecosystem: {
    kicker: 'More tools',
    body: 'Lead Studio is one open-source tool from Luckee. Use this if outbound leads are your job. Add other Luckee tools later if you need them.',
    linkLabel: 'luckeeapp.com',
  },
  finalCta: {
    kicker: 'Try it',
    title: 'Free software for tracking outbound leads.',
    primaryCta: 'Open the app',
    secondaryCta: 'Setup guide',
    tertiaryCta: 'Other Luckee tools',
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
    title: 'Leads',
    queuedLabel: '12 to call',
    chips: ['All', 'Cafés', 'Trades', 'Healthcare', 'Retail'],
    groupLabel: 'Cafés (24)',
    rows: [
      { name: 'Northside Coffee Roasters', category: 'Cafés', status: 'New' },
      { name: 'Halton & Sons Plumbing', category: 'Trades', status: 'Called' },
      { name: 'Meridian Dental Group', category: 'Healthcare', status: 'Emailed' },
      { name: 'Pier 12 Marine Supply', category: 'Retail', status: 'New' },
    ],
    footerLeft: '4 of 218',
    footerRight: 'Find businesses',
  },
};
