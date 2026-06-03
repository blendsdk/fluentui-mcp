/**
 * Tests for the schema validator.
 *
 * Verifies that {@link validateSchema} accepts well-formed schemas and reports
 * precise, severity-tagged findings for the catalogue of invalid schemas in
 * `fixtures/test-schema-invalid.json`. Also covers the {@link isSchemaValid}
 * convenience predicate.
 *
 * @module tests/schema/schema-validator
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import {
  validateSchema,
  isSchemaValid,
} from '../../schema/schema-validator.js';
import {
  createMinimalTestSchema,
  createEnhancedTestSchema,
  createFluentUISchema,
  createComponentEntry,
} from '../fixtures/helpers.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Load the named invalid-schema fixture's `data` payload.
 * The fixture file groups many invalid variants by key.
 */
function loadInvalidFixture(key: string): unknown {
  const fixturePath = join(__dirname, '..', 'fixtures', 'test-schema-invalid.json');
  const all = JSON.parse(readFileSync(fixturePath, 'utf-8')) as Record<
    string,
    { description: string; data: unknown }
  >;
  return all[key].data;
}

/** Returns only error-severity findings from a validation run. */
function errorsOnly(data: unknown): ReturnType<typeof validateSchema> {
  return validateSchema(data).filter((e) => e.severity === 'error');
}

describe('validateSchema', () => {
  describe('valid schemas', () => {
    it('should return no findings when given a minimal valid schema', () => {
      const errors = validateSchema(createMinimalTestSchema());
      expect(errors).toEqual([]);
    });

    it('should return no findings when given an enhanced valid schema', () => {
      const errors = validateSchema(createEnhancedTestSchema());
      expect(errors).toEqual([]);
    });

    it('should return no findings for an empty-but-well-formed schema', () => {
      const errors = validateSchema(createFluentUISchema());
      expect(errors).toEqual([]);
    });
  });

  describe('root-level structural errors', () => {
    it('should report an error when the root is null', () => {
      const errors = errorsOnly(loadInvalidFixture('null_value'));
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].path).toBe('');
    });

    it('should report an error when the root is not an object', () => {
      const errors = errorsOnly(loadInvalidFixture('not_an_object'));
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].message).toMatch(/non-null object/i);
    });

    it('should report multiple errors for an empty object', () => {
      const errors = errorsOnly(loadInvalidFixture('empty_object'));
      // Missing schemaVersion, version, sources, all arrays, and stats.
      expect(errors.length).toBeGreaterThan(1);
    });
  });

  describe('top-level field errors', () => {
    it('should report a missing schemaVersion', () => {
      const errors = errorsOnly(loadInvalidFixture('missing_schema_version'));
      expect(errors.some((e) => e.path === 'schemaVersion')).toBe(true);
    });

    it('should report an unsupported schemaVersion value', () => {
      const errors = errorsOnly(loadInvalidFixture('wrong_schema_version'));
      const finding = errors.find((e) => e.path === 'schemaVersion');
      expect(finding).toBeDefined();
      expect(finding?.message).toMatch(/Unsupported schemaVersion/i);
    });

    it('should report a missing version', () => {
      const errors = errorsOnly(loadInvalidFixture('missing_version'));
      expect(errors.some((e) => e.path === 'version')).toBe(true);
    });

    it('should report a missing sources.fluentui', () => {
      const errors = errorsOnly(loadInvalidFixture('missing_sources'));
      expect(errors.some((e) => e.path === 'sources.fluentui')).toBe(true);
    });
  });

  describe('content array errors', () => {
    it('should report a missing components array', () => {
      const errors = errorsOnly(loadInvalidFixture('missing_components_array'));
      expect(errors.some((e) => e.path === 'components')).toBe(true);
    });

    it('should report when components is not an array', () => {
      const errors = errorsOnly(loadInvalidFixture('components_not_array'));
      const finding = errors.find((e) => e.path === 'components');
      expect(finding).toBeDefined();
      expect(finding?.message).toMatch(/must be an array/i);
    });
  });

  describe('component entry errors', () => {
    it('should report a component missing its name', () => {
      const errors = errorsOnly(loadInvalidFixture('component_missing_name'));
      expect(errors.some((e) => e.path === 'components[0].name')).toBe(true);
    });

    it('should report a component with invalid stability', () => {
      const errors = errorsOnly(loadInvalidFixture('invalid_stability'));
      const finding = errors.find((e) => e.path === 'components[0].stability');
      expect(finding).toBeDefined();
      expect(finding?.message).toMatch(/invalid stability/i);
    });
  });

  describe('warnings (non-blocking)', () => {
    it('should warn — not error — on stats mismatch', () => {
      const all = validateSchema(loadInvalidFixture('stats_mismatch'));
      const blocking = all.filter((e) => e.severity === 'error');
      const warnings = all.filter((e) => e.severity === 'warning');
      expect(blocking).toEqual([]);
      expect(warnings.some((e) => e.path === 'stats.totalComponents')).toBe(true);
    });

    it('should warn on duplicate component IDs', () => {
      const all = validateSchema(loadInvalidFixture('duplicate_component_ids'));
      const warnings = all.filter((e) => e.severity === 'warning');
      expect(warnings.some((e) => e.message.match(/Duplicate component id/i))).toBe(true);
    });

    it('should warn on an unknown component category', () => {
      const schema = createFluentUISchema({
        components: [createComponentEntry('Mystery', { category: 'totally-made-up' })],
        stats: {
          totalComponents: 1,
          totalUtilities: 0,
          totalContrib: 0,
          totalPreview: 0,
          totalStories: 1,
          totalProps: 1,
          categoryCounts: { 'totally-made-up': 1 },
        },
      });
      const warnings = validateSchema(schema).filter((e) => e.severity === 'warning');
      expect(warnings.some((e) => e.path === 'components[0].category')).toBe(true);
    });
  });
});

describe('isSchemaValid', () => {
  it('should return true for a valid schema', () => {
    expect(isSchemaValid(createMinimalTestSchema())).toBe(true);
  });

  it('should return true when only warnings are present', () => {
    expect(isSchemaValid(loadInvalidFixture('stats_mismatch'))).toBe(true);
  });

  it('should return false when blocking errors are present', () => {
    expect(isSchemaValid(loadInvalidFixture('missing_version'))).toBe(false);
  });

  it('should return false for null', () => {
    expect(isSchemaValid(null)).toBe(false);
  });
});
