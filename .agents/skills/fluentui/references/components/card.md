# Card

> **Package**: `@fluentui/react-card` v9.7.0
> **Import**: `import { Card } from '@fluentui/react-components';`
> **Category**: layout
> **Stability**: stable

## Overview

Card is the Fluent UI React v9 surface primitive for grouping related content and actions into one self-contained unit. It renders a root container and is designed to be composed with CardHeader, CardPreview and CardFooter, which the shipped examples place inside it to build everything from a simple document preview to a rich tile with badges, checkboxes and a metadata footer. Card is deliberately flexible: appearance controls the surface treatment (filled, filled-alternative, outline, subtle), size controls the border radius and the padding between inner elements, orientation switches between a vertical and a horizontal anatomy, focusMode decides whether the card itself is focusable and how it manages focus for its inner controls, and the selection props (selected, defaultSelected, onSelectionChange, shouldRestrictTriggerAction) turn a card into a toggleable item for galleries, pickers and bulk-action scenarios. Beyond the root slot it exposes an optional floatingAction slot for a top-right affordance (most often a Checkbox) and a checkbox slot used for selection affordances, so applications can render their own indicator or rely on the built-in one.

**When to use**: Use Card when content needs to read as a single, discrete item: app tiles, file and document previews, dashboards, task lists, galleries, search results, and any repeated collection laid out in a grid. Pair it with CardHeader, CardPreview and CardFooter to get the standard anatomy, and choose appearance and size to match the surface the card sits on. Pick the selectable behavior (selected plus onSelectionChange, optionally with a floatingAction checkbox) when the collection supports selection, such as picking files or photos. Reach for something else when the content is not a discrete item: use plain layout plus Divider for page-level sections, Dialog or Drawer for interrupting or sliding tasks, Nav and NavItem for navigation structure, and DataGrid or Table when the content really is tabular and needs columns, sorting and row semantics. Never use Card as a substitute for Button or Link; place a real Button or Link inside the card instead.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `appearance` | `"filled" \| "filled-alternative" \| "outline" \| "subtle" \| undefined` | `'filled'` | No | Sets the appearance of the card.  `filled` The card will have a shadow, border and background color.  `filled-alternative` This appearance is similar to `filled`, but the background color will be a little darker.  `outline` This appearance is similar to `filled`, but the background color will be transparent and no shadow applied.  `subtle` This appearance is similar to `filled-alternative`, but no border is applied. |
| `defaultSelected` | `boolean \| undefined` | `false` | No | Defines whether the card is initially in a selected state when rendered. |
| `disabled` | `boolean \| undefined` | `false` | No | Makes the card and card selection disabled (not propagated to children). |
| `focusMode` | `"off" \| "no-tab" \| "tab-exit" \| "tab-only" \| undefined` | `'off'` | No | Sets the focus behavior for the card.  `off` The card will not focusable.  `no-tab` This behaviour traps the focus inside of the Card when pressing the Enter key and will only release focus when pressing the Escape key.  `tab-exit` This behaviour traps the focus inside of the Card when pressing the Enter key but will release focus when pressing the Tab key on the last inner element.  `tab-only` This behaviour will cycle through all elements inside of the Card when pressing the Tab key and then release focus after the last inner element. |
| `onSelectionChange` | `((event: CardOnSelectionChangeEvent, data: CardOnSelectData) => void) \| undefined` | — | No | Callback to be called when the selected state value changes. |
| `orientation` | `"horizontal" \| "vertical" \| undefined` | `'vertical'` | No | Defines the orientation of the card. |
| `selected` | `boolean \| undefined` | `false` | No | Defines the controlled selected state of the card. |
| `shouldRestrictTriggerAction` | `((event: CardOnSelectionChangeEvent) => boolean) \| undefined` | — | No | Predicate function to determine whether the card's selection action should be restricted. |
| `size` | `"small" \| "medium" \| "large" \| undefined` | `'medium'` | No | Controls the card's border radius and padding between inner elements. |

### Prop Guidance

- **appearance**: Selects the visual surface of the card and should be chosen from the background it sits on. Use filled (the default) for most designs, filled-alternative when the card is placed on a lighter gray or white surface where the default fill would not have enough contrast, outline when you want an outline but a transparent background and no shadow, and subtle when the container should have no background or border but should still show a visible footprint on hover, press and selection. `filled-alternative`
- **focusMode**: Controls whether the card itself is focusable and how it manages focus for its inner content. Leave it at off for static cards and for cards whose actions are all real buttons and links. Use no-tab when you want Enter to move focus into the card and keep it there until Escape, tab-exit when focus should also be released by tabbing past the last inner element, and tab-only when you want the card reachable and tabbable without trapping focus. `tab-only`
- **orientation**: Switches the card anatomy between the default vertical layout, where the preview sits above the header, and a horizontal layout where the preview becomes a leading image beside the header and footer. Horizontal cards usually need explicit sizing on the preview so the media does not stretch. `horizontal`
- **size**: Controls the card's border radius and the padding between inner elements; it does not set the card's width or height. Use small in dense grids and lists, medium as the default for most layouts, and large for hero or feature cards where more breathing room is desirable. Keep the value consistent within one collection. `small`
- **selected**: Controlled selected state. Use it together with onSelectionChange when the parent owns the selection, for example to drive bulk actions, and keep it out of the API when you only need a self-contained card. `true with onSelectionChange handling the change`
- **defaultSelected**: Sets the initial selected state for an uncontrolled selectable card, for example a preselected filter chip rendered as a card. Do not combine it with selected on the same card. `true`
- **onSelectionChange**: Callback fired when the selection value changes; the second argument carries the new state, so read the selected flag from the data payload and store it in your own state. Keep the handler stable with a memoized callback when a grid renders many cards so you do not recreate it every render. `read data.selected and store it in component state`
- **disabled**: Makes the card and its selection not interactive, exposes aria-disabled and removes the card from the tab order. It is not propagated to children, so disable buttons, checkboxes and fields inside the card explicitly as well. `true`
- **shouldRestrictTriggerAction**: Predicate evaluated with the selection-change event that lets you block the card's selection action for specific interactions, typically clicks that originate from inner interactive elements so they do not double-trigger selection. `return true to skip selection for that event`
- **floatingAction**: Slot rendered at the top-right of the card, commonly used with the selection props to host a Checkbox that visually represents the selected state. Give that control an accessible name matching the card title, for example with aria-labelledby pointed at the title text, and keep it a single affordance. `Checkbox labelled by the card title`
- **checkbox**: Internal slot for the checkbox used by card selection. Prefer driving selection through selected, defaultSelected and onSelectionChange plus your own floatingAction checkbox, and verify the rendered output so a selectable card does not present two competing indicators. `rendered for selectable cards`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `checkbox` | — | No | The internal checkbox element that renders when the card is selectable. |
| `floatingAction` | — | No | Floating action that can be rendered on the top-right of a card. Often used together with `selected`, `defaultSelected`, and `onSelectionChange` props |
| `root` | — | Yes | Root element of the component. |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { ArrowReplyRegular, ShareRegular } from '@fluentui/react-icons';

export const Default = (): JSXElement => {
  const styles = useStyles();

  return (
    <Card className={styles.card}>
      <CardHeader
        image={<img src={resolveAsset('avatar_elvia.svg')} alt="Elvia Atkins avatar picture" />}
        header={
          <Body1>
            <b>Elvia Atkins</b> mentioned you
          </Body1>
        }
        description={<Caption1>5h ago · About us - Overview</Caption1>}
      />

      <CardPreview logo={<img src={resolveAsset('docx.png')} alt="Microsoft Word document" />}>
        <img src={resolveAsset('doc_template.png')} alt="Preview of a Word document: About Us - Overview" />
      </CardPreview>

      <CardFooter>
        <Button icon={<ArrowReplyRegular fontSize={16} />}>Reply</Button>
        <Button icon={<ShareRegular fontSize={16} />}>Share</Button>
      </CardFooter>
    </Card>
  );
};
```

### Appearance

```tsx
import * as React from 'react';
import type { JSXElement, CardProps } from '@fluentui/react-components';
import { makeStyles, tokens, Button, Text, Caption1, Subtitle1, Body1, mergeClasses } from '@fluentui/react-components';
import { MoreHorizontal20Regular } from '@fluentui/react-icons';
import { Card, CardHeader } from '@fluentui/react-components';

export const Appearance = (): JSXElement => {
  const styles = useStyles();

  return (
    <div className={styles.main}>
      <section>
        <ExampleHeader
          title="Filled (Default)"
          description="This is the default style to use for cards. Use this style variant for most of your card
          designs."
        />
        <CardExample />
      </section>

      <section>
        <ExampleHeader
          title="Filled Alternative"
          description="Use if your card is being displayed on a lighter gray or white surface. This ensures that you
          have adequate contrast between the card surface and the background of the application."
        />
        <CardExample appearance="filled-alternative" />
      </section>

      <section>
        <ExampleHeader
          title="Outline"
          description="Use when you don't want a filled background color but a discernable outline (border) on the
          card."
        />
        <CardExample appearance="outline" />
      </section>

      <section>
        <ExampleHeader
          title="Subtle"
          description="This variant doesn't have a background or border for the card container. However, it does include
          interaction states that display a visible footprint when interacting with the card item."
        />
        <CardExample appearance="subtle" />
      </section>
    </div>
  );
};

Appearance.parameters = {
  docs: {
    description: {
      story: 'Cards can have different styles depending on the situation and where it is placed.',
    },
  },
};
```

### WithAction

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { MoreHorizontal20Regular, Open16Regular } from '@fluentui/react-icons';

export const WithAction = (): JSXElement => {
  const styles = useStyles();
  const linkRef = React.useRef<HTMLAnchorElement>(null);

  const onActionCardKeyDown = (ev: React.KeyboardEvent<HTMLDivElement>) => {
    if (ev.key === 'Enter') {
      onActionCardClick();
    }
  };

  const onActionCardClick = () => {
    alert('Opened Classroom Collaboration app');
  };

  const onLinkedCardClick = () => {
    linkRef.current?.click();
  };

  const onLinkedCardKeyDown = (ev: React.KeyboardEvent<HTMLDivElement>) => {
    if (ev.key === 'Enter') {
      onLinkedCardClick();
    }
  };

  return (
    <div className={styles.main}>
      <section>
        <Header
          title="Card with click event"
          description="This card has both a root click event and an Open button that performs the same action. Adding enter key handling to the card root is optional since the Open button also provides keyboard access."
        />
        <Card className={styles.card} onClick={onActionCardClick} onKeyDown={onActionCardKeyDown} focusMode="off">
          <CardPreview>
            <img src={resolveAsset('office2.png')} alt="Sales Presentation Preview" />
          </CardPreview>

          <CardHeader
            image={<img src={resolveAsset('pptx.png')} width="32px" height="32px" alt="Microsoft PowerPoint logo" />}
            header={
              <Body1 as="h5" style={{ margin: 0, fontWeight: 'bold' }}>
                App Name
              </Body1>
            }
            description={<Caption1>Developer</Caption1>}
            action={<Button appearance="transparent" icon={<MoreHorizontal20Regular />} aria-label="More options" />}
          />

          <p className={styles.text}>
            Donut chocolate bar oat cake. Dragée tiramisu lollipop bear claw. Marshmallow pastry jujubes toffee sugar
            plum.
          </p>

          <CardFooter>
            <Button appearance="primary" icon={<Open16Regular />} onClick={onActionCardClick}>
              Open
            </Button>
          </CardFooter>
        </Card>
      </section>

      <section>
        <Header
          title="Linked Card"
          description="When a card doesn't have a separate button within its contents, it usually makes the most sense for the title text of the card to become the additional interactive element (a link in this example)."
        />
        <Card className={styles.card} onClick={onLinkedCardClick} onKeyDown={onLinkedCardKeyDown} focusMode="off">
          <CardPreview>
            <img src={resolveAsset('office2.png')} alt="Sales Presentation Preview" />
          </CardPreview>

          <CardHeader
            image={<img src={resolveAsset('pptx.png')} width="32px" height="32px" alt="Microsoft PowerPoint logo" />}
            header={
              <Text as="h5" style={{ margin: 0 }}>
                <Link href="https://www.microsoft.com/" target="_blank" ref={linkRef} className={styles.link}>
                  <b>App Name</b>
                </Link>
              </Text>
            }
            description={<Caption1>Developer</Caption1>}
            action={<Button appearance="transparent" icon={<MoreHorizontal20Regular />} aria-label="More options" />}
          />
        </Card>
      </section>
    </div>
  );
};

WithAction.parameters = {
  docs: {
    description: {
      story:
        "When giving a card a top-level click handler, it's important to ensure the same action can be done by a button or link within the Card. " +
        'This ensures the action is accesible to screen reader, touch screen reader, keyboard, and voice control users.',
    },
  },
};
```

## Best Practices

### Do's

- Compose the internal anatomy with CardHeader, CardPreview and CardFooter so padding, spacing and text hierarchy stay consistent across every card in a collection.
- Pair any root-level click handler with an equivalent interactive element inside the card, such as a Button in CardFooter or a Link in the header, so keyboard, screen reader, touch and voice users can perform the same action.
- Choose the appearance based on the container behind the card: filled for most surfaces, filled-alternative when the card sits on a lighter gray or white background, outline when you want a discernable border without a fill, and subtle when the card should blend into the page but still show a visible footprint on interaction.
- Keep size consistent within a single collection, since size changes padding and border radius and mixing small, medium and large makes a grid look uneven.
- When you add a Checkbox through floatingAction, give it an accessible name that matches the card title, for example by pairing aria-labelledby with the id of the title text.
- Explicitly disable the interactive children of a disabled card, such as buttons, checkboxes and fields, because the disabled prop does not propagate to them.
- Use defaultSelected for simple self-contained cards and switch to the controlled selected plus onSelectionChange pair as soon as the parent needs to read or override the selection.
- Use shouldRestrictTriggerAction to prevent the card's selection action from firing for interactions that belong to inner controls, rather than stopping propagation from inside those controls.

### Don'ts

- Don't add onClick to the card root and stop there; with the default focusMode of off the root is not focusable, so the action is unreachable from the keyboard.
- Don't assume the disabled prop greys out and blocks the buttons and fields inside the card; those child components keep their own enabled state and must be disabled individually.
- Don't set both selected and defaultSelected on the same card, because mixing controlled and uncontrolled selection makes the rendered state unpredictable.
- Don't use size as a layout control for the card's width or height; it only affects padding and border radius, so dimensions still come from your own layout or className.
- Don't apply the no-tab focusMode to cards in a long list or gallery where a keyboard trap would make it hard to move between items; Escape is the only way out.
- Don't hand-roll card surfaces with custom shadows and borders when one of the four appearance values already matches the surface you are placing the card on.
- Don't drop images into CardPreview without alt text, and don't overload floatingAction with multiple controls since it is a single top-right affordance.

## Anti-Patterns

### Card treated as a link or button

❌ Adding only an onClick to the card root makes the card look clickable but leaves it non-focusable with the default focusMode of off, so keyboard, screen reader, touch screen reader and voice control users cannot reach the action.

✅ Render a real Button in CardFooter or a Link in the header that performs the same action, or handle Enter on the root to match the click handler, as shown in the card-with-action guidance.

### Relying on disabled to disable the card contents

❌ The disabled prop disables the card and its selection but is not propagated to children, so inner buttons, checkboxes and fields stay enabled and can still be activated from inside a visually disabled card.

✅ Disable each interactive child explicitly alongside the card, so state, focus and announcements stay consistent.

### Checkbox in floatingAction without a shared accessible name

❌ A selection checkbox whose accessible name is generic or missing leaves screen reader users unable to tell which card they are selecting, and a checkbox state that is not synced with the card's selected state shows contradictory feedback.

✅ Give the checkbox an aria-labelledby reference to the card title id and keep its checked state and the card's selected state driven by the same handler, as the selectable-indicator example does.

### Using appearance or size to signal selection

❌ Repurposing subtle or outline appearances to mean 'selected' hides selection state from every consumer that relies on the built-in selected styling and confusingly changes the surface semantics of the card.

✅ Use the selected and defaultSelected props with onSelectionChange for state, and reserve appearance for the surface treatment and size for padding and radius.

### Focus trap around every card in a grid

❌ Using no-tab on a large collection creates many nested traps that force Escape presses to move between cards, which is hostile to keyboard users and risks failing the no-keyboard-trap requirement.

✅ Prefer off or tab-only in collections, keep the primary action on an inner Button or Link, and reserve trapping modes for single, deliberate card interactions.

## Accessibility

**Requirements**: Card is a container, so most WCAG obligations fall on the content inside it, but several are specific to the component. Keyboard operability (WCAG 2.1.1) means any action reachable by clicking the card surface must also be reachable through an in-card Button or Link, or through an explicit Enter handler on the root. Focus must stay visible on those inner controls (WCAG 2.4.7) and focus order must remain logical when focusMode is managing focus (WCAG 2.4.3). No focusMode may create a keyboard trap (WCAG 2.1.2): no-tab releases focus only on Escape, tab-exit also releases on Tab, and tab-only never traps at all. Non-text contrast (WCAG 1.4.11) matters for the outline and filled-alternative surfaces against their backdrop, and text contrast (WCAG 1.4.3) applies to any text rendered on the four appearances. Images inside the card need alt text and icon-only buttons need an aria-label.

| Key | Action |
| --- | --- |
| `Enter` | Activates the card's selection action when the card is selectable, and moves focus into the card contents when focusMode is no-tab, tab-exit or tab-only. On the root it only fires when focus is already inside the card, which is why an inner Button or Link should own the primary action. |
| `Escape` | Releases the focus trap created when focusMode is no-tab or tab-exit and returns focus out of the card. |
| `Tab` | Moves focus between the interactive elements inside the card. With tab-exit, focus leaves the card after the last inner element; with tab-only, focus cycles through the card contents and is then released. With the default focusMode of off, Tab follows normal document order and may skip the card entirely. |
| `Shift + Tab` | Moves focus backwards through the card's interactive elements, mirroring the Tab behavior for the currently active focusMode. |

**ARIA**: aria-disabled, aria-labelledby, aria-label, role (for example role="listitem" on cards rendered inside a role="list" collection)

**Screen Reader**: A Card is announced as a generic container, not as a button or link, so a click handler on the root is invisible to screen reader users; they only discover the actions you render as real buttons and links. When disabled is set, the root exposes aria-disabled="true" and the card is not focusable, so assistive technology announces the disabled state and users skip past it in the tab order. A selectable card does not announce its selected state by itself; screen readers learn the state from the checkbox you compose in floatingAction, which is why that checkbox's accessible name must match the card title. Because disabled is not propagated to children, inner buttons and fields keep announcing their own enabled state unless you disable them explicitly.

## Styling

Card is styled with Griffel, so extend it with makeStyles and the tokens object from @fluentui/react-components, and merge classes with mergeClasses when you add layout on top of the built-in styles. The most common overrides are the surface treatment (for example tokens.colorNeutralBackground1 for filled cards, tokens.colorNeutralBackground2 to match a filled-alternative look, tokens.colorNeutralStroke1 with no shadow to imitate outline, and tokens.colorNeutralBackground1Hover for the visible footprint of a subtle card), the corner radius (tokens.borderRadiusMedium, tokens.borderRadiusLarge, tokens.borderRadiusXLarge) and the internal padding (tokens.spacingVerticalM with tokens.spacingHorizontalM, or tokens.spacingVerticalL for larger cards). Prefer changing appearance or size over rewriting colors by hand so dark and high-contrast themes keep working. When composing CardPreview, give media explicit dimensions or a fixed aspect ratio, round inner media with tokens.borderRadiusMedium, and use tokens.colorNeutralBackground3 as a muted backdrop behind logos as the examples do. For selected cards, brand tokens such as tokens.colorCompoundBrandStroke for the border and tokens.colorBrandBackground2 for the fill keep the state obvious in every theme, while focus rings typically rely on tokens.colorStrokeFocus2 and separators on tokens.colorNeutralStroke1. Text inside the card should use neutral foreground tokens such as tokens.colorNeutralForeground1 for titles and tokens.colorNeutralForeground2 for secondary lines so the four appearances stay legible.

## Performance

Card itself is a lightweight container, so cost comes from how many you render and what you put inside each one. A grid of hundreds of cards multiplies the work of CardHeader, CardPreview and CardFooter plus any buttons, images and badges, so virtualize or paginate large collections and prefer size small for dense lists. Callbacks such as onSelectionChange and shouldRestrictTriggerAction should be stable across renders (memoize them, as the selectable-indicator example does with React.useCallback) so that memoized card components are not invalidated. Any focusMode other than off adds focus management and key handling per card, so leave it at off unless the interaction model actually needs it. CardPreview images should declare dimensions or a fixed aspect ratio so the grid does not reflow as images load, and keep interactive content inside a card to a minimum because each control adds its own listeners and focus stop.

## Theming & Tokens

Card responds entirely to Fluent theme tokens, so switching theme or brand changes its surface without code changes. The appearances map onto neutral surface tokens: filled resolves to a neutral background such as tokens.colorNeutralBackground1 with a shadow and a neutral stroke, filled-alternative uses a slightly darker neutral surface (for example tokens.colorNeutralBackground2) to keep contrast on light surroundings, outline drops the fill and shadow and relies on tokens.colorNeutralStroke1, and subtle removes both background and border while keeping interaction tokens such as tokens.colorNeutralBackground1Hover and tokens.colorNeutralBackground1Pressed for its visible footprint. Selected cards use brand tokens for their fill and border, typically variations of tokens.colorBrandBackground2 and tokens.colorCompoundBrandStroke, and focus visuals use tokens.colorStrokeFocus2. Size drives corner radius and spacing tokens such as tokens.borderRadiusMedium and tokens.spacingVerticalM, while text inside the card should use tokens.colorNeutralForeground1 and tokens.colorNeutralForeground2 so it stays legible on every appearance.

## Migration Notes

Fluent UI React v8 did not ship this Card primitive, so migrations usually replace custom div-based tiles or the experimental v8 card implementations. The v9 Card is composition first: structure comes from CardHeader, CardPreview and CardFooter instead of a fixed set of props, and styling is done through className plus Griffel makeStyles and tokens rather than the mergeStyleSets and styles-prop pattern. Selection and focus management are new capabilities in v9; selected, defaultSelected, onSelectionChange, shouldRestrictTriggerAction and focusMode have no v8 equivalent. When porting, move surface treatment to appearance (filled, filled-alternative, outline or subtle), move internal padding and radius to size, and add an explicit Button or Link for every action that previously lived only on the container element.

## Edge Cases

- disabled is not propagated to children: buttons, checkboxes and fields inside a disabled card keep their own enabled behavior and must be disabled explicitly.
- Selectable cards do not include an element that represents their selection state by default, so you must compose an indicator such as a Checkbox through floatingAction for the state to be visible and announced.
- The card exposes a checkbox slot described as rendering when the card is selectable, while the guidance also states that no selection indicator is included by default; when you compose your own checkbox, verify the rendered output so only one indicator is presented.
- With focusMode set to no-tab, focus leaves the card only on Escape, so inner content that swallows Escape or users who do not know the shortcut can get stuck inside the card.
- An Enter handler placed on the card root only fires when focus is already inside the card, which is why a root click handler still needs a real Button or Link for keyboard users.
- Setting both selected and defaultSelected mixes controlled and uncontrolled behavior and makes the rendered selection unpredictable.
- size changes padding and border radius only, not the card's width or height, so grids still need their own layout rules to align cards of different content lengths.
- With orientation set to horizontal the anatomy changes and CardPreview becomes a leading image, which usually needs explicit sizing to avoid stretched or oversized media.

## See Also

- [layout category](../categories/layout.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
