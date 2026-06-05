export type LandingStat = {
  label: string;
  value: string;
};

export type LandingOutboundCard = {
  tag: string;
  title: string;
  body: string;
};

export type LandingHowItWorksStep = {
  title: string;
  body: string;
};

export type LandingDiscoverBullet = string;

export type LandingDashboardRow = {
  name: string;
  category: string;
  status: string;
};

export type LandingPipelineGroup = {
  name: string;
  count: number;
  rows: string[];
};

export type LandingContent = {
  brandName: string;
  hero: {
    kicker: string;
    titleLines: string[];
    subhead: string;
    primaryCta: string;
    secondaryCta: string;
    stats: LandingStat[];
  };
  discover: {
    kicker: string;
    title: string;
    body: string;
    bullets: LandingDiscoverBullet[];
  };
  pipeline: {
    kicker: string;
    title: string;
    body: string;
    groups: LandingPipelineGroup[];
  };
  outbound: {
    kicker: string;
    title: string;
    cards: LandingOutboundCard[];
  };
  selfHost: {
    kicker: string;
    title: string;
    body: string;
    terminalLines: string[];
    docsLink: string;
  };
  howItWorks: {
    kicker: string;
    title: string;
    steps: LandingHowItWorksStep[];
  };
  ecosystem: {
    kicker: string;
    body: string;
    linkLabel: string;
  };
  finalCta: {
    kicker: string;
    title: string;
    primaryCta: string;
    secondaryCta: string;
    tertiaryCta: string;
  };
  footer: {
    links: { label: string; external: boolean }[];
    tags: string[];
  };
  dashboardMock: {
    title: string;
    queuedLabel: string;
    chips: string[];
    groupLabel: string;
    rows: LandingDashboardRow[];
    footerLeft: string;
    footerRight: string;
  };
};
