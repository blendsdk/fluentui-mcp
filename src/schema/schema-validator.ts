/**
 * Schema validation for the FluentUI Enhanced Schema format.
 *
 * Validates that a parsed JSON object conforms to the {@link FluentUISchema}
 * shape before it is handed to the {@link SchemaStore}. Validation is
 * intentionally lenient: it reports problems as a list of {@link ValidationError}
 * entries (with a severity) rather than throwing, so the server can choose to
 * load partial data and warn rather than crash.
 *
 * This mirrors the "Schema validation fails → load partial data, skip invalid
 * entries, warn" strategy from the MCP server refactor design doc.
 *
 * @module schema/schema-validator
 */

import type { FluentUISchema } from '../types/index.js';
import { KNOWN_COMPONENT_CATEGORIES } from '../types/index.js';

/**
 * The set of valid stability values a component or utility may declare.
 * Kept local (rather than imported) because it is a runtime allowlist used
 * only for validation — the type union lives in `types/schema.ts`.
 */
const VALID_STABILITY_LEVELS = ['stable', 'preview', 'unstable', 'contrib'] as const;

/**
 * The expected schema format version. The pipeline only understands `'1.0'`;
 * anything else indicates the file was produced by an incompatible tool version.
 */
const EXPECTED_SCHEMA_VERSION = '1.0';

/**
 * Severity of a validation finding.
 * - `error`: the schema (or an entry) is structurally invalid and may not load
 *   correctly. Callers typically skip the offending entry.
 * - `warning`: the schema is usable but has a data-quality issue (e.g. stats
 *   that don't match the actual arrays, or duplicate IDs).
 */
export type ValidationSeverity = 'error' | 'warning';

/**
 * A single validation finding produced by {@link validateSchema}.
 * Each finding is addressable via its `path` so callers can report precisely
 * where the problem is.
 */
export interface ValidationError {
  /** Dotted/bracketed path to the offending field (e.g. `components[0].name`). */
  path: string;

  /** Human-readable explanation of what is wrong. */
  message: string;

  /** Whether this finding blocks the entry (`error`) or is advisory (`warning`). */
  severity: ValidationSeverity;
}

/**
 * Type guard: returns true when `value` is a non-null, non-array object.
 * Used throughout validation to safely narrow `unknown` JSON input.
 *
 * @param value - Any parsed JSON value.
 * @returns True if `value` is a plain object.
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Validate a parsed (but untyped) schema object against the expected shape.
 *
 * The function never throws — all problems are returned as a list. An empty
 * list means the schema is fully valid. The caller decides how to react to
 * errors vs. warnings.
 *
 * Validation rules (in order):
 * 1. Root must be a plain object.
 * 2. `schemaVersion` must be present and equal to `'1.0'`.
 * 3. `version` must be a non-empty string.
 * 4. `sources.fluentui` must be present.
 * 5. The five content arrays must each be arrays.
 * 6. Each component must have a `name`, a valid `stability`, and (warning) a
 *    known `category`.
 * 7. Duplicate component IDs produce warnings.
 * 8. `stats` totals that disagree with the actual array lengths produce warnings.
 *
 * @param data - The parsed JSON value to validate (typically `JSON.parse` output).
 * @returns A list of validation findings; empty when the schema is valid.
 */
export function validateSchema(data: unknown): ValidationError[] {
  const errors: ValidationError[] = [];

  // Rule 1: the root must be an object. If not, no further checks make sense.
  if (!isPlainObject(data)) {
    errors.push({
      path: '',
      message: 'Schema root must be a non-null object',
      severity: 'error',
    });
    return errors;
  }

  validateTopLevelFields(data, errors);
  validateContentArrays(data, errors);
  validateComponents(data, errors);
  validateUtilities(data, errors);

  return errors;
}


/**
 * Convenience predicate: true when a schema has zero `error`-severity findings.
 * Warnings are tolerated. Useful for tests and quick gating decisions.
 *
 * @param data - The parsed JSON value to validate.
 * @returns True when there are no blocking errors.
 */
export function isSchemaValid(data: unknown): data is FluentUISchema {
  return validateSchema(data).every((e) => e.severity !== 'error');
}

/**
 * Validate the scalar/required top-level fields: schemaVersion, version, sources.
 *
 * @param data - The schema object (already confirmed to be a plain object).
 * @param errors - The accumulator list to append findings to.
 */
function validateTopLevelFields(
  data: Record<string, unknown>,
  errors: ValidationError[],
): void {
  // Rule 2: schemaVersion present and exactly '1.0'.
  if (!('schemaVersion' in data)) {
    errors.push({
      path: 'schemaVersion',
      message: 'Missing required field: schemaVersion',
      severity: 'error',
    });
  } else if (data.schemaVersion !== EXPECTED_SCHEMA_VERSION) {
    errors.push({
      path: 'schemaVersion',
      message: `Unsupported schemaVersion "${String(data.schemaVersion)}" (expected "${EXPECTED_SCHEMA_VERSION}")`,
      severity: 'error',
    });
  }

  // Rule 3: version must be a non-empty string.
  if (typeof data.version !== 'string' || data.version.length === 0) {
    errors.push({
      path: 'version',
      message: 'Missing or empty required field: version',
      severity: 'error',
    });
  }

  // Rule 4: sources.fluentui must be present.
  if (!isPlainObject(data.sources)) {
    errors.push({
      path: 'sources',
      message: 'Missing or invalid required field: sources',
      severity: 'error',
    });
  } else if (!isPlainObject(data.sources.fluentui)) {
    errors.push({
      path: 'sources.fluentui',
      message: 'Missing required field: sources.fluentui',
      severity: 'error',
    });
  }
}

/**
 * The five content array fields every schema must declare.
 * Kept as a constant so the same list drives both presence checks and the
 * stats cross-check.
 */
const CONTENT_ARRAY_FIELDS = [
  'components',
  'utilities',
  'foundation',
  'patterns',
  'enterprise',
  'quickReference',
] as const;

/**
 * Validate that each content collection is present and is an array.
 *
 * @param data - The schema object.
 * @param errors - The accumulator list to append findings to.
 */
function validateContentArrays(
  data: Record<string, unknown>,
  errors: ValidationError[],
): void {
  for (const field of CONTENT_ARRAY_FIELDS) {
    if (!(field in data)) {
      errors.push({
        path: field,
        message: `Missing required array: ${field}`,
        severity: 'error',
      });
    } else if (!Array.isArray(data[field])) {
      errors.push({
        path: field,
        message: `Field "${field}" must be an array`,
        severity: 'error',
      });
    }
  }
}

/**
 * Validate each component entry's required fields, stability, and category,
 * plus cross-entry concerns (duplicate IDs) and stats consistency.
 *
 * @param data - The schema object.
 * @param errors - The accumulator list to append findings to.
 */
function validateComponents(
  data: Record<string, unknown>,
  errors: ValidationError[],
): void {
  const components = data.components;
  // If components isn't an array, validateContentArrays already reported it.
  if (!Array.isArray(components)) {
    return;
  }

  const seenIds = new Set<string>();

  components.forEach((component, index) => {
    const path = `components[${index}]`;

    if (!isPlainObject(component)) {
      errors.push({
        path,
        message: 'Component entry must be an object',
        severity: 'error',
      });
      return;
    }

    // Required: name.
    if (typeof component.name !== 'string' || component.name.length === 0) {
      errors.push({
        path: `${path}.name`,
        message: 'Component is missing required field: name',
        severity: 'error',
      });
    }

    // Required: valid stability enum.
    if (!VALID_STABILITY_LEVELS.includes(component.stability as never)) {
      errors.push({
        path: `${path}.stability`,
        message: `Component has invalid stability "${String(component.stability)}" (expected one of: ${VALID_STABILITY_LEVELS.join(', ')})`,
        severity: 'error',
      });
    }

    // Advisory: unknown category. New categories are allowed by the type
    // (plain string) but we warn so data-quality drift is visible.
    if (
      typeof component.category === 'string' &&
      !KNOWN_COMPONENT_CATEGORIES.includes(component.category as never)
    ) {
      errors.push({
        path: `${path}.category`,
        message: `Component has unknown category "${component.category}"`,
        severity: 'warning',
      });
    }

    // Advisory: duplicate IDs break lookups silently, so warn.
    if (typeof component.id === 'string') {
      if (seenIds.has(component.id)) {
        errors.push({
          path: `${path}.id`,
          message: `Duplicate component id "${component.id}"`,
          severity: 'warning',
        });
      } else {
        seenIds.add(component.id);
      }
    }

    // Advisory: enhanced.propGuidance entries should reference real props.
    validatePropGuidance(component, path, errors);
  });

  validateStats(data, errors);
}

/**
 * Validate that each `enhanced.propGuidance[].prop` references a prop that
 * actually exists on the component. Bad references are warnings (the guidance
 * is still kept in the output) per AR #2.
 *
 * @param component - The component entry (already confirmed a plain object).
 * @param path - The component's dotted path (e.g. `components[0]`).
 * @param errors - The accumulator list to append findings to.
 */
function validatePropGuidance(
  component: Record<string, unknown>,
  path: string,
  errors: ValidationError[],
): void {
  const enhanced = component.enhanced;
  if (!isPlainObject(enhanced)) return;

  const guidance = enhanced.propGuidance;
  if (!Array.isArray(guidance)) return;

  const propNames = new Set(
    (Array.isArray(component.props) ? component.props : [])
      .filter(isPlainObject)
      .map((p) => p.name)
      .filter((name): name is string => typeof name === 'string'),
  );

  guidance.forEach((entry, i) => {
    if (!isPlainObject(entry)) return;
    if (typeof entry.prop !== 'string') return;
    if (!propNames.has(entry.prop)) {
      errors.push({
        path: `${path}.enhanced.propGuidance[${i}].prop`,
        message: `propGuidance references unknown prop "${entry.prop}"`,
        severity: 'warning',
      });
    }
  });
}

/**
 * Validate each utility entry's `enhanced.exportGuidance` references.
 * Bad references (an export name that does not exist on the utility) are
 * warnings, mirroring the component propGuidance check.
 *
 * @param data - The schema object.
 * @param errors - The accumulator list to append findings to.
 */
function validateUtilities(
  data: Record<string, unknown>,
  errors: ValidationError[],
): void {
  const utilities = data.utilities;
  if (!Array.isArray(utilities)) return;

  utilities.forEach((utility, index) => {
    if (!isPlainObject(utility)) return;
    const enhanced = utility.enhanced;
    if (!isPlainObject(enhanced)) return;

    const guidance = enhanced.exportGuidance;
    if (!Array.isArray(guidance)) return;

    const exportNames = new Set(
      (Array.isArray(utility.exports) ? utility.exports : [])
        .filter(isPlainObject)
        .map((e) => e.name)
        .filter((name): name is string => typeof name === 'string'),
    );

    guidance.forEach((entry, i) => {
      if (!isPlainObject(entry)) return;
      if (typeof entry.export !== 'string') return;
      if (!exportNames.has(entry.export)) {
        errors.push({
          path: `utilities[${index}].enhanced.exportGuidance[${i}].export`,
          message: `exportGuidance references unknown export "${entry.export}"`,
          severity: 'warning',
        });
      }
    });
  });
}


/**
 * Cross-check the declared `stats` totals against the actual array lengths.
 * Mismatches are warnings (the data is still usable) but indicate the schema
 * was hand-edited or produced by a buggy generator.
 *
 * @param data - The schema object.
 * @param errors - The accumulator list to append findings to.
 */
function validateStats(
  data: Record<string, unknown>,
  errors: ValidationError[],
): void {
  if (!isPlainObject(data.stats)) {
    errors.push({
      path: 'stats',
      message: 'Missing or invalid required field: stats',
      severity: 'error',
    });
    return;
  }

  const components = Array.isArray(data.components) ? data.components : [];
  const utilities = Array.isArray(data.utilities) ? data.utilities : [];

  if (
    typeof data.stats.totalComponents === 'number' &&
    data.stats.totalComponents !== components.length
  ) {
    errors.push({
      path: 'stats.totalComponents',
      message: `stats.totalComponents (${data.stats.totalComponents}) does not match components.length (${components.length})`,
      severity: 'warning',
    });
  }

  if (
    typeof data.stats.totalUtilities === 'number' &&
    data.stats.totalUtilities !== utilities.length
  ) {
    errors.push({
      path: 'stats.totalUtilities',
      message: `stats.totalUtilities (${data.stats.totalUtilities}) does not match utilities.length (${utilities.length})`,
      severity: 'warning',
    });
  }
}
