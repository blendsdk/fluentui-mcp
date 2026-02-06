/**
 * Tool: get_component_examples — Extract code examples from a FluentUI component's documentation.
 *
 * Returns only the code blocks (TypeScript/TSX/JSX) from a component's docs,
 * stripped of surrounding prose. This is useful when the LLM just needs
 * copy-pasteable code patterns rather than the full documentation.
 *
 * Each code block is presented with the heading context it appeared under,
 * so the LLM knows what pattern each example demonstrates.
 *
 * @module tools/get-component-examples
 */

import type { DocumentStore } from '../indexer/document-store.js';
import type { GetComponentExamplesArgs, DocumentEntry } from '../types/index.js';
import { extractCodeBlocks } from '../indexer/metadata-extractor.js';

/**
 * Execute the get_component_examples tool.
 *
 * Looks up a component by name and extracts all TypeScript/TSX/JSX
 * code blocks from its documentation. Each code block is labeled with
 * the section heading it was found under.
 *
 * @param store - The populated document store to search
 * @param args - Tool arguments containing the component name
 * @returns Formatted markdown string with all code examples,
 *          or an error message if the component was not found or has no examples
 *
 * @example
 * ```typescript
 * const examples = getComponentExamples(store, { componentName: "Button" });
 * // Returns all Button code examples with section labels
 * ```
 */
export function getComponentExamples(
  store: DocumentStore,
  args: GetComponentExamplesArgs
): string {
  const { componentName } = args;

  if (!componentName || componentName.trim().length === 0) {
    return formatError('Component name is required. Example: "Button", "Dialog", "Input"');
  }

  // Find the component using fuzzy matching
  const doc = store.findByName(componentName.trim());

  if (!doc) {
    return formatNotFound(componentName, store);
  }

  // Extract raw code blocks using the metadata extractor utility
  const codeBlocks = extractCodeBlocks(doc.content);

  if (codeBlocks.length === 0) {
    return formatNoExamples(doc);
  }

  // Extract code blocks with their section context for better labeling
  const labeledBlocks = extractLabeledCodeBlocks(doc.content);

  return formatExamplesResponse(doc, labeledBlocks);
}

/**
 * A code block paired with its section heading context.
 * Helps the LLM understand what each code example demonstrates.
 */
interface LabeledCodeBlock {
  /** The section heading this code block appeared under (e.g., "Basic Usage") */
  sectionHeading: string;

  /** The raw code content (without fence markers) */
  code: string;

  /** The language hint from the code fence (e.g., "typescript", "tsx") */
  language: string;
}

/**
 * Extract all code blocks from markdown content along with their section headings.
 *
 * Walks through the document line by line, tracking the current section heading
 * and capturing fenced code blocks with their context.
 *
 * @param content - Raw markdown content
 * @returns Array of code blocks with section labels
 */
function extractLabeledCodeBlocks(content: string): LabeledCodeBlock[] {
  const blocks: LabeledCodeBlock[] = [];
  const lines = content.split('\n');

  // Track the current section heading as we scan through the document
  let currentHeading = 'General';
  let inCodeBlock = false;
  let currentCode: string[] = [];
  let currentLanguage = '';

  for (const line of lines) {
    // Update current heading when we encounter any heading level
    const headingMatch = line.match(/^(#{2,4})\s+(.+)$/);
    if (headingMatch && !inCodeBlock) {
      currentHeading = headingMatch[2].trim();
      continue;
    }

    // Detect start of a TypeScript/TSX/JSX code block
    const codeStartMatch = line.match(/^```(typescript|tsx|jsx|ts)\s*$/i);
    if (codeStartMatch && !inCodeBlock) {
      inCodeBlock = true;
      currentCode = [];
      currentLanguage = codeStartMatch[1].toLowerCase();
      continue;
    }

    // Detect end of code block
    if (line.trim() === '```' && inCodeBlock) {
      inCodeBlock = false;
      if (currentCode.length > 0) {
        blocks.push({
          sectionHeading: currentHeading,
          code: currentCode.join('\n').trim(),
          language: currentLanguage,
        });
      }
      continue;
    }

    // Accumulate code lines inside a code block
    if (inCodeBlock) {
      currentCode.push(line);
    }
  }

  return blocks;
}

/**
 * Format the response with all code examples for a component.
 *
 * Groups examples by section and presents them in a clean,
 * copy-pasteable format.
 *
 * @param doc - The component document entry
 * @param blocks - Labeled code blocks extracted from the document
 * @returns Formatted markdown string
 */
function formatExamplesResponse(
  doc: DocumentEntry,
  blocks: LabeledCodeBlock[]
): string {
  const parts: string[] = [];

  // Header with component info
  parts.push(`# ${doc.title} — Code Examples`);
  parts.push('');

  if (doc.metadata.packageName) {
    parts.push(`**Package:** \`${doc.metadata.packageName}\``);
  }
  if (doc.metadata.importStatement) {
    parts.push(`**Import:** \`${doc.metadata.importStatement}\``);
  }
  parts.push(`**Examples found:** ${blocks.length}`);
  parts.push('');
  parts.push('---');
  parts.push('');

  // Present each code block with its section label
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    parts.push(`### Example ${i + 1}: ${block.sectionHeading}`);
    parts.push('');
    parts.push(`\`\`\`${block.language}`);
    parts.push(block.code);
    parts.push('```');
    parts.push('');
  }

  return parts.join('\n');
}

/**
 * Format a message when the component exists but has no code examples.
 *
 * @param doc - The component document entry
 * @returns Helpful message suggesting alternatives
 */
function formatNoExamples(doc: DocumentEntry): string {
  const parts: string[] = [];
  parts.push(`# ${doc.title} — No Code Examples Found`);
  parts.push('');
  parts.push(`The documentation for "${doc.title}" does not contain TypeScript/TSX code examples.`);
  parts.push('');
  parts.push('**Suggestions:**');
  parts.push('- Use `query_component` to see the full documentation');
  parts.push('- Use `search_docs` to find related patterns with examples');
  parts.push('- Use `get_pattern` to find implementation patterns');

  return parts.join('\n');
}

/**
 * Format a "not found" error when the component doesn't exist.
 *
 * @param name - The component name that was searched for
 * @param store - The document store (for generating suggestions)
 * @returns Formatted error message with available components
 */
function formatNotFound(name: string, store: DocumentStore): string {
  const parts: string[] = [];
  parts.push(`Component "${name}" not found.`);
  parts.push('');

  // List available components that have code examples
  const componentDocs = store.getByModule('components');
  const withExamples = componentDocs.filter((doc) => doc.metadata.hasCodeExamples);

  if (withExamples.length > 0) {
    parts.push('**Components with code examples:**');
    const names = withExamples.map((doc) => doc.title).sort();
    parts.push(names.join(', '));
    parts.push('');
    parts.push('*Tip: Use partial names (e.g., "button" for Button)*');
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
