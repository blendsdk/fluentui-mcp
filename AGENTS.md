# AGENTS.md

<!-- CODEOPS-PROJECT:START -->

## Project

`fluentui-skill` is a Node.js (`>=20`) TypeScript package and CLI. It scrapes FluentUI React v9,
enriches it with LLM prose, generates the `fluentui` Agent Skill as Markdown, and installs it into
an agent's skills directory. ESM (`"type": "module"`), package manager Yarn, license MIT.

## Commands

| Command                            | Purpose                                                                    |
| ---------------------------------- | -------------------------------------------------------------------------- |
| `yarn build`                       | Typecheck and compile `src/**` to `dist/` using `tsconfig.build.json`.      |
| `yarn test`                        | Run the Vitest suite.                                                      |
| `yarn build && yarn test`          | Full verification. Use this before finishing any task.                     |
| `yarn test:coverage`               | Coverage report.                                                           |
| `yarn skill:generate`              | Render `.agents/skills/fluentui/` from the enhanced schema.                |
| `yarn skill:check`                 | Drift gate: regenerate and compare with the committed tree.                |
| `yarn skill:validate`              | Example gate: check imports, props, and members against the real package.  |
| `yarn skill:freshness`             | Freshness gate: the committed tree matches the current enhanced schema.    |
| `yarn skill:secrets`               | Secret scan of the generated skill content.                                |
| `yarn scrape --version v9 --clone` | Scrape props, slots, and stories from FluentUI source.                     |
| `yarn enhance --version v9 --full` | Add LLM prose to the enhanced schema; needs a local `.env`.                |
| `yarn assemble`                    | Assemble the publishable `skills/` tree.                                   |
| `yarn pipeline:full`               | scrape → enhance → build → test in one command.                            |

## Layout

- `src/` — CLI (`bin.ts`) and the skill installer (`skill/`). Shared schema types live in
  `src/types/`; the validator in `src/schema/schema-validator.ts`.
- `scripts/scraper/` — `ts-morph` extraction from FluentUI source.
- `scripts/enhancer/` — LLM enrichment through the configured provider.
- `scripts/skill/` — generation plus the drift, freshness, example, and secret gates.
- `.agents/skills/fluentui/` — generated, committed skill tree.
- `data/v9/` — raw and enhanced schemas. Source data; not shipped.
- `src/__tests__/` and `scripts/**/tests/` — Vitest tests. `*.spec.test.ts` files are the oracle
  and must not be edited to match an implementation; `*.impl.test.ts` files cover internals.
- `requirements/` (requirement docs and `decisions/` ADRs) and `plans/` (plan and execution
  tracking). CodeOps uses the flat layout.

## Generated files

`.agents/skills/fluentui/**` and `.fluentui-skill-manifest.json` are generated. Change the schema
and run `yarn skill:generate`; never edit them by hand. `yarn skill:check` fails on drift.

## Conventions

- Imports use ESM `.js` specifiers even for TypeScript sources.
- Public and exported APIs, and non-trivial internals, carry JSDoc. Do not reference `plans/`,
  `requirements/`, or plan IDs in code or comments.
- Node built-ins use the `node:` prefix.
- Commits use Conventional Commit messages with a scope, such as `test(repo):` or `docs(plan):`.

<!-- CODEOPS-PROJECT:END -->
