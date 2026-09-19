/**
 * Specification tests for FluentUI scraper coverage.
 *
 * These tests derive their expectations from the requirement specification
 * only. They are written before the implementation and fail until the
 * coverage, source-revision, determinism, and path-safety behaviour exists.
 *
 * Scraping a fixture runs ts-morph over every component, so the scrape-based
 * tests share one scrape via `beforeAll` and allow a generous timeout.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { resolve } from 'node:path';

import { scrape } from '../../../scripts/scraper/pipeline.js';
import { resolveLatestStableTag } from '../../../scripts/scraper/git-ref.js';
import { resolveSourcePath } from '../../../scripts/scraper/paths.js';
import type { CoverageReport } from '../../../scripts/scraper/coverage.js';
import type { FluentUISchema } from '../../types/schema.js';

/** Root of the mock FluentUI monorepo fixture. */
const MOCK_ROOT = resolve(__dirname, '../fixtures/mock-fluentui');

/** Timeout for a scrape, which exercises ts-morph over every component. */
const SCRAPE_TIMEOUT = 60_000;

/** Component names the specification requires the scraper to cover. */
const REQUIRED_COMPONENTS = [
  'CompoundButton',
  'MenuButton',
  'SplitButton',
  'ToggleButton',
  'ProgressBar',
  'SearchBox',
  'DataGrid',
] as const;

/** A sample of release tags as they appear in the FluentUI git repository. */
const SAMPLE_TAGS = [
  '@fluentui/react-components_v9.0.0',
  '@fluentui/react-components_v9.47.0',
  '@fluentui/react-components_v9.48.1',
  '@fluentui/react-components_v9.48.0',
];

/** Shared scrape result for the fixture. */
let schema: FluentUISchema;
/** Shared coverage report for the fixture. */
let coverage: CoverageReport;

beforeAll(() => {
  const result = scrape({ version: 'v9', source: MOCK_ROOT });
  schema = result.schema;
  coverage = result.coverage;
}, SCRAPE_TIMEOUT);

describe('scraper covers the full v9 component set', () => {
  it('scrapes each Button-family and abbreviated-name component', () => {
    const componentNames = schema.components.map((c) => c.name);
    const scrapedNames = coverage.scraped.map((entry) => entry.name);

    for (const name of REQUIRED_COMPONENTS) {
      expect(componentNames, `component ${name} missing from schema`).toContain(
        name,
      );
      expect(scrapedNames, `component ${name} missing from coverage`).toContain(
        name,
      );
    }
  });

  it('uses the exported component name, not the package name, as the id', () => {
    const progressBar = schema.components.find((c) => c.name === 'ProgressBar');
    const searchBox = schema.components.find((c) => c.name === 'SearchBox');
    const dataGrid = schema.components.find((c) => c.name === 'DataGrid');

    expect(progressBar?.id).toBe('progress-bar');
    expect(searchBox?.id).toBe('search-box');
    expect(dataGrid?.id).toBe('data-grid');
  });
});

describe('scraper pins and records the source revision', () => {
  it('selects the highest stable v9 release tag', () => {
    expect(resolveLatestStableTag(SAMPLE_TAGS)).toBe(
      '@fluentui/react-components_v9.48.1',
    );
  });

  it(
    'records the resolved ref and commit in the schema sources',
    () => {
      const commit = 'fdf755ce26d41c57452b79fb23fc4a590630a1b5';
      const result = scrape({
        version: 'v9',
        source: MOCK_ROOT,
        fluentuiRef: '@fluentui/react-components_v9.48.1',
        commit,
      });

      expect(result.schema.sources.fluentui.ref).toBe(
        '@fluentui/react-components_v9.48.1',
      );
      expect(result.schema.sources.fluentui.commit).toBe(commit);
      expect(result.schema.sources.fluentui.commit).toHaveLength(40);
    },
    SCRAPE_TIMEOUT,
  );
});

describe('scraper output is deterministic', () => {
  it(
    'produces identical schemas except for timestamps',
    () => {
      const second = scrape({ version: 'v9', source: MOCK_ROOT }).schema;

      const stripTimestamps = (value: FluentUISchema): string => {
        const clone = structuredClone(value);
        clone.generatedAt = '';
        clone.sources.fluentui.scrapedAt = '';
        if (clone.sources.contrib) {
          clone.sources.contrib.scrapedAt = '';
        }
        return JSON.stringify(clone);
      };

      expect(stripTimestamps(schema)).toBe(stripTimestamps(second));
    },
    SCRAPE_TIMEOUT,
  );
});

describe('scraper rejects source paths that escape the allowed root', () => {
  it('throws a path-escape error for a traversal source', () => {
    expect(() => resolveSourcePath('../outside', MOCK_ROOT)).toThrow(
      /escape|outside|traversal/i,
    );
  });

  it('accepts a source path inside the allowed root', () => {
    const resolved = resolveSourcePath('.', MOCK_ROOT);
    expect(resolved).toBe(resolve(MOCK_ROOT));
  });
});
