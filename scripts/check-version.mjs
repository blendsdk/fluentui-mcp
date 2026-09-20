#!/usr/bin/env node
/**
 * Version-parity guard for the `fluentui-skill` package.
 *
 * The package version must exist in exactly one place: the `version` field of
 * `package.json`. This check fails the build when that value drifts from
 * `package-lock.json`, when it is not a plain semantic version, or when a
 * source file hardcodes the current version instead of deriving it.
 *
 * @module check-version
 */

import { readFileSync, readdirSync, realpathSync } from "node:fs"
import { dirname, join, relative } from "node:path"
import { fileURLToPath } from "node:url"

import { isValidVersion } from "./release.mjs"

/** Repository root: this file lives in `<root>/scripts/`. */
const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))

/**
 * Directories that ship code or generated content and therefore must not
 * hardcode the product version.
 */
const SCANNED_DIRS = ["src", "scripts"]

/** Files that legitimately contain the version and are exempt from the scan. */
const EXEMPT_FILES = new Set(["package.json", "package-lock.json", "CHANGELOG.md"])

/**
 * Reads the three version declarations that must agree.
 *
 * @returns The package version, the lockfile root version, and the lockfile
 *   `packages[""]` version
 */
export function readVersions() {
  const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf-8"))
  const lock = JSON.parse(readFileSync(join(ROOT, "package-lock.json"), "utf-8"))
  return {
    package: pkg.version,
    lock: lock.version,
    lockRoot: lock.packages?.[""]?.version,
  }
}

/**
 * Recursively lists files under a directory.
 *
 * @param dir - Absolute directory to walk
 * @returns Absolute file paths
 */
function listFiles(dir) {
  const files = []

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) files.push(...listFiles(full))
    else if (entry.isFile()) files.push(full)
  }

  return files
}

/**
 * Reports whether a path is a test file that may legitimately mention versions.
 *
 * @param name - Path relative to the repository root
 * @returns True when the file is exempt because it is test-only
 */
function isTestFile(name) {
  return (
    name.includes("__tests__") ||
    name.endsWith(".test.ts") ||
    name.endsWith(".test.mjs") ||
    name.endsWith(".spec.test.ts") ||
    name.endsWith(".spec.test.mjs")
  )
}

/**
 * Finds files that contain the version string as a whole word.
 *
 * @param version - Version to search for
 * @returns Paths relative to the repository root
 */
export function findVersionLiterals(version) {
  const pattern = new RegExp(`(?<![0-9.])${version.replace(/\./g, "\\.")}(?![0-9.])`)
  const hits = []

  for (const dir of SCANNED_DIRS) {
    const absolute = join(ROOT, dir)
    let files
    try {
      files = listFiles(absolute)
    } catch {
      continue
    }

    for (const file of files) {
      const name = relative(ROOT, file)
      if (EXEMPT_FILES.has(name) || isTestFile(name)) {
        continue
      }
      let content
      try {
        content = readFileSync(file, "utf-8")
      } catch {
        continue
      }
      if (pattern.test(content)) hits.push(name)
    }
  }

  return hits
}

/**
 * Runs the parity check.
 *
 * @returns Process exit code; `0` when every declaration agrees
 */
export function main() {
  const { package: pkgVersion, lock, lockRoot } = readVersions()

  if (!isValidVersion(pkgVersion)) {
    console.error(`error: package.json version is not plain semver: ${pkgVersion}`)
    return 1
  }

  const mismatches = []
  if (lock !== pkgVersion) mismatches.push(`package-lock.json version=${lock}`)
  if (lockRoot !== pkgVersion) mismatches.push(`package-lock.json packages[""]=${lockRoot}`)

  if (mismatches.length > 0) {
    console.error(`error: version drift for ${pkgVersion}: ${mismatches.join(", ")}`)
    console.error("Run `npm install --package-lock-only` to resync the lockfile.")
    return 1
  }

  const literals = findVersionLiterals(pkgVersion)
  if (literals.length > 0) {
    console.error(
      `error: the product version ${pkgVersion} is hardcoded in: ${literals.join(", ")}\n` +
        "Derive it from package.json instead of copying the value."
    )
    return 1
  }

  console.log(`version ok: ${pkgVersion}`)
  return 0
}

function isMainModule() {
  if (!process.argv[1]) return false
  try {
    return fileURLToPath(import.meta.url) === realpathSync(process.argv[1])
  } catch {
    return false
  }
}

if (isMainModule()) {
  process.exitCode = main()
}
