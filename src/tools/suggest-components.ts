/**
 * Tool: suggest_components — Suggest FluentUI components for a described UI.
 *
 * Analyzes a natural-language description of a UI the user wants to build
 * and suggests the most relevant FluentUI components. Uses keyword matching
 * against component titles, descriptions, categories, and content to rank
 * suggestions by relevance.
 *
 * This tool is particularly useful when the LLM doesn't know which FluentUI
 * components to use for a given UI pattern, or when exploring what's available.
 *
 * @module tools/suggest-components
 */

import type { DocumentStore } from '../indexer/document-store.js';
import type { SearchEngine } from '../indexer/search-engine.js';
import type { SuggestComponentsArgs, DocumentEntry, ComponentCategory } from '../types/index.js';

/**
 * Maximum number of component suggestions to return.
 * Keeps the response focused and actionable.
 */
const MAX_SUGGESTIONS = 10;

/**
 * Minimum relevance score (0-100) for a component to be included.
 * Filters out weak matches that would add noise.
 */
const MIN_RELEVANCE_THRESHOLD = 5;

/**
 * Execute the suggest_components tool.
 *
 * Takes a natural-language UI description and returns a ranked list
 * of FluentUI components that would be useful to build that UI.
 * Each suggestion includes a brief description and usage hint.
 *
 * @param store - The populated document store to query
 * @param searchEngine - The search engine for full-text matching
 * @param args - Tool arguments containing the UI description
 * @returns Formatted markdown string with component suggestions
 *
 * @example
 * ```typescript
 * const result = suggestComponents(store, engine, {
 *   uiDescription: "login form with email, password, and remember me checkbox"
 * });
 * // Returns suggestions: Input, Checkbox, Button, Field, Label, etc.
 * ```
 */
export function suggestComponents(
  store: DocumentStore,
  searchEngine: SearchEngine,
  args: SuggestComponentsArgs
): string {
  const { uiDescription } = args;

  if (!uiDescription || uiDescription.trim().length === 0) {
    return formatError(
      'A UI description is required. Example: "a settings page with toggles, dropdowns, and a save button"'
    );
  }

  const description = uiDescription.trim();

  // Build component suggestions using multiple matching strategies
  const suggestions = buildSuggestions(store, searchEngine, description);

  if (suggestions.length === 0) {
    return formatNoSuggestions(description, store);
  }

  return formatSuggestionsResponse(description, suggestions);
}

/**
 * A single component suggestion with its relevance score and reasoning.
 */
interface ComponentSuggestion {
  /** The component document entry */
  document: DocumentEntry;

  /** Relevance score from 0-100 (higher = more relevant) */
  relevance: number;

  /** Why this component was suggested (e.g., "matched: form, input") */
  reason: string;
}

/**
 * Build ranked component suggestions by combining multiple matching strategies.
 *
 * Strategy 1: Keyword matching against known UI patterns (high precision)
 * Strategy 2: Search engine full-text matching (high recall)
 * Strategy 3: Category inference from the description (broad matching)
 *
 * Results are deduplicated, combined, and sorted by total relevance.
 *
 * @param store - The document store
 * @param searchEngine - The search engine
 * @param description - The user's UI description
 * @returns Sorted array of component suggestions
 */
function buildSuggestions(
  store: DocumentStore,
  searchEngine: SearchEngine,
  description: string
): ComponentSuggestion[] {
  const suggestionMap = new Map<string, ComponentSuggestion>();

  // Strategy 1: Match against known UI keyword → component mappings
  const keywordMatches = matchKeywords(store, description);
  for (const suggestion of keywordMatches) {
    addOrMergeSuggestion(suggestionMap, suggestion);
  }

  // Strategy 2: Use the search engine to find components matching the description
  const searchResults = searchEngine.search(description, MAX_SUGGESTIONS * 2, 'components');
  for (const result of searchResults) {
    addOrMergeSuggestion(suggestionMap, {
      document: result.document,
      relevance: result.relevance,
      reason: 'search match',
    });
  }

  // Strategy 3: Infer categories from the description and include top components
  const inferredCategories = inferCategories(description);
  for (const category of inferredCategories) {
    const categoryDocs = store.getByCategory(category as ComponentCategory);
    for (const doc of categoryDocs) {
      addOrMergeSuggestion(suggestionMap, {
        document: doc,
        // Lower base relevance for category inference (broad matches)
        relevance: 15,
        reason: `category: ${category}`,
      });
    }
  }

  // Sort by relevance and apply limits
  return Array.from(suggestionMap.values())
    .filter((s) => s.relevance >= MIN_RELEVANCE_THRESHOLD)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, MAX_SUGGESTIONS);
}

/**
 * Add a suggestion to the map, merging relevance scores if the component
 * was already suggested by a different strategy.
 *
 * @param map - The suggestion map (keyed by document ID)
 * @param suggestion - The new suggestion to add or merge
 */
function addOrMergeSuggestion(
  map: Map<string, ComponentSuggestion>,
  suggestion: ComponentSuggestion
): void {
  const existing = map.get(suggestion.document.id);
  if (existing) {
    // Merge: take the higher relevance and combine reasons
    existing.relevance = Math.min(
      100,
      existing.relevance + Math.round(suggestion.relevance * 0.5)
    );
    if (!existing.reason.includes(suggestion.reason)) {
      existing.reason += `, ${suggestion.reason}`;
    }
  } else {
    map.set(suggestion.document.id, { ...suggestion });
  }
}

/**
 * Known UI keyword patterns mapped to FluentUI component names.
 *
 * Each entry maps a keyword (or phrase) that might appear in a UI description
 * to the component names that would be relevant. The relevance value indicates
 * how strong the match is (direct mention vs. implied).
 */
const KEYWORD_COMPONENT_MAP: Array<{
  /** Keywords to match against (all lowercase) */
  keywords: string[];
  /** Component names to suggest when matched */
  components: string[];
  /** Base relevance score for this match (0-100) */
  relevance: number;
}> = [
  // Form-related keywords
  { keywords: ['form', 'input', 'text field', 'text box'], components: ['Input', 'Field', 'Label'], relevance: 70 },
  { keywords: ['textarea', 'multiline', 'text area', 'comment'], components: ['Textarea', 'Field'], relevance: 70 },
  { keywords: ['checkbox', 'check box', 'tick'], components: ['Checkbox', 'Field'], relevance: 80 },
  { keywords: ['radio', 'radio button', 'option group'], components: ['Radio', 'RadioGroup', 'Field'], relevance: 80 },
  { keywords: ['dropdown', 'select', 'picker'], components: ['Select', 'Combobox', 'Field'], relevance: 70 },
  { keywords: ['combobox', 'autocomplete', 'typeahead'], components: ['Combobox', 'Field'], relevance: 80 },
  { keywords: ['switch', 'toggle switch'], components: ['Switch', 'Field'], relevance: 80 },
  { keywords: ['slider', 'range'], components: ['Slider', 'Field'], relevance: 80 },
  { keywords: ['search', 'search box', 'search bar'], components: ['SearchBox', 'Field'], relevance: 80 },
  { keywords: ['date', 'datepicker', 'date picker', 'calendar'], components: ['DatePicker', 'Field'], relevance: 80 },
  { keywords: ['time', 'timepicker', 'time picker'], components: ['TimePicker', 'Field'], relevance: 80 },
  { keywords: ['color', 'color picker', 'swatch'], components: ['ColorPicker', 'SwatchPicker'], relevance: 80 },
  { keywords: ['tag picker', 'chip input', 'multi select'], components: ['TagPicker', 'Field'], relevance: 70 },
  { keywords: ['rating', 'stars', 'rate'], components: ['Rating', 'Field'], relevance: 80 },
  { keywords: ['spin button', 'number input', 'numeric'], components: ['SpinButton', 'Field'], relevance: 70 },
  { keywords: ['password', 'login', 'sign in', 'authentication'], components: ['Input', 'Button', 'Field', 'Checkbox'], relevance: 60 },
  { keywords: ['validation', 'error message', 'form error'], components: ['Field', 'MessageBar'], relevance: 60 },

  // Button-related keywords
  { keywords: ['button', 'click', 'action', 'submit', 'cta'], components: ['Button'], relevance: 70 },
  { keywords: ['menu button', 'dropdown button'], components: ['MenuButton', 'Menu'], relevance: 80 },
  { keywords: ['split button'], components: ['SplitButton'], relevance: 90 },
  { keywords: ['toggle button', 'toggle'], components: ['ToggleButton', 'Switch'], relevance: 70 },
  { keywords: ['compound button', 'button with description'], components: ['CompoundButton'], relevance: 80 },

  // Navigation keywords
  { keywords: ['tab', 'tabs', 'tab bar', 'tab navigation'], components: ['Tab', 'TabList'], relevance: 80 },
  { keywords: ['breadcrumb', 'breadcrumbs', 'navigation trail'], components: ['Breadcrumb'], relevance: 90 },
  { keywords: ['link', 'hyperlink', 'anchor'], components: ['Link'], relevance: 70 },
  { keywords: ['menu', 'context menu', 'right click'], components: ['Menu'], relevance: 80 },
  { keywords: ['nav', 'sidebar', 'side navigation', 'navigation bar'], components: ['Nav', 'Menu'], relevance: 70 },

  // Data display keywords
  { keywords: ['table', 'data grid', 'grid', 'spreadsheet'], components: ['Table', 'DataGrid'], relevance: 80 },
  { keywords: ['list', 'item list'], components: ['List'], relevance: 70 },
  { keywords: ['tree', 'treeview', 'hierarchy', 'nested list'], components: ['Tree'], relevance: 80 },
  { keywords: ['avatar', 'profile picture', 'user photo'], components: ['Avatar', 'Persona'], relevance: 80 },
  { keywords: ['badge', 'count', 'notification badge'], components: ['Badge'], relevance: 80 },
  { keywords: ['persona', 'user card', 'user info'], components: ['Persona', 'Avatar'], relevance: 80 },
  { keywords: ['tag', 'chip', 'label tag'], components: ['Tag'], relevance: 70 },
  { keywords: ['image', 'photo', 'picture', 'thumbnail'], components: ['Image'], relevance: 70 },
  { keywords: ['skeleton', 'loading placeholder', 'shimmer'], components: ['Skeleton'], relevance: 80 },
  { keywords: ['text', 'typography', 'heading', 'title'], components: ['Text'], relevance: 50 },

  // Feedback keywords
  { keywords: ['dialog', 'modal', 'popup', 'alert dialog'], components: ['Dialog'], relevance: 80 },
  { keywords: ['toast', 'notification', 'snackbar'], components: ['Toast'], relevance: 80 },
  { keywords: ['tooltip', 'hint', 'hover info'], components: ['Tooltip'], relevance: 80 },
  { keywords: ['spinner', 'loading', 'progress indicator'], components: ['Spinner', 'ProgressBar'], relevance: 70 },
  { keywords: ['progress', 'progress bar', 'loading bar'], components: ['ProgressBar'], relevance: 80 },
  { keywords: ['message', 'message bar', 'info bar', 'banner'], components: ['MessageBar'], relevance: 80 },

  // Overlay keywords
  { keywords: ['drawer', 'side panel', 'slide out', 'panel'], components: ['Drawer'], relevance: 80 },
  { keywords: ['popover', 'flyout', 'dropdown panel'], components: ['Popover'], relevance: 80 },
  { keywords: ['teaching', 'onboarding', 'callout', 'coach mark'], components: ['TeachingPopover'], relevance: 80 },

  // Layout keywords
  { keywords: ['card', 'content card', 'tile'], components: ['Card'], relevance: 80 },
  { keywords: ['divider', 'separator', 'horizontal rule'], components: ['Divider'], relevance: 70 },

  // Utility keywords
  { keywords: ['accordion', 'collapsible', 'expandable', 'expand'], components: ['Accordion'], relevance: 80 },
  { keywords: ['toolbar', 'action bar', 'button bar'], components: ['Toolbar'], relevance: 80 },
  { keywords: ['carousel', 'slideshow', 'image slider'], components: ['Carousel'], relevance: 80 },
  { keywords: ['overflow', 'more button', 'responsive menu'], components: ['Overflow'], relevance: 70 },

  // Composite pattern keywords
  { keywords: ['settings', 'preferences', 'configuration'], components: ['Switch', 'Select', 'Slider', 'Field', 'Card'], relevance: 40 },
  { keywords: ['dashboard', 'overview', 'summary'], components: ['Card', 'Table', 'Badge', 'Text'], relevance: 30 },
  { keywords: ['confirmation', 'are you sure', 'confirm delete'], components: ['Dialog', 'Button'], relevance: 60 },
];

/**
 * Match a UI description against known keyword → component mappings.
 *
 * Scans the description for each known keyword and collects
 * the associated component suggestions with relevance scores.
 *
 * @param store - The document store (for looking up component docs)
 * @param description - The user's UI description (lowercased internally)
 * @returns Array of component suggestions from keyword matching
 */
function matchKeywords(
  store: DocumentStore,
  description: string
): ComponentSuggestion[] {
  const descLower = description.toLowerCase();
  const suggestions: ComponentSuggestion[] = [];

  for (const mapping of KEYWORD_COMPONENT_MAP) {
    // Check if any keyword appears in the description
    const matchedKeyword = mapping.keywords.find((kw) => descLower.includes(kw));

    if (matchedKeyword) {
      // Add each associated component as a suggestion
      for (const componentName of mapping.components) {
        const doc = store.findByName(componentName);
        if (doc) {
          suggestions.push({
            document: doc,
            relevance: mapping.relevance,
            reason: `matched: "${matchedKeyword}"`,
          });
        }
      }
    }
  }

  return suggestions;
}

/**
 * Infer which component categories are relevant to a UI description.
 *
 * Uses keyword heuristics to map description terms to FluentUI
 * component categories (buttons, forms, navigation, etc.).
 *
 * @param description - The user's UI description
 * @returns Array of inferred category names
 */
function inferCategories(description: string): string[] {
  const descLower = description.toLowerCase();
  const categories: string[] = [];

  // Category inference rules — broad keyword → category mappings
  const categoryRules: Array<{ keywords: string[]; category: string }> = [
    { keywords: ['form', 'input', 'field', 'checkbox', 'radio', 'select', 'dropdown', 'switch', 'validation'], category: 'forms' },
    { keywords: ['button', 'click', 'action', 'submit', 'cancel'], category: 'buttons' },
    { keywords: ['nav', 'menu', 'tab', 'breadcrumb', 'link', 'sidebar'], category: 'navigation' },
    { keywords: ['table', 'list', 'tree', 'avatar', 'badge', 'tag', 'data', 'grid'], category: 'data-display' },
    { keywords: ['dialog', 'modal', 'toast', 'notification', 'progress', 'loading', 'error', 'message'], category: 'feedback' },
    { keywords: ['drawer', 'popover', 'flyout', 'panel', 'overlay'], category: 'overlays' },
    { keywords: ['card', 'divider', 'layout', 'container'], category: 'layout' },
    { keywords: ['accordion', 'toolbar', 'carousel', 'overflow'], category: 'utilities' },
  ];

  for (const rule of categoryRules) {
    const hasMatch = rule.keywords.some((kw) => descLower.includes(kw));
    if (hasMatch) {
      categories.push(rule.category);
    }
  }

  return categories;
}

/**
 * Format the response with ranked component suggestions.
 *
 * @param description - The original UI description
 * @param suggestions - Ranked component suggestions
 * @returns Formatted markdown string
 */
function formatSuggestionsResponse(
  description: string,
  suggestions: ComponentSuggestion[]
): string {
  const parts: string[] = [];

  parts.push('# Suggested Components');
  parts.push('');
  parts.push(`**For:** "${description}"`);
  parts.push(`**Suggestions:** ${suggestions.length} components`);
  parts.push('');
  parts.push('---');
  parts.push('');

  for (let i = 0; i < suggestions.length; i++) {
    const suggestion = suggestions[i];
    const doc = suggestion.document;

    // Relevance indicator (visual bar)
    const relevanceBar = getRelevanceIndicator(suggestion.relevance);

    parts.push(`### ${i + 1}. ${doc.title} ${relevanceBar}`);

    if (doc.metadata.description) {
      parts.push(doc.metadata.description);
    }

    // Show why this was suggested
    parts.push(`*Why:* ${suggestion.reason}`);

    // Quick reference info
    const quickInfo: string[] = [];
    if (doc.category) {
      quickInfo.push(`Category: ${doc.category}`);
    }
    if (doc.metadata.packageName) {
      quickInfo.push(`Package: \`${doc.metadata.packageName}\``);
    }
    if (quickInfo.length > 0) {
      parts.push(quickInfo.join(' | '));
    }

    // Tool hints for follow-up
    parts.push(`*→ \`query_component("${doc.title}")\` for full docs*`);
    parts.push('');
  }

  // Footer with additional tool hints
  parts.push('---');
  parts.push('');
  parts.push('**Next steps:**');
  parts.push('- Use `query_component("<name>")` for complete documentation');
  parts.push('- Use `get_component_examples("<name>")` for code examples');
  parts.push('- Use `get_props_reference("<name>")` for props API');
  parts.push('- Use `get_implementation_guide("<goal>")` for step-by-step guidance');

  return parts.join('\n');
}

/**
 * Get a visual relevance indicator string based on score.
 *
 * @param relevance - Score from 0 to 100
 * @returns Emoji indicator string
 */
function getRelevanceIndicator(relevance: number): string {
  if (relevance >= 70) return '🟢';
  if (relevance >= 40) return '🟡';
  return '⚪';
}

/**
 * Format a message when no components match the description.
 *
 * @param description - The UI description that had no matches
 * @param store - The document store (for listing categories)
 * @returns Helpful message with alternative suggestions
 */
function formatNoSuggestions(description: string, store: DocumentStore): string {
  const parts: string[] = [];
  parts.push(`No components found matching: "${description}"`);
  parts.push('');
  parts.push('**Try:**');
  parts.push('- Use more specific UI terms (e.g., "button", "dialog", "table")');
  parts.push('- Use `search_docs` for a full-text search across all docs');
  parts.push('- Use `list_by_category` to browse components by category');
  parts.push('');

  const categories = store.getCategories();
  if (categories.length > 0) {
    parts.push('**Available categories:**');
    for (const { category, count } of categories) {
      parts.push(`- ${category} (${count} components)`);
    }
  }

  return parts.join('\n');
}

/**
 * Format a generic error message.
 *
 * @param message - The error description
 * @returns Formatted error string
 */
function formatError(message: string): string {
  return `**Error:** ${message}`;
}
