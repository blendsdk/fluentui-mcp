# Ambiguity Register: Skill Provenance Disclosure

> **Status**: ✅ GATE PASSED — all 11 items resolved
> **Last Updated**: 2026-09-24 21:32
> **CodeOps Artifact Schema**: 1

This is a standalone plan with no upstream RD. This register is the owning record for every
plan-local decision; the RD amendments named in AR-6 and AR-11 are modifications to the
requirements set, not inputs to it.

| # | Category | Ambiguity / Gap | Options Considered | Decision | Status |
|---|----------|-----------------|--------------------|----------|--------|
| AR-1 | UX & presentation | Where the provenance tuple is surfaced to a consuming agent | Generated section in `index.md` / dedicated `references/provenance.md` / both / manifest only | A generated `## Source & versions` section in `references/index.md`, plus a hard rule in `SKILL.md` | ✅ Resolved — User |
| AR-2 | Data | Which provenance fields to disclose | commit+ref only / +umbrella version / +skill version / +generator+schema hash / +`generatedAt` / +per-package versions | FluentUI ref + commit, umbrella version, skill version, generator version + schema hash, and component package version range. `generatedAt` stays manifest-only (see AR-4) | ✅ Resolved — User |
| AR-3 | Technical | Source of the umbrella `@fluentui/react-components` version, and how the current corpus obtains it | Record the resolved stable tag at scrape / explicit field at scrape / derive from `ref` | Capture the umbrella package name + version in `sources.fluentui` at scrape time; run a same-commit scrape refresh now (no tag change, no LLM); defer the stable-tag re-scrape to a separate task | ✅ Resolved — User |
| AR-4 | Technical | `generatedAt` conflicts with RD-03's rule that generated files carry no timestamps | Manifest only / amend RD-03 / include anyway | Keep `generatedAt` in the manifest only (as today); `references/**` stays timestamp-free | ✅ Resolved — User |
| AR-5 | UX & presentation | How to present the 38 per-package component versions | Compact range + count / full table in `index.md` / summary plus a separate file | Compact range + count (for example `38 packages, 9.2.17–9.17.12`) | ✅ Resolved — User |
| AR-6 | Scope | Plan form and ownership | Standalone plan / new RD first | Standalone plan; amend RD-03 for the provenance output | ✅ Resolved — User |
| AR-7 | Scope | The React compatibility mismatch (SKILL.md says 17/18; the real peer range is `>=16.14.0 <20.0.0`) | Include the fix / track separately | Include the fix in `SKILL.md` | ✅ Resolved — User |
| AR-8 | Technical | Keeping the npm skill version in sync with generated output | Auto from `package.json` + regenerate on release / hand-written frontmatter with a parity gate / omit the npm version | The generator reads `package.json`; the release flow regenerates the skill after the bump | ✅ Resolved — User |
| AR-9 | Naming | Branch and plan-folder names | `feat/skill-provenance` / `feat/provenance-disclosure` / `docs/skill-provenance` | Branch `feat/skill-provenance`; folder `plans/skill-provenance/` | ✅ Resolved — User |
| AR-10 | Non-functional | Which command fills every Verify line | `npm run verify` / `npm test` | `npm run verify` (the project standard in `AGENTS.md`) | ✅ Resolved — Author (matches project convention) |
| AR-11 | Traceability | The umbrella capture changes the scraper, owned by RD-01 | Amend RD-01 / plan-local only | Amend RD-03 for the provenance output; add a one-line RD-01 note recording the new source field | ✅ Resolved — Author (factual field addition; no behavior change) |
| AR-12 | Technical (runtime) | The drift gate compares the committed tree against generated output, but the plan scheduled regeneration in Phase 4 while the generator changes in Phase 2 | Regenerate at Phase 2 then again after the Phase 4 re-scrape / run the gate only at Phase 4 | Regenerate the committed tree whenever the generator changes (Phase 2), and again in Phase 4 after the corpus refresh. No behavior change. | ✅ Resolved — Necessary correction (execution sequencing) |

## Resolution Notes

**AR-1 … AR-9:** Confirmed by the user on 2026-09-24 before plan authoring.

**AR-10 and AR-11:** Implementation and traceability choices with no behavioral or scope impact.
AR-10 matches the project's existing verify command (`AGENTS.md`). AR-11 records a factual
schema-field addition in the scraper owned by RD-01 and authorizes no behavior change.

No plan document may implement a decision outside this register.
