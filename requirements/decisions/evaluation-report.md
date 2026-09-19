# Skill vs. MCP Content Evaluation

> **Status**: Complete (one-time evidence)
> **Date**: 2026-09-19
> **Authorising decision**: AR-19 (evaluation is one-time evidence, not a CI gate)

## Purpose

This report records one-time evidence that the generated **Agent Skill** is at least as
API-correct as the retired documentation-server content it replaced. It compares the two content
sets on a fixed prompt set and counts how many unknown package, symbol, or member references each
arm produces.

## Provenance

| Arm | Content source |
| --- | --- |
| Skill | The generated tree at `.agents/skills/fluentui/` (schema hash `8c045d9514aa489c58edbcf29ce3042a569df850323a78d4787cfcb33fdad3c5`). |
| MCP | The enhanced schema the server served, recovered from Git history: `git show 5eeab6a:data/v9/fluentui-schema-enhanced.json`. `5eeab6a` is the last revision before the runtime was deleted at `3bfc3fb`. |

Both arms derive from the same underlying FluentUI schema. The comparison therefore measures the
**presentation** each delivery path gives an agent, not a different data source.

## Fixed prompt set

| # | Prompt | Theme |
| - | ------ | ----- |
| 1 | Build a login form with email and password fields. | Form |
| 2 | Build a sortable table of projects with a name and an owner column. | Data table |
| 3 | Build a confirmation dialog that asks before deleting a file. | Dialog |
| 4 | Build in-page tab navigation that switches between two panels. | Navigation |
| 5 | Wrap an app so it uses a FluentUI theme. | Theming |

## Method

1. For each prompt and each arm, one TypeScript answer was produced from **only that arm's**
   content: the generated references for the skill arm, and the recovered schema entries for the
   MCP arm.
2. Each answer was scored with the example validator's own checks, so the scoring rule is the same
   gate the skill ships with:
   - **Tier 1a** — the imported package resolves.
   - **Tier 1b** — every named import is a real export of that package.
   - **Tier 2** — the TypeScript compiler reports no unknown member or symbol (report-only in the
     gate, counted here as evidence).
3. Raw answers are kept under the ignored `.cache/evaluation/` directory.

## Results

Unknown-reference count per answer (lower is better):

| Prompt | Arm | Unresolved package (1a) | Unknown export (1b) | Unknown member/symbol (tier 2) |
| ------ | --- | --- | --- | --- |
| Login form | Skill | 0 | 0 | 0 |
| Data table | Skill | 0 | 0 | 0 |
| Confirmation dialog | Skill | 0 | 0 | 0 |
| Tab navigation | Skill | 0 | 0 | 0 |
| Theming | Skill | 0 | 0 | 0 |
| **Skill total** | | **0** | **0** | **0** |
| Login form | MCP | 0 | 0 | 0 |
| Data table | MCP | 0 | 0 | 0 |
| Confirmation dialog | MCP | 0 | 0 | 0 |
| Tab navigation | MCP | 0 | 3 | 3 |
| Theming | MCP | 0 | 0 | 0 |
| **MCP total** | | **0** | **3** | **3** |

The three MCP-arm errors are `Tabs`, `TabPanels`, and `TabPanel`. None are exports of
`@fluentui/react-components`; the real exports are `TabList` and `Tab`. The retired schema's
`tab-navigation` pattern imported all three invalid names, so an agent following that content
produced code that does not compile. The skill's navigation recipe uses only `TabList` and `Tab`,
and tabbed content is regular JSX rather than an invented `TabPanels` wrapper.

## Conclusion

On the fixed prompt set, the skill arm produced **0** unknown API references and the MCP arm
produced **3**, all in the navigation answer. The skill is therefore at least as API-correct as the
retired MCP content, and it corrects the one class of error the retired content contained. Forms,
tables, dialogs, and theming were correct in both arms.

The skill's advantage comes from its curated routing and prose: `SKILL.md` sends a task to the
foundation, category, or recipe page that carries the verified pattern, which avoids the component
entries whose scraped inventory was wrong.

## Limitations

- **One evaluator.** A single agent produced both arms' answers. The scoring itself is mechanical
  (the shipped export resolver and the TypeScript compiler), but answer authoring is not
  independent. A future evaluation could add a second model as an independent answer producer.
- **Shared provenance.** Both arms derive from the same schema, so the result speaks to presentation
  quality rather than to the underlying data.
- **Five prompts.** The set is small and was chosen to cover the common themes; it is not a
  statistical sample.
- **Component inventory.** The scraped inventory still contains non-exported names such as
  `Provider` and `Tabs`; correcting it is tracked separately. This evaluation did not fix that
  inventory, and the skill's routing is what keeps those entries from being chosen for the tested
  prompts.

No credential material appears in this report.
