/**
 * Type definitions for the FluentUI MCP Server.
 *
 * These types define the core data structures used throughout the server
 * for document indexing, searching, and tool responses.
 *
 * @module types
 */

// ============================================================================
// Document Types
// ============================================================================

/**
 * Represents a single indexed documentation entry in the document store.
 * Each markdown file becomes one DocumentEntry after scanning and metadata extraction.
 */
export interface DocumentEntry {
  /** Unique identifier derived from file path (e.g., "components/buttons/button") */
  id: string;

  /** Display name extracted from markdown title (e.g., "Button") */
  title: string;

  /** Full raw markdown content of the document */
  content: string;

  /** Absolute file path on disk */
  filePath: string;

  /** Relative path within the docs version folder (e.g., "02-components/buttons/button.md") */
  relativePath: string;

  /** Which documentation module this belongs to */
  module: DocumentModule;

  /** Component category (only for component docs, null otherwise) */
  category: ComponentCategory | null;

  /** Extracted metadata from markdown content */
  metadata: DocumentMetadata;
}

/**
 * Metadata extracted from a markdown document's headers and content.
 * Used for search ranking and tool responses.
 */
export interface DocumentMetadata {
  /** NPM package name (e.g., "@fluentui/react-button"), extracted from doc header */
  packageName: string | null;

  /** Import statement (e.g., "import { Button } from '@fluentui/react-components'") */
  importStatement: string | null;

  /** Brief description of the component/topic */
  description: string | null;

  /** List of related component/doc names referenced in "See Also" sections */
  seeAlso: string[];

  /** Whether this document contains props reference tables */
  hasPropsTable: boolean;

  /** Whether this document contains code examples */
  hasCodeExamples: boolean;
}

// ============================================================================
// Search Types
// ============================================================================

/**
 * A single search result returned by the search engine.
 * Includes the matching document and relevance scoring information.
 */
export interface SearchResult {
  /** The matching document entry */
  document: DocumentEntry;

  /** Overall relevance score (0-100, higher is more relevant) */
  relevance: number;

  /** Context excerpt showing where the query matched */
  excerpt: string;

  /** Which fields matched the query (for debugging/transparency) */
  matchedFields: MatchedField[];
}

/**
 * Describes which field of a document matched a search query.
 * Used for transparency in search results.
 */
export interface MatchedField {
  /** Name of the field that matched (e.g., "title", "content", "description") */
  field: string;

  /** The matching score contribution from this field */
  score: number;
}

/**
 * A single entry in the inverted search index.
 * Maps a token to its occurrence information in a document.
 */
export interface SearchIndexEntry {
  /** Document ID that contains this token */
  documentId: string;

  /** Term frequency — how many times the token appears in this document */
  termFrequency: number;
}

// ============================================================================
// Configuration Types
// ============================================================================

/**
 * Server configuration resolved from CLI args, environment variables, and defaults.
 */
export interface ServerConfig {
  /** Which FluentUI version to serve (e.g., "v9", "v10") */
  version: string;

  /** Absolute path to the documentation folder for the selected version */
  docsPath: string;

  /** Server name used in MCP registration (e.g., "fluentui-v9-docs") */
  serverName: string;

  /** Server version string from package.json */
  serverVersion: string;
}

// ============================================================================
// Tool Argument Types
// ============================================================================

/** Arguments for the query_component tool */
export interface QueryComponentArgs {
  /** Component name to look up (case-insensitive, supports partial matching) */
  componentName: string;
}

/** Arguments for the search_docs tool */
export interface SearchDocsArgs {
  /** Search query string */
  query: string;

  /** Optional: limit results to a specific module */
  module?: DocumentModule;

  /** Optional: maximum number of results to return (default: 10) */
  limit?: number;
}

/** Arguments for the list_by_category tool */
export interface ListByCategoryArgs {
  /** Component category to list */
  category: ComponentCategory;
}

/** Arguments for the get_foundation tool */
export interface GetFoundationArgs {
  /** Foundation topic (optional — omit for overview) */
  topic?: string;
}

/** Arguments for the get_pattern tool */
export interface GetPatternArgs {
  /** Pattern category (e.g., "forms", "layout", "navigation") */
  patternCategory: string;

  /** Optional: specific pattern within the category */
  patternName?: string;
}

/** Arguments for the get_enterprise tool */
export interface GetEnterpriseArgs {
  /** Enterprise topic (e.g., "app-shell", "dashboard", "admin") */
  topic: string;
}

/** Arguments for the suggest_components tool */
export interface SuggestComponentsArgs {
  /** Description of the UI the user wants to build */
  uiDescription: string;
}

/** Arguments for the get_implementation_guide tool */
export interface GetImplementationGuideArgs {
  /** Description of the UI goal */
  goal: string;
}

/** Arguments for the get_component_examples tool */
export interface GetComponentExamplesArgs {
  /** Component name to extract examples from */
  componentName: string;
}

/** Arguments for the get_props_reference tool */
export interface GetPropsReferenceArgs {
  /** Component name to extract props table from */
  componentName: string;
}

/** Arguments for the reindex tool */
export interface ReindexArgs {
  /** Optional: force reindex even if no changes detected */
  force?: boolean;
}

// ============================================================================
// Enum-like Types (using const arrays for runtime + type safety)
// ============================================================================

/**
 * Documentation modules — the top-level organizational sections.
 * Each module corresponds to a top-level folder in the docs directory.
 *
 * This is a plain string type so that new modules are auto-discovered
 * from the folder structure without requiring any code changes.
 * Convention: folder `XX-modulename/` → module = `"modulename"`.
 */
export type DocumentModule = string;

/**
 * Component categories — how FluentUI organizes its component library.
 * Each category corresponds to a subfolder under the components module folder.
 *
 * This is a plain string type so that new categories are auto-discovered
 * from the folder structure without requiring any code changes.
 */
export type ComponentCategory = string;

// ============================================================================
// Constants
// ============================================================================

/**
 * Foundation topic identifiers.
 * Maps to files in the 01-foundation/ directory (with numeric prefixes).
 */
export const FOUNDATION_TOPICS = [
  'getting-started',
  'fluent-provider',
  'theming',
  'styling-griffel',
  'component-architecture',
  'accessibility',
] as const;

/** Type for foundation topic identifiers */
export type FoundationTopic = typeof FOUNDATION_TOPICS[number];

/**
 * Maps foundation topic identifiers to their file names (with numeric prefixes).
 * This handles the discrepancy between clean topic names and numbered filenames.
 */
export const FOUNDATION_TOPIC_FILE_MAP: Record<FoundationTopic, string> = {
  'getting-started': '01-getting-started',
  'fluent-provider': '02-fluent-provider',
  'theming': '03-theming',
  'styling-griffel': '04-styling-griffel',
  'component-architecture': '05-component-architecture',
  'accessibility': '06-accessibility',
};

/**
 * Common aliases for foundation topics.
 * Enables users to use shorthand or alternate names.
 */
export const FOUNDATION_TOPIC_ALIASES: Record<string, FoundationTopic> = {
  'start': 'getting-started',
  'setup': 'getting-started',
  'install': 'getting-started',
  'provider': 'fluent-provider',
  'theme': 'theming',
  'themes': 'theming',
  'tokens': 'theming',
  'styling': 'styling-griffel',
  'griffel': 'styling-griffel',
  'css': 'styling-griffel',
  'architecture': 'component-architecture',
  'hooks': 'component-architecture',
  'slots': 'component-architecture',
  'a11y': 'accessibility',
};

/**
 * Pattern categories available in the docs.
 * Each maps to a subfolder under 03-patterns/.
 */
export const PATTERN_CATEGORIES = [
  'composition',
  'data',
  'forms',
  'layout',
  'modals',
  'navigation',
  'state',
] as const;

/** Type for pattern category identifiers */
export type PatternCategory = typeof PATTERN_CATEGORIES[number];

/** Default FluentUI version when none is specified */
export const DEFAULT_VERSION = 'v9';

/** Default number of search results to return */
export const DEFAULT_SEARCH_LIMIT = 10;

/** Maximum number of search results allowed */
export const MAX_SEARCH_LIMIT = 50;
