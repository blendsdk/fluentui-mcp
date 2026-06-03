/**
 * Diff engine for comparing raw schema against previous enhanced schema.
 *
 * Determines which components and utilities are new, changed, unchanged,
 * or removed by comparing source hashes. This enables incremental
 * re-enhancement — only new/changed entries are sent to the LLM,
 * while unchanged entries carry forward their existing enhancements.
 *
 * @module enhancer/diff
 */

import type { FluentUISchema } from '../../src/types/schema.js';
import type { DiffResult, DiffStats, HashIndex } from './types.js';
import { buildHashIndex } from './hasher.js';

// ============================================================================
// Public API
// ============================================================================

/**
 * Compare a raw schema against a previous enhanced schema to determine
 * what needs re-enhancement.
 *
 * For each component/utility in the raw schema:
 * 1. Compute its source hash
 * 2. Look up in previous enhanced schema by ID
 * 3. If not found → new (needs enhancement)
 * 4. If found but hash differs → changed (needs re-enhancement)
 * 5. If found and hash matches → unchanged (carry forward)
 *
 * Components in previous but not in raw → removed.
 *
 * @param rawSchema - The freshly scraped raw schema
 * @param previousEnhanced - The previous enhanced schema (null for first run)
 * @param previousHashes - Hash index from the previous enhanced schema (null for first run)
 * @returns DiffResult with categorized entries and statistics
 */
export function diffSchemas(
  rawSchema: FluentUISchema,
  previousEnhanced: FluentUISchema | null,
  previousHashes: HashIndex | null = null,
): DiffResult {
  // Build hash index for the current raw schema
  const currentHashes = buildHashIndex(
    rawSchema.components,
    rawSchema.utilities,
  );

  // If no previous schema, everything is new
  if (!previousEnhanced || !previousHashes) {
    return buildAllNewResult(rawSchema, currentHashes);
  }

  // Build ID sets for previous schema
  const previousComponentIds = new Set(
    previousEnhanced.components.map((c) => c.id),
  );
  const previousUtilityIds = new Set(
    previousEnhanced.utilities.map((u) => u.id),
  );

  // Categorize components
  const newComponents = rawSchema.components.filter(
    (c) => !previousComponentIds.has(c.id),
  );

  const changedComponents = rawSchema.components.filter((c) => {
    if (!previousComponentIds.has(c.id)) return false;
    const currentHash = currentHashes[c.id];
    const previousHash = previousHashes[c.id];
    return currentHash !== previousHash;
  });

  const unchangedComponentIds = rawSchema.components
    .filter((c) => {
      if (!previousComponentIds.has(c.id)) return false;
      const currentHash = currentHashes[c.id];
      const previousHash = previousHashes[c.id];
      return currentHash === previousHash;
    })
    .map((c) => c.id);

  const currentComponentIds = new Set(rawSchema.components.map((c) => c.id));
  const removedComponentIds = [...previousComponentIds].filter(
    (id) => !currentComponentIds.has(id),
  );

  // Categorize utilities
  const newUtilities = rawSchema.utilities.filter(
    (u) => !previousUtilityIds.has(u.id),
  );

  const changedUtilities = rawSchema.utilities.filter((u) => {
    if (!previousUtilityIds.has(u.id)) return false;
    const currentHash = currentHashes[u.id];
    const previousHash = previousHashes[u.id];
    return currentHash !== previousHash;
  });

  const unchangedUtilityIds = rawSchema.utilities
    .filter((u) => {
      if (!previousUtilityIds.has(u.id)) return false;
      const currentHash = currentHashes[u.id];
      const previousHash = previousHashes[u.id];
      return currentHash === previousHash;
    })
    .map((u) => u.id);

  const currentUtilityIds = new Set(rawSchema.utilities.map((u) => u.id));
  const removedUtilityIds = [...previousUtilityIds].filter(
    (id) => !currentUtilityIds.has(id),
  );

  // Build stats
  const stats: DiffStats = {
    totalComponents: rawSchema.components.length,
    newComponents: newComponents.length,
    changedComponents: changedComponents.length,
    unchangedComponents: unchangedComponentIds.length,
    removedComponents: removedComponentIds.length,
    totalUtilities: rawSchema.utilities.length,
    newUtilities: newUtilities.length,
    changedUtilities: changedUtilities.length,
    unchangedUtilities: unchangedUtilityIds.length,
    removedUtilities: removedUtilityIds.length,
  };

  return {
    newComponents,
    changedComponents,
    unchangedComponentIds,
    removedComponentIds,
    newUtilities,
    changedUtilities,
    unchangedUtilityIds,
    removedUtilityIds,
    stats,
  };
}

/**
 * Format a diff result as a human-readable report string.
 *
 * Used for dry-run output and verbose logging.
 *
 * @param diff - The diff result to format
 * @param version - Version string for the report header
 * @returns Multi-line report string
 */
export function formatDiffReport(diff: DiffResult, version: string): string {
  const lines: string[] = [];

  lines.push('FluentUI Enhancement Diff Report');
  lines.push('=================================');
  lines.push(`Version: ${version}`);
  lines.push('');
  lines.push('Components:');
  lines.push(`  NEW (${diff.stats.newComponents}):`);
  for (const c of diff.newComponents) {
    lines.push(`    - ${c.name} (${c.category})`);
  }
  lines.push(`  CHANGED (${diff.stats.changedComponents}):`);
  for (const c of diff.changedComponents) {
    lines.push(`    - ${c.name} (${c.category})`);
  }
  lines.push(
    `  UNCHANGED (${diff.stats.unchangedComponents}): [carry forward]`,
  );
  lines.push(`  REMOVED (${diff.stats.removedComponents}):`);
  for (const id of diff.removedComponentIds) {
    lines.push(`    - ${id}`);
  }

  lines.push('');
  lines.push('Utilities:');
  lines.push(`  NEW (${diff.stats.newUtilities}):`);
  for (const u of diff.newUtilities) {
    lines.push(`    - ${u.name}`);
  }
  lines.push(`  CHANGED (${diff.stats.changedUtilities}):`);
  for (const u of diff.changedUtilities) {
    lines.push(`    - ${u.name}`);
  }
  lines.push(
    `  UNCHANGED (${diff.stats.unchangedUtilities}): [carry forward]`,
  );
  lines.push(`  REMOVED (${diff.stats.removedUtilities}):`);
  for (const id of diff.removedUtilityIds) {
    lines.push(`    - ${id}`);
  }

  const toEnhance =
    diff.stats.newComponents +
    diff.stats.changedComponents +
    diff.stats.newUtilities +
    diff.stats.changedUtilities;
  lines.push('');
  lines.push(`Total entries to enhance: ${toEnhance}`);

  return lines.join('\n');
}

// ============================================================================
// Internal Helpers
// ============================================================================

/**
 * Build a DiffResult where everything is new (first-run scenario).
 */
function buildAllNewResult(
  rawSchema: FluentUISchema,
  _currentHashes: HashIndex,
): DiffResult {
  return {
    newComponents: [...rawSchema.components],
    changedComponents: [],
    unchangedComponentIds: [],
    removedComponentIds: [],
    newUtilities: [...rawSchema.utilities],
    changedUtilities: [],
    unchangedUtilityIds: [],
    removedUtilityIds: [],
    stats: {
      totalComponents: rawSchema.components.length,
      newComponents: rawSchema.components.length,
      changedComponents: 0,
      unchangedComponents: 0,
      removedComponents: 0,
      totalUtilities: rawSchema.utilities.length,
      newUtilities: rawSchema.utilities.length,
      changedUtilities: 0,
      unchangedUtilities: 0,
      removedUtilities: 0,
    },
  };
}
