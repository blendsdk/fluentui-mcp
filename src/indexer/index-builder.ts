/**
 * Index builder — orchestrates the document indexing pipeline.
 *
 * Called once at server startup and optionally by the `reindex` tool.
 * Coordinates the full pipeline: scan → read → extract metadata → store.
 *
 * Pipeline:
 * 1. Scanner discovers all .md files in the docs directory
 * 2. Each file's content is read from disk
 * 3. Metadata extractor parses titles, packages, descriptions
 * 4. DocumentEntry objects are created and added to the store
 * 5. Search engine builds its inverted index from the store
 *
 * @module indexer/index-builder
 */

import { readFile } from 'fs/promises';
import { scanDocsDirectory } from './scanner.js';
import { extractMetadata, extractTitle } from './metadata-extractor.js';
import { DocumentStore } from './document-store.js';
import { SearchEngine } from './search-engine.js';
import type { DocumentEntry } from '../types/index.js';
import type { ScannedFile } from './scanner.js';

/**
 * Result of a complete indexing operation.
 * Contains the populated document store and search engine.
 */
export interface IndexResult {
  /** The populated document store with all indexed documents */
  store: DocumentStore;

  /** The search engine with its inverted index built */
  searchEngine: SearchEngine;

  /** Statistics about the indexing operation */
  stats: IndexStats;
}

/**
 * Statistics from an indexing operation.
 * Useful for logging and debugging.
 */
export interface IndexStats {
  /** Total number of markdown files discovered */
  totalFiles: number;

  /** Number of files successfully indexed */
  indexedFiles: number;

  /** Number of files that failed to read/parse */
  failedFiles: number;

  /** Time taken for the indexing operation in milliseconds */
  durationMs: number;

  /** Breakdown by module */
  byModule: Record<string, number>;

  /** Breakdown by category (components only) */
  byCategory: Record<string, number>;
}

/**
 * Build the complete document index from a docs directory.
 *
 * This is the main entry point for indexing. It:
 * 1. Scans the directory for all markdown files
 * 2. Reads and parses each file
 * 3. Populates the document store
 * 4. Builds the search engine index
 *
 * @param docsPath - Absolute path to the docs version directory
 * @param existingStore - Optional: reuse an existing store (will be cleared)
 * @param existingSearchEngine - Optional: reuse an existing search engine (will be cleared)
 * @returns The IndexResult with populated store, search engine, and stats
 *
 * @example
 * ```typescript
 * const { store, searchEngine, stats } = await buildIndex('/path/to/docs/v9');
 * console.log(`Indexed ${stats.indexedFiles} files in ${stats.durationMs}ms`);
 * ```
 */
export async function buildIndex(
  docsPath: string,
  existingStore?: DocumentStore,
  existingSearchEngine?: SearchEngine
): Promise<IndexResult> {
  const startTime = Date.now();

  // Use existing instances or create new ones
  const store = existingStore || new DocumentStore();
  const searchEngine = existingSearchEngine || new SearchEngine();

  // Clear any existing data (important for reindex)
  store.clear();
  searchEngine.clear();

  // Step 1: Scan for all markdown files
  const scannedFiles = await scanDocsDirectory(docsPath);

  // Step 2: Read and index each file
  const stats: IndexStats = {
    totalFiles: scannedFiles.length,
    indexedFiles: 0,
    failedFiles: 0,
    durationMs: 0,
    byModule: {},
    byCategory: {},
  };

  for (const scannedFile of scannedFiles) {
    try {
      const entry = await processFile(scannedFile);
      store.addDocument(entry);

      // Update stats
      stats.indexedFiles++;
      stats.byModule[entry.module] = (stats.byModule[entry.module] || 0) + 1;
      if (entry.category) {
        stats.byCategory[entry.category] = (stats.byCategory[entry.category] || 0) + 1;
      }
    } catch (_error) {
      // Log to stderr (won't interfere with MCP protocol on stdout)
      console.error(`Failed to index: ${scannedFile.relativePath}`);
      stats.failedFiles++;
    }
  }

  // Step 3: Build the search engine index from all documents
  searchEngine.buildIndex(store.getAllDocuments());

  // Record duration
  stats.durationMs = Date.now() - startTime;

  return { store, searchEngine, stats };
}

/**
 * Process a single scanned file into a DocumentEntry.
 *
 * Reads the file content, extracts metadata, and creates
 * a complete DocumentEntry ready for the store.
 *
 * @param scannedFile - The scanned file descriptor from the scanner
 * @returns A complete DocumentEntry
 * @throws Error if the file cannot be read
 */
async function processFile(scannedFile: ScannedFile): Promise<DocumentEntry> {
  // Read the file content
  const content = await readFile(scannedFile.filePath, 'utf-8');

  // Extract metadata from the content
  const metadata = extractMetadata(content);
  const title = extractTitle(content);

  // Build the document ID from the relative path
  // e.g., "02-components/buttons/button.md" → "components/buttons/button"
  const id = buildDocumentId(scannedFile.relativePath);

  return {
    id,
    title,
    content,
    filePath: scannedFile.filePath,
    relativePath: scannedFile.relativePath,
    module: scannedFile.module,
    category: scannedFile.category,
    metadata,
  };
}

/**
 * Build a document ID from a relative file path.
 *
 * Strips numeric prefixes and file extensions to create a clean,
 * human-readable identifier.
 *
 * @param relativePath - Path relative to docs root
 * @returns Clean document ID
 *
 * @example
 * ```typescript
 * buildDocumentId("02-components/buttons/button.md")
 * // → "components/buttons/button"
 *
 * buildDocumentId("01-foundation/03-theming.md")
 * // → "foundation/theming"
 *
 * buildDocumentId("00-overview.md")
 * // → "overview"
 * ```
 */
function buildDocumentId(relativePath: string): string {
  return relativePath
    // Remove .md extension
    .replace(/\.md$/, '')
    // Remove numeric prefixes from each path segment (e.g., "01-" → "")
    .split('/')
    .map((segment) => segment.replace(/^\d+-/, ''))
    .join('/');
}
