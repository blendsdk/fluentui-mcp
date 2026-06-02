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
import { serializeComponentSummaries } from './shared.js';

/**
 * System prompt for enterprise guide generation.
 */
export const ENTERPRISE_GUIDE_SYSTEM_PROMPT = `You are a FluentUI v9 enterprise architecture expert.
Generate a comprehensive enterprise guide for building production-grade
application features with FluentUI.

You MUST return ONLY valid JSON (no markdown fences) matching this structure:
{
  "content": "Full guide content in markdown",
  "codeExamples": [
    {
      "title": "Example title",
      "description": "What this example demonstrates",
      "code": "// Working TSX",
      "language": "tsx"
    }
  ],
  "referencedComponents": ["Card", "DataGrid", "Toolbar"]
}

Rules:
- Use REAL FluentUI component names and import paths from the provided inventory.
- Do NOT reference components that are not in the inventory.
- Focus on production concerns: composition, performance, accessibility, scale.
- Code examples must be complete and runnable, not pseudocode.`;

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
