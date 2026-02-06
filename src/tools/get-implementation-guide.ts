/**
 * Tool: get_implementation_guide — Generate a step-by-step implementation guide.
 *
 * Combines component documentation, pattern documentation, and code examples
 * into a cohesive implementation guide for a stated UI goal. This is the
 * highest-level intelligence tool — it pulls together multiple docs into
 * an actionable plan the LLM can follow.
 *
 * The guide includes:
 * - Recommended components with import statements
 * - Relevant patterns and best practices
 * - Starter code example combining the suggested components
 * - Accessibility considerations
 *
 * @module tools/get-implementation-guide
 */

import type { DocumentStore } from '../indexer/document-store.js';
import type { SearchEngine } from '../indexer/search-engine.js';
import type {
  GetImplementationGuideArgs,
  DocumentEntry,
  SearchResult,
} from '../types/index.js';

/**
 * Maximum number of components to include in the guide.
 * Keeps the guide focused on the most relevant components.
 */
const MAX_GUIDE_COMPONENTS = 8;

/**
 * Maximum number of patterns to include in the guide.
 */
const MAX_GUIDE_PATTERNS = 4;

/**
 * Execute the get_implementation_guide tool.
 *
 * Takes a natural-language goal description and generates a structured
 * implementation guide that combines relevant components, patterns,
 * and code examples into an actionable plan.
 *
 * @param store - The populated document store to query
 * @param searchEngine - The search engine for finding relevant docs
 * @param args - Tool arguments containing the implementation goal
 * @returns Formatted markdown implementation guide
 *
 * @example
 * ```typescript
 * const guide = getImplementationGuide(store, engine, {
 *   goal: "build a login form with email, password, and remember me"
 * });
 * // Returns step-by-step guide with Input, Checkbox, Button, Field usage
 * ```
 */
export function getImplementationGuide(
  store: DocumentStore,
  searchEngine: SearchEngine,
  args: GetImplementationGuideArgs
): string {
  const { goal } = args;

  if (!goal || goal.trim().length === 0) {
    return formatError(
      'An implementation goal is required. Example: "build a login form with email and password fields"'
    );
  }

  const trimmedGoal = goal.trim();

  // Gather relevant components and patterns from the docs
  const relevantComponents = findRelevantComponents(searchEngine, trimmedGoal);
  const relevantPatterns = findRelevantPatterns(searchEngine, trimmedGoal);

  // If we found nothing at all, provide a helpful fallback
  if (relevantComponents.length === 0 && relevantPatterns.length === 0) {
    return formatNoResults(trimmedGoal, store);
  }

  return formatImplementationGuide(trimmedGoal, relevantComponents, relevantPatterns);
}

/**
 * Find components relevant to the implementation goal.
 *
 * Uses the search engine to find component docs that match the goal,
 * then filters to only component-module documents.
 *
 * @param searchEngine - The search engine
 * @param goal - The implementation goal description
 * @returns Array of relevant component search results
 */
function findRelevantComponents(
  searchEngine: SearchEngine,
  goal: string
): SearchResult[] {
  // Search specifically in the components module
  const results = searchEngine.search(goal, MAX_GUIDE_COMPONENTS * 2, 'components');

  // Return top results, limited to the guide maximum
  return results.slice(0, MAX_GUIDE_COMPONENTS);
}

/**
 * Find patterns relevant to the implementation goal.
 *
 * Uses the search engine to find pattern docs that match the goal,
 * then filters to only pattern-module documents.
 *
 * @param searchEngine - The search engine
 * @param goal - The implementation goal description
 * @returns Array of relevant pattern search results
 */
function findRelevantPatterns(
  searchEngine: SearchEngine,
  goal: string
): SearchResult[] {
  // Search specifically in the patterns module
  const results = searchEngine.search(goal, MAX_GUIDE_PATTERNS * 2, 'patterns');

  // Return top results, limited to the guide maximum
  return results.slice(0, MAX_GUIDE_PATTERNS);
}

/**
 * Format the complete implementation guide.
 *
 * Builds a structured guide with:
 * 1. Overview of the goal
 * 2. Recommended components with imports
 * 3. Relevant patterns and best practices
 * 4. Step-by-step implementation outline
 * 5. Accessibility checklist
 * 6. Follow-up tool suggestions
 *
 * @param goal - The implementation goal description
 * @param components - Relevant component search results
 * @param patterns - Relevant pattern search results
 * @returns Formatted markdown guide
 */
function formatImplementationGuide(
  goal: string,
  components: SearchResult[],
  patterns: SearchResult[]
): string {
  const parts: string[] = [];

  // Title and overview
  parts.push('# Implementation Guide');
  parts.push('');
  parts.push(`**Goal:** ${goal}`);
  parts.push('');
  parts.push('---');
  parts.push('');

  // Section 1: Recommended components
  parts.push(formatComponentsSection(components));

  // Section 2: Relevant patterns
  if (patterns.length > 0) {
    parts.push(formatPatternsSection(patterns));
  }

  // Section 3: Implementation steps
  parts.push(formatImplementationSteps(components, patterns));

  // Section 4: Accessibility considerations
  parts.push(formatAccessibilitySection(components));

  // Section 5: Next steps / follow-up tools
  parts.push(formatNextSteps(components));

  return parts.join('\n');
}

/**
 * Format the recommended components section.
 *
 * Lists each component with its package, import statement,
 * and a brief description of what it contributes to the goal.
 *
 * @param components - Component search results
 * @returns Formatted markdown section
 */
function formatComponentsSection(components: SearchResult[]): string {
  const parts: string[] = [];

  parts.push('## Recommended Components');
  parts.push('');

  if (components.length === 0) {
    parts.push('No specific components found. Try `list_by_category` to browse available components.');
    parts.push('');
    return parts.join('\n');
  }

  // Collect unique import packages for a combined import block
  const imports = collectImports(components);

  // Show combined import statement
  if (imports.length > 0) {
    parts.push('### Quick Import');
    parts.push('');
    parts.push('```typescript');
    for (const importLine of imports) {
      parts.push(importLine);
    }
    parts.push('```');
    parts.push('');
  }

  // List each component with details
  parts.push('### Component Details');
  parts.push('');

  for (const result of components) {
    const doc = result.document;
    const relevanceIcon = result.relevance >= 50 ? '⭐' : '•';

    parts.push(`${relevanceIcon} **${doc.title}**`);

    if (doc.metadata.description) {
      parts.push(`  ${doc.metadata.description}`);
    }

    if (doc.category) {
      parts.push(`  *Category: ${doc.category}*`);
    }

    parts.push('');
  }

  return parts.join('\n');
}

/**
 * Collect unique import statements from component search results.
 *
 * Groups components by package and creates a consolidated set of imports.
 * Most FluentUI components share the same package (@fluentui/react-components),
 * so this deduplicates nicely.
 *
 * @param components - Component search results
 * @returns Array of import statement strings
 */
function collectImports(components: SearchResult[]): string[] {
  const importMap = new Map<string, Set<string>>();

  for (const result of components) {
    const doc = result.document;
    const importStatement = doc.metadata.importStatement;

    if (importStatement) {
      // Parse the import to extract package and component names
      // Format: "import { Button } from '@fluentui/react-components'"
      const match = importStatement.match(
        /import\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"]/
      );

      if (match) {
        const components = match[1].split(',').map((s) => s.trim()).filter(Boolean);
        const packageName = match[2];

        const existing = importMap.get(packageName);
        if (existing) {
          for (const comp of components) {
            existing.add(comp);
          }
        } else {
          importMap.set(packageName, new Set(components));
        }
      }
    }
  }

  // Build consolidated import statements
  const imports: string[] = [];
  for (const [packageName, componentNames] of importMap) {
    const sortedNames = Array.from(componentNames).sort();
    // Split long imports across lines for readability
    if (sortedNames.length > 4) {
      imports.push(`import {`);
      imports.push(`  ${sortedNames.join(',\n  ')},`);
      imports.push(`} from '${packageName}';`);
    } else {
      imports.push(`import { ${sortedNames.join(', ')} } from '${packageName}';`);
    }
  }

  return imports;
}

/**
 * Format the relevant patterns section.
 *
 * Lists patterns that match the implementation goal, with brief
 * descriptions and pointers to full documentation.
 *
 * @param patterns - Pattern search results
 * @returns Formatted markdown section
 */
function formatPatternsSection(patterns: SearchResult[]): string {
  const parts: string[] = [];

  parts.push('## Relevant Patterns');
  parts.push('');

  for (const result of patterns) {
    const doc = result.document;

    parts.push(`### ${doc.title}`);

    if (doc.metadata.description) {
      parts.push(doc.metadata.description);
    }

    // Extract the pattern category from the relative path
    const pathParts = doc.relativePath.split('/');
    const category = pathParts.length >= 2 ? pathParts[1] : 'general';
    const patternName = extractPatternName(doc);

    parts.push(`*→ \`get_pattern("${category}", "${patternName}")\` for full pattern documentation*`);
    parts.push('');
  }

  return parts.join('\n');
}

/**
 * Format the implementation steps section.
 *
 * Generates a step-by-step outline for building the described UI.
 * Steps are derived from the types of components and patterns found.
 *
 * @param components - Relevant component search results
 * @param patterns - Relevant pattern search results
 * @returns Formatted markdown section
 */
function formatImplementationSteps(
  components: SearchResult[],
  patterns: SearchResult[]
): string {
  const parts: string[] = [];

  parts.push('## Implementation Steps');
  parts.push('');

  let stepNumber = 1;

  // Step 1: Always start with FluentProvider
  parts.push(`**Step ${stepNumber++}: Wrap with FluentProvider**`);
  parts.push('Ensure your app root is wrapped with `<FluentProvider>` and a theme.');
  parts.push('');
  parts.push('```typescript');
  parts.push("import { FluentProvider, webLightTheme } from '@fluentui/react-components';");
  parts.push('');
  parts.push('function App() {');
  parts.push('  return (');
  parts.push('    <FluentProvider theme={webLightTheme}>');
  parts.push('      {/* Your implementation here */}');
  parts.push('    </FluentProvider>');
  parts.push('  );');
  parts.push('}');
  parts.push('```');
  parts.push('');

  // Step 2: Install required packages
  const packages = collectPackageNames(components);
  if (packages.length > 0) {
    parts.push(`**Step ${stepNumber++}: Install packages**`);
    parts.push('Most FluentUI v9 components are available from the main bundle:');
    parts.push('```bash');
    parts.push('npm install @fluentui/react-components');
    parts.push('```');
    parts.push('');
  }

  // Step 3: Import components
  if (components.length > 0) {
    parts.push(`**Step ${stepNumber++}: Import components**`);
    parts.push('Import the components you need:');
    parts.push('');
    const imports = collectImports(components);
    if (imports.length > 0) {
      parts.push('```typescript');
      for (const importLine of imports) {
        parts.push(importLine);
      }
      parts.push('```');
      parts.push('');
    }
  }

  // Step 4: Build the component
  parts.push(`**Step ${stepNumber++}: Build your component**`);
  parts.push('Combine the imported components to create your UI. Key things to remember:');
  parts.push('');

  // Generate component-specific tips
  const tips = generateComponentTips(components);
  for (const tip of tips) {
    parts.push(`- ${tip}`);
  }
  parts.push('');

  // Step 5: Reference patterns
  if (patterns.length > 0) {
    parts.push(`**Step ${stepNumber++}: Follow recommended patterns**`);
    parts.push('Review these patterns for best practices:');
    for (const result of patterns) {
      parts.push(`- **${result.document.title}** — ${result.document.metadata.description || 'See pattern docs'}`);
    }
    parts.push('');
  }

  // Step 6: Style with Griffel
  parts.push(`**Step ${stepNumber++}: Add custom styling (if needed)**`);
  parts.push('Use `makeStyles` from Griffel for custom styles:');
  parts.push('');
  parts.push('```typescript');
  parts.push("import { makeStyles, tokens } from '@fluentui/react-components';");
  parts.push('');
  parts.push('const useStyles = makeStyles({');
  parts.push('  root: {');
  parts.push('    display: "flex",');
  parts.push('    flexDirection: "column",');
  parts.push('    gap: tokens.spacingVerticalM,');
  parts.push('  },');
  parts.push('});');
  parts.push('```');
  parts.push('');

  return parts.join('\n');
}

/**
 * Format the accessibility section.
 *
 * Generates accessibility reminders based on the types of
 * components recommended in the guide.
 *
 * @param components - Relevant component search results
 * @returns Formatted markdown section
 */
function formatAccessibilitySection(components: SearchResult[]): string {
  const parts: string[] = [];

  parts.push('## Accessibility Checklist');
  parts.push('');

  // Always include these universal accessibility items
  parts.push('- [ ] Ensure proper heading hierarchy (h1 → h2 → h3)');
  parts.push('- [ ] Test keyboard navigation (Tab, Enter, Escape)');
  parts.push('- [ ] Verify screen reader announces interactive elements');
  parts.push('- [ ] Check color contrast meets WCAG 2.1 AA standards');

  // Add component-specific accessibility reminders
  const componentTitles = components.map((r) => r.document.title.toLowerCase());

  if (hasAny(componentTitles, ['button'])) {
    parts.push('- [ ] Icon-only buttons have `aria-label`');
    parts.push('- [ ] Use `disabledFocusable` for buttons in toolbars');
  }

  if (hasAny(componentTitles, ['input', 'textarea', 'select', 'combobox', 'field', 'checkbox', 'radio', 'switch', 'slider', 'searchbox', 'spinbutton'])) {
    parts.push('- [ ] All form fields have associated `<Field>` with labels');
    parts.push('- [ ] Required fields are marked with `required` prop');
    parts.push('- [ ] Error messages are linked via `validationMessage`');
  }

  if (hasAny(componentTitles, ['dialog'])) {
    parts.push('- [ ] Dialog traps focus when open');
    parts.push('- [ ] Dialog has `aria-label` or `aria-labelledby`');
  }

  if (hasAny(componentTitles, ['table', 'datagrid'])) {
    parts.push('- [ ] Table has appropriate `aria-label`');
    parts.push('- [ ] Sortable columns announce sort state');
  }

  if (hasAny(componentTitles, ['menu'])) {
    parts.push('- [ ] Menu items have clear labels');
    parts.push('- [ ] Keyboard navigation works (arrow keys, escape)');
  }

  parts.push('');

  return parts.join('\n');
}

/**
 * Format the next steps section with follow-up tool suggestions.
 *
 * @param components - Relevant component search results
 * @returns Formatted markdown section
 */
function formatNextSteps(components: SearchResult[]): string {
  const parts: string[] = [];

  parts.push('## Next Steps');
  parts.push('');
  parts.push('Get deeper information using these tools:');
  parts.push('');

  // Suggest getting full docs for the top components
  const topComponents = components.slice(0, 3);
  for (const result of topComponents) {
    parts.push(`- \`query_component("${result.document.title}")\` — full ${result.document.title} documentation`);
  }

  // Suggest getting examples
  const withExamples = components.filter((r) => r.document.metadata.hasCodeExamples);
  if (withExamples.length > 0) {
    const exampleComponent = withExamples[0].document.title;
    parts.push(`- \`get_component_examples("${exampleComponent}")\` — code examples for ${exampleComponent}`);
  }

  // Suggest getting props
  const withProps = components.filter((r) => r.document.metadata.hasPropsTable);
  if (withProps.length > 0) {
    const propsComponent = withProps[0].document.title;
    parts.push(`- \`get_props_reference("${propsComponent}")\` — props API for ${propsComponent}`);
  }

  // Always suggest foundation docs
  parts.push('- `get_foundation("getting-started")` — setup and installation guide');
  parts.push('- `get_foundation("theming")` — theme customization');
  parts.push('- `get_foundation("accessibility")` — accessibility guidelines');

  parts.push('');

  return parts.join('\n');
}

/**
 * Collect unique package names from component search results.
 *
 * @param components - Component search results
 * @returns Array of unique package name strings
 */
function collectPackageNames(components: SearchResult[]): string[] {
  const packages = new Set<string>();

  for (const result of components) {
    if (result.document.metadata.packageName) {
      packages.add(result.document.metadata.packageName);
    }
  }

  return Array.from(packages).sort();
}

/**
 * Generate component-specific implementation tips.
 *
 * Analyzes which components are recommended and provides relevant tips.
 *
 * @param components - Component search results
 * @returns Array of tip strings
 */
function generateComponentTips(components: SearchResult[]): string[] {
  const tips: string[] = [];
  const titles = components.map((r) => r.document.title.toLowerCase());

  if (hasAny(titles, ['input', 'textarea', 'select', 'combobox', 'checkbox', 'radio', 'switch', 'slider', 'searchbox', 'spinbutton'])) {
    tips.push('Wrap form controls with `<Field>` for consistent labels and validation');
  }

  if (hasAny(titles, ['button'])) {
    tips.push('Use `appearance="primary"` for the main call-to-action button');
    tips.push('Limit to one primary button per view section');
  }

  if (hasAny(titles, ['dialog'])) {
    tips.push('Use `<DialogTrigger>` to properly connect the trigger button');
  }

  if (hasAny(titles, ['toast'])) {
    tips.push('Wrap with `<Toaster>` provider and use `useToastController()` hook');
  }

  if (hasAny(titles, ['table', 'datagrid'])) {
    tips.push('Use `useTableFeatures()` hook for sorting and selection');
  }

  if (hasAny(titles, ['menu'])) {
    tips.push('Use `<MenuTrigger>` to connect the trigger element');
  }

  // Always include a general styling tip
  tips.push('Use `tokens` from `@fluentui/react-components` for consistent spacing and colors');

  return tips;
}

/**
 * Check if any of the given values appear in the items array.
 * Used for checking if certain component types are present.
 *
 * @param items - Array of lowercase strings to search in
 * @param values - Values to look for
 * @returns True if any value is found in items
 */
function hasAny(items: string[], values: string[]): boolean {
  return values.some((value) =>
    items.some((item) => item.includes(value))
  );
}

/**
 * Extract a clean pattern name from a document for use in tool hints.
 *
 * @param doc - The document entry
 * @returns Clean pattern name string (without numeric prefix or extension)
 */
function extractPatternName(doc: DocumentEntry): string {
  const filename = doc.relativePath.split('/').pop()?.replace('.md', '') || '';
  return filename.replace(/^\d+-/, '');
}

/**
 * Format a message when no relevant docs are found for the goal.
 *
 * @param goal - The implementation goal
 * @param store - The document store
 * @returns Helpful message with alternative suggestions
 */
function formatNoResults(goal: string, store: DocumentStore): string {
  const parts: string[] = [];
  parts.push(`No relevant documentation found for: "${goal}"`);
  parts.push('');
  parts.push('**Try:**');
  parts.push('- Use more specific UI terms (e.g., "login form", "data table", "navigation sidebar")');
  parts.push('- Use `suggest_components` to discover relevant components');
  parts.push('- Use `search_docs` for a full-text search');
  parts.push('- Use `list_by_category` to browse components by category');
  parts.push('');

  const modules = store.getModules();
  if (modules.length > 0) {
    parts.push('**Available documentation modules:**');
    for (const { module, count } of modules) {
      parts.push(`- ${module} (${count} docs)`);
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
