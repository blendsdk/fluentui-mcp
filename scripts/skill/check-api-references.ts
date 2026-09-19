/**
 * API-reference gate.
 *
 * The enhancer writes prose that names components and props. This gate checks
 * the names the generator turns into API references against the scraped schema
 * and the installed package:
 *
 * - A component mention must exist in the raw schema or in the exports of
 *   `@fluentui/react-components`. A fabricated name fails the gate.
 * - A prop label that does not resolve is reported as a warning, not a
 *   failure. Prop labels are authored prose (for example `onChange and onInput`
 *   or `AccordionItem value`) and the deterministic props tables already come
 *   straight from scraper data, so a bad label is a repair signal rather than a
 *   correctness break.
 *
 * @module skill/check-api-references
 */

import type { FluentUISchema } from '../../src/types/schema.js';
import type { PackageExportResolver } from './package-exports.js';

/** Package whose exports can satisfy a component mention. */
const COMPONENT_PACKAGE = '@fluentui/react-components';

/**
 * The part of a schema the API-reference oracle needs.
 *
 * A full `FluentUISchema` satisfies this shape, and so does the older raw
 * scrape output, which predates the category and recipe sections. Keeping the
 * requirement structural lets the gate read either file without forcing the
 * raw schema through the newer validator.
 */
export interface ComponentOracleSchema {
  /** Components with the names, ids, props, and slots to check against. */
  components: ReadonlyArray<{
    /** Component display name. */
    name: string;

    /** Component kebab-case id. */
    id: string;

    /** Scraped props. */
    props: ReadonlyArray<{ name: string }>;

    /** Scraped slots. */
    slots: ReadonlyArray<{ name: string }>;
  }>;
}

/**
 * Type guard for {@link ComponentOracleSchema}.
 *
 * @param value - Parsed JSON of unknown shape.
 * @returns True when the value has a usable `components` array.
 */
export function isComponentOracleSchema(
  value: unknown,
): value is ComponentOracleSchema {
  if (typeof value !== 'object' || value === null || !('components' in value)) {
    return false;
  }
  return Array.isArray(value.components);
}

/** Which kind of API name a finding is about. */
export type ApiReferenceKind = 'component' | 'prop';

/** One unresolved API reference. */
export interface ApiReferenceFinding {
  /** Whether the name is a component or a prop. */
  kind: ApiReferenceKind;

  /** The unresolved name. */
  name: string;

  /** Where the name was found, for example `recipe data-table`. */
  location: string;

  /** Plain-language explanation. */
  message: string;
}

/** Findings split by whether they fail the gate. */
export interface ApiReferenceReport {
  /** Unresolved component names; these fail the gate. */
  errors: ApiReferenceFinding[];

  /** Unresolved prop labels; these are reported only. */
  warnings: ApiReferenceFinding[];
}

/**
 * Check every component and prop mention the generator renders.
 *
 * @param options - The enhanced schema under test, the raw schema oracle, and
 *   an optional package-export resolver.
 * @returns Errors for component mentions and warnings for prop labels.
 */
export function checkApiReferences(options: {
  enhancedSchema: FluentUISchema;
  rawSchema: ComponentOracleSchema;
  packageExports?: PackageExportResolver;
}): ApiReferenceReport {
  const errors: ApiReferenceFinding[] = [];
  const warnings: ApiReferenceFinding[] = [];

  const componentNames = new Set(options.rawSchema.components.map((c) => c.name));
  const componentIds = new Set(options.rawSchema.components.map((c) => c.id));
  const propAndSlotNames = new Set<string>();
  for (const component of options.rawSchema.components) {
    for (const prop of component.props) {
      propAndSlotNames.add(prop.name);
    }
    for (const slot of component.slots) {
      propAndSlotNames.add(slot.name);
    }
  }

  const packageExports = options.packageExports?.(COMPONENT_PACKAGE);

  const componentExists = (name: string): boolean =>
    componentNames.has(name) ||
    componentIds.has(name) ||
    (packageExports?.has(name) ?? false);

  const checkComponent = (name: string, location: string): void => {
    const trimmed = name.trim();
    if (trimmed === '' || componentExists(trimmed)) {
      return;
    }
    errors.push({
      kind: 'component',
      name: trimmed,
      location,
      message: `Component "${trimmed}" referenced by ${location} is not in the schema or ${COMPONENT_PACKAGE}.`,
    });
  };

  for (const component of options.enhancedSchema.components) {
    const location = `component ${component.name}`;
    for (const name of component.relatedComponents) {
      checkComponent(name, location);
    }
    for (const guidance of component.enhanced?.propGuidance ?? []) {
      if (!propAndSlotNames.has(guidance.prop)) {
        warnings.push({
          kind: 'prop',
          name: guidance.prop,
          location,
          message: `Prop label "${guidance.prop}" referenced by ${location} does not resolve to a scraped prop or slot.`,
        });
      }
    }
  }

  for (const guide of [
    ...options.enhancedSchema.foundation,
    ...options.enhancedSchema.quickReference,
  ]) {
    const location = `guide ${guide.id}`;
    for (const name of guide.referencedComponents) {
      checkComponent(name, location);
    }
  }

  for (const recipe of options.enhancedSchema.recipes) {
    const location = `recipe ${recipe.id}`;
    for (const name of recipe.referencedComponents) {
      checkComponent(name, location);
    }
  }

  for (const category of options.enhancedSchema.categoryGuidance) {
    const location = `category ${category.id}`;
    for (const id of category.componentIds) {
      if (!componentIds.has(id)) {
        errors.push({
          kind: 'component',
          name: id,
          location,
          message: `Component id "${id}" referenced by ${location} is not in the raw schema.`,
        });
      }
    }
  }

  return { errors, warnings };
}
