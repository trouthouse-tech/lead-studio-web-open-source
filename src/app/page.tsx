import { MarketingLanding } from '@/packages/landing';

export const metadata = {
  description:
    'Find businesses, log calls, and send email from one list. Open-source software you run yourself. Your lead data stays in your database.',
  openGraph: {
    title: 'Lead Studio',
    description:
      'Keep track of your leads. Find businesses, log calls, and send email from one list.',
    type: 'website',
  },
};

export default function Home() {
  return <MarketingLanding />;
}
