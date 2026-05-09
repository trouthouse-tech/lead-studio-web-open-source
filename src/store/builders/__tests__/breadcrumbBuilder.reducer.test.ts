import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import breadcrumbBuilderReducer, { BreadcrumbBuilderActions } from '../breadcrumbBuilder';

describe('breadcrumbBuilder reducer', () => {
  it('setTrail stores base and segments', () => {
    const next = breadcrumbBuilderReducer(
      undefined,
      BreadcrumbBuilderActions.setTrail({
        base: { label: 'Hub', href: '/hub' },
        segments: [{ kind: 'plainText', label: 'Detail' }],
      }),
    );
    assert.equal(next.base?.label, 'Hub');
    assert.equal(next.base?.href, '/hub');
    assert.equal(next.segments.length, 1);
    assert.equal(next.segments[0]?.kind, 'plainText');
  });

  it('reset restores initial state', () => {
    const seeded = breadcrumbBuilderReducer(
      undefined,
      BreadcrumbBuilderActions.setTrail({
        base: { label: 'A' },
        segments: [{ kind: 'plainText', label: 'B' }],
      }),
    );
    const cleared = breadcrumbBuilderReducer(seeded, BreadcrumbBuilderActions.reset());
    assert.equal(cleared.base, null);
    assert.equal(cleared.segments.length, 0);
  });
});
