/**
 * Tests for the metadata extractor module.
 *
 * Validates extraction of titles, package names, import statements,
 * descriptions, see-also references, code blocks, props sections,
 * and content indicators from markdown documents.
 *
 * @module __tests__/indexer/metadata-extractor
 */

import { describe, it, expect } from 'vitest';
import {
  extractMetadata,
  extractTitle,
  extractCodeBlocks,
  extractPropsSection,
} from '../../indexer/metadata-extractor.js';

// ============================================================================
// Sample markdown content for test fixtures
// ============================================================================

/** Realistic FluentUI component doc with all metadata fields present */
const FULL_COMPONENT_DOC = `# Button

> **Package**: \`@fluentui/react-button\`
> **Import**: \`import { Button } from '@fluentui/react-components'\`
> **Category**: Buttons

## Overview

Button is the primary interactive element for triggering actions. It supports multiple appearances, sizes, shapes, and can include icons.

---

## Basic Usage

\`\`\`typescript
import * as React from 'react';
import { Button } from '@fluentui/react-components';

export const BasicButton: React.FC = () => (
  <Button>Click me</Button>
);
\`\`\`

---

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`appearance\` | \`'secondary' \\| 'primary'\` | \`'secondary'\` | Visual style |
| \`disabled\` | \`boolean\` | \`false\` | Whether disabled |

---

## See Also

- [CompoundButton](./compound-button.md)
- [ToggleButton](./toggle-button.md)
`;

/** Minimal doc with only a title and some content */
const MINIMAL_DOC = `# Getting Started

Install FluentUI v9 in your React project.

This guide walks you through the setup process.
`;

/** Doc with no headings at all */
const NO_HEADING_DOC = `This is a document without any headings.

It has some content but no markdown structure.
`;

/** Doc with multiple code blocks in different languages */
const MULTI_CODE_BLOCKS_DOC = `# Examples

## TSX Example

\`\`\`tsx
const App = () => <div>Hello</div>;
\`\`\`

## JSX Example

\`\`\`jsx
const App = () => <div>Hello</div>;
\`\`\`

## CSS (should not be extracted)

\`\`\`css
.button { color: red; }
\`\`\`

## TypeScript Example

\`\`\`typescript
const x: number = 42;
\`\`\`
`;

// ============================================================================
// extractTitle tests
// ============================================================================

describe('extractTitle', () => {
  it('should extract the H1 title from a standard document', () => {
    expect(extractTitle(FULL_COMPONENT_DOC)).toBe('Button');
  });

  it('should extract the title from a minimal document', () => {
    expect(extractTitle(MINIMAL_DOC)).toBe('Getting Started');
  });

  it('should return "Untitled" when no heading is found', () => {
    expect(extractTitle(NO_HEADING_DOC)).toBe('Untitled');
  });

  it('should fall back to any heading if no H1 exists', () => {
    const doc = `## Section Title\n\nSome content.`;
    expect(extractTitle(doc)).toBe('Section Title');
  });

  it('should trim whitespace from the title', () => {
    const doc = `#   Spaced Title   \n\nContent.`;
    expect(extractTitle(doc)).toBe('Spaced Title');
  });
});

// ============================================================================
// extractMetadata tests
// ============================================================================

describe('extractMetadata', () => {
  it('should extract package name from blockquote metadata', () => {
    const metadata = extractMetadata(FULL_COMPONENT_DOC);
    expect(metadata.packageName).toBe('@fluentui/react-button');
  });

  it('should extract import statement from blockquote metadata', () => {
    const metadata = extractMetadata(FULL_COMPONENT_DOC);
    expect(metadata.importStatement).toBe(
      "import { Button } from '@fluentui/react-components'"
    );
  });

  it('should extract description from the Overview section', () => {
    const metadata = extractMetadata(FULL_COMPONENT_DOC);
    expect(metadata.description).toContain('Button is the primary interactive element');
  });

  it('should detect props table presence', () => {
    const metadata = extractMetadata(FULL_COMPONENT_DOC);
    expect(metadata.hasPropsTable).toBe(true);
  });

  it('should detect code examples presence', () => {
    const metadata = extractMetadata(FULL_COMPONENT_DOC);
    expect(metadata.hasCodeExamples).toBe(true);
  });

  it('should extract see-also references', () => {
    const metadata = extractMetadata(FULL_COMPONENT_DOC);
    expect(metadata.seeAlso).toContain('CompoundButton');
    expect(metadata.seeAlso).toContain('ToggleButton');
    expect(metadata.seeAlso).toHaveLength(2);
  });

  it('should return null for missing package name', () => {
    const metadata = extractMetadata(MINIMAL_DOC);
    expect(metadata.packageName).toBeNull();
  });

  it('should return null for missing import statement', () => {
    const metadata = extractMetadata(MINIMAL_DOC);
    expect(metadata.importStatement).toBeNull();
  });

  it('should extract description from first paragraph when no Overview', () => {
    const metadata = extractMetadata(MINIMAL_DOC);
    expect(metadata.description).toContain('Install FluentUI v9');
  });

  it('should return empty array for missing see-also section', () => {
    const metadata = extractMetadata(MINIMAL_DOC);
    expect(metadata.seeAlso).toEqual([]);
  });

  it('should return false for hasPropsTable when no props section exists', () => {
    const metadata = extractMetadata(MINIMAL_DOC);
    expect(metadata.hasPropsTable).toBe(false);
  });

  it('should return false for hasCodeExamples when no code blocks exist', () => {
    const metadata = extractMetadata(MINIMAL_DOC);
    expect(metadata.hasCodeExamples).toBe(false);
  });
});

// ============================================================================
// extractCodeBlocks tests
// ============================================================================

describe('extractCodeBlocks', () => {
  it('should extract typescript code blocks', () => {
    const blocks = extractCodeBlocks(FULL_COMPONENT_DOC);
    expect(blocks.length).toBeGreaterThanOrEqual(1);
    expect(blocks[0]).toContain('Button');
  });

  it('should extract tsx and jsx code blocks', () => {
    const blocks = extractCodeBlocks(MULTI_CODE_BLOCKS_DOC);
    // Should find tsx, jsx, and typescript blocks but not css
    expect(blocks).toHaveLength(3);
  });

  it('should not extract non-TypeScript/JSX code blocks', () => {
    const blocks = extractCodeBlocks(MULTI_CODE_BLOCKS_DOC);
    const hasCSS = blocks.some((b) => b.includes('.button'));
    expect(hasCSS).toBe(false);
  });

  it('should return empty array when no code blocks exist', () => {
    const blocks = extractCodeBlocks(MINIMAL_DOC);
    expect(blocks).toEqual([]);
  });

  it('should trim whitespace from extracted blocks', () => {
    const blocks = extractCodeBlocks(FULL_COMPONENT_DOC);
    for (const block of blocks) {
      expect(block).toBe(block.trim());
    }
  });
});

// ============================================================================
// extractPropsSection tests
// ============================================================================

describe('extractPropsSection', () => {
  it('should extract the props section from a component doc', () => {
    const section = extractPropsSection(FULL_COMPONENT_DOC);
    expect(section).not.toBeNull();
    expect(section).toContain('Props Reference');
    expect(section).toContain('appearance');
    expect(section).toContain('disabled');
  });

  it('should return null when no props section exists', () => {
    const section = extractPropsSection(MINIMAL_DOC);
    expect(section).toBeNull();
  });

  it('should stop at the next same-level heading', () => {
    const section = extractPropsSection(FULL_COMPONENT_DOC);
    // The "See Also" section comes after Props — it should not be included
    expect(section).not.toContain('See Also');
  });
});
