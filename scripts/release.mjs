#!/usr/bin/env node
/**
 * Release tool for the single `fluentui-skill` package.
 *
 * The skill ships one package, so "the skill version" and "the published
 * package version" are the same value. This script derives the next version
 * from the conventional commit messages written since the last git tag, writes
 * it to `package.json` and `package-lock.json` in one step, regenerates the
 * committed skill tree so its provenance records the new version, records it in
 * `CHANGELOG.md`, commits and tags it, and publishes it. Because the version is
 * written once and then published, the two can never drift.
 *
 * Usage:
 *   node scripts/release.mjs version [--type auto|patch|minor|major] [--dry-run] [--ci] [--no-git-commit] [--git-push]
 *   node scripts/release.mjs publish --tag latest|next|beta [--access public] [--dry-run] [--git-push]
 *   node scripts/release.mjs release [--type auto|patch|minor|major] --tag latest|next|beta [--dry-run] [--git-push]
 *
 * @module release
 */

import { execFileSync } from "node:child_process"
import { readFileSync, realpathSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

/** Repository root: this file lives in `<root>/scripts/`. */
const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))

/** Changelog group label for each conventional commit type. */
const TYPE_LABELS = {
  feat: "Features",
  fix: "Fixes",
  perf: "Performance",
  refactor: "Refactors",
  docs: "Documentation",
  test: "Tests",
  build: "Build",
  ci: "CI",
  chore: "Chores",
  style: "Styles",
  revert: "Reverts",
}

/**
 * Bumps a plain semantic version by one position.
 *
 * @param version - Current version, for example `"1.0.0"`
 * @param type - Which position to bump: `"major"`, `"minor"`, or `"patch"`
 * @returns The next version
 * @throws When `version` is not a plain `x.y.z` or `type` is unknown
 * @example
 * semverBump("1.0.0", "minor") // "1.1.0"
 */
export function semverBump(version, type) {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)$/)
  if (!match) throw new Error(`Not a plain semver version: ${version}`)

  let major = Number(match[1])
  let minor = Number(match[2])
  let patch = Number(match[3])

  if (type === "major") {
    major += 1
    minor = 0
    patch = 0
  } else if (type === "minor") {
    minor += 1
    patch = 0
  } else if (type === "patch") {
    patch += 1
  } else {
    throw new Error(`Unknown bump type: ${type}`)
  }

  return `${major}.${minor}.${patch}`
}

/**
 * Tests whether a string is a plain semantic version.
 *
 * @param value - Candidate string
 * @returns True for `x.y.z`
 */
export function isValidVersion(value) {
  return /^\d+\.\d+\.\d+$/.test(value)
}

/**
 * Parses one commit into the fields the bump rules need.
 *
 * Release commits (`chore(release): ...`) and merge commits are ignored: they
 * are bookkeeping, not user-facing changes. A commit is breaking when the
 * subject carries `!` before the colon or the body contains `BREAKING CHANGE`.
 *
 * @param subject - Commit subject line
 * @param body - Commit body (used only for the breaking-change marker)
 * @returns A parsed commit, or `null` when the commit should be ignored
 */
export function parseCommit(subject, body = "") {
  const trimmed = subject.trim()
  if (trimmed.startsWith("Merge ") || trimmed.startsWith("chore(release):")) return null

  const match = trimmed.match(/^([a-zA-Z]+)(?:\(([^)]*)\))?(!)?:\s*(.*)$/)
  const breaking = Boolean(match && match[3]) || /BREAKING CHANGE/.test(body)

  if (!match) return { type: "other", scope: null, breaking, text: trimmed }

  const scope = match[2] || null
  const text = scope ? `${scope}: ${match[4]}` : match[4]
  return { type: match[1].toLowerCase(), scope, breaking, text }
}

/**
 * Determines the semantic version bump implied by a set of commits.
 *
 * Rules: a breaking change bumps major, a `feat` bumps minor, and every other
 * conventional type (or an unconventional message) bumps patch.
 *
 * @param commits - Commit records with `subject` and optional `body`
 * @returns `"major"`, `"minor"`, or `"patch"`
 */
export function determineBump(commits) {
  const parsed = commits
    .map((commit) => parseCommit(commit.subject, commit.body ?? ""))
    .filter(Boolean)

  if (parsed.some((commit) => commit.breaking)) return "major"
  if (parsed.some((commit) => commit.type === "feat")) return "minor"
  return "patch"
}

/**
 * Builds the Markdown section for one release.
 *
 * @param version - Version being released
 * @param date - Release date as `YYYY-MM-DD`
 * @param commits - Commit records with `subject` and optional `body`
 * @returns A Markdown section ending in a newline
 */
export function buildChangelogEntry(version, date, commits) {
  const parsed = commits
    .map((commit) => parseCommit(commit.subject, commit.body ?? ""))
    .filter(Boolean)

  const lines = [`## ${version} — ${date}`, ""]
  const breaking = parsed.filter((commit) => commit.breaking)

  if (breaking.length > 0) {
    lines.push("### Breaking Changes", "")
    for (const commit of breaking) lines.push(`- ${commit.text}`)
    lines.push("")
  }

  const grouped = new Map()
  for (const commit of parsed) {
    if (commit.breaking) continue
    const label = TYPE_LABELS[commit.type] ?? "Other"
    if (!grouped.has(label)) grouped.set(label, [])
    grouped.get(label).push(commit.text)
  }

  for (const [label, items] of grouped) {
    lines.push(`### ${label}`, "")
    for (const item of items) lines.push(`- ${item}`)
    lines.push("")
  }

  if (parsed.length === 0) lines.push("- No user-facing changes recorded.", "")

  return `${lines.join("\n")}\n`
}

// ---------------------------------------------------------------------------
// Git and npm operations
// ---------------------------------------------------------------------------

/**
 * Runs a git command and returns its trimmed stdout.
 *
 * @param args - Git arguments (without the leading `git`)
 * @returns Trimmed command output
 */
function git(args) {
  return execFileSync("git", args, { cwd: ROOT, encoding: "utf-8" }).trim()
}

/**
 * Runs a command with its output streamed to the terminal.
 *
 * @param command - Executable name
 * @param args - Argument list
 */
function run(command, args) {
  execFileSync(command, args, { cwd: ROOT, stdio: "inherit" })
}

/**
 * Returns the most recent tag, or `null` when the repository has none.
 *
 * @returns Tag name or null
 */
function lastTag() {
  try {
    return git(["describe", "--tags", "--abbrev=0"]) || null
  } catch {
    return null
  }
}

/**
 * Reads the commits written since the last tag.
 *
 * @returns Commit records with `subject` and `body`
 */
function readCommits() {
  const tag = lastTag()
  const range = tag ? `${tag}..HEAD` : "HEAD"
  const raw = git(["log", range, "--pretty=format:%s%x1f%b%x1e"])
  if (!raw) return []

  return raw
    .split("\x1e")
    .filter((record) => record.trim() !== "")
    .map((record) => {
      const [subject = "", body = ""] = record.split("\x1f")
      return { subject, body }
    })
}

/**
 * Reports whether anything changed since the last tag.
 *
 * @returns True when at least one file changed
 */
function changedSinceLastTag() {
  const tag = lastTag()
  if (!tag) return true
  return git(["diff", "--name-only", `${tag}..HEAD`]).split("\n").some(Boolean)
}

/**
 * Reads the current package version.
 *
 * @returns The `version` field of `package.json`
 */
function currentVersion() {
  return JSON.parse(readFileSync(join(ROOT, "package.json"), "utf-8")).version
}

/**
 * Refuses to release with uncommitted changes, so the tag points at exactly the
 * reviewed commit.
 */
function assertCleanTree() {
  const status = git(["status", "--porcelain"])
  if (status !== "") {
    throw new Error("working tree is not clean; commit or stash changes before releasing")
  }
}

/**
 * Refuses to release a tag that already exists.
 *
 * @param version - Version being tagged
 */
function assertTagAbsent(version) {
  const existing = git(["tag", "--list", `v${version}`])
  if (existing !== "") throw new Error(`tag v${version} already exists`)
}

/**
 * Writes the version to `package.json` and `package-lock.json`.
 *
 * `npm version` updates both files together, which is what keeps the package
 * metadata and its lockfile from drifting.
 *
 * @param version - Version to write
 */
function applyVersion(version) {
  run("npm", ["version", version, "--no-git-tag-version", "--ignore-scripts"])
}

/**
 * The paths staged by the release commit.
 *
 * Exported as a pure value so the staging set can be unit-tested without
 * invoking git, matching the existing pure-function spec-test style.
 *
 * @returns The `git add` argument list
 */
export function releaseStagePaths() {
  return ["package.json", "package-lock.json", "CHANGELOG.md", ".agents/skills/fluentui"]
}

/**
 * Regenerate the committed skill tree so it records the new skill version.
 *
 * The generator is deterministic and offline and makes no LLM call. The
 * regenerated tree is picked up by the release commit.
 *
 * @throws When the generator exits non-zero
 */
function regenerateSkill() {
  run("node", ["--import", "tsx", "scripts/skill/generate.ts"])
}

/**
 * Inserts a release section into an existing changelog.
 *
 * When the changelog has an `## Unreleased` section, it is replaced by the
 * generated entry, so the section appears once under its real version number
 * instead of lingering as an unreleased duplicate. Otherwise the entry is
 * inserted above the newest existing release.
 *
 * @param existing - Current `CHANGELOG.md` contents
 * @param entry - Generated Markdown section
 * @returns Updated changelog contents
 */
export function mergeChangelog(existing, entry) {
  const unreleased = /^## Unreleased[^\n]*\n/m.exec(existing)

  if (unreleased) {
    const start = unreleased.index
    const afterHeading = start + unreleased[0].length
    const nextSection = existing.indexOf("\n## ", afterHeading)
    const end = nextSection === -1 ? existing.length : nextSection + 1
    return existing.slice(0, start) + entry + existing.slice(end)
  }

  const firstSection = existing.search(/^## /m)
  return firstSection === -1
    ? `${existing.replace(/\s*$/, "")}\n\n${entry}`
    : `${existing.slice(0, firstSection)}${entry}${existing.slice(firstSection)}`
}

/**
 * Inserts the new release section at the top of `CHANGELOG.md`.
 *
 * @param version - Version being released
 * @param commits - Commit records written since the last tag
 */
function updateChangelog(version, commits) {
  const path = join(ROOT, "CHANGELOG.md")
  const existing = readFileSync(path, "utf-8")
  const date = new Date().toISOString().slice(0, 10)
  const entry = buildChangelogEntry(version, date, commits)

  writeFileSync(path, mergeChangelog(existing, entry), "utf-8")
}

/**
 * Commits the version bump and creates the release tag.
 *
 * @param version - Version being released
 * @param options - Commit options
 * @param options.ci - Append `[skip ci]` to avoid a CI loop
 * @param options.noGitCommit - Skip committing and tagging
 */
function commitAndTag(version, { ci, noGitCommit }) {
  if (noGitCommit) return

  run("git", ["add", ...releaseStagePaths()])
  run("git", ["commit", "-m", `chore(release): v${version}${ci ? " [skip ci]" : ""}`])
  run("git", ["tag", `v${version}`])
}

/**
 * Publishes the current package version to npm.
 *
 * @param details - Publish inputs
 * @param details.tag - npm dist-tag (`latest`, `next`, `beta`, ...)
 * @param details.access - npm access level
 * @param details.dryRun - Run `npm publish --dry-run` and publish nothing
 */
export function publish({ tag, access = "public", dryRun = false }) {
  const args = ["publish", "--access", access, "--tag", tag]
  if (dryRun) args.push("--dry-run")
  else if (process.env.CI) args.push("--provenance")
  run("npm", args)
}

/**
 * The git push operations performed after a release.
 *
 * Exported as a pure value so the refspecs can be unit-tested without invoking
 * git, matching the existing pure-function spec-test style. `--follow-tags`
 * pushes only annotated tags, while this repository's release tags are
 * lightweight, so the new tag is also pushed explicitly by name.
 *
 * @param version - Version being released, or omitted when publishing without a
 *   new tag
 * @returns The ordered `git` argument lists
 */
export function releasePushArgs(version) {
  const args = [["push", "--follow-tags"]]
  if (version) args.push(["push", "origin", `v${version}`])
  return args
}

/** Push the branch and, when a version is given, its release tag. */
function gitPush(version) {
  for (const args of releasePushArgs(version)) {
    run("git", args)
  }
}

/** Prints command usage. */
function printUsage() {
  console.log(`Release the single fluentui-skill package.

Usage:
  node scripts/release.mjs version [options]   Bump the version, regenerate the skill, changelog, commit, tag
  node scripts/release.mjs publish [options]   Publish the current version
  node scripts/release.mjs release [options]   version + publish

Options:
  --type auto|patch|minor|major   Version bump (default: auto, from commit messages)
  --tag latest|next|beta          npm dist-tag (required for publish/release)
  --access public|restricted      npm access level (default: public)
  --dry-run                       Show what would happen without writing or publishing
  --ci                            Add [skip ci] to the release commit
  --no-git-commit                 Skip the commit and tag (version command only)
  --git-push                      Push the release commit and tags
  -h, --help                      Show this help`)
}

/**
 * Parses the command line.
 *
 * @param argv - Arguments after the executable
 * @returns The command, parsed options, and an error message when invalid
 */
export function parseCli(argv) {
  const options = {
    type: "auto",
    tag: null,
    access: "public",
    dryRun: false,
    ci: false,
    noGitCommit: false,
    gitPush: false,
  }
  let command = "help"
  let index = 0

  const first = argv[0]
  if (first && !first.startsWith("-")) {
    if (["version", "publish", "release", "help"].includes(first)) {
      command = first
      index = 1
    } else {
      return { command, options, error: `unknown command '${first}'` }
    }
  }

  for (; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === "--dry-run") options.dryRun = true
    else if (arg === "--ci") options.ci = true
    else if (arg === "--no-git-commit") options.noGitCommit = true
    else if (arg === "--git-push") options.gitPush = true
    else if (arg === "-h" || arg === "--help") command = "help"
    else if (arg === "--type" || arg === "--tag" || arg === "--access") {
      const value = argv[index + 1]
      if (!value || value.startsWith("--")) {
        return { command, options, error: `${arg} requires a value` }
      }
      if (arg === "--type") options.type = value
      else if (arg === "--tag") options.tag = value
      else options.access = value
      index += 1
    } else {
      return { command, options, error: `unknown argument '${arg}'` }
    }
  }

  if (!["auto", "patch", "minor", "major"].includes(options.type)) {
    return { command, options, error: `--type must be auto|patch|minor|major` }
  }
  if (options.tag && !/^[A-Za-z0-9._-]+$/.test(options.tag)) {
    return { command, options, error: `invalid --tag value '${options.tag}'` }
  }

  return { command, options }
}

/**
 * Runs the release CLI.
 *
 * @param argv - Arguments after the executable
 * @returns Process exit code
 */
export function main(argv) {
  const { command, options, error } = parseCli(argv)
  if (error) {
    console.error(`error: ${error}`)
    return 2
  }
  if (command === "help") {
    printUsage()
    return 0
  }

  try {
    if (command === "version" || command === "release") {
      if (!options.dryRun) assertCleanTree()
      if (!changedSinceLastTag()) {
        console.error("error: no changes since the last tag; nothing to release")
        return 1
      }

      const commits = readCommits()
      const type = options.type === "auto" ? determineBump(commits) : options.type
      const current = currentVersion()
      const next = semverBump(current, type)
      assertTagAbsent(next)

      console.log(`Version: ${current} -> ${next} (${type})`)
      if (options.dryRun) {
        console.log(`[dry-run] would set ${next}, regenerate the skill, update CHANGELOG.md, commit and tag v${next}`)
      } else {
        applyVersion(next)
        regenerateSkill()
        updateChangelog(next, commits)
        commitAndTag(next, options)
        console.log(`Tagged v${next}`)
      }

      if (command === "version") {
        if (options.gitPush && !options.dryRun) gitPush(next)
        return 0
      }

      if (!options.tag) {
        console.error("error: release requires --tag <dist-tag>")
        return 2
      }
      publish({ tag: options.tag, access: options.access, dryRun: options.dryRun })
      if (options.gitPush && !options.dryRun) gitPush(next)
      return 0
    }

    if (command === "publish") {
      const tag = options.tag ?? "latest"
      publish({ tag, access: options.access, dryRun: options.dryRun })
      if (options.gitPush && !options.dryRun) gitPush()
      return 0
    }

    printUsage()
    return 2
  } catch (caught) {
    console.error(`error: ${caught.message}`)
    return 1
  }
}

/**
 * True when this module is the process entry point.
 *
 * @returns True when this file is the entry point
 */
function isMainModule() {
  if (!process.argv[1]) return false
  try {
    return fileURLToPath(import.meta.url) === realpathSync(process.argv[1])
  } catch {
    return false
  }
}

if (isMainModule()) {
  process.exitCode = main(process.argv.slice(2))
}
