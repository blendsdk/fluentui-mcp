/**
 * Formatters for a component's Storybook stories as markdown.
 *
 * Stories are the canonical, real-world code examples extracted from the
 * FluentUI source. These functions render them into fenced code blocks for
 * the `get_component_examples` tool and the Examples section of
 * `query_component`.
 *
 * Formatters are stateless and exported as plain functions.
 *
 * @module formatters/story-formatter
 */

import type { ComponentEntry, StoryEntry } from '../types/index.js';

/**
 * Choose the most complete source available for a story.
 *
 * Prefer the full `code` (which includes imports and supporting styles) so the
 * example is copy-paste runnable. Fall back to `renderCode` when the full code
 * is unavailable.
 */
function selectStoryCode(story: StoryEntry): string {
  const full = story.code?.trim();
  if (full) {
    return full;
  }
  return story.renderCode?.trim() ?? '';
}

/**
 * Format a single story as a markdown subsection: a heading, an optional
 * description, and a fenced `tsx` code block.
 *
 * @param story - The story to render.
 * @param headingLevel - Markdown heading level for the story title (default 3).
 * @returns Markdown for the story, or an empty string if it has no code.
 */
export function formatSingleStory(story: StoryEntry, headingLevel = 3): string {
  const code = selectStoryCode(story);
  if (code === '') {
    return '';
  }

  const hashes = '#'.repeat(Math.min(Math.max(headingLevel, 1), 6));
  const parts: string[] = [`${hashes} ${story.name}`];

  if (story.description && story.description.trim() !== '') {
    parts.push('', story.description.trim());
  }

  parts.push('', '```tsx', code, '```');
  return parts.join('\n');
}

/**
 * Format all of a component's stories as markdown.
 *
 * Returns an empty string when the component has no stories with code, so the
 * caller can omit the Examples section entirely.
 *
 * @param component - The component whose stories to render.
 * @param headingLevel - Heading level for each story title (default 3).
 * @returns Markdown containing each story, separated by blank lines.
 */
export function formatStories(component: ComponentEntry, headingLevel = 3): string {
  const sections = component.stories
    .map((story) => formatSingleStory(story, headingLevel))
    .filter((section) => section !== '');

  return sections.join('\n\n');
}
