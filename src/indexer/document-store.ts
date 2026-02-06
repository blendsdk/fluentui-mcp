/**
 * In-memory document store for indexed documentation.
 *
 * Provides O(1) lookups by document ID, category browsing, module filtering,
 * and fuzzy name matching. All data is stored in memory for instant access
 * after the initial indexing phase.
 *
 * This is the central data structure that all tools query against.
 * It is populated once at server startup by the IndexBuilder and can
 * be cleared and repopulated via the `reindex` tool.
 *
 * @module indexer/document-store
 */

import type {
  DocumentEntry,
  DocumentModule,
  ComponentCategory,
} from '../types/index.js';

/**
 * In-memory store for all indexed documentation entries.
 *
 * Maintains multiple indexes for different access patterns:
 * - Primary index: document ID → DocumentEntry (O(1) lookup)
 * - Category index: category → document IDs (for list_by_category)
 * - Module index: module → document IDs (for module-scoped search)
 * - Name index: normalized name → document ID (for fuzzy matching)
 */
export class DocumentStore {
  /** Primary document storage: ID → DocumentEntry */
  protected documents: Map<string, DocumentEntry> = new Map();

  /** Category index: category name → array of document IDs */
  protected categoryIndex: Map<string, string[]> = new Map();

  /** Module index: module name → array of document IDs */
  protected moduleIndex: Map<string, string[]> = new Map();

  /**
   * Name index for fuzzy matching: normalized name → document ID.
   * Multiple name variations map to the same document.
   * e.g., "button" → "components/buttons/button", "togglebutton" → "components/buttons/toggle-button"
   */
  protected nameIndex: Map<string, string> = new Map();

  /**
   * Add a document to the store.
   *
   * Automatically updates all secondary indexes (category, module, name).
   *
   * @param entry - The document entry to add
   */
  public addDocument(entry: DocumentEntry): void {
    // Store in primary index
    this.documents.set(entry.id, entry);

    // Update module index
    this.addToListIndex(this.moduleIndex, entry.module, entry.id);

    // Update category index (only for component docs)
    if (entry.category) {
      this.addToListIndex(this.categoryIndex, entry.category, entry.id);
    }

    // Update name index with multiple variations for fuzzy matching
    this.indexDocumentName(entry);
  }

  /**
   * Get a document by its exact ID.
   *
   * @param id - Document ID (e.g., "components/buttons/button")
   * @returns The document entry, or undefined if not found
   */
  public getById(id: string): DocumentEntry | undefined {
    return this.documents.get(id);
  }

  /**
   * Find a document by component name using fuzzy matching.
   *
   * Tries multiple matching strategies in order:
   * 1. Exact normalized name match
   * 2. Prefix match (e.g., "button" matches "button")
   * 3. Substring match (e.g., "toggle" matches "toggle-button")
   * 4. Contains match across all names
   *
   * @param name - Component name to search for (case-insensitive)
   * @returns The best matching document entry, or undefined
   */
  public findByName(name: string): DocumentEntry | undefined {
    const normalized = this.normalizeName(name);

    // Strategy 1: Exact match in name index
    const exactId = this.nameIndex.get(normalized);
    if (exactId) {
      return this.documents.get(exactId);
    }

    // Strategy 2: Find names that start with the query
    for (const [indexedName, docId] of this.nameIndex) {
      if (indexedName.startsWith(normalized)) {
        return this.documents.get(docId);
      }
    }

    // Strategy 3: Find names that contain the query
    for (const [indexedName, docId] of this.nameIndex) {
      if (indexedName.includes(normalized)) {
        return this.documents.get(docId);
      }
    }

    return undefined;
  }

  /**
   * Get all documents in a specific component category.
   *
   * @param category - Component category (e.g., "buttons", "forms")
   * @returns Array of document entries in the category
   */
  public getByCategory(category: ComponentCategory): DocumentEntry[] {
    const ids = this.categoryIndex.get(category) || [];
    return ids
      .map((id) => this.documents.get(id))
      .filter((doc): doc is DocumentEntry => doc !== undefined);
  }

  /**
   * Get all documents in a specific module.
   *
   * @param module - Document module (e.g., "foundation", "components", "patterns")
   * @returns Array of document entries in the module
   */
  public getByModule(module: DocumentModule): DocumentEntry[] {
    const ids = this.moduleIndex.get(module) || [];
    return ids
      .map((id) => this.documents.get(id))
      .filter((doc): doc is DocumentEntry => doc !== undefined);
  }

  /**
   * Get all documents in the store.
   *
   * @returns Array of all document entries
   */
  public getAllDocuments(): DocumentEntry[] {
    return Array.from(this.documents.values());
  }

  /**
   * Get all available categories that have documents.
   *
   * @returns Array of category names with document counts
   */
  public getCategories(): Array<{ category: string; count: number }> {
    return Array.from(this.categoryIndex.entries())
      .map(([category, ids]) => ({ category, count: ids.length }))
      .sort((a, b) => a.category.localeCompare(b.category));
  }

  /**
   * Get all available modules that have documents.
   *
   * @returns Array of module names with document counts
   */
  public getModules(): Array<{ module: string; count: number }> {
    return Array.from(this.moduleIndex.entries())
      .map(([module, ids]) => ({ module, count: ids.length }))
      .sort((a, b) => a.module.localeCompare(b.module));
  }

  /**
   * Get the total number of indexed documents.
   *
   * @returns Document count
   */
  public get size(): number {
    return this.documents.size;
  }

  /**
   * Clear all documents and indexes.
   * Used by the reindex tool to reset the store before re-scanning.
   */
  public clear(): void {
    this.documents.clear();
    this.categoryIndex.clear();
    this.moduleIndex.clear();
    this.nameIndex.clear();
  }

  /**
   * Add a document ID to a list-based index (category or module).
   *
   * @param index - The index Map to update
   * @param key - The index key (category or module name)
   * @param docId - The document ID to add
   */
  protected addToListIndex(
    index: Map<string, string[]>,
    key: string,
    docId: string
  ): void {
    const existing = index.get(key);
    if (existing) {
      existing.push(docId);
    } else {
      index.set(key, [docId]);
    }
  }

  /**
   * Index a document's name for fuzzy matching.
   *
   * Creates multiple name variations so the document can be found
   * regardless of how the user types the component name.
   *
   * For a document titled "ToggleButton" in "buttons" category:
   * - "togglebutton" → docId
   * - "toggle-button" → docId (from filename)
   * - "toggle button" → docId
   *
   * @param entry - The document entry to index
   */
  protected indexDocumentName(entry: DocumentEntry): void {
    const docId = entry.id;

    // Index the title (normalized)
    const titleNorm = this.normalizeName(entry.title);
    this.nameIndex.set(titleNorm, docId);

    // Index the filename (without extension and path)
    const filename = entry.relativePath.split('/').pop()?.replace('.md', '') || '';
    if (filename) {
      const filenameNorm = this.normalizeName(filename);
      this.nameIndex.set(filenameNorm, docId);

      // Also index without numeric prefix (e.g., "01-getting-started" → "getting-started")
      const withoutPrefix = filename.replace(/^\d+-/, '');
      if (withoutPrefix !== filename) {
        this.nameIndex.set(this.normalizeName(withoutPrefix), docId);
      }
    }

    // Index with hyphens removed (e.g., "toggle-button" → "togglebutton")
    const noHyphens = titleNorm.replace(/-/g, '');
    if (noHyphens !== titleNorm) {
      this.nameIndex.set(noHyphens, docId);
    }

    // Index with spaces removed
    const noSpaces = titleNorm.replace(/\s+/g, '');
    if (noSpaces !== titleNorm) {
      this.nameIndex.set(noSpaces, docId);
    }
  }

  /**
   * Normalize a name for fuzzy matching.
   * Converts to lowercase and trims whitespace.
   *
   * @param name - Raw name string
   * @returns Normalized name
   */
  protected normalizeName(name: string): string {
    return name.toLowerCase().trim();
  }
}
