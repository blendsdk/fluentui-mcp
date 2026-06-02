/**
 * Stories extractor for FluentUI Storybook .stories.tsx files.
 *
 * Extracts named exports (stories) with their JSDoc descriptions,
 * full source code, import statements, and render function body.
 *
 * FluentUI stories follow the pattern:
 *
 *   /** Description of the story * /
 *   export const Default = () => <Button>Click me</Button>;
 *
 * @module scraper/extractors/stories-extractor
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, basename } from 'node:path';
import type { StoryEntry } from '../../../src/types/schema.js';

// ============================================================================
// Public API
// ============================================================================

/**
 * Extract all stories from a stories directory.
 *
 * Scans the directory for .stories.tsx files and extracts each
 * named export as a StoryEntry with description, code, and imports.
 *
 * @param storiesDir - Path to the stories directory (e.g., stories/src/Button/)
 * @returns Array of extracted story entries
 */
export function extractStories(storiesDir: string): StoryEntry[] {
  if (!existsSync(storiesDir)) return [];

  const stories: StoryEntry[] = [];

  // Find all .stories.tsx files in the directory
  let files: string[];
  try {
    files = readdirSync(storiesDir).filter((f) => f.endsWith('.stories.tsx'));
  } catch {
    return [];
  }

  for (const file of files) {
    const filePath = join(storiesDir, file);
    const fileStories = extractStoriesFromFile(filePath);
    stories.push(...fileStories);
  }

  return stories;
}

/**
 * Extract stories from a single .stories.tsx file.
 *
 * @param filePath - Absolute path to the .stories.tsx file
 * @returns Array of extracted story entries
 */
export function extractStoriesFromFile(filePath: string): StoryEntry[] {
  const content = readFileSafe(filePath);
  if (!content) return [];

  const stories: StoryEntry[] = [];
  const imports = extractImports(content);

  // Match named exports: "export const Name = ..."
  // Capture the JSDoc comment before if present
  const exportRegex = /(?:\/\*\*\s*([\s\S]*?)\s*\*\/\s*)?export\s+const\s+(\w+)\s*[:=]\s*/g;

  let match: RegExpExecArray | null;
  while ((match = exportRegex.exec(content)) !== null) {
    const jsDocComment = match[1] ?? '';
    const storyName = match[2]!;

    // Skip non-story exports (meta, default export helpers)
    if (storyName === 'default' || storyName === 'meta' || storyName === 'Meta') {
      continue;
    }

    // Extract the description from JSDoc (clean up asterisks and whitespace)
    const description = cleanJsDocDescription(jsDocComment);

    // Extract the render code (everything from the arrow/function to the end of the export)
    const renderCode = extractRenderCode(content, match.index + match[0].length);

    // Build full code block including imports
    const fullCode = buildFullCodeBlock(imports, storyName, renderCode);

    stories.push({
      name: storyName,
      description,
      code: fullCode,
      renderCode,
      imports,
    });
  }

  return stories;
}

// ============================================================================
// Internal Helpers
// ============================================================================

/**
 * Extract import statements from file content.
 */
function extractImports(content: string): string[] {
  const imports: string[] = [];
  const importRegex = /^import\s+.+?;$/gm;

  let match: RegExpExecArray | null;
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[0]);
  }

  return imports;
}

/**
 * Clean JSDoc description text — remove asterisks and extra whitespace.
 */
function cleanJsDocDescription(raw: string): string {
  return raw
    .replace(/\*\//g, '')
    .replace(/^\s*\*\s?/gm, '')
    .trim();
}

/**
 * Extract the render code block starting from after the = sign.
 *
 * Handles arrow functions, parenthesized expressions, and JSX blocks.
 * Returns everything up to the next export or end of file.
 */
function extractRenderCode(content: string, startIndex: number): string {
  // Find the end of the current export statement
  // Look for the next "export const" or end of file
  const remaining = content.slice(startIndex);

  // Try to find the balanced expression
  const nextExportMatch = remaining.match(/\n\s*(?:\/\*\*|export\s+const)\s/);
  const endIndex = nextExportMatch
    ? nextExportMatch.index!
    : remaining.length;

  const code = remaining.slice(0, endIndex).trim();

  // Remove trailing semicolons
  return code.replace(/;\s*$/, '');
}

/**
 * Build a complete code block with imports and the story function.
 */
function buildFullCodeBlock(
  imports: string[],
  storyName: string,
  renderCode: string,
): string {
  const importBlock = imports.join('\n');
  return `${importBlock}\n\nexport const ${storyName} = ${renderCode};`;
}

/**
 * Safely read a file, returning null on any error.
 */
function readFileSafe(filePath: string): string | null {
  try {
    if (!existsSync(filePath)) return null;
    return readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }
}
