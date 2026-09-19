/**
 * Example-validation gate.
 *
 * Every fenced `ts`/`tsx` block in the skill is checked in up to three tiers:
 *
 * - Tier 1a: the package a block imports from is installed.
 * - Tier 1b: every named import exists in that package's exports.
 * - Tier 2: the block type-checks against the real package (report only).
 *
 * Tier 1a and 1b fail the gate because a missing package or symbol makes the
 * example misleading. Tier 2 is report-only, because a fully compiling
 * component needs a host application that the documentation intentionally does
 * not provide. Code is never executed: tier 2 writes blocks to a cache
 * directory and invokes the compiler with an argument array.
 *
 * @module skill/validate-examples
 */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Project, type DiagnosticMessageChain } from 'ts-morph';

import { listFiles } from './files.js';
import { createPackageExportResolver } from './package-exports.js';
import type { PackageExportResolver } from './package-exports.js';

export type { PackageExportResolver } from './package-exports.js';

/** Fail-gate tiers. */
export type ExampleTier = '1a' | '1b' | '2';

/** Packages whose imports are validated. */
const GATED_PACKAGES = new Set([
  '@fluentui/react-components',
  '@fluentui/react-icons',
]);

/** A fenced code block extracted from the skill. */
export interface ExampleBlock {
  /** File path relative to the skill root. */
  file: string;

  /** 1-based line number of the opening fence. */
  line: number;

  /** Fence language, lowercased (for example `tsx`). */
  language: string;

  /** The block's code, without the fence lines. */
  code: string;

  /** True when the block is a runnable example (tier 2 applies). */
  fullCheck: boolean;
}

/** One example-validation finding. */
export interface ExampleFinding {
  /** File path relative to the skill root. */
  file: string;

  /** 1-based line number in the file. */
  line: number;

  /** Which tier produced the finding. */
  tier: ExampleTier;

  /** Plain-language explanation. */
  message: string;
}

/** Findings split by whether they fail the gate. */
export interface ExampleReport {
  /** Tier 1a/1b findings; these fail the gate. */
  errors: ExampleFinding[];

  /** Tier 2 findings; these are reported only. */
  warnings: ExampleFinding[];
}

/** Type-check a set of example blocks and return report-only findings. */
export interface TypeChecker {
  (blocks: readonly ExampleBlock[]): ExampleFinding[];
}

/** One import statement parsed from an example block. */
interface ParsedImport {
  /** Module specifier. */
  specifier: string;

  /** Imported names (empty for default or namespace imports). */
  names: string[];

  /** 0-based line offset within the block. */
  lineOffset: number;
}

/**
 * Extract every `ts`/`tsx` fenced block from the skill.
 *
 * @param skillDir - Skill root.
 * @returns The extracted blocks in file then line order.
 */
export function extractExamples(skillDir: string): ExampleBlock[] {
  const files = listFiles(skillDir).filter(
    (path) =>
      path === 'SKILL.md' ||
      (path.startsWith('references/') && path.toLowerCase().endsWith('.md')),
  );

  const blocks: ExampleBlock[] = [];
  for (const file of files) {
    const lines = readFileSync(join(skillDir, file), 'utf-8')
      .replace(/\r\n?/g, '\n')
      .split('\n');
    let inFence = false;
    let fenceLine = 0;
    let fenceInfo = '';
    let heading = '';
    const buffer: string[] = [];

    const flush = (): void => {
      const language = fenceInfo.split(/\s+/)[0].toLowerCase();
      if (language === 'ts' || language === 'tsx') {
        const importOnly =
          fenceInfo.endsWith('fragment') ||
          file === 'SKILL.md' ||
          /(^|\s)api(\s|$)/i.test(heading);
        blocks.push({
          file,
          line: fenceLine,
          language,
          code: buffer.join('\n'),
          fullCheck: !importOnly,
        });
      }
      buffer.length = 0;
    };

    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index];
      if (/^```/.test(line)) {
        if (inFence) {
          flush();
          inFence = false;
        } else {
          inFence = true;
          fenceLine = index + 1;
          fenceInfo = line.slice(3).trim();
        }
        continue;
      }
      if (inFence) {
        buffer.push(line);
      } else {
        const headingMatch = /^#{1,6}\s+(.*)$/.exec(line);
        if (headingMatch) {
          heading = headingMatch[1].trim();
        }
      }
    }
    if (inFence) {
      flush();
    }
  }

  return blocks;
}

/** Parse the import statements of a block. */
function parseImports(code: string): ParsedImport[] {
  const imports: ParsedImport[] = [];
  const pattern =
    /import\s+(type\s+)?(\*\s+as\s+\w+|\{[\s\S]*?\}|\w+)\s+from\s+['"]([^'"]+)['"]/g;

  for (const match of code.matchAll(pattern)) {
    const clause = match[2];
    const specifier = match[3];
    const names: string[] = [];
    if (clause.trimStart().startsWith('{')) {
      const inner = clause.replace(/^\{/, '').replace(/\}$/, '');
      for (const raw of inner.split(',')) {
        const name = raw
          .trim()
          .replace(/^type\s+/, '')
          .split(/\s+as\s+/)[0]
          .trim();
        if (name !== '') {
          names.push(name);
        }
      }
    }
    const lineOffset = code.slice(0, match.index).split('\n').length - 1;
    imports.push({ specifier, names, lineOffset });
  }

  return imports;
}

/**
 * Check package resolution and named imports for a block.
 *
 * @param block - The block to check.
 * @param resolveExports - How to look up a package's exports.
 * @returns Tier 1a/1b findings for the block.
 */
function checkImports(
  block: ExampleBlock,
  resolveExports: PackageExportResolver,
): ExampleFinding[] {
  const findings: ExampleFinding[] = [];
  for (const statement of parseImports(block.code)) {
    if (!GATED_PACKAGES.has(statement.specifier)) {
      continue;
    }
    const line = block.line + 1 + statement.lineOffset;
    const exports = resolveExports(statement.specifier);
    if (exports === undefined) {
      findings.push({
        file: block.file,
        line,
        tier: '1a',
        message: `Cannot resolve package "${statement.specifier}"; install it before validating examples.`,
      });
      continue;
    }
    for (const name of statement.names) {
      if (!exports.has(name)) {
        findings.push({
          file: block.file,
          line,
          tier: '1b',
          message: `"${name}" is not exported by ${statement.specifier}.`,
        });
      }
    }
  }
  return findings;
}

/**
 * Flatten a compiler diagnostic message into a single string.
 *
 * TypeScript reports linked messages (an outer message plus related notes) as a
 * chain; joining them keeps the plain-language context in the report.
 *
 * @param message - The diagnostic message, possibly a chain.
 * @returns The complete message text.
 */
function flattenDiagnostic(message: string | DiagnosticMessageChain): string {
  if (typeof message === 'string') {
    return message;
  }
  const parts: string[] = [String(message.getMessageText())];
  for (const link of message.getNext() ?? []) {
    parts.push(flattenDiagnostic(link));
  }
  return parts.join(' ');
}

/**
 * Type-check example blocks with the TypeScript compiler.
 *
 * Blocks are written under the ignored cache directory and compiled through the
 * TypeScript compiler API, not the `tsc` command line. The API is used on
 * purpose: the command-line compiler suppresses every semantic diagnostic when
 * the program contains a syntactic error, which would hide real type errors in
 * the same run. The API reports both kinds. The compiler is never given
 * extracted code to execute, and the cache is replaced on every run so stale
 * files cannot leak into the result.
 *
 * @param blocks - Blocks to type-check.
 * @param cwd - Repository root used to place the cache and resolve packages.
 * @returns Tier 2 findings.
 */
export function typeCheckWithTsc(
  blocks: readonly ExampleBlock[],
  cwd: string = process.cwd(),
): ExampleFinding[] {
  if (blocks.length === 0) {
    return [];
  }

  const cacheDir = resolve(cwd, '.cache', 'skill-validate');
  const sourceDir = join(cacheDir, 'src');
  rmSync(cacheDir, { recursive: true, force: true });
  mkdirSync(sourceDir, { recursive: true });

  const bySourceFile = new Map<string, ExampleBlock>();
  blocks.forEach((block, index) => {
    const name = `example-${index}.${block.language === 'ts' ? 'ts' : 'tsx'}`;
    writeFileSync(join(sourceDir, name), block.code, 'utf-8');
    bySourceFile.set(name, block);
  });

  const tsconfigPath = join(cacheDir, 'tsconfig.json');
  writeFileSync(
    tsconfigPath,
    JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2022',
          module: 'ESNext',
          moduleResolution: 'bundler',
          jsx: 'react-jsx',
          strict: false,
          noEmit: true,
          skipLibCheck: true,
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          lib: ['ES2022', 'DOM', 'DOM.Iterable'],
          types: ['react'],
        },
        include: ['src/**/*.ts', 'src/**/*.tsx'],
      },
      null,
      2,
    ),
    'utf-8',
  );

  const project = new Project({ tsConfigFilePath: tsconfigPath });
  const findings: ExampleFinding[] = [];

  // `getPreEmitDiagnostics` combines syntactic and semantic diagnostics, so a
  // malformed block no longer hides the type errors of its neighbours.
  for (const diagnostic of project.getPreEmitDiagnostics()) {
    const sourceFile = diagnostic.getSourceFile();
    if (!sourceFile) {
      continue;
    }
    const block = bySourceFile.get(basename(sourceFile.getFilePath()));
    if (!block) {
      continue;
    }
    const position = diagnostic.getStart() ?? 0;
    const { line } = sourceFile.getLineAndColumnAtPos(position);
    findings.push({
      file: block.file,
      line: block.line + line,
      tier: '2',
      message: flattenDiagnostic(diagnostic.getMessageText()),
    });
  }

  return findings;
}

/**
 * Validate every example in the skill.
 *
 * @param options - Skill root, plus optional package resolver and type checker
 *   overrides used by tests to avoid the real package and compiler.
 * @returns Errors (tier 1a/1b) and warnings (tier 2).
 */
export function validateExamples(options: {
  skillDir: string;
  resolveExports?: PackageExportResolver;
  typeCheck?: TypeChecker;
  cwd?: string;
}): ExampleReport {
  const resolver =
    options.resolveExports ??
    createPackageExportResolver(options.cwd ?? process.cwd());
  const typeCheck =
    options.typeCheck ??
    ((blocks: readonly ExampleBlock[]) =>
      typeCheckWithTsc(blocks, options.cwd ?? process.cwd()));

  const blocks = extractExamples(options.skillDir);
  const errors: ExampleFinding[] = [];
  for (const block of blocks) {
    errors.push(...checkImports(block, resolver));
  }

  const warnings = typeCheck(blocks.filter((block) => block.fullCheck));
  return { errors, warnings };
}

/** Default skill root for the CLI, relative to the working directory. */
const DEFAULT_SKILL_DIR = join('.agents', 'skills', 'fluentui');

/** Default enhanced schema for the API-reference part of validation. */
const DEFAULT_ENHANCED_SCHEMA = join(
  'data',
  'v9',
  'fluentui-schema-enhanced.json',
);

/** Default raw schema used as the API-reference oracle. */
const DEFAULT_RAW_SCHEMA = join('data', 'v9', 'fluentui-schema.json');

/**
 * Command-line entry point for `skill:validate`.
 *
 * Runs example validation, the API-reference check, and the secrets scan, then
 * returns a non-zero code when any failing finding is present.
 *
 * @param argv - Arguments after the script name.
 * @param cwd - Working directory used to resolve default paths.
 * @returns `0` when clean, `1` otherwise.
 */
export async function runValidate(
  argv: readonly string[] = process.argv.slice(2),
  cwd: string = process.cwd(),
): Promise<number> {
  let skillDir = DEFAULT_SKILL_DIR;
  let enhancedPath = DEFAULT_ENHANCED_SCHEMA;
  let rawPath = DEFAULT_RAW_SCHEMA;
  let typecheck = true;

  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--skill-dir') {
      skillDir = argv[++i] ?? skillDir;
    } else if (argv[i] === '--schema') {
      enhancedPath = argv[++i] ?? enhancedPath;
    } else if (argv[i] === '--raw-schema') {
      rawPath = argv[++i] ?? rawPath;
    } else if (argv[i] === '--no-typecheck') {
      typecheck = false;
    }
  }

  const { isSchemaValid } = await import('../../src/schema/schema-validator.js');
  const { checkApiReferences, isComponentOracleSchema } = await import(
    './check-api-references.js'
  );
  const { scanSkillDir } = await import('./secrets.js');

  // The API-reference check needs both schemas. Check them before the
  // (expensive) example type check so a missing oracle fails fast instead of
  // after a full compile.
  for (const path of [enhancedPath, rawPath]) {
    if (!existsSync(resolve(cwd, path))) {
      throw new Error(`Schema not found: ${path}`);
    }
  }

  const resolver = createPackageExportResolver(cwd);
  const report = validateExamples({
    skillDir: resolve(cwd, skillDir),
    resolveExports: resolver,
    typeCheck: typecheck ? undefined : () => [],
    cwd,
  });

  const readJson = (path: string): unknown =>
    JSON.parse(readFileSync(resolve(cwd, path), 'utf-8'));

  const enhancedSchema: unknown = readJson(enhancedPath);
  if (!isSchemaValid(enhancedSchema)) {
    throw new Error(`Schema failed validation: ${enhancedPath}`);
  }
  const rawSchema: unknown = readJson(rawPath);
  if (!isComponentOracleSchema(rawSchema)) {
    throw new Error(`Raw schema has no components array: ${rawPath}`);
  }
  const apiReport = checkApiReferences({
    enhancedSchema,
    rawSchema,
    packageExports: resolver,
  });
  const apiErrors = apiReport.errors.map((finding) => ({
    file: finding.location,
    line: 0,
    tier: '1b' as const,
    message: finding.message,
  }));
  const apiWarnings = apiReport.warnings.map((finding) => ({
    file: finding.location,
    line: 0,
    tier: '2' as const,
    message: finding.message,
  }));

  const secretFindings = scanSkillDir(resolve(cwd, skillDir));

  const lines: string[] = [];
  for (const finding of [...report.warnings, ...apiWarnings]) {
    lines.push(
      `WARN  ${finding.file}:${finding.line} [tier ${finding.tier}] ${finding.message}`,
    );
  }
  for (const finding of [...report.errors, ...apiErrors]) {
    lines.push(
      `ERROR ${finding.file}:${finding.line} [tier ${finding.tier}] ${finding.message}`,
    );
  }
  for (const finding of secretFindings) {
    lines.push(
      `ERROR ${finding.file}:${finding.line} [secrets] ${finding.pattern}`,
    );
  }

  const failed =
    report.errors.length > 0 ||
    apiErrors.length > 0 ||
    secretFindings.length > 0;

  if (lines.length > 0) {
    process.stdout.write(`${lines.join('\n')}\n`);
  }
  if (failed) {
    process.stderr.write('Skill validation failed.\n');
    return 1;
  }

  process.stdout.write('Skill validation passed.\n');
  return 0;
}

// Allow `node --import tsx scripts/skill/validate-examples.ts` to run the CLI.
const invokedDirectly =
  process.argv[1] !== undefined &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (invokedDirectly) {
  runValidate().then((code) => {
    process.exitCode = code;
  });
}
