# Installer & Packaging: FluentUI Agent Skill

> **Document**: 03-04-installer-packaging.md
> **Parent**: [Index](00-index.md)
> **Implements**: RD-05

## Overview

This specification defines how the skill ships and installs: npm package `fluentui-skill`, bin
`fluentui`, the `skill install|status|uninstall` commands, the assemble build step, and package
contents. Publishing itself is manual (PR-3).

## Architecture

### Proposed Changes

- Add `src/skill/install-skill.ts` (compiled) and `src/bin.ts` (dispatcher).
- Add `scripts/skill/assemble.ts` to copy `.agents/skills/fluentui/` → `skills/fluentui/`.
- Update `package.json`: name, bin, files, scripts; remove MCP and VitePress deps.

## Implementation Details

### CLI

```
fluentui skill install   [--all | --target DIR | --project] [--link] [--dry-run]
fluentui skill status    [--all | --target DIR | --project]
fluentui skill uninstall [--all | --target DIR | --project] [--dry-run]
```

### Clients and paths

| Client | Global | Project |
| ------ | ------ | ------- |
| OpenCode | `~/.config/opencode/skills` | `.opencode/skills` |
| Claude Code | `~/.claude/skills` | `.claude/skills` |
| Codex | `~/.codex/skills` | `.codex/skills` |
| Shared `.agents` | `~/.agents/skills` | `.agents/skills` |

Detected when the global dir, its parent, or the project dir exists. `--target` overrides.

### Install mechanics

- Destination is `<target>/fluentui`.
- Copy into a temp sibling `.fluentui-skill.tmp-<pid>`, then rename over the destination; back up
  and restore on failure; clean leftover temp/backup dirs from prior runs.
- `--link` creates a directory symlink (junction on Windows).
- Marker `.fluentui-skill.json` = `{ version, source: 'fluentui-skill', installedAt }`.
- Uninstall removes only `fluentui/`.

### Packaging

| Field | Value |
| ----- | ----- |
| `name` | `fluentui-skill` |
| `bin` | `{ "fluentui": "dist/bin.js" }` |
| `files` | `["dist/", "skills/", "README.md", "LICENSE"]` |
| `prepack` | build → assemble → test → gates |
| `engines.node` | `>=20` |

`data/` is not published (AR-14).

## Integration Points

- Consumes the generator output (03-02).
- Runs gates before packaging (03-03).
- Enables MCP retirement once install works (03-05).

## Error Handling

| Error Case | Handling Strategy | AR Ref |
| ---------- | ----------------- | ------ |
| No clients detected | Print guidance; exit non-zero | AR-07 |
| Interrupted install | Clean temp/backup; re-install succeeds | AR-07 |
| `--target` with `..` | Resolve safely; never write outside | AR-07 |
| Dest is a non-skill dir | Refuse to overwrite unrelated content | AR-07 |

## Testing Requirements

- Spec tests: install creates `SKILL.md` + marker; status exit codes; uninstall leaves siblings.
- Impl tests: atomic replace, leftover cleanup, symlink mode, dry-run writes nothing.
- Packaging test: `npm pack --dry-run` includes `skills/fluentui/SKILL.md`, excludes `data/`.
