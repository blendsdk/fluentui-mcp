# Card

> **Package**: `@fluentui/react-card` v9.7.0
> **Import**: `import { Card } from '@fluentui/react-components';`
> **Category**: layout
> **Stability**: stable

## Overview

Card is a layout container that groups related content and actions about a single subject onto a distinct, themed surface. It is a composition-first component: the documented examples build cards out of Card combined with CardHeader, CardPreview and CardFooter to produce anything from a simple media tile to a rich document, task or file card. Card exposes four appearances (filled, filled-alternative, outline and subtle), three sizes (small, medium and large) that drive padding and border radius rather than fixed dimensions, and both vertical (default) and horizontal orientation. A card can be purely presentational, interactive through a root click handler, or selectable through the selected, defaultSelected and onSelectionChange props. Four focus strategies (off, no-tab, tab-exit and tab-only) let the card become focusable and manage the focus of its inner contents. A floatingAction slot renders an affordance such as a Checkbox in the top-right corner, and an internal checkbox slot renders when the card is selectable. A disabled card suppresses interaction, blocks selection changes and is exposed as aria-disabled, although it does not propagate disabled to its children.

**When to use**: Use Card when a set of related information and the actions that apply to it should read as one visual unit: document and file tiles, app launchers, template galleries, person or mention cards, and task or checklist tiles. Use it when you need a consistent themed surface with a choice of elevation, outline or borderless treatments, when cards need to be selectable (single-item selection with a controlled or uncontrolled selected state), or when the card must manage focus for its own contents through focusMode. Use Card instead of a plain div whenever you want the Fluent surface, radius, spacing and interaction states without hand-rolling them, and instead of a Table or List when items are heterogeneous, media-rich, or need to be scanned visually rather than compared column by column. Use a Dialog or Drawer when the content should not be permanently present on the page, and a MessageBar or Toast when you are communicating status rather than containing subject-matter content. For dense, sortable, columnar data, prefer Table; for repeated vertical rows of the same shape, prefer List.

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

- **appearance**: Selects the visual treatment of the card surface. Use filled for most designs; filled-alternative when the card sits on a lighter gray or white surface so the card still reads as a separate layer; outline when you want a discernible border with no filled background; subtle when the container should have no background or border but should still show interaction states. The default is filled. `filled-alternative`
- **focusMode**: Controls whether the card is focusable and how it manages focus for its contents. Leave it at off for presentational cards and for cards whose interactive children already handle focus. Use tab-only when the card should be reachable and its inner elements cycled through Tab before releasing focus, tab-exit when focus should be trapped after Enter but released when Tab leaves the last inner element, and no-tab only when focus must stay inside the card until Escape is pressed. The default is off. `tab-exit`
- **orientation**: Chooses the internal layout direction. Keep the default vertical for the common header, media and footer stack, and switch to horizontal when the media should sit beside the text, typically with CardPreview as the leading element. The default is vertical. `horizontal`
- **size**: Adjusts border radius and the padding between inner elements, not the card's actual dimensions. small suits compact grids and dense lists, medium is the default balance for most page content, and large suits prominent or hero-like cards. The default is medium. `small`
- **selected**: Drives the controlled selected state. Pass it together with onSelectionChange when selection is owned by your component, and reconcile the value with any composed checkbox so the checkbox and card never disagree. `true`
- **defaultSelected**: Sets the initial selection for an uncontrolled selectable card. Use it only when you do not need to track the value externally, and never combine it with selected on the same card. `true`
- **onSelectionChange**: Called when the card's selected state changes, receiving the event and data containing the resulting selected value. Use it to update your controlled state, and remember that a composed checkbox in floatingAction fires its own change in addition to this callback, so merge both signals into a single boolean as the selection indicator example does. `data.selected`
- **disabled**: Makes the card and its selection non-interactive, marks the root aria-disabled, removes it from the tab order and disables the internal checkbox. It does not propagate to children, so disable nested buttons, links and fields yourself. `true`
- **shouldRestrictTriggerAction**: A predicate that receives the selection-change event and returns whether the card's own selection action should be skipped for that event. Use it to keep clicks on nested interactive content, such as an options button or an inner link, from toggling the card's selection. `predicate returning true for events originating in a nested control`
- **floatingAction**: Slot rendered in the top-right of the card, most often a Checkbox that visualizes the card's selection state. Keep the control's accessible name synchronized with the card title, typically by pairing useId with aria-labelledby, and wire its change handler to the same state used for selected and onSelectionChange. `Checkbox with aria-labelledby pointing at the card title`

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

- Use the default filled appearance for most cards, and switch to filled-alternative when the card sits on a lighter gray or white surface so there is adequate contrast between the card and the page background.
- Use outline when you want a discernible border without a filled background, and subtle when the surface itself should disappear but interaction states should still show a visible footprint.
- Give selectable cards a visible and accessible selection indicator by composing a Checkbox into the floatingAction slot, and make that checkbox's accessible name match the card's title, for example with useId plus aria-labelledby, as shown in the selection indicator example.
- When you attach a top-level click handler to a card, always provide an equivalent action through a real Button or Link inside the card so screen reader, touch screen reader, keyboard and voice control users can perform the same action.
- Keep selection controlled with selected plus onSelectionChange when the selection is shared with an external control such as a checkbox, and fall back to defaultSelected only for simple uncontrolled cases.
- Use onSelectionChange to read the resulting selected value from the callback data and reconcile it with any composed checkbox state, as the selection indicator example does by coalescing selected and checked into one boolean.
- Pick a focusMode deliberately: leave off for presentational and non-interactive cards, and choose tab-only or tab-exit when the card should be reachable and manage focus for its inner elements.
- Use shouldRestrictTriggerAction to suppress the card's own selection action when a click originates inside a nested interactive element, so inner buttons and links do not accidentally toggle the card.
- Choose size to keep padding and radius consistent across a set of cards; small, medium and large are about density and rhythm, not about the card's physical dimensions.
- Use horizontal orientation together with CardPreview when the image or media should sit beside the text rather than above it, and size the preview so it does not collapse.
- Give every image inside CardPreview and CardHeader a meaningful alt text, as every documented example does.

### Don'ts

- Do not rely on a click handler on the card root as the only way to trigger the card's action; a clickable surface without a role, name or focusable equivalent is unreachable for keyboard and assistive technology users.
- Do not assume disabled propagates to children. Card disables itself and its internal checkbox, but nested buttons, links and fields must be disabled explicitly.
- Do not pass both selected and defaultSelected; mixing controlled and uncontrolled selection makes the rendered state ambiguous.
- Do not nest interactive elements inside a selectable card without restricting the card's trigger action, or clicking the inner control will also change the card's selection.
- Do not use focusMode no-tab casually: it traps focus inside the card from the moment Enter is pressed and only releases on Escape, which can strand keyboard users.
- Do not use Card as a generic page or section container; it is a surface for one subject, and nesting cards or wrapping whole page layouts in a card dilutes the visual hierarchy.
- Do not ship selectable cards with no visual selection indicator, and do not give a composed checkbox a label that differs from the card title; the two should match.
- Do not remove or suppress the focus indicator on focusable cards, and do not add your own tabindex instead of using focusMode.
- Do not rely on the subtle appearance to be legible over busy imagery; subtle removes the background and border, so check contrast against whatever sits behind it.

## Anti-Patterns

### Clickable card with no accessible equivalent

❌ A click handler on the card root gives you a clickable surface with no role, no name and no keyboard affordance, so screen reader, voice control and keyboard users cannot perform the action that mouse users can.

✅ Always provide an equivalent Button or Link inside the card, as the action examples do with an Open button and a linked title, and only then consider adding the root click handler. If the card itself must be focusable, choose a focusMode and handle Enter on the card root.

### Assuming disabled cascades to children

❌ Card disables itself and its internal checkbox, but it has limited control over slot contents, so nested buttons, links and form fields stay fully interactive inside a visually disabled card.

✅ Explicitly disable every interactive child, as the disabled examples do, and verify that no control inside the card remains focusable or actionable once the card is disabled.

### Nested controls that also toggle the card

❌ In a selectable card, clicking an inner more-options button, link or field can propagate to the card surface and flip the selection at the same time, producing surprising state changes and confusing announcements.

✅ Provide shouldRestrictTriggerAction to detect events originating inside nested interactive content and skip the card's selection action for them.

### Selectable card with no visible or accessible selection indicator

❌ By default selectable cards include no element representing selection, so users cannot see the state and assistive technology has nothing to announce, especially when selection is only conveyed by a subtle background change.

✅ Compose a Checkbox into the floatingAction slot, bind it to the same selected state as the card, and give it an accessible name that matches the card title using aria-labelledby with a stable id.

### Trapping focus with no reasonable exit

❌ focusMode no-tab keeps focus inside the card after Enter is pressed and only releases on Escape, which can be disorienting or effectively a keyboard trap if the card has few or no focusable children.

✅ Prefer tab-only or tab-exit for most interactive cards, reserve no-tab for cases that genuinely behave like a contained widget, and make sure there is always a sensible way to leave the card.

### Mixing controlled and uncontrolled selection

❌ Passing selected and defaultSelected together makes the rendered and reported selection state ambiguous, and updates may appear to be ignored.

✅ Choose one model: controlled with selected plus onSelectionChange, or uncontrolled with defaultSelected alone.

### Using Card as a generic page container

❌ Wrapping whole page sections or lists in a card flattens the hierarchy, multiplies surfaces and shadows, and makes every region of the page compete for attention.

✅ Reserve Card for one subject per surface, group related cards in a plain layout container, and use Divider, Text and section headings for page-level structure.

## Accessibility

**Requirements**: Interactive and selectable cards must be operable without a mouse, must show a visible focus indicator, and must not rely solely on the card surface for an action. Provide an equivalent Button or Link inside the card for any root-level click behavior, keep the internal checkbox's accessible name aligned with the card title, and expose the disabled state through aria-disabled while making sure disabled cards are removed from the tab order. Text and controls inside a card must meet WCAG contrast ratios against the card background for every appearance, which is why filled-alternative and outline exist for lighter or busier surfaces. Selection must never be communicated by color or shadow alone; compose a visible control such as a Checkbox through floatingAction.

| Key | Action |
| --- | --- |
| `Enter` | Selects the card when it is selectable and, in the no-tab and tab-exit focus modes, moves focus into the card and traps it there. When the application handles Enter on the card root for a root click handler, it performs the card's primary action. |
| `Escape` | Releases the trapped focus and returns it outside the card in the no-tab and tab-exit focus modes. |
| `Tab` | Moves focus between the card's inner elements. With tab-exit focus is released when focus leaves the last inner element, and with tab-only the card cycles through all inner elements and then releases focus after the last one. |
| `Shift+Tab` | Moves focus backwards through the same inner elements and follows the same release behavior as Tab. |
| `Space` | Toggles the internal checkbox, or a Checkbox composed through floatingAction, when that checkbox has focus. |

**ARIA**: aria-disabled, aria-labelledby, aria-label, aria-checked, role

**Screen Reader**: Card renders a plain container element, so unless you apply a role such as listitem for grouped cards, screen readers do not announce a card-specific role or name. The clickable card root itself produces no announcement, which is exactly why the documented action example pairs the root click handler with an ordinary Button or Link that screen readers, touch screen reader users, keyboard users and voice control users can all reach. A disabled card is announced as disabled because the root carries aria-disabled, and because it receives no tabindex it is skipped in the tab order, so the disabled state is conveyed without creating a focus trap. In selectable cards, the internal checkbox is the element carrying the checked state; when you compose your own Checkbox through floatingAction, reference the card title with aria-labelledby so the checkbox is announced with the card's name rather than as an unlabeled checkbox. Icon-only actions inside a card, such as a more options button, need aria-label so they are not announced as unlabeled buttons.

## Styling

Style cards with makeStyles and mergeClasses rather than inline styles so Griffel can emit atomic, cached classes, and pass your class through className, which is merged with the component's own classes. Because the appearance variants are token-driven, you can tint a card without reimplementing its states: override background with tokens.colorNeutralBackground1 and tokens.colorNeutralBackground2, borders with tokens.colorNeutralStroke1 and tokens.colorBrandStroke1, and elevation with tokens.shadow2 or tokens.shadow4. Radius and inner rhythm follow size, so adjust tokens.borderRadiusSmall, tokens.borderRadiusMedium and tokens.borderRadiusLarge plus tokens.spacingVerticalS, tokens.spacingVerticalMNudge and tokens.spacingHorizontalS only when you genuinely need a density that the three sizes cannot express. For images in CardPreview, set explicit block sizes and use tokens.borderRadiusMedium for the inner radius so media and text share the same corner language; a className such as a gray background plus a small radius is a common way to frame previews. Hover, pressed and selected visuals should use the state tokens such as tokens.colorNeutralBackground1Hover, tokens.colorNeutralBackground1Selected and tokens.colorNeutralStroke1Selected rather than hard-coded colors, and the floatingAction slot usually needs tokens.spacingHorizontalS and tokens.spacingVerticalS offsets from the card's top-right corner.

## Performance

Card is a lightweight layout component: it renders one root element plus the optional floatingAction slot, and the internal checkbox slot only when the card is selectable, so per-card overhead is small. The larger cost in card-heavy screens comes from state management and styles, not the element itself. When a selection change re-renders a list of selectable cards, memoize the card item and its handlers with React.memo and useCallback so only the affected card re-renders, and reuse a single change handler for both onSelectionChange and the composed checkbox, as the selection indicator example does by extracting a shared state-setting callback. Use makeStyles and mergeClasses instead of inline style objects so Griffel can emit and cache atomic classes rather than regenerating objects each render. For long collections, virtualize the grid or list instead of mounting hundreds or thousands of cards at once, and serve correctly sized images for CardPreview so media decoding does not dominate layout work.

## Theming & Tokens

Card is fully token driven, so every appearance adapts automatically to the theme supplied by Provider, including the light, dark and Teams themes. The default filled surface draws on tokens.colorNeutralBackground1 with a border from tokens.colorNeutralStroke1 and elevation from shadow tokens such as tokens.shadow4, while filled-alternative shifts the surface toward tokens.colorNeutralBackground2 for contrast on light or white page backgrounds. outline uses the same neutral surface tokens but drops the shadow and keeps the border, and subtle removes both background and border while keeping interaction states. Interaction and selection states come from tokens such as tokens.colorNeutralBackground1Hover, tokens.colorNeutralBackground1Selected, tokens.colorNeutralStroke1Hover, tokens.colorNeutralStroke1Selected and tokens.colorBrandStroke1, which is how selected cards pick up the brand color. Disabled treatment comes from tokens.colorNeutralForegroundDisabled and tokens.colorNeutralBackgroundDisabled. Spacing and radius follow size through tokens.spacingVerticalS, tokens.spacingHorizontalS, tokens.spacingVerticalMNudge, tokens.borderRadiusSmall, tokens.borderRadiusMedium and tokens.borderRadiusLarge, and text inside cards typically inherits tokens.colorNeutralForeground1 through Text and Caption1. Overriding any of these on className keeps the token contract intact while still tracking theme changes.

## Migration Notes

Card is not deprecated in Fluent UI React v9, so no migration is required within v9. If you are porting a Card from another design system or from an earlier Fluent surface, the main differences to plan for are that this API is composition-based (the header, preview and footer are separate components layered as children rather than props), that surface treatment is expressed through the appearance prop instead of bespoke CSS, and that selection and focus behavior are opt-in: selected, defaultSelected and onSelectionChange enable selection, while focusMode must be set before the card becomes focusable or manages focus. Selection indicators are not built in either; they are composed through floatingAction with your own Checkbox.

## Edge Cases

- disabled on Card does not propagate to children; the internal checkbox is disabled automatically, but any Checkbox you compose through floatingAction, plus buttons, links and fields inside the card, must be disabled manually.
- Disabled cards receive no tabindex, so they are skipped in the tab order and cannot be focused, which is intended but means you cannot rely on focus to discover a disabled card's content.
- In selectable cards, the card's selection change and a composed checkbox's change are two separate events; the selection indicator example reconciles them by treating selected or checked as the resulting boolean, and you should do the same to avoid flicker or a stuck checkbox.
- focusMode no-tab traps focus from the moment Enter is pressed until Escape is pressed, so a card with no focusable children can feel like a dead end for keyboard users.
- The card root carries no implicit role or accessible name, so an interactive card surface is invisible to assistive technology unless you provide an inner Button or Link or apply a role of your own.
- Passing selected together with defaultSelected produces ambiguous state; pick controlled or uncontrolled.
- Horizontal orientation relies on the CardPreview having its own dimensions; without an explicit size the media can collapse or stretch unevenly next to the header.
- When cards are grouped for assistive technology, roles have to be applied by hand, for example role list on the container and role listitem on each card, as the templates example does.
- The subtle appearance has no background or border, so it can lose contrast against busy or image-backed surfaces even though its hover and focus states remain visible.

## See Also

- [layout category](../categories/layout.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
