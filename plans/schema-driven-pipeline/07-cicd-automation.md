# CI/CD & Automation

> **Document**: 07-cicd-automation.md
> **Parent**: [Index](00-index.md)

## Overview

Three GitHub Actions workflows automate the project lifecycle: CI (build & test on PR), Update Docs (run pipeline and commit results), and Publish (npm release). The update workflow is manual-trigger but fully automated once started — it clones FluentUI, scrapes, enhances, commits, and optionally opens a PR.

## Workflows

### 1. CI Workflow (`.github/workflows/ci.yml`)

**Trigger**: Push to master, pull requests to master
**Purpose**: Build and test on every change

```yaml
name: CI

on:
  push:
    branches: [master]
  pull_request:
    branches: [master]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [20, 22]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: yarn
      - run: yarn install --frozen-lockfile
      - run: yarn build
      - run: yarn test
```

### 2. Update Docs Workflow (`.github/workflows/update-docs.yml`)

**Trigger**: Manual dispatch (workflow_dispatch)
**Purpose**: Run full pipeline → commit results → open PR

```yaml
name: Update FluentUI Docs

on:
  workflow_dispatch:
    inputs:
      version:
        description: "FluentUI version to update (v9, v8)"
        required: true
        default: "v9"
        type: choice
        options: ["v9", "v8"]
      fluentui_ref:
        description: "FluentUI git ref (branch/tag/commit)"
        required: false
        default: "master"
      contrib_ref:
        description: "FluentUI-contrib git ref"
        required: false
        default: "main"
      full_enhance:
        description: "Full LLM re-enhancement (ignore diff)"
        required: false
        default: "false"
        type: choice
        options: ["true", "false"]
      dry_run:
        description: "Dry run (scrape only, no enhance/commit)"
        required: false
        default: "false"
        type: choice
        options: ["true", "false"]

env:
  FLUENTUI_VERSION: ${{ github.event.inputs.version }}

jobs:
  update:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write

    steps:
      # --- Setup ---
      - name: Checkout fluentui-mcp
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: yarn

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      # --- Clone FluentUI source ---
      - name: Clone FluentUI (sparse checkout)
        run: |
          git clone --depth 1 --filter=blob:none --sparse \
            https://github.com/microsoft/fluentui.git \
            /tmp/fluentui
          cd /tmp/fluentui
          git sparse-checkout set packages/react-components
          git checkout ${{ github.event.inputs.fluentui_ref || 'master' }}

      - name: Clone FluentUI-contrib
        run: |
          git clone --depth 1 \
            https://github.com/microsoft/fluentui-contrib.git \
            /tmp/fluentui-contrib
          cd /tmp/fluentui-contrib
          git checkout ${{ github.event.inputs.contrib_ref || 'main' }}

      # --- Stage 1: Scrape ---
      - name: Run scraper
        run: |
          yarn scrape \
            --version ${{ env.FLUENTUI_VERSION }} \
            --source /tmp/fluentui \
            --contrib /tmp/fluentui-contrib \
            --verbose

      # --- Stage 2: Enhance (skip on dry run) ---
      - name: Run enhancer
        if: ${{ github.event.inputs.dry_run != 'true' }}
        env:
          LLM_PROVIDER: ${{ secrets.LLM_PROVIDER }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          LLM_MODEL: ${{ secrets.LLM_MODEL }}
        run: |
          ENHANCE_FLAGS=""
          if [ "${{ github.event.inputs.full_enhance }}" = "true" ]; then
            ENHANCE_FLAGS="--full"
          fi
          yarn enhance --version ${{ env.FLUENTUI_VERSION }} $ENHANCE_FLAGS --verbose

      # --- Build & Test ---
      - name: Build
        run: yarn build

      - name: Test
        run: yarn test

      # --- Commit & PR (skip on dry run) ---
      - name: Create Pull Request
        if: ${{ github.event.inputs.dry_run != 'true' }}
        uses: peter-evans/create-pull-request@v6
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          commit-message: "chore(${{ env.FLUENTUI_VERSION }}): update FluentUI docs schema"
          title: "chore(${{ env.FLUENTUI_VERSION }}): Update FluentUI docs to latest"
          body: |
            ## Automated FluentUI Docs Update

            **Version**: ${{ env.FLUENTUI_VERSION }}
            **FluentUI ref**: ${{ github.event.inputs.fluentui_ref || 'master' }}
            **Contrib ref**: ${{ github.event.inputs.contrib_ref || 'main' }}
            **Full enhancement**: ${{ github.event.inputs.full_enhance }}

            This PR was automatically generated by the update-docs workflow.
            Review the schema changes in `data/${{ env.FLUENTUI_VERSION }}/`.
          branch: "update-docs/${{ env.FLUENTUI_VERSION }}"
          delete-branch: true
          labels: |
            automated
            documentation

      # --- Summary ---
      - name: Upload scraper report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: scraper-report-${{ env.FLUENTUI_VERSION }}
          path: |
            data/${{ env.FLUENTUI_VERSION }}/fluentui-schema.json
            data/${{ env.FLUENTUI_VERSION }}/fluentui-schema-enhanced.json
```

### 3. Publish Workflow (`.github/workflows/publish.yml` — existing, enhanced)

The existing publish workflow is preserved and enhanced to work with the new schema-based package.

Key changes:
- Verify `data/` directory is included in the package
- Verify schema file exists and is valid
- Keep the existing dry-run / manual trigger functionality

## Required GitHub Secrets

| Secret | Purpose | Required For |
|--------|---------|-------------|
| `NPM_TOKEN` | npm publish authentication | publish.yml |
| `LLM_PROVIDER` | LLM provider name ('openai' or 'anthropic') | update-docs.yml |
| `OPENAI_API_KEY` | OpenAI API key | update-docs.yml (if using OpenAI) |
| `ANTHROPIC_API_KEY` | Anthropic API key | update-docs.yml (if using Anthropic) |
| `LLM_MODEL` | LLM model name (optional) | update-docs.yml |

## Sparse Checkout Strategy

FluentUI is a massive repo. We use **sparse checkout** to only download what we need:

```bash
git clone --depth 1 --filter=blob:none --sparse \
  https://github.com/microsoft/fluentui.git /tmp/fluentui
cd /tmp/fluentui
git sparse-checkout set packages/react-components
```

This downloads only:
- `packages/react-components/` — all v9 component packages
- Skips: apps/, docs/, scripts/, change/, and all other packages

**Result**: ~200 MB instead of ~5 GB, takes ~1-2 minutes instead of ~15.

For v8, we'd also need:
```bash
git sparse-checkout add packages/react
```

## Workflow Execution Time Estimates

| Stage | Estimated Time | Notes |
|-------|---------------|-------|
| Checkout + setup | 1-2 min | Node setup, yarn install (cached) |
| Clone FluentUI (sparse) | 1-2 min | ~200 MB download |
| Clone contrib | 30 sec | Small repo |
| Scrape | 3-5 min | ts-morph parsing, story extraction |
| Enhance (incremental) | 2-5 min | Only changed components |
| Enhance (full) | 30-60 min | All components + guides |
| Build + test | 1-2 min | TypeScript compilation, vitest |
| Create PR | 30 sec | Git operations |
| **Total (incremental)** | **~10-15 min** | |
| **Total (full)** | **~40-70 min** | |

## Manual Execution

The pipeline can also be run locally:

```bash
# Clone repos locally
git clone --depth 1 https://github.com/microsoft/fluentui.git /tmp/fluentui
git clone --depth 1 https://github.com/microsoft/fluentui-contrib.git /tmp/fluentui-contrib

# Set LLM credentials
export LLM_PROVIDER=anthropic
export ANTHROPIC_API_KEY=sk-...

# Run full pipeline
yarn scrape --version v9 --source /tmp/fluentui --contrib /tmp/fluentui-contrib
yarn enhance --version v9
yarn build && yarn test
```

## Error Handling

| Error | Handling |
|-------|---------|
| FluentUI clone fails | Retry once; abort workflow with clear error |
| Scraper fails | Upload partial results as artifact; abort |
| Enhancer fails (LLM error) | Retry logic in enhancer; abort workflow if all retries fail |
| Tests fail | Do not create PR; upload test results as artifact |
| PR creation fails | Log error; schema is still in the branch |

## Testing Requirements

- Test that CI workflow runs successfully (build + test)
- Test that update workflow produces valid schema (can be tested locally)
- Test that publish workflow includes `data/` in the package
- Test sparse checkout works for both FluentUI and contrib repos
