/**
 * Slots extractor for FluentUI component type definitions.
 *
 * Parses .types.ts files to extract slot definitions from type aliases
 * ending in 'Slots'. FluentUI slots follow the pattern:
 *
 *   export type ButtonSlots = {
 *     root: NonNullable<Slot<'button'>>;
 *     icon?: Slot<'span'>;
 *   };
 *
 * @module scraper/extractors/slots-extractor
 */

import { Project, SyntaxKind, type SourceFile, type PropertySignature } from 'ts-morph';
import type { SlotEntry } from '../../../src/types/schema.js';

// ============================================================================
// Public API
// ============================================================================

/**
 * Extract slot definitions from a .types.ts file.
 *
 * Finds all type aliases ending in 'Slots' and extracts their properties.
 * Parses Slot<'element'> generic types to determine element types.
 *
 * @param filePath - Absolute path to the .types.ts file
 * @returns Array of extracted slot entries
 */
export function extractSlots(filePath: string): SlotEntry[] {
  const project = new Project({
    compilerOptions: { strict: true },
    skipAddingFilesFromTsConfig: true,
    skipFileDependencyResolution: true,
  });

  let sourceFile: SourceFile;
  try {
    sourceFile = project.addSourceFileAtPath(filePath);
  } catch {
    return [];
  }

  const slots: SlotEntry[] = [];

  // Find all type aliases ending with "Slots"
  const typeAliases = sourceFile.getTypeAliases();

  for (const typeAlias of typeAliases) {
    const name = typeAlias.getName();
    if (!name.endsWith('Slots')) continue;

    const typeNode = typeAlias.getTypeNode();
    if (!typeNode || typeNode.getKind() !== SyntaxKind.TypeLiteral) continue;

    const properties = (typeNode as any).getProperties() as PropertySignature[];

    for (const prop of properties) {
      const entry = parseSlotProperty(prop);
      if (entry) {
        slots.push(entry);
      }
    }
  }

  return slots;
}

// ============================================================================
// Internal Helpers
// ============================================================================

/**
 * Parse a single slot property into a SlotEntry.
 *
 * Extracts the element type from the Slot<'element'> generic and
 * determines if the slot is required (NonNullable wrapper or no ?).
 */
function parseSlotProperty(prop: PropertySignature): SlotEntry | null {
  const name = prop.getName();
  if (!name) return null;

  // Get the raw type text to parse Slot<> generics
  const typeText = prop.getTypeNode()?.getText() ?? '';
  const isOptional = prop.hasQuestionToken();

  // Check for NonNullable wrapper (makes slot required)
  const isNonNullable = typeText.includes('NonNullable');

  // Extract element type from Slot<'element'> pattern
  const elementType = parseSlotElementType(typeText);

  // Get JSDoc description
  const jsDocs = prop.getJsDocs();
  let description = '';
  if (jsDocs.length > 0) {
    description = jsDocs[0]!.getDescription().trim();
  }

  const entry: SlotEntry = {
    name,
    type: elementType,
    required: isNonNullable || !isOptional,
  };

  if (description) {
    entry.description = description;
  }

  return entry;
}

/**
 * Extract element type from a Slot<> generic type text.
 *
 * Handles patterns like:
 * - Slot<'button'>         → 'button'
 * - Slot<'span'>           → 'span'
 * - Slot<'div', 'main'>    → 'div'
 * - NonNullable<Slot<'button'>> → 'button'
 *
 * Falls back to 'unknown' if no pattern matches.
 */
function parseSlotElementType(typeText: string): string {
  // Match Slot<'element'> or Slot<"element">
  const slotMatch = typeText.match(/Slot<['"]([^'"]+)['"]/);
  if (slotMatch) {
    return slotMatch[1]!;
  }

  // Match Slot<ComponentType>
  const componentMatch = typeText.match(/Slot<(\w+)/);
  if (componentMatch) {
    return componentMatch[1]!;
  }

  return 'unknown';
}
