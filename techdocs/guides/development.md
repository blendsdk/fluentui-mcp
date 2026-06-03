# Development Workflow

> **Last Updated**: 2026-06-04

## Coding Conventions

From `.clinerules/project.md`:

- **Files**: kebab-case
- **Components/Classes**: PascalCase
- **Functions/Methods**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Language**: TypeScript ESM — use `.js` import extensions in TS source.
- **Tests**: live in `src/__tests__/<area>/`, run with Vitest.
- **Additive enrichment**: every enrichment field is optional; formatters render
  a section only when the field is present.

## Verify Before Commit

```bash
yarn build && yarn test
```

The runtime (`src/`) is built with `tsc -p tsconfig.build.json`; the pipeline
scripts (`scripts/`) are typechecked via `tsconfig.json` and executed with
`tsx` (not built into `dist/`).

## The Schema Pipeline

The pipeline is **offline** and produces the bundled enhanced schema. See
[ADR-002](/decisions/ADR-002-bundled-enhanced-json) for why.

### Stage 1 — Scrape

```bash
yarn scrape --version v9 --clone --verbose
```

Discovers FluentUI packages, extracts components/props/slots/stories/utilities
via ts-morph, and writes `data/v9/fluentui-schema.json`.

- `--clone` shallow-clones the FluentUI repo (cached), or use `--source <path>`
  for a local checkout. (`--source` and `--clone` are mutually exclusive.)
- `--contrib <path>` / `--contrib-ref <ref>` add the contrib repo.
- `--output <path>` overrides the output location.

### Stage 2 — Enhance

```bash
yarn enhance --version v9 --full --verbose
```

Enriches the raw schema with the configured LLM provider and writes
`data/v9/fluentui-schema-enhanced.json`. Every write is validated; the CLI
exits non-zero on any validation error.

- `--full` re-enhances everything (ignores the diff). Without it, enhancement is
  diff-based against the previous enhanced schema.
- Requires provider env vars (see [Configuration](/reference/configuration)).
- Model handling is family-aware — see
  [ADR-003](/decisions/ADR-003-llm-provider-model-family).

### Whole pipeline

```bash
yarn pipeline:full
# = scrape --clone --verbose → enhance --full --verbose → build → test
```

## CI/CD

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `ci.yml` | push / PR to `main` | Build & test on Node 20 and 22 |
| `publish.yml` | manual (`workflow_dispatch`) | Build, test, verify package, publish to npm (release is manual) |
| `update-docs.yml` | manual (`workflow_dispatch`) | Scrape + enhance + build/test, then open a PR with the updated `data/` schema |
| `deploy-techdocs.yml` | push to `main` (`techdocs/**`) + manual | Build this VitePress site and deploy to GitHub Pages |

### `update-docs.yml` operational prerequisites

The workflow is valid against the current scraper/enhancer CLIs, but it depends
on two repo settings that are **not** in code:

1. **Repository secrets** must be set: `LLM_PROVIDER`,
   `OPENAI_API_KEY` and/or `ANTHROPIC_API_KEY`, and optionally `LLM_MODEL`.
   Without them the enhance step fails at runtime.
2. **PR-creation permission**: Settings → Actions → General → "Allow GitHub
   Actions to create and approve pull requests" must be enabled for the
   `peter-evans/create-pull-request` step to open its PR.

### Publishing to npm

`publish.yml` is manual only. Run it from the Actions tab; it defaults to a
dry run and only publishes when `dry_run=false`. It requires the `NPM_TOKEN`
secret. The publish job runs after `build-and-test` passes.

## Adding a Tool

See [API Design → Adding or Changing a Tool](/architecture/api-design#adding-or-changing-a-tool).
