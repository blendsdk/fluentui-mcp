# Docs, Decisions & Evaluation: FluentUI Agent Skill

> **Document**: 03-06-docs-decisions-eval.md
> **Parent**: [Index](00-index.md)
> **Implements**: RD-08

## Overview

This specification records the architectural decisions that reshaped the repository, rewrites the
README around the skill, and produces one-time evidence that the skill is at least as API-correct as
the MCP content it replaced.

## Architecture

### Proposed Changes

- Rewrite `README.md` skill-first (no MCP install/config/tools).
- Add ADRs under `requirements/decisions/`.
- Add an evaluation report and a fixed prompt set.
- Update `AGENTS.md` commands.

## Implementation Details

### ADRs

| ADR | Title |
| --- | ----- |
| ADR-001 | Retire the MCP server in favor of an Agent Skill |
| ADR-002 | Three-layer content model |
| ADR-003 | Deterministic generator from the enhanced schema |
| ADR-004 | DeepSeek-flash-max with fail-fast and no fallback |
| ADR-005 | Example validation as the trust guarantee |

Each ADR states context, decision, alternatives, consequences, and its authorizing AR entry.

### README

Sections: what the skill is; install (`npx -y fluentui-skill skill install`); contents and routing;
how it is generated; regeneration workflow (scrape → enhance → generate → gates); gates and
manifest; decisions link; license.

### Evaluation

| Element | Detail |
| ------- | ------ |
| Prompts | Fixed set: form, data table, dialog, navigation, theming |
| Skill arm | Generated `references/` as context |
| MCP arm | Retired MCP content recovered from git history |
| Scoring | Count of unknown package/symbol/member per produced TS block, using the 03-03 checker |
| Output | Report under `requirements/decisions/`; raw answers in the ignored cache |

Evaluation is one-time evidence, not a CI gate (AR-19).

## Integration Points

- Depends on generated skill (03-02) and cleanup (03-05).
- Reuses the example validator (03-03) for scoring.

## Error Handling

| Error Case | Handling Strategy | AR Ref |
| ---------- | ----------------- | ------ |
| MCP content not recoverable | Note the commit used; document any gap | AR-19 |
| Evaluation inconclusive | Report honestly; skill correctness already gated by 03-03 | AR-19 |
| README misses a step | Cross-check against the execution plan | AR-22 |

## Testing Requirements

- Doc test: README contains no `mcpServers` or MCP tool names.
- Link test: ADR links and README links resolve.
- Evaluation report contains no secret material.
