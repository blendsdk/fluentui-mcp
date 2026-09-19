/**
 * Prompt for component enhancement (Pass 1).
 *
 * Produces rich, grounded documentation content for a single component
 * from its raw scraped data (props, slots, stories). The system prompt
 * constrains the LLM to only reference props/slots that actually exist,
 * and the user message serializes the component's API surface.
 *
 * @module enhancer/prompts/component-enhance
 */

import type { ComponentEntry } from '../../../src/types/schema.js';
import type { EnhancementContext } from '../types.js';
import type { LLMMessage } from '../llm/provider.js';
import { GROUNDING_SELF_CHECK } from './shared.js';

/**
 * System prompt instructing the model to generate component documentation
 * as strict JSON. The required shape mirrors {@link ComponentEnhanced}.
 *
 * The model produces PROSE ONLY. Code examples come from the deterministically
 * scraped stories, so the prompt forbids fenced code blocks and code-bearing
 * fields entirely. This keeps the hallucination surface small and the cost low.
 */
export const COMPONENT_ENHANCE_SYSTEM_PROMPT = `You are a FluentUI React (v9) component documentation expert.
Given the raw component data (props, slots, Storybook examples, related
components, and additional exports), write grounded PROSE documentation.
Prioritize accuracy and completeness over brevity.

You MUST return ONLY valid JSON (no markdown fences) matching this exact structure:
{
  "description": "Rich, multi-sentence description of the component and its role",
  "whenToUse": "When and why to use this component vs alternatives",
  "bestPractices": {
    "dos": ["Do this", "Do that"],
    "donts": ["Don't do this", "Don't do that"]
  },
  "accessibility": {
    "requirements": "WCAG and accessibility requirements",
    "keyboardSupport": [{"key": "Enter", "action": "Activates the button"}],
    "ariaAttributes": ["aria-label", "aria-disabled"],
    "screenReaderBehavior": "How screen readers interact with this component"
  },
  "stylingTips": "Common styling customizations and real Griffel tokens to use",
  "migrationNotes": "Differences from previous version (optional, omit if N/A)",
  "propGuidance": [
    {"prop": "appearance", "guidance": "How and when to use this prop", "example": "primary"}
  ],
  "antiPatterns": [
    {"title": "Anti-pattern name", "problem": "Why it is wrong", "solution": "What to do instead"}
  ],
  "performanceNotes": "Rendering and performance considerations specific to this component",
  "themingNotes": "How this component responds to theme tokens (name real tokens.*)",
  "relatedRecipes": ["recipe-id this component participates in"],
  "edgeCases": ["Edge case or gotcha to be aware of"]
}

Content quotas (minimums — produce MORE when the API surface warrants):
- bestPractices.dos: at least 5; bestPractices.donts: at least 5.
- antiPatterns: at least 3, each with problem + solution.
- propGuidance: cover every non-trivial prop in the data.
- accessibility.keyboardSupport: cover every interactive key.
- stylingTips and themingNotes: name real Griffel tokens (tokens.*).
- edgeCases: at least 3 where applicable.

Rules:
- This is PROSE ONLY. Never output code, code snippets, JSX, or fenced code
  blocks (\`\`\`). Use parameter names such as "appearance" as plain text.
- Use ONLY the props and slots provided in the data — do NOT invent props that don't exist.
- Best practices should be specific to this component, not generic React advice.
- Accessibility guidance should reference the actual ARIA attributes relevant to the component.

${GROUNDING_SELF_CHECK}`;


/**
 * Build a full, deterministic serialization of a component's API surface.
 *
 * Maximum-grounding: every prop (with type/default/description), every slot,
 * every story at full source `code` (imports + styles + render), plus the
 * component's compositions (`relatedComponents`, `additionalExports`). No
 * truncation — the model is fed everything it needs to generate rich,
 * grounded documentation.
 *
 * @param component - The raw component entry
 * @returns A pretty-printed JSON string describing the component
 */
export function serializeComponentForPrompt(component: ComponentEntry): string {
  return JSON.stringify(
    {
      name: component.name,
      category: component.category,
      importStatement: component.importStatement,
      deprecated: component.deprecated,
      props: component.props.map((p) => ({
        name: p.name,
        type: p.type,
        required: p.required,
        defaultValue: p.defaultValue,
        description: p.description,
        deprecated: p.deprecated,
      })),
      slots: component.slots.map((s) => ({
        name: s.name,
        elementType: s.elementType,
        required: s.required,
        description: s.description,
      })),
      stories: component.stories.map((s) => ({
        name: s.name,
        description: s.description,
        imports: s.imports,
        code: s.code,
        renderCode: s.renderCode,
      })),
      relatedComponents: component.relatedComponents,
      additionalExports: component.additionalExports,
    },
    null,
    2,
  );
}


/**
 * Build the full message array for enhancing a single component.
 *
 * @param context - Enhancement context (must include `component`)
 * @returns Messages ready to pass to {@link LLMProvider.chat}
 * @throws {Error} When the context has no component
 */
export function buildComponentEnhanceMessages(
  context: EnhancementContext,
): LLMMessage[] {
  if (!context.component) {
    throw new Error(
      'buildComponentEnhanceMessages requires context.component',
    );
  }

  const userContent = [
    `Version: ${context.version}`,
    `Available components: ${context.allComponentNames.join(', ')}`,
    '',
    'Component data:',
    serializeComponentForPrompt(context.component),
  ].join('\n');

  return [
    { role: 'system', content: COMPONENT_ENHANCE_SYSTEM_PROMPT },
    { role: 'user', content: userContent },
  ];
}
