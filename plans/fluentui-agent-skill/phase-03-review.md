# Phase 3 Review — Skill generator (RD-03)

> **Document**: phase-03-review.md
> **Parent**: [99-execution-plan.md](99-execution-plan.md)
> **Phase baseline**: `89d7149bf2b1a0685088d8717d7e01e245e6b59d`
> **Diff reviewed**: `89d7149b..a42e01f` (generator, renderers, tests, hand-written skill, regenerated tree)
> **Spec**: [03-02-skill-generator.md](03-02-skill-generator.md)
> **Requirement**: [RD-03](../../requirements/RD-03-skill-generator.md)

## Method

One independent correctness/maintainability/standards review of the Phase 3 diff under
strict scope. The reviewer inspected the hand-written source (not the 101 generated
references), regenerated the tree twice from the real schema, compared it with the
committed tree, ran `--check`, and resolved every internal link.

## Findings and rulings

| ID | Severity | Location | Finding | Ruling |
|----|----------|----------|---------|--------|
| RV-001 | 🟠 major | `scripts/skill/mapping.ts` | Link lists passed pre-bulleted strings into `bulletList()`, producing `- - [..]` in 89 of 101 generated files. | **FIXED.** Link arrays now hold raw items; labels are escaped with `escapeLinkLabel`. |
| RV-002 | 🟡 minor | `mapping.ts` | Guide/recipe files had two H1s (renderer title plus the content's own `# ...`). | **FIXED.** `stripLeadingHeading` removes the embedded H1. |
| RV-003 | 🟡 minor | `generate.spec.test.ts`, `skill-format.spec.test.ts` | The marker/name oracle imported the implementation constants, so a wrong marker would stay green. | **FIXED.** Spec tests now assert against literal required strings. |
| RV-004 | 🟡 minor | `render.impl.test.ts` | The link test claimed to ignore code fences but only dropped fence marker lines. | **FIXED.** `stripCodeFences` now removes fenced block contents. |
| RV-005 | 🟡 minor | `render/stories.ts` | Examples fell back to `renderCode`; RD-03 requires `stories[].code` only. | **FIXED.** The fallback was removed. |
| RV-006 | 🟡 minor | skill test comments | Comments and describe names cited ephemeral plan IDs. | **FIXED.** Reworded in plain language. |
| RV-007 | 🟡 minor | `mapping.ts` JSDoc | JSDoc said "sorted by path" while the function returns mapping order. | **FIXED.** JSDoc documents the real order. |
| RV-008 | 🟡 minor | `mapping.ts`, `render/props.ts` | `localeCompare` without a locale could reorder output across environments. | **FIXED.** Replaced with code-unit comparison. |
| RV-009 | 🟡 minor | `render/sections.ts`, `mapping.ts` | Headings and link labels were not newline/bracket escaped. | **FIXED.** `heading` collapses newlines; `escapeLinkLabel` escapes brackets and newlines. |
| RV-010 | 🟡 minor | `mapping.ts` | A `.filter` after a never-empty heading was dead code. | **FIXED.** Removed. |

## Checks with no finding

Determinism (two-run byte-identical, `--check` clean, no wall-clock timestamps), mapping
counts, marker placement, path safety (ids validated before any write; no traversal), and
link resolution were all verified clean.

## Verdict

**FAIL** at review time due to RV-001. The whole finding set was fixed under the user's
ruling, the tree was regenerated, and `yarn build && yarn test` passes (641 tests).

## Re-review (fix diff `a42e01f..7935dd4`)

One focused re-review of the fix. Verdict: **PASS — zero critical or major findings, no
regression.** Confirmed: no `- - ` remains anywhere under `references/`; every reference file
has exactly one H1; the spec oracles use literal required strings; the fence-aware test helper
excludes the real in-fence link; no story examples were lost when the `renderCode` fallback was
removed (59/59 story components carry scraped code); `localeCompare` is gone from runtime code;
and `--check` is clean. The re-reviewer noted one latent limitation in the new test helper
(`stripCodeFences` would mis-handle nested fences), which is not a present defect and is
reported only.
