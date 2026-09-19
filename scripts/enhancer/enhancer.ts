/**
 * Enhancement orchestrator.
 *
 * Coordinates the two enhancement passes:
 *   Pass 1 — enrich new/changed components and utilities via the LLM.
 *   Pass 2 — generate foundation, pattern, enterprise, and quick-reference
 *            guides grounded in the component inventory.
 *
 * The orchestrator is provider-agnostic (works with any {@link LLMProvider},
 * including the mock) and uses the concurrency-limited batch processor for
 * all LLM calls so large schemas enhance efficiently with retry/backoff.
 *
 * @module enhancer/enhancer
 */

import type {
  FluentUISchema,
  ComponentEntry,
  ComponentEnhanced,
  UtilityEntry,
  UtilityEnhanced,
  GuideEntry,
  CategoryGuidanceEntry,
  RecipeEntry,
} from '../../src/types/schema.js';
import type { LLMProvider } from './llm/provider.js';
import { runBatch } from './llm/batch.js';
import { chatComplete } from './llm/complete.js';
import { diffSchemas } from './diff.js';
import { buildHashIndex, computeComponentHash, computeUtilityHash } from './hasher.js';
import { parseJsonResponse } from './parse.js';
import {
  buildComponentEnhanceMessages,
  buildUtilityEnhanceMessages,
  buildFoundationGuideMessages,
  buildCategoryGuidanceMessages,
  buildRecipeMessages,
  buildQuickReferenceMessages,
  buildComponentSummaries,
  resolveTargetComponents,
} from './prompts/index.js';

import type { ComponentSummary, GuideSpec } from './types.js';
import {
  CATEGORY_GUIDES,
  FOUNDATION_GUIDES,
  QUICK_REFERENCE_GUIDES,
  RECIPE_GUIDES,
  type EnhancerConfig,
} from './config.js';

// ============================================================================
// Raw LLM Response Shapes
// ============================================================================

/** Raw JSON shape returned by the component enhancement prompt. */
interface RawComponentEnhancement {
  description?: string;
  whenToUse?: string;
  bestPractices?: { dos?: string[]; donts?: string[] };
  accessibility?: {
    requirements?: string;
    keyboardSupport?: { key: string; action: string }[];
    ariaAttributes?: string[];
    screenReaderBehavior?: string;
  };
  stylingTips?: string;
  migrationNotes?: string;
  propGuidance?: { prop: string; guidance: string; example?: string }[];
  antiPatterns?: {
    title: string;
    problem: string;
    solution: string;
  }[];
  performanceNotes?: string;
  themingNotes?: string;
  relatedRecipes?: string[];
  edgeCases?: string[];
}

/** Raw JSON shape returned by the utility enhancement prompt. */
interface RawUtilityEnhancement {
  description?: string;
  whenToUse?: string;
  commonPatterns?: { name: string; description: string; code: string }[];
  exportGuidance?: { export: string; guidance: string; example?: string }[];
  performanceNotes?: string;
  edgeCases?: string[];
}

/** Raw JSON shape returned by guide-style prompts. */
interface RawGuide {
  content?: string;
  codeExamples?: {
    title: string;
    description: string;
    code: string;
    language: string;
  }[];
  referencedComponents?: string[];
  keyTakeaways?: string[];
  pitfalls?: string[];
  accessibilityNotes?: string;
}

/** Raw JSON shape returned by the category-guidance prompt. */
interface RawCategoryGuidance {
  overview?: string;
  whenToUse?: string;
  bestPractices?: { dos?: string[]; donts?: string[] };
  accessibility?: string;
  antiPatterns?: { title: string; problem: string; solution: string }[];
}

/** Raw JSON shape returned by the recipe prompt. */
interface RawRecipe {
  goal?: string;
  whenToUse?: string;
  whenNotToUse?: string;
  content?: string;
  examples?: {
    name: string;
    description: string;
    code: string;
    language?: string;
  }[];
  referencedComponents?: string[];
  accessibilityNotes?: string;
  pitfalls?: string[];
}


// ============================================================================
// Result Type
// ============================================================================

/**
 * Summary statistics describing an enhancement run.
 */
export interface EnhancementRunStats {
  componentsEnhanced: number;
  componentsCarriedForward: number;
  utilitiesEnhanced: number;
  utilitiesCarriedForward: number;
  guidesGenerated: number;
  categoryGuidanceGenerated: number;
  recipesGenerated: number;
  failures: number;

  /**
   * Human-readable messages for each failed item, in the order the batches
   * settled. Populated so callers can fail-fast with the underlying cause
   * (for example a truncated provider response) instead of a bare count.
   */
  failureDetails: string[];
}

/**
 * Result of a full enhancement run.
 */
export interface EnhancementRunResult {
  /** The fully enhanced schema ready to write to disk. */
  schema: FluentUISchema;

  /** Run statistics. */
  stats: EnhancementRunStats;
}

// ============================================================================
// Orchestrator
// ============================================================================

/**
 * Run the full enhancement pipeline over a raw schema.
 *
 * @param rawSchema - The freshly scraped raw schema
 * @param previousSchema - The previous enhanced schema (null for first run)
 * @param provider - The LLM provider to use
 * @param config - Resolved enhancer configuration
 * @returns The enhanced schema and run statistics
 */
export async function runEnhancement(
  rawSchema: FluentUISchema,
  previousSchema: FluentUISchema | null,
  provider: LLMProvider,
  config: EnhancerConfig,
): Promise<EnhancementRunResult> {
  const log = (msg: string): void => {
    if (config.verbose) console.error(`[enhancer] ${msg}`);
  };

  const stats: EnhancementRunStats = {
    componentsEnhanced: 0,
    componentsCarriedForward: 0,
    utilitiesEnhanced: 0,
    utilitiesCarriedForward: 0,
    guidesGenerated: 0,
    categoryGuidanceGenerated: 0,
    recipesGenerated: 0,
    failures: 0,
    failureDetails: [],
  };

  const hashIndex = buildHashIndex(rawSchema.components, rawSchema.utilities);
  const allComponentNames = rawSchema.components.map((c) => c.name);
  const summaries = buildComponentSummaries(rawSchema.components);

  // Determine what to enhance. With --full, treat everything as changed.
  const diff = config.full
    ? null
    : diffSchemas(rawSchema, previousSchema, buildPreviousHashIndex(previousSchema));

  const componentsToEnhance = config.full
    ? rawSchema.components
    : [...(diff?.newComponents ?? []), ...(diff?.changedComponents ?? [])];
  const utilitiesToEnhance = config.full
    ? rawSchema.utilities
    : [...(diff?.newUtilities ?? []), ...(diff?.changedUtilities ?? [])];

  const previousComponentMap = buildComponentMap(previousSchema);
  const previousUtilityMap = buildUtilityMap(previousSchema);

  // --------------------------------------------------------------------------
  // Pass 1: Components & Utilities
  // --------------------------------------------------------------------------
  const enhancedComponents: ComponentEntry[] = rawSchema.components.map((c) => ({
    ...c,
  }));

  if (config.enhanceComponents) {
    const componentTotal = componentsToEnhance.length;
    log(`Pass 1: enhancing ${componentTotal} components`);
    const enhanceSet = new Set(componentsToEnhance.map((c) => c.id));

    let componentStarted = 0;
    const componentResults = await runBatch(
      componentsToEnhance.map((component) => async () => {
        const n = (componentStarted += 1);
        log(`  [${n}/${componentTotal}] component → ${component.name}`);
        const messages = buildComponentEnhanceMessages({
          component,
          allComponentNames,
          version: config.version,
        });
        const response = await chatComplete(provider, messages, {
          temperature: config.temperature,
          maxTokens: config.maxTokens,
          responseFormat: 'json',
          log,
        });
        const raw = parseJsonResponse<RawComponentEnhancement>(response.content);

        return {
          id: component.id,
          enhanced: mapComponentEnhanced(raw, hashIndex[component.id]),
        };
      }),
      {
        ...batchOptions(config),
        onProgress: (completed, total) =>
          log(`  ✓ components ${completed}/${total} done`),
      },
    );


    const enhancedById = new Map<string, ComponentEnhanced>();
    for (const item of componentResults.items) {
      if (item.ok && item.result) {
        enhancedById.set(item.result.id, item.result.enhanced);
      }
    }
    stats.failures += componentResults.failed.length;
    stats.failureDetails.push(
      ...componentResults.failed.map(
        (item) => item.error?.message ?? `component #${item.index} failed`,
      ),
    );

    for (let i = 0; i < enhancedComponents.length; i += 1) {
      const comp = enhancedComponents[i];
      const fresh = enhancedById.get(comp.id);
      if (fresh) {
        enhancedComponents[i] = { ...comp, enhanced: fresh };
        stats.componentsEnhanced += 1;
      } else if (!enhanceSet.has(comp.id)) {
        // Unchanged → carry forward previous enhancement if present.
        const prev = previousComponentMap.get(comp.id);
        if (prev?.enhanced) {
          enhancedComponents[i] = { ...comp, enhanced: prev.enhanced };
          stats.componentsCarriedForward += 1;
        }
      }
    }
  } else {
    // Components pass skipped → carry forward all previous enhancements.
    for (let i = 0; i < enhancedComponents.length; i += 1) {
      const prev = previousComponentMap.get(enhancedComponents[i].id);
      if (prev?.enhanced) {
        enhancedComponents[i] = {
          ...enhancedComponents[i],
          enhanced: prev.enhanced,
        };
        stats.componentsCarriedForward += 1;
      }
    }
  }

  const enhancedUtilities: UtilityEntry[] = rawSchema.utilities.map((u) => ({
    ...u,
  }));

  if (config.enhanceComponents) {
    const utilityTotal = utilitiesToEnhance.length;
    log(`Pass 1: enhancing ${utilityTotal} utilities`);
    const enhanceSet = new Set(utilitiesToEnhance.map((u) => u.id));

    let utilityStarted = 0;
    const utilityResults = await runBatch(
      utilitiesToEnhance.map((utility) => async () => {
        const n = (utilityStarted += 1);
        log(`  [${n}/${utilityTotal}] utility → ${utility.name}`);
        const messages = buildUtilityEnhanceMessages({
          utility,
          allComponentNames,
          version: config.version,
        });
        const response = await chatComplete(provider, messages, {
          temperature: config.temperature,
          maxTokens: config.maxTokens,
          responseFormat: 'json',
          log,
        });
        const raw = parseJsonResponse<RawUtilityEnhancement>(response.content);

        return {
          id: utility.id,
          enhanced: mapUtilityEnhanced(raw, hashIndex[utility.id]),
        };
      }),
      {
        ...batchOptions(config),
        onProgress: (completed, total) =>
          log(`  ✓ utilities ${completed}/${total} done`),
      },
    );


    const enhancedById = new Map<string, UtilityEnhanced>();
    for (const item of utilityResults.items) {
      if (item.ok && item.result) {
        enhancedById.set(item.result.id, item.result.enhanced);
      }
    }
    stats.failures += utilityResults.failed.length;
    stats.failureDetails.push(
      ...utilityResults.failed.map(
        (item) => item.error?.message ?? `utility #${item.index} failed`,
      ),
    );

    for (let i = 0; i < enhancedUtilities.length; i += 1) {
      const util = enhancedUtilities[i];
      const fresh = enhancedById.get(util.id);
      if (fresh) {
        enhancedUtilities[i] = { ...util, enhanced: fresh };
        stats.utilitiesEnhanced += 1;
      } else if (!enhanceSet.has(util.id)) {
        const prev = previousUtilityMap.get(util.id);
        if (prev?.enhanced) {
          enhancedUtilities[i] = { ...util, enhanced: prev.enhanced };
          stats.utilitiesCarriedForward += 1;
        }
      }
    }
  } else {
    for (let i = 0; i < enhancedUtilities.length; i += 1) {
      const prev = previousUtilityMap.get(enhancedUtilities[i].id);
      if (prev?.enhanced) {
        enhancedUtilities[i] = {
          ...enhancedUtilities[i],
          enhanced: prev.enhanced,
        };
        stats.utilitiesCarriedForward += 1;
      }
    }
  }

  // --------------------------------------------------------------------------
  // Pass 2: Guides, category guidance, and recipes
  // --------------------------------------------------------------------------
  let foundation = previousSchema?.foundation ?? [];
  let quickReference = previousSchema?.quickReference ?? [];
  let categoryGuidance = previousSchema?.categoryGuidance ?? [];
  let recipes = previousSchema?.recipes ?? [];

  if (config.generateGuides) {
    log('Pass 2: generating guides, category guidance, and recipes');

    const foundationBatch = await generateGuides(
      FOUNDATION_GUIDES,
      provider,
      config,
      rawSchema.components,
      summaries,
      buildFoundationGuideMessages,
      log,
      'foundation',
    );
    const quickReferenceBatch = await generateGuides(
      QUICK_REFERENCE_GUIDES,
      provider,
      config,
      rawSchema.components,
      summaries,
      buildQuickReferenceMessages,
      log,
      'quick-ref',
    );
    const categoryBatch = await generateCategoryGuidance(
      provider,
      config,
      rawSchema.components,
      summaries,
      log,
    );
    const recipeBatch = await generateRecipes(
      provider,
      config,
      rawSchema.components,
      summaries,
      log,
    );

    foundation = foundationBatch.entries;
    quickReference = quickReferenceBatch.entries;
    categoryGuidance = categoryBatch.entries;
    recipes = recipeBatch.entries;

    // Surface Pass-2 failures so the caller's fail-fast gate aborts the run
    // before a partial schema is written.
    recordBatchFailures(stats, [
      ...foundationBatch.failures,
      ...quickReferenceBatch.failures,
      ...categoryBatch.failures,
      ...recipeBatch.failures,
    ]);

    stats.guidesGenerated = foundation.length + quickReference.length;
    stats.categoryGuidanceGenerated = categoryGuidance.length;
    stats.recipesGenerated = recipes.length;
  }

  const schema: FluentUISchema = {
    ...rawSchema,
    components: enhancedComponents,
    utilities: enhancedUtilities,
    foundation,
    categoryGuidance,
    recipes,
    quickReference,
    generatedAt: new Date().toISOString(),
  };

  return { schema, stats };
}

// ============================================================================
// Guide Generation Helpers
// ============================================================================

type GuideMessageBuilder = (context: {
  spec: GuideSpec;
  allComponentNames: string[];
  componentSummaries: ComponentSummary[];
  targetComponents: ComponentEntry[];
  version: string;
}) => Parameters<LLMProvider['chat']>[0];

/**
 * Result of generating a catalog of guides/categories/recipes.
 *
 * Failures are surfaced explicitly so the orchestrator can fail-fast instead
 * of silently dropping an entry and writing a partial schema.
 */
interface GeneratedBatch<T> {
  /** Successfully generated entries, in catalog order. */
  entries: T[];

  /** Human-readable messages for each failed entry. */
  failures: string[];
}


/**
 * Generate a set of GuideEntry items for a catalog using a message builder.
 *
 * Each spec's `targetComponentIds` are resolved against the full component
 * inventory so the prompt receives those components at full fidelity. LLM
 * calls go through {@link chatComplete} so large guides are never truncated.
 */
async function generateGuides(
  specs: GuideSpec[],
  provider: LLMProvider,
  config: EnhancerConfig,
  components: ComponentEntry[],
  summaries: ComponentSummary[],
  buildMessages: GuideMessageBuilder,
  log?: (msg: string) => void,
  label = 'guide',
): Promise<GeneratedBatch<GuideEntry>> {
  const allComponentNames = summaries.map((s) => s.name);
  const total = specs.length;

  let started = 0;
  const results = await runBatch(
    specs.map((spec) => async () => {
      const n = (started += 1);
      log?.(`  [${n}/${total}] ${label} → ${spec.title}`);
      const messages = buildMessages({
        spec,
        allComponentNames,
        componentSummaries: summaries,
        targetComponents: resolveTargetComponents(
          components,
          spec.targetComponentIds,
        ),
        version: config.version,
      });

      const response = await chatComplete(provider, messages, {
        temperature: config.temperature,
        maxTokens: config.maxTokens,
        responseFormat: 'json',
        log,
      });
      const raw = parseJsonResponse<RawGuide>(response.content);
      return mapGuideEntry(spec, raw);
    }),
    {
      ...batchOptions(config),
      onProgress: (completed, t) =>
        log?.(`  ✓ ${label} ${completed}/${t} done`),
    },
  );

  return {
    entries: results.items
      .filter((item) => item.ok && item.result)
      .map((item) => item.result as GuideEntry),
    failures: results.failed.map(
      (item) => item.error?.message ?? `${label} #${item.index} failed`,
    ),
  };
}



/**
 * Generate one {@link CategoryGuidanceEntry} per schema category.
 *
 * Each guide's target components are the components whose `category` matches
 * the guide id, so the prompt is grounded in exactly that slice of the
 * inventory. LLM calls go through {@link chatComplete} so large guides are
 * never truncated.
 */
async function generateCategoryGuidance(
  provider: LLMProvider,
  config: EnhancerConfig,
  components: ComponentEntry[],
  summaries: ComponentSummary[],
  log?: (msg: string) => void,
): Promise<GeneratedBatch<CategoryGuidanceEntry>> {
  const allComponentNames = summaries.map((s) => s.name);
  const specs = CATEGORY_GUIDES;
  const total = specs.length;

  let started = 0;
  const results = await runBatch(
    specs.map((spec) => async () => {
      const n = (started += 1);
      log?.(`  [${n}/${total}] category → ${spec.title}`);
      const targets = components.filter((c) => c.category === spec.id);
      const messages = buildCategoryGuidanceMessages({
        spec,
        allComponentNames,
        componentSummaries: summaries,
        targetComponents: targets,
        version: config.version,
      });

      const response = await chatComplete(provider, messages, {
        temperature: config.temperature,
        maxTokens: config.maxTokens,
        responseFormat: 'json',
        log,
      });
      const raw = parseJsonResponse<RawCategoryGuidance>(response.content);
      return mapCategoryGuidance(spec, raw, targets.map((c) => c.id));
    }),
    {
      ...batchOptions(config),
      onProgress: (completed, t) =>
        log?.(`  ✓ category ${completed}/${t} done`),
    },
  );

  return {
    entries: results.items
      .filter((item) => item.ok && item.result)
      .map((item) => item.result as CategoryGuidanceEntry),
    failures: results.failed.map(
      (item) => item.error?.message ?? `category #${item.index} failed`,
    ),
  };
}

/**
 * Generate the {@link RecipeEntry} catalog.
 *
 * Each recipe receives the full component inventory at full fidelity so its
 * examples reference only real APIs. LLM calls go through {@link chatComplete}
 * so large recipes are never truncated.
 */
async function generateRecipes(
  provider: LLMProvider,
  config: EnhancerConfig,
  components: ComponentEntry[],
  summaries: ComponentSummary[],
  log?: (msg: string) => void,
): Promise<GeneratedBatch<RecipeEntry>> {
  const allComponentNames = summaries.map((s) => s.name);
  const specs = RECIPE_GUIDES;
  const total = specs.length;

  let started = 0;
  const results = await runBatch(
    specs.map((spec) => async () => {
      const n = (started += 1);
      log?.(`  [${n}/${total}] recipe → ${spec.title}`);
      const messages = buildRecipeMessages({
        spec,
        allComponentNames,
        componentSummaries: summaries,
        targetComponents: resolveTargetComponents(
          components,
          spec.targetComponentIds,
        ),
        version: config.version,
      });

      const response = await chatComplete(provider, messages, {
        temperature: config.temperature,
        maxTokens: config.maxTokens,
        responseFormat: 'json',
        log,
      });
      const raw = parseJsonResponse<RawRecipe>(response.content);
      return mapRecipeEntry(spec, raw);
    }),
    {
      ...batchOptions(config),
      onProgress: (completed, t) =>
        log?.(`  ✓ recipe ${completed}/${t} done`),
    },
  );

  return {
    entries: results.items
      .filter((item) => item.ok && item.result)
      .map((item) => item.result as RecipeEntry),
    failures: results.failed.map(
      (item) => item.error?.message ?? `recipe #${item.index} failed`,
    ),
  };
}


// ============================================================================
// Mapping Helpers
// ============================================================================

/**
 * Map a raw component enhancement response into a {@link ComponentEnhanced}.
 */
export function mapComponentEnhanced(
  raw: RawComponentEnhancement,
  sourceHash: string,
): ComponentEnhanced {
  return {
    description: cleanText(raw.description ?? ''),
    whenToUse: cleanText(raw.whenToUse ?? ''),
    bestPractices: {
      dos: cleanTextArray(raw.bestPractices?.dos ?? []),
      donts: cleanTextArray(raw.bestPractices?.donts ?? []),
    },
    accessibility: {
      requirements: cleanText(raw.accessibility?.requirements ?? ''),
      keyboardSupport: (raw.accessibility?.keyboardSupport ?? []).map((k) => ({
        key: cleanText(k.key),
        action: cleanText(k.action),
      })),
      ariaAttributes: cleanTextArray(raw.accessibility?.ariaAttributes ?? []),
      screenReaderBehavior: cleanText(
        raw.accessibility?.screenReaderBehavior ?? '',
      ),
    },
    stylingTips: cleanText(raw.stylingTips ?? ''),
    migrationNotes: cleanOptionalText(raw.migrationNotes),
    propGuidance: raw.propGuidance?.map((entry) => ({
      prop: entry.prop,
      guidance: cleanText(entry.guidance),
      example: cleanOptionalText(entry.example),
    })),
    antiPatterns: raw.antiPatterns?.map((entry) => ({
      title: cleanText(entry.title),
      problem: cleanText(entry.problem),
      solution: cleanText(entry.solution),
    })),
    performanceNotes: cleanOptionalText(raw.performanceNotes),
    themingNotes: cleanOptionalText(raw.themingNotes),
    relatedRecipes: raw.relatedRecipes,
    edgeCases: raw.edgeCases ? cleanTextArray(raw.edgeCases) : undefined,
    sourceHash,
    enhancedAt: new Date().toISOString(),
  };
}

/**
 * Map a raw utility enhancement response into a {@link UtilityEnhanced}.
 */
export function mapUtilityEnhanced(
  raw: RawUtilityEnhancement,
  sourceHash: string,
): UtilityEnhanced {
  return {
    description: raw.description ?? '',
    whenToUse: raw.whenToUse ?? '',
    commonPatterns: raw.commonPatterns ?? [],
    exportGuidance: raw.exportGuidance,
    performanceNotes: raw.performanceNotes,
    edgeCases: raw.edgeCases,
    sourceHash,
    enhancedAt: new Date().toISOString(),
  };
}

/**
 * Map a raw guide response into a {@link GuideEntry}.
 */
export function mapGuideEntry(spec: GuideSpec, raw: RawGuide): GuideEntry {
  const content = raw.content ?? '';
  return {
    id: spec.id,
    title: spec.title,
    category: spec.group,
    content,
    codeExamples: raw.codeExamples ?? [],
    referencedComponents: raw.referencedComponents ?? [],
    keyTakeaways: raw.keyTakeaways,
    pitfalls: raw.pitfalls,
    accessibilityNotes: raw.accessibilityNotes,
    sourceHash: hashString(content),
    enhancedAt: new Date().toISOString(),
  };
}

/**
 * Map a raw category-guidance response into a {@link CategoryGuidanceEntry}.
 *
 * @param spec - The category spec being generated (spec.id is the category)
 * @param raw - The parsed LLM response
 * @param componentIds - IDs of the components that belong to the category
 */
export function mapCategoryGuidance(
  spec: GuideSpec,
  raw: RawCategoryGuidance,
  componentIds: string[],
): CategoryGuidanceEntry {
  const overview = cleanText(raw.overview ?? '');
  return {
    id: spec.id,
    category: spec.id,
    overview,
    whenToUse: cleanText(raw.whenToUse ?? ''),
    bestPractices: {
      dos: cleanTextArray(raw.bestPractices?.dos ?? []),
      donts: cleanTextArray(raw.bestPractices?.donts ?? []),
    },
    accessibility: cleanText(raw.accessibility ?? ''),
    antiPatterns: (raw.antiPatterns ?? []).map((entry) => ({
      title: cleanText(entry.title),
      problem: cleanText(entry.problem),
      solution: cleanText(entry.solution),
    })),
    componentIds,
    sourceHash: hashString(overview),
    enhancedAt: new Date().toISOString(),
  };
}

/**
 * Map a raw recipe response into a {@link RecipeEntry}.
 *
 * @param spec - The recipe spec being generated
 * @param raw - The parsed LLM response
 */
export function mapRecipeEntry(spec: GuideSpec, raw: RawRecipe): RecipeEntry {
  const content = raw.content ?? '';
  return {
    id: spec.id,
    title: spec.title,
    group: spec.group,
    goal: raw.goal ?? '',
    whenToUse: raw.whenToUse ?? '',
    whenNotToUse: raw.whenNotToUse ?? '',
    content,
    examples: (raw.examples ?? []).map((example) => ({
      name: example.name,
      description: example.description,
      code: example.code,
      language: example.language,
    })),
    referencedComponents: raw.referencedComponents ?? [],
    accessibilityNotes: raw.accessibilityNotes ?? '',
    pitfalls: raw.pitfalls ?? [],
    sourceHash: hashString(content),
    enhancedAt: new Date().toISOString(),
  };
}


// ============================================================================
// Prose Sanitization
// ============================================================================

/**
 * Remove fenced code blocks and stray fences from a piece of prose.
 *
 * The enhancer is prose-only by contract; code examples come from the scraped
 * stories. This is a defensive backstop in case a model emits a fenced block
 * anyway, so the persisted prose never contains code.
 *
 * @param text - The text to sanitize
 * @returns The text with fenced code removed and surrounding whitespace trimmed
 */
function stripFencedCodeBlocks(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/```/g, '')
    .trim();
}

/**
 * Sanitize a required prose string.
 *
 * @param text - The text to sanitize
 * @returns The sanitized text
 */
function cleanText(text: string): string {
  return stripFencedCodeBlocks(text);
}

/**
 * Sanitize an optional prose string, preserving `undefined`.
 *
 * @param text - The text to sanitize, or undefined
 * @returns The sanitized text, or undefined when input was undefined
 */
function cleanOptionalText(text: string | undefined): string | undefined {
  return text === undefined ? undefined : stripFencedCodeBlocks(text);
}

/**
 * Sanitize an array of prose strings.
 *
 * @param values - The strings to sanitize
 * @returns A new array with fenced code removed from each entry
 */
function cleanTextArray(values: string[]): string[] {
  return values.map(stripFencedCodeBlocks);
}

// ============================================================================
// Internal Utilities
// ============================================================================

/**
 * Record guide/category/recipe generation failures on the run statistics.
 *
 * Kept separate from {@link EnhancementRunStats.failures} increments in Pass 1
 * so both passes report through one place and `failures` always equals the
 * number of entries in `failureDetails`.
 *
 * @param stats - The run statistics accumulator
 * @param failures - Failure messages from a generation batch
 */
function recordBatchFailures(
  stats: EnhancementRunStats,
  failures: string[],
): void {
  if (failures.length === 0) return;
  stats.failures += failures.length;
  stats.failureDetails.push(...failures);
}

/** Build batch options from the enhancer config. */
function batchOptions(config: EnhancerConfig): {
  concurrency: number;
  maxRetries: number;
  baseDelayMs: number;
} {
  return {
    concurrency: config.concurrency,
    maxRetries: config.maxRetries,
    baseDelayMs: config.baseDelayMs,
  };
}

/** Build a component ID → entry map from a (possibly null) schema. */
function buildComponentMap(
  schema: FluentUISchema | null,
): Map<string, ComponentEntry> {
  if (!schema) return new Map();
  return new Map(schema.components.map((c) => [c.id, c]));
}

/** Build a utility ID → entry map from a (possibly null) schema. */
function buildUtilityMap(
  schema: FluentUISchema | null,
): Map<string, UtilityEntry> {
  if (!schema) return new Map();
  return new Map(schema.utilities.map((u) => [u.id, u]));
}

/**
 * Build a hash index from a previous enhanced schema using its raw structure.
 *
 * Used by the diff engine to detect unchanged entries. Returns null when
 * there is no previous schema.
 */
function buildPreviousHashIndex(
  schema: FluentUISchema | null,
): Record<string, string> | null {
  if (!schema) return null;
  const index: Record<string, string> = {};
  for (const c of schema.components) {
    index[c.id] = computeComponentHash(c);
  }
  for (const u of schema.utilities) {
    index[u.id] = computeUtilityHash(u);
  }
  return index;
}

/** Compute a short stable hash of a string (for guide source hashing). */
function hashString(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}
