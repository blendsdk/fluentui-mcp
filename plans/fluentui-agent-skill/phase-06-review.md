# Phase 6 Review: Retirement & cleanup (RD-06)

> **Phase diff**: `de66f1d` (tree of `32e0758`) → `2ca01a0`
> **Reviewers**: correctness reviewer + security auditor (parallel, strict scope)
> **Verdicts**: correctness **FAIL** (one critical) · security **PASS WITH MINOR FINDINGS**
> **Status**: ⏳ Awaiting user ruling on the finding batch

## Findings

### Correctness

| ID | Severity | Location | Finding | Evidence |
|----|----------|----------|---------|----------|
| PC-01 | 🔴 CRITICAL | `.github/workflows/publish.yml:108` | The `data/` rejection uses an unanchored `grep -q "data/"` over the whole `npm pack` output. The generated skill ships `skills/fluentui/references/recipes/data/*.md`, so the guard always matches and the step hard-fails on every run — publishing can never succeed. | `npm pack --dry-run --ignore-scripts` lists `skills/fluentui/references/recipes/data/async-data-states.md`, `data-table.md`, `virtualization.md`. |
| PC-02 | 🟠 MAJOR | `README.md:1,7,16,31,47,52,191,303` | README still documents MCP installation and tool usage. RD-06 Must-Have says it must not. The plan defers the rewrite to Phase 8 (8.2.1), so the Phase 6 deliverable "No MCP, docs/, or techdocs/ references" overstates what this phase achieves. | `head README.md`; execution plan 8.2.1. |
| PC-03 | 🟡 MINOR | `maintenance/DOCS-MAINTENANCE.md`, `.clinerules/project.md`, `.env.example`, `src/types/schema.ts` comments | Tracked files outside `plans/`/`requirements/` still mention MCP, `docs/`, or the deleted `src/tools\|search\|formatters`. Outside every phase's modification set. | `git grep -nIw MCP`. |
| PC-04 | 🟡 MINOR | `src/__tests__/repo/repo-hygiene.spec.test.ts:34,47,81` | The scan excludes `plans/`, `requirements/`, and itself, so the AC1 literal `grep -r "@modelcontextprotocol" .` still matches those. The test matches ST-34's intent, but not the literal criterion; it also does not scan bare `docs/` or `MCP`. | Self-exclusion at line 47; `git grep "@modelcontextprotocol"`. |
| PC-05 | 🟡 MINOR | `tsconfig.build.json:7` | The retained validator is compiled into the published `dist/schema/schema-validator.js` although only unpublished `scripts/**` consume it. `yarn build` also does not clean, so a stale `dist/types/index.js` from the old barrel survived until `yarn clean`. | `find dist` before clean listed `dist/types/index.js`. |
| PC-06 | 🟡 MINOR | `.env.example:16,29` | Provider list documents only `openai \| anthropic`; the enhancer supports `deepseek` and `update-skill.yml` sets `DEEPSEEK_*`. | `provider.ts:146-157,208-250`. |

### Security

| ID | Severity | Location | Finding | Evidence |
|----|----------|----------|---------|----------|
| SEC-01 | 🟡 MINOR | `.github/workflows/update-skill.yml:82-86` | Free-text `ref`/`contrib_ref` workflow inputs are interpolated directly into a `run:` bash block. A crafted value could execute in a step whose job holds `contents: write` and LLM secrets. Reachable only by a user who already has write access. | Pass via `env:` and quote. |
| SEC-02 | 🟡 MINOR | `.github/workflows/*.yml` | Actions pinned to floating major tags, not commit SHAs. `peter-evans/create-pull-request@v6` receives a write token. | 12 `uses:` refs. |
| SEC-03 | 🟡 MINOR | `.github/workflows/ci.yml`, `publish.yml` | No explicit `permissions:` block; jobs inherit the repository default token scope. | Only `update-skill.yml` declares permissions. |
| SEC-04 | 🟡 MINOR | `.github/workflows/publish.yml:110-114` | `NPM_TOKEN` is injected into the dry-run step, which performs no authenticated upload and does not need it. | `env: NODE_AUTH_TOKEN` on the dry-run step. |
| SEC-05 | 🟡 MINOR | `.github/workflows/update-skill.yml:58-60` | The whole job (including the LLM enhancer step) holds `contents: write` + `pull-requests: write`. | Job-level permissions block. |

## Confirmed clean

- `package.json` has no MCP dependency, no `main`, no `start*`/`docs:*`, correct `bin`/`files`/`engines`, and the four `skill:*` scripts.
- Types barrel deleted; all importers updated; the retained validator and its four consumers resolve; build and tests green.
- `update-skill.yml` flags and env names all resolve against the real CLIs; `--contrib-ref` correctly triggers the contrib clone only under `--clone`.
- Hygiene test fails on a remaining forbidden string; `git ls-files` use is shell-free with a bounded buffer.
- No `pull_request_target`, no secret logging, publish gated behind build/test and manual dispatch; a dry run cannot cause a real publish.
- RD-06 acceptance criteria 2–7 met; `docs/`, `techdocs/`, and the Pages workflow are gone.

## Ruling

| Finding | Ruling |
|---------|--------|
| PC-01 | **Fix.** Read the pack file list as JSON and assert exact paths, so `skills/fluentui/references/recipes/data/` no longer trips the `data/` guard. |
| PC-02 | **Adjust wording only.** The README rewrite is owned by Phase 8; the Phase 6 deliverable now says so. |
| SEC-01 | **Fix.** Pass `ref`/`contrib_ref` through `env:` and build a quoted argument array, so free text can never be interpreted as shell. |
| SEC-03 | **Fix.** Add workflow-level `permissions: contents: read` to `ci.yml` and `publish.yml`. |
| SEC-04 | **Fix.** Drop `NPM_TOKEN` from the dry-run publish step; it performs no authenticated upload. |
| PC-03, PC-04, PC-05, PC-06, SEC-02, SEC-05 | **Accept as notes.** Optional hardening or documentation drift outside the phase's strict scope; recorded for a later phase or project re-analysis. |

## Fixes applied

| Finding | Change |
|---------|--------|
| PC-01 | `publish.yml` verifies contents from `npm pack --dry-run --json`: exact `skills/fluentui/SKILL.md` and `dist/bin.js` present, no top-level `data/`. |
| SEC-01 | `update-skill.yml` scraper step takes `FLUENTUI_REF`/`CONTRIB_REF` from `env` and appends them to a bash argument array. |
| SEC-03 | `permissions: contents: read` added to `ci.yml` and `publish.yml`. |
| SEC-04 | Removed `NODE_AUTH_TOKEN` from the dry-run publish step. |
| PC-02 | Phase 6 deliverable reworded to attribute the README rewrite to Phase 8. |

## Accepted notes

- **PC-03 / PC-06:** stale MCP wording survives in `maintenance/DOCS-MAINTENANCE.md`, `.clinerules/project.md`, `.env.example`, and `src/types/schema.ts` comments; `.env.example` omits the DeepSeek provider.
- **PC-04:** the hygiene scan matches ST-34's intent but excludes `plans/`, `requirements/`, and itself, so RD-06 AC1's literal `grep` still matches those.
- **PC-05:** the retained validator is emitted into `dist/` and `yarn build` does not clean.
- **SEC-02 / SEC-05:** actions remain pinned to floating tags, and the update job holds write permissions for all steps.
