/**
 * Barrel exports for enhancer prompt builders.
 *
 * Provides a single import surface for all Pass 1 (component/utility) and
 * Pass 2 (category guidance, recipe, foundation, quick-reference) prompt
 * builders plus the shared grounding helpers.
 *
 * @module enhancer/prompts
 */

export {
  COMPONENT_ENHANCE_SYSTEM_PROMPT,
  serializeComponentForPrompt,
  buildComponentEnhanceMessages,
} from './component-enhance.js';

export {
  UTILITY_ENHANCE_SYSTEM_PROMPT,
  serializeUtilityForPrompt,
  buildUtilityEnhanceMessages,
} from './utility-enhance.js';

export {
  FOUNDATION_GUIDE_SYSTEM_PROMPT,
  buildFoundationGuideMessages,
} from './foundation-guide.js';

export {
  CATEGORY_GUIDANCE_SYSTEM_PROMPT,
  buildCategoryGuidanceMessages,
} from './category-guidance.js';

export {
  RECIPE_SYSTEM_PROMPT,
  buildRecipeMessages,
} from './recipe.js';

export {
  QUICK_REFERENCE_SYSTEM_PROMPT,
  buildQuickReferenceMessages,
} from './quick-reference.js';

export {
  toComponentSummary,
  buildComponentSummaries,
  serializeComponentSummaries,
  serializeComponentSummariesBudgeted,
  resolveTargetComponents,
  estimateTokens,
  GROUNDING_INPUT_BUDGET_TOKENS,
  GROUNDING_SELF_CHECK,
} from './shared.js';

export type { BudgetedSerializeOptions } from './shared.js';
