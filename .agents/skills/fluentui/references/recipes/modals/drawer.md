# Drawer

> **Group**: modals

## Goal

Add an edge-anchored Drawer to a Fluent UI v9 app: a controlled overlay drawer that hosts a form with sticky header and footer, an inline (non-modal) drawer that acts as a persistent filter panel, and a nested inline drawer for a master–detail flow.

## When to Use

Use a Drawer when a task needs focused attention without navigating the user away from the page: create/edit forms opened from a table or list, record details, filter/settings panels, master–detail flows, and navigation rails on narrow screens. Choose `type="overlay"` when the task must be finished or dismissed before the user continues (the page behind is inert), and `type="inline"` when the panel should stay visible beside the content it affects and the page must remain interactive.

## When Not to Use

Do not use a Drawer for a short confirmation, a success/failure notice, or a small menu of commands — Dialog, MessageBar/Toast, and Menu/Popover are lighter and communicate intent better. Do not use an overlay drawer as route-level or app-level navigation; use page navigation or Nav. Avoid using an inline drawer for anything destructive or blocking, because it does not trap focus and the page stays fully interactive. Avoid stacking two overlay drawers (or an overlay drawer inside a Dialog) — nested focus traps conflict; nest an inline drawer instead.

A **Drawer** is an edge-anchored surface that holds one focused, secondary task: a create/edit form, a filter panel, record details, or a master–detail list. In Fluent UI v9 the Drawer is a compound component — `Drawer`, `DrawerHeader`, `DrawerHeaderTitle`, `DrawerBody`, `DrawerFooter` — that already handles the slide-in motion, the modal behaviour, the sticky header/footer, and the scrolling body. Compose those parts instead of building your own fixed-position `div`.

## Anatomy

```tsx
<Drawer type="overlay" position="end" size="medium" separator open={isOpen} onOpenChange={handleOpenChange}>
  <DrawerHeader>
    <DrawerHeaderTitle action={<Button appearance="subtle" onClick={close}>Close</Button>}>
      New project
    </DrawerHeaderTitle>
  </DrawerHeader>
  <DrawerBody>{/* scrolling content */}</DrawerBody>
  <DrawerFooter>{/* action bar */}</DrawerFooter>
</Drawer>
```

- `Drawer` — the root. Owns `type`, `position`, `size`, `separator`, and the open state.
- `DrawerHeader` + `DrawerHeaderTitle` — the non-scrolling title bar. The title is rendered as a heading; the `action` slot holds the dismiss button.
- `DrawerBody` — the only scrolling region. Everything that can grow goes here.
- `DrawerFooter` — a sticky action bar that stays visible while the body scrolls.

## 1. Choose the type

| Type | Behaviour | Good for |
| --- | --- | --- |
| `overlay` (default) | Rendered in a portal above the page; modal — focus is trapped, the backdrop blocks the page, and Escape closes it | Forms, detail views, anything the user should finish or dismiss |
| `inline` | Rendered in the document flow next to your content and takes up space; non-modal, no backdrop, no focus trap | Filters, settings rails, master–detail, persistent navigation |

Both types accept `position` (`start`, `end`, or `bottom`) and `size` (`small`, `medium`, `large`, `full`, or a CSS length such as `320px`). `start` and `end` flip automatically in RTL. Add `separator` when the drawer sits flush against other content and needs a divider.

## 2. Control the open state

```tsx
const [isOpen, setIsOpen] = React.useState(false);

<Drawer type="overlay" open={isOpen} onOpenChange={(_event, data) => setIsOpen(data.open)}>
  {/* ... */}
</Drawer>
```

`onOpenChange` fires for Escape, backdrop clicks, and programmatic requests, with `data.open` telling you the requested state. The Drawer is controlled: it only closes when you write the new value into state. That is also how you block a close — if a form is dirty, ignore `data.open === false` and show your own confirmation instead.

Inline drawers use the same `open` / `onOpenChange` pair (or `defaultOpen` when you do not need to control them); the drawer animates its width in and out of the layout.

## 3. Submitting from the footer

`DrawerFooter` lives outside `DrawerBody`, so it is outside your `<form>` element. Either

1. give the form an `id` and let the footer button submit it from a distance with `type` and `form`, or
2. keep the form state in React and have the footer button call your submit handler directly.

With option 1 the browser still performs the native submit, so your `onSubmit` runs and can call `event.preventDefault()`.

## 4. Reset before the next open

Field values live in React state, so they survive a close. Reset them on the close path, key the form on the record you are editing so it remounts with fresh values, or pass `unmountOnClose` to have the Drawer drop its content every time it closes. Stale values are the most common Drawer bug.

## 5. Nesting for master–detail

Render a second, `inline` drawer inside the first drawer's body: the outer overlay drawer keeps its focus trap and the inner panel slides in beside the list. Never nest two overlay drawers — their focus traps fight each other.

## 6. Compose the body with Fluent components

Everything in the component library works inside `DrawerBody`:

- Form: `Field` (label, `required`, `hint`, `validationState`, `validationMessage`) wrapping `Input`, `Select`, or `Textarea`. `Field` already renders the label, so a separate `Label` is rarely needed.
- Filters: `Checkbox`, `Switch`, `Slider`.
- Structure: `Text`, `Divider`.
- Actions and dismissal: `Button` in `DrawerHeaderTitle`'s `action` slot and in `DrawerFooter`.

## 7. Validate before you close

Because the drawer stays mounted, you can validate on submit and keep it open while `Field` shows its error state. Set a `validationState` of `error` together with a `validationMessage` string; the message is text, so it is announced to screen readers as well as shown visually.

## Examples

### Overlay drawer with a validated form

A controlled end-positioned overlay drawer that creates a project. It shows the compound anatomy (header, title with a close action, scrolling body, sticky footer), a form built from Field + Input/Select/Textarea, submit-from-footer via the form `id`, and state reset on close.

```tsx
import * as React from 'react';
import { Button, Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerHeaderTitle, Field, Input, Select, Textarea } from '@fluentui/react-components';

export const NewProjectDrawer = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [owner, setOwner] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  const isNameInvalid = submitted && name.trim().length === 0;

  const resetForm = () => {
    setName('');
    setOwner('');
    setDescription('');
    setSubmitted(false);
  };

  const closeDrawer = () => {
    setIsOpen(false);
    resetForm();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);

    if (name.trim().length === 0) {
      // Field renders the validation message; keep the drawer open.
      return;
    }

    // ...persist the project here...
    closeDrawer();
  };

  return (
    <>
      <Button appearance="primary" onClick={() => setIsOpen(true)}>
        New project
      </Button>

      <Drawer
        type="overlay"
        position="end"
        size="medium"
        separator
        open={isOpen}
        onOpenChange={(_event, data) => setIsOpen(data.open)}
      >
        <DrawerHeader>
          <DrawerHeaderTitle
            action={
              <Button appearance="subtle" onClick={closeDrawer}>
                Close
              </Button>
            }
          >
            New project
          </DrawerHeaderTitle>
        </DrawerHeader>

        <DrawerBody>
          <form
            id="new-project-form"
            onSubmit={handleSubmit}
            style={{ display: 'grid', rowGap: '16px' }}
          >
            <Field
              label="Project name"
              required
              validationState={isNameInvalid ? 'error' : 'none'}
              validationMessage={isNameInvalid ? 'Enter a project name.' : undefined}
              hint="Shown in the workspace switcher."
            >
              <Input
                value={name}
                onChange={(_event, data) => setName(data.value)}
                placeholder="Contoso migration"
              />
            </Field>

            <Field label="Owner" hint="Leave empty to keep the project unassigned.">
              <Select value={owner} onChange={(_event, data) => setOwner(data.value)}>
                <option value="">Unassigned</option>
                <option value="ana">Ana Bowman</option>
                <option value="liam">Liam Chen</option>
              </Select>
            </Field>

            <Field label="Description">
              <Textarea
                value={description}
                onChange={(_event, data) => setDescription(data.value)}
                resize="vertical"
                placeholder="What is this project about?"
              />
            </Field>
          </form>
        </DrawerBody>

        <DrawerFooter>
          <Button appearance="secondary" onClick={closeDrawer}>
            Cancel
          </Button>
          <Button appearance="primary" type="submit" form="new-project-form">
            Create project
          </Button>
        </DrawerFooter>
      </Drawer>
    </>
  );
};
```

### Inline filter drawer beside the results

A non-modal `type="inline"` drawer used as a persistent filter rail. It is controlled with `open` / `onOpenChange`, started at the logical `start` position, and connected to its toggle button with `aria-expanded` / `aria-controls`. The body uses Checkbox, Switch, Slider and Text.

```tsx
import * as React from 'react';
import { Button, Checkbox, Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerHeaderTitle, Slider, Switch, Text } from '@fluentui/react-components';

export const InlineFilterDrawer = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  const [includeArchived, setIncludeArchived] = React.useState(false);
  const [sharedWithMe, setSharedWithMe] = React.useState(true);
  const [radius, setRadius] = React.useState(25);

  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
      <Button
        appearance="secondary"
        aria-expanded={isOpen}
        aria-controls="filters-drawer"
        onClick={() => setIsOpen((previous) => !previous)}
      >
        {isOpen ? 'Hide filters' : 'Show filters'}
      </Button>

      <Drawer
        id="filters-drawer"
        type="inline"
        position="start"
        size="small"
        separator
        open={isOpen}
        onOpenChange={(_event, data) => setIsOpen(data.open)}
      >
        <DrawerHeader>
          <DrawerHeaderTitle>Filters</DrawerHeaderTitle>
        </DrawerHeader>

        <DrawerBody>
          <div style={{ display: 'grid', rowGap: '12px' }}>
            <Text weight="semibold">Status</Text>
            <Checkbox
              label="Include archived"
              checked={includeArchived}
              onChange={(_event, data) => setIncludeArchived(data.checked === true)}
            />
            <Switch
              label="Shared with me"
              checked={sharedWithMe}
              onChange={(_event, data) => setSharedWithMe(data.checked)}
            />

            <Text weight="semibold">Within distance</Text>
            <Slider
              min={0}
              max={100}
              value={radius}
              onChange={(_event, data) => setRadius(data.value)}
            />
            <Text size={200}>{`${radius} km`}</Text>
          </div>
        </DrawerBody>

        <DrawerFooter>
          <Button
            appearance="secondary"
            onClick={() => {
              setIncludeArchived(false);
              setSharedWithMe(true);
              setRadius(25);
            }}
          >
            Reset
          </Button>
          <Button appearance="primary" onClick={() => setIsOpen(false)}>
            Apply
          </Button>
        </DrawerFooter>
      </Drawer>

      <main style={{ flex: 1, minWidth: 0 }}>
        <Text block size={500} weight="semibold">
          Results
        </Text>
        <Text block>{`${radius} km radius`}</Text>
        <Text block>{includeArchived ? 'Archived included' : 'Active only'}</Text>
        <Text block>{sharedWithMe ? 'Shared with me' : 'All owners'}</Text>
      </main>
    </div>
  );
};
```

### Nested drawer for a master–detail queue

An overlay drawer lists tickets; choosing one renders a second, `inline` drawer inside the first drawer's body so the detail slides in beside the list without opening a second focus trap. Shows Text and Divider for structure and resetting the selection when the outer drawer closes.

```tsx
import * as React from 'react';
import { Button, Divider, Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerHeaderTitle, Text } from '@fluentui/react-components';

type Ticket = {
  id: string;
  title: string;
  requester: string;
  summary: string;
};

const tickets: Ticket[] = [
  {
    id: 'T-1042',
    title: 'Cannot sign in',
    requester: 'Ana Bowman',
    summary: 'SSO redirect loop after a password reset.',
  },
  {
    id: 'T-1043',
    title: 'Export fails',
    requester: 'Liam Chen',
    summary: 'CSV export times out for the quarterly report.',
  },
  {
    id: 'T-1044',
    title: 'Billing question',
    requester: 'Priya Nair',
    summary: 'Duplicate seat charge on the August invoice.',
  },
];

export const MasterDetailDrawer = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Ticket | undefined>(undefined);

  const closeDrawer = () => {
    setIsOpen(false);
    setSelected(undefined);
  };

  return (
    <>
      <Button appearance="primary" onClick={() => setIsOpen(true)}>
        Open support queue
      </Button>

      <Drawer
        type="overlay"
        position="end"
        size="large"
        separator
        open={isOpen}
        onOpenChange={(_event, data) => {
          if (!data.open) {
            setSelected(undefined);
          }
          setIsOpen(data.open);
        }}
      >
        <DrawerHeader>
          <DrawerHeaderTitle
            action={
              <Button appearance="subtle" onClick={closeDrawer}>
                Close
              </Button>
            }
          >
            Support queue
          </DrawerHeaderTitle>
        </DrawerHeader>

        <DrawerBody style={{ display: 'flex', padding: 0 }}>
          <div
            style={{
              display: 'grid',
              gap: '8px',
              alignContent: 'start',
              padding: '16px',
              minWidth: '220px',
            }}
          >
            {tickets.map((ticket) => (
              <Button
                key={ticket.id}
                appearance={selected?.id === ticket.id ? 'primary' : 'subtle'}
                style={{ justifyContent: 'flex-start' }}
                onClick={() => setSelected(ticket)}
              >
                {ticket.title}
              </Button>
            ))}
          </div>

          {selected && (
            <Drawer type="inline" position="end" size="small" separator>
              <DrawerHeader>
                <DrawerHeaderTitle>{selected.id}</DrawerHeaderTitle>
              </DrawerHeader>
              <DrawerBody>
                <div style={{ display: 'grid', rowGap: '8px' }}>
                  <Text size={400} weight="semibold">
                    {selected.title}
                  </Text>
                  <Text size={200}>{`Requested by ${selected.requester}`}</Text>
                  <Divider />
                  <Text>{selected.summary}</Text>
                </div>
              </DrawerBody>
              <DrawerFooter>
                <Button appearance="primary" onClick={() => setSelected(undefined)}>
                  Assign to me
                </Button>
              </DrawerFooter>
            </Drawer>
          )}
        </DrawerBody>

        <DrawerFooter>
          <Button appearance="secondary" onClick={closeDrawer}>
            Close
          </Button>
        </DrawerFooter>
      </Drawer>
    </>
  );
};
```

## Pitfalls

- Hand-rolling the surface with a fixed-position div or a bare Portal instead of the Drawer parts. You lose the slide-in motion, the modal focus trap, RTL-aware start/end positioning, and the sticky header/footer that `DrawerHeader`, `DrawerBody`, and `DrawerFooter` provide.
- Putting growing or scrolling content outside `DrawerBody`. The header and footer will scroll away with it; everything that can grow belongs in the body, which is the drawer's only scrolling region.
- Expecting a `DrawerFooter` button to submit the form it is not inside. The footer sits outside the `<form>`, so either add `form="new-project-form"` and `type="submit"` to the button, or hoist the submit handler into state and call it from the button directly.
- Treating `onOpenChange` as cancellable. It reports a requested state; it does not veto it. Because the drawer is controlled, keep `open` unchanged when you want to block the close (for example with unsaved changes) and show your own confirmation UI instead.
- Forgetting to reset field state when the drawer closes, so reopening shows stale values from the previous record. Reset on the close path, key the form on the record you are editing, or pass `unmountOnClose`.
- Nesting two overlay drawers, or opening an overlay drawer inside a Dialog. Two focus traps compete and the user can get lost. Render the second level as `type="inline"` inside the first drawer's body.
- Using an inline drawer for a blocking decision. Inline drawers are non-modal: the page stays interactive, there is no backdrop, and Escape does not close them. Use an overlay drawer or a Dialog when the user must respond.
- Assuming an inline drawer is always mounted. It animates in and out of the layout, so size the surrounding flex container for the closed state (or conditionally render it) to avoid layout jumps.
- Setting `validationState="error"` without a `validationMessage`. The error is then only visual, and screen reader users get no indication of what went wrong.

## Accessibility

An overlay Drawer is a modal dialog: focus moves into the drawer when it opens, is trapped there while it is open, and returns to the element that opened it when it closes. Escape closes it and the page behind is inert, so never put required information only behind the drawer. Always give the drawer an accessible name — `DrawerHeaderTitle` renders a visible heading that names the surface; if you build a title-less drawer (for example a pure filter rail), pass `aria-label` to `Drawer`. Put the dismiss control in `DrawerHeaderTitle`'s `action` slot so it sits in the natural tab order near the top of the panel. Inline drawers are the opposite: no focus trap and no backdrop, the rest of the page stays reachable, and nothing announces that the panel appeared — connect the toggle with `aria-expanded` plus `aria-controls` pointing at the Drawer's `id`, and move focus into the panel only if the user's action explicitly asked for it. Validation feedback must be textual: pair `validationState="error"` with a `validationMessage`, because `Field` exposes that message to assistive technology, and mark genuinely required inputs with `required` on `Field` so the label carries the required indicator. Keep the primary action last in `DrawerFooter` to match reading order, and avoid colour-only status communication.

## Components used

- [Drawer](../../components/drawer.md)
- [Button](../../components/button.md)
- [Field](../../components/field.md)
- [Input](../../components/input.md)
- [Select](../../components/select.md)
- [Textarea](../../components/textarea.md)
- [Checkbox](../../components/checkbox.md)
- [Switch](../../components/switch.md)
- [Slider](../../components/slider.md)
- [Text](../../components/text.md)
- [Divider](../../components/divider.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
