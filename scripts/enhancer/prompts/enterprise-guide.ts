/**
 * Prompt for enterprise guide generation (Pass 2).
 *
 * Enterprise guides cover complex application patterns (app shell,
 * dashboards, admin CRUD, data tables, enterprise accessibility). They
 * compose many components into production-grade layouts grounded in the
 * real component inventory.
 *
 * @module enhancer/prompts/enterprise-guide
 */

import type { GuideGenerationContext } from '../types.js';
import type { LLMMessage } from '../llm/provider.js';
import { serializeComponentSummaries, GROUNDING_SELF_CHECK } from './shared.js';

/**
 * System prompt for enterprise guide generation.
 *
 * Maximum-richness: high production-grade example quota and the new schema
 * fields (keyTakeaways, pitfalls, accessibilityNotes).
 */
export const ENTERPRISE_GUIDE_SYSTEM_PROMPT = `You are a FluentUI v9 enterprise architecture expert.
Generate the most comprehensive enterprise guide possible for building
production-grade application features with FluentUI. Prioritize depth and
production-readiness over brevity.

You MUST return ONLY valid JSON (no markdown fences) matching this structure:
{
  "content": "Full, thorough guide content in markdown with headings",
  "codeExamples": [
    {
      "title": "Example title",
      "description": "What this example demonstrates",
      "code": "// Complete, production-grade TSX",
      "language": "tsx"
    }
  ],
  "referencedComponents": ["Card", "DataGrid", "Toolbar"],
  "keyTakeaways": ["The most important things to remember"],
  "pitfalls": ["Common mistakes and how to avoid them"],
  "accessibilityNotes": "Accessibility considerations at enterprise scale"
}

Content quotas (minimums — produce MORE when warranted):
- codeExamples: at least 4 production-grade (composition, performance, a11y, scale).
- keyTakeaways: at least 3; pitfalls: at least 3.

Rules:
- Use REAL FluentUI component names and import paths from the provided inventory.
- Do NOT reference components that are not in the inventory.
- Focus on production concerns: composition, performance, accessibility, scale.
- Code examples must be complete and runnable, not pseudocode.

${GROUNDING_SELF_CHECK}`;


/**
 * Build the message array for generating an enterprise guide.
 *
 * @param context - Guide generation context
 * @returns Messages ready to pass to {@link LLMProvider.chat}
 */
export function buildEnterpriseGuideMessages(
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
    { role: 'system', content: ENTERPRISE_GUIDE_SYSTEM_PROMPT },
    { role: 'user', content: userContent },
  ];
}
