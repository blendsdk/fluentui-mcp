# Phase 1 Review Report: Scraper coverage

> **Phase**: 1 — Scraper coverage (RD-01, AR-20, AR-21)
> **Reviewer**: correctness reviewer (independent subagent), strict profile
> **Baseline tree**: a6b1a796d31f11d74291e989af7065d39038d85f
> **Date**: 2026-09-19
> **Verdict**: 0 critical, 4 major, 6 minor. All four major findings ruled fixed by the user; F7/F9/F10 cleanup approved.

## Findings and rulings

| # | Severity | Finding | Ruling | Resolution |
|---|----------|---------|--------|------------|
| F1 | 🟠 MAJOR | Filename-based discovery invents non-components (context/state type files) and misses exported components. | Fix (user) | Export-based discovery: candidates come from the umbrella value exports and are kept only when a `<Name>.types.ts` exists. Filename scan kept as fallback for packages without an export list. |
| F2 | 🟠 MAJOR | `--clone` used `--depth 1 --single-branch` without tags, so the ref stayed `master`; ref and commit could diverge. | Fix (user) | Resolve the latest stable tag via `git ls-remote --tags` and clone at that tag; `--source` records a tag only when it equals HEAD. |
| F3 | 🟠 MAJOR | The all-stories fallback attached one component's stories to every sibling in multi-component packages. | Fix (user) | Fallback applies only when a package has exactly one component. |
| F4 | 🟠 MAJOR | Coverage report could not surface missed or skipped component packages. | Fix (user) | Coverage is built from the unfiltered discovery set; skipped, umbrella, and zero-component packages are reported with reasons. |
| F5 | 🟡 MINOR | Coverage counts only printed under `--verbose`. | Fix (in scope) | Coverage summary printed unconditionally by the CLI. |
| F6 | 🟡 MINOR | Absolute paths and symlinks bypass lexical containment. | Accepted as documented contract | JSDoc states absolute paths are explicit operator choices; relative traversal is rejected. |
| F7 | 🟡 MINOR | `localeCompare` ordering is locale-dependent. | Fix (user) | Added a code-unit comparator (`scripts/scraper/order.ts`) and used it in the changed sorts. |
| F8 | 🟡 MINOR | Public JSDoc stated contracts that never occur. | Fix (in scope) | JSDoc now matches actual behavior (a name always yields an entry). |
| F9 | 🟡 MINOR | Spec-test `describe` titles embedded ephemeral spec IDs. | Fix (user) | Renamed to behavior-describing titles. |
| F10 | 🟡 MINOR | Stale fixture-count comments. | Fix (user) | Comments updated. |

## Fix verification

- `yarn build && yarn test` — PASS, 825 tests across 38 files.
- New regression tests: export-restricted discovery, no cross-component story attribution, package-grouped export parsing, remote tag parsing, coverage reasons for zero-component and umbrella packages.

## Re-review

The scoped re-review confirmed F3, F4, F7, F9, F10 resolved and reported two
remaining defects in the F1/F2 fixes. Both were necessary to deliver the
approved fixes, so they were corrected:

| # | Severity | Defect | Resolution |
|---|----------|--------|------------|
| N1 | 🟠 MAJOR | `readExportsIndexByPackage` parsed line-by-line, but the real umbrella index uses multi-line export blocks; on the real index it returned only 2 packages, so discovery fell back to filename scanning and F1's guarantee did not hold. | The parser now matches multi-line `export { ... } from '...'` blocks. Verified against the cached real index: 58 packages parsed, and the Button family, ProgressBar, SearchBox, and DataGrid are found. |
| N2 | 🟠 MAJOR | `--clone --reuse` recorded the freshly resolved remote tag while the reused checkout's commit was older. | The CLI passes an explicit `--ref` only; the pipeline derives the ref from the actual checkout, so ref and commit always align. |
| N3 | 🟡 MINOR | The discovery fallback ran even when an export list existed but confirmed no names, contradicting the stated contract. | Documented the fallback honestly in the method JSDoc. |
| T1 | 🟡 MINOR | The ref/commit test was a pass-through tautology. | Added a real pinning test on a temporary git repository (tag at HEAD reported; later commit reported as null). |
| T2 | 🟡 MINOR | The fixture used a single-line index, so it could not exercise multi-line parsing. | The fixture now contains a multi-line export block and the parser test covers multi-line blocks directly. |

Final verification after all fixes: `yarn build && yarn test` — PASS, 827 tests
across 38 files.
