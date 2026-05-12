# Preflight Report: Schema-Driven Pipeline

> **Status**: ✅ PASS — All 11 findings resolved (0 🔴, 3 🟠 fixed, 7 🟡 fixed, 1 🔵 acknowledged)
> **Iteration**: 1 (first scan → all recommendations accepted and applied)
> **Artifact**: Implementation Plan at `plans/schema-driven-pipeline/`
> **Codebase Grounded**: ✅ 22 source files examined, all references verified
> **Last Updated**: 2026-05-12

### Codebase Context Summary

**Tech Stack:** TypeScript, MCP SDK v1.26.0, Vitest, yarn (from package.json)
**Architecture:** Functional pattern — standalone exported functions, no classes. Markdown-based pipeline: `docs/v9/**/*.md → Scanner → MetadataExtractor → DocumentStore → Tools → MCP Protocol (stdio)`
**Key Files Examined:**
- `src/index.ts` (449 lines) — MCP server entry point, tool registration, dispatch
- `src/config.ts` (145 lines) — Version/path config resolution
- `src/types/index.ts` (315 lines) — All type definitions (DocumentEntry, SearchResult, tool args, etc.)
- `package.json` — v1.0.1, node >=18.0.0, MCP SDK ^1.26.0, npm-check-updates in deps
- `tsconfig.json` — rootDir: `./src`, include: `src/**/*`, excludes `src/__tests__`
- `src/indexer/` (5 files) — scanner, document-store, index-builder, metadata-extractor, search-engine
- `src/tools/` (12 files) — All tool handlers (functional pattern)
- `src/__tests__/` (10 test files) — tools-setup.ts with lazy-loaded shared store
- `.github/workflows/publish.yml` — Only existing workflow (no ci.yml)

**Reference Verification:** All file/component references in plan documents verified against codebase — 11 findings identified.

### Summary by Dimension

| # | Dimension | Findings | Highest Severity |
|---|-----------|----------|-----------------|
| 1 | Ambiguities | 0 | — |
| 2 | Implicit Assumptions | 0 | — |
| 3 | Logical Contradictions | 1 | 🟡 |
| 4 | Completeness Gaps | 2 | 🟠 |
| 5 | Dependency Issues | 2 | 🟠 |
| 6 | Feasibility Concerns | 0 | — |
| 7 | Testability | 0 | — |
| 8 | Security Blind Spots | 0 | — |
| 9 | Edge Cases | 0 | — |
| 10 | Scope Creep Indicators | 0 | — |
| 11 | Ordering & Sequencing | 0 | — |
| 12 | Consistency | 2 | 🟡 |
| 13 | Codebase Alignment | 4 | 🟠 |

### Summary by Severity

| Severity | Count | Status |
|----------|-------|--------|
| 🔴 CRITICAL | 0 | — |
| 🟠 MAJOR | 3 | ✅ All fixed |
| 🟡 MINOR | 7 | ✅ All fixed |
| 🔵 OBSERVATION | 1 | ✅ Acknowledged |

---

## 🟠 MAJOR Findings

---

### PF-001: DocumentEntry type description in 02-current-state.md is incorrect 🟠 MAJOR

**Dimension:** Codebase Alignment — Stale Assumptions
**Location:** `plans/schema-driven-pipeline/02-current-state.md`, lines 47-60 (section "Current DocumentEntry type")
**Codebase Evidence:** `src/types/index.ts`, lines 18-42

**The Problem:** The plan's description of the current `DocumentEntry` type lists three fields that **do not exist** on the actual type:

| Field in Plan | Actual Status |
|---|---|
| `codeBlocks: CodeBlock[]` | ❌ Does not exist on `DocumentEntry` |
| `propsSection: string \| null` | ❌ Does not exist on `DocumentEntry` |
| `seeAlso: SeeAlsoLink[]` | ❌ Does not exist on `DocumentEntry` — `seeAlso: string[]` exists on `DocumentMetadata` |

The actual `DocumentEntry` has: `id`, `title`, `content`, `filePath`, `relativePath`, `module`, `category`, `metadata`. The `metadata` field (type `DocumentMetadata`) contains `seeAlso: string[]`, `hasPropsTable: boolean`, and `hasCodeExamples: boolean` — but these are on the metadata sub-object, not on DocumentEntry itself.

This matters because the current-state document is used as the **baseline reference** for understanding what needs to change. Incorrect baseline descriptions can lead to incorrect migration assumptions.

**Options:**

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A | Fix the DocumentEntry description to match actual `src/types/index.ts` | Accurate baseline, prevents confusion during implementation | Minor doc edit |
| B | Leave as-is — implementors will read the actual code | No effort | Could cause confusion if someone only reads the plan |

**🎯 Recommendation:** Option A — Fix the description. The current-state document should be an accurate mirror of reality. The fix is trivial and prevents potential implementation confusion.

**User Decision:** ⏳ Pending

---

### PF-003: Missing `tsx` dependency for script execution 🟠 MAJOR

**Dimension:** Dependency Issues / Completeness Gaps
**Location:** `plans/schema-driven-pipeline/06-mcp-server-refactor.md`, lines 515-517 (scripts section); `plans/schema-driven-pipeline/99-execution-plan.md`, Phases 5 and 9 (CLI tasks)
**Codebase Evidence:** `package.json` — `tsx` is not in dependencies or devDependencies

**The Problem:** The plan defines these npm scripts for running TypeScript files directly:

```json
"scrape": "tsx scripts/scraper/cli.ts",
"enhance": "tsx scripts/enhancer/cli.ts"
```

But `tsx` (the TypeScript executor) is **never mentioned** in any dependency addition task. It's not in the current `package.json`, and none of the execution plan phases include adding it. Without `tsx`, `yarn scrape` and `yarn enhance` will fail with "command not found."

**Options:**

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A | Add `tsx` to devDependencies in Phase 1 (Schema Types & Fixtures) since it's needed from Phase 2 onwards | Available early, scripts work from first use | One more devDependency |
| B | Add `tsx` to devDependencies in Phase 5.2.3 (when `yarn scrape` script is added) | Just-in-time addition | Late — scripts/ code exists in Phases 2-4 without a runner |
| C | Use `ts-node` or `node --loader ts-node/esm` instead of `tsx` | Alternative runner | `tsx` is simpler and more reliable for ESM projects |

**🎯 Recommendation:** Option A — Add `tsx` to devDependencies in Phase 1. Since the scraper scripts are TypeScript and development starts in Phase 2, the runner should be available from the start. Add a task to Phase 1.1 or Phase 2.1.

**User Decision:** ⏳ Pending

---

### PF-011: Missing execution plan task for `tsconfig.build.json` and build script update 🟠 MAJOR

**Dimension:** Completeness Gaps
**Location:** `plans/schema-driven-pipeline/06-mcp-server-refactor.md`, lines 491-499 (TypeScript Configuration section); `plans/schema-driven-pipeline/99-execution-plan.md` (no corresponding task)
**Codebase Evidence:** `tsconfig.json` — currently `rootDir: "./src"`, `include: ["src/**/*"]`; `package.json` line 17: `"build": "tsc"`

**The Problem:** The plan describes a critical TypeScript configuration change:

- `tsconfig.json` → Include both `src/` AND `scripts/` (for IDE + type checking)
- `tsconfig.build.json` (NEW) → Only compile `src/` to `dist/` (for npm package)
- `"build"` script change from `"tsc"` to `"tsc --project tsconfig.build.json"`

This is essential because `scripts/` will import shared types from `src/types/schema.ts`. Without updating `tsconfig.json` to include `scripts/`, the IDE won't provide type checking for scraper/enhancer code. Without `tsconfig.build.json`, `tsc` would try to compile `scripts/` into `dist/`.

However, **no task in 99-execution-plan.md** creates `tsconfig.build.json` or updates the build script. The closest tasks are in Phase 12.3 which updates `src/index.ts` and `src/config.ts`, but the tsconfig changes are not listed.

**Options:**

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A | Add a task to Phase 1.1 (alongside schema types) since scripts/ exist from Phase 2 | IDE support works from the start; clean build separation | Slight scope addition to Phase 1 |
| B | Add a task to Phase 2.1 (first scraper session, when scripts/ is created) | Just-in-time, when scripts/ first appears | Phase 1 types work fine without it |
| C | Add a task to Phase 12.3 (alongside other config updates) | Groups all config changes together | Broken IDE experience for Phases 2-11 |

**🎯 Recommendation:** Option A — Add to Phase 1.1. Since `scripts/` imports from `src/types/schema.ts` starting in Phase 2, the tsconfig changes need to be in place before the first script file is created. Add tasks: "Create `tsconfig.build.json`" and "Update `package.json` build script to use `tsconfig.build.json`" and "Update `tsconfig.json` include to add `scripts/**/*`".

**User Decision:** ⏳ Pending

---

## 🟡 MINOR Findings

---

### PF-002: Requirements doc says "Node.js 20+ (same as current)" but current is >=18 🟡 MINOR

**Dimension:** Logical Contradictions
**Location:** `plans/schema-driven-pipeline/01-requirements.md`, line 63
**Codebase Evidence:** `package.json`, line 56: `"engines": { "node": ">=18.0.0" }`

**The Problem:** The requirements document states "Node.js 20+ (same as current)" — but the parenthetical "(same as current)" is wrong. The actual `package.json` specifies `>=18.0.0`. The plan's key decisions table in `00-index.md` (line 67) correctly identifies this as a **change**: "Node.js minimum: >=20.0.0 (Node 18 is EOL)". So the plan intends to raise the minimum, but 01-requirements incorrectly claims it's already >=20.

**Options:**

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A | Fix to: "Node.js 20+ (raised from current 18+; Node 18 is EOL)" | Accurate, clear about the change | Minor doc edit |
| B | Leave as-is — the key decisions table is correct | No effort | Contradictory within the plan |

**🎯 Recommendation:** Option A — Fix the parenthetical for accuracy.

**User Decision:** ⏳ Pending

---

### PF-004: No JSON Schema validation library specified for SchemaValidator 🟡 MINOR

**Dimension:** Completeness Gaps / Ambiguities
**Location:** `plans/schema-driven-pipeline/03-schema-design.md`, lines 470-477; `plans/schema-driven-pipeline/06-mcp-server-refactor.md`, lines 96-98

**The Problem:** The plan specifies creating a `SchemaValidator` that validates against a `data/schema.json` JSON Schema validation file, but doesn't specify which validation library to use (e.g., `ajv`, `zod`, custom code). Additionally, no execution plan task explicitly creates the `data/schema.json` validation schema file — only the validator code (Phase 10.1.2).

**Options:**

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A | Use `ajv` (popular JSON Schema validator) — add to devDependencies | Industry standard, full JSON Schema support | Another dependency |
| B | Use `zod` with schema transformation | Type-safe, great DX, already familiar in TS ecosystem | Not pure JSON Schema, adds dependency |
| C | Write custom validation (no library) | Zero dependencies, tailored to needs | More code to write and maintain |

**🎯 Recommendation:** Option C — Custom validation is likely sufficient here. The schema structure is well-defined with TypeScript types, and the validation only needs to check required fields and basic type correctness at load time. A lightweight custom validator keeps dependencies minimal. Add a task to Phase 10.1 for creating the `data/schema.json` file if JSON Schema is used, or document the decision to use custom TypeScript validation.

**User Decision:** ⏳ Pending

---

### PF-005: Plan proposes class-based patterns; codebase uses functional patterns 🟡 MINOR

**Dimension:** Codebase Alignment — Architecture Mismatch
**Location:** `plans/schema-driven-pipeline/06-mcp-server-refactor.md`, lines 83-98 (SchemaLoader class), 111-184 (SchemaStore class), 218-245 (ComponentFormatter class with static methods)
**Codebase Evidence:** `src/index.ts` — all tools imported as standalone functions; `src/tools/*.ts` — each exports a function; `src/indexer/*.ts` — exports functions; no classes in the codebase

**The Problem:** The current codebase uses a **purely functional pattern** — every module exports standalone functions, and the key abstractions (DocumentStore, SearchEngine) are type-only interfaces. The plan introduces `class SchemaStore`, `class SchemaLoader`, and `class ComponentFormatter` with static methods — a pattern not used anywhere in the existing code.

This is not necessarily wrong (the plan creates a new subsystem with different needs), but it's a stylistic departure that should be a conscious decision.

**Options:**

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A | Keep classes as designed in the plan | SchemaStore benefits from encapsulation (holds internal indexes); clear API surface | Inconsistent with existing codebase style |
| B | Refactor to functional modules (e.g., `createSchemaStore(schema)` returning an object with methods) | Consistent with existing patterns | More boilerplate, less natural for stateful store |
| C | Use classes for stateful components (SchemaStore), functions for stateless (formatters, loader) | Best of both — classes where state matters, functions elsewhere | Mixed patterns |

**🎯 Recommendation:** Option C — `SchemaStore` genuinely benefits from class encapsulation (it holds multiple internal indexes built in the constructor). But `SchemaLoader` and formatters are stateless and would be more consistent as exported functions with a namespace or module, matching the existing pattern. This is a judgment call the implementor can make per-module.

**User Decision:** ⏳ Pending

---

### PF-006: MCP SDK version in plan doesn't match actual installed version 🟡 MINOR

**Dimension:** Codebase Alignment — Stale Assumptions
**Location:** `plans/schema-driven-pipeline/06-mcp-server-refactor.md`, line 519
**Codebase Evidence:** `package.json`, line 59: `"@modelcontextprotocol/sdk": "^1.26.0"`

**The Problem:** The plan shows `"@modelcontextprotocol/sdk": "^1.11.0"` in the proposed `package.json` changes, but the actual installed version is `"^1.26.0"` (significantly newer). If an implementor copies the plan's version, they'd downgrade the dependency.

**Options:**

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A | Fix the version reference in the plan to `"^1.26.0"` | Matches reality | Minor doc edit |
| B | Leave as-is — implementors should use existing version | No effort | Risk of accidental downgrade |

**🎯 Recommendation:** Option A — Fix the version to match reality. This is a trivial correction.

**User Decision:** ⏳ Pending

---

### PF-007: `tools-setup.ts` not explicitly called out in migration plan 🟡 MINOR

**Dimension:** Codebase Alignment — Impact Blindness
**Location:** `plans/schema-driven-pipeline/99-execution-plan.md`, Phases 12-13
**Codebase Evidence:** `src/__tests__/tools/tools-setup.ts` — shared test setup that builds the real document index from markdown

**The Problem:** The file `src/__tests__/tools/tools-setup.ts` is the shared test infrastructure for all tool tests. It uses `buildIndex(docsPath)` to create a lazy-loaded `DocumentStore` and `SearchEngine` from markdown docs. When tools are migrated to use `SchemaStore` in Phase 12, this setup file must be rewritten to load from a test schema instead.

The execution plan mentions updating test files for each tool group (tasks 12.1.5, 12.2.5, 12.3.5) but doesn't explicitly call out that `tools-setup.ts` needs to be completely rewritten first — before any tool test can be updated.

**Options:**

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A | Add an explicit task at the start of Phase 12.1: "Rewrite `tools-setup.ts` to use SchemaStore with test schema fixture" | Clear dependency, done once before tool test migration | Minor task addition |
| B | Assume it's implicitly covered by "Update tool tests" tasks | No plan change | Could be forgotten; unclear ordering |

**🎯 Recommendation:** Option A — Add an explicit task. This is a prerequisite for all tool test updates and should be done first in Phase 12.1.

**User Decision:** ⏳ Pending

---

### PF-009: V8 adapter task still in execution plan checklist despite being deferred 🟡 MINOR

**Dimension:** Consistency
**Location:** `plans/schema-driven-pipeline/99-execution-plan.md`, line 799: `- [ ] 5.1.3 Implement V8 adapter`
**Codebase Evidence:** Same file, line 247: `5.1.3 ~~Implement V8 adapter~~ **(DEFERRED — future phase)**`

**The Problem:** Task 5.1.3 is correctly marked as ~~strikethrough~~ and "DEFERRED" in the session detail (line 247), but appears as an unchecked `- [ ]` item in the master Task Checklist at the bottom (line 799). This creates confusion about whether it should be done.

**Options:**

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A | Mark as `- [~] 5.1.3 ~~Implement V8 adapter~~ (DEFERRED)` or remove from checklist | Clear it's not part of this iteration | Minor doc edit |
| B | Leave as-is — the session detail makes it clear | No effort | Confusing in the summary checklist |

**🎯 Recommendation:** Option A — Either remove from checklist or mark clearly as deferred. The task checklist should be an accurate count of work to do.

**User Decision:** ⏳ Pending

---

### PF-010: `npm-check-updates` in dependencies — no explicit migration task 🟡 MINOR

**Dimension:** Dependency Issues
**Location:** `plans/schema-driven-pipeline/06-mcp-server-refactor.md`, line 531 (note about moving to devDependencies)
**Codebase Evidence:** `package.json`, line 61: `"npm-check-updates": "^19.3.2"` under `dependencies`

**The Problem:** The plan correctly identifies that `npm-check-updates` should be in `devDependencies` (not `dependencies`), noting it on line 531. However, there's no explicit task in the execution plan for this move. It could easily be forgotten during implementation.

**Options:**

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A | Add a task to Phase 16.1 (Cleanup) to move `npm-check-updates` to devDependencies | Ensures it happens; cleanup phase is the right place | Minor task addition |
| B | Add to Phase 1 (early cleanup while touching package.json) | Fixed early | Could be seen as scope creep in Phase 1 |

**🎯 Recommendation:** Option A — Add to Phase 16.1 (Cleanup). This is exactly the kind of housekeeping that belongs in the final cleanup phase.

**User Decision:** ⏳ Pending

---

## 🔵 OBSERVATION

---

### PF-008: Verify command inconsistency between execution plan and project.md 🔵 OBSERVATION

**Dimension:** Consistency
**Location:** `plans/schema-driven-pipeline/99-execution-plan.md` (every session's Verify line); `.clinerules/project.md` (Verify section)

**The Problem:** Every session in the execution plan uses `clear && yarn clean && yarn build && yarn test` as the verify command. But `.clinerules/project.md` defines the verify command as `clear && sleep 3 && yarn build && yarn test` (no `yarn clean`). The `clean` step (`rm -rf dist`) adds safety but also adds time. This is not a defect — just an inconsistency to be aware of.

**Options:**

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A | Standardize on `yarn build && yarn test` (project.md) for quick iterations, `yarn clean && yarn build && yarn test` for phase completion only | Faster iteration, clean only when needed | Two verify patterns |
| B | Leave as-is — `yarn clean` before build is safer | Maximum safety | Slightly slower |

**🎯 Recommendation:** No action needed. Both commands work. Implementors can use `yarn clean` for certainty at session end and skip it during iteration.

**User Decision:** ⏳ Pending

---

## Dimensions with No Findings

The following dimensions were scanned thoroughly and produced no findings:

| # | Dimension | Notes |
|---|-----------|-------|
| 1 | **Ambiguities** | Plan language is specific throughout. Terms are defined. Schema types are precise. |
| 2 | **Implicit Assumptions** | Key assumptions (syntactic ts-morph, no yarn install, sparse checkout) are all explicitly documented with rationale. |
| 6 | **Feasibility Concerns** | ts-morph syntactic extraction is sound; API Extractor fallback adds robustness; cost estimates are reasonable; timeline is realistic given scope. |
| 7 | **Testability** | Comprehensive testing strategy (08-testing-strategy.md) with clear coverage goals, mock strategies, and fixture designs. |
| 8 | **Security Blind Spots** | N/A for this project type (documentation server). LLM API keys handled via GitHub Secrets and env vars — appropriate. |
| 9 | **Edge Cases** | Error handling tables cover all identified edge cases (missing files, parse failures, story size limits, schema corruption). |
| 10 | **Scope Creep Indicators** | V8 adapter correctly deferred. "Should Have" items clearly separated from "Must Have". |
| 11 | **Ordering & Sequencing** | Dependency graph in 99-execution-plan.md is correct. Parallel paths (Scraper ∥ Schema Infra) are properly identified. |
