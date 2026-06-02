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
import { serializeComponentSummaries } from './shared.js';

/**
 * System prompt for foundation guide generation.
 */
export const FOUNDATION_GUIDE_SYSTEM_PROMPT = `You are a FluentUI v9 documentation expert.
Generate a comprehensive foundation guide for the requested topic.

You MUST return ONLY valid JSON (no markdown fences) matching this structure:
{
  "content": "Full guide content in markdown",
  "codeExamples": [
    {
      "title": "Example title",
      "description": "What this example demonstrates",
      "code": "// Working TSX/CSS code",
      "language": "tsx"
    }
  ],
  "referencedComponents": ["Button", "FluentProvider"]
}

Rules:
- Use REAL FluentUI component names and import paths from the provided inventory.
- Do NOT reference components that are not in the inventory.
- Code examples must be complete and runnable, not pseudocode.
- The guide content should be clear, well-structured markdown with headings.`;

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
