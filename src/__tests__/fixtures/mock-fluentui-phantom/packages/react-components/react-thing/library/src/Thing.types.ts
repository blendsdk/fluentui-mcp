/**
 * Mock hook type definitions for the phantom-component regression fixture.
 *
 * The package exports only a hook, so it must not contribute a component even
 * though a `Thing.types.ts` file exists on disk.
 */

export type ThingOptions = {
  /** Whether the hook is enabled. */
  enabled?: boolean;
};
