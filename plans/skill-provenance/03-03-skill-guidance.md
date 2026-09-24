# Skill Guidance: Skill Provenance Disclosure

> **Document**: 03-03-skill-guidance.md
> **Parent**: [Index](00-index.md)

## Overview

This component edits the hand-written `.agents/skills/fluentui/SKILL.md`. It adds a hard rule that
makes the agent disclose the covered provenance, cite the references it consulted, and refuse
uncovered APIs, and it corrects the `compatibility` value to match the real React peer range.
`SKILL.md` is never generated (`scripts/skill/generate.ts:203`), so this work is authored by hand
and guarded by the existing format rules.

## Architecture

### Current Architecture

`SKILL.md` opens with YAML frontmatter (`name`, `description`, `license`, `compatibility`,
`metadata.author`) and a body of seven hard rules. `scripts/skill/format.ts` validates the
frontmatter and caps the body at 500 lines. The drift gate does not compare `SKILL.md`, so it is
not regenerated; only the format rules constrain it.

### Proposed Changes

1. Fix the `compatibility` line to state the real React peer range.
2. Add hard rule 8 for provenance disclosure and the "not covered" fallback.
3. (Verified) The body stays well under the 500-line limit and the description stays under 1024
   characters.

## Implementation Details

### Frontmatter

Replace the current `compatibility` value:

```yaml
compatibility: FluentUI React v9 with React 16.14–19 (peer range >=16.14.0 <20.0.0); examples import from @fluentui/react-components and @fluentui/react-icons.
```

The range is taken from `@fluentui/react-components`'s declared peer dependency
(`>=16.14.0 <20.0.0`).

### New Hard Rule

Append to the `## Hard rules` list:

```markdown
8. **Disclose the covered version and stay inside it.** Answer from what this skill
   version covers — see `## Source & versions` in `references/index.md`. State the
   covered Fluent UI version, list the reference files you used, and if a component,
   prop, or API is not present in the references, say it is **not covered by this
   skill version** instead of guessing.
```

This rule builds on existing rules 1 (check the installed version) and 3 (never invent a prop):
rule 1 compares the user's installed version, rule 8 now gives the agent the snapshot's covered
version and the required phrasing when the two do not meet.

## Code Examples

### Before and after

```markdown
# Before
compatibility: FluentUI React v9 with React 17/18; examples import from @fluentui/react-components and @fluentui/react-icons.

# After
compatibility: FluentUI React v9 with React 16.14–19 (peer range >=16.14.0 <20.0.0); examples import from @fluentui/react-components and @fluentui/react-icons.
```

## Error Handling

This component adds prose only; it has no runtime error paths. The existing `validateSkillFormat`
check (`scripts/skill/format.ts`) enforces the frontmatter `name`, the non-empty and bounded
description, and the 500-line body limit.

| Error Case | Handling Strategy | AR Ref |
| ---------- | ----------------- | ------ |
| Body exceeds 500 lines | Format gate fails; keep the rule concise | AR-7 |
| Frontmatter name mismatches the directory | Format gate fails; unchanged by this feature | AR-7 |

> **Traceability:** Each strategy references the Ambiguity Register entry that resolved it. See
> `00-ambiguity-register.md`.

## Testing Requirements

- Spec test asserting the hard rule text is present and names `references/index.md`,
  the covered-version citation, the consulted references, and "not covered by this skill version".
- Spec test asserting the `compatibility` value contains the real peer range.
- Existing `validateSkillFormat` tests continue to pass (body and description limits).
