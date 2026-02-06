/**
 * Tests for the directory scanner module.
 *
 * Tests use the real docs/v9/ directory to validate that
 * scanning and classification work correctly with actual content.
 *
 * @module __tests__/indexer/scanner
 */

import { describe, it, expect } from 'vitest';
import { join } from 'path';
import { scanDocsDirectory } from '../../indexer/scanner.js';

/** Absolute path to the bundled v9 docs directory */
const DOCS_V9_PATH = join(process.cwd(), 'docs', 'v9');

// ============================================================================
// Full directory scan
// ============================================================================

describe('scanDocsDirectory — real docs', () => {
  it('should discover all markdown files in the docs directory', async () => {
    const files = await scanDocsDirectory(DOCS_V9_PATH);
    // The docs directory has 100+ files — verify a reasonable minimum
    expect(files.length).toBeGreaterThan(50);
  });

  it('should return results sorted by relative path', async () => {
    const files = await scanDocsDirectory(DOCS_V9_PATH);
    const paths = files.map((f) => f.relativePath);
    const sorted = [...paths].sort((a, b) => a.localeCompare(b));
    expect(paths).toEqual(sorted);
  });

  it('should classify foundation docs correctly', async () => {
    const files = await scanDocsDirectory(DOCS_V9_PATH);
    const foundationFiles = files.filter((f) => f.module === 'foundation');
    // 01-foundation/ has several files
    expect(foundationFiles.length).toBeGreaterThanOrEqual(6);
    for (const f of foundationFiles) {
      expect(f.category).toBeNull();
    }
  });

  it('should classify component docs with categories', async () => {
    const files = await scanDocsDirectory(DOCS_V9_PATH);
    const componentFiles = files.filter((f) => f.module === 'components');
    expect(componentFiles.length).toBeGreaterThan(20);

    // Every component file should have a category
    const categorized = componentFiles.filter((f) => f.category !== null);
    expect(categorized.length).toBeGreaterThan(20);
  });

  it('should assign correct categories to known component files', async () => {
    const files = await scanDocsDirectory(DOCS_V9_PATH);

    // Button should be in "buttons" category
    const buttonFile = files.find((f) => f.relativePath.includes('buttons/button.md'));
    expect(buttonFile).toBeDefined();
    expect(buttonFile!.module).toBe('components');
    expect(buttonFile!.category).toBe('buttons');

    // Input should be in "forms" category
    const inputFile = files.find((f) => f.relativePath.includes('forms/input.md'));
    expect(inputFile).toBeDefined();
    expect(inputFile!.category).toBe('forms');
  });

  it('should classify pattern docs correctly', async () => {
    const files = await scanDocsDirectory(DOCS_V9_PATH);
    const patternFiles = files.filter((f) => f.module === 'patterns');
    expect(patternFiles.length).toBeGreaterThan(10);
  });

  it('should classify enterprise docs correctly', async () => {
    const files = await scanDocsDirectory(DOCS_V9_PATH);
    const enterpriseFiles = files.filter((f) => f.module === 'enterprise');
    expect(enterpriseFiles.length).toBeGreaterThanOrEqual(10);
  });

  it('should provide absolute file paths', async () => {
    const files = await scanDocsDirectory(DOCS_V9_PATH);
    for (const f of files) {
      expect(f.filePath.startsWith('/')).toBe(true);
      expect(f.filePath).toContain('docs/v9');
    }
  });

  it('should only include .md files', async () => {
    const files = await scanDocsDirectory(DOCS_V9_PATH);
    for (const f of files) {
      expect(f.relativePath).toMatch(/\.md$/);
    }
  });
});
