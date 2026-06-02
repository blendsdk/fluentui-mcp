/**
 * Prompt for utility package enhancement (Pass 1).
 *
 * Utility packages (react-positioning, react-aria, etc.) export hooks and
 * functions rather than components, so the enhancement is simpler than for
 * components: a rich description, usage guidance, and common patterns.
 *
 * @module enhancer/prompts/utility-enhance
 */

import type { UtilityEntry } from '../../../src/types/schema.js';
import type { EnhancementContext } from '../types.js';
import type { LLMMessage } from '../llm/provider.js';

/**
 * System prompt instructing the model to document a utility package as JSON.
 * The required shape mirrors {@link UtilityEnhanced}.
 */
export const UTILITY_ENHANCE_SYSTEM_PROMPT = `You are a FluentUI React (v9) utilities documentation expert.
Given a utility package's exported hooks/functions/types, generate documentation.

You MUST return ONLY valid JSON (no markdown fences) matching this exact structure:
{
  "description": "2-3 sentence description of what this utility package provides",
  "whenToUse": "When and why to reach for this utility",
  "commonPatterns": [
    {
      "name": "Pattern name",
      "description": "What this pattern demonstrates",
      "code": "// TypeScript code example using the real exports"
    }
  ]
}

Rules:
- Use ONLY the exports provided — do NOT invent functions or hooks.
- Code examples MUST use the correct import path and export names from the data.
- Keep the description concise and focused on practical usage.`;

/**
 * Serialize a utility's export surface for the prompt.
 *
 * @param utility - The raw utility entry
 * @returns A pretty-printed JSON string describing the utility
 */
export function serializeUtilityForPrompt(utility: UtilityEntry): string {
  return JSON.stringify(
    {
      name: utility.name,
      importPath: utility.importPath,
      exports: utility.exports.map((e) => ({
        name: e.name,
        kind: e.kind,
        description: e.description,
        returnType: e.returnType,
      })),
    },
    null,
    2,
  );
}

/**
 * Build the full message array for enhancing a single utility.
 *
 * @param context - Enhancement context (must include `utility`)
 * @returns Messages ready to pass to {@link LLMProvider.chat}
 * @throws {Error} When the context has no utility
 */
export function buildUtilityEnhanceMessages(
  context: EnhancementContext,
): LLMMessage[] {
  if (!context.utility) {
    throw new Error('buildUtilityEnhanceMessages requires context.utility');
  }

  const userContent = [
    `Version: ${context.version}`,
    '',
    'Utility data:',
    serializeUtilityForPrompt(context.utility),
  ].join('\n');

  return [
    { role: 'system', content: UTILITY_ENHANCE_SYSTEM_PROMPT },
    { role: 'user', content: userContent },
  ];
}
