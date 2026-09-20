# PR-14 Component-Inventory Correction — Review

> **Scope**: post-plan correction of the deferred defect PR-14 (Phase 4 review F4).
> **Baseline**: `089fb9a` (last commit before the correction).
> **Reviewers**: correctness reviewer (strict) + one scoped re-review.
> **Verdict**: **PASS** after one critical fix and re-review.

The correction replaced the scraper's package-derived component names with the public value
exports of the umbrella package and regenerated the raw schema, enhanced schema, and skill.

## What changed

| Area | Change |
|------|--------|
| Scraper discovery | `discoverComponentNames` treats `options.exportedNames` as authoritative when defined: only public value exports with a matching `<Name>.types.ts` become components; no directory-name invention and no internal types-file scan. Contrib packages keep the scan fallback. |
| Pipeline | FluentUI packages pass `{ exportedNames: exportNames.get(pkg) ?? [] }`; contrib packages pass `undefined`. |
| Enhancer parsing | Added a string-aware `sanitizeJson` (trailing commas, raw control characters) tried as a final parse candidate; failures now include the raw response snippet. |
| Example gate | `parseImports` strips block and line comments inside import clauses. |
| Data | Re-scraped raw schema and re-enhanced schema: 62 → **198** unique stable components, 4 utilities, 35 guides. |
| Skill | Regenerated tree: 237 files + manifest, schema hash `e93f15e9…`. |

## Findings

| ID | Severity | Location | Finding | Resolution |
|----|----------|----------|---------|------------|
| F-01 | 🔴 critical | `.gitignore:8` | The `skills/` pattern also matched `.agents/skills/`, so 156 newly generated component pages were skipped by `git add`; the manifest referenced files not in HEAD and a fresh clone failed the drift gate. | **Fixed**: anchored the pattern to `/skills/`, committed the 156 pages, and verified the drift gate from a `git archive HEAD` checkout. |
| F-02 | 🟡 minor | `v9-adapter.ts` | Aliased unstable exports (`OverlayDrawer as DrawerOverlay`) are dropped because no matching types file exists under the alias; the canonical `OverlayDrawer`/`InlineDrawer` are present. | Accepted note (low impact). |
| F-03 | 🟡 minor | `discover.ts`, `v9-adapter.ts` | Inline `export { type Foo }` qualifiers are not stripped, so such a name is rejected; latent only (the pinned index has none). | Accepted note (latent). |
| F-04 | 🟡 minor | `inventory.spec.test.ts` | The duplicate test title over-claimed; the fixture yields one component, so the assertion was trivially true. | **Fixed**: renamed to "assigns a unique id to every scraped component". |
| F-05 | 🟡 minor | `validate-examples.ts` | `@fluentui/react-components/unstable` is not in `GATED_PACKAGES`, so the virtualizer example is not import-validated. | Accepted note (pre-existing; content manually verified). |

The reviewer independently confirmed the strict rule drops no real stable component: an
alias-aware cross-check of the pinned umbrella index produced the same 198 names, 0 missing, 0
extra, 0 duplicates.

## Verification

| Check | Result |
|-------|--------|
| `yarn build && yarn test` | 37 files / 728 tests passing |
| `yarn skill:check` | up to date and fully covered |
| `yarn skill:freshness` | fresh |
| `yarn skill:validate` | passed (tier-2 warnings only) |
| `yarn skill:secrets` | no secrets found |
| Fresh-clone drift (`git archive HEAD` → `check-drift`) | exit 0 |
| Manifest vs HEAD | 237/237 files present |

## Re-review outcome

PASS. No critical or major finding remains. The re-review confirmed the working tree is clean, no
skill file is ignored, every manifest path exists in HEAD, and the fresh-clone drift gate exits 0.
F-04 is fixed; F-02, F-03, and F-05 are accepted minor notes.
