/**
 * Tool: suggest_components — Suggest FluentUI components for a described UI.
 *
 * Analyzes a natural-language description of a UI the user wants to build and
 * suggests the most relevant FluentUI components. Combines three strategies:
 * known keyword → component mappings, the schema store's built-in
 * `suggestComponents` scorer, and the full-text search engine.
 *
 * @module tools/suggest-components
 */

import type { SchemaStore } from '../schema/schema-store.js';
import type { SearchEngine } from '../search/search-engine.js';
import type { SuggestComponentsArgs, ComponentEntry } from '../types/index.js';

/**
 * Maximum number of component suggestions to return.
 */
const MAX_SUGGESTIONS = 10;

/**
 * Minimum relevance score (0-100) for a component to be included.
 */
const MIN_RELEVANCE_THRESHOLD = 5;

/**
 * Execute the suggest_components tool.
 *
 * @param store - The populated schema store to query
 * @param searchEngine - The search engine for full-text matching
 * @param args - Tool arguments containing the UI description
 * @returns Formatted markdown string with component suggestions
 *
 * @example
 * ```typescript
 * const result = suggestComponents(store, engine, {
 *   uiDescription: "login form with email, password, and remember me checkbox"
 * });
 * ```
 */
export function suggestComponents(
  store: SchemaStore,
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
  /** The component entry. */
  component: ComponentEntry;

  /** Relevance score from 0-100 (higher = more relevant). */
  relevance: number;

  /** Why this component was suggested. */
  reason: string;
}

/**
 * Build ranked component suggestions by combining multiple matching strategies.
 *
 * @param store - The schema store
 * @param searchEngine - The search engine
 * @param description - The user's UI description
 * @returns Sorted array of component suggestions
 */
function buildSuggestions(
  store: SchemaStore,
  searchEngine: SearchEngine,
  description: string
): ComponentSuggestion[] {
  const suggestionMap = new Map<string, ComponentSuggestion>();

  // Strategy 1: Known UI keyword → component mappings.
  for (const suggestion of matchKeywords(store, description)) {
    addOrMergeSuggestion(suggestionMap, suggestion);
  }

  // Strategy 2: The schema store's own keyword scorer.
  for (const scored of store.suggestComponents(description)) {
    addOrMergeSuggestion(suggestionMap, {
      component: scored.component,
      // Map the additive store score into a coarse 0-100 band.
      relevance: Math.min(100, scored.score * 8),
      reason: scored.matchReasons[0] ?? 'schema match',
    });
  }

  // Strategy 3: Full-text search across component docs.
  const searchResults = searchEngine.search(description, MAX_SUGGESTIONS * 2, 'components');
  for (const result of searchResults) {
    const component = store.findComponent(result.document.title);
    if (component) {
      addOrMergeSuggestion(suggestionMap, {
        component,
        relevance: result.relevance,
        reason: 'search match',
      });
    }
  }

  return Array.from(suggestionMap.values())
    .filter((s) => s.relevance >= MIN_RELEVANCE_THRESHOLD)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, MAX_SUGGESTIONS);
}

/**
 * Add a suggestion to the map, merging relevance scores if the component
 * was already suggested by a different strategy.
 *
 * @param map - The suggestion map (keyed by component name)
 * @param suggestion - The new suggestion to add or merge
 */
function addOrMergeSuggestion(
  map: Map<string, ComponentSuggestion>,
  suggestion: ComponentSuggestion
): void {
  const key = suggestion.component.name.toLowerCase();
  const existing = map.get(key);
  if (existing) {
    existing.relevance = Math.min(
      100,
      existing.relevance + Math.round(suggestion.relevance * 0.5)
    );
    if (!existing.reason.includes(suggestion.reason)) {
      existing.reason += `, ${suggestion.reason}`;
    }
  } else {
    map.set(key, { ...suggestion });
  }
}

/**
 * Known UI keyword patterns mapped to FluentUI component names.
 */
const KEYWORD_COMPONENT_MAP: Array<{
  keywords: string[];
  components: string[];
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
 * @param store - The schema store (for looking up component entries)
 * @param description - The user's UI description
 * @returns Array of component suggestions from keyword matching
 */
function matchKeywords(
  store: SchemaStore,
  description: string
): ComponentSuggestion[] {
  const descLower = description.toLowerCase();
  const suggestions: ComponentSuggestion[] = [];

  for (const mapping of KEYWORD_COMPONENT_MAP) {
    const matchedKeyword = mapping.keywords.find((kw) => descLower.includes(kw));

    if (matchedKeyword) {
      for (const componentName of mapping.components) {
        const component = store.findComponent(componentName);
        if (component) {
          suggestions.push({
            component,
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
    const component = suggestion.component;

    const relevanceBar = getRelevanceIndicator(suggestion.relevance);

    parts.push(`### ${i + 1}. ${component.name} ${relevanceBar}`);

    const description = component.enhanced?.description;
    if (description) {
      parts.push(description);
    }

    parts.push(`*Why:* ${suggestion.reason}`);

    const quickInfo: string[] = [];
    quickInfo.push(`Category: ${component.category}`);
    quickInfo.push(`Package: \`${component.packageName}\``);
    parts.push(quickInfo.join(' | '));

    parts.push(`*→ \`query_component("${component.name}")\` for full docs*`);
    parts.push('');
  }

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
 * @param store - The schema store (for listing categories)
 * @returns Helpful message with alternative suggestions
 */
function formatNoSuggestions(description: string, store: SchemaStore): string {
  const parts: string[] = [];
  parts.push(`No components found matching: "${description}"`);
  parts.push('');
  parts.push('**Try:**');
  parts.push('- Use more specific UI terms (e.g., "button", "dialog", "table")');
  parts.push('- Use `search_docs` for a full-text search across all docs');
  parts.push('- Use `list_by_category` to browse components by category');
  parts.push('');

  const categories = store.getCategories();
  if (categories.size > 0) {
    parts.push('**Available categories:**');
    for (const [category, count] of categories) {
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
