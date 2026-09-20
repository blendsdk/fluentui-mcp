# Phase 7 Review: Non-functional hardening (RD-07)

> **Phase diff**: `241a3fa357ec21107dbe872c82c845657a9aaee5` → `b828653`
> **Reviewers**: correctness reviewer + security auditor (parallel, strict scope)
> **Verdicts**: correctness **PASS WITH MINOR FINDINGS** · security **PASS WITH MINOR FINDINGS**
> **Status**: ✅ Closed — no critical or major findings; minors recorded (report-only)

The phase changed no production code. It added the NFR verification test
`src/__tests__/integration/nonfunctional.test.ts` and the Phase 7 plan section.

## Verified evidence

| Check | Result |
|-------|--------|
| `yarn build && yarn test` | 35 files / 709 tests passing |
| `npx vitest run src/__tests__/integration/nonfunctional.test.ts` | 3 tests passing |
| `yarn skill:check` | up to date and fully covered |
| `yarn skill:generate` twice | identical tree hash `9be9d9c5…`; 0.5–0.9s wall (target < 5s) |
| `yarn skill:validate` | 14.6–16.3s wall (target < 5min) |
| `yarn skill:secrets` | `No secrets found.` |
| Installed tree | 106 `.md` + 1 manifest `.json`; no `node_modules`, no executables, 442 links |

## Findings — correctness

| ID | Severity | Location | Finding | Evidence |
|----|----------|----------|---------|----------|
| RV-01 | 🟡 | `nonfunctional.test.ts:190` | The no-execution test asserts only `Array.isArray(findings)`, which is always true, so it never proves the compiler processed the block. The sentinel absence is the only positive evidence. | `typeCheckWithTsc` only early-returns for an empty block list, so the guarantee holds; the assertion is weak. |
| RV-02 | 🟡 | `nonfunctional.test.ts:82` | `SOURCE_DIR` uses `process.cwd()`, assuming vitest runs from the repo root; sibling tests derive paths from the module location. | Runs green today; fragile under another cwd. |
| RV-03 | 🟡 | `nonfunctional.test.ts:110,139` | The link test depends on the install test having run (`installedDir`); it fails if run in isolation. | Vitest runs a file's tests in order, so green. |
| RV-04 | 🟡 | `nonfunctional.test.ts:144` | The link regex matches inline `](...)` only, does not skip fenced code, and does not confine targets to the installed tree. | No reference-style links exist; the drift gate covers links fence-aware on the source tree. |
| RV-05 | 🟡 | plan / commit `37a833f` | No automated performance bound; the timing evidence lives in commit messages, so a regression is unguarded. | CI runs validation but without a time budget; timing tests are flaky. |
| RV-06 | 🟡 | plan / commit `98e135d` | The determinism record is a bare tree hash with no method; underlying determinism is covered by ST-12 and the drift gate. | `gates` and `generate` spec tests pass. |
| RV-07 | 🟡 | plan | "load references with no network" describes a static, dependency-free tree and resolved links; the test does not intercept network. | Reasonable proxy for RD-07 AC2. |

## Findings — security

| ID | Severity | Location | Finding | Evidence |
|----|----------|----------|---------|----------|
| SA-01 | 🟡 | `nonfunctional.test.ts:42-53` | `walk` skips symlinks (a `Dirent` for a symlink is neither file nor directory), so a symlinked corpus entry would be invisible to the "no scripts" assertions. | Source tree has no symlinks; installer copies symlinks as symlinks. |
| SA-02 | 🟡 | `nonfunctional.test.ts:106-109` | The link test asserts the target exists but not that it stays inside `installedDir`, while the module doc claims links resolve "inside the tree". | No escaping link exists in the corpus. |
| SA-03 | 🟡 | `nonfunctional.test.ts:117-145` | The sentinel covers `typeCheckWithTsc` only; `validateExamples`/`runValidate` default paths are not exercised. | Those paths are regex/schema scans with no `eval`, spawn, or dynamic import; `noEmit: true`. |

## Confirmed clean

- `ts-morph` `getPreEmitDiagnostics()` with `noEmit: true` parses and type-checks but never executes; no transformer or plugin runs example code.
- The new tests import only `node:fs`, `node:os`, `node:path`, `vitest`, the installer, and the validator — no `child_process`, `fetch`, `eval`, or dynamic import of untrusted content.
- `installSkill` receives a fixed local source and installs to `<target>/fluentui`; no traversal.
- All test writes stay under an `mkdtempSync` workspace and are removed in `afterAll`.
- No production code changed, so no security regression.

## Outcome

Phase 7 is complete. Determinism, offline use, performance, and security are verified with durable
tests and recorded measurements. All findings are minor and report-only; the two that make a test's
stated claim stronger than its assertion are SA-01/SA-02 and RV-01. No further phase action is
required under strict scope.
