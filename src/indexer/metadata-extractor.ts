/**
 * Markdown metadata extraction utilities.
 *
 * Parses markdown documentation files to extract structured metadata
 * such as title, package name, import statement, description,
 * and content indicators (props tables, code examples).
 *
 * This extractor is designed to work with the FluentUI documentation format,
 * which uses a consistent structure with markdown headers and blockquotes
 * for metadata.
 *
 * @module indexer/metadata-extractor
 */

import type { DocumentMetadata } from '../types/index.js';

/**
 * Extract metadata from a markdown document's content.
 *
 * Parses the markdown to find:
 * - Title from the first `# Heading`
 * - Package name from `> **Package**: ...` blockquote
 * - Import statement from `> **Import**: ...` blockquote
 * - Description from the Overview section or first paragraph
 * - See Also references
 * - Presence of props tables and code examples
 *
 * @param content - Raw markdown content of the document
 * @returns Extracted metadata
 *
 * @example
 * ```typescript
 * const metadata = extractMetadata(markdownContent);
 * // { packageName: '@fluentui/react-button', title: 'Button', ... }
 * ```
 */
export function extractMetadata(content: string): DocumentMetadata {
  return {
    packageName: extractPackageName(content),
    importStatement: extractImportStatement(content),
    description: extractDescription(content),
    seeAlso: extractSeeAlso(content),
    hasPropsTable: detectPropsTable(content),
    hasCodeExamples: detectCodeExamples(content),
  };
}

/**
 * Extract the document title from the first `# Heading`.
 *
 * @param content - Raw markdown content
 * @returns The title text, or "Untitled" if no heading found
 */
export function extractTitle(content: string): string {
  // Match the first H1 heading: "# Title"
  const match = content.match(/^#\s+(.+)$/m);
  if (match) {
    return match[1].trim();
  }

  // Fallback: try any heading
  const anyHeading = content.match(/^#{1,3}\s+(.+)$/m);
  if (anyHeading) {
    return anyHeading[1].trim();
  }

  return 'Untitled';
}

/**
 * Extract the NPM package name from a blockquote metadata line.
 *
 * Looks for patterns like:
 * - `> **Package**: \`@fluentui/react-button\``
 * - `> **Package**: @fluentui/react-button`
 *
 * @param content - Raw markdown content
 * @returns Package name string, or null if not found
 */
function extractPackageName(content: string): string | null {
  // Pattern: > **Package**: `package-name`
  const match = content.match(/>\s*\*\*Package\*\*:\s*`?(@[\w/-]+)`?/i);
  return match ? match[1] : null;
}

/**
 * Extract the import statement from a blockquote metadata line.
 *
 * Looks for patterns like:
 * - `> **Import**: \`import { Button } from '@fluentui/react-components'\``
 *
 * @param content - Raw markdown content
 * @returns Import statement string, or null if not found
 */
function extractImportStatement(content: string): string | null {
  // Pattern: > **Import**: `import { ... } from '...'`
  const match = content.match(/>\s*\*\*Import\*\*:\s*`(.+?)`/i);
  return match ? match[1] : null;
}

/**
 * Extract a description from the document.
 *
 * Priority:
 * 1. First paragraph after `## Overview` heading
 * 2. First non-empty paragraph after the title heading
 * 3. First non-empty, non-metadata line
 *
 * @param content - Raw markdown content
 * @returns Description string, or null if none found
 */
function extractDescription(content: string): string | null {
  const lines = content.split('\n');

  // Strategy 1: Find paragraph after ## Overview
  const overviewIndex = lines.findIndex(
    (line) => /^##\s+Overview/i.test(line)
  );
  if (overviewIndex !== -1) {
    const description = findNextParagraph(lines, overviewIndex + 1);
    if (description) {
      return truncateDescription(description);
    }
  }

  // Strategy 2: Find first paragraph after the H1 title
  const titleIndex = lines.findIndex((line) => /^#\s+/.test(line));
  if (titleIndex !== -1) {
    const description = findNextParagraph(lines, titleIndex + 1);
    if (description) {
      return truncateDescription(description);
    }
  }

  // Strategy 3: First non-empty content line that isn't a heading or metadata
  for (const line of lines) {
    const trimmed = line.trim();
    if (
      trimmed &&
      !trimmed.startsWith('#') &&
      !trimmed.startsWith('>') &&
      !trimmed.startsWith('---') &&
      !trimmed.startsWith('|') &&
      !trimmed.startsWith('```')
    ) {
      return truncateDescription(trimmed);
    }
  }

  return null;
}

/**
 * Find the next non-empty paragraph starting from a given line index.
 *
 * Skips blank lines and returns the first paragraph of text found.
 * Collects consecutive non-empty, non-structural lines.
 *
 * @param lines - Array of document lines
 * @param startIndex - Line index to start searching from
 * @returns The paragraph text, or null if no paragraph found
 */
function findNextParagraph(lines: string[], startIndex: number): string | null {
  let collecting = false;
  const parts: string[] = [];

  for (let i = startIndex; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    // Skip blank lines before the paragraph starts
    if (!collecting && !trimmed) {
      continue;
    }

    // Stop at structural elements (headings, code blocks, tables, dividers)
    if (trimmed.startsWith('#') || trimmed.startsWith('```') ||
        trimmed.startsWith('|') || trimmed.startsWith('---')) {
      break;
    }

    // Skip blockquote metadata lines (> **Key**: value)
    if (trimmed.startsWith('>')) {
      continue;
    }

    // Collect paragraph text
    if (trimmed) {
      collecting = true;
      parts.push(trimmed);
    } else if (collecting) {
      // End of paragraph (blank line after content)
      break;
    }
  }

  return parts.length > 0 ? parts.join(' ') : null;
}

/**
 * Truncate a description to a reasonable length for search results.
 *
 * @param text - Full description text
 * @param maxLength - Maximum character length (default: 300)
 * @returns Truncated text with ellipsis if needed
 */
function truncateDescription(text: string, maxLength: number = 300): string {
  if (text.length <= maxLength) {
    return text;
  }
  // Truncate at word boundary
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + '...';
}

/**
 * Extract "See Also" references from the document.
 *
 * Looks for a "## See Also" section and extracts linked component/doc names.
 *
 * @param content - Raw markdown content
 * @returns Array of referenced document names
 */
function extractSeeAlso(content: string): string[] {
  const lines = content.split('\n');
  const seeAlsoIndex = lines.findIndex(
    (line) => /^##\s+See Also/i.test(line)
  );

  if (seeAlsoIndex === -1) {
    return [];
  }

  const references: string[] = [];

  // Collect links from lines after "## See Also"
  for (let i = seeAlsoIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim();

    // Stop at next heading
    if (line.startsWith('#')) {
      break;
    }

    // Extract link text from markdown links: [LinkText](path)
    const linkMatch = line.match(/\[(.+?)\]\(.+?\)/);
    if (linkMatch) {
      references.push(linkMatch[1]);
    }
  }

  return references;
}

/**
 * Detect whether the document contains a props reference table.
 *
 * Looks for markdown tables following a "Props" heading or
 * tables containing typical prop column headers.
 *
 * @param content - Raw markdown content
 * @returns True if props table detected
 */
function detectPropsTable(content: string): boolean {
  // Check for "Props Reference" or "Props" heading followed by a table
  if (/##\s+Props\s*(Reference)?/i.test(content)) {
    return true;
  }

  // Check for table headers with typical prop columns
  if (/\|\s*Prop\s*\|/i.test(content) || /\|\s*`\w+`\s*\|/.test(content)) {
    return true;
  }

  return false;
}

/**
 * Detect whether the document contains code examples.
 *
 * Looks for fenced code blocks with TypeScript/JSX/TSX language hints.
 *
 * @param content - Raw markdown content
 * @returns True if code examples detected
 */
function detectCodeExamples(content: string): boolean {
  // Check for TypeScript/TSX/JSX code blocks
  return /```(?:typescript|tsx|jsx|ts)/i.test(content);
}

/**
 * Extract all code blocks from a markdown document.
 *
 * Returns an array of code block contents, useful for the
 * `get_component_examples` tool that returns only code.
 *
 * @param content - Raw markdown content
 * @returns Array of code block strings (without the fence markers)
 */
export function extractCodeBlocks(content: string): string[] {
  const blocks: string[] = [];
  const regex = /```(?:typescript|tsx|jsx|ts)\n([\s\S]*?)```/gi;

  let match: RegExpExecArray | null;
  while ((match = regex.exec(content)) !== null) {
    blocks.push(match[1].trim());
  }

  return blocks;
}

/**
 * Extract the props table section from a markdown document.
 *
 * Finds the "Props Reference" or similar section and extracts
 * just the table content, useful for the `get_props_reference` tool.
 *
 * @param content - Raw markdown content
 * @returns The props table section as markdown, or null if not found
 */
export function extractPropsSection(content: string): string | null {
  const lines = content.split('\n');

  // Find the props heading
  const propsIndex = lines.findIndex(
    (line) => /^##\s+Props\s*(Reference)?/i.test(line)
  );

  if (propsIndex === -1) {
    return null;
  }

  // Collect everything until the next same-level heading
  const sectionLines: string[] = [lines[propsIndex]];

  for (let i = propsIndex + 1; i < lines.length; i++) {
    const line = lines[i];

    // Stop at next ## heading (but not ### sub-headings)
    if (/^##\s+[^#]/.test(line)) {
      break;
    }

    sectionLines.push(line);
  }

  return sectionLines.join('\n').trim();
}
