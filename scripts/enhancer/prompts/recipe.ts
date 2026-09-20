/**
 * Prompt for task-recipe generation (Pass 2).
 *
 * Recipes are goal-oriented walkthroughs that compose multiple components to
 * accomplish a concrete job (for example a login form, a data table, or a
 * dashboard shell). Unlike component enhancement, recipes may include complete
 * working code examples so a reader can copy a composition and adapt it.
 *
 * @module enhancer/prompts/recipe
 */

import type { GuideGenerationContext } from '../types.js';
import type { LLMMessage } from '../llm/provider.js';
import { serializeComponentSummaries, GROUNDING_SELF_CHECK } from './shared.js';

/**
 * System prompt for recipe generation.
 *
 * The shape matches {@link RecipeEntry} (minus the fields the orchestrator
 * derives, such as `id`, `title`, `group`, and hashes).
 */
export const RECIPE_SYSTEM_PROMPT = `You are a FluentUI React (v9) application engineer.
Write a complete, goal-oriented recipe that composes FluentUI components to
achieve the requested outcome. A reader should be able to follow the recipe and
produce a working feature.

You MUST return ONLY valid JSON (no markdown fences) matching this structure:
{
  "goal": "The concrete outcome the recipe achieves",
  "whenToUse": "When this recipe is the right choice",
  "whenNotToUse": "When to avoid it and what to use instead",
  "content": "Full recipe explanation in markdown with headings",
  "examples": [
    {
      "name": "Example name",
      "description": "What this example demonstrates",
      "code": "// Complete working TSX",
      "language": "tsx"
    }
  ],
  "referencedComponents": ["Input", "Button", "Field"],
  "accessibilityNotes": "Accessibility considerations for the composed recipe",
  "pitfalls": ["Common mistakes and how to avoid them"]
}

Content quotas (minimums — produce MORE when warranted):
- examples: at least 2 complete, runnable compositions.
- referencedComponents: list every component actually used.
- pitfalls: at least 3 where applicable.

Rules:
- ONLY use components, props, and import paths that exist in the provided inventory.
- Examples must be complete and ready to use, not pseudocode.
- The "referencedComponents" list must match the components used in the examples.
- Include TypeScript types where appropriate.

${GROUNDING_SELF_CHECK}`;

/**
 * Build the message array for generating a task recipe.
 *
 * @param context - Guide generation context (spec.group is the recipe group)
 * @returns Messages ready to pass to {@link LLMProvider.chat}
 */
export function buildRecipeMessages(
  context: GuideGenerationContext,
): LLMMessage[] {
  const userContent = [
    `Version: ${context.version}`,
    `Recipe ID: ${context.spec.id}`,
    `Recipe title: ${context.spec.title}`,
    `Recipe group: ${context.spec.group}`,
    '',
    'Available components (use only these):',
    serializeComponentSummaries(context.componentSummaries),
  ].join('\n');

  return [
    { role: 'system', content: RECIPE_SYSTEM_PROMPT },
    { role: 'user', content: userContent },
  ];
}
