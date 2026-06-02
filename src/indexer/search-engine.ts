/**
 * Backward-compatibility shim for the TF-IDF search engine.
 *
 * The canonical implementation now lives in the schema-driven search
 * subsystem at {@link module:search/search-engine}. This module simply
 * re-exports it so legacy markdown-era code and tests under
 * `src/indexer/` and `src/__tests__/indexer/` keep working until the
 * Phase 16 legacy cleanup removes them.
 *
 * @deprecated Import from `../search/search-engine.js` instead.
 * @module indexer/search-engine
 */

export { SearchEngine } from '../search/search-engine.js';
