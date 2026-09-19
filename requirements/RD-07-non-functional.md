# RD-07: Non-Functional Requirements

> **Document**: RD-07-non-functional.md
> **Status**: Draft
> **Created**: 2026-09-19
> **Project**: FluentUI Agent Skill
> **Depends On**: RD-01 … RD-06
> **CodeOps Skills Version**: 3.20.0

---

## Feature Overview

This requirement collects the cross-cutting qualities the skill and its pipeline must meet:
determinism, offline use, bounded performance, cost visibility, security, reproducibility,
compatibility, accessibility, and maintainability. These are shared contracts across several
features, so they live in one document rather than being duplicated in each RD.

## Functional Requirements

### Must Have

- **Determinism**: generating the skill twice from the same enhanced schema yields byte-identical
  generated files; the only non-deterministic value in the pipeline is the recorded
  `generatedAt` timestamp.
- **Offline use**: the installed skill requires no network, no server, and no `node_modules` to be
  read by an agent.
- **Cost visibility**: every paid enhancement run prints an estimate and requires confirmation
  unless `--yes` is set.
- **Fail-fast**: DeepSeek-mode failures abort rather than emitting partial content.
- **Reproducibility**: the raw schema records the pinned FluentUI tag and commit; the manifest
  records the schema hash used for a given skill build.
- **Compatibility**: the skill conforms to the Agent Skills format (`SKILL.md` with `name` and
  `description`, name matching its directory, bounded body).
- **Accessibility**: every recipe and category guide that demonstrates interaction includes the
  applicable accessibility guidance (labels, keyboard support, ARIA), consistent with the WCAG 2.1
  AA level claimed in component guidance.
- **Secrets**: no credentials are committed, logged, or written into generated files.

### Should Have

- **Portability**: the installer supports Linux, macOS, and Windows (copy mode).
- **Observability**: each pipeline run reports counts of generated, skipped, and failed items and
  total token usage.
- **Maintainability**: no source file exceeds roughly 700 lines; pipeline stages are independently
  runnable.

### Won't Have (Out of Scope)

- High-availability or uptime targets — there is no service.
- Multi-tenant isolation, data residency, or GDPR data handling — no user data is stored.
- Localization of the skill content — English only.

## Technical Requirements

| Quality | Target |
|---------|--------|
| Deterministic generation | Byte-identical output across runs; verified by the drift gate |
| Skill generation time | < 5 seconds for the full tree on a developer machine |
| Example validation time | < 5 minutes for the full skill |
| Enhancement run | Full run bounded by provider; incremental run limited to changed entries |
| Skill source size | Committed skill tree small enough to review; individual reference files load on demand |
| `SKILL.md` body | ≤ 500 lines |
| Node runtime | Node.js ≥ 20 |
| Package contents | No `data/`; `dist/`, `skills/`, `README.md`, `LICENSE` only |
| Offline | Agent use requires zero network calls |

## Integration Points

This RD constrains RD-01 … RD-06 and is enforced by RD-04's gates.

## Scope Decisions

| Decision | Options Considered | Chosen | Rationale | AR Ref |
|----------|-------------------|--------|-----------|--------|
| Runtime dependency | Offline corpus / read installed package | Offline corpus | Works without a project or network | AR-11 |
| Cost control | Silent run / estimate + confirm | Estimate + confirm, `--yes` bypass | Prevents surprise spend | AR-08 |
| Reproducibility | Track master / pin tag | Pin release tag, record commit | Stable, reviewable regeneration | AR-20 |
| Compatibility target | Agent-specific / Agent Skills format | Agent Skills format | Broad client support | AR-01 |

## Security Considerations

> **🚨 Mandatory.**

- **Secrets management**: `DEEPSEEK_API_KEY` lives only in a gitignored `.env`; the secrets gate
  (RD-04) scans generated output.
- **Input validation / path safety**: installer and generator reject path traversal.
- **Injection prevention**: no shell interpolation anywhere in the pipeline; the example validator
  never executes code.
- **Encryption**: HTTPS to the DeepSeek endpoint; npm transport over TLS.
- **Security testing**: tests cover path traversal rejection, secret scanning, and the
  no-execution guarantee.

## Acceptance Criteria

1. [ ] Two consecutive generator runs produce identical hashes for every generated file.
2. [ ] An installed skill is usable with no network access and without `node_modules`.
3. [ ] A full-skill example validation completes in under 5 minutes on CI.
4. [ ] An enhancement run without `--yes` and without confirmation makes no paid calls.
5. [ ] `SKILL.md` body is ≤ 500 lines and its `name` matches the directory.
6. [ ] A cloned repo at the recorded commit regenerates the same skill content modulo `generatedAt`.
7. [ ] Security requirements verified: no test or script executes scraped or generated code; secret
       scan passes.
