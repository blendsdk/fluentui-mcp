# Slot Customization Patterns

> **Module**: 03-patterns/composition
> **FluentUI Version**: 9.x
> **Last Updated**: 2026-06-02
> **Prerequisites**: [Component Architecture](../../01-foundation/05-component-architecture.md)

## Overview

Slots are the primary customization mechanism in FluentUI v9. Every component is composed of named sub-elements (slots) that can be individually customized. Understanding slots is the most important pattern for working effectively with FluentUI v9.

---

## What Are Slots?

A slot is a **named, customizable sub-element** within a component. Each component documents its available slots.

### Example: Button Slots

```
┌─────────────────────────────┐
│  Button (root slot)         │
│  ┌──────┐                   │
│  │ icon │  Click Me         │
│  └──────┘                   │
└─────────────────────────────┘
```

- `root` — The outer container element (always present)
- `icon` — An optional icon element

### Example: Input Slots

```
┌──────────────────────────────────────────┐
│  Input (root slot)                       │
│  ┌─────────────┐ ┌──────────┐ ┌───────┐ │
│  │ contentBefore│ │  input   │ │content│ │
│  │              │ │          │ │ After │ │
│  └─────────────┘ └──────────┘ └───────┘ │
└──────────────────────────────────────────┘
```

- `root` — Outer wrapper
- `input` — The actual `<input>` element
- `contentBefore` — Element before the input (e.g., icon)
- `contentAfter` — Element after the input (e.g., clear button)

---

## Slot Customization Levels

### Level 1: Shorthand Content (Simplest)

Pass JSX directly to a slot prop to replace its content:

```tsx
import { Button, Input } from '@fluentui/react-components';
import { SearchRegular, DismissRegular } from '@fluentui/react-icons';

// Icon slot receives JSX element
<Button icon={<SearchRegular />}>Search</Button>

// Input content slots
<Input contentBefore={<SearchRegular />} />
<Input contentAfter={<DismissRegular />} />
```

For slots that accept text content, you can pass a string:

```tsx
import { Badge } from '@fluentui/react-components';

// Badge icon slot with text shorthand
<Badge icon="★" />
```

### Level 2: Props Object (Add/Override Props)

Pass an object to merge additional props with the slot's defaults:

```tsx
import { Button } from '@fluentui/react-components';
import { CalendarRegular } from '@fluentui/react-icons';

// Add custom props to the icon slot
<Button
  icon={{
    children: <CalendarRegular />,
    'aria-hidden': false,           // Override default aria-hidden
    'aria-label': 'Calendar icon',  // Add ARIA label
    style: { color: 'red' },       // Add inline style
  }}
>
  Schedule
</Button>

// Override root slot props
<Button
  root={{
    'data-testid': 'submit-button',
    'aria-describedby': 'submit-help',
  }}
>
  Submit
</Button>
```

### Level 3: Custom Element Type (`as` Prop)

Change the underlying HTML element of a slot:

```tsx
import { Button } from '@fluentui/react-components';

// Render Button as an anchor element
<Button as="a" href="/settings">
  Go to Settings
</Button>

// Button root slot renders <a> instead of <button>
```

**Common `as` patterns:**

```tsx
// Link styled as a button
import { Link } from '@fluentui/react-components';
<Link as="button" onClick={handleClick}>Click me</Link>

// Text as different heading levels
import { Text } from '@fluentui/react-components';
<Text as="h1" size={800} weight="bold">Page Title</Text>
<Text as="h2" size={600} weight="semibold">Section Title</Text>
<Text as="p">Paragraph content</Text>
```

### Level 4: Render Function (Replace Entire Slot)

Use a render function as `children` to completely replace a slot's element:

```tsx
import { Button, Checkbox } from '@fluentui/react-components';

// Replace the icon slot entirely
<Button
  icon={{
    children: (Component, props) => (
      <span {...props} style={{ ...props.style, fontSize: '24px' }}>
        🎉
      </span>
    ),
  }}
>
  Celebrate
</Button>

// Replace checkbox indicator with custom element
<Checkbox
  indicator={{
    children: (Component, props) => (
      <div {...props}>
        <svg viewBox="0 0 16 16" width={16} height={16}>
          <circle cx="8" cy="8" r="6" fill="currentColor" />
        </svg>
      </div>
    ),
  }}
  label="Custom indicator"
/>
```

**Important:** When using render functions:
- The first argument (`Component`) is the default component that would render
- The second argument (`props`) contains all merged props including styles
- Always spread `{...props}` to preserve accessibility and styling
- This is an **escape hatch** — prefer simpler patterns when possible

---

## Common Slot Customization Patterns

### Adding Icons to Inputs

```tsx
import { Input, Button } from '@fluentui/react-components';
import {
  SearchRegular,
  EyeRegular,
  EyeOffRegular,
  DismissRegular,
} from '@fluentui/react-icons';

// Search input with icon and clear button
const SearchInput = () => {
  const [value, setValue] = React.useState('');

  return (
    <Input
      value={value}
      onChange={(e, data) => setValue(data.value)}
      contentBefore={<SearchRegular />}
      contentAfter={
        value ? (
          <Button
            appearance="transparent"
            icon={<DismissRegular />}
            size="small"
            onClick={() => setValue('')}
          />
        ) : undefined
      }
      placeholder="Search..."
    />
  );
};

// Password input with visibility toggle
const PasswordInput = () => {
  const [visible, setVisible] = React.useState(false);

  return (
    <Input
      type={visible ? 'text' : 'password'}
      contentAfter={
        <Button
          appearance="transparent"
          icon={visible ? <EyeOffRegular /> : <EyeRegular />}
          size="small"
          onClick={() => setVisible(!visible)}
          aria-label={visible ? 'Hide password' : 'Show password'}
        />
      }
    />
  );
};
```

### Customizing Menu Items

```tsx
import {
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  Button,
  Avatar,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { SettingsRegular, SignOutRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
});

// MenuItem with custom icon and secondary text
const UserMenu = () => {
  const styles = useStyles();

  return (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <Button icon={<Avatar name="John Doe" size={24} />} appearance="subtle">
          John Doe
        </Button>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          <MenuItem icon={<SettingsRegular />}>Settings</MenuItem>
          <MenuItem
            icon={<SignOutRegular />}
            // Override root slot to add custom data attribute
            root={{ 'data-action': 'logout' }}
          >
            Sign out
          </MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};
```

### Customizing Dialog Layout

```tsx
import {
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogContent,
  DialogActions,
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { DismissRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  wideDialog: {
    maxWidth: '800px',
    width: '90vw',
  },
  scrollableContent: {
    maxHeight: '60vh',
    overflowY: 'auto',
  },
});

const WideDialog = () => {
  const styles = useStyles();

  return (
    <Dialog>
      <DialogTrigger disableButtonEnhancement>
        <Button>Open wide dialog</Button>
      </DialogTrigger>
      {/* Override DialogSurface className for wider layout */}
      <DialogSurface className={styles.wideDialog}>
        <DialogBody>
          {/* Custom close button in DialogTitle via action slot */}
          <DialogTitle
            action={
              <DialogTrigger action="close">
                <Button
                  appearance="subtle"
                  aria-label="Close"
                  icon={<DismissRegular />}
                />
              </DialogTrigger>
            }
          >
            Large Content Dialog
          </DialogTitle>
          <DialogContent className={styles.scrollableContent}>
            {/* Long scrollable content */}
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary">Cancel</Button>
            </DialogTrigger>
            <Button appearance="primary">Confirm</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};
```

### Customizing Table Cells

```tsx
import {
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  TableCellLayout,
  Avatar,
  Badge,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  statusCell: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
  },
});

const CustomTable = ({ items }: { items: Item[] }) => {
  const styles = useStyles();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              {/* TableCellLayout has media and description slots */}
              <TableCellLayout
                media={<Avatar name={item.name} size={28} />}
                description={item.email}
              >
                {item.name}
              </TableCellLayout>
            </TableCell>
            <TableCell>
              <div className={styles.statusCell}>
                <Badge
                  appearance="filled"
                  color={item.active ? 'success' : 'danger'}
                  size="small"
                />
                {item.active ? 'Active' : 'Inactive'}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
```

---

## Finding Available Slots

### Using TypeScript

The best way to discover slots is through TypeScript autocompletion. Component prop types include all slot props:

```tsx
import type { ButtonProps } from '@fluentui/react-components';

// ButtonProps includes:
// - root?: Slot<'button', 'a'>
// - icon?: Slot<'span'>
// - All standard button/anchor HTML attributes
```

### Using Static Class Names

Every slot has a static CSS class name following the pattern `fui-{ComponentName}__{slotName}`:

```css
/* Target Button's icon slot */
.fui-Button__icon {
  /* styles */
}

/* Target Input's contentBefore slot */
.fui-Input__contentBefore {
  /* styles */
}
```

These class names can be imported from each component:

```tsx
import { buttonClassNames } from '@fluentui/react-components';

// buttonClassNames = {
//   root: 'fui-Button',
//   icon: 'fui-Button__icon',
// }
```

### Using Browser DevTools

Inspect any FluentUI component in DevTools — each slot element has its static class name, making it easy to identify which slot you're looking at.

---

## Best Practices

### ✅ Do

```tsx
// ✅ Use slot props for customization
<Button icon={<SearchRegular />}>Search</Button>

// ✅ Spread props in render functions to preserve behavior
<Button icon={{ children: (C, props) => <span {...props}>★</span> }}>Star</Button>

// ✅ Use mergeClasses for className overrides
<Input className={mergeClasses(styles.custom, props.className)} />

// ✅ Check slot availability before customizing
// (read component docs/types for available slots)
```

### ❌ Don't

```tsx
// ❌ Don't target internal DOM structure with CSS selectors
// (use slot props or static class names instead)
.my-button > span:first-child { /* fragile */ }

// ❌ Don't ignore props in render functions
<Button icon={{ children: (C, props) => <span>★</span> }}>  {/* Lost styles! */}

// ❌ Don't use slot names that don't exist on the component
<Button header={...}>  {/* Button has no 'header' slot */}
```

---

## Related Documentation

- [Component Architecture](../../01-foundation/05-component-architecture.md) — How slots work internally
- [Recomposition Patterns](02-recomposition.md) — When slot customization isn't enough
- [Styling with Griffel](../../01-foundation/04-styling-griffel.md) — CSS-in-JS for custom styles
