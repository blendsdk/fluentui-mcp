/**
 * Skill format validation.
 *
 * The Agent Skill format puts a short YAML frontmatter at the top of `SKILL.md`
 * and keeps the body small enough to load cheaply. This module checks those
 * rules as a pure function so the same code validates the committed file and
 * any synthetic input a test passes in.
 *
 * @module skill/format
 */

/**
 * Maximum length of the frontmatter description.
 *
 * The Agent Skill format allows a description up to 1024 characters; a longer
 * one is rejected by the client that loads the skill.
 */
export const SKILL_DESCRIPTION_MAX_LENGTH = 1024;

/** Maximum number of body lines after the frontmatter. */
export const SKILL_BODY_MAX_LINES = 500;

/** One format rule violation. */
export interface FormatFinding {
  /** Which part of the file is wrong. */
  field: 'frontmatter' | 'name' | 'description' | 'body';

  /** Plain-language explanation of the violation. */
  message: string;
}

/** The parsed frontmatter and body of a skill document. */
interface ParsedSkill {
  /** Flat `key: value` frontmatter fields; empty when there is no block. */
  fields: Record<string, string>;

  /** True when a complete `---`-delimited block was found. */
  hasFrontmatter: boolean;

  /** Number of non-trailing-blank body lines. */
  bodyLines: number;
}

/**
 * Parse a `---`-delimited YAML frontmatter block.
 *
 * Only simple `key: value` lines are read. Nested blocks such as `metadata:`
 * are ignored, which is enough for the scalar fields the format requires.
 *
 * @param markdown - The full document text.
 * @returns The flat frontmatter fields.
 */
export function parseFrontmatter(markdown: string): Record<string, string> {
  return splitSkill(markdown).fields;
}

/** Split a skill document into its frontmatter fields and body size. */
function splitSkill(markdown: string): ParsedSkill {
  const lines = markdown.replace(/\r\n?/g, '\n').split('\n');
  if (lines[0]?.trim() !== '---') {
    return { fields: {}, hasFrontmatter: false, bodyLines: 0 };
  }

  const end = lines.indexOf('---', 1);
  if (end === -1) {
    return { fields: {}, hasFrontmatter: false, bodyLines: 0 };
  }

  const fields: Record<string, string> = {};
  for (const line of lines.slice(1, end)) {
    const match = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    if (match) {
      fields[match[1]] = match[2].trim();
    }
  }

  const body = lines.slice(end + 1);
  // Ignore trailing blank lines so the limit measures authored content.
  while (body.length > 0 && body[body.length - 1].trim() === '') {
    body.pop();
  }
  return { fields, hasFrontmatter: true, bodyLines: body.length };
}

/**
 * Validate a skill document against the format rules.
 *
 * @param options - The document text and the directory name it must match.
 * @returns Every violation found; an empty list means the document is valid.
 */
export function validateSkillFormat(options: {
  markdown: string;
  dirName: string;
}): FormatFinding[] {
  const { fields, hasFrontmatter, bodyLines } = splitSkill(options.markdown);
  const findings: FormatFinding[] = [];

  if (!hasFrontmatter) {
    findings.push({
      field: 'frontmatter',
      message: 'SKILL.md must start with a --- delimited frontmatter block.',
    });
  } else {
    if (fields.name !== options.dirName) {
      findings.push({
        field: 'name',
        message: `Frontmatter name "${fields.name ?? ''}" must equal the directory name "${options.dirName}".`,
      });
    }
    const description = fields.description ?? '';
    if (description === '') {
      findings.push({
        field: 'description',
        message: 'Frontmatter must include a non-empty description.',
      });
    } else if (description.length > SKILL_DESCRIPTION_MAX_LENGTH) {
      findings.push({
        field: 'description',
        message: `Description is ${description.length} characters; the limit is ${SKILL_DESCRIPTION_MAX_LENGTH}.`,
      });
    }
  }

  if (bodyLines > SKILL_BODY_MAX_LINES) {
    findings.push({
      field: 'body',
      message: `Body has ${bodyLines} lines; the limit is ${SKILL_BODY_MAX_LINES}.`,
    });
  }

  return findings;
}
