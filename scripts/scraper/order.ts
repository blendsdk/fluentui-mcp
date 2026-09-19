/**
 * Deterministic string ordering helpers for the scraper.
 *
 * `String.prototype.localeCompare` depends on the host locale, so using it to
 * sort schema output can produce different orderings on different machines.
 * These helpers compare by code unit, which is stable everywhere.
 *
 * @module scraper/order
 */

/**
 * Compare two strings by Unicode code unit.
 *
 * @param a - First string
 * @param b - Second string
 * @returns -1 when `a` sorts first, 1 when `b` sorts first, 0 when equal
 */
export function compareStrings(a: string, b: string): number {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}
