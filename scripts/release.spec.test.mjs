/**
 * Specification tests for the release tool's version rules.
 *
 * These tests pin the contract that makes the release trustworthy: the version
 * bump is derived from conventional commit messages, breaking changes bump
 * major, features bump minor, everything else bumps patch, and the changelog
 * groups commits by type. The git and npm side effects are not exercised here.
 *
 * @module release.spec.test
 */

import assert from "node:assert/strict"
import { describe, it } from "node:test"

import {
  buildChangelogEntry,
  determineBump,
  isValidVersion,
  mergeChangelog,
  parseCli,
  parseCommit,
  releaseStagePaths,
  semverBump,
} from "./release.mjs"

describe("semverBump", () => {
  it("bumps the requested position and resets lower positions", () => {
    assert.equal(semverBump("1.3.1", "major"), "2.0.0")
    assert.equal(semverBump("1.3.1", "minor"), "1.4.0")
    assert.equal(semverBump("1.3.1", "patch"), "1.3.2")
  })

  it("rejects non-semver input and unknown bump types", () => {
    assert.throws(() => semverBump("v1.3.1", "patch"), /Not a plain semver/)
    assert.throws(() => semverBump("1.3.1", "auto"), /Unknown bump type/)
  })
})

describe("isValidVersion", () => {
  it("accepts plain x.y.z and rejects anything else", () => {
    assert.equal(isValidVersion("1.0.0"), true)
    assert.equal(isValidVersion("1.0.0-beta.1"), false)
    assert.equal(isValidVersion("nope"), false)
  })
})

describe("parseCommit", () => {
  it("extracts type and scope and strips the prefix", () => {
    const commit = parseCommit("feat(installer): add curl installer")
    assert.equal(commit.type, "feat")
    assert.equal(commit.scope, "installer")
    assert.equal(commit.text, "installer: add curl installer")
    assert.equal(commit.breaking, false)
  })

  it("marks a bang in the subject as breaking", () => {
    assert.equal(parseCommit("feat(api)!: remove old route").breaking, true)
  })

  it("marks a BREAKING CHANGE body as breaking", () => {
    assert.equal(parseCommit("fix: adjust", "BREAKING CHANGE: now required").breaking, true)
  })

  it("ignores release and merge commits", () => {
    assert.equal(parseCommit("chore(release): v1.3.1"), null)
    assert.equal(parseCommit("Merge branch 'master'"), null)
  })
})

describe("determineBump", () => {
  it("bumps major when any commit is breaking", () => {
    const commits = [{ subject: "feat: x" }, { subject: "fix!: y" }]
    assert.equal(determineBump(commits), "major")
  })

  it("bumps minor when a feature is present without breaking changes", () => {
    const commits = [{ subject: "fix: y" }, { subject: "feat: x" }]
    assert.equal(determineBump(commits), "minor")
  })

  it("bumps patch for fixes and non-conventional messages", () => {
    assert.equal(determineBump([{ subject: "fix: y" }]), "patch")
    assert.equal(determineBump([{ subject: "tidy some things" }]), "patch")
    assert.equal(determineBump([{ subject: "chore(release): v1.0.0" }]), "patch")
  })
})

describe("buildChangelogEntry", () => {
  it("groups commits by type and lists breaking changes first", () => {
    const entry = buildChangelogEntry("1.4.0", "2026-09-19", [
      { subject: "feat(installer): add curl installer" },
      { subject: "fix: correct guard" },
      { subject: "feat!: change contract" },
    ])

    assert.match(entry, /^## 1\.4\.0 — 2026-09-19/)
    assert.match(entry, /### Breaking Changes[\s\S]*change contract/)
    assert.match(entry, /### Features[\s\S]*add curl installer/)
    assert.match(entry, /### Fixes[\s\S]*correct guard/)
  })

  it("still produces a heading when there are no user-facing commits", () => {
    const entry = buildChangelogEntry("1.4.0", "2026-09-19", [])
    assert.match(entry, /^## 1\.4\.0 — 2026-09-19/)
    assert.match(entry, /No user-facing changes/)
  })
})

describe("mergeChangelog", () => {
  it("replaces an Unreleased section with the generated entry", () => {
    const existing = "# Changelog\n\n## Unreleased\n\n- did a thing\n\n## 1.3.1 — 2026-09-15\n\n- old\n"
    const entry = "## 1.4.0 — 2026-09-19\n\n### Features\n\n- new\n\n"

    const merged = mergeChangelog(existing, entry)

    assert.doesNotMatch(merged, /Unreleased/)
    assert.match(merged, /## 1\.4\.0 — 2026-09-19/)
    assert.match(merged, /## 1\.3\.1 — 2026-09-15/)
    assert.doesNotMatch(merged, /did a thing/)
  })

  it("inserts above the newest release when no Unreleased section exists", () => {
    const existing = "# Changelog\n\n## 1.3.1 — 2026-09-15\n\n- old\n"
    const entry = "## 1.4.0 — 2026-09-19\n\n- new\n\n"

    const merged = mergeChangelog(existing, entry)

    assert.match(merged, /## 1\.4\.0[\s\S]*## 1\.3\.1/)
  })
})

describe("parseCli", () => {
  it("defaults to auto bump, public access, and no side effects", () => {
    const { command, options } = parseCli(["version"])
    assert.equal(command, "version")
    assert.equal(options.type, "auto")
    assert.equal(options.access, "public")
    assert.equal(options.dryRun, false)
    assert.equal(options.tag, null)
  })

  it("parses options for release", () => {
    const { command, options } = parseCli([
      "release",
      "--type",
      "minor",
      "--tag",
      "next",
      "--git-push",
      "--dry-run",
    ])
    assert.equal(command, "release")
    assert.equal(options.type, "minor")
    assert.equal(options.tag, "next")
    assert.equal(options.gitPush, true)
    assert.equal(options.dryRun, true)
  })

  it("rejects unknown commands, flags, and bump types", () => {
    assert.match(parseCli(["frobnicate"]).error, /unknown command/)
    assert.match(parseCli(["version", "--nope"]).error, /unknown argument/)
    assert.match(parseCli(["version", "--type", "banana"]).error, /--type must be/)
  })
})

describe("releaseStagePaths", () => {
  it("stages the version files, the changelog, and the regenerated skill", () => {
    const paths = releaseStagePaths()
    assert.ok(paths.includes("package.json"))
    assert.ok(paths.includes("package-lock.json"))
    assert.ok(paths.includes("CHANGELOG.md"))
    assert.ok(paths.includes(".agents/skills/fluentui"))
  })
})
