/**
 * TF-IDF search engine for documentation.
 *
 * Provides full-text search across all indexed documents using
 * a term frequency–inverse document frequency (TF-IDF) scoring model.
 *
 * The search engine tokenizes document content at index-build time,
 * then scores queries against the pre-built inverted index for
 * sub-millisecond search performance.
 *
 * Features:
 * - Tokenization with stop word removal
 * - TF-IDF relevance scoring
 * - Field-weighted scoring (title matches rank higher than content)
 * - Context excerpt extraction around matching terms
 *
 * @module indexer/search-engine
 */

import type {
  DocumentEntry,
  SearchResult,
  SearchIndexEntry,
  MatchedField,
  DocumentModule,
} from '../types/index.js';
import { DEFAULT_SEARCH_LIMIT, MAX_SEARCH_LIMIT } from '../types/index.js';

/**
 * Common English stop words that are excluded from the search index.
 * These words are too common to be useful for relevance scoring.
 */
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'for',
  'from', 'has', 'have', 'he', 'her', 'his', 'how', 'i', 'if', 'in',
  'is', 'it', 'its', 'just', 'let', 'may', 'my', 'no', 'not', 'of',
  'on', 'or', 'our', 'own', 'say', 'she', 'so', 'than', 'that', 'the',
  'their', 'them', 'then', 'there', 'these', 'they', 'this', 'to', 'too',
  'us', 'was', 'we', 'what', 'when', 'which', 'who', 'will', 'with',
  'you', 'your',
]);

/**
 * Weight multipliers for different document fields.
 * Title matches are weighted much higher than content matches.
 */
const FIELD_WEIGHTS = {
  title: 10.0,
  description: 5.0,
  packageName: 3.0,
  content: 1.0,
} as const;

/**
 * Internal representation of a document in the search index.
 * Stores pre-tokenized fields for fast scoring.
 */
interface IndexedDocument {
  /** Reference to the original document entry */
  entry: DocumentEntry;

  /** Tokenized title words */
  titleTokens: string[];

  /** Tokenized description words */
  descriptionTokens: string[];

  /** Tokenized full content words */
  contentTokens: string[];

  /** Total token count (for TF normalization) */
  totalTokenCount: number;
}

/**
 * TF-IDF search engine for FluentUI documentation.
 *
 * Usage:
 * 1. Call `buildIndex()` with all documents at startup
 * 2. Call `search()` for each query
 * 3. Call `clear()` + `buildIndex()` for reindexing
 */
export class SearchEngine {
  /**
   * Inverted index: token → list of documents containing that token.
   * This is the core data structure enabling fast search.
   */
  protected invertedIndex: Map<string, SearchIndexEntry[]> = new Map();

  /** All indexed documents, keyed by document ID */
  protected indexedDocs: Map<string, IndexedDocument> = new Map();

  /** Total number of documents in the index (for IDF calculation) */
  protected totalDocuments: number = 0;

  /**
   * Build the search index from a set of documents.
   *
   * Tokenizes each document and builds the inverted index.
   * Should be called once at startup after documents are loaded.
   *
   * @param documents - Array of document entries to index
   */
  public buildIndex(documents: DocumentEntry[]): void {
    this.totalDocuments = documents.length;

    for (const entry of documents) {
      // Tokenize each field
      const titleTokens = this.tokenize(entry.title);
      const descriptionTokens = this.tokenize(entry.metadata.description || '');
      const contentTokens = this.tokenize(entry.content);

      const indexedDoc: IndexedDocument = {
        entry,
        titleTokens,
        descriptionTokens,
        contentTokens,
        totalTokenCount: titleTokens.length + descriptionTokens.length + contentTokens.length,
      };

      this.indexedDocs.set(entry.id, indexedDoc);

      // Build inverted index from all tokens
      const allTokens = [...titleTokens, ...descriptionTokens, ...contentTokens];
      const tokenCounts = this.countTokens(allTokens);

      for (const [token, count] of tokenCounts) {
        const existing = this.invertedIndex.get(token);
        const indexEntry: SearchIndexEntry = {
          documentId: entry.id,
          termFrequency: count,
        };

        if (existing) {
          existing.push(indexEntry);
        } else {
          this.invertedIndex.set(token, [indexEntry]);
        }
      }
    }
  }

  /**
   * Search for documents matching a query string.
   *
   * Tokenizes the query, scores each document using TF-IDF with
   * field weighting, and returns ranked results.
   *
   * @param query - The search query string
   * @param limit - Maximum number of results (default: 10, max: 50)
   * @param moduleFilter - Optional: restrict results to a specific module
   * @returns Array of search results sorted by relevance (highest first)
   */
  public search(
    query: string,
    limit: number = DEFAULT_SEARCH_LIMIT,
    moduleFilter?: DocumentModule
  ): SearchResult[] {
    const queryTokens = this.tokenize(query);

    if (queryTokens.length === 0) {
      return [];
    }

    // Clamp limit to valid range
    const effectiveLimit = Math.min(Math.max(1, limit), MAX_SEARCH_LIMIT);

    // Score each document
    const scores: Map<string, { score: number; matchedFields: MatchedField[] }> = new Map();

    for (const [docId, indexedDoc] of this.indexedDocs) {
      // Apply module filter if specified
      if (moduleFilter && indexedDoc.entry.module !== moduleFilter) {
        continue;
      }

      const { score, matchedFields } = this.scoreDocument(indexedDoc, queryTokens);

      if (score > 0) {
        scores.set(docId, { score, matchedFields });
      }
    }

    // Sort by score and take top N
    const sortedResults = Array.from(scores.entries())
      .sort(([, a], [, b]) => b.score - a.score)
      .slice(0, effectiveLimit);

    // Build SearchResult objects
    return sortedResults.map(([docId, { score, matchedFields }]) => {
      const indexedDoc = this.indexedDocs.get(docId)!;
      const maxPossibleScore = this.getMaxPossibleScore(queryTokens.length);

      return {
        document: indexedDoc.entry,
        relevance: Math.min(Math.round((score / maxPossibleScore) * 100), 100),
        excerpt: this.extractExcerpt(indexedDoc.entry.content, queryTokens),
        matchedFields,
      };
    });
  }

  /**
   * Clear the entire search index.
   * Used before reindexing.
   */
  public clear(): void {
    this.invertedIndex.clear();
    this.indexedDocs.clear();
    this.totalDocuments = 0;
  }

  /**
   * Get the number of unique tokens in the index.
   * Useful for debugging and stats.
   */
  public get vocabularySize(): number {
    return this.invertedIndex.size;
  }

  /**
   * Score a single document against the query tokens.
   *
   * Uses TF-IDF scoring with field-specific weights:
   * - Title matches get the highest weight (10x)
   * - Description matches get medium weight (5x)
   * - Content matches get base weight (1x)
   *
   * @param indexedDoc - The pre-indexed document
   * @param queryTokens - Tokenized query terms
   * @returns Combined score and list of matched fields
   */
  protected scoreDocument(
    indexedDoc: IndexedDocument,
    queryTokens: string[]
  ): { score: number; matchedFields: MatchedField[] } {
    let totalScore = 0;
    const matchedFields: MatchedField[] = [];

    for (const queryToken of queryTokens) {
      // Score title matches
      const titleScore = this.scoreField(
        queryToken,
        indexedDoc.titleTokens,
        FIELD_WEIGHTS.title
      );
      if (titleScore > 0) {
        totalScore += titleScore;
        matchedFields.push({ field: 'title', score: titleScore });
      }

      // Score description matches
      const descScore = this.scoreField(
        queryToken,
        indexedDoc.descriptionTokens,
        FIELD_WEIGHTS.description
      );
      if (descScore > 0) {
        totalScore += descScore;
        matchedFields.push({ field: 'description', score: descScore });
      }

      // Score content matches (with IDF weighting)
      const idf = this.calculateIdf(queryToken);
      const contentTf = this.calculateTf(queryToken, indexedDoc.contentTokens);
      const contentScore = contentTf * idf * FIELD_WEIGHTS.content;
      if (contentScore > 0) {
        totalScore += contentScore;
        matchedFields.push({ field: 'content', score: contentScore });
      }
    }

    return { score: totalScore, matchedFields };
  }

  /**
   * Score a query token against a specific document field.
   *
   * @param queryToken - Single query token
   * @param fieldTokens - Tokens from the document field
   * @param weight - Weight multiplier for this field
   * @returns Weighted score
   */
  protected scoreField(
    queryToken: string,
    fieldTokens: string[],
    weight: number
  ): number {
    const tf = this.calculateTf(queryToken, fieldTokens);
    if (tf === 0) return 0;

    const idf = this.calculateIdf(queryToken);
    return tf * idf * weight;
  }

  /**
   * Calculate term frequency (TF) for a token in a set of tokens.
   *
   * TF = (occurrences of token in field) / (total tokens in field)
   * Normalized to prevent bias towards longer documents.
   *
   * @param token - The token to count
   * @param fieldTokens - Array of tokens from the field
   * @returns Normalized term frequency (0 to 1)
   */
  protected calculateTf(token: string, fieldTokens: string[]): number {
    if (fieldTokens.length === 0) return 0;

    let count = 0;
    for (const fieldToken of fieldTokens) {
      // Support both exact and prefix matching
      if (fieldToken === token || fieldToken.startsWith(token)) {
        count++;
      }
    }

    return count / fieldTokens.length;
  }

  /**
   * Calculate inverse document frequency (IDF) for a token.
   *
   * IDF = log(totalDocuments / documentsContainingToken)
   * Tokens that appear in fewer documents get higher IDF scores.
   *
   * @param token - The token to calculate IDF for
   * @returns IDF score (higher means more discriminative)
   */
  protected calculateIdf(token: string): number {
    const docsWithToken = this.invertedIndex.get(token);
    if (!docsWithToken || docsWithToken.length === 0) {
      // Try prefix matching for partial token matches
      let matchCount = 0;
      for (const [indexToken, entries] of this.invertedIndex) {
        if (indexToken.startsWith(token)) {
          matchCount += entries.length;
        }
      }
      if (matchCount === 0) return 0;
      return Math.log(this.totalDocuments / matchCount) + 1;
    }

    return Math.log(this.totalDocuments / docsWithToken.length) + 1;
  }

  /**
   * Get the theoretical maximum score for normalization.
   * Used to convert raw scores to 0-100 relevance percentages.
   *
   * @param queryTokenCount - Number of tokens in the query
   * @returns Maximum possible score
   */
  protected getMaxPossibleScore(queryTokenCount: number): number {
    // Approximate max: each token could match perfectly in title
    const maxIdf = Math.log(this.totalDocuments) + 1;
    return queryTokenCount * FIELD_WEIGHTS.title * maxIdf;
  }

  /**
   * Extract a relevant excerpt from document content around matching terms.
   *
   * Finds the first occurrence of any query token in the content
   * and returns surrounding context.
   *
   * @param content - Full document content
   * @param queryTokens - Tokenized query terms
   * @param maxLength - Maximum excerpt length (default: 200)
   * @returns Context excerpt string
   */
  protected extractExcerpt(
    content: string,
    queryTokens: string[],
    maxLength: number = 200
  ): string {
    const lines = content.split('\n');

    // Find the first line containing a query token
    for (const line of lines) {
      const lineLower = line.toLowerCase();
      const hasMatch = queryTokens.some((token) => lineLower.includes(token));

      if (hasMatch) {
        const trimmed = line.trim();
        // Skip structural markdown lines
        if (trimmed.startsWith('#') || trimmed.startsWith('|') ||
            trimmed.startsWith('```') || trimmed.startsWith('---') ||
            trimmed.startsWith('>')) {
          continue;
        }
        if (trimmed.length > 0) {
          return trimmed.length > maxLength
            ? trimmed.substring(0, maxLength) + '...'
            : trimmed;
        }
      }
    }

    // Fallback: return the overview/description section
    const overviewIndex = lines.findIndex((line) => /^##\s+Overview/i.test(line));
    if (overviewIndex !== -1) {
      for (let i = overviewIndex + 1; i < lines.length && i < overviewIndex + 5; i++) {
        const trimmed = lines[i].trim();
        if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('>')) {
          return trimmed.length > maxLength
            ? trimmed.substring(0, maxLength) + '...'
            : trimmed;
        }
      }
    }

    return 'FluentUI documentation';
  }

  /**
   * Tokenize a text string into search tokens.
   *
   * Process:
   * 1. Convert to lowercase
   * 2. Remove markdown syntax (code blocks, links, images)
   * 3. Split on word boundaries
   * 4. Filter out stop words and very short tokens
   * 5. Return unique-ish tokens (duplicates kept for TF calculation)
   *
   * @param text - Raw text to tokenize
   * @returns Array of tokens
   */
  protected tokenize(text: string): string[] {
    return text
      // Convert to lowercase
      .toLowerCase()
      // Remove code blocks entirely (they add noise)
      .replace(/```[\s\S]*?```/g, ' ')
      // Remove inline code
      .replace(/`[^`]+`/g, ' ')
      // Remove markdown links but keep link text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // Remove markdown images
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
      // Remove markdown formatting characters
      .replace(/[*_~#>|]/g, ' ')
      // Split on non-alphanumeric characters (keeping hyphens in words)
      .split(/[^a-z0-9-]+/)
      // Filter out stop words and short tokens
      .filter((token) => token.length >= 2 && !STOP_WORDS.has(token));
  }

  /**
   * Count occurrences of each token in an array.
   *
   * @param tokens - Array of tokens
   * @returns Map of token → count
   */
  protected countTokens(tokens: string[]): Map<string, number> {
    const counts = new Map<string, number>();
    for (const token of tokens) {
      counts.set(token, (counts.get(token) || 0) + 1);
    }
    return counts;
  }
}
