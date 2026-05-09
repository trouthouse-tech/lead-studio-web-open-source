/**
 * Serializable breadcrumb trail segments for dashboard header (Redux-safe, no functions).
 */
export type BreadcrumbEntitySwitcherKind = 'lead';

export type BreadcrumbSegmentStaticLink = {
  kind: 'staticLink';
  label: string;
  href?: string;
};

export type BreadcrumbSegmentPlainText = {
  kind: 'plainText';
  label: string;
};

export type BreadcrumbSegmentEntitySwitcher = {
  kind: 'entitySwitcher';
  entityKind: BreadcrumbEntitySwitcherKind;
  currentId: string;
  isPendingSelection?: boolean;
};

export type BreadcrumbSegment =
  | BreadcrumbSegmentStaticLink
  | BreadcrumbSegmentPlainText
  | BreadcrumbSegmentEntitySwitcher;

export type BreadcrumbTrailBase = {
  label: string;
  href?: string;
};
