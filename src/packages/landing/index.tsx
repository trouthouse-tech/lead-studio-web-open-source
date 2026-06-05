import { Discover } from './discover';
import { Ecosystem } from './ecosystem';
import { FinalCta } from './final-cta';
import { Footer } from './footer';
import { Header } from './header';
import { Hero } from './hero';
import { HowItWorks } from './how-it-works';
import { Outbound } from './outbound';
import { Pipeline } from './pipeline';
import { SelfHost } from './self-host';

/**
 * Marketing landing page — ported from lead-studio-hub.
 */
export const MarketingLanding = () => (
  <div className={styles.page}>
    <Header />
    <main>
      <Hero />
      <Discover />
      <Pipeline />
      <Outbound />
      <SelfHost />
      <HowItWorks />
      <Ecosystem />
      <FinalCta />
    </main>
    <Footer />
  </div>
);

const styles = {
  page: `
    min-h-screen bg-background text-foreground
  `,
};
