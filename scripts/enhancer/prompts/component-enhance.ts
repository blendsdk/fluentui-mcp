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

/**
 * System prompt instructing the model to generate component documentation
 * as strict JSON. The required shape mirrors {@link ComponentEnhanced}.
 */
export const COMPONENT_ENHANCE_SYSTEM_PROMPT = `You are a FluentUI React (v9) component documentation expert.
Given the raw component data (props, slots, Storybook examples), generate rich
documentation content.

You MUST return ONLY valid JSON (no markdown fences) matching this exact structure:
{
  "description": "2-3 sentence rich description of the component",
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
      "code": "// TypeScript/TSX code example"
    }
  ],
  "stylingTips": "Common styling customizations and tokens to use",
  "migrationNotes": "Differences from previous version (optional, omit if N/A)"
}

Rules:
- Use ONLY the props and slots provided in the data — do NOT invent props that don't exist.
- Code examples MUST use correct import paths and prop names from the data.
- Best practices should be specific to this component, not generic React advice.
- Accessibility guidance should reference actual ARIA attributes relevant to the component.
- Keep descriptions concise but informative.`;

/**
 * Build a compact, deterministic serialization of a component's API surface.
 *
 * Only the fields useful for grounding the LLM are included; verbose or
 * derived fields are omitted to keep token usage low.
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
        renderCode: s.renderCode,
      })),
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
