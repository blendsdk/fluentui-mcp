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
  PatternEntry,
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
  buildPatternGuideMessages,
  buildEnterpriseGuideMessages,
  buildQuickReferenceMessages,
  buildComponentSummaries,
  resolveTargetComponents,
} from './prompts/index.js';

import type { ComponentSummary, GuideSpec } from './types.js';
import {
  FOUNDATION_GUIDES,
  PATTERN_GUIDES,
  ENTERPRISE_GUIDES,
  QUICK_REFERENCE_GUIDES,
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
  commonPatterns?: { name: string; description: string; code: string }[];
  stylingTips?: string;
  migrationNotes?: string;
  propGuidance?: { prop: string; guidance: string; example?: string }[];
  antiPatterns?: {
    title: string;
    problem: string;
    solution: string;
    code?: string;
  }[];
  performanceNotes?: string;
  themingNotes?: string;
  compositionExamples?: { name: string; description: string; code: string }[];
  relatedPatterns?: string[];
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

/** Raw JSON shape returned by the pattern-guide prompt. */
interface RawPattern {
  content?: string;
  examples?: {
    name: string;
    description: string;
    code: string;
    components: string[];
  }[];
  referencedComponents?: string[];
  whenToUse?: string;
  whenNotToUse?: string;
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
  patternsGenerated: number;
  failures: number;
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
    patternsGenerated: 0,
    failures: 0,
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
  // Pass 2: Guides
  // --------------------------------------------------------------------------
  let foundation = previousSchema?.foundation ?? [];
  let patterns = previousSchema?.patterns ?? [];
  let enterprise = previousSchema?.enterprise ?? [];
  let quickReference = previousSchema?.quickReference ?? [];

  if (config.generateGuides) {
    log('Pass 2: generating guides');

    foundation = await generateGuides(
      FOUNDATION_GUIDES,
      provider,
      config,
      rawSchema.components,
      summaries,
      buildFoundationGuideMessages,
      log,
      'foundation',
    );
    enterprise = await generateGuides(
      ENTERPRISE_GUIDES,
      provider,
      config,
      rawSchema.components,
      summaries,
      buildEnterpriseGuideMessages,
      log,
      'enterprise',
    );
    quickReference = await generateGuides(
      QUICK_REFERENCE_GUIDES,
      provider,
      config,
      rawSchema.components,
      summaries,
      buildQuickReferenceMessages,
      log,
      'quick-ref',
    );
    patterns = await generatePatterns(
      PATTERN_GUIDES,
      provider,
      config,
      rawSchema.components,
      summaries,
      log,
    );



    stats.guidesGenerated =
      foundation.length + enterprise.length + quickReference.length;
    stats.patternsGenerated = patterns.length;
  }

  const schema: FluentUISchema = {
    ...rawSchema,
    components: enhancedComponents,
    utilities: enhancedUtilities,
    foundation,
    patterns,
    enterprise,
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
): Promise<GuideEntry[]> {
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

  return results.items
    .filter((item) => item.ok && item.result)
    .map((item) => item.result as GuideEntry);
}



/**
 * Generate PatternEntry items for the pattern catalog.
 *
 * Resolves each spec's `targetComponentIds` to full component data and routes
 * LLM calls through {@link chatComplete} so large patterns are never truncated.
 */
async function generatePatterns(
  specs: GuideSpec[],
  provider: LLMProvider,
  config: EnhancerConfig,
  components: ComponentEntry[],
  summaries: ComponentSummary[],
  log?: (msg: string) => void,
): Promise<PatternEntry[]> {
  const allComponentNames = summaries.map((s) => s.name);
  const total = specs.length;

  let started = 0;
  const results = await runBatch(
    specs.map((spec) => async () => {
      const n = (started += 1);
      log?.(`  [${n}/${total}] pattern → ${spec.title}`);
      const messages = buildPatternGuideMessages({
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
      const raw = parseJsonResponse<RawPattern>(response.content);
      return mapPatternEntry(spec, raw);
    }),

    {
      ...batchOptions(config),
      onProgress: (completed, t) =>
        log?.(`  ✓ pattern ${completed}/${t} done`),
    },
  );

  return results.items
    .filter((item) => item.ok && item.result)
    .map((item) => item.result as PatternEntry);
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
    description: raw.description ?? '',
    whenToUse: raw.whenToUse ?? '',
    bestPractices: {
      dos: raw.bestPractices?.dos ?? [],
      donts: raw.bestPractices?.donts ?? [],
    },
    accessibility: {
      requirements: raw.accessibility?.requirements ?? '',
      keyboardSupport: raw.accessibility?.keyboardSupport ?? [],
      ariaAttributes: raw.accessibility?.ariaAttributes ?? [],
      screenReaderBehavior: raw.accessibility?.screenReaderBehavior ?? '',
    },
    commonPatterns: raw.commonPatterns ?? [],
    stylingTips: raw.stylingTips ?? '',
    migrationNotes: raw.migrationNotes,
    propGuidance: raw.propGuidance,
    antiPatterns: raw.antiPatterns,
    performanceNotes: raw.performanceNotes,
    themingNotes: raw.themingNotes,
    compositionExamples: raw.compositionExamples,
    relatedPatterns: raw.relatedPatterns,
    edgeCases: raw.edgeCases,
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
 * Map a raw pattern response into a {@link PatternEntry}.
 */
export function mapPatternEntry(spec: GuideSpec, raw: RawPattern): PatternEntry {
  const content = raw.content ?? '';
  return {
    id: spec.id,
    title: spec.title,
    group: spec.group,
    content,
    examples: raw.examples ?? [],
    referencedComponents: raw.referencedComponents ?? [],
    whenToUse: raw.whenToUse,
    whenNotToUse: raw.whenNotToUse,
    accessibilityNotes: raw.accessibilityNotes,
    pitfalls: raw.pitfalls,
    sourceHash: hashString(content),
    enhancedAt: new Date().toISOString(),
  };
}


// ============================================================================
// Internal Utilities
// ============================================================================

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
