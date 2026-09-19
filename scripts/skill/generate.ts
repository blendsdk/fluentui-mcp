/**
 * Deterministic skill generator.
 *
 * Reads the enhanced schema, renders the whole skill tree in memory, and writes
 * it under the skill root. There is no LLM call and no network access: the same
 * input always produces the same bytes.
 *
 * The generator is careful about failure: the schema is parsed and validated,
 * and every id is checked, before a single byte is written. A thrown error
 * therefore means the committed tree is untouched.
 *
 * Usage:
 * `node --import tsx scripts/skill/generate.ts [--schema <path>] [--skill-dir <dir>] [--check]`
 *
 * `--check` performs the same generation in memory, compares the result with
 * the files on disk, and reports differences without writing anything. The
 * drift gate reuses this mode so generation and verification share one
 * implementation.
 *
 * @module skill/generate
 */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

import { isSchemaValid, validateSchema } from '../../src/schema/schema-validator.js';
import type { FluentUISchema } from '../../src/types/schema.js';
import {
  REFERENCE_DIR,
  SKILL_NAME,
  buildSkillFiles,
  type SkillFile,
} from './mapping.js';
import {
  MANIFEST_FILE,
  buildManifest,
  serializeManifest,
  type SkillManifest,
} from './manifest.js';

/** Default schema path, relative to the current working directory. */
export const DEFAULT_SCHEMA_PATH = join(
  'data',
  'v9',
  'fluentui-schema-enhanced.json',
);

/** Default skill root, relative to the current working directory. */
export const DEFAULT_SKILL_DIR = join('.agents', 'skills', SKILL_NAME);

/** Options accepted by {@link generateSkill}. */
export interface GenerateSkillOptions {
  /** Path to the enhanced schema JSON file. */
  schemaPath: string;

  /** Skill root directory (default {@link DEFAULT_SKILL_DIR}). */
  skillDir?: string;

  /** When true, compare against disk instead of writing. */
  check?: boolean;
}

/** Outcome of a generation or check run. */
export interface GenerateSkillResult {
  /** Relative paths of every generated file, including the manifest. */
  files: string[];

  /** The computed manifest. */
  manifest: SkillManifest;

  /** Relative paths that differ from disk (empty outside `--check`). */
  differences: string[];
}

/**
 * Read and validate the enhanced schema.
 *
 * @param schemaPath - Path to the schema file.
 * @returns The parsed, validated schema.
 * @throws When the file is missing, is not valid JSON, or fails validation.
 */
function loadSchema(schemaPath: string): FluentUISchema {
  if (!existsSync(schemaPath)) {
    throw new Error(`Enhanced schema not found: ${schemaPath}`);
  }

  const raw = readFileSync(schemaPath, 'utf-8');
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Enhanced schema is not valid JSON (${schemaPath}): ${reason}`);
  }

  if (!isSchemaValid(parsed)) {
    const errors = validateSchema(parsed)
      .filter((finding) => finding.severity === 'error')
      .map((finding) => `${finding.path || '<root>'}: ${finding.message}`);
    throw new Error(
      `Enhanced schema failed validation (${schemaPath}):\n${errors.join('\n')}`,
    );
  }

  return parsed;
}

/**
 * List the files currently under a directory, as POSIX-style relative paths.
 * Missing directories yield an empty list.
 */
function listFiles(root: string): string[] {
  if (!existsSync(root)) {
    return [];
  }
  const out: string[] = [];
  const walk = (dir: string): void => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else {
        out.push(relative(root, full).split(sep).join('/'));
      }
    }
  };
  walk(root);
  return out.sort();
}

/**
 * Compare the in-memory files with what is on disk.
 *
 * @param files - Every expected file (references plus manifest).
 * @param skillDir - Skill root to compare against.
 * @returns Sorted relative paths that are missing, changed, or extra.
 */
function diffAgainstDisk(
  files: readonly SkillFile[],
  skillDir: string,
): string[] {
  const differences = new Set<string>();

  const expected = new Map(files.map((file) => [file.path, file.content]));
  for (const [path, content] of expected) {
    const full = join(skillDir, path);
    if (!existsSync(full) || readFileSync(full, 'utf-8') !== content) {
      differences.add(path);
    }
  }

  // Generated references that are no longer part of the mapping are stale.
  const referenceRoot = join(skillDir, REFERENCE_DIR);
  for (const rel of listFiles(referenceRoot)) {
    const path = `${REFERENCE_DIR}/${rel}`;
    if (!expected.has(path)) {
      differences.add(path);
    }
  }

  return [...differences].sort();
}

/**
 * Remove generated reference files that are not part of the current mapping.
 *
 * @param expectedPaths - Paths the generator is about to write.
 * @param skillDir - Skill root.
 */
function removeStaleReferences(
  expectedPaths: ReadonlySet<string>,
  skillDir: string,
): void {
  const referenceRoot = join(skillDir, REFERENCE_DIR);
  for (const rel of listFiles(referenceRoot)) {
    const path = `${REFERENCE_DIR}/${rel}`;
    if (!expectedPaths.has(path)) {
      rmSync(join(skillDir, path), { force: true });
    }
  }
}

/**
 * Generate the skill tree from the enhanced schema.
 *
 * @param options - Schema path, skill root, and check mode.
 * @returns The generated file list, manifest, and any differences.
 * @throws When the schema is missing/malformed, `SKILL.md` is absent, or an id
 *   is unsafe. Nothing is written before all of these checks pass.
 */
export function generateSkill(options: GenerateSkillOptions): GenerateSkillResult {
  const skillDir = options.skillDir ?? DEFAULT_SKILL_DIR;
  const schema = loadSchema(options.schemaPath);

  const skillFile = join(skillDir, 'SKILL.md');
  if (!existsSync(skillFile)) {
    throw new Error(`Missing hand-written SKILL.md at ${skillFile}`);
  }

  // Render everything first: buildSkillFiles also enforces id and group safety.
  const referenceFiles = buildSkillFiles(schema);
  const manifest = buildManifest(schema, referenceFiles);
  const files: SkillFile[] = [
    ...referenceFiles,
    { path: MANIFEST_FILE, content: serializeManifest(manifest) },
  ];

  if (options.check) {
    return {
      files: files.map((file) => file.path),
      manifest,
      differences: diffAgainstDisk(files, skillDir),
    };
  }

  const expectedPaths = new Set(files.map((file) => file.path));
  removeStaleReferences(expectedPaths, skillDir);

  for (const file of files) {
    const full = join(skillDir, file.path);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, file.content, 'utf-8');
  }

  return {
    files: files.map((file) => file.path),
    manifest,
    differences: [],
  };
}

/**
 * Parse generator command-line arguments.
 *
 * @param argv - Arguments after the script name.
 * @returns Parsed options.
 */
function parseArgs(argv: readonly string[]): GenerateSkillOptions {
  let schemaPath = DEFAULT_SCHEMA_PATH;
  let skillDir = DEFAULT_SKILL_DIR;
  let check = false;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--schema') {
      schemaPath = argv[++i] ?? schemaPath;
    } else if (arg === '--skill-dir') {
      skillDir = argv[++i] ?? skillDir;
    } else if (arg === '--check') {
      check = true;
    }
  }

  return { schemaPath, skillDir, check };
}

/**
 * Command-line entry point.
 *
 * @param argv - Arguments after the script name (defaults to `process.argv`).
 * @param cwd - Working directory used to resolve default paths.
 * @returns `0` on success, `1` on any failure.
 */
export async function runGenerate(
  argv: readonly string[] = process.argv.slice(2),
  cwd: string = process.cwd(),
): Promise<number> {
  const options = parseArgs(argv);
  const schemaPath = resolve(cwd, options.schemaPath);
  const skillDir = resolve(cwd, options.skillDir ?? DEFAULT_SKILL_DIR);

  try {
    const result = generateSkill({ ...options, schemaPath, skillDir });

    if (options.check) {
      if (result.differences.length === 0) {
        process.stdout.write('Skill is up to date.\n');
        return 0;
      }
      process.stderr.write(
        `Skill drift detected in ${result.differences.length} file(s):\n${result.differences
          .map((path) => `  ${path}`)
          .join('\n')}\nRun the generator to regenerate.\n`,
      );
      return 1;
    }

    process.stdout.write(
      `Generated ${result.files.length} files in ${skillDir}.\n`,
    );
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    return 1;
  }
}

// Run when invoked directly (`node --import tsx scripts/skill/generate.ts`).
const invokedDirectly =
  process.argv[1] !== undefined &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (invokedDirectly) {
  runGenerate().then((code) => {
    process.exitCode = code;
  });
}
