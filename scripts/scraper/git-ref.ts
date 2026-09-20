/**
 * Git release-tag helpers for the FluentUI scraper.
 *
 * The scraper pins its source to the newest stable FluentUI React v9 release
 * tag instead of a moving branch reference, so a given run can be reproduced
 * later. These helpers read available tags from a checkout and select the
 * highest semantic version.
 *
 * @module scraper/git-ref
 */

import { execFileSync } from 'node:child_process';

/**
 * Matches the FluentUI React components release tags.
 *
 * Example: `@fluentui/react-components_v9.48.1`.
 */
const STABLE_TAG_PATTERN =
  /^@fluentui\/react-components_v(\d+)\.(\d+)\.(\d+)$/;

/** Parsed semantic version of a stable release tag. */
interface ParsedTag {
  /** The original tag string. */
  tag: string;
  /** Major version number. */
  major: number;
  /** Minor version number. */
  minor: number;
  /** Patch version number. */
  patch: number;
}

/**
 * Select the highest stable FluentUI React v9 release tag from a list.
 *
 * Tags that do not match the stable `@fluentui/react-components_vX.Y.Z`
 * pattern are ignored. The comparison is numeric by major, then minor, then
 * patch, so `v9.48.1` correctly outranks `v9.9.0`.
 *
 * @param tags - Candidate tag strings (order does not matter)
 * @returns The highest matching tag, or null when no stable tag is present
 *
 * @example
 * resolveLatestStableTag(['@fluentui/react-components_v9.9.0',
 *                         '@fluentui/react-components_v9.48.1']);
 * // → '@fluentui/react-components_v9.48.1'
 */
export function resolveLatestStableTag(
  tags: readonly string[],
): string | null {
  let best: ParsedTag | null = null;

  for (const raw of tags) {
    const tag = raw.trim();
    const match = STABLE_TAG_PATTERN.exec(tag);
    if (!match) {
      continue;
    }

    const parsed: ParsedTag = {
      tag,
      major: Number(match[1]),
      minor: Number(match[2]),
      patch: Number(match[3]),
    };

    if (!best || isNewer(parsed, best)) {
      best = parsed;
    }
  }

  return best?.tag ?? null;
}

/**
 * List the stable release tags available in a local git checkout.
 *
 * This is best-effort: if the path is not a git repository or git is not
 * available, an empty list is returned so the caller can fall back to a
 * default ref.
 *
 * @param repoPath - Path to a local git working tree
 * @returns Stable release tags, or an empty array when none can be read
 */
export function listReleaseTags(repoPath: string): string[] {
  try {
    const output = execFileSync(
      'git',
      ['tag', '--list', '@fluentui/react-components_v*'],
      { cwd: repoPath, stdio: ['ignore', 'pipe', 'ignore'] },
    );

    return output
      .toString()
      .split('\n')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
  } catch {
    return [];
  }
}

/**
 * Parse the tags from `git ls-remote --tags` output.
 *
 * Each line is `<sha>\t<ref>`. Peeled annotated-tag entries end with `^{}` and
 * are duplicates of the tag itself, so they are dropped. Only `refs/tags/`
 * entries are kept.
 *
 * @param output - Raw stdout from `git ls-remote --tags`
 * @returns Unique tag names, in the order they appear
 */
export function parseLsRemoteTags(output: string): string[] {
  const tags: string[] = [];
  const seen = new Set<string>();

  for (const rawLine of output.split('\n')) {
    const line = rawLine.trim();
    if (!line) {
      continue;
    }

    const ref = line.split('\t')[1];
    if (!ref || !ref.startsWith('refs/tags/')) {
      continue;
    }

    const tag = ref
      .slice('refs/tags/'.length)
      .replace(/\^\{\}$/, '');
    if (!tag || seen.has(tag)) {
      continue;
    }

    seen.add(tag);
    tags.push(tag);
  }

  return tags;
}

/**
 * Resolve the latest stable FluentUI React v9 release tag from a remote.
 *
 * Queries the remote tags directly (without cloning) so the clone can check
 * out the exact tag. Returns null when the remote is unreachable or has no
 * matching tag.
 *
 * @param repoUrl - Git remote URL of the FluentUI repository
 * @returns The highest stable release tag, or null
 */
export function resolveLatestStableTagFromRemote(
  repoUrl: string,
): string | null {
  try {
    const output = execFileSync(
      'git',
      ['ls-remote', '--tags', repoUrl, '@fluentui/react-components_v*'],
      { stdio: ['ignore', 'pipe', 'ignore'] },
    );

    return resolveLatestStableTag(parseLsRemoteTags(output.toString()));
  } catch {
    return null;
  }
}

/**
 * Resolve a git ref to its commit SHA in a local checkout.
 *
 * @param repoPath - Path to a local git working tree
 * @param ref - Ref to resolve (tag, branch, or SHA)
 * @returns The commit SHA, or null when it cannot be resolved
 */
export function resolveRefCommit(
  repoPath: string,
  ref: string,
): string | null {
  try {
    const output = execFileSync('git', ['rev-parse', `${ref}^{commit}`], {
      cwd: repoPath,
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return output.toString().trim() || null;
  } catch {
    return null;
  }
}

/**
 * Return the stable release tag that the checkout's HEAD currently points at.
 *
 * A tag is only reported when its commit equals HEAD, so the recorded `ref`
 * and `commit` always describe the same revision. Returns null when HEAD is
 * not exactly at a stable release tag (for example a branch checkout).
 *
 * @param repoPath - Path to a local git working tree
 * @returns The matching stable tag, or null
 */
export function resolveTagAtHead(repoPath: string): string | null {
  const latest = resolveLatestStableTag(listReleaseTags(repoPath));
  if (!latest) {
    return null;
  }

  const head = resolveRefCommit(repoPath, 'HEAD');
  const tagCommit = resolveRefCommit(repoPath, latest);
  return head && tagCommit && head === tagCommit ? latest : null;
}

/**
 * Compare two parsed tags and report whether `candidate` is newer than
 * `current`.
 *
 * @param candidate - Tag being considered
 * @param current - Tag currently selected as the best
 * @returns True when `candidate` has a higher semantic version
 */
function isNewer(candidate: ParsedTag, current: ParsedTag): boolean {
  if (candidate.major !== current.major) {
    return candidate.major > current.major;
  }
  if (candidate.minor !== current.minor) {
    return candidate.minor > current.minor;
  }
  return candidate.patch > current.patch;
}
