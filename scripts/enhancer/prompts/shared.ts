/**
 * Shared helpers for guide-generation prompts.
 *
 * Provides FULL serialization of the component inventory used to ground
 * guide/pattern prompts so generated code references only real component
 * names, import paths, props, slots, and relationships.
 *
 * "Smart-maximal" grounding (PF-008): the full inventory is emitted when it
 * fits a configurable input budget; otherwise the components a guide actually
 * targets stay full-fidelity while the non-targeted periphery degrades to
 * compact one-line summaries — quality where it counts, no silent input
 * truncation.
 *
 * @module enhancer/prompts/shared
 */

import type { ComponentEntry } from '../../../src/types/schema.js';
import type { ComponentSummary } from '../types.js';

/**
 * Shared GROUNDING SELF-CHECK block appended to every system prompt.
 *
 * This is the safe, legitimate form of a "review before returning" instruction:
 * the model silently drops any reference not present in the provided data so it
 * cannot hallucinate APIs, props, or import paths (AR-2). It also restates the
 * non-negotiable strict-JSON contract the parser depends on.
 */
export const GROUNDING_SELF_CHECK = `GROUNDING SELF-CHECK (perform silently before returning):
- Verify every component, prop, slot, hook, and import you reference appears in
  the provided data.
- Remove anything not present — never invent APIs, props, or import paths.
- Ensure all code examples would compile against the real API surface.
Return ONLY the final valid JSON object. No prose, no markdown fences.`;


/**
 * Rough token estimate (~4 chars/token). Good enough for input budgeting;
 * not a substitute for a real tokenizer, just a guard against context overflow.
 *
 * @param text - The text to estimate
 * @returns Estimated token count
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Safe input budget reserved for grounding (leaves room for instructions +
 * output). Tunable per model context window.
 */
export const GROUNDING_INPUT_BUDGET_TOKENS = 60_000;

/**
 * Build a full {@link ComponentSummary} from a component entry.
 *
 * No truncation — every prop (with type), every slot, related components, and
 * additional exports are carried so prompts can be grounded in the complete API.
 *
 * @param component - The raw component entry
 * @returns A full summary for prompt grounding
 */
export function toComponentSummary(
  component: ComponentEntry,
): ComponentSummary {
  return {
    name: component.name,
    category: component.category,
    importStatement: component.importStatement,
    props: component.props.map((p) => ({
      name: p.name,
      type: p.type,
      required: p.required,
    })),
    slots: component.slots.map((s) => ({
      name: s.name,
      elementType: s.elementType,
    })),
    relatedComponents: component.relatedComponents,
    additionalExports: component.additionalExports,
  };
}

/**
 * Build component summaries for an array of components.
 *
 * @param components - The raw component entries
 * @returns An array of full summaries
 */
export function buildComponentSummaries(
  components: ComponentEntry[],
): ComponentSummary[] {
  return components.map(toComponentSummary);
}

/**
 * Resolve full component entries from a list of target component ids.
 *
 * Unknown ids are skipped (the caller may log a verbose warning). Order
 * follows the requested `ids`.
 *
 * @param components - The full component inventory
 * @param ids - The target component ids to resolve
 * @returns The resolved component entries (unknown ids omitted)
 */
export function resolveTargetComponents(
  components: ComponentEntry[],
  ids: string[] | undefined,
): ComponentEntry[] {
  if (!ids || ids.length === 0) return [];
  const byId = new Map(components.map((c) => [c.id, c]));
  const resolved: ComponentEntry[] = [];
  for (const id of ids) {
    const match = byId.get(id);
    if (match) resolved.push(match);
  }
  return resolved;
}

/**
 * Serialize a single summary at FULL fidelity (multiline).
 *
 * Emits the import statement, the full prop table (`name: type (required)`),
 * the slot list, related components, and additional exports — no truncation.
 *
 * @param s - The component summary
 * @returns A multiline grounding block for one component
 */
function serializeFullSummary(s: ComponentSummary): string {
  const lines: string[] = [`### ${s.name} (${s.category})`, s.importStatement];

  if (s.props.length > 0) {
    lines.push('props:');
    for (const p of s.props) {
      lines.push(`  - ${p.name}: ${p.type}${p.required ? ' (required)' : ''}`);
    }
  } else {
    lines.push('props: (none)');
  }

  if (s.slots.length > 0) {
    lines.push('slots:');
    for (const slot of s.slots) {
      lines.push(`  - ${slot.name}: ${slot.elementType}`);
    }
  } else {
    lines.push('slots: (none)');
  }

  if (s.relatedComponents.length > 0) {
    lines.push(`related: ${s.relatedComponents.join(', ')}`);
  }
  if (s.additionalExports.length > 0) {
    lines.push(`additionalExports: ${s.additionalExports.join(', ')}`);
  }

  return lines.join('\n');
}

/**
 * Serialize a single summary as a COMPACT one-line entry.
 *
 * Used for non-targeted components when the full inventory would exceed the
 * input budget: `- Name (category): importStatement [props: a, b, c]`.
 *
 * @param s - The component summary
 * @returns A compact one-line grounding entry
 */
function serializeCompactSummary(s: ComponentSummary): string {
  const propNames = s.props.map((p) => p.name);
  return (
    `- ${s.name} (${s.category}): ${s.importStatement}` +
    (propNames.length > 0 ? ` [props: ${propNames.join(', ')}]` : '')
  );
}

/**
 * Serialize component summaries into a full, structured text block.
 *
 * Every component is emitted at full fidelity. Prefer
 * {@link serializeComponentSummariesBudgeted} when the inventory may be large.
 *
 * @param summaries - The component summaries to serialize
 * @returns A newline-delimited string of full summaries
 */
export function serializeComponentSummaries(
  summaries: ComponentSummary[],
): string {
  return summaries.map(serializeFullSummary).join('\n\n');
}

/**
 * Options controlling the budgeted inventory serialization (PF-008).
 */
export interface BudgetedSerializeOptions {
  /** Names of components that must remain at full fidelity (the guide targets). */
  targetNames?: string[];

  /** Input token budget for the whole inventory block. */
  budgetTokens?: number;

  /** Optional verbose logger. */
  log?: (msg: string) => void;
}

/**
 * Serialize the inventory with a smart-maximal input-budget guard (PF-008).
 *
 * Strategy:
 *   1. Targeted components are ALWAYS serialized at full fidelity.
 *   2. If the full inventory fits `budgetTokens`, every component is full.
 *   3. Otherwise non-targeted components degrade to compact one-line entries
 *      (targeted ones stay full), preserving breadth without overflow.
 *
 * @param summaries - The component summaries to serialize
 * @param options - Budget, target names, and optional logger
 * @returns A grounding block respecting the input budget
 */
export function serializeComponentSummariesBudgeted(
  summaries: ComponentSummary[],
  options: BudgetedSerializeOptions = {},
): string {
  const budget = options.budgetTokens ?? GROUNDING_INPUT_BUDGET_TOKENS;
  const targetNames = new Set(options.targetNames ?? []);

  const full = serializeComponentSummaries(summaries);
  if (estimateTokens(full) <= budget) {
    options.log?.(
      `[grounding] full inventory used (${estimateTokens(full)} est. tokens ≤ ${budget})`,
    );
    return full;
  }

  // Over budget → degrade non-targeted components to compact lines.
  const blocks = summaries.map((s) =>
    targetNames.has(s.name)
      ? serializeFullSummary(s)
      : serializeCompactSummary(s),
  );
  const text = blocks.join('\n');
  options.log?.(
    `[grounding] compact inventory used for non-targeted components ` +
      `(full ${estimateTokens(full)} est. tokens > ${budget}); ` +
      `${targetNames.size} targeted component(s) kept full-fidelity`,
  );
  return text;
}
