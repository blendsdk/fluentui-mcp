/**
 * In-memory store for querying a loaded {@link FluentUISchema}.
 *
 * The store builds a set of internal indexes once (in the constructor) so that
 * the MCP tools can perform fast, repeated lookups by name, id, category, and
 * prop without re-scanning the arrays each call. It replaces the previous
 * markdown-based `DocumentStore`.
 *
 * This is implemented as a `class` (rather than the functional style used
 * elsewhere) precisely because it owns several internal indexes — a natural fit
 * for stateful encapsulation. Stateless operations (loading, formatting) remain
 * exported functions.
 *
 * @module schema/schema-store
 */

import type {
  FluentUISchema,
  ComponentEntry,
  SchemaComponentCategory,
  UtilityEntry,
  GuideEntry,
  PatternEntry,
  SchemaStats,
  SourceInfo,
} from '../types/index.js';

/**
 * A component matched against a free-text requirements description, together
 * with a relevance score and the reasons it matched. Produced by
 * {@link SchemaStore.suggestComponents}.
 */
export interface ScoredComponent {
  /** The matched component. */
  component: ComponentEntry;

  /** Relevance score (higher is more relevant). Arbitrary positive scale. */
  score: number;

  /** Human-readable reasons explaining why this component matched. */
  matchReasons: string[];
}

/**
 * The result of comparing the props and slots of two components.
 * Produced by {@link SchemaStore.compareComponents}.
 */
export interface ComponentComparison {
  /** Name of the first component. */
  component1: string;

  /** Name of the second component. */
  component2: string;

  /** Prop names present on both components. */
  sharedProps: string[];

  /** Prop names present only on the first component. */
  uniqueToFirst: string[];

  /** Prop names present only on the second component. */
  uniqueToSecond: string[];

  /** Human-readable notes describing slot differences between the two. */
  slotDifferences: string[];
}

/**
 * A flattened, searchable view of one schema entry (component, utility, or
 * guide). Produced by {@link SchemaStore.getSearchableEntries} and consumed by
 * the search-index builder to feed the TF-IDF engine.
 */
export interface SearchableEntry {
  /** Stable identifier (e.g. component id or guide id). */
  id: string;

  /** Display title (component/utility name or guide title). */
  title: string;

  /** The kind of entry, used for module filtering in search. */
  type: 'component' | 'utility' | 'foundation' | 'pattern' | 'enterprise' | 'quick-reference';

  /** Category or group the entry belongs to. */
  category: string;

  /** Combined free text used for TF-IDF indexing. */
  content: string;

  /** Auxiliary metadata (package name, etc.) for result rendering. */
  metadata: Record<string, string>;
}

/**
 * Version/source info reported by {@link SchemaStore.getVersionInfo}.
 */
export interface VersionInfo {
  /** FluentUI version (e.g. `'v9'`). */
  version: string;

  /** ISO 8601 timestamp the schema was generated. */
  generatedAt: string;

  /** Source repository metadata used during scraping. */
  sources: { fluentui: SourceInfo; contrib?: SourceInfo };
}

/**
 * Normalize a name for case-insensitive lookups: trims surrounding whitespace
 * and lowercases. Used as the key for the name index and for fuzzy matching.
 *
 * @param value - The raw name to normalize.
 * @returns The normalized lookup key.
 */
function normalizeName(value: string): string {
  return value.trim().toLowerCase();
}

/**
 * In-memory, indexed view over a {@link FluentUISchema}.
 *
 * Construct once at server startup and reuse for all queries. The store does
 * not mutate the schema; it only builds read-only indexes over it.
 */
export class SchemaStore {
  /** The schema this store wraps. Kept for aggregate/raw access. */
  private readonly schema: FluentUISchema;

  /** Index: normalized component name → component. */
  private readonly componentsByName: Map<string, ComponentEntry>;

  /** Index: component id → component. */
  private readonly componentsById: Map<string, ComponentEntry>;

  /** Index: category → components in that category (insertion order preserved). */
  private readonly componentsByCategory: Map<string, ComponentEntry[]>;

  /** Index: normalized utility name → utility. */
  private readonly utilitiesByName: Map<string, UtilityEntry>;

  /** Index: utility id → utility. */
  private readonly utilitiesById: Map<string, UtilityEntry>;

  /** Index: foundation guide id → guide. */
  private readonly foundationById: Map<string, GuideEntry>;

  /** Index: enterprise guide id → guide. */
  private readonly enterpriseById: Map<string, GuideEntry>;

  /** Index: quick-reference guide id → guide. */
  private readonly quickReferenceById: Map<string, GuideEntry>;

  /** Index: pattern id → pattern. */
  private readonly patternsById: Map<string, PatternEntry>;

  /**
   * Build the store and all internal indexes from a loaded schema.
   *
   * @param schema - A loaded (and ideally validated) FluentUI schema.
   */
  constructor(schema: FluentUISchema) {
    this.schema = schema;
    this.componentsByName = new Map();
    this.componentsById = new Map();
    this.componentsByCategory = new Map();
    this.utilitiesByName = new Map();
    this.utilitiesById = new Map();
    this.foundationById = new Map();
    this.enterpriseById = new Map();
    this.quickReferenceById = new Map();
    this.patternsById = new Map();

    this.indexComponents();
    this.indexUtilities();
    this.indexGuides();
  }

  /**
   * Populate the component indexes. Called once from the constructor.
   * The first entry to claim a given name/id wins; duplicates are ignored
   * (the validator surfaces duplicate ids as warnings separately).
   */
  private indexComponents(): void {
    for (const component of this.schema.components) {
      const nameKey = normalizeName(component.name);
      if (!this.componentsByName.has(nameKey)) {
        this.componentsByName.set(nameKey, component);
      }

      if (typeof component.id === 'string' && !this.componentsById.has(component.id)) {
        this.componentsById.set(component.id, component);
      }

      const categoryBucket = this.componentsByCategory.get(component.category);
      if (categoryBucket) {
        categoryBucket.push(component);
      } else {
        this.componentsByCategory.set(component.category, [component]);
      }
    }
  }

  /**
   * Populate the utility indexes (by name and id). Called once from the
   * constructor. The first entry to claim a key wins.
   */
  private indexUtilities(): void {
    for (const utility of this.schema.utilities) {
      const nameKey = normalizeName(utility.name);
      if (!this.utilitiesByName.has(nameKey)) {
        this.utilitiesByName.set(nameKey, utility);
      }
      if (typeof utility.id === 'string' && !this.utilitiesById.has(utility.id)) {
        this.utilitiesById.set(utility.id, utility);
      }
    }
  }

  /**
   * Populate the guide and pattern id indexes (foundation, enterprise,
   * quick-reference, patterns). Called once from the constructor.
   */
  private indexGuides(): void {
    for (const guide of this.schema.foundation) {
      if (!this.foundationById.has(guide.id)) {
        this.foundationById.set(guide.id, guide);
      }
    }
    for (const guide of this.schema.enterprise) {
      if (!this.enterpriseById.has(guide.id)) {
        this.enterpriseById.set(guide.id, guide);
      }
    }
    for (const guide of this.schema.quickReference) {
      if (!this.quickReferenceById.has(guide.id)) {
        this.quickReferenceById.set(guide.id, guide);
      }
    }
    for (const pattern of this.schema.patterns) {
      if (!this.patternsById.has(pattern.id)) {
        this.patternsById.set(pattern.id, pattern);
      }
    }
  }

  // --- Component Queries ---

  /**
   * Get all components in schema order.
   *
   * @returns A new array of all components (empty if none).
   */
  getAllComponents(): ComponentEntry[] {
    return [...this.schema.components];
  }

  /**
   * Find a component by exact name (case-insensitive).
   *
   * @param name - The component name (e.g. `'Button'`, `'button'`).
   * @returns The matching component, or `undefined` if none.
   */
  findComponent(name: string): ComponentEntry | undefined {

    if (typeof name !== 'string' || name.length === 0) {
      return undefined;
    }
    return this.componentsByName.get(normalizeName(name));
  }

  /**
   * Find a component by fuzzy name match. Tries, in order:
   * 1. Exact (case-insensitive) name.
   * 2. Exact id match (kebab-case).
   * 3. Prefix match on name.
   * 4. Substring match on name.
   *
   * The shortest matching name is preferred for prefix/substring ties so that
   * `'button'` resolves to `Button` rather than `CompoundButton`.
   *
   * @param name - The (possibly partial) component name.
   * @returns The best matching component, or `undefined` if none.
   */
  findComponentFuzzy(name: string): ComponentEntry | undefined {
    if (typeof name !== 'string' || name.trim().length === 0) {
      return undefined;
    }

    const key = normalizeName(name);

    // 1. Exact name.
    const exact = this.componentsByName.get(key);
    if (exact) {
      return exact;
    }

    // 2. Exact id.
    const byId = this.componentsById.get(key);
    if (byId) {
      return byId;
    }

    // 3. Prefix match, then 4. substring match — collect candidates and pick
    // the one with the shortest name (most specific match).
    let prefixMatch: ComponentEntry | undefined;
    let substringMatch: ComponentEntry | undefined;

    for (const component of this.schema.components) {
      const candidateKey = normalizeName(component.name);

      if (candidateKey.startsWith(key)) {
        if (!prefixMatch || component.name.length < prefixMatch.name.length) {
          prefixMatch = component;
        }
      } else if (candidateKey.includes(key)) {
        if (!substringMatch || component.name.length < substringMatch.name.length) {
          substringMatch = component;
        }
      }
    }

    return prefixMatch ?? substringMatch;
  }

  /**
   * Get all components in a given category, in schema order.
   *
   * @param category - The category to filter by (e.g. `'buttons'`).
   * @returns A new array of matching components (empty if none).
   */
  getComponentsByCategory(category: SchemaComponentCategory): ComponentEntry[] {
    const bucket = this.componentsByCategory.get(category);
    return bucket ? [...bucket] : [];
  }

  /**
   * Get all components with a given stability classification.
   *
   * @param stability - The stability value (e.g. `'stable'`, `'preview'`).
   * @returns A new array of matching components (empty if none).
   */
  getComponentsByStability(stability: string): ComponentEntry[] {
    return this.schema.components.filter((c) => c.stability === stability);
  }

  /**
   * Find all components that declare a prop with the given name
   * (case-insensitive).
   *
   * @param propName - The prop name to search for (e.g. `'appearance'`).
   * @returns A new array of components that have the prop (empty if none).
   */
  findComponentsWithProp(propName: string): ComponentEntry[] {
    if (typeof propName !== 'string' || propName.length === 0) {
      return [];
    }
    const target = normalizeName(propName);
    return this.schema.components.filter((component) =>
      component.props.some((prop) => normalizeName(prop.name) === target),
    );
  }

  /**
   * Suggest components matching a free-text requirements description.
   *
   * Scoring is keyword-based and additive:
   * - Exact name token match: strong boost.
   * - Category token match: medium boost.
   * - Description/whenToUse keyword overlap: small boost per term.
   * - Prop name keyword overlap: small boost per prop.
   *
   * Only components with a positive score are returned, sorted by descending
   * score (ties broken by component name for stable output).
   *
   * @param requirements - A natural-language description of what the user needs.
   * @returns Scored components, most relevant first (empty if no matches).
   */
  suggestComponents(requirements: string): ScoredComponent[] {
    if (typeof requirements !== 'string' || requirements.trim().length === 0) {
      return [];
    }

    const terms = this.tokenize(requirements);
    if (terms.length === 0) {
      return [];
    }
    const termSet = new Set(terms);

    const scored: ScoredComponent[] = [];

    for (const component of this.schema.components) {
      let score = 0;
      const matchReasons: string[] = [];

      const nameKey = normalizeName(component.name);
      if (termSet.has(nameKey)) {
        score += 10;
        matchReasons.push(`Name matches "${component.name}"`);
      }

      if (termSet.has(normalizeName(component.category))) {
        score += 5;
        matchReasons.push(`Category matches "${component.category}"`);
      }

      // Description / whenToUse keyword overlap.
      const descriptionText = [
        component.enhanced?.description ?? '',
        component.enhanced?.whenToUse ?? '',
      ].join(' ');
      const descriptionTokens = new Set(this.tokenize(descriptionText));
      let descriptionHits = 0;
      for (const term of termSet) {
        if (descriptionTokens.has(term)) {
          descriptionHits += 1;
        }
      }
      if (descriptionHits > 0) {
        score += descriptionHits;
        matchReasons.push(`Description mentions ${descriptionHits} matching term(s)`);
      }

      // Prop name overlap.
      let propHits = 0;
      for (const prop of component.props) {
        if (termSet.has(normalizeName(prop.name))) {
          propHits += 1;
        }
      }
      if (propHits > 0) {
        score += propHits;
        matchReasons.push(`Has ${propHits} matching prop(s)`);
      }

      if (score > 0) {
        scored.push({ component, score, matchReasons });
      }
    }

    scored.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.component.name.localeCompare(b.component.name);
    });

    return scored;
  }

  /**
   * Compare the props and slots of two components by name.
   *
   * @param name1 - The first component name.
   * @param name2 - The second component name.
   * @returns A comparison describing shared/unique props and slot differences.
   * @throws Error if either component cannot be found.
   */
  compareComponents(name1: string, name2: string): ComponentComparison {
    const first = this.findComponent(name1);
    if (!first) {
      throw new Error(`Component not found: ${name1}`);
    }
    const second = this.findComponent(name2);
    if (!second) {
      throw new Error(`Component not found: ${name2}`);
    }

    const firstProps = new Set(first.props.map((p) => p.name));
    const secondProps = new Set(second.props.map((p) => p.name));

    const sharedProps: string[] = [];
    const uniqueToFirst: string[] = [];
    for (const propName of firstProps) {
      if (secondProps.has(propName)) {
        sharedProps.push(propName);
      } else {
        uniqueToFirst.push(propName);
      }
    }

    const uniqueToSecond: string[] = [];
    for (const propName of secondProps) {
      if (!firstProps.has(propName)) {
        uniqueToSecond.push(propName);
      }
    }

    const slotDifferences = this.describeSlotDifferences(first, second);

    return {
      component1: first.name,
      component2: second.name,
      sharedProps: sharedProps.sort(),
      uniqueToFirst: uniqueToFirst.sort(),
      uniqueToSecond: uniqueToSecond.sort(),
      slotDifferences,
    };
  }

  /**
   * Build a human-readable list of slot differences between two components.
   *
   * @param first - The first component.
   * @param second - The second component.
   * @returns Notes describing slots unique to each side (empty if identical).
   */
  private describeSlotDifferences(
    first: ComponentEntry,
    second: ComponentEntry,
  ): string[] {
    const firstSlots = new Set(first.slots.map((s) => s.name));
    const secondSlots = new Set(second.slots.map((s) => s.name));
    const differences: string[] = [];

    for (const slot of firstSlots) {
      if (!secondSlots.has(slot)) {
        differences.push(`"${slot}" slot only on ${first.name}`);
      }
    }
    for (const slot of secondSlots) {
      if (!firstSlots.has(slot)) {
        differences.push(`"${slot}" slot only on ${second.name}`);
      }
    }

    return differences;
  }

  // --- Utility Queries ---

  /**
   * Find a utility package by name (case-insensitive) or by id.
   *
   * @param name - The utility display name or id (e.g. `'Positioning'`).
   * @returns The matching utility, or `undefined` if none.
   */
  findUtility(name: string): UtilityEntry | undefined {
    if (typeof name !== 'string' || name.trim().length === 0) {
      return undefined;
    }
    const key = normalizeName(name);
    return this.utilitiesByName.get(key) ?? this.utilitiesById.get(key);
  }

  /**
   * Get all utility packages in schema order.
   *
   * @returns A new array of all utilities (empty if none).
   */
  getAllUtilities(): UtilityEntry[] {
    return [...this.schema.utilities];
  }

  // --- Guide Queries ---

  /**
   * Get a foundation guide by id.
   *
   * @param id - The guide id (e.g. `'getting-started'`).
   * @returns The matching guide, or `undefined` if none.
   */
  getFoundationGuide(id: string): GuideEntry | undefined {
    return typeof id === 'string' ? this.foundationById.get(id) : undefined;
  }

  /**
   * Get all foundation guides in schema order.
   *
   * @returns A new array of foundation guides (empty if none).
   */
  getAllFoundationGuides(): GuideEntry[] {
    return [...this.schema.foundation];
  }

  /**
   * Get a pattern by id.
   *
   * @param id - The pattern id (e.g. `'login-form'`).
   * @returns The matching pattern, or `undefined` if none.
   */
  getPattern(id: string): PatternEntry | undefined {
    return typeof id === 'string' ? this.patternsById.get(id) : undefined;
  }

  /**
   * Get all patterns belonging to a group (e.g. `'forms'`, `'navigation'`).
   *
   * @param group - The pattern group to filter by.
   * @returns A new array of matching patterns (empty if none).
   */
  getPatternsByGroup(group: string): PatternEntry[] {
    return this.schema.patterns.filter((p) => p.group === group);
  }

  /**
   * Get all patterns in schema order.
   *
   * @returns A new array of all patterns (empty if none).
   */
  getAllPatterns(): PatternEntry[] {
    return [...this.schema.patterns];
  }

  /**
   * Get an enterprise guide by id.
   *
   * @param id - The guide id (e.g. `'app-shell'`).
   * @returns The matching guide, or `undefined` if none.
   */
  getEnterpriseGuide(id: string): GuideEntry | undefined {
    return typeof id === 'string' ? this.enterpriseById.get(id) : undefined;
  }

  /**
   * Get all enterprise guides in schema order.
   *
   * @returns A new array of enterprise guides (empty if none).
   */
  getAllEnterpriseGuides(): GuideEntry[] {
    return [...this.schema.enterprise];
  }

  /**
   * Get a quick-reference guide by id.
   *
   * @param id - The guide id (e.g. `'component-cheatsheet'`).
   * @returns The matching guide, or `undefined` if none.
   */
  getQuickReference(id: string): GuideEntry | undefined {
    return typeof id === 'string' ? this.quickReferenceById.get(id) : undefined;
  }

  /**
   * Get all quick-reference guides in schema order.
   *
   * @returns A new array of quick-reference guides (empty if none).
   */
  getAllQuickReferences(): GuideEntry[] {
    return [...this.schema.quickReference];
  }

  // --- Aggregate Queries ---

  /**
   * Get every component category present in the schema with its component count.
   *
   * @returns A map of category name → number of components (insertion order).
   */
  getCategories(): Map<string, number> {
    const counts = new Map<string, number>();
    for (const [category, components] of this.componentsByCategory) {
      counts.set(category, components.length);
    }
    return counts;
  }

  /**
   * Get the list of content modules that are non-empty in this schema.
   * Always reflects actual content (a module with no entries is omitted).
   *
   * @returns An ordered array of module names.
   */
  getModules(): string[] {
    const modules: string[] = [];
    if (this.schema.components.length > 0) modules.push('components');
    if (this.schema.utilities.length > 0) modules.push('utilities');
    if (this.schema.foundation.length > 0) modules.push('foundation');
    if (this.schema.patterns.length > 0) modules.push('patterns');
    if (this.schema.enterprise.length > 0) modules.push('enterprise');
    if (this.schema.quickReference.length > 0) modules.push('quick-reference');
    return modules;
  }

  /**
   * Get the schema-level statistics block.
   *
   * @returns The {@link SchemaStats} from the loaded schema.
   */
  getStats(): SchemaStats {
    return this.schema.stats;
  }

  /**
   * Get the schema version and source repository info.
   *
   * @returns Version, generation timestamp, and source metadata.
   */
  getVersionInfo(): VersionInfo {
    return {
      version: this.schema.version,
      generatedAt: this.schema.generatedAt,
      sources: this.schema.sources,
    };
  }

  /**
   * Flatten all components, utilities, and guides into {@link SearchableEntry}
   * records for building a search index. Each entry combines its title and
   * descriptive text into a single `content` string for TF-IDF indexing.
   *
   * @returns An array of searchable entries across all content types.
   */
  getSearchableEntries(): SearchableEntry[] {
    const entries: SearchableEntry[] = [];

    for (const component of this.schema.components) {
      const parts = [
        component.name,
        component.enhanced?.description ?? '',
        component.enhanced?.whenToUse ?? '',
        component.props.map((p) => `${p.name} ${p.description}`).join(' '),
      ];
      entries.push({
        id: component.id,
        title: component.name,
        type: 'component',
        category: component.category,
        content: parts.join(' ').trim(),
        metadata: { packageName: component.packageName },
      });
    }

    for (const utility of this.schema.utilities) {
      const parts = [
        utility.name,
        utility.enhanced?.description ?? '',
        utility.enhanced?.whenToUse ?? '',
        utility.exports.map((e) => `${e.name} ${e.description}`).join(' '),
      ];
      entries.push({
        id: utility.id,
        title: utility.name,
        type: 'utility',
        category: 'utilities',
        content: parts.join(' ').trim(),
        metadata: { packageName: utility.packageName },
      });
    }

    for (const guide of this.schema.foundation) {
      entries.push(this.guideToSearchable(guide, 'foundation'));
    }
    for (const guide of this.schema.enterprise) {
      entries.push(this.guideToSearchable(guide, 'enterprise'));
    }
    for (const guide of this.schema.quickReference) {
      entries.push(this.guideToSearchable(guide, 'quick-reference'));
    }

    for (const pattern of this.schema.patterns) {
      entries.push({
        id: pattern.id,
        title: pattern.title,
        type: 'pattern',
        category: pattern.group,
        content: `${pattern.title} ${pattern.content}`.trim(),
        metadata: { group: pattern.group },
      });
    }

    return entries;
  }

  /**
   * Convert a {@link GuideEntry} into a {@link SearchableEntry}.
   *
   * @param guide - The guide to flatten.
   * @param type - The searchable type tag for this guide collection.
   * @returns A searchable entry combining the guide's title and content.
   */
  private guideToSearchable(
    guide: GuideEntry,
    type: 'foundation' | 'enterprise' | 'quick-reference',
  ): SearchableEntry {
    return {
      id: guide.id,
      title: guide.title,
      type,
      category: guide.category,
      content: `${guide.title} ${guide.content}`.trim(),
      metadata: {},
    };
  }

  /**
   * Split free text into lowercase word tokens, dropping punctuation and very
   * short tokens. Used by {@link suggestComponents}.
   *
   * @param text - The text to tokenize.
   * @returns An array of normalized tokens (may be empty).
   */
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length > 1);
  }
}
