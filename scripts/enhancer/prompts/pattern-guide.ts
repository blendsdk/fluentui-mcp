/**
 * Prompt for pattern guide generation (Pass 2).
 *
 * Pattern guides show how to compose multiple FluentUI components for
 * real-world use cases (login forms, sidebar navigation, dashboard
 * layouts). Each pattern includes complete working examples that
 * reference real component APIs from the inventory.
 *
 * @module enhancer/prompts/pattern-guide
 */

import type { GuideGenerationContext } from '../types.js';
import type { LLMMessage } from '../llm/provider.js';
import { serializeComponentSummaries } from './shared.js';

/**
 * System prompt for pattern guide generation.
 */
export const PATTERN_GUIDE_SYSTEM_PROMPT = `You are a FluentUI v9 patterns expert.
Generate a comprehensive pattern guide that composes FluentUI components for a
real-world use case.

You MUST return ONLY valid JSON (no markdown fences) matching this structure:
{
  "content": "Full pattern explanation in markdown",
  "examples": [
    {
      "name": "Example name",
      "description": "What this example demonstrates",
      "code": "// Complete working TSX",
      "components": ["Input", "Button", "Field"]
    }
  ],
  "referencedComponents": ["Input", "Button", "Field"]
}

Rules:
- ONLY use components and props that exist in the provided inventory.
- ONLY use import paths documented in the inventory.
- Examples must be complete and ready to use, not pseudocode.
- The "components" array on each example must list the real components used.
- Include TypeScript types where appropriate.`;

/**
 * Build the message array for generating a pattern guide.
 *
 * @param context - Guide generation context (spec.group is the pattern group)
 * @returns Messages ready to pass to {@link LLMProvider.chat}
 */
export function buildPatternGuideMessages(
  context: GuideGenerationContext,
): LLMMessage[] {
  const userContent = [
    `Version: ${context.version}`,
    `Pattern ID: ${context.spec.id}`,
    `Pattern title: ${context.spec.title}`,
    `Pattern group: ${context.spec.group}`,
    '',
    'Available components (use only these):',
    serializeComponentSummaries(context.componentSummaries),
  ].join('\n');

  return [
    { role: 'system', content: PATTERN_GUIDE_SYSTEM_PROMPT },
    { role: 'user', content: userContent },
  ];
}
