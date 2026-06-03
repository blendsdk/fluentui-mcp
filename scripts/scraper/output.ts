/**
 * Schema output writer for the FluentUI scraper.
 *
 * Takes extracted component and utility data and assembles a complete
 * FluentUISchema JSON file. Computes aggregate statistics and ensures
 * the output directory exists before writing.
 *
 * @module scraper/output
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

import type {
  FluentUISchema,
  ComponentEntry,
  UtilityEntry,
  SchemaStats,
  SourceInfo,
} from '../../src/types/schema.js';

// ============================================================================
// Types
// ============================================================================

/**
 * Options for writing the schema output file.
 */
export interface SchemaOutputOptions {
  /** FluentUI version string (e.g., 'v9') */
  version: string;

  /** Absolute path for the output JSON file */
  outputPath: string;

  /** Extracted component entries */
  components: ComponentEntry[];

  /** Extracted utility entries */
  utilities: UtilityEntry[];

  /** Source repository information */
  sources: {
    fluentui: SourceInfo;
    contrib?: SourceInfo;
  };
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Assemble and write a complete FluentUISchema JSON file.
 *
 * Builds the schema from extracted components and utilities, computes
 * statistics, and writes the result as pretty-printed JSON. The enhancer
 * fields (foundation, patterns, enterprise, quickReference) are left
 * empty — they will be populated by the enhancer stage.
 *
 * @param options - Schema output configuration
 * @returns The assembled FluentUISchema object (also written to disk)
 */
export function writeSchema(options: SchemaOutputOptions): FluentUISchema {
  const schema: FluentUISchema = {
    schemaVersion: '1.0',
    version: options.version,
    generatedAt: new Date().toISOString(),
    sources: options.sources,
    components: options.components,
    utilities: options.utilities,
    // Enhancer-populated fields — empty in scraper output
    foundation: [],
    patterns: [],
    enterprise: [],
    quickReference: [],
    stats: computeStats(options.components, options.utilities),
  };

  // Ensure the output directory exists (creates recursively if needed)
  mkdirSync(dirname(options.outputPath), { recursive: true });

  // Write pretty-printed JSON for readability and diffing
  writeFileSync(
    options.outputPath,
    JSON.stringify(schema, null, 2),
    'utf-8',
  );

  return schema;
}

// ============================================================================
// Statistics
// ============================================================================

/**
 * Compute aggregate statistics for the schema.
 *
 * Tallies component/utility counts, stability breakdowns, story/prop
 * totals, and category distribution. These stats are included in the
 * schema for quick overview reporting without traversing all entries.
 *
 * @param components - All extracted component entries
 * @param utilities - All extracted utility entries
 * @returns Computed statistics object
 */
export function computeStats(
  components: ComponentEntry[],
  utilities: UtilityEntry[],
): SchemaStats {
  // Count components per category
  const categoryCounts: Record<string, number> = {};
  for (const comp of components) {
    categoryCounts[comp.category] = (categoryCounts[comp.category] ?? 0) + 1;
  }

  // Combine components and utilities for stability counting
  const allEntries = [
    ...components.map((c) => c.stability),
    ...utilities.map((u) => u.stability),
  ];

  return {
    totalComponents: components.length,
    totalUtilities: utilities.length,
    totalContrib: allEntries.filter((s) => s === 'contrib').length,
    totalPreview: allEntries.filter((s) => s === 'preview').length,
    totalStories: components.reduce((sum, c) => sum + c.stories.length, 0),
    totalProps: components.reduce((sum, c) => sum + c.props.length, 0),
    categoryCounts,
  };
}
