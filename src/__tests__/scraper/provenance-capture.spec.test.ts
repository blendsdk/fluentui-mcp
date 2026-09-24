/**
 * Specification tests for scraper provenance capture.
 *
 * Derived from the provenance requirement: when a scrape runs against a
 * checkout that contains the umbrella `@fluentui/react-components` package,
 * the schema's source record must name that package and its version. The
 * umbrella version is the one value most readers recognize, so it is recorded
 * alongside the git ref and commit.
 *
 * These tests are written before the implementation and must never be edited
 * to match it. A failing test means the implementation is wrong.
 *
 * @module tests/scraper/provenance-capture.spec
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { resolve } from 'node:path';

import { scrape } from '../../../scripts/scraper/pipeline.js';
import type { FluentUISchema } from '../../types/schema.js';

/** Root of the mock FluentUI monorepo fixture, which ships an umbrella package. */
const MOCK_ROOT = resolve(__dirname, '../fixtures/mock-fluentui');

/** Timeout for a scrape, which exercises ts-morph over every component. */
const SCRAPE_TIMEOUT = 60_000;

describe('scraper provenance capture', () => {
  let schema: FluentUISchema;

  beforeAll(() => {
    schema = scrape({ version: 'v9', source: MOCK_ROOT }).schema;
  }, SCRAPE_TIMEOUT);

  it('records the umbrella package name and version from the checkout', () => {
    expect(schema.sources.fluentui.packageName).toBe(
      '@fluentui/react-components',
    );
    expect(schema.sources.fluentui.packageVersion).toBe('9.48.0');
  });
});
