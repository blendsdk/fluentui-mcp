/**
 * Default values extractor for FluentUI use*.ts hook files.
 *
 * Parses hook files to extract default prop values from destructuring
 * patterns and nullish coalescing operators. FluentUI hooks typically
 * set defaults like:
 *
 *   const { appearance = 'secondary', size = 'medium' } = props;
 *   const resolvedDisabled = disabled ?? false;
 *
 * @module scraper/extractors/defaults-extractor
 */

import { readFileSync, existsSync } from 'node:fs';

// ============================================================================
// Public API
// ============================================================================

/**
 * A map of prop names to their default values.
 */
export type DefaultsMap = Record<string, string>;

/**
 * Extract default prop values from a use*.ts hook file.
 *
 * Parses destructuring assignments and nullish coalescing patterns
 * to find prop defaults. Returns a map of prop name → default value.
 *
 * @param filePath - Absolute path to the use*.ts hook file
 * @returns Map of prop names to default value strings
 */
export function extractDefaults(filePath: string): DefaultsMap {
  const content = readFileSafe(filePath);
  if (!content) return {};

  const defaults: DefaultsMap = {};

  // Pattern 1: Destructuring with defaults
  // const { appearance = 'secondary', size = 'medium' } = props;
  extractDestructuringDefaults(content, defaults);

  // Pattern 2: Nullish coalescing
  // const resolved = props.disabled ?? false;
  // or: disabled ?? false
  extractNullishCoalescingDefaults(content, defaults);

  // Pattern 3: Logical OR assignment
  // const value = props.size || 'medium';
  extractLogicalOrDefaults(content, defaults);

  return defaults;
}

// ============================================================================
// Internal Helpers
// ============================================================================

/**
 * Extract defaults from destructuring patterns.
 *
 * Matches: `{ propName = 'defaultValue', ... } = props`
 */
function extractDestructuringDefaults(content: string, defaults: DefaultsMap): void {
  // Find destructuring blocks: const { ... } = props;
  const destructRegex = /\{\s*([^}]+)\}\s*=\s*(?:props|state|rest)/g;

  let blockMatch: RegExpExecArray | null;
  while ((blockMatch = destructRegex.exec(content)) !== null) {
    const block = blockMatch[1]!;

    // Match individual assignments: propName = defaultValue
    const assignRegex = /(\w+)\s*=\s*(['"][^'"]*['"]|true|false|\d+(?:\.\d+)?)/g;

    let propMatch: RegExpExecArray | null;
    while ((propMatch = assignRegex.exec(block)) !== null) {
      const propName = propMatch[1]!;
      const defaultValue = propMatch[2]!;
      defaults[propName] = defaultValue;
    }
  }
}

/**
 * Extract defaults from nullish coalescing patterns.
 *
 * Matches: `props.propName ?? defaultValue` or `propName ?? defaultValue`
 */
function extractNullishCoalescingDefaults(content: string, defaults: DefaultsMap): void {
  const nullishRegex = /(?:props\.)?(\w+)\s*\?\?\s*(['"][^'"]*['"]|true|false|\d+(?:\.\d+)?)/g;

  let match: RegExpExecArray | null;
  while ((match = nullishRegex.exec(content)) !== null) {
    const propName = match[1]!;
    const defaultValue = match[2]!;

    // Skip variable names that aren't prop-like
    if (propName.startsWith('_') || propName === 'undefined' || propName === 'null') {
      continue;
    }

    // Only set if not already found (destructuring takes precedence)
    if (!(propName in defaults)) {
      defaults[propName] = defaultValue;
    }
  }
}

/**
 * Extract defaults from logical OR patterns.
 *
 * Matches: `props.propName || defaultValue`
 */
function extractLogicalOrDefaults(content: string, defaults: DefaultsMap): void {
  const orRegex = /(?:props\.)?(\w+)\s*\|\|\s*(['"][^'"]*['"]|true|false|\d+(?:\.\d+)?)/g;

  let match: RegExpExecArray | null;
  while ((match = orRegex.exec(content)) !== null) {
    const propName = match[1]!;
    const defaultValue = match[2]!;

    if (propName.startsWith('_') || propName === 'undefined' || propName === 'null') {
      continue;
    }

    if (!(propName in defaults)) {
      defaults[propName] = defaultValue;
    }
  }
}

/**
 * Safely read a file, returning null on any error.
 */
function readFileSafe(filePath: string): string | null {
  try {
    if (!existsSync(filePath)) return null;
    return readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }
}
