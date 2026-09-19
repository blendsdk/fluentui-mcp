# Overflow

> **Package**: `@fluentui/react-overflow` v9.8.0
> **Import**: `import { Overflow } from '@fluentui/react-components';`
> **Category**: utilities
> **Stability**: stable

## Overview

Overflow is a layout utility that keeps a collection of items inside its container by measuring the available space and collapsing the items that no longer fit. It does not render any visual chrome of its own; instead it provides the coordination layer: you wrap each child in an OverflowItem, place those items (plus your overflow menu) inside the Overflow container, and the component observes the container to decide which items stay visible and which are hidden. Collapsed items are not lost — hooks such as useOverflowMenu report isOverflowing, overflowCount and a ref for a trigger element, so the hidden items can be re-rendered inside a Menu. Items can be prioritized so they collapse in a defined order that does not follow DOM order, grouped with groupId so related items (and their dividers) collapse as a unit, and marked as pinned so they never overflow regardless of container size. Visibility can be observed at three levels: per item via useIsOverflowItemVisible, per group via useIsOverflowGroupVisible, and globally via the onOverflowChange callback, which makes Overflow suitable for responsive toolbars, command bars, filter rows and similar adaptive item strips.

**When to use**: Use Overflow when a set of items (buttons in a command bar or toolbar, filters, tags, actions) must adapt to the available width or height without wrapping, clipping or hard-coding a visible count, and when the items that no longer fit must be surfaced somewhere else — most commonly inside a Menu. It is the right choice when you need programmatic knowledge of what is hidden: to keep the currently selected item visible by pinning it, to keep group dividers consistent so no trailing or doubled dividers appear, or to trigger other UI when visibility changes through onOverflowChange. Overflow also handles vertical collapsing through overflowAxis and reverse-order collapsing through overflowDirection for items that are laid out right-to-left or against the natural DOM order. Avoid Overflow when the items are simply allowed to wrap onto multiple lines — plain flex wrapping is simpler and cheaper. Also avoid it when you already get equivalent behaviour from a container that manages its own overflow, or when there are only one or two items whose visibility never changes, because the measurement machinery is unnecessary in those cases.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `React_2.ReactElement` | — | Yes | — |
| `children` | `React_2.ReactElement` | — | Yes | — |
| `groupId` | `string` | — | No | — |
| `id` | `string` | — | Yes | — |
| `onOverflowChange` | `(ev: null, data: OverflowState) => void` | — | No | — |

### Prop Guidance

- **id**: Required on every OverflowItem. Use a unique, stable string that identifies the item; the same value is used later to query visibility with useIsOverflowItemVisible and to key the collapsed rendering inside the overflow menu. `toolbar-item-1`
- **groupId**: Optional on OverflowItem. Assign the same string to items that should collapse as a unit; query the group with useIsOverflowGroupVisible to decide whether the group's separator or container-level UI should still render. The group visibility value distinguishes a currently visible group from one that has been hidden and one that is in transition to the overflow region, so handle the overflowing case explicitly. `group-3`
- **children**: The measured content of the container. Render OverflowItem children (each with an id) plus your overflow menu element. Keep the container to a single flex line or column so measurement reflects what the user sees, and pass any custom wrapper components through React.forwardRef so the internal ref attaches. `OverflowItem elements and the overflow menu`
- **onOverflowChange**: Optional callback invoked with the new overflow state whenever visibility is recalculated. Use it to synchronize external UI with what the user can actually see; the event argument is null, so read the state from the second argument. `setOverflowState(data)`
- **padding**: Reserves space for unmeasured content in the container, such as small dividers that are not wrapped in OverflowDivider. Set it to approximately the horizontal space those elements occupy so items overflow at the correct point rather than being clipped. `40`
- **minimumVisible**: Sets a floor on how many items stay visible. Collapsing stops once this number of items would be exceeded, which prevents a container from emptying itself completely on very narrow viewports. `4`
- **overflowAxis**: Chooses the axis along which items collapse. Defaults to the horizontal axis; set it to vertical when items are stacked and collapse downward, and make sure the container is a column layout so measurement matches. `vertical`
- **overflowDirection**: Controls which end of the container items collapse from. The default collapses from the end of the DOM order; set it to start when the overflow menu sits before the items, so items disappear in reverse DOM order. `start`
- **priority**: Numeric priority on OverflowItem that determines collapse order independently of DOM order. Lower values collapse first; items without competing priorities fall back to DOM order. `3`
- **pinned**: Marks an OverflowItem as always visible. Pinned items never overflow regardless of container size, which is useful for keeping a current selection on screen; multiple items may be pinned at once, but pinning too many forces everything else to collapse. `true`

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement, OverflowItemProps } from '@fluentui/react-components';

export const Default = (): JSXElement => {
  const styles = useStyles();

  const itemIds = new Array(8).fill(0).map((_, i) => i.toString());

  return (
    <Overflow>
      <div className={mergeClasses(styles.container, styles.resizableArea)}>
        {itemIds.map(i => (
          <OverflowItem key={i} id={i}>
            <Button>Item {i}</Button>
          </OverflowItem>
        ))}
        <OverflowMenu itemIds={itemIds} />
      </div>
    </Overflow>
  );
};

const OverflowMenuItem: React.FC<Pick<OverflowItemProps, 'id'>> = props => {
  const { id } = props;
  const isVisible = useIsOverflowItemVisible(id);

  if (isVisible) {
    return null;
  }

  // As an union between button props and div props may be conflicting, casting is required
  return <MenuItem>Item {id}</MenuItem>;
};

const OverflowMenu: React.FC<{ itemIds: string[] }> = ({ itemIds }) => {
  const { ref, overflowCount, isOverflowing } = useOverflowMenu<HTMLButtonElement>();

  if (!isOverflowing) {
    return null;
  }

  return (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <MenuButton ref={ref}>+{overflowCount} items</MenuButton>
      </MenuTrigger>

      <MenuPopover>
        <MenuList>
          {itemIds.map(i => {
            return <OverflowMenuItem key={i} id={i} />;
          })}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};
```

### CustomComponent

```tsx
import * as React from 'react';
import type { JSXElement, ForwardRefComponent } from '@fluentui/react-components';

export const CustomComponent = (): JSXElement => {
  const styles = useStyles();

  const itemIds = new Array(8).fill(0).map((_, i) => i.toString());

  return (
    <Overflow>
      <div className={mergeClasses(styles.container, styles.resizableArea)}>
        {itemIds.map(i => (
          <OverflowItem key={i} id={i}>
            <ItemVisibleCustomComponent appId={i} />
          </OverflowItem>
        ))}
      </div>
    </Overflow>
  );
};

CustomComponent.parameters = {
  docs: {
    description: {
      story:
        'It is possible to wrap the `OverflowItem` children with a custom component instead of rendering them directly.\n\n__In this case it is important to use `React.forwardRef` and to pass the ref to the underlying component__, otherwise React will fail to attach the internal ref, resulting in an error.',
    },
  },
};
```

### Dividers

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';

export const Dividers = (): JSXElement => {
  const styles = useStyles();

  return (
    <Overflow padding={40}>
      <div className={mergeClasses(styles.container, styles.resizableArea)}>
        <OverflowItem id={'1'} groupId={'1'}>
          <Button>Item 1</Button>
        </OverflowItem>
        <OverflowGroupDivider groupId={'1'} />
        <OverflowItem id={'2'} groupId={'2'}>
          <Button>Item 2</Button>
        </OverflowItem>
        <OverflowGroupDivider groupId={'2'} />
        <OverflowItem id={'3'} groupId={'3'}>
          <Button>Item 3</Button>
        </OverflowItem>
        <OverflowItem id={'4'} groupId={'3'}>
          <Button>Item 4</Button>
        </OverflowItem>
        <OverflowGroupDivider groupId={'3'} />
        <OverflowItem id={'5'} groupId={'4'}>
          <Button>Item 5</Button>
        </OverflowItem>
        <OverflowItem id={'6'} groupId={'4'}>
          <Button>Item 6</Button>
        </OverflowItem>
        <OverflowItem id={'7'} groupId={'4'}>
          <Button>Item 7</Button>
        </OverflowItem>
        <OverflowGroupDivider groupId={'4'} />
        <OverflowItem id={'8'} groupId={'5'}>
          <Button>Item 8</Button>
        </OverflowItem>
        <OverflowMenu
          itemIds={['1', 'divider-1', '2', 'divider-2', '3', '4', 'divider-3', '5', '6', '7', 'divider-4', '8']}
        />
      </div>
    </Overflow>
  );
};

const OverflowGroupDivider: React.FC<{
  groupId: string;
}> = props => {
  const isGroupVisible = useIsOverflowGroupVisible(props.groupId);

  if (isGroupVisible === 'hidden') {
    return null;
  }

  return <Divider vertical appearance="brand" style={{ flexGrow: 0, paddingRight: '4px', paddingLeft: '4px' }} />;
};

const OverflowMenu: React.FC<{ itemIds: string[] }> = ({ itemIds }) => {
  const { ref, overflowCount, isOverflowing } = useOverflowMenu<HTMLButtonElement>();

  if (!isOverflowing) {
    return null;
  }

  return (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <MenuButton ref={ref}>+{overflowCount} items</MenuButton>
      </MenuTrigger>

      <MenuPopover>
        <MenuList>
          {itemIds.map(i => {
            // This is purely a simplified convention for documentation examples
            // Could be done in other ways too
            if (typeof i === 'string' && i.startsWith('divider')) {
              const groupId = i.split('-')[1];
              return <OverflowMenuDivider key={i} id={groupId} />;
            }
            return <OverflowMenuItem key={i} id={i} />;
          })}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};

const OverflowMenuItem: React.FC<{ id: string }> = props => {
  const { id } = props;
  const isVisible = useIsOverflowItemVisible(id);

  if (isVisible) {
    return null;
  }

  return <MenuItem>Item {id}</MenuItem>;
};

const OverflowMenuDivider: React.FC<{
  id: string;
}> = props => {
  const isGroupVisible = useIsOverflowGroupVisible(props.id);

  if (isGroupVisible === 'visible') {
    return null;
  }

  return <MenuDivider />;
};

Dividers.parameters = {
  docs: {
    description: {
      story: [
        'Dividers can be handled by assigning groups to overflow items. The visibility of the divider',
        'can be configured to depend on the overflow item group. This way dividers will also disappear',
        'once its group is completely overflowed and avoids trailing or double dividers.',
      ].join('\n'),
    },
  },
};
```

## Best Practices

### Do's

- Give every OverflowItem a unique and stable id — the id is required and is the key used by useIsOverflowItemVisible and by the keyed rendering of the collapsed items inside the overflow menu.
- Build the overflow menu from useOverflowMenu: read ref, overflowCount and isOverflowing, attach the ref to the menu trigger, label it with the live count, and render nothing at all when isOverflowing is false.
- Inside the overflow menu, skip items that are still visible by checking useIsOverflowItemVisible and returning nothing for them, so the inline row and the menu never show the same item twice.
- Assign groupId to items that belong together and drive divider rendering from useIsOverflowGroupVisible, so a divider disappears together with the last visible item of its group instead of leaving a trailing or doubled divider.
- Use OverflowDivider for larger or custom dividers so their width is included in the measurement, and the padding prop on Overflow for small dividers whose space is not measured.
- Express collapse intent with priority (a numeric order independent of DOM order), pinned (items such as the current selection that must always stay visible), and minimumVisible (a floor on how far collapsing may go).
- Subscribe to onOverflowChange when other parts of the UI must react to visibility recalculations, and store the reported overflow state rather than re-deriving it yourself.
- Wrap customized children of OverflowItem in React.forwardRef components and forward the ref to the underlying element; this is required for the internal ref to attach correctly.
- Render OverflowReorderObserver (a renderless component) when items are reordered, added or removed through React state without a container resize, for example in drag-and-drop scenarios.

### Don'ts

- Don't wrap OverflowItem children in a plain function component that ignores the ref — React will fail to attach the internal ref and will throw an error.
- Don't render an item in both the inline container and the overflow menu; check item visibility before rendering the menu entry so users and screen readers do not encounter duplicates.
- Don't hard-code the collapsed count in the trigger label; derive it from overflowCount so the text always matches the measured state.
- Don't render the overflow trigger unconditionally — hide it entirely when isOverflowing is false to avoid an empty or misleading menu affordance.
- Don't assume DOM order controls collapse when a priority scheme is in use; priorities override the visual order and the collapsed items must be presented accordingly.
- Don't expect the layout to be recalculated when you reorder or add items through React state alone; the manager listens to resize, so include OverflowReorderObserver for those mutations.
- Don't reuse or omit OverflowItem ids — duplicated ids break visibility lookups and produce incorrect menu contents.
- Don't rely on oversized, unmeasured dividers: a large divider that is not wrapped in OverflowDivider is not counted, which makes items overflow later than they should and clips content.

## Anti-Patterns

### Duplicating items between the container and the menu

❌ Rendering every item in the overflow menu without checking visibility means items that are still visible inline also appear in the popover, so users see duplicates and screen readers announce the same action twice.

✅ Query useIsOverflowItemVisible for each id in the menu and return nothing for items that are currently visible, so the inline row and the menu partition the items instead of overlapping.

### Wrapping OverflowItem children in non-forwardRef components

❌ The measurement machinery attaches an internal ref to the rendered child. A plain function component that swallows the ref prevents attachment and causes React to fail with an error.

✅ Use React.forwardRef in the custom wrapper and pass the received ref through to the underlying DOM element or component that is actually rendered.

### Hard-coded overflow counts and always-visible triggers

❌ A trigger that is always rendered, or that shows a hard-coded count, misreports the state whenever the container resizes or items change, and it presents an empty menu when nothing has collapsed.

✅ Read isOverflowing and overflowCount from useOverflowMenu, render the trigger only when isOverflowing is true, and interpolate the live count into the trigger label.

### Dividers that ignore overflow groups

❌ Rendering separators independently of item groups leaves trailing dividers at the end of the visible row or doubled dividers around the menu boundary, because a separator survives even when its whole group has collapsed.

✅ Assign groupId to the items around each separator and drive the divider from useIsOverflowGroupVisible, dropping it when the group is hidden and switching between an inline divider and a menu divider where appropriate.

### Reordering items without the reorder observer

❌ The manager recomputes on container resize, not on child mutation. Reordering, adding or removing items through React state without any size change leaves stale visibility, so items appear in the wrong place — the classic drag-and-drop failure.

✅ Render the renderless OverflowReorderObserver inside the container so the manager also watches child mutations and recomputes visibility after each reorder.

## Accessibility

**Requirements**: Overflow is a layout utility and renders no roles, labels or ARIA attributes of its own, so all accessibility obligations belong to the items you put inside it and to the overflow menu you compose. Visible items must be keyboard reachable in DOM order (WCAG 2.1.1 Keyboard, 2.4.3 Focus Order), and items that have collapsed must remain available through the overflow menu so that no action or information is lost when the container shrinks (WCAG 1.3.1 Info and Relationships, 1.4.10 Reflow). Grouped items should keep their relationships understandable once the group is split between the container and the menu. The overflow trigger needs a clear accessible name that communicates that additional items exist, and selectable items should expose their state — the Pinned recipe uses aria-pressed on the item's Button together with a pressed appearance so the selection state is available to assistive technology. Do not convey item state only through appearance (WCAG 1.4.1 Use of Color).

| Key | Action |
| --- | --- |
| `Tab` | Moves focus forward through the visible items in the container and into the overflow menu trigger. |
| `Shift+Tab` | Moves focus backwards through the visible items and out of the overflow trigger. |
| `Enter` | Activates the focused item (for example a Button inside an OverflowItem) and opens the overflow menu from its trigger. |
| `Space` | Activates the focused item or toggles a selectable/pinned item, and opens the overflow menu from its trigger. |
| `ArrowDown` | Moves focus to the next item inside the open overflow menu popover. |
| `ArrowUp` | Moves focus to the previous item inside the open overflow menu popover. |
| `Home` | Moves focus to the first item in the open overflow menu popover. |
| `End` | Moves focus to the last item in the open overflow menu popover. |
| `Escape` | Closes the overflow menu popover and returns focus to the overflow trigger. |
| `Character keys` | Type-ahead navigation to the matching item inside the open overflow menu popover. |

**ARIA**: aria-pressed — used on selectable items to expose their selected state, as demonstrated in the pinned-selection recipe., aria-haspopup — applied to the overflow trigger by the menu composition so assistive technology announces that it opens a menu., aria-expanded — applied to the overflow trigger by the menu composition to report whether the popover is open., Accessible name for the overflow trigger (its visible text, such as a count followed by the word items) so the number of collapsed items is announced.

**Screen Reader**: Because Overflow contributes no semantics, screen readers announce the visible items exactly as authored, in DOM order. Items that have collapsed are not announced while the container is at its current size, so the only route to them is the overflow menu; the trigger's accessible name should therefore state how many items are hidden. Once the popover is opened, the menu composition exposes the collapsed items as menu items, and arrow key, Home, End and type-ahead navigation work within the popover. Rendering an item in both the inline container and the menu causes it to be announced twice, so filter the menu contents with useIsOverflowItemVisible. Group dividers that are purely decorative should not be given text alternatives, since the grouping relationship is already conveyed by order and context.

## Styling

Overflow has essentially no styling surface of its own — no slots to override — so the visual result comes from the children you pass in. Style the measured container with makeStyles and keep the items in a single flex line (or column for the vertical axis) so measurement matches layout. The examples that place dividers between groups give the divider flexGrow of 0 and small horizontal paddings; prefer theme tokens such as tokens.spacingHorizontalXS (4px) and tokens.spacingHorizontalS for those paddings instead of literal pixel values, and use tokens.colorNeutralStroke1 or tokens.colorBrandStroke1 for the divider stroke depending on how prominent the separation should be. When a divider is genuinely wider than a hairline, wrap it in OverflowDivider so its width participates in the calculation; otherwise use the padding prop to reserve the space that the unmeasured divider consumes. For selected or pinned items, drive the Button appearance (primary versus secondary) together with aria-pressed, and give the container gaps with tokens.spacingHorizontalM or tokens.spacingVerticalM so the visual rhythm survives density changes. Keep interactive items sized by content, not by a fixed width, so the measurement stays accurate.

## Performance

Overflow measures items and recalculates visibility whenever the container resizes, so cost scales with the number of registered items and the complexity of their contents. Keep item ids and React keys stable: changing keys or remounting items forces fresh measurement and can visibly flicker while collapsing settles. Prefer one Overflow per logical region instead of nesting containers, and avoid inline style or layout thrash on the measured items, which would trigger repeated recomputation. Attach a memoized handler to onOverflowChange since it can fire on each recalculation, and avoid storing its result in state that feeds back into the children. Only include OverflowReorderObserver when the item set actually mutates without resizing; the additional mutation observation is unnecessary overhead for static rows. Finally, remember that items inside the overflow menu are still rendered React elements — keep their content lightweight.

## Theming & Tokens

Overflow itself does not consume theme tokens because it has no visual styles, so theming happens in the children and in the behaviour it coordinates. Buttons, Dividers and MenuItems placed inside it pick up tokens such as tokens.colorNeutralBackground1, tokens.colorNeutralForeground1, tokens.colorBrandBackground and tokens.colorNeutralStroke1 from the surrounding FluentProvider. The padding prop and any spacing you author for unmeasured dividers should use directional tokens (tokens.spacingHorizontalXS, tokens.spacingHorizontalS, tokens.spacingHorizontalM and the vertical equivalents) so that spacing, like the logical 'start' and 'end' values of overflowDirection, mirrors correctly when the Provider switches to right-to-left. Because measurement is based on rendered sizes, theme-driven changes to font size, density or control sizing are reflected automatically at the next resize calculation, but if you change sizes without any resize you must rely on the reorder observer or a re-render to refresh visibility.

## Migration Notes

Overflow is compositional rather than data-driven: instead of handing the component an array of items plus a separate overflow list, you render OverflowItem children directly and read visibility back through useOverflowMenu, useIsOverflowItemVisible and useIsOverflowGroupVisible. When moving an existing declarative item list onto Overflow, convert each entry into an OverflowItem with a stable string id (and a groupId where the entries were grouped), replace any manually computed collapse count with the overflowCount and isOverflowing values from the hook, and replace hand-rolled 'show the rest' lists with a Menu whose trigger carries the hook's ref. Behaviour that previously required manual resizing logic — priority-based collapsing, pinned entries, minimum visible counts and vertical collapsing — is now expressed declaratively through the priority, pinned, minimumVisible, overflowAxis and overflowDirection properties, and React state driven reordering additionally needs the renderless OverflowReorderObserver.

## Edge Cases

- Larger or custom dividers are not measured. If a divider is wider than a hairline and is not wrapped in OverflowDivider, items overflow later than expected and can be clipped; use the padding prop to compensate for small dividers or OverflowDivider for large ones.
- Group visibility is not a simple boolean. useIsOverflowGroupVisible distinguishes a visible group from one that is hidden and one that is transitioning into the overflow region, and it must be checked explicitly — for example treating only the hidden state as 'remove the divider' when the divider is also rendered inside the menu.
- Reordering or mutating items through React state without a container resize does not trigger a recompute; the manager reacts to resize only unless the renderless OverflowReorderObserver is present in the container.
- The documented story text for the change callback contains a typo — the actual prop name is onOverflowChange, and its first argument is null with the overflow state delivered as the second argument.
- Custom components that wrap an OverflowItem child must use React.forwardRef and forward the ref, otherwise React fails to attach the internal ref and throws.
- Pinned items never overflow regardless of container size, so pinning many items can force nearly everything else into the menu; combine pinning with overflowDirection and minimumVisible only after checking the worst-case narrow layout.
- minimumVisible stops collapsing at a fixed number of visible items, which means extremely narrow containers may keep items visible that no longer fit; verify the layout at the smallest supported width.
- Collapsed items must be reachable through the overflow menu; if you filter the menu contents by item visibility you must also include group-level entries and dividers so that no group loses its separator context.

## See Also

- - [utilities category](../categories/utilities.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
