/**
 * Unit tests for the scraper category and stability classification module.
 *
 * Tests that all known FluentUI packages are classified into the correct
 * category, unknown packages default to 'utilities', and stability is
 * determined correctly from export index membership and source origin.
 */

import { describe, it, expect } from 'vitest';

import {
  classifyCategory,
  classifyStability,
  classifyPackage,
} from '../../../scripts/scraper/classify.js';

import type { DiscoveredPackage } from '../../../scripts/scraper/types.js';

// ============================================================================
// Helpers
// ============================================================================

/**
 * Create a minimal DiscoveredPackage for testing stability classification.
 * Only the fields relevant to classification are populated.
 */
function createTestPackage(
  overrides: Partial<DiscoveredPackage> = {},
): DiscoveredPackage {
  return {
    dirName: 'react-test',
    path: '/mock/react-test',
    packageName: '@fluentui/react-test',
    packageVersion: '9.0.0',
    type: 'component',
    isStableExport: false,
    isPreviewExport: false,
    source: 'fluentui',
    ...overrides,
  };
}

// ============================================================================
// classifyCategory — Buttons
// ============================================================================

describe('classifyCategory — buttons', () => {
  it('should classify react-button as buttons', () => {
    expect(classifyCategory('react-button')).toBe('buttons');
  });
});

// ============================================================================
// classifyCategory — Forms
// ============================================================================

describe('classifyCategory — forms', () => {
  const formPackages = [
    'react-input',
    'react-textarea',
    'react-select',
    'react-combobox',
    'react-checkbox',
    'react-radio',
    'react-switch',
    'react-slider',
    'react-spinbutton',
    'react-field',
    'react-searchbox',
    'react-search',
    'react-rating',
    'react-color-picker',
    'react-swatch-picker',
    'react-tag-picker',
    'react-infolabel',
    'react-label',
    'react-calendar-compat',
    'react-datepicker-compat',
    'react-timepicker-compat',
  ];

  for (const pkg of formPackages) {
    it(`should classify ${pkg} as forms`, () => {
      expect(classifyCategory(pkg)).toBe('forms');
    });
  }
});

// ============================================================================
// classifyCategory — Navigation
// ============================================================================

describe('classifyCategory — navigation', () => {
  const navPackages = [
    'react-menu',
    'react-tabs',
    'react-breadcrumb',
    'react-nav-preview',
    'react-link',
  ];

  for (const pkg of navPackages) {
    it(`should classify ${pkg} as navigation`, () => {
      expect(classifyCategory(pkg)).toBe('navigation');
    });
  }
});

// ============================================================================
// classifyCategory — Data Display
// ============================================================================

describe('classifyCategory — data-display', () => {
  const dataDisplayPackages = [
    'react-avatar',
    'react-badge',
    'react-table',
    'react-list',
    'react-tree',
    'react-tags',
    'react-persona',
    'react-text',
    'react-image',
    'react-skeleton',
  ];

  for (const pkg of dataDisplayPackages) {
    it(`should classify ${pkg} as data-display`, () => {
      expect(classifyCategory(pkg)).toBe('data-display');
    });
  }
});

// ============================================================================
// classifyCategory — Feedback
// ============================================================================

describe('classifyCategory — feedback', () => {
  const feedbackPackages = [
    'react-dialog',
    'react-toast',
    'react-message-bar',
    'react-spinner',
    'react-progress',
    'react-tooltip',
  ];

  for (const pkg of feedbackPackages) {
    it(`should classify ${pkg} as feedback`, () => {
      expect(classifyCategory(pkg)).toBe('feedback');
    });
  }
});

// ============================================================================
// classifyCategory — Overlays
// ============================================================================

describe('classifyCategory — overlays', () => {
  const overlayPackages = [
    'react-popover',
    'react-drawer',
    'react-teaching-popover',
  ];

  for (const pkg of overlayPackages) {
    it(`should classify ${pkg} as overlays`, () => {
      expect(classifyCategory(pkg)).toBe('overlays');
    });
  }
});

// ============================================================================
// classifyCategory — Layout
// ============================================================================

describe('classifyCategory — layout', () => {
  const layoutPackages = ['react-card', 'react-divider'];

  for (const pkg of layoutPackages) {
    it(`should classify ${pkg} as layout`, () => {
      expect(classifyCategory(pkg)).toBe('layout');
    });
  }
});

// ============================================================================
// classifyCategory — Utilities (explicit matches)
// ============================================================================

describe('classifyCategory — utilities (explicit)', () => {
  const utilityPackages = [
    'react-accordion',
    'react-toolbar',
    'react-overflow',
    'react-carousel',
    'react-motion-preview',
    'react-motion',
  ];

  for (const pkg of utilityPackages) {
    it(`should classify ${pkg} as utilities`, () => {
      expect(classifyCategory(pkg)).toBe('utilities');
    });
  }
});

// ============================================================================
// classifyCategory — Default fallback
// ============================================================================

describe('classifyCategory — default fallback', () => {
  it('should default to utilities for unknown packages', () => {
    expect(classifyCategory('react-unknown-component')).toBe('utilities');
  });

  it('should default to utilities for non-react packages', () => {
    expect(classifyCategory('some-random-package')).toBe('utilities');
  });

  it('should default to utilities for empty string', () => {
    expect(classifyCategory('')).toBe('utilities');
  });

  it('should not match partial names incorrectly', () => {
    // 'react-buttons' (plural) should NOT match 'react-button$' (singular)
    expect(classifyCategory('react-buttons')).toBe('utilities');
  });
});

// ============================================================================
// classifyStability
// ============================================================================

describe('classifyStability', () => {
  it('should classify contrib packages as contrib', () => {
    const pkg = createTestPackage({ source: 'contrib' });
    expect(classifyStability(pkg)).toBe('contrib');
  });

  it('should classify contrib as contrib even if stable export', () => {
    // Contrib source always overrides export index membership
    const pkg = createTestPackage({
      source: 'contrib',
      isStableExport: true,
    });
    expect(classifyStability(pkg)).toBe('contrib');
  });

  it('should classify stable exports as stable', () => {
    const pkg = createTestPackage({ isStableExport: true });
    expect(classifyStability(pkg)).toBe('stable');
  });

  it('should classify preview exports as preview', () => {
    const pkg = createTestPackage({ isPreviewExport: true });
    expect(classifyStability(pkg)).toBe('preview');
  });

  it('should prefer stable over preview when both are true', () => {
    // During migration, a package might appear in both indices
    const pkg = createTestPackage({
      isStableExport: true,
      isPreviewExport: true,
    });
    expect(classifyStability(pkg)).toBe('stable');
  });

  it('should classify packages in neither index as unstable', () => {
    const pkg = createTestPackage({
      isStableExport: false,
      isPreviewExport: false,
    });
    expect(classifyStability(pkg)).toBe('unstable');
  });
});

// ============================================================================
// classifyPackage — Combined Classification
// ============================================================================

describe('classifyPackage', () => {
  it('should return both category and stability for a stable component', () => {
    const pkg = createTestPackage({
      dirName: 'react-button',
      isStableExport: true,
      source: 'fluentui',
    });

    const result = classifyPackage(pkg);

    expect(result.category).toBe('buttons');
    expect(result.stability).toBe('stable');
  });

  it('should return both category and stability for a preview component', () => {
    const pkg = createTestPackage({
      dirName: 'react-drawer',
      isPreviewExport: true,
      source: 'fluentui',
    });

    const result = classifyPackage(pkg);

    expect(result.category).toBe('overlays');
    expect(result.stability).toBe('preview');
  });

  it('should return both category and stability for a contrib component', () => {
    const pkg = createTestPackage({
      dirName: 'react-data-grid',
      source: 'contrib',
    });

    const result = classifyPackage(pkg);

    // Unknown contrib package defaults to 'utilities' category
    expect(result.category).toBe('utilities');
    expect(result.stability).toBe('contrib');
  });

  it('should return utilities + unstable for unknown internal package', () => {
    const pkg = createTestPackage({
      dirName: 'react-experimental-thing',
      isStableExport: false,
      isPreviewExport: false,
      source: 'fluentui',
    });

    const result = classifyPackage(pkg);

    expect(result.category).toBe('utilities');
    expect(result.stability).toBe('unstable');
  });

  it('should correctly classify a form component as stable', () => {
    const pkg = createTestPackage({
      dirName: 'react-input',
      isStableExport: true,
      source: 'fluentui',
    });

    const result = classifyPackage(pkg);

    expect(result.category).toBe('forms');
    expect(result.stability).toBe('stable');
  });
});
