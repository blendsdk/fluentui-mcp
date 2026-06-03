# Preflight Report: Schema-Driven Pipeline

> **Status**: ❌ REVIEW IN PROGRESS — 8 findings (0 🔴, 2 🟠, 4 🟡, 2 🔵)
> **Iteration**: 1 (first scan)
> **Artifact**: Implementation Plan at `plans/schema-driven-pipeline/`
> **Codebase Grounded**: ✅ 18 source files examined, 21 fixture files verified
> **Last Updated**: 2026-05-13

### Codebase Context Summary

**Tech Stack:** TypeScript, MCP SDK, Vitest, Yarn v1 (from actual package.json)
**Architecture:** MCP server with 12 tools (6 core, 4 intelligence, 2 utility), markdown-based indexer subsystem (scanner → document-store → search-engine → metadata-extractor), all tools receive DocumentStore + SearchEngine via shared setup
**Key Files Examined:** `src/index.ts`, `src/config.ts`, `src/types/index.ts`, `src/types/schema.ts`, `package.json`, `tsconfig.json`, `tsconfig.build.json`, `vitest.config.ts`, all files in `src/tools/`, `src/indexer/`, `src/__tests__/tools/tools-setup.ts`, `src/__tests__/e2e/full-pipeline.test.ts`

**Reference Verification:** 45+ references mapped to code — 42 verified, 3 noted below

### Summary by Dimension

| # | Dimension | Findings | Highest Severity |
|---|-----------|----------|-----------------|
| 1 | Ambiguities | 1 | 🟠 |
| 2 | Implicit Assumptions | 0 | — |
| 3 | Logical Contradictions | 0 | — |
| 4 | Completeness Gaps | 2 | 🟠 |
| 5 | Dependency Issues | 0 | — |
| 6 | Feasibility Concerns | 0 | — |
| 7 | Testability | 0 | — |
| 8 | Security Blind Spots | 0 | — |
| 9 | Edge Cases | 0 | — |
| 10 | Scope Creep Indicators | 1 | 🟡 |
| 11 | Ordering & Sequencing | 1 | 🟡 |
| 12 | Consistency | 0 | — |
| 13 | Codebase Alignment | 3 | 🟡 |

### Summary by Severity

| Severity | Count | Status |
|----------|-------|--------|
| 🔴 CRITICAL | 0 | — |
| 🟠 MAJOR | 2 | ⏳ 2 pending |
| 🟡 MINOR | 4 | ⏳ 4 pending |
| 🔵 OBSERVATION | 2 | ⏳ 2 pending |

---

## Findings

### PF-001: Hybrid server state during Phase 12 tool migration not documented 🟠 MAJOR

**Dimension:** 1 — Ambiguities
**Location:** `plans/schema-driven-pipeline/99-execution-plan.md`, Phase 12 (Sessions 12.1–12.3)
**Codebase Evidence:** `src/index.ts` lines 1–449 — the server entry point creates a single `DocumentStore` + `SearchEngine` pair and passes them to all 12 tools. All tools share these instances.

**The Problem:** Phase 12 migrates tools incrementally (6 core → 4 intelligence → 2 utility → entry point), with the entry point updated last in task 12.3.3. During this migration, some tools will be rewritten to use `SchemaStore` while others still expect `DocumentStore` + `SearchEngine`. The plan doesn't specify how the server maintains both data sources simultaneously, or whether migrated tools are tested in isolation (against test fixtures) but only integrated later.

This matters because: a developer implementing Phase 12.1 needs to know whether they should modify `src/index.ts` to pass *both* stores, or whether migrated tools should temporarily accept the old interface, or whether the migration is a "big bang" in Phase 12.3.3.

**Options:**

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A | Document "test-only migration" pattern: migrated tools are tested against fixture schemas only; the actual server entry point continues using indexer until Phase 12.3.3 when it switches all at once | Simple, no hybrid state in production; tool tests use new fixtures independently | Tools can't be integration-tested with the real server until the final switch |
| B | Document a dual-initialization pattern: `src/index.ts` loads both indexer AND schema store; migrated tools get SchemaStore, unmigrated tools get DocumentStore | Each tool works in the real server immediately after migration | More complex entry point; longer transition period with both systems loaded |
| C | Change Phase 12 to a single session "big bang" migration: rewrite all 12 tools + entry point in one phase | No hybrid state at all | Very large single change; higher risk; harder to review |

**🎯 Recommendation:** Option A — This is the simplest approach and likely what the plan authors intended. Add a note in the Phase 12 introduction clarifying that migrated tools are unit-tested with schema fixtures during 12.1/12.2, and only wired into the live server in 12.3.3. The existing E2E tests continue to use the old indexer until Phase 13.2.1 updates them.

**User Decision:** ⏳ Pending

---

### PF-002: Pre-existing PACKAGE_VERSION mismatch not addressed in plan 🟠 MAJOR

**Dimension:** 4 — Completeness Gaps
**Location:** `plans/schema-driven-pipeline/99-execution-plan.md`, Phase 16 (task 16.1.7 "Version bump to 1.2.0")
**Codebase Evidence:** `src/config.ts` line ~35: `const PACKAGE_VERSION = '1.0.0'` — but `package.json` line 3: `"version": "1.0.1"`. These are out of sync **today**.

**The Problem:** The plan proposes bumping to `1.2.0` in Phase 16.1.7 but doesn't note that `PACKAGE_VERSION` in `config.ts` is already stale (says `1.0.0` when the actual version is `1.0.1`). This hardcoded version is used for the MCP server's `serverVersion` field. When Phase 16.1.7 bumps `package.json` to `1.2.0`, the same bug will persist unless `config.ts` is also updated — or better, the hardcoded value is replaced with a dynamic read.

**Options:**

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A | Add a task to Phase 16 to also update `PACKAGE_VERSION` in `config.ts` to `1.2.0` | Minimal change; fixes the immediate issue | Same bug will recur on every future version bump |
| B | Add a task to Phase 12.3.4 ("Update src/config.ts") to read version dynamically from `package.json` using `createRequire` or a build-time constant | Permanent fix; version never drifts again | Slightly more work; need to handle ESM resolution of package.json |
| C | Fix it immediately as a standalone commit (pre-existing bug, not plan-scoped) and add a note in Phase 12.3.4 to make it dynamic | Fixes the immediate bug now; permanent fix comes later | Two-step fix |

**🎯 Recommendation:** Option C — Fix the immediate mismatch now (it's a bug independent of this plan), and add a sub-task to Phase 12.3.4 to replace the hardcoded value with a dynamic read from `package.json`.

**User Decision:** ⏳ Pending

---

### PF-003: Fate of `docs/` directory after migration not explicitly addressed 🟡 MINOR

**Dimension:** 4 — Completeness Gaps
**Location:** `plans/schema-driven-pipeline/99-execution-plan.md`, Phase 16.1
**Codebase Evidence:** `package.json` line 12: `"files": ["dist/", "docs/", "README.md", "LICENSE"]` — the npm package currently bundles the entire `docs/` directory (~100 markdown files). Phase 14.1.4 proposes changing this to `data/`.

**The Problem:** After migration, the `docs/v9/` markdown files are no longer used by the server (which reads from `data/v9/fluentui-schema.json` instead). Phase 16.1.1–16.1.2 removes the indexer code and its tests, but doesn't mention whether `docs/` itself is kept, removed, or repurposed. If removed, the npm package shrinks significantly. If kept, it's dead weight. The plan should state a decision.

**Options:**

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A | Add a task to Phase 16 to remove `docs/` from the repository entirely | Clean repo; smaller npm package | Loss of historical documentation; no fallback |
| B | Keep `docs/` in the repo but remove from `package.json` `files` field (it stays in git but isn't published) | Historical reference preserved; npm package is lean | Repo has unused files |
| C | Move `docs/` to a separate branch or archive tag | Clean main branch; history preserved | More git complexity |

**🎯 Recommendation:** Option B — Keep `docs/` in the repo for reference but remove it from the npm package `files` field. The markdown is valuable as source material for future doc updates and LLM prompt context. Add a task to Phase 16: "Remove `docs/` from `package.json` files array."

**User Decision:** ⏳ Pending

---

### PF-004: Task 3.1.3 is redundant with completed Phase 1.2.4 🟡 MINOR

**Dimension:** 10 — Scope Creep Indicators
**Location:** `plans/schema-driven-pipeline/99-execution-plan.md`, Phase 3 Session 3.1, task 3.1.3
**Codebase Evidence:** `src/__tests__/fixtures/mock-fluentui/` — already contains `Button.types.ts`, `Input.types.ts`, `Dialog.types.ts` with realistic prop definitions, slot types, and JSDoc annotations. Created during Phase 1.2.4.

**The Problem:** Task 3.1.3 says "Create mock .types.ts files for testing" in `src/__tests__/fixtures/mock-fluentui/`. This work was already completed in Phase 1.2.4 which created the full mock FluentUI directory structure including all three component type files. Phase 3.1.3 would duplicate this effort.

**Options:**

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A | Mark 3.1.3 as already completed (covered by 1.2.4) and skip it during Phase 3 | Saves time; no duplicate work | May need to extend existing mocks if Phase 3 needs additional patterns |
| B | Redefine 3.1.3 as "Extend mock types files with additional edge-case patterns" (deprecated props, complex generics, etc.) | Addresses potential gaps in the existing mocks | Minor additional work |

**🎯 Recommendation:** Option B — The existing mocks cover the standard patterns. Redefine 3.1.3 as "Extend mock types files for edge-case prop patterns (deprecated props, inherited interfaces, complex generics)" which may be needed for thorough props-extractor testing.

**User Decision:** ⏳ Pending

---

### PF-005: Phase 14.1.4 (`files` field change) should happen after Phase 15 data generation 🟡 MINOR

**Dimension:** 11 — Ordering & Sequencing
**Location:** `plans/schema-driven-pipeline/99-execution-plan.md`, Phase 14.1.4 and Phase 15
**Codebase Evidence:** `package.json` line 10–15: `"files": ["dist/", "docs/", ...]`. The plan's dependency diagram shows Phase 14 and Phase 15 as parallel, both feeding into Phase 16.

**The Problem:** Phase 14.1.4 proposes changing the `files` field from `docs/` to `data/`. Phase 15 generates the actual data files in `data/`. If these run in parallel and Phase 14 completes first, the `prepublishOnly` script (`yarn clean && yarn build && yarn test`) would pass, but the npm package would reference `data/` which doesn't yet contain the generated schema. While publishing wouldn't happen until after Phase 16, the intermediate state is confusing and a `prepublishOnly` dry run would produce an incomplete package.

**Options:**

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A | Move task 14.1.4 to Phase 16 (alongside other final cleanup tasks) | Clean ordering; `data/` exists before `files` field references it | Phase 14 is slightly less complete |
| B | Keep the current ordering but add a note that 14.1.4 should be done after 15.1 | Minimal plan change | Relies on implementer reading the note |
| C | Add `data/` to `files` alongside `docs/` in Phase 14, then remove `docs/` in Phase 16 | Both directories available during transition | Larger npm package during transition |

**🎯 Recommendation:** Option A — Move 14.1.4 to Phase 16.1 where it naturally belongs alongside "remove legacy code" tasks. This ensures `data/` exists and is populated before the `files` field references it.

**User Decision:** ⏳ Pending

---

### PF-006: Schema file path resolution not specified in plan 🟡 MINOR

**Dimension:** 13 — Codebase Alignment
**Location:** `plans/schema-driven-pipeline/06-mcp-server-refactor.md`, SchemaLoader section; `plans/schema-driven-pipeline/99-execution-plan.md`, task 12.3.4
**Codebase Evidence:** `src/config.ts` currently resolves docs path as `{package_root}/docs/{version}/`. The new schema needs a similar resolution pattern for `{package_root}/data/{version}/fluentui-schema.json`.

**The Problem:** The plan mentions task 12.3.4 "Update src/config.ts with schema path resolution" and task 10.1.1 "Implement SchemaLoader (load from file, resolve path)" but doesn't specify the exact path convention for the schema file. Will it be `data/v9/fluentui-schema.json`? `data/v9.json`? Can it be overridden via environment variable (like `FLUENTUI_DOCS_PATH` currently)? This needs to be defined to ensure consistency between the scraper output (Phase 5), the enhancer output (Phase 9), the MCP server loading (Phase 10), and the CI/CD workflow (Phase 14).

**Options:**

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A | Add path convention to plan 06 (MCP server refactor): `data/{version}/fluentui-schema.json` with `FLUENTUI_SCHEMA_PATH` env var override | Explicit; all phases reference the same convention | Minor plan update needed |
| B | Leave it to implementation — the convention will emerge during Phase 5/10 | No plan change needed | Risk of inconsistency between scraper output and server loader paths |

**🎯 Recommendation:** Option A — Add a short "Schema File Convention" section to document 06 specifying `data/{version}/fluentui-schema.json` as the standard path, with `FLUENTUI_SCHEMA_PATH` as the env var override. This is a 5-line addition that prevents ambiguity across 4 phases.

**User Decision:** ⏳ Pending

---

### PF-007: LLM enhancement cost/token budget not estimated 🔵 OBSERVATION

**Dimension:** 13 — Codebase Alignment (Scope vs. Reality)
**Location:** `plans/schema-driven-pipeline/05-enhancer.md`, batch processing section

**The Problem:** The enhancer will call an LLM API for ~80+ component enhancements, ~20 utility enhancements, and ~30 guide generations. Each call involves a prompt with component data + response parsing. The plan doesn't estimate token usage per call, total token budget, or expected API cost per full enhancement run. While this doesn't affect implementation, it's useful for project planning — especially since a full enhance run might cost $5 or $50 depending on the model and prompt sizes.

**Options:**

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A | Add a rough cost estimate table to document 05 based on expected prompt/response sizes | Helps budget planning; sets expectations | Estimates may be inaccurate; prices change |
| B | Leave as-is — cost will be discovered during Phase 15 | No speculative estimates | Possible surprise cost |

**🎯 Recommendation:** Option A — A rough estimate (e.g., "~2K tokens input + ~1K output per component × 80 = ~240K tokens, approximately $0.50–$2 per full run with GPT-4o-mini") helps set expectations. But this is an observation, not a blocker.

**User Decision:** ⏳ Pending

---

### PF-008: No schema format versioning/migration strategy for future changes 🔵 OBSERVATION

**Dimension:** 13 — Codebase Alignment (Migration & Compatibility)
**Location:** `plans/schema-driven-pipeline/03-schema-design.md`, `schemaVersion: '1.0'` field

**The Problem:** The schema defines `schemaVersion: '1.0'` which is good for forward compatibility. However, the plan doesn't describe what happens if the schema format needs to change in the future (e.g., new required fields, restructured types). How would the SchemaLoader handle loading a `1.0` schema when the code expects `1.1`? Would there be migration functions? This isn't needed now, but thinking about it early prevents breaking changes.

**Options:**

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A | Add a brief "Schema Versioning Strategy" section to document 03 describing how future versions would be handled | Future-proofed; sets conventions early | Minor plan addition for hypothetical need |
| B | Leave as-is — address versioning when a schema change is actually needed | No speculative design | May make an ad-hoc decision under pressure later |

**🎯 Recommendation:** Option B — The `schemaVersion` field is already present for future use. Designing a full migration strategy for a hypothetical change is premature. When a schema change is needed, the version field enables detection and a migration function can be added then.

**User Decision:** ⏳ Pending
