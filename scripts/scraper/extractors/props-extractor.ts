/**
 * Props extractor using ts-morph for FluentUI component type definitions.
 *
 * Parses .types.ts files to extract prop definitions with their types,
 * descriptions, default values, and deprecation status. Works with the
 * FluentUI pattern where props are defined as:
 *
 *   export type ButtonProps = ComponentProps<ButtonSlots> & { ... };
 *
 * @module scraper/extractors/props-extractor
 */

import { Project, SyntaxKind, type SourceFile, type PropertySignature } from 'ts-morph';
import type { PropEntry } from '../../../src/types/schema.js';

// ============================================================================
// Public API
// ============================================================================

/**
 * Extract prop definitions from a .types.ts file.
 *
 * Finds all type aliases ending in 'Props' and extracts their properties.
 * Returns a flat array of PropEntry objects.
 *
 * @param filePath - Absolute path to the .types.ts file
 * @returns Array of extracted prop entries
 */
export function extractProps(filePath: string): PropEntry[] {
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

  const props: PropEntry[] = [];

  // Find all type aliases ending with "Props"
  const typeAliases = sourceFile.getTypeAliases();

  for (const typeAlias of typeAliases) {
    const name = typeAlias.getName();
    if (!name.endsWith('Props')) continue;

    // Get the type node and extract properties from intersection types
    const typeNode = typeAlias.getTypeNode();
    if (!typeNode) continue;

    // Collect property signatures from intersection members or direct type literals
    const propSignatures = collectPropertySignatures(typeNode);

    for (const prop of propSignatures) {
      const entry = parsePropertySignature(prop);
      if (entry) {
        props.push(entry);
      }
    }
  }

  return props;
}

// ============================================================================
// Internal Helpers
// ============================================================================

/**
 * Recursively collect PropertySignature nodes from a type node.
 * Handles intersection types (A & { ... }) and direct type literals.
 */
function collectPropertySignatures(typeNode: any): PropertySignature[] {
  const kind = typeNode.getKind();
  const signatures: PropertySignature[] = [];

  if (kind === SyntaxKind.IntersectionType) {
    // Recurse into each member of the intersection
    for (const member of typeNode.getTypeNodes()) {
      signatures.push(...collectPropertySignatures(member));
    }
  } else if (kind === SyntaxKind.TypeLiteral) {
    // Direct object type: extract property signatures
    signatures.push(...typeNode.getProperties());
  }
  // Skip TypeReference nodes (e.g., ComponentProps<ButtonSlots>) —
  // we don't resolve inherited props, only direct declarations.

  return signatures;
}

/**
 * Parse a single PropertySignature into a PropEntry.
 */
function parsePropertySignature(prop: PropertySignature): PropEntry | null {
  const name = prop.getName();
  if (!name) return null;

  const typeText = prop.getType().getText(prop) || 'unknown';
  const isRequired = !prop.hasQuestionToken();
  const jsDocs = prop.getJsDocs();

  let description = '';
  let defaultValue: string | undefined;
  let isDeprecated = false;

  if (jsDocs.length > 0) {
    const jsDoc = jsDocs[0]!;
    description = jsDoc.getDescription().trim();

    // Extract @default tag
    const defaultTag = jsDoc.getTags().find((t) => t.getTagName() === 'default');
    if (defaultTag) {
      defaultValue = defaultTag.getCommentText()?.trim();
    }

    // Check for @deprecated tag
    const deprecatedTag = jsDoc.getTags().find((t) => t.getTagName() === 'deprecated');
    if (deprecatedTag) {
      isDeprecated = true;
    }
  }

  // Clean up type text (remove import paths, simplify)
  const cleanType = cleanTypeText(typeText);

  const entry: PropEntry = {
    name,
    type: cleanType,
    required: isRequired,
    description,
  };

  if (defaultValue !== undefined) {
    entry.defaultValue = defaultValue;
  }

  if (isDeprecated) {
    entry.deprecated = true;
  }

  return entry;
}

/**
 * Clean up TypeScript type text for display.
 * Removes import() paths and simplifies complex types.
 */
function cleanTypeText(typeText: string): string {
  // Remove import("..."). prefixes
  let cleaned = typeText.replace(/import\([^)]+\)\./g, '');

  // Simplify undefined unions: "string | undefined" stays as-is
  // Remove extra whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  return cleaned;
}
