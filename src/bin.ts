#!/usr/bin/env node
/**
 * The `fluentui` command-line entry point.
 *
 * Only one command group is exposed today: `fluentui skill …`, which installs,
 * inspects, and removes the FluentUI Agent Skill. The dispatcher keeps the
 * top-level surface small so future command groups can be added without
 * changing the skill installer.
 *
 * @module bin
 */

import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import { main as runSkillCommand } from './skill/install-skill.js';

/** Prints the top-level help text. */
function printUsage(): void {
  console.log(`The FluentUI Agent Skill command-line tool.

Usage:
  fluentui skill install [options]     Install or update the skill
  fluentui skill status [options]      Show the installed version
  fluentui skill uninstall [options]   Remove the installed skill
  fluentui --help                      Show this help

Run 'fluentui skill --help' for the installer options.`);
}

/**
 * Runs the dispatcher for a full argument list.
 *
 * @param argv - Arguments after the `fluentui` program name.
 * @returns Process exit code.
 */
export async function main(argv: string[]): Promise<number> {
  const [command, ...rest] = argv;

  if (command === undefined || command === '-h' || command === '--help') {
    printUsage();
    return 0;
  }

  if (command === 'skill') {
    return runSkillCommand(rest);
  }

  console.error(`error: unknown command '${command}'`);
  printUsage();
  return 2;
}

/**
 * True when this module is the process entry point, resolving symlinks so the
 * guard also works through npm's `.bin` shims.
 *
 * @returns True when this file is the entry point.
 */
function isEntryPoint(): boolean {
  if (!process.argv[1]) {
    return false;
  }

  try {
    return fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url);
  } catch {
    return false;
  }
}

if (isEntryPoint()) {
  main(process.argv.slice(2)).then((code) => {
    process.exitCode = code;
  });
}
