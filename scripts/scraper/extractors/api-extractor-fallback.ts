/**
 * Fallback extractor for FluentUI .api.md files.
 *
 * When ts-morph fails (e.g., due to missing type dependencies), this
 * regex-based parser extracts prop and slot information from the generated
 * .api.md files that FluentUI builds. These files follow a consistent
 * format with TypeScript declarations in markdown code blocks.
 *
 * @module scraper/extractors/api-extractor-fallback
 */

import { readFileSync, existsSync } from 'node:fs';
import type { PropEntry, SlotEntry } from '../../../src/types/schema.js';

// ============================================================================
// Public API
// ============================================================================

/**
 * Extract props from an .api.md file using regex patterns.
 *
 * Parses TypeScript interface/type declarations inside markdown code blocks.
 * This is a best-effort fallback — it may miss complex types but captures
 * the common patterns used by FluentUI's API Extractor output.
 *
 * @param filePath - Absolute path to the .api.md file
 * @returns Array of extracted prop entries
 */
export function extractPropsFromApiMd(filePath: string): PropEntry[] {
  const content = readFileSafe(filePath);
  if (!content) return [];

  const props: PropEntry[] = [];

  // Find all Props type/interface blocks
  // Pattern: "export type ButtonProps = ... & {\n  prop?: type;\n}"
  // Or: "export interface ButtonProps {\n  prop?: type;\n}"
  const propsBlockRegex = /export\s+(?:type|interface)\s+(\w+Props)\s*[=&{][^]*?(?:^}|\n};)/gm;

  let match: RegExpExecArray | null;
  while ((match = propsBlockRegex.exec(content)) !== null) {
    const block = match[0]!;
    const blockProps = parsePropsFromBlock(block);
    props.push(...blockProps);
  }

  return props;
}

/**
 * Extract slots from an .api.md file using regex patterns.
 *
 * @param filePath - Absolute path to the .api.md file
 * @returns Array of extracted slot entries
 */
export function extractSlotsFromApiMd(filePath: string): SlotEntry[] {
  const content = readFileSafe(filePath);
  if (!content) return [];

  const slots: SlotEntry[] = [];

  // Find all Slots type blocks
  const slotsBlockRegex = /export\s+type\s+(\w+Slots)\s*=\s*\{[^}]*\}/gm;

  let match: RegExpExecArray | null;
  while ((match = slotsBlockRegex.exec(content)) !== null) {
    const block = match[0]!;
    const blockSlots = parseSlotsFromBlock(block);
    slots.push(...blockSlots);
  }

  return slots;
}

// ============================================================================
// Internal Helpers
// ============================================================================

/**
 * Parse individual prop entries from a type/interface block.
 */
function parsePropsFromBlock(block: string): PropEntry[] {
  const props: PropEntry[] = [];

  // Match property lines: "  propName?: type;"  or  "  propName: type;"
  const propRegex = /^\s+(\w+)(\?)?\s*:\s*(.+?)\s*;/gm;

  let match: RegExpExecArray | null;
  while ((match = propRegex.exec(block)) !== null) {
    const name = match[1]!;
    const isOptional = match[2] === '?';
    const type = match[3]!.trim();

    // Skip internal properties
    if (name.startsWith('_')) continue;

    props.push({
      name,
      type,
      required: !isOptional,
      description: '',
    });
  }

  return props;
}

/**
 * Parse slot entries from a Slots type block.
 */
function parseSlotsFromBlock(block: string): SlotEntry[] {
  const slots: SlotEntry[] = [];

  // Match slot lines: "  slotName?: Slot<'element'>;"
  const slotRegex = /^\s+(\w+)(\?)?\s*:\s*(.+?)\s*;/gm;

  let match: RegExpExecArray | null;
  while ((match = slotRegex.exec(block)) !== null) {
    const name = match[1]!;
    const isOptional = match[2] === '?';
    const typeText = match[3]!.trim();

    // Extract element from Slot<'element'>
    const elementMatch = typeText.match(/Slot<['"]([^'"]+)['"]/);
    const isNonNullable = typeText.includes('NonNullable');

    slots.push({
      name,
      type: elementMatch ? elementMatch[1]! : 'unknown',
      required: isNonNullable || !isOptional,
    });
  }

  return slots;
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
