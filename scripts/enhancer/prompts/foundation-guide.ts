/**
 * Prompt for foundation guide generation (Pass 2).
 *
 * Foundation guides cover core FluentUI v9 concepts (getting started,
 * FluentProvider, theming, Griffel styling, component architecture,
 * accessibility). The LLM receives the component inventory so examples
 * reference only real component APIs.
 *
 * @module enhancer/prompts/foundation-guide
 */

import type { GuideGenerationContext } from '../types.js';
import type { LLMMessage } from '../llm/provider.js';
import { serializeComponentSummaries, GROUNDING_SELF_CHECK } from './shared.js';

/**
 * System prompt for foundation guide generation.
 *
 * Maximum-richness: high example quota, thorough multi-section content, and the
 * new schema fields (keyTakeaways, pitfalls, accessibilityNotes).
 */
export const FOUNDATION_GUIDE_SYSTEM_PROMPT = `You are a FluentUI v9 documentation expert.
Generate the most comprehensive foundation guide possible for the requested
topic. Prioritize depth, accuracy, and completeness over brevity.

You MUST return ONLY valid JSON (no markdown fences) matching this structure:
{
  "content": "Full, thorough multi-section guide content in markdown with headings",
  "codeExamples": [
    {
      "title": "Example title",
      "description": "What this example demonstrates",
      "code": "// Complete, runnable TSX/CSS code",
      "language": "tsx"
    }
  ],
  "referencedComponents": ["Button", "FluentProvider"],
  "keyTakeaways": ["The most important things to remember"],
  "pitfalls": ["Common mistakes and how to avoid them"],
  "accessibilityNotes": "Accessibility considerations relevant to this topic"
}

Content quotas (minimums — produce MORE when warranted):
- codeExamples: at least 4, complete and runnable (not pseudocode).
- content: thorough, multi-section markdown with headings.
- keyTakeaways: at least 3; pitfalls: at least 3.

Rules:
- Use REAL FluentUI component names and import paths from the provided inventory.
- Do NOT reference components that are not in the inventory.
- The guide content should be clear, well-structured markdown with headings.

${GROUNDING_SELF_CHECK}`;


/**
 * Build the message array for generating a foundation guide.
 *
 * @param context - Guide generation context
 * @returns Messages ready to pass to {@link LLMProvider.chat}
 */
export function buildFoundationGuideMessages(
  context: GuideGenerationContext,
): LLMMessage[] {
  const userContent = [
    `Version: ${context.version}`,
    `Guide ID: ${context.spec.id}`,
    `Guide title: ${context.spec.title}`,
    '',
    'Available components (use only these):',
    serializeComponentSummaries(context.componentSummaries),
  ].join('\n');

  return [
    { role: 'system', content: FOUNDATION_GUIDE_SYSTEM_PROMPT },
    { role: 'user', content: userContent },
  ];
}
