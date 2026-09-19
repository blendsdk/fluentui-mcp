# RD-08: Documentation, Decisions & Evaluation

> **Document**: RD-08-docs-evaluation.md
> **Status**: Draft
> **Created**: 2026-09-19
> **Project**: FluentUI Agent Skill
> **Depends On**: RD-03, RD-06
> **CodeOps Skills Version**: 3.20.0

---

## Feature Overview

This requirement makes the project understandable to a new maintainer after the MCP era: it
rewrites the README around the skill, records the architectural decisions that reshaped the
repository, and produces one-time evidence that the skill is at least as correct as the MCP output
it replaced. It also fills the gap left by deleting `techdocs/` (AR-16) by locating architecture
decisions in `requirements/decisions/` (AR-22).

## Functional Requirements

### Must Have

- [ ] `README.md` is rewritten to describe the Agent Skill: what it is, how to install it
      (`npx -y fluentui-skill skill install`), what it contains, and how it is generated.
- [ ] `README.md` contains no MCP installation, configuration, or tool documentation.
- [ ] Architecture decision records live under `requirements/decisions/` and cover at least:
      - `ADR-001` — Retire the MCP server in favor of an Agent Skill.
      - `ADR-002` — Three-layer content model (deterministic API + stories, LLM prose, routing).
      - `ADR-003` — Deterministic generator from the enhanced schema.
      - `ADR-004` — DeepSeek-flash-max with fail-fast and no fallback.
      - `ADR-005` — Example validation against the real FluentUI package as the trust guarantee.
- [ ] A maintenance section documents the regeneration workflow (scrape → enhance → generate →
      gates) and the meaning of the manifest and gates.
- [ ] The evaluation compares the skill against the retired MCP content on a fixed prompt set and
      records which arm produced more API-correct answers.

### Should Have

- [ ] `AGENTS.md` reflects the surviving toolchain and commands.
- [ ] The evaluation is a one-time evidence exercise with a written report, not a CI gate.
- [ ] The README links to `requirements/` for decisions.

### Won't Have (Out of Scope)

- Reviving VitePress or any rendered documentation site — AR-16.
- End-user documentation for FluentUI itself (the skill is the artifact).
- Continuous evaluation in CI.

## Technical Requirements

### Evaluation method

| Element | Detail |
|---------|--------|
| Prompts | A fixed set covering forms, tables, dialogs, navigation, and theming |
| Skill arm | The generated `references/` content as context |
| MCP arm | The retired MCP content recovered from git history |
| Scoring | Each produced TypeScript block is checked for unknown package, symbol, or member; fewer API errors and more complete answers win |
| Output | A report under `requirements/decisions/` or `plans/`, plus raw answers in an ignored cache |

### Decision record format

Each ADR states: context, decision, alternatives considered, consequences, and the AR reference
that authorized it.

## Integration Points

### With RD-06

Cleanup creates the documentation gap this RD fills; ADRs must precede or accompany the removal of
`techdocs/`.

### With RD-04

The evaluation reuses the example validator's API checks for scoring.

## Scope Decisions

| Decision | Options Considered | Chosen | Rationale | AR Ref |
|----------|-------------------|--------|-----------|--------|
| Architecture docs home | `requirements/decisions/` + README / lightweight `docs/` / `plans/` | `requirements/decisions/` + README | No build tooling; durable Markdown | AR-22 |
| VitePress | Keep / delete | Delete | Fewer artifacts; user decision | AR-16 |
| Evaluation cadence | CI gate / one-time evidence | One-time evidence | Cost and flakiness; correctness is already gated by RD-04 | AR-19 |

## Security Considerations

> **🚨 Mandatory.** Documentation must not leak operational secrets.

- **Data sensitivity**: evaluation reports must not include API keys or provider response bodies.
- **Input validation**: N/A for static docs.
- **Authentication & authorization**: N/A.
- **Injection risks**: examples in docs are fenced, not executed; the validator treats them as
  data.
- **Encryption needs**: none.
- **Rate limiting**: N/A.
- **Infrastructure**: N/A.

## Acceptance Criteria

1. [ ] `README.md` contains no occurrence of `mcpServers`, `fluentui-mcp` as an install target, or
       MCP tool names.
2. [ ] `requirements/decisions/ADR-001..005` exist and each names its authorizing AR entry.
3. [ ] The regeneration workflow section lists the exact commands for scrape, enhance, generate,
       and each gate.
4. [ ] The evaluation report states the prompt set, the scoring rule, the per-arm API-error counts,
       and a conclusion; it contains no credential material.
5. [ ] `AGENTS.md` lists the surviving verify commands and no MCP commands.
6. [ ] Security requirements verified: no documentation contains a secret or provider response
       body.
