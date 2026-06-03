/**
 * Source hash computation for change detection.
 *
 * Computes deterministic hashes from component/utility raw data.
 * Used by the diff engine to detect whether a component has changed
 * since its last enhancement, enabling incremental re-enhancement.
 *
 * Hash inputs include structural data (props, slots, story count)
 * but exclude LLM-generated content (descriptions, best practices).
 * This ensures enhancements are only regenerated when the underlying
 * component API actually changes.
 *
 * @module enhancer/hasher
 */

import { createHash } from 'node:crypto';

import type { ComponentEntry, UtilityEntry } from '../../src/types/schema.js';
import type { HashIndex } from './types.js';

// ============================================================================
// Public API
// ============================================================================

/**
 * Compute a deterministic source hash for a component.
 *
 * The hash captures the component's API surface: name, version,
 * props (name, type, required), slots (name, elementType, required),
 * and story count. Changes to any of these trigger re-enhancement.
 *
 * Fields deliberately excluded from hashing:
 * - `description`, `whenToUse`, `bestPractices` (LLM-generated)
 * - `importPath`, `importStatement` (derived, not API surface)
 * - `category`, `stability` (classification, not API surface)
 *
 * @param component - The raw component entry
 * @returns 16-character hex hash string
 */
export function computeComponentHash(component: ComponentEntry): string {
  const hashInput = JSON.stringify({
    name: component.name,
    packageVersion: component.packageVersion,
    props: component.props.map((p) => ({
      name: p.name,
      type: p.type,
      required: p.required,
    })),
    slots: component.slots.map((s) => ({
      name: s.name,
      elementType: s.elementType,
      required: s.required,
    })),
    storyCount: component.stories.length,
  });

  return createHash('sha256').update(hashInput).digest('hex').substring(0, 16);
}

/**
 * Compute a deterministic source hash for a utility.
 *
 * The hash captures the utility's export surface: name, version,
 * and exported symbols (name, kind, signature).
 *
 * @param utility - The raw utility entry
 * @returns 16-character hex hash string
 */
export function computeUtilityHash(utility: UtilityEntry): string {
  const hashInput = JSON.stringify({
    name: utility.name,
    packageVersion: utility.packageVersion,
    exports: utility.exports.map((e) => ({
      name: e.name,
      kind: e.kind,
      signature: e.signature ?? '',
    })),
  });

  return createHash('sha256').update(hashInput).digest('hex').substring(0, 16);
}

/**
 * Build a hash index for all components and utilities in a schema.
 *
 * Creates a map of entry ID → source hash for every component and
 * utility. This index is used by the diff engine to quickly look up
 * whether an entry has changed.
 *
 * @param components - All component entries
 * @param utilities - All utility entries
 * @returns HashIndex mapping entry IDs to their source hashes
 */
export function buildHashIndex(
  components: ComponentEntry[],
  utilities: UtilityEntry[],
): HashIndex {
  const index: HashIndex = {};

  for (const component of components) {
    index[component.id] = computeComponentHash(component);
  }

  for (const utility of utilities) {
    index[utility.id] = computeUtilityHash(utility);
  }

  return index;
}
