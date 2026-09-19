/**
 * Prompt for category-guidance generation (Pass 2).
 *
 * One document is generated per schema category (buttons, forms, navigation,
 * data-display, feedback, overlays, layout, utilities). Category guidance
 * aggregates advice that applies across every component in the category and
 * lists the component ids that belong to it, so readers get one coherent
 * overview instead of repeated per-component guidance.
 *
 * The output is prose only: category anti-patterns describe the mistake and the
 * fix without code, matching the component enhancement contract.
 *
 * @module enhancer/prompts/category-guidance
 */

import type { GuideGenerationContext } from '../types.js';
import type { LLMMessage } from '../llm/provider.js';
import { serializeComponentSummaries, GROUNDING_SELF_CHECK } from './shared.js';

/**
 * System prompt for category-guidance generation.
 *
 * The shape matches {@link CategoryGuidanceEntry} (minus the fields the
 * orchestrator derives, such as `id`, `category`, `componentIds`, and hashes).
 */
export const CATEGORY_GUIDANCE_SYSTEM_PROMPT = `You are a FluentUI React (v9) design-system expert.
Write a grounded guidance document for one component category. The document
helps a developer decide which component in the category to use and how to use
it well. Prioritize accurate, category-wide advice over restating individual
component APIs.

You MUST return ONLY valid JSON (no markdown fences) matching this structure:
{
  "overview": "Multi-sentence overview of what this category is for",
  "whenToUse": "When and why to reach for components in this category",
  "bestPractices": {
    "dos": ["Do this", "Do that"],
    "donts": ["Don't do this", "Don't do that"]
  },
  "accessibility": "Accessibility guidance shared by every component in the category",
  "antiPatterns": [
    {"title": "Category-level mistake", "problem": "Why it is wrong", "solution": "What to do instead"}
  ]
}

Content quotas (minimums):
- bestPractices.dos: at least 4; bestPractices.donts: at least 4.
- antiPatterns: at least 3, each with problem + solution.

Rules:
- Base every statement on the components provided in the inventory.
- This is PROSE ONLY. Never output code, JSX, or fenced code blocks (\`\`\`).
- Do NOT invent components, props, or packages that are not in the inventory.
- Keep the guidance specific to this category, not generic design-system advice.

${GROUNDING_SELF_CHECK}`;

/**
 * Build the message array for generating one category's guidance.
 *
 * @param context - Guide generation context (spec.id is the category id)
 * @returns Messages ready to pass to {@link LLMProvider.chat}
 */
export function buildCategoryGuidanceMessages(
  context: GuideGenerationContext,
): LLMMessage[] {
  const userContent = [
    `Version: ${context.version}`,
    `Category: ${context.spec.id}`,
    `Category title: ${context.spec.title}`,
    '',
    'Components in this category (use only these):',
    serializeComponentSummaries(context.componentSummaries),
  ].join('\n');

  return [
    { role: 'system', content: CATEGORY_GUIDANCE_SYSTEM_PROMPT },
    { role: 'user', content: userContent },
  ];
}
