/**
 * Utility package extractor for FluentUI utility/hook packages.
 *
 * Extracts exported functions, hooks, types, and constants from
 * utility packages (those without .tsx component files). Reads
 * the package's index.ts to find public exports.
 *
 * @module scraper/extractors/utility-extractor
 */

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { UtilityExport } from '../../../src/types/schema.js';

// ============================================================================
// Public API
// ============================================================================

/**
 * Extract public exports from a utility package's index file.
 *
 * Reads the package's index.ts (or index.ts in library/src/) and
 * extracts all named exports with their kinds (function, type, constant, hook).
 *
 * @param packageDir - Absolute path to the package directory
 * @returns Array of utility export entries
 */
export function extractUtilityExports(packageDir: string): UtilityExport[] {
  // Try v9 layout first (library/src/index.ts), then direct (src/index.ts)
  const indexPaths = [
    join(packageDir, 'library', 'src', 'index.ts'),
    join(packageDir, 'src', 'index.ts'),
  ];

  let content: string | null = null;
  for (const indexPath of indexPaths) {
    content = readFileSafe(indexPath);
    if (content) break;
  }

  if (!content) return [];

  const exports: UtilityExport[] = [];

  // Match re-export statements: export { name } from '...' and export type { name } from '...'
  const reExportRegex = /export\s+(?:(type)\s+)?\{([^}]+)\}/g;
  let match: RegExpExecArray | null;

  while ((match = reExportRegex.exec(content)) !== null) {
    const isTypeExport = match[1] === 'type';
    const names = match[2]!;

    for (const name of names.split(',')) {
      const cleaned = name.trim().replace(/\s+as\s+\w+/, '');
      if (!cleaned) continue;

      const kind = classifyExportKind(cleaned, isTypeExport);
      exports.push({ name: cleaned, kind });
    }
  }

  // Match direct exports: export function name, export const name, export type name
  const directExportRegex = /export\s+(function|const|type|interface|class|enum)\s+(\w+)/g;

  while ((match = directExportRegex.exec(content)) !== null) {
    const keyword = match[1]!;
    const name = match[2]!;

    const kind = keywordToExportKind(keyword, name);

    // Avoid duplicates
    if (!exports.some((e) => e.name === name)) {
      exports.push({ name, kind });
    }
  }

  return exports;
}

// ============================================================================
// Internal Helpers
// ============================================================================

/**
 * Classify the kind of an export based on its name and context.
 */
function classifyExportKind(
  name: string,
  isTypeExport: boolean,
): UtilityExport['kind'] {
  if (isTypeExport) return 'type';

  // Hooks start with "use"
  if (name.startsWith('use') && name.length > 3 && name[3] === name[3]!.toUpperCase()) {
    return 'hook';
  }

  // Types/interfaces start with uppercase and contain "Props", "State", "Options", etc.
  if (/^[A-Z]/.test(name) && /(?:Props|State|Options|Config|Context|Type)$/.test(name)) {
    return 'type';
  }

  // Constants are ALL_CAPS
  if (/^[A-Z_]+$/.test(name) && name.length > 1) {
    return 'constant';
  }

  // Functions start with lowercase
  if (/^[a-z]/.test(name)) {
    return 'function';
  }

  // Default: type for uppercase, function for lowercase
  return /^[A-Z]/.test(name) ? 'type' : 'function';
}

/**
 * Map a TypeScript keyword to an export kind.
 */
function keywordToExportKind(
  keyword: string,
  name: string,
): UtilityExport['kind'] {
  switch (keyword) {
    case 'type':
    case 'interface':
    case 'enum':
      return 'type';
    case 'const':
      if (/^[A-Z_]+$/.test(name)) return 'constant';
      if (name.startsWith('use')) return 'hook';
      return 'constant';
    case 'function':
      if (name.startsWith('use')) return 'hook';
      return 'function';
    case 'class':
      return 'type';
    default:
      return 'function';
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
