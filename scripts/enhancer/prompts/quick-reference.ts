/**
 * Prompt for quick-reference guide generation (Pass 2).
 *
 * Quick-reference guides are concise cheatsheets and checklists (setup &
 * imports, component cheatsheet, styling tokens, common patterns,
 * accessibility checklist). They favor scannable tables and short snippets.
 *
 * @module enhancer/prompts/quick-reference
 */

import type { GuideGenerationContext } from '../types.js';
import type { LLMMessage } from '../llm/provider.js';
import { serializeComponentSummaries, GROUNDING_SELF_CHECK } from './shared.js';

/**
 * System prompt for quick-reference generation.
 *
 * Scannable but COMPLETE: tables and all relevant snippets, plus the new schema
 * fields (keyTakeaways, pitfalls).
 */
export const QUICK_REFERENCE_SYSTEM_PROMPT = `You are a FluentUI v9 documentation expert.
Generate a quick-reference cheatsheet for the requested topic that is scannable
but COMPLETE — include tables and every relevant snippet. Favor density over
omission; do not leave out relevant APIs.

You MUST return ONLY valid JSON (no markdown fences) matching this structure:
{
  "content": "Scannable but complete markdown cheatsheet (tables, snippets)",
  "codeExamples": [
    {
      "title": "Example title",
      "description": "What this snippet shows",
      "code": "// Short, copy-pasteable TSX/CSS snippet",
      "language": "tsx"
    }
  ],
  "referencedComponents": ["Button", "Input"],
  "keyTakeaways": ["The most important things to remember"],
  "pitfalls": ["Common mistakes and how to avoid them"]
}

Content quotas (minimums — produce MORE when warranted):
- codeExamples: at least 4 short, copy-pasteable snippets.
- keyTakeaways: at least 3; pitfalls: at least 3.

Rules:
- Use REAL FluentUI component names and import paths from the provided inventory.
- Prefer scannable tables and short, copy-pasteable snippets over prose.
- Do NOT reference components that are not in the inventory.
- Keep it scannable, but do not sacrifice completeness for brevity.

${GROUNDING_SELF_CHECK}`;


/**
 * Build the message array for generating a quick-reference guide.
 *
 * @param context - Guide generation context
 * @returns Messages ready to pass to {@link LLMProvider.chat}
 */
export function buildQuickReferenceMessages(
  context: GuideGenerationContext,
): LLMMessage[] {
  const userContent = [
    `Version: ${context.version}`,
    `Reference ID: ${context.spec.id}`,
    `Reference title: ${context.spec.title}`,
    '',
    'Available components (use only these):',
    serializeComponentSummaries(context.componentSummaries),
  ].join('\n');

  return [
    { role: 'system', content: QUICK_REFERENCE_SYSTEM_PROMPT },
    { role: 'user', content: userContent },
  ];
}
