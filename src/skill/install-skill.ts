/**
 * Install and update the FluentUI Agent Skill into coding agents.
 *
 * The skill ships inside the `fluentui-skill` package at `skills/fluentui/`.
 * This installer copies it into the skill directories of the supported clients
 * (OpenCode, Claude Code, Codex, and the shared `.agents/skills` convention),
 * globally or per project. It replaces only the namespaced `fluentui/`
 * directory and never touches any other skill.
 *
 * @module skill/install-skill
 */

import fs from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import readline from 'node:readline/promises';

/** The skill directory name installed into every client. */
export const SKILL_DIR_NAME = 'fluentui';

/** The marker file written inside an installed skill directory. */
export const MARKER_FILE = '.fluentui-skill.json';

/** The value recorded in the marker's `source` field. */
export const SOURCE_NAME = 'fluentui-skill';

/** Prefix of the temporary sibling directory used during an atomic install. */
export const TEMP_PREFIX = '.fluentui-skill.tmp-';

/** Prefix of the backup directory kept while an install is in flight. */
export const BACKUP_PREFIX = '.fluentui-skill.bak-';

/**
 * The shape of the marker file written into an installed skill directory.
 */
export interface SkillMarker {
  /** The package version that was installed. */
  version: string;
  /** Fixed provenance string identifying the installer. */
  source: string;
  /** ISO-8601 timestamp of when the install happened. */
  installedAt: string;
}

/**
 * A skill directory layout for one supported coding agent.
 *
 * `global` and `project` are path segments relative to the home directory and
 * the project root respectively.
 */
export interface ClientDefinition {
  /** Stable identifier shown to the user, e.g. `opencode`. */
  id: string;
  /** Path segments for the global skills directory. */
  global: string[];
  /** Path segments for the project skills directory. */
  project: string[];
}

/**
 * Supported clients and the directories in which each looks for skills.
 */
export const CLIENTS: ClientDefinition[] = [
  { id: 'opencode', global: ['.config', 'opencode', 'skills'], project: ['.opencode', 'skills'] },
  { id: 'claude', global: ['.claude', 'skills'], project: ['.claude', 'skills'] },
  { id: 'codex', global: ['.codex', 'skills'], project: ['.codex', 'skills'] },
  { id: 'agents', global: ['.agents', 'skills'], project: ['.agents', 'skills'] },
];

/**
 * A detected client with both of its skill directories resolved to absolute
 * paths.
 */
export interface DetectedClient {
  /** The client identifier. */
  id: string;
  /** Absolute global skills directory. */
  globalDir: string;
  /** Absolute project skills directory. */
  projectDir: string;
}

/**
 * Inputs for installing the skill into one skills directory.
 */
export interface InstallOptions {
  /** Directory holding the skill tree to copy or link. */
  sourceDir: string;
  /** Skills directory to install into. */
  targetDir: string;
  /** Package version recorded in the marker. */
  version: string;
  /** Create a symlink instead of copying. */
  link?: boolean;
  /** Report the action without writing anything. */
  dryRun?: boolean;
}

/**
 * The outcome of one install attempt.
 */
export interface InstallResult {
  /** The skills directory that was targeted. */
  targetDir: string;
  /** The resolved destination path, `<targetDir>/fluentui`. */
  dest: string;
  /** True when the skill was copied. */
  installed?: boolean;
  /** True when the skill was symlinked. */
  linked?: boolean;
  /** True when the call ran in dry-run mode and wrote nothing. */
  dryRun?: boolean;
}

/**
 * The outcome of one uninstall attempt.
 */
export interface UninstallResult {
  /** The skills directory that was targeted. */
  targetDir: string;
  /** The resolved destination path, `<targetDir>/fluentui`. */
  dest: string;
  /** True when the destination existed and was removed. */
  removed: boolean;
  /** True when the call ran in dry-run mode and wrote nothing. */
  dryRun: boolean;
}

/**
 * Options parsed from the command line.
 */
export interface InstallerOptions {
  /** Explicit `--target` directories. */
  targets: string[];
  /** Use project-level skill directories. */
  project: boolean;
  /** Create a symlink instead of copying. */
  link: boolean;
  /** Report only; write nothing. */
  dryRun: boolean;
  /** Install into every detected client. */
  all: boolean;
}

/**
 * The result of parsing an installer command line.
 */
export interface ParsedArgs {
  /** The chosen sub-command, or `help`. */
  command: 'install' | 'status' | 'uninstall' | 'help';
  /** Parsed options. */
  options: InstallerOptions;
  /** A parse error message, when the input was invalid. */
  error?: string;
}

/**
 * Environment values the CLI depends on, injected so tests can run without
 * touching the real machine.
 */
export interface InstallerIo {
  /** Home directory used for global client detection. */
  home?: string;
  /** Project root used for project client detection. */
  cwd?: string;
  /** Whether interactive prompting is allowed. */
  isTTY?: boolean;
  /** Package version recorded in the marker; read from `package.json` when omitted. */
  version?: string;
  /** Override the packaged skill source directory. */
  sourceDir?: string;
}

/**
 * Resolves the packaged skill directory.
 *
 * Works in both layouts: shipped (`<package>/dist/skill` ->
 * `<package>/skills`) and repository (`<repo>/src/skill` ->
 * `<repo>/.agents/skills`). The packaged copy is preferred when both exist.
 *
 * @param moduleUrl - `import.meta.url` of this module.
 * @param override - Optional explicit source directory.
 * @returns Absolute path to the skill directory.
 */
export function resolveSourceDir(moduleUrl: string, override?: string): string {
  if (override) {
    return path.resolve(override);
  }

  const moduleDir = path.dirname(fileURLToPath(moduleUrl));
  const candidates = [
    path.join(moduleDir, '..', '..', 'skills', SKILL_DIR_NAME),
    path.join(moduleDir, '..', '..', '.agents', 'skills', SKILL_DIR_NAME),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(path.join(candidate, 'SKILL.md'))) {
      return path.resolve(candidate);
    }
  }

  return path.resolve(candidates[0]);
}

/**
 * Detects which clients are present on the machine.
 *
 * A client is present when its global directory, the global directory's
 * parent, or its project directory exists.
 *
 * @param options - Detection inputs.
 * @param options.home - Home directory.
 * @param options.cwd - Project root.
 * @param options.exists - Existence predicate (injectable for tests).
 * @returns Detected clients with resolved global and project directories.
 */
export function detectClients(options: {
  home: string;
  cwd: string;
  exists: (target: string) => boolean;
}): DetectedClient[] {
  const detected: DetectedClient[] = [];

  for (const client of CLIENTS) {
    const globalDir = path.join(options.home, ...client.global);
    const projectDir = path.join(options.cwd, ...client.project);
    const present =
      options.exists(globalDir) || options.exists(path.dirname(globalDir)) || options.exists(projectDir);

    if (present) {
      detected.push({ id: client.id, globalDir, projectDir });
    }
  }

  return detected;
}

/**
 * Resolves the skills directories to operate on.
 *
 * Explicit `--target` directories win, then `--project`, otherwise every
 * detected client's global directory is used.
 *
 * @param options - Selection options.
 * @param options.targets - Explicit target directories.
 * @param options.project - Use project directories instead of global ones.
 * @param detected - Detected clients.
 * @returns Absolute target skills directories.
 */
export function resolveTargets(options: InstallerOptions, detected: DetectedClient[]): string[] {
  if (options.targets.length > 0) {
    return options.targets.map((target) => path.resolve(target));
  }

  if (options.project) {
    return detected.map((client) => client.projectDir);
  }

  return detected.map((client) => client.globalDir);
}

/**
 * Reports whether a path exists as any entry type, including a dangling
 * symlink (which `fs.existsSync` reports as absent because it follows links).
 *
 * @param targetPath - Path to test.
 * @returns True when an entry exists.
 */
function entryExists(targetPath: string): boolean {
  try {
    fs.lstatSync(targetPath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Reads the installed marker, if present and parseable.
 *
 * @param targetDir - Installed skill directory.
 * @returns The parsed marker, or undefined.
 */
export function readMarker(targetDir: string): SkillMarker | undefined {
  const markerPath = path.join(targetDir, MARKER_FILE);

  if (!fs.existsSync(markerPath)) {
    return undefined;
  }

  try {
    const parsed: unknown = JSON.parse(fs.readFileSync(markerPath, 'utf-8'));
    return isSkillMarker(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Type guard for a parsed marker object.
 *
 * The marker is read back from disk, so its shape is untrusted input and is
 * validated instead of asserted.
 *
 * @param value - Parsed JSON value.
 * @returns True when the value has the marker's required string fields.
 */
function isSkillMarker(value: unknown): value is SkillMarker {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  return (
    'version' in value &&
    typeof value.version === 'string' &&
    'source' in value &&
    typeof value.source === 'string' &&
    'installedAt' in value &&
    typeof value.installedAt === 'string'
  );
}

/**
 * Writes the version marker into a skill directory.
 *
 * @param dir - Skill directory.
 * @param version - Installed package version.
 */
function writeMarker(dir: string, version: string): void {
  const marker: SkillMarker = {
    version,
    source: SOURCE_NAME,
    installedAt: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(dir, MARKER_FILE), JSON.stringify(marker, null, 2) + '\n', 'utf-8');
}

/**
 * Removes leftover temp and backup directories from an interrupted run.
 *
 * @param targetDir - Skills directory to clean.
 */
function cleanLeftovers(targetDir: string): void {
  for (const entry of fs.readdirSync(targetDir)) {
    if (entry.startsWith(TEMP_PREFIX) || entry.startsWith(BACKUP_PREFIX)) {
      fs.rmSync(path.join(targetDir, entry), { recursive: true, force: true });
    }
  }
}

/**
 * Guards against replacing a directory that is not this skill.
 *
 * A destination is safe to replace when it is absent, when it carries a
 * marker, or when it contains a `SKILL.md`. Anything else is unrelated content
 * and is left untouched.
 *
 * @param dest - Candidate destination directory.
 * @throws When the destination exists but does not look like a skill.
 */
function assertReplaceable(dest: string): void {
  if (!entryExists(dest) || fs.existsSync(path.join(dest, MARKER_FILE))) {
    return;
  }

  if (!fs.existsSync(path.join(dest, 'SKILL.md'))) {
    throw new Error(`refusing to replace unrelated directory: ${dest}`);
  }
}

/**
 * Installs the skill into one skills directory by atomically replacing
 * `fluentui/`.
 *
 * The tree is first copied into a temp sibling, then renamed over the
 * destination. An existing destination is moved aside as a backup and restored
 * if the rename fails, so a failed install never leaves a partial skill.
 *
 * @param options - Install inputs.
 * @returns A summary of the action.
 * @throws When the source is not a skill or the destination is unrelated.
 */
export function installSkill(options: InstallOptions): InstallResult {
  const { sourceDir, version, link = false, dryRun = false } = options;
  const targetDir = path.resolve(options.targetDir);
  const dest = path.join(targetDir, SKILL_DIR_NAME);

  if (!fs.existsSync(path.join(sourceDir, 'SKILL.md'))) {
    throw new Error(`source is not a skill directory (missing SKILL.md): ${sourceDir}`);
  }

  if (dryRun) {
    return { targetDir, dest, dryRun: true };
  }

  assertReplaceable(dest);
  fs.mkdirSync(targetDir, { recursive: true });
  cleanLeftovers(targetDir);

  if (link) {
    fs.rmSync(dest, { recursive: true, force: true });
    fs.symlinkSync(sourceDir, dest, process.platform === 'win32' ? 'junction' : 'dir');
    return { targetDir, dest, linked: true };
  }

  const tmp = path.join(targetDir, `${TEMP_PREFIX}${process.pid}`);
  const backup = path.join(targetDir, `${BACKUP_PREFIX}${process.pid}`);

  try {
    fs.cpSync(sourceDir, tmp, { recursive: true });
    writeMarker(tmp, version);

    if (entryExists(dest)) {
      fs.renameSync(dest, backup);
    }

    fs.renameSync(tmp, dest);
    fs.rmSync(backup, { recursive: true, force: true });
  } catch (error) {
    fs.rmSync(tmp, { recursive: true, force: true });
    if (entryExists(backup) && !entryExists(dest)) {
      fs.renameSync(backup, dest);
    }
    throw error;
  }

  return { targetDir, dest, installed: true };
}

/**
 * Removes the installed skill from one skills directory.
 *
 * Only the `fluentui/` directory is removed; any sibling skill is untouched.
 *
 * @param options - Uninstall inputs.
 * @param options.targetDir - Skills directory.
 * @param options.dryRun - Report only, write nothing.
 * @returns A summary of the action.
 */
export function uninstallSkill(options: {
  targetDir: string;
  dryRun?: boolean;
}): UninstallResult {
  const targetDir = path.resolve(options.targetDir);
  const dryRun = Boolean(options.dryRun);
  const dest = path.join(targetDir, SKILL_DIR_NAME);
  const existed = entryExists(dest);

  if (!dryRun && existed) {
    fs.rmSync(dest, { recursive: true, force: true });
  }

  return { targetDir, dest, removed: existed, dryRun };
}

/** Prints the CLI help and the client table. */
function printUsage(): void {
  console.log(`Install and update the FluentUI Agent Skill.

Usage:
  fluentui skill install [options]     Install or update the skill
  fluentui skill status [options]      Show the installed version
  fluentui skill uninstall [options]   Remove the installed skill

Options:
  --all                 Install into every detected client
  --target <dir>        Install into a specific skills directory (repeatable)
  --project             Use project-level skill directories
  --link                Symlink to the source instead of copying
  --dry-run             Show what would happen without writing
  -h, --help            Show this help

Clients:
  opencode  ~/.config/opencode/skills   .opencode/skills
  claude    ~/.claude/skills            .claude/skills
  codex     ~/.codex/skills             .codex/skills
  agents    ~/.agents/skills            .agents/skills`);
}

/**
 * Parses argv into a sub-command and options.
 *
 * @param argv - Arguments after `skill` (or the full argument list).
 * @returns The parsed command and options, plus an error for invalid input.
 */
export function parseArgs(argv: string[]): ParsedArgs {
  const options: InstallerOptions = {
    targets: [],
    project: false,
    link: false,
    dryRun: false,
    all: false,
  };
  const first = argv[0];
  let command: ParsedArgs['command'] = 'install';
  let start = 0;

  if (first === 'install' || first === 'status' || first === 'uninstall') {
    command = first;
    start = 1;
  }

  let error: string | undefined;

  for (let i = start; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === '--all') options.all = true;
    else if (arg === '--project') options.project = true;
    else if (arg === '--link') options.link = true;
    else if (arg === '--dry-run') options.dryRun = true;
    else if (arg === '--target') {
      const value = argv[i + 1];
      if (!value || value.startsWith('--')) {
        error = `${arg} requires a directory argument`;
        break;
      }
      options.targets.push(value);
      i += 1;
    } else if (arg === '-h' || arg === '--help') {
      return { command: 'help', options };
    } else {
      error = `unknown argument '${arg}'`;
      break;
    }
  }

  if (error) {
    return { command: 'install', options, error };
  }

  return { command, options };
}

/**
 * Prompts the user to choose among the detected clients.
 *
 * @param detected - Detected clients.
 * @returns The chosen clients.
 */
async function promptSelection(detected: DetectedClient[]): Promise<DetectedClient[]> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  try {
    console.log('Detected agent skill directories:');
    detected.forEach((client, index) => {
      console.log(`  ${index + 1}. ${client.id}  ${client.globalDir}`);
    });
    const answer = await rl.question('Install into which? (comma-separated numbers, empty = all): ');
    const trimmed = answer.trim();

    if (trimmed === '') {
      return detected;
    }

    const chosen = trimmed
      .split(',')
      .map((part) => Number.parseInt(part.trim(), 10) - 1)
      .filter((index) => index >= 0 && index < detected.length)
      .map((index) => detected[index]);

    return chosen.length > 0 ? chosen : detected;
  } finally {
    rl.close();
  }
}

/**
 * Reads the installer package's own version.
 *
 * @param moduleUrl - `import.meta.url` of this module.
 * @returns The version, or `0.0.0` when it cannot be read.
 */
function readPackageVersion(moduleUrl: string): string {
  const moduleDir = path.dirname(fileURLToPath(moduleUrl));

  try {
    const raw = fs.readFileSync(path.join(moduleDir, '..', '..', 'package.json'), 'utf-8');
    const parsed: unknown = JSON.parse(raw);

    if (typeof parsed === 'object' && parsed !== null && 'version' in parsed) {
      const { version } = parsed;
      return typeof version === 'string' ? version : '0.0.0';
    }

    return '0.0.0';
  } catch {
    return '0.0.0';
  }
}

/**
 * Runs the installer CLI.
 *
 * @param argv - Arguments after `skill`.
 * @param io - Injectable environment values.
 * @returns Process exit code.
 */
export async function main(argv: string[], io: InstallerIo = {}): Promise<number> {
  const home = io.home ?? homedir();
  const cwd = io.cwd ?? process.cwd();
  const isTTY = io.isTTY ?? Boolean(process.stdin.isTTY);
  const version = io.version ?? readPackageVersion(import.meta.url);

  const { command, options, error } = parseArgs(argv);

  if (error) {
    console.error(`error: ${error}`);
    return 2;
  }

  if (command === 'help') {
    printUsage();
    return 0;
  }

  const sourceDir = resolveSourceDir(import.meta.url, io.sourceDir);
  const detected = detectClients({ home, cwd, exists: fs.existsSync });

  if (detected.length === 0 && options.targets.length === 0) {
    console.error('No known agent skill directories were found. Use --target <dir> to specify one.');
    printUsage();
    return 1;
  }

  let targets: string[];
  if (options.targets.length > 0 || options.project || options.all || !isTTY) {
    targets = resolveTargets(options, detected);
  } else {
    const chosen = await promptSelection(detected);
    targets = chosen.map((client) => client.globalDir);
  }

  if (targets.length === 0) {
    console.error('No target directories were selected.');
    return 1;
  }

  if (command === 'status') {
    let allInstalled = true;

    for (const target of targets) {
      const dest = path.join(path.resolve(target), SKILL_DIR_NAME);
      const marker = readMarker(dest);

      if (marker) {
        console.log(`${dest}: installed ${marker.version}`);
      } else if (entryExists(dest)) {
        console.log(`${dest}: installed (linked)`);
      } else {
        console.log(`${dest}: not installed`);
        allInstalled = false;
      }
    }

    return allInstalled ? 0 : 1;
  }

  if (command === 'uninstall') {
    for (const target of targets) {
      const result = uninstallSkill({ targetDir: target, dryRun: options.dryRun });
      console.log(`${options.dryRun ? 'would remove' : 'removed'} ${result.dest}`);
    }

    return 0;
  }

  for (const target of targets) {
    try {
      const result = installSkill({
        sourceDir,
        targetDir: target,
        version,
        link: options.link,
        dryRun: options.dryRun,
      });
      console.log(`${options.dryRun ? 'would install' : 'installed'} ${result.dest}`);
    } catch (error) {
      console.error(`error: ${error instanceof Error ? error.message : String(error)}`);
      return 1;
    }
  }

  return 0;
}

/**
 * True when this module is the process entry point, resolving symlinks so the
 * guard also works through npm's `.bin` shims.
 *
 * @returns True when this file is the entry point.
 */
export function isMainModule(): boolean {
  if (!process.argv[1]) {
    return false;
  }

  try {
    return fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url);
  } catch {
    return false;
  }
}
