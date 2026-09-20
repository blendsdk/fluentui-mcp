# RD-04: Content Integrity Gates

> **Document**: RD-04-content-integrity.md
> **Status**: Draft
> **Created**: 2026-09-19
> **Project**: FluentUI Agent Skill
> **Depends On**: RD-03
> **CodeOps Skills Version**: 3.20.0

---

## Feature Overview

This requirement defines the automated checks that let the skill claim its content is correct.
The central guarantee is that every code example type-checks against the real
`@fluentui/react-components` package and every component or prop named in prose exists in the
scraped schema. Supporting gates prove the committed skill matches its source (drift and
freshness), the format is valid, no secrets leaked, and every schema entity has a reference file.

These gates are what distinguish this skill from reworded API text: correctness is machine-checked,
not asserted.

## Functional Requirements

### Must Have

- [ ] **Example validation**: every fenced `tsx`/`ts` block in the skill references is extracted
      and checked in tiers:
      - Tier 1a — every `@fluentui/react-components` / `@fluentui/react-icons` import resolves.
      - Tier 1b — every named import exists in the resolved package's exports.
      - Tier 2 — blocks are type-checked with TypeScript against the real installed package.
- [ ] API errors (unknown package, symbol, or member) **fail the gate**. Type-only errors are
      reported for local repair and do not fail CI — AR-19.
- [ ] Example validation never executes code: it writes blocks to a throwaway project and invokes
      the compiler with an argument array, never through a shell.
- [ ] **API-reference check**: every component name and prop name mentioned in generated prose
      exists in the raw schema; unknown references fail the gate.
- [ ] **Drift gate**: regenerating the skill produces byte-identical generated files to the
      committed tree (`--check` mode); any missing, added, or changed generated file fails.
- [ ] **Freshness gate**: the manifest's recorded schema hash matches the current enhanced
      schema; a mismatch fails and instructs the operator to regenerate.
- [ ] **Format gate**: `SKILL.md` frontmatter has a valid `name` matching the directory, a
      description within the format limit, and a body within 500 lines; `references/index.md`
      exists.
- [ ] **Secrets gate**: no generated or hand-written skill file contains key-like material (API
      keys, tokens, private keys).
- [ ] **Coverage gate**: every component, category, recipe, foundation, and quick-reference entry
      in the enhanced schema has a corresponding reference file, and every internal link resolves.

### Should Have

- [ ] The example validator reports file, line, tier, and a plain-language message per problem.
- [ ] The freshness gate is available locally and in the publish workflow, but is not run on every
      push where it would block unrelated edits.

### Won't Have (Out of Scope)

- Executing examples or rendering components — static validation only.
- Running LLM enhancement inside CI on every push.
- Visual or screenshot testing.

## Technical Requirements

### Gate commands

| Gate | Command | Blocks |
|------|---------|--------|
| Example validation | `yarn skill:validate` | CI on every push; publish |
| API-reference check | part of `skill:validate` | CI |
| Drift | `yarn skill:check` | CI |
| Freshness | `yarn skill:freshness` | publish workflow |
| Format | `yarn test` (spec test) | CI |
| Secrets | `yarn skill:validate` / `skill:secrets` | CI |
| Coverage | part of `skill:check` | CI |

### Example extraction rules

| Content | Treated as example? |
|---------|---------------------|
| `tsx`/`ts` fence in a component/recipe/foundation reference | Yes |
| Fence whose info string ends in `fragment` | Import-checked only, not type-checked |
| API signature listings under a reference `api` section | Import-checked only |
| Fences in `SKILL.md` that are illustrative snippets | Import-checked only |

### Throwaway project

The tier-2 check installs `@fluentui/react-components`, `@fluentui/react-icons`, React, and
TypeScript in a temporary directory under the ignored cache, compiles with `tsc --noEmit`, and
parses compiler diagnostics. It never mutates the repository.

## Integration Points

### With RD-03

The drift and coverage gates reuse the generator's mapping and `--check` mode.

### With RD-05

The publish workflow runs the freshness gate before packaging.

### With RD-02

The example validator provides the feedback loop for repairing recipe examples written by the LLM.

## Scope Decisions

| Decision | Options Considered | Chosen | Rationale | AR Ref |
|----------|-------------------|--------|-----------|--------|
| Example strictness | Gate API errors, repair types / gate all types | Gate API errors; repair type-only | Blocks misleading examples without excessive repair | AR-19 |
| Example source | Validate LLM code / validate scraped stories + recipes | Validate all rendered examples | Only recipes contain authored code | AR-09 |
| Freshness cadence | Every push / publish only | Publish only, available locally | Avoids blocking unrelated edits | AR-20 |
| Execution | Type-check / run | Type-check only | Examples need a host app context | AR-19 |

## Security Considerations

> **🚨 Mandatory.** The validator processes untrusted Markdown and invokes a compiler.

- **Data sensitivity**: none.
- **Input validation**: extracted code is written only inside a fixed temp directory; file paths
  derived from reference paths are canonicalized.
- **Authentication & authorization**: N/A.
- **Injection risks**: the compiler is invoked with an argument array, never a shell string; code
  is never executed.
- **Encryption needs**: none.
- **Rate limiting**: N/A.
- **Infrastructure**: none.

## Acceptance Criteria

1. [ ] A deliberately broken example that imports `{ NotAButton } from '@fluentui/react-components'`
       fails `yarn skill:validate` with tier `1b` and the symbol name in the message.
2. [ ] An example with a wrong prop type (a type-only error) is reported but does not fail the
       gate; the report names file, line, and tier.
3. [ ] Editing a generated file by one byte causes `yarn skill:check` to fail naming that file;
       no hand-written file is compared.
4. [ ] Changing the enhanced schema without regenerating causes `yarn skill:freshness` to fail with
       a regenerate instruction.
5. [ ] A `SKILL.md` whose body exceeds 500 lines or whose `name` differs from its directory fails
       the format test.
6. [ ] A planted fake secret (`sk-` prefixed string) in a reference fails the secrets gate.
7. [ ] Removing a component from the schema without removing its reference file fails the coverage
       gate; a broken relative link also fails.
8. [ ] Security requirements verified: example validation never executes extracted code and never
       invokes a shell.
