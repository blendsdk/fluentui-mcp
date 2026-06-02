/**
 * Build a {@link SearchEngine} from a {@link SchemaStore}.
 *
 * In the markdown era the search engine indexed raw `.md` files. In the
 * schema-driven era we synthesise equivalent {@link DocumentEntry} records from
 * the structured schema — rendering each component, utility, guide, and pattern
 * to markdown via the formatters — and feed those to the same TF-IDF engine.
 *
 * This keeps the `search_docs` tool (and the search-backed intelligence tools)
 * completely unchanged: they still consume a {@link SearchEngine} that returns
 * {@link DocumentEntry}-shaped results with `module`, `category`, and metadata.
 *
 * The `module` values match the legacy folder-derived names (`components`,
 * `utilities`, `foundation`, `patterns`, `enterprise`, `quick-reference`) so
 * module filtering continues to behave identically.
 *
 * @module search/search-index
 */

import { SearchEngine } from './search-engine.js';
import type { SchemaStore } from '../schema/schema-store.js';
import type {
  DocumentEntry,
  ComponentEntry,
  UtilityEntry,
  GuideEntry,
  PatternEntry,
} from '../types/index.js';
import { formatFull } from '../formatters/component-formatter.js';
import { formatGuide } from '../formatters/guide-formatter.js';
import { formatPattern } from '../formatters/pattern-formatter.js';

/** A document with no real file on disk — synthesised from schema data. */
const SYNTHETIC_PATH = '<schema>';

/**
 * Convert a component into a searchable {@link DocumentEntry}.
 */
function componentToDocument(component: ComponentEntry): DocumentEntry {
  return {
    id: `components/${component.id}`,
    title: component.name,
    content: formatFull(component),
    filePath: SYNTHETIC_PATH,
    relativePath: `components/${component.id}`,
    module: 'components',
    category: component.category,
    metadata: {
      packageName: component.packageName,
      importStatement: component.importStatement,
      description: component.enhanced?.description ?? null,
      seeAlso: component.relatedComponents,
      hasPropsTable: component.props.length > 0,
      hasCodeExamples:
        component.stories.length > 0 ||
        (component.enhanced?.commonPatterns.length ?? 0) > 0,
    },
  };
}

/**
 * Convert a utility package into a searchable {@link DocumentEntry}.
 */
function utilityToDocument(utility: UtilityEntry): DocumentEntry {
  const exportsText = utility.exports
    .map((e) => `${e.name} ${e.description}`)
    .join('\n');
  const content = [
    `# ${utility.name}`,
    utility.enhanced?.description ?? '',
    utility.enhanced?.whenToUse ?? '',
    exportsText,
  ]
    .filter((s) => s.trim() !== '')
    .join('\n\n');

  return {
    id: `utilities/${utility.id}`,
    title: utility.name,
    content,
    filePath: SYNTHETIC_PATH,
    relativePath: `utilities/${utility.id}`,
    module: 'utilities',
    category: null,
    metadata: {
      packageName: utility.packageName,
      importStatement: `import { /* ... */ } from '${utility.importPath}'`,
      description: utility.enhanced?.description ?? null,
      seeAlso: [],
      hasPropsTable: false,
      hasCodeExamples: (utility.enhanced?.commonPatterns.length ?? 0) > 0,
    },
  };
}

/**
 * Convert a guide into a searchable {@link DocumentEntry}.
 *
 * @param guide - The guide to convert.
 * @param module - The legacy module name (`foundation`, `enterprise`, or
 *   `quick-reference`).
 */
function guideToDocument(guide: GuideEntry, module: string): DocumentEntry {
  return {
    id: `${module}/${guide.id}`,
    title: guide.title,
    content: formatGuide(guide),
    filePath: SYNTHETIC_PATH,
    relativePath: `${module}/${guide.id}`,
    module,
    category: null,
    metadata: {
      packageName: null,
      importStatement: null,
      description: null,
      seeAlso: guide.referencedComponents,
      hasPropsTable: false,
      hasCodeExamples: guide.codeExamples.length > 0,
    },
  };
}

/**
 * Convert a pattern into a searchable {@link DocumentEntry}.
 */
function patternToDocument(pattern: PatternEntry): DocumentEntry {
  return {
    id: `patterns/${pattern.group}/${pattern.id}`,
    title: pattern.title,
    content: formatPattern(pattern),
    filePath: SYNTHETIC_PATH,
    relativePath: `patterns/${pattern.group}/${pattern.id}`,
    module: 'patterns',
    category: null,
    metadata: {
      packageName: null,
      importStatement: null,
      description: null,
      seeAlso: pattern.referencedComponents,
      hasPropsTable: false,
      hasCodeExamples: pattern.examples.length > 0,
    },
  };
}

/**
 * Flatten an entire {@link SchemaStore} into searchable {@link DocumentEntry}
 * records spanning components, utilities, guides, and patterns.
 *
 * @param store - The populated schema store.
 * @returns An array of synthetic documents ready for indexing.
 */
export function schemaToDocuments(store: SchemaStore): DocumentEntry[] {
  const docs: DocumentEntry[] = [];

  for (const component of store.getAllComponents()) {
    docs.push(componentToDocument(component));
  }
  for (const utility of store.getAllUtilities()) {
    docs.push(utilityToDocument(utility));
  }
  for (const guide of store.getAllFoundationGuides()) {
    docs.push(guideToDocument(guide, 'foundation'));
  }
  for (const guide of store.getAllEnterpriseGuides()) {
    docs.push(guideToDocument(guide, 'enterprise'));
  }
  for (const guide of store.getAllQuickReferences()) {
    docs.push(guideToDocument(guide, 'quick-reference'));
  }
  for (const pattern of store.getAllPatterns()) {
    docs.push(patternToDocument(pattern));
  }

  return docs;
}

/**
 * Build a fully-indexed {@link SearchEngine} from a schema store.
 *
 * @param store - The populated schema store.
 * @param existingEngine - Optional engine to clear and reuse (for `reindex`).
 * @returns A search engine whose inverted index covers all schema content.
 */
export function buildSearchIndex(
  store: SchemaStore,
  existingEngine?: SearchEngine,
): SearchEngine {
  const engine = existingEngine ?? new SearchEngine();
  engine.clear();
  engine.buildIndex(schemaToDocuments(store));
  return engine;
}
