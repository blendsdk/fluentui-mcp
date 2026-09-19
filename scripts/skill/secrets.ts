/**
 * Secrets scan for the skill tree.
 *
 * The skill bundles documentation, but a hand edit or a generated file could
 * accidentally include a real credential. This gate looks for a small set of
 * high-signal patterns; it is deliberately conservative so ordinary prose is
 * never flagged.
 *
 * @module skill/secrets
 */

import { join } from 'node:path';

import { readTextFiles } from './files.js';

/** One key-like pattern to look for. */
export interface SecretPattern {
  /** Human-readable pattern name, reported with each finding. */
  name: string;

  /** The regular expression applied per line. */
  pattern: RegExp;
}

/**
 * High-signal secret patterns.
 *
 * `sk-` covers OpenAI- and DeepSeek-style keys; the assignment pattern catches
 * a pasted environment line; the PEM header catches an inlined private key.
 */
export const SECRET_PATTERNS: readonly SecretPattern[] = [
  { name: 'provider key', pattern: /sk-[A-Za-z0-9_-]{16,}/ },
  { name: 'api key assignment', pattern: /\bAPI_KEY\s*[=:]\s*\S+/i },
  { name: 'private key block', pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
];

/** A single secret-like match. */
export interface SecretFinding {
  /** File path relative to the scanned root, or the caller's label. */
  file: string;

  /** 1-based line number of the match. */
  line: number;

  /** Name of the pattern that matched. */
  pattern: string;
}

/**
 * Scan a set of in-memory files for key-like content.
 *
 * @param files - Path/content pairs to scan.
 * @returns Every match, in file then line order.
 */
export function scanSecrets(
  files: readonly { path: string; content: string }[],
): SecretFinding[] {
  const findings: SecretFinding[] = [];
  for (const file of files) {
    const lines = file.content.split('\n');
    for (let index = 0; index < lines.length; index += 1) {
      for (const { name, pattern } of SECRET_PATTERNS) {
        if (pattern.test(lines[index])) {
          findings.push({ file: file.path, line: index + 1, pattern: name });
          break;
        }
      }
    }
  }
  return findings;
}

/**
 * Scan every file under a directory.
 *
 * @param skillDir - Directory to scan.
 * @returns Every secret-like match found.
 */
export function scanSkillDir(skillDir: string): SecretFinding[] {
  return scanSecrets(readTextFiles(skillDir));
}

/**
 * Command-line entry point for the secrets gate.
 *
 * @param argv - Arguments after the script name.
 * @param cwd - Working directory used to resolve the skill root.
 * @returns `0` when clean, `1` when a secret-like string is found.
 */
export function runSecrets(
  argv: readonly string[] = process.argv.slice(2),
  cwd: string = process.cwd(),
): number {
  let skillDir = join('.agents', 'skills', 'fluentui');
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--skill-dir') {
      skillDir = argv[++i] ?? skillDir;
    }
  }

  const findings = scanSkillDir(join(cwd, skillDir));
  if (findings.length === 0) {
    process.stdout.write('No secrets found.\n');
    return 0;
  }

  process.stderr.write(
    `Potential secrets found in ${findings.length} place(s):\n${findings
      .map((finding) => `  ${finding.file}:${finding.line} (${finding.pattern})`)
      .join('\n')}\n`,
  );
  return 1;
}
