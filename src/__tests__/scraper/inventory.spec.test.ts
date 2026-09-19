/**
 * Specification tests for scraper component-inventory correctness.
 *
 * Derived from the content-model requirement: the schema must contain exactly
 * the public component exports of the umbrella package, confirmed by a
 * matching types file. The scraper must not invent a component from a package
 * directory or an internal types file, and must not duplicate a component that
 * two packages could both claim.
 *
 * The fixture reproduces the three failure modes seen in production:
 * a hook-only package that still has `.tsx` and `.types.ts` files, and a
 * preview package that is not re-exported but looks like a component on disk.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { resolve } from 'node:path';

import { scrape } from '../../../scripts/scraper/pipeline.js';
import type { CoverageReport } from '../../../scripts/scraper/coverage.js';
import type { FluentUISchema } from '../../types/schema.js';

/** Root of the phantom-component regression fixture. */
const FIXTURE = resolve(__dirname, '../fixtures/mock-fluentui-phantom');

/** Timeout for a scrape, which exercises ts-morph over every component. */
const SCRAPE_TIMEOUT = 60_000;

/** Shared scrape result for the fixture. */
let schema: FluentUISchema;
/** Shared coverage report for the fixture. */
let coverage: CoverageReport;

beforeAll(() => {
  const result = scrape({ version: 'v9', source: FIXTURE });
  schema = result.schema;
  coverage = result.coverage;
}, SCRAPE_TIMEOUT);

describe('scraper component inventory', () => {
  it('scrapes only the package public component exports', () => {
    expect(schema.components.map((component) => component.name)).toEqual([
      'Widget',
    ]);
  });

  it('does not duplicate a component reachable from more than one package', () => {
    const ids = schema.components.map((component) => component.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('reports a hook-only package as excluded, not as a component', () => {
    const scrapedPackages = coverage.scraped.map((entry) => entry.packageName);
    const excludedPackages = coverage.excluded.map((entry) => entry.packageName);

    expect(scrapedPackages).not.toContain('@fluentui/react-thing');
    expect(excludedPackages).toContain('@fluentui/react-thing');
  });

  it('reports a non-re-exported preview package as excluded', () => {
    const scrapedPackages = coverage.scraped.map((entry) => entry.packageName);
    const excludedPackages = coverage.excluded.map((entry) => entry.packageName);

    expect(scrapedPackages).not.toContain('@fluentui/react-widget-preview');
    expect(excludedPackages).toContain('@fluentui/react-widget-preview');
  });
});
