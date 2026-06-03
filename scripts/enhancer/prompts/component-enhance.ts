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
 * Maximum-richness: explicit high content quotas, story-anchored examples, and
 * the new schema fields (propGuidance, antiPatterns, performanceNotes,
 * themingNotes, compositionExamples, relatedPatterns, edgeCases). Quality and
 * completeness are the priority — never sacrifice grounding for brevity.
 */
export const COMPONENT_ENHANCE_SYSTEM_PROMPT = `You are a FluentUI React (v9) component documentation expert.
Given the raw component data (props, slots, Storybook examples, related
components, and additional exports), generate the richest possible grounded
documentation. Prioritize completeness and accuracy over brevity.

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
  "commonPatterns": [
    {
      "name": "Pattern name",
      "description": "When to use this pattern",
      "code": "// Complete runnable TSX with real imports"
    }
  ],
  "stylingTips": "Common styling customizations and real Griffel tokens to use",
  "migrationNotes": "Differences from previous version (optional, omit if N/A)",
  "propGuidance": [
    {"prop": "appearance", "guidance": "How/when to use this prop", "example": "<Button appearance=\\"primary\\" />"}
  ],
  "antiPatterns": [
    {"title": "Anti-pattern name", "problem": "Why it is wrong", "solution": "What to do instead", "code": "// optional corrected TSX"}
  ],
  "performanceNotes": "Rendering/perf considerations specific to this component",
  "themingNotes": "How this component responds to theme tokens (cite real tokens.*)",
  "compositionExamples": [
    {"name": "Composition name", "description": "Slot override demonstrated", "code": "// Complete TSX overriding slots"}
  ],
  "relatedPatterns": ["pattern-id-or-name"],
  "edgeCases": ["Edge case or gotcha to be aware of"]
}

Content quotas (minimums — produce MORE when the API surface warrants):
- bestPractices.dos: at least 5; bestPractices.donts: at least 5.
- commonPatterns: at least 4, each with complete runnable TSX using real imports.
- compositionExamples: at least 2 demonstrating real slot overrides.
- antiPatterns: at least 3, each with problem + solution.
- propGuidance: cover every non-trivial prop in the data.
- accessibility.keyboardSupport: cover every interactive key.
- stylingTips and themingNotes: cite real Griffel tokens (tokens.*).
- edgeCases: at least 3 where applicable.

Rules:
- Use ONLY the props and slots provided in the data — do NOT invent props that don't exist.
- Base code examples on the provided story code; adapt the real API, never invent.
- Code examples MUST use correct import paths and prop names from the data.
- Best practices should be specific to this component, not generic React advice.
- Accessibility guidance should reference actual ARIA attributes relevant to the component.

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
