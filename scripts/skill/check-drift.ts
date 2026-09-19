/**
 * Drift and coverage gate.
 *
 * Two questions are answered together because they share the same walk of the
 * skill tree:
 *
 * - Drift: does regenerating the tree from the enhanced schema reproduce the
 *   committed generated files byte for byte? Missing, changed, and stale files
 *   are all drift.
 * - Coverage: does every generated file exist, and does every relative link in
 *   the tree resolve to a real file?
 *
 * @module skill/check-drift
 */

import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

import { listFiles, readTextFile } from './files.js';
import {
  DEFAULT_SCHEMA_PATH,
  DEFAULT_SKILL_DIR,
  generateSkill,
} from './generate.js';

/** A relative link whose target could not be found. */
export interface LinkFinding {
  /** File containing the link, relative to the skill root. */
  file: string;

  /** 1-based line number of the link. */
  line: number;

  /** The raw link target. */
  target: string;

  /** Plain-language explanation. */
  message: string;
}

/** Result of the drift and coverage gate. */
export interface DriftReport {
  /** Missing, changed, or stale generated files. */
  differences: string[];

  /** Expected generated files that are absent (a subset of `differences`). */
  missing: string[];

  /** Relative links that do not resolve. */
  brokenLinks: LinkFinding[];
}

/**
 * Find relative Markdown links whose targets do not exist.
 *
 * Fenced code blocks are skipped because example code can contain link-shaped
 * text. Absolute URLs, in-page anchors, and root-absolute paths are ignored.
 *
 * @param skillDir - Skill root to scan.
 * @returns Every broken link, in file then line order.
 */
function findBrokenLinks(skillDir: string): LinkFinding[] {
  const findings: LinkFinding[] = [];
  const markdownFiles = listFiles(skillDir).filter((path) =>
    path.toLowerCase().endsWith('.md'),
  );

  for (const file of markdownFiles) {
    const lines = readTextFile(join(skillDir, file)).split('\n');
    let inFence = false;
    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index];
      if (/^\s*`{3,}/.test(line)) {
        inFence = !inFence;
        continue;
      }
      if (inFence) {
        continue;
      }

      for (const match of line.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
        const rawTarget = match[1].trim();
        const isExternal =
          /^(?:[a-z][a-z0-9+.-]*:|\/\/|#|\/)/i.test(rawTarget) ||
          rawTarget === '';
        if (isExternal) {
          continue;
        }
        const target = rawTarget.split('#')[0];
        if (target === '') {
          continue;
        }
        const resolved = resolve(skillDir, dirname(file), target);
        if (!existsSync(resolved)) {
          findings.push({
            file,
            line: index + 1,
            target: rawTarget,
            message: `Link target "${rawTarget}" does not exist.`,
          });
        }
      }
    }
  }

  return findings;
}

/**
 * Run the drift and coverage checks.
 *
 * @param options - Paths to the enhanced schema and the skill root.
 * @returns The differences, missing files, and broken links.
 * @throws When the schema is invalid or `SKILL.md` is missing.
 */
export function checkDrift(options: {
  schemaPath: string;
  skillDir: string;
}): DriftReport {
  const result = generateSkill({
    schemaPath: options.schemaPath,
    skillDir: options.skillDir,
    check: true,
  });

  const expected = new Set(result.files);
  const missing = result.differences
    .filter(
      (path) => expected.has(path) && !existsSync(join(options.skillDir, path)),
    )
    .sort();

  return {
    differences: result.differences,
    missing,
    brokenLinks: findBrokenLinks(options.skillDir),
  };
}

/**
 * Command-line entry point for the drift and coverage gate.
 *
 * @param argv - Arguments after the script name.
 * @param cwd - Working directory used to resolve default paths.
 * @returns `0` when the tree is current and covered, `1` otherwise.
 */
export function runCheck(
  argv: readonly string[] = process.argv.slice(2),
  cwd: string = process.cwd(),
): number {
  let schemaPath = DEFAULT_SCHEMA_PATH;
  let skillDir = DEFAULT_SKILL_DIR;

  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--schema') {
      schemaPath = argv[++i] ?? schemaPath;
    } else if (argv[i] === '--skill-dir') {
      skillDir = argv[++i] ?? skillDir;
    }
  }

  try {
    const report = checkDrift({
      schemaPath: join(cwd, schemaPath),
      skillDir: join(cwd, skillDir),
    });

    if (report.differences.length === 0 && report.brokenLinks.length === 0) {
      process.stdout.write('Skill is up to date and fully covered.\n');
      return 0;
    }

    const lines: string[] = [];
    if (report.differences.length > 0) {
      lines.push(
        `Skill drift detected in ${report.differences.length} file(s):`,
        ...report.differences.map((path) => `  ${path}`),
        'Run the generator to regenerate.',
      );
    }
    if (report.brokenLinks.length > 0) {
      lines.push(
        `Broken links found in ${report.brokenLinks.length} place(s):`,
        ...report.brokenLinks.map(
          (link) => `  ${link.file}:${link.line} -> ${link.target}`,
        ),
      );
    }
    process.stderr.write(`${lines.join('\n')}\n`);
    return 1;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    return 1;
  }
}
