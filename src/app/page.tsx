import { MarketingLanding } from '@/packages/landing';

export const metadata = {
  description:
    'Find businesses, work follow-ups, and keep the trail — Next.js + Express on your Supabase, not another spreadsheet export.',
  openGraph: {
    title: 'Lead Studio — Open-source · self-hosted lead CRM',
    description:
      'Find the business. Work the follow-up. Keep the trail. Self-hostable lead pipeline for teams that want their data in Supabase.',
    type: 'website',
  },
};

export default function Home() {
  return <MarketingLanding />;
}
