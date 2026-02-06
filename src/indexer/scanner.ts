/**
 * Recursive directory scanner for documentation files.
 *
 * Scans a docs version folder (e.g., `docs/v9/`) recursively to discover
 * all markdown (.md) files. Classifies each file by its documentation module
 * and component category based on the directory structure.
 *
 * **Fully dynamic:** Modules and categories are auto-discovered from folder
 * names at scan time. No hardcoded lists — adding new folders to the docs
 * directory requires zero code changes.
 *
 * Convention:
 * - Top-level folders named `XX-name` → module = `"name"` (numeric prefix stripped)
 * - Subfolders under the `components` module → category = subfolder name
 * - Root-level `.md` files → module = `"foundation"` (default)
 *
 * @module indexer/scanner
 */

import { readdir, stat } from 'fs/promises';
import { join, relative, extname } from 'path';
import type { DocumentModule, ComponentCategory } from '../types/index.js';

/**
 * Raw result from scanning a single markdown file.
 * Contains the file path and its classified module/category.
 * This is the input for the metadata extractor and document store.
 */
export interface ScannedFile {
  /** Absolute path to the markdown file */
  filePath: string;

  /** Path relative to the docs version root (e.g., "02-components/buttons/button.md") */
  relativePath: string;

  /** Which documentation module this file belongs to */
  module: DocumentModule;

  /** Component category if this is a component doc, null otherwise */
  category: ComponentCategory | null;
}

/**
 * Regex to strip numeric prefixes from folder names.
 * Matches patterns like "01-", "02-", "99-" at the start of a string.
 * e.g., "01-foundation" → "foundation", "02-components" → "components"
 */
const NUMERIC_PREFIX_RE = /^\d+-/;

/**
 * Strip the numeric prefix from a folder name to get the clean module/topic name.
 *
 * @param folderName - Directory name potentially prefixed with "XX-"
 * @returns The folder name with any leading "XX-" prefix removed
 *
 * @example
 * ```typescript
 * stripNumericPrefix('01-foundation') // → 'foundation'
 * stripNumericPrefix('02-components') // → 'components'
 * stripNumericPrefix('my-folder')     // → 'my-folder' (no change)
 * ```
 */
function stripNumericPrefix(folderName: string): string {
  return folderName.replace(NUMERIC_PREFIX_RE, '');
}

/**
 * Recursively scan a documentation directory to discover all markdown files.
 *
 * Walks the entire directory tree starting from `docsPath`, finds all `.md` files,
 * and classifies each one by its module and category based on directory structure.
 *
 * Modules and categories are **auto-discovered** from the folder names:
 * - Any top-level folder `XX-name/` becomes module `"name"`
 * - Any subfolder under a `components`-named module becomes a category
 *
 * @param docsPath - Absolute path to the docs version root (e.g., `/path/to/docs/v9/`)
 * @returns Array of scanned file descriptors, sorted by relative path
 * @throws Error if the docsPath directory cannot be read
 */
export async function scanDocsDirectory(docsPath: string): Promise<ScannedFile[]> {
  const results: ScannedFile[] = [];

  // Step 1: Discover module folders by reading top-level entries
  const folderToModule = await discoverModules(docsPath);

  // Step 2: For the "components" module, discover categories from subfolders
  const componentCategories = await discoverCategories(docsPath, folderToModule);

  // Step 3: Recursively walk and classify all markdown files
  await walkDirectory(docsPath, docsPath, folderToModule, componentCategories, results);

  // Sort by relative path for deterministic ordering
  results.sort((a, b) => a.relativePath.localeCompare(b.relativePath));

  return results;
}

/**
 * Discover modules by reading top-level directories.
 * Maps each folder name to its derived module name (numeric prefix stripped).
 *
 * @param docsPath - Root docs directory
 * @returns Map of folder name → module name
 */
async function discoverModules(docsPath: string): Promise<Map<string, DocumentModule>> {
  const folderToModule = new Map<string, DocumentModule>();
  const entries = await readdir(docsPath);

  for (const entry of entries) {
    const fullPath = join(docsPath, entry);
    const entryStat = await stat(fullPath);

    if (entryStat.isDirectory()) {
      // Strip numeric prefix: "01-foundation" → "foundation"
      const moduleName = stripNumericPrefix(entry);
      folderToModule.set(entry, moduleName);
    }
  }

  return folderToModule;
}

/**
 * Discover component categories by reading subfolders of the components module.
 * Any direct subfolder of the components module folder becomes a category.
 *
 * @param docsPath - Root docs directory
 * @param folderToModule - Map of folder name → module name
 * @returns Set of recognized category folder names
 */
async function discoverCategories(
  docsPath: string,
  folderToModule: Map<string, DocumentModule>
): Promise<Set<string>> {
  const categories = new Set<string>();

  // Find the folder that maps to the "components" module
  for (const [folderName, moduleName] of folderToModule) {
    if (moduleName === 'components') {
      const componentsPath = join(docsPath, folderName);
      const entries = await readdir(componentsPath);

      for (const entry of entries) {
        const fullPath = join(componentsPath, entry);
        const entryStat = await stat(fullPath);

        if (entryStat.isDirectory()) {
          // Each subfolder is a category (e.g., "buttons", "forms", "charts")
          categories.add(entry);
        }
      }
      break;
    }
  }

  return categories;
}

/**
 * Recursive directory walker.
 *
 * Walks a directory tree depth-first, collecting all markdown files
 * and classifying them by module and category.
 *
 * @param currentPath - Current directory being scanned
 * @param rootPath - Root docs directory (for computing relative paths)
 * @param folderToModule - Map of top-level folder name → module name
 * @param componentCategories - Set of recognized component category folder names
 * @param results - Accumulator array for scanned files (mutated in place)
 */
async function walkDirectory(
  currentPath: string,
  rootPath: string,
  folderToModule: Map<string, DocumentModule>,
  componentCategories: Set<string>,
  results: ScannedFile[]
): Promise<void> {
  const entries = await readdir(currentPath);

  for (const entry of entries) {
    const fullPath = join(currentPath, entry);
    const entryStat = await stat(fullPath);

    if (entryStat.isDirectory()) {
      // Recurse into subdirectories
      await walkDirectory(fullPath, rootPath, folderToModule, componentCategories, results);
    } else if (entryStat.isFile() && extname(entry) === '.md') {
      // Classify and collect markdown files
      const relativePath = relative(rootPath, fullPath);
      const classification = classifyFile(relativePath, folderToModule, componentCategories);

      if (classification) {
        results.push({
          filePath: fullPath,
          relativePath,
          module: classification.module,
          category: classification.category,
        });
      }
    }
  }
}

/**
 * Classify a markdown file by its relative path within the docs directory.
 *
 * Uses the directory structure to determine which module and category
 * a file belongs to:
 * - Top-level folder → module (via folderToModule lookup)
 * - Second-level folder under components → category (via componentCategories lookup)
 *
 * @param relativePath - Path relative to docs root (e.g., "02-components/buttons/button.md")
 * @param folderToModule - Map of top-level folder name → module name
 * @param componentCategories - Set of recognized component category folder names
 * @returns Module and category classification, or null if unrecognized structure
 */
function classifyFile(
  relativePath: string,
  folderToModule: Map<string, DocumentModule>,
  componentCategories: Set<string>
): { module: DocumentModule; category: ComponentCategory | null } | null {
  // Split the relative path into segments
  // e.g., "02-components/buttons/button.md" → ["02-components", "buttons", "button.md"]
  const segments = relativePath.split('/');

  if (segments.length === 0) {
    return null;
  }

  // First segment determines the module (e.g., "01-foundation" → "foundation")
  const moduleFolder = segments[0];
  const module = folderToModule.get(moduleFolder);

  if (!module) {
    // File is at root level (like 00-overview.md) — treat as foundation overview
    if (segments.length === 1 && segments[0].endsWith('.md')) {
      return { module: 'foundation', category: null };
    }
    return null;
  }

  // For component docs, second segment determines the category
  let category: ComponentCategory | null = null;
  if (module === 'components' && segments.length >= 2) {
    const categoryFolder = segments[1];
    // Check if it's a recognized category folder (auto-discovered)
    if (componentCategories.has(categoryFolder)) {
      category = categoryFolder;
    }
  }

  return { module, category };
}
