/**
 * Scraper adapter factory.
 *
 * Maps a version config's adapter identifier to a concrete adapter instance.
 * Kept separate from the CLI so the pipeline can create adapters without
 * importing the CLI module.
 *
 * @module scraper/adapters/factory
 */

import { V9Adapter } from './v9-adapter.js';
import type { ScraperAdapter } from './adapter.js';

/**
 * Create the appropriate scraper adapter for a version config.
 *
 * @param adapterType - Adapter type from the version config ('v9', 'v8')
 * @returns An instantiated scraper adapter
 * @throws Error when the adapter type is unknown or not yet implemented
 */
export function createAdapter(adapterType: string): ScraperAdapter {
  switch (adapterType) {
    case 'v9':
      return new V9Adapter();
    case 'v8':
      throw new Error(
        'V8 adapter is not yet implemented (deferred to future phase)',
      );
    default:
      throw new Error(`Unknown adapter type: '${adapterType}'`);
  }
}
