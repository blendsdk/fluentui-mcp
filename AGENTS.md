# AGENTS.md

<!-- CODEOPS-PROJECT:START -->

## Project

`fluentui-skill` is a Node.js (`>=20`) TypeScript package and CLI. It scrapes FluentUI React v9,
enriches it with LLM prose, generates the `fluentui` Agent Skill as Markdown, and installs it into
an agent's skills directory. ESM (`"type": "module"`), package manager npm, license MIT.

## Commands

| Command                                      | Purpose                                                                    |
| -------------------------------------------- | -------------------------------------------------------------------------- |
| `npm run build`                              | Typecheck and compile `src/**` to `dist/` using `tsconfig.build.json`.      |
| `npm run typecheck`                          | Typecheck the build project without emitting.                              |
| `npm test`                                   | Run the Vitest suite.                                                      |
| `npm run test:release`                       | Run the release-tool spec tests with `node --test`.                        |
| `npm run verify`                             | Full verification. Run this before finishing any task.                     |
| `npm run test:coverage`                      | Coverage report.                                                           |
| `npm run check:version`                      | Version parity across `package.json` and `package-lock.json`.              |
| `npm run gate:skill`                         | All four skill gates (drift, example, freshness, secrets).                 |
| `npm run skill:generate`                     | Render `.agents/skills/fluentui/` from the enhanced schema.                |
| `npm run skill:check`                        | Drift gate: regenerate and compare with the committed tree.                |
| `npm run skill:validate`                     | Example gate: check imports, props, and members against the real package.  |
| `npm run skill:freshness`                    | Freshness gate: the committed tree matches the current enhanced schema.    |
| `npm run skill:secrets`                      | Secret scan of the generated skill content.                                |
| `npm run scrape -- --version v9 --clone`     | Scrape props, slots, and stories from FluentUI source.                     |
| `npm run enhance -- --version v9 --full`     | Add LLM prose to the enhanced schema; needs a local `.env`.                |
| `npm run assemble`                           | Assemble the publishable `skills/` tree.                                   |
| `npm run pipeline:full`                      | scrape → enhance → build → test in one command.                            |

## Layout

- `src/` — CLI (`bin.ts`) and the skill installer (`skill/`). Shared schema types live in
  `src/types/`; the validator in `src/schema/schema-validator.ts`.
- `scripts/scraper/` — `ts-morph` extraction from FluentUI source.
- `scripts/enhancer/` — LLM enrichment through the configured provider.
- `scripts/skill/` — generation plus the drift, freshness, example, and secret gates.
- `scripts/release.mjs` and `scripts/check-version.mjs` — the release tool and its version-parity
  guard; `scripts/release.spec.test.mjs` covers the version rules.
- `.agents/skills/fluentui/` — generated, committed skill tree.
- `data/v9/` — raw and enhanced schemas. Source data; not shipped.
- `src/__tests__/` and `scripts/**/tests/` — Vitest tests. `*.spec.test.ts` files are the oracle
  and must not be edited to match an implementation; `*.impl.test.ts` files cover internals.
- `requirements/` (requirement docs and `decisions/` ADRs) and `plans/` (plan and execution
  tracking). CodeOps uses the flat layout.

## Generated files

`.agents/skills/fluentui/**` and `.fluentui-skill-manifest.json` are generated. Change the schema
and run `npm run skill:generate`; never edit them by hand. `npm run skill:check` fails on drift.

## Release

Versions are derived from conventional commits and published by a manual GitHub Actions workflow.

- `node scripts/release.mjs release --type auto --tag latest --ci --git-push` derives the next
  version, writes `package.json` and `package-lock.json`, updates `CHANGELOG.md`, commits, tags,
  and publishes.
- `node scripts/release.mjs release --type auto --tag latest --dry-run` previews without writing.
- `npm run check:version` guards against version drift. `package.json` is the only place the
  version is written; never edit it by hand.
- `.github/workflows/release.yml` (Actions → Release) runs the same command. It uses npm trusted
  publishing (OIDC), so the trusted publisher on npmjs.com must name the workflow file
  `release.yml`.

## Conventions

- Imports use ESM `.js` specifiers even for TypeScript sources.
- Public and exported APIs, and non-trivial internals, carry JSDoc. Do not reference `plans/`,
  `requirements/`, or plan IDs in code or comments.
- Node built-ins use the `node:` prefix.
- Commits use Conventional Commit messages with a scope, such as `test(repo):` or `docs(plan):`.

<!-- CODEOPS-PROJECT:END -->
