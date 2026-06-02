/**
 * Git clone helper for the FluentUI scraper.
 *
 * When the scraper is run with `--clone`, it needs a local checkout of the
 * FluentUI monorepo (and optionally fluentui-contrib) to scrape from. This
 * module performs a shallow clone into a local cache directory and returns the
 * resolved path, so the rest of the pipeline can treat it exactly like a
 * `--source` checkout.
 *
 * Clones are cached under `.cache/` at the repo root keyed by version so that
 * re-running the scraper (or passing `--reuse`) does not re-download the repo.
 *
 * @module scraper/clone
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';

import type { RepoConfig } from './types.js';

/** Root directory where cloned repositories are cached. */
const CACHE_ROOT = resolve(process.cwd(), '.cache');

/**
 * Options controlling how a repository is cloned.
 */
export interface CloneOptions {
  /** Git repository config (remote URL + default ref/branch). */
  repo: RepoConfig;

  /** Destination directory name under `.cache/` (e.g., 'fluentui-v9'). */
  dirName: string;

  /** Git ref (branch/tag/commit) to checkout. Defaults to repo.defaultRef. */
  ref?: string;

  /** Reuse an existing checkout if present instead of re-cloning. */
  reuse?: boolean;

  /** Emit progress logs to stderr. */
  verbose?: boolean;
}

/**
 * Run a git command, surfacing a helpful error message on failure.
 */
function git(args: string[], cwd?: string): void {
  execFileSync('git', args, {
    cwd,
    stdio: ['ignore', 'ignore', 'inherit'],
  });
}

/**
 * Shallow-clone a repository into the local cache and return its path.
 *
 * If `reuse` is set and the destination already exists, the existing checkout
 * is returned untouched. Otherwise any stale checkout is removed and a fresh
 * shallow clone is performed at the requested ref.
 *
 * @param options - Clone options
 * @returns Absolute path to the cloned repository working tree
 */
export function cloneRepo(options: CloneOptions): string {
  const { repo, dirName, reuse, verbose } = options;
  const ref = options.ref ?? repo.defaultRef;
  const dest = join(CACHE_ROOT, dirName);

  if (existsSync(dest)) {
    if (reuse) {
      if (verbose) {
        console.error(`Reusing existing checkout at ${dest}`);
      }
      return dest;
    }
    if (verbose) {
      console.error(`Removing stale checkout at ${dest}`);
    }
    rmSync(dest, { recursive: true, force: true });
  }

  mkdirSync(CACHE_ROOT, { recursive: true });

  if (verbose) {
    console.error(`Cloning ${repo.repo} (${ref}) → ${dest}`);
  }

  // Shallow clone at the requested ref. Using --branch works for both branches
  // and tags; for raw commit SHAs git clone --branch fails, so fall back to a
  // clone + fetch + checkout.
  try {
    git([
      'clone',
      '--depth',
      '1',
      '--branch',
      ref,
      '--single-branch',
      repo.repo,
      dest,
    ]);
  } catch {
    if (verbose) {
      console.error(
        `Branch/tag clone failed for '${ref}', trying commit checkout…`,
      );
    }
    rmSync(dest, { recursive: true, force: true });
    git(['clone', repo.repo, dest]);
    git(['checkout', ref], dest);
  }

  return dest;
}

/**
 * Resolve the current git commit SHA of a checkout (best-effort).
 *
 * @param repoPath - Path to a git working tree
 * @returns The full commit SHA, or 'unknown' if it cannot be determined
 */
export function resolveCommit(repoPath: string): string {
  try {
    const out = execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: repoPath,
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return out.toString().trim() || 'unknown';
  } catch {
    return 'unknown';
  }
}
