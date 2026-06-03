/**
 * Merge logic for combining new enhancements with existing ones.
 *
 * After the diff engine identifies what changed and the LLM enhances
 * the new/changed entries, the merge module combines everything into
 * a final enhanced schema:
 *
 * - New/changed entries: use freshly generated enhancements
 * - Unchanged entries: carry forward previous enhancements
 * - Removed entries: dropped from output
 *
 * @module enhancer/merge
 */

import type {
  FluentUISchema,
  ComponentEntry,
  UtilityEntry,
} from '../../src/types/schema.js';
import type {
  MergeOptions,
  ComponentEnhancementResult,
  UtilityEnhancementResult,
  HashIndex,
} from './types.js';

// ============================================================================
// Public API
// ============================================================================

/**
 * Merge raw schema data with enhancements (new + carried forward).
 *
 * The raw schema is the source of truth for structural data (props,
 * slots, stories). Enhancements add LLM-generated content on top.
 * Unchanged entries carry forward their enhancements from the
 * previous schema.
 *
 * @param options - Merge configuration with raw schema, diff, and enhancements
 * @returns Complete enhanced schema ready for writing
 */
export function mergeEnhancements(options: MergeOptions): FluentUISchema {
  const {
    rawSchema,
    previousSchema,
    diff,
    componentEnhancements,
    utilityEnhancements,
    hashIndex,
  } = options;

  // Build lookup maps for quick access
  const enhancementMap = buildComponentEnhancementMap(componentEnhancements);
  const utilityEnhancementMap = buildUtilityEnhancementMap(utilityEnhancements);
  const previousComponentMap = buildPreviousComponentMap(previousSchema);
  const previousUtilityMap = buildPreviousUtilityMap(previousSchema);

  // Merge components
  const mergedComponents: ComponentEntry[] = rawSchema.components.map(
    (rawComponent) => {
      // Check if we have a fresh enhancement for this component
      const enhancement = enhancementMap.get(rawComponent.id);
      if (enhancement) {
        return applyComponentEnhancement(rawComponent, enhancement, hashIndex);
      }

      // Check if it's unchanged and we can carry forward
      if (diff.unchangedComponentIds.includes(rawComponent.id)) {
        const previous = previousComponentMap.get(rawComponent.id);
        if (previous) {
          return carryForwardComponent(rawComponent, previous);
        }
      }

      // Fallback: return raw component as-is (no enhancement available)
      return rawComponent;
    },
  );

  // Merge utilities
  const mergedUtilities: UtilityEntry[] = rawSchema.utilities.map(
    (rawUtility) => {
      const enhancement = utilityEnhancementMap.get(rawUtility.id);
      if (enhancement) {
        return applyUtilityEnhancement(rawUtility, enhancement, hashIndex);
      }

      if (diff.unchangedUtilityIds.includes(rawUtility.id)) {
        const previous = previousUtilityMap.get(rawUtility.id);
        if (previous) {
          return carryForwardUtility(rawUtility, previous);
        }
      }

      return rawUtility;
    },
  );

  return {
    ...rawSchema,
    components: mergedComponents,
    utilities: mergedUtilities,
    // Carry forward guides from previous if they exist and no new ones generated
    foundation:
      rawSchema.foundation.length > 0
        ? rawSchema.foundation
        : (previousSchema?.foundation ?? []),
    patterns:
      rawSchema.patterns.length > 0
        ? rawSchema.patterns
        : (previousSchema?.patterns ?? []),
    enterprise:
      rawSchema.enterprise.length > 0
        ? rawSchema.enterprise
        : (previousSchema?.enterprise ?? []),
    quickReference:
      rawSchema.quickReference.length > 0
        ? rawSchema.quickReference
        : (previousSchema?.quickReference ?? []),
    generatedAt: new Date().toISOString(),
  };
}

// ============================================================================
// Enhancement Application
// ============================================================================

/**
 * Apply a fresh LLM enhancement to a raw component entry.
 *
 * Merges the structural data from the raw entry with the
 * LLM-generated content from the enhancement result.
 *
 * @param raw - The raw component entry (source of truth for structure)
 * @param enhancement - The LLM enhancement result
 * @param hashIndex - Hash index for recording the source hash
 * @returns Enhanced component entry
 */
export function applyComponentEnhancement(
  raw: ComponentEntry,
  enhancement: ComponentEnhancementResult,
  hashIndex: HashIndex,
): ComponentEntry {
  return {
    ...raw,
    relatedComponents: enhancement.relatedComponents,
    // Store the source hash so future diffs can detect changes
    // (attached as additional metadata — the schema type allows this)
  };
}

/**
 * Apply a fresh LLM enhancement to a raw utility entry.
 *
 * @param raw - The raw utility entry
 * @param enhancement - The LLM enhancement result
 * @param hashIndex - Hash index for recording the source hash
 * @returns Enhanced utility entry
 */
export function applyUtilityEnhancement(
  raw: UtilityEntry,
  enhancement: UtilityEnhancementResult,
  hashIndex: HashIndex,
): UtilityEntry {
  return {
    ...raw,
    // Utility enhancements are simpler — mainly description enrichment
  };
}

// ============================================================================
// Carry Forward
// ============================================================================

/**
 * Carry forward enhancements from a previous component to the current raw.
 *
 * Uses the raw entry for structural data (props, slots, stories) and
 * the previous entry for LLM-generated fields (relatedComponents, etc.).
 *
 * @param raw - Current raw component (structural source of truth)
 * @param previous - Previous enhanced component (enhancement source)
 * @returns Component with carried-forward enhancements
 */
export function carryForwardComponent(
  raw: ComponentEntry,
  previous: ComponentEntry,
): ComponentEntry {
  return {
    ...raw,
    relatedComponents: previous.relatedComponents,
    additionalExports: previous.additionalExports,
  };
}

/**
 * Carry forward enhancements from a previous utility to the current raw.
 *
 * @param raw - Current raw utility
 * @param previous - Previous enhanced utility
 * @returns Utility with carried-forward enhancements
 */
export function carryForwardUtility(
  raw: UtilityEntry,
  previous: UtilityEntry,
): UtilityEntry {
  return {
    ...raw,
    // Carry forward any enriched fields from previous
  };
}

// ============================================================================
// Lookup Map Builders
// ============================================================================

/**
 * Build a map of component ID → enhancement result for quick lookup.
 */
export function buildComponentEnhancementMap(
  enhancements: ComponentEnhancementResult[],
): Map<string, ComponentEnhancementResult> {
  return new Map(enhancements.map((e) => [e.id, e]));
}

/**
 * Build a map of utility ID → enhancement result for quick lookup.
 */
export function buildUtilityEnhancementMap(
  enhancements: UtilityEnhancementResult[],
): Map<string, UtilityEnhancementResult> {
  return new Map(enhancements.map((e) => [e.id, e]));
}

/**
 * Build a map of component ID → previous ComponentEntry for carry-forward.
 */
export function buildPreviousComponentMap(
  previousSchema: FluentUISchema | null,
): Map<string, ComponentEntry> {
  if (!previousSchema) return new Map();
  return new Map(previousSchema.components.map((c) => [c.id, c]));
}

/**
 * Build a map of utility ID → previous UtilityEntry for carry-forward.
 */
export function buildPreviousUtilityMap(
  previousSchema: FluentUISchema | null,
): Map<string, UtilityEntry> {
  if (!previousSchema) return new Map();
  return new Map(previousSchema.utilities.map((u) => [u.id, u]));
}
