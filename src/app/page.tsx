import { MarketingLanding } from '@/packages/landing';

export const metadata = {
  title: 'Lead Studio — Open-source lead generation & outbound CRM',
  description:
    'Self-hostable CRM for commercial outbound — discover businesses, track contacts, queue emails, and log calls without spreadsheets or SaaS lock-in.',
  openGraph: {
    title: 'Lead Studio — Open-source lead generation & outbound CRM',
    description:
      'Self-hostable CRM for commercial outbound. Find leads, follow up, close the loop.',
    type: 'website',
  },
};

export default function Home() {
  return <MarketingLanding />;
}
