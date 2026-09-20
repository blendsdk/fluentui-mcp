# FluentUI Agent Skill

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org/)

> An **Agent Skill** that teaches a coding assistant to build user interfaces with
> [Microsoft FluentUI React v9](https://react.fluentui.dev/) from verified, offline reference
> material.

The skill replaces the earlier documentation server. It ships a complete knowledge base — component
pages, category guides, foundations, and task recipes — as plain Markdown plus a manifest, so an
agent can read it with no network, no package install, and no running process.

---

## What is this?

A coding agent that only knows the FluentUI name tends to guess. It invents props that do not exist,
mixes v8 patterns into v9 code, and skips accessibility. This skill fixes that: before writing
component code, the agent reads the relevant reference page and copies a pattern that was checked
against the real `@fluentui/react-components` package.

The content covers:

- **Foundations** — setup and imports, `FluentProvider`, theming and tokens, Griffel styling,
  component architecture, and accessibility.
- **Components** — one page per component with props, slots, and examples taken from FluentUI's own
  Storybook source.
- **Categories** — shared guidance for each of the eight component groups (buttons, forms,
  navigation, data display, feedback, overlays, layout, utilities).
- **Recipes** — nineteen task-oriented walkthroughs such as a login form, a data table, a
  confirmation dialog, and a dashboard shell.
- **Quick reference** — short checklists and a component cheat sheet.
- **Templates** — copy-ready starting points under `assets/templates/`.

The full index is generated into `references/index.md`. The skill entry point is `SKILL.md`, which
tells the agent how to route a task to the right reference.

---

## Install

Install the skill into your agent's skills directory. Requires Node.js 20 or later:

```bash
npx -y fluentui-skill skill install
```

The installer detects common agent skill directories and copies the skill into place. Options:

```text
fluentui skill install [options]

  --all                 Install into every detected client
  --target <dir>        Install into a specific skills directory (repeatable)
  --project             Use project-level skill directories
  --link                Symlink to the source instead of copying
  --dry-run             Show what would happen without writing
  -h, --help            Show this help
```

Other commands are `fluentui skill status` to show the installed version and
`fluentui skill uninstall` to remove it.

---

## Contents and routing

The agent reads `SKILL.md` first. That file maps a task to a reference:

| If the task is about…                                  | Read                                             |
| ------------------------------------------------------ | ------------------------------------------------ |
| Project setup, imports, or the provider                | `references/foundation/getting-started.md`       |
| Theming, dark mode, design tokens, or right-to-left    | `references/foundation/theming.md`               |
| Writing styles with Griffel                            | `references/foundation/styling-griffel.md`       |
| A specific component's props or examples               | `references/components/<component>.md`           |
| A whole class of controls (all buttons, all inputs)    | `references/categories/<category>.md`            |
| A concrete job such as a login form or a data table    | `references/recipes/<group>/<recipe>.md`         |
| A short cheat sheet or checklist                       | `references/quick-reference/<topic>.md`          |
| An overview of everything available                    | `references/index.md`                            |

---

## How it is generated

The repository is a small pipeline. The skill is **generated**, never hand-edited:

```text
┌───────────┐   ┌───────────┐   ┌──────────────────────────┐   ┌──────────┐
│  Scraper  │ → │ Enhancer  │ → │  Enhanced schema (JSON)  │ → │ Generator │
│ (ts-morph)│   │  (LLM)    │   │  deterministic API data  │   │ Markdown │
└───────────┘   └───────────┘   └──────────────────────────┘   └──────────┘
   props,          prose:          single source of truth         skill tree
   slots,          descriptions,                                   + manifest
   stories         guidance
```

1. **Scrape** — `ts-morph` reads FluentUI's TypeScript source and extracts props, slots, and
   stories. The scraper pins the latest stable release tag and records the commit in the schema.
2. **Enhance** — an LLM adds prose (descriptions, best practices, accessibility notes, prop
   guidance) on top of the deterministic API data. The step is incremental: unchanged entries are
   skipped.
3. **Generate** — a deterministic generator renders the enhanced schema into the Markdown tree and
   writes `.fluentui-skill-manifest.json`.

The separation matters: API facts (names, props, imports) come only from the scraper, so they are
grounded in the real package. The LLM contributes prose, never invented APIs.

---

## Regeneration workflow

Run the pipeline from a checkout:

```bash
# 1. Scrape the pinned FluentUI release (clones the upstream repository)
npm run scrape -- --version v9 --clone

# 2. Add or refresh the LLM prose for changed entries
npm run enhance -- --version v9 --full

# 3. Render the skill tree and its manifest
npm run skill:generate

# 4. Check that the committed tree matches a fresh generation
npm run skill:check

# 5. Validate every example against the real package
npm run skill:validate

# 6. Confirm the committed tree matches the current enhanced schema, and that
#    no secret leaked
npm run skill:freshness
npm run skill:secrets
```

`npm run pipeline:full` chains scrape, enhance, build, and test in one command. Enhancement needs an
LLM provider configured in a local `.env` (see `.env.example`); the other steps are offline.

### Gates and manifest

Generation is guarded by gates, and the manifest records enough to verify a tree:

| Gate              | Command                  | What it checks                                                                 |
| ----------------- | ------------------------ | ------------------------------------------------------------------------------ |
| Drift             | `npm run skill:check`    | Regenerating from the same schema reproduces the committed files byte-for-byte. |
| Example           | `npm run skill:validate` | Every TypeScript example imports real exports and uses real props and members. |
| Freshness         | `npm run skill:freshness` | The committed tree matches the current enhanced schema (manifest hash).      |
| Secrets           | `npm run skill:secrets`  | No API key or credential is embedded in the generated content.                 |

`.fluentui-skill-manifest.json` contains:

- `schemaHash` — hash of the enhanced schema the tree was generated from.
- `generatorVersion` — version of the renderer that produced the tree.
- `generatedAt` — timestamp carried over from the schema, so regeneration is reproducible.
- `files` — a SHA-256 hash per generated file, used by the drift gate.

The generated tree is committed under `.agents/skills/fluentui/` and published inside the
`fluentui-skill` package. The source `data/` directory is not shipped.

---

## Decisions

Architecture decision records live under [`requirements/decisions/`](requirements/decisions/). They
explain why the project moved from a documentation server to an Agent Skill, how the three-layer
content model works, why generation is deterministic, how the LLM step is bounded, and why example
validation is the trust guarantee.

---

## Development

```bash
git clone https://github.com/blendsdk/fluentui-mcp.git
cd fluentui-mcp
npm install

npm run build          # Compile TypeScript
npm test               # Run the test suite
npm run test:coverage  # Coverage report

npm run scrape         # Run the scraper
npm run enhance        # Run the enhancer
npm run skill:generate # Render the skill
npm run skill:check    # Drift gate
npm run skill:validate # Example gate
```

### Release

Publishing is a manual GitHub Actions workflow (Actions → Release) that runs
`node scripts/release.mjs release --type auto --tag latest --ci --git-push`. The same command works
locally. Versions are derived from conventional commits, and `npm run check:version` guards the
parity between `package.json` and `package-lock.json`. Publishing uses npm trusted publishing
(OIDC), so the trusted publisher configured on npmjs.com must name the workflow file `release.yml`.

---

## License

MIT — see [LICENSE](LICENSE) for details.
