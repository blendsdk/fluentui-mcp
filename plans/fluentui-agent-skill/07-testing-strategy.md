# Testing Strategy: FluentUI Agent Skill

> **Document**: 07-testing-strategy.md
> **Parent**: [Index](00-index.md)

## Testing Overview

### Coverage Goals

| Code type | Target |
| --------- | ------ |
| Pipeline core (scraper/enhancer/generator/gates) | 90% |
| Installer and CLI | 85% |
| Config and glue | 60% |

- Test names state behavior: `should [expected] when [condition]`.
- Integration tests cover scrape→enhance (fixture) and generate→install.
- E2E: the full skill tree is generated from a fixture schema and installed into a temp target.
- Security tests are mandatory (path traversal, secrets, no-execution).

## 🚨 Specification Test Cases (MANDATORY)

> Derived from the RD set and the plan registers. Expectations come from the specification, never
> from imagined implementation behavior. The immutable-oracle rule applies.

### Scraper coverage (RD-01)

| # | Input / Scenario | Expected Output / Behavior | Source |
| - | ---------------- | -------------------------- | ------ |
| ST-1 | Scrape the pinned fixture containing CompoundButton, MenuButton, SplitButton, ToggleButton, ProgressBar, SearchBox, DataGrid | Coverage report marks each as `scraped`; each appears in `components[]` with that exact `name` and a kebab-case `id` | RD-01 AC1 |
| ST-2 | Scrape a fixture whose source ref is tag `@fluentui/react-components_v9.x` | `sources.fluentui.ref` equals that tag; `sources.fluentui.commit` is 40 chars | RD-01 AC2 |
| ST-3 | Scrape the same checkout twice | JSON identical except `generatedAt` and `scrapedAt` | RD-01 AC5 |
| ST-4 | Provide `--source` containing `..` escaping the resolved root | Scraper rejects with a path-escape error; no read outside root | RD-01 AC7 |

### DeepSeek enhancement (RD-02)

| # | Input / Scenario | Expected Output / Behavior | Source |
| - | ---------------- | -------------------------- | ------ |
| ST-5 | `LLM_PROVIDER=deepseek`, no `DEEPSEEK_API_KEY` | Exit non-zero naming `DEEPSEEK_API_KEY`; no network call | RD-02 AC1 |
| ST-6 | `DEEPSEEK_REASONING_EFFORT=bogus` | Rejected before any call | RD-02 AC2 |
| ST-7 | Stub response with `finish_reason=length` | Item fails; no file written; run exits non-zero in DeepSeek mode | RD-02 AC3 |
| ST-8 | Enhance a component | `enhanced` has no `commonPatterns`/`compositionExamples`; no prose field contains a fenced code block | RD-02 AC4 |
| ST-9 | Full enhance of fixture | `categoryGuidance` has 8 entries; recipes match the 19 ids | RD-02 AC5 |
| ST-10 | `--dry-run` | Zero LLM calls; zero files written; cost report printed | RD-02 AC6 |
| ST-11 | Unchanged `sourceHash` without `--full` | Item skipped (no call) | RD-02 AC7 |

### Skill generator (RD-03)

| # | Input / Scenario | Expected Output / Behavior | Source |
| - | ---------------- | -------------------------- | ------ |
| ST-12 | Generate twice from the same enhanced schema | Generated files byte-identical | RD-03 AC1 |
| ST-13 | Generate from a valid schema | File set equals mapping: 6 foundation, N components, 8 categories, one per recipe, 5 quick-ref, `index.md` | RD-03 AC2 |
| ST-14 | Inspect generated vs hand-written files | Generated end with the marker; `SKILL.md` and templates do not | RD-03 AC3 |
| ST-15 | Component with `stories: []` | No Examples heading in its file | RD-03 AC4 |
| ST-16 | `SKILL.md` | Frontmatter `name === "fluentui"`; body ≤ 500 lines | RD-03 AC5 |
| ST-17 | Malformed schema input | Exit non-zero; no file under the skill tree changed | RD-03 AC6 |
| ST-18 | Schema id `../evil` | Rejected before any write | RD-03 AC7 |

### Integrity gates (RD-04)

| # | Input / Scenario | Expected Output / Behavior | Source |
| - | ---------------- | -------------------------- | ------ |
| ST-19 | Example importing `{ NotAButton }` from `@fluentui/react-components` | `skill:validate` fails with tier `1b` and the symbol name | RD-04 AC1 |
| ST-20 | Example with a wrong prop type | Reported (file, line, tier 2) but gate passes | RD-04 AC2 |
| ST-21 | One-byte edit to a generated file | `skill:check` fails naming that file; hand-written edits ignored | RD-04 AC3 |
| ST-22 | Change enhanced schema without regenerate | `skill:freshness` fails with regenerate instruction | RD-04 AC4 |
| ST-23 | `SKILL.md` with 501-line body or wrong name | Format test fails | RD-04 AC5 |
| ST-24 | Planted `sk-…` string in a reference | Secrets gate fails | RD-04 AC6 |
| ST-25 | Prose references a nonexistent prop `frobnicate` | API-reference check reports it (WARN) but does not fail — PR-12 | RD-04 must-have (as amended by PR-12) |
| ST-26 | Delete a component reference or break a relative link | Coverage gate fails | RD-04 AC7 |

### Installer & packaging (RD-05)

| # | Input / Scenario | Expected Output / Behavior | Source |
| - | ---------------- | -------------------------- | ------ |
| ST-27 | `npm pack --dry-run` | Includes `skills/fluentui/SKILL.md` and `dist/`; excludes `data/` | RD-05 AC1 |
| ST-28 | `fluentui skill install --target <tmp>` | Creates `<tmp>/fluentui/SKILL.md` and marker with `version` = package version | RD-05 AC2 |
| ST-29 | `status --target <tmp>` installed / empty | Exit 0 with version / exit non-zero | RD-05 AC3 |
| ST-30 | `uninstall --target <tmp>` with a sibling skill present | Removes only `fluentui/`; sibling intact | RD-05 AC4 |
| ST-31 | Leftover `.fluentui-skill.tmp-*` exists | Cleaned up; re-install succeeds | RD-05 AC5 |
| ST-32 | `--dry-run` | Writes nothing; prints destinations | RD-05 AC6 |
| ST-33 | `--target ../outside` | Resolved safely; no write outside the resolved directory | RD-05 AC7 |

### Retirement & docs (RD-06, RD-08)

| # | Input / Scenario | Expected Output / Behavior | Source |
| - | ---------------- | -------------------------- | ------ |
| ST-34 | Grep repository (excl. `node_modules`, history) | No `@modelcontextprotocol`, no `docs/v9`, no `techdocs/` | RD-06 AC1–6 |
| ST-35 | `yarn build && yarn test` after deletion | Passes | RD-06 AC4 |
| ST-36 | Read `README.md` | No `mcpServers`, no MCP tool names; install command present | RD-08 AC1 |
| ST-37 | List `requirements/decisions/` | `ADR-001..005` exist, each names its AR entry | RD-08 AC2 |

## Test Categories

### Specification Tests
> Written BEFORE implementation. Filed as `[feature].spec.test.ts`.

| Test file | ST cases | Component |
| --------- | -------- | --------- |
| `src/__tests__/scraper/coverage.spec.test.ts` | ST-1..ST-4 | Scraper |
| `src/__tests__/enhancer/deepseek.spec.test.ts` | ST-5..ST-11 | Enhancer |
| `src/__tests__/skill/generate.spec.test.ts` | ST-12..ST-18 | Generator |
| `src/__tests__/skill/gates.spec.test.ts` | ST-19..ST-26 | Gates |
| `src/__tests__/skill/install-skill.spec.test.ts` | ST-27..ST-33 | Installer |
| `src/__tests__/repo/repo-hygiene.spec.test.ts` | ST-34..ST-37 | Cleanup/Docs |

### Implementation Tests
> Written AFTER implementation. Filed as `[feature].impl.test.ts`.

| Test file | Description | Priority |
| --------- | ----------- | -------- |
| `src/__tests__/enhancer/deepseek.impl.test.ts` | Retry/backoff, token accounting, config parsing | High |
| `src/__tests__/skill/render.impl.test.ts` | Escaping, story selection, empty sections | High |
| `src/__tests__/skill/install-skill.impl.test.ts` | Atomic replace, symlink, leftover cleanup | Med |

### Integration Tests

| Test | Components | Description |
| ---- | ---------- | ----------- |
| fixture pipeline | scraper → enhancer (mock) → schema | raw fixture to enhanced schema with categories/recipes |
| generate → install | generator → installer | generate to temp, install into temp, assert tree |

### End-to-End Tests

| Scenario | Steps | Expected Result |
| -------- | ----- | --------------- |
| Full skill build | scrape fixture → enhance mock → generate → gates → assemble → pack | packable package with valid skill |

## Test Data

### Fixtures Needed
- A mock FluentUI source tree including the Button family and abbreviated-name packages.
- A fixture enhanced schema with components, 8 categories, and 19 recipes.
- A planted bad-import example and a planted secret for gate tests.

### Mock Requirements
- A mock LLM provider for enhancement tests (no network). Real DeepSeek only in manual runs.

## Verification Checklist
- [ ] All ST cases defined with concrete input/output pairs
- [ ] Every ST case traces to an RD or register entry
- [ ] Spec tests written BEFORE implementation
- [ ] Spec tests verified to FAIL before implementation (red phase)
- [ ] All spec tests pass after implementation (green phase)
- [ ] Implementation tests written for edge cases and internals
- [ ] All tests pass; no regressions
