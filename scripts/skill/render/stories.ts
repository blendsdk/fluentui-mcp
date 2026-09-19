/**
 * Render a component's Storybook stories as Markdown examples.
 *
 * Stories are the canonical, copy-pasteable examples extracted from the real
 * FluentUI source. The generator draws component examples only from story
 * code, never from LLM prose, so a component with no usable stories renders no
 * Examples section at all.
 *
 * @module skill/render/stories
 */

import type { ComponentEntry, StoryEntry } from '../../../src/types/schema.js';
import { fencedCode, heading, joinSections } from './sections.js';

/** Maximum number of stories rendered per component. */
export const MAX_COMPONENT_STORIES = 3;

/**
 * Pick the best source available for a story.
 *
 * The full `code` (including imports and supporting styles) is preferred so
 * the example is runnable; `renderCode` is the fallback.
 *
 * @param story - The story to read.
 * @returns The trimmed code, or an empty string when the story has none.
 */
export function selectStoryCode(story: StoryEntry): string {
  const full = story.code?.trim();
  if (full) {
    return full;
  }
  return story.renderCode?.trim() ?? '';
}

/**
 * Rank a story for selection: `Default` is most representative, then an
 * appearance-oriented story, then everything else in its original order.
 *
 * @param story - The story to rank.
 * @returns A sort key where a lower value means a higher priority.
 */
function storyPriority(story: StoryEntry): number {
  const name = story.name.toLowerCase();
  if (name === 'default') {
    return 0;
  }
  if (name.includes('appearance')) {
    return 1;
  }
  return 2;
}

/**
 * Select up to `max` stories that actually carry code, preferring the default
 * and appearance examples. The relative order of equally-ranked stories is
 * preserved so output stays deterministic.
 *
 * @param stories - All stories on the component.
 * @param max - Maximum number to return.
 * @returns The selected stories.
 */
export function selectStories(
  stories: readonly StoryEntry[],
  max: number = MAX_COMPONENT_STORIES,
): StoryEntry[] {
  return stories
    .map((story, index) => ({ story, index }))
    .filter((entry) => selectStoryCode(entry.story) !== '')
    .sort(
      (a, b) =>
        storyPriority(a.story) - storyPriority(b.story) || a.index - b.index,
    )
    .slice(0, Math.max(max, 0))
    .map((entry) => entry.story);
}

/**
 * Render a single story as a level-3 subsection.
 *
 * @param story - The story to render.
 * @returns The story subsection, or an empty string when it has no code.
 */
function renderStory(story: StoryEntry): string {
  const code = selectStoryCode(story);
  if (code === '') {
    return '';
  }
  return joinSections([
    heading(3, story.name),
    story.description?.trim() ?? '',
    fencedCode(code, 'tsx'),
  ]);
}

/**
 * Render the Examples section from a component's stories.
 *
 * @param component - The component whose stories to render.
 * @param max - Maximum number of stories (default
 *   {@link MAX_COMPONENT_STORIES}).
 * @returns The `Examples` section, or an empty string when there are no
 *   usable stories.
 */
export function renderExamplesSection(
  component: ComponentEntry,
  max: number = MAX_COMPONENT_STORIES,
): string {
  const rendered = selectStories(component.stories, max)
    .map(renderStory)
    .filter((block) => block !== '');
  if (rendered.length === 0) {
    return '';
  }
  return joinSections([heading(2, 'Examples'), ...rendered]);
}
