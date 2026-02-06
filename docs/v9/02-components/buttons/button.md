# Button

> **Package**: `@fluentui/react-button`
> **Import**: `import { Button } from '@fluentui/react-components'`
> **Category**: Buttons

## Overview

Button is the primary interactive element for triggering actions. It supports multiple appearances, sizes, shapes, and can include icons.

---

## Basic Usage

```typescript
import * as React from 'react';
import { Button } from '@fluentui/react-components';

export const BasicButton: React.FC = () => (
  <Button>Click me</Button>
);
```

---

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `appearance` | `'secondary' \| 'primary' \| 'outline' \| 'subtle' \| 'transparent'` | `'secondary'` | Visual style of the button |
| `disabled` | `boolean` | `false` | Whether the button is disabled |
| `disabledFocusable` | `boolean` | `false` | Allows focus when disabled (for accessibility) |
| `icon` | `Slot<'span'>` | - | Icon element to display |
| `iconPosition` | `'before' \| 'after'` | `'before'` | Position of the icon relative to content |
| `shape` | `'rounded' \| 'circular' \| 'square'` | `'rounded'` | Shape of the button |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size of the button |
| `as` | `'a'` | - | Render as anchor element |

### Slots

| Slot | Element | Description |
|------|---------|-------------|
| `root` | `<button>` or `<a>` | Root element of the button |
| `icon` | `<span>` | Icon container |

---

## Appearance Variants

### All Appearances

```typescript
import * as React from 'react';
import { Button, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    flexWrap: 'wrap',
  },
});

export const ButtonAppearances: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <Button appearance="secondary">Secondary</Button>
      <Button appearance="primary">Primary</Button>
      <Button appearance="outline">Outline</Button>
      <Button appearance="subtle">Subtle</Button>
      <Button appearance="transparent">Transparent</Button>
    </div>
  );
};
```

### When to Use Each Appearance

| Appearance | Use Case |
|------------|----------|
| `secondary` | Default, non-primary actions |
| `primary` | Main call-to-action, primary workflow actions |
| `outline` | Secondary actions with less visual weight |
| `subtle` | Tertiary actions, minimal visual impact |
| `transparent` | Actions within other interactive elements |

---

## Size Variants

```typescript
import * as React from 'react';
import { Button, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
  },
});

export const ButtonSizes: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>
    </div>
  );
};
```

| Size | Height | Font Size | Use Case |
|------|--------|-----------|----------|
| `small` | 24px | 12px | Dense UIs, toolbars |
| `medium` | 32px | 14px | Default, most actions |
| `large` | 40px | 14px | Hero actions, increased touch target |

---

## Shape Variants

```typescript
import * as React from 'react';
import { Button, makeStyles, tokens } from '@fluentui/react-components';
import { CalendarMonthRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
  },
});

export const ButtonShapes: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <Button shape="rounded">Rounded</Button>
      <Button shape="square">Square</Button>
      <Button shape="circular" icon={<CalendarMonthRegular />} />
    </div>
  );
};
```

| Shape | Description |
|-------|-------------|
| `rounded` | Rounded corners (default) |
| `square` | Sharp corners |
| `circular` | Fully rounded, typically for icon-only buttons |

---

## With Icons

### Icon Position

```typescript
import * as React from 'react';
import { Button, makeStyles, tokens } from '@fluentui/react-components';
import { CalendarMonthRegular, ArrowRightRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
  },
});

export const ButtonWithIcons: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      {/* Icon before text (default) */}
      <Button icon={<CalendarMonthRegular />}>
        Schedule
      </Button>

      {/* Icon after text */}
      <Button icon={<ArrowRightRegular />} iconPosition="after">
        Continue
      </Button>
    </div>
  );
};
```

### Icon-Only Button

```typescript
import * as React from 'react';
import { Button, Tooltip } from '@fluentui/react-components';
import { DeleteRegular } from '@fluentui/react-icons';

export const IconOnlyButton: React.FC = () => (
  // Always use Tooltip for icon-only buttons for accessibility
  <Tooltip content="Delete" relationship="label">
    <Button
      icon={<DeleteRegular />}
      aria-label="Delete"
    />
  </Tooltip>
);
```

### Bundled Icons (Filled + Regular)

```typescript
import * as React from 'react';
import { Button } from '@fluentui/react-components';
import {
  StarRegular,
  StarFilled,
  bundleIcon,
} from '@fluentui/react-icons';

// Create bundled icon that shows filled on hover/focus
const Star = bundleIcon(StarFilled, StarRegular);

export const BundledIconButton: React.FC = () => (
  <Button icon={<Star />}>Favorite</Button>
);
```

---

## Disabled States

### Standard Disabled

```typescript
import * as React from 'react';
import { Button, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
  },
});

export const DisabledButtons: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <Button disabled>Disabled</Button>
      <Button appearance="primary" disabled>Disabled Primary</Button>
    </div>
  );
};
```

### Disabled Focusable

For accessibility in menus and toolbars, buttons can be focusable when disabled:

```typescript
import * as React from 'react';
import { Button, Tooltip } from '@fluentui/react-components';

export const DisabledFocusableButton: React.FC = () => (
  <Tooltip content="This action is not available" relationship="description">
    <Button disabledFocusable>
      Cannot Click
    </Button>
  </Tooltip>
);
```

---

## Button as Link

Render a button as an anchor tag for navigation:

```typescript
import * as React from 'react';
import { Button } from '@fluentui/react-components';
import { OpenRegular } from '@fluentui/react-icons';

export const ButtonAsLink: React.FC = () => (
  <Button
    as="a"
    href="https://example.com"
    target="_blank"
    rel="noopener noreferrer"
    icon={<OpenRegular />}
    iconPosition="after"
  >
    Open External Link
  </Button>
);
```

---

## Event Handling

```typescript
import * as React from 'react';
import { Button } from '@fluentui/react-components';

export const ButtonWithHandler: React.FC = () => {
  const [clickCount, setClickCount] = React.useState(0);

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      console.log('Button clicked', event);
      setClickCount(c => c + 1);
    },
    []
  );

  return (
    <Button appearance="primary" onClick={handleClick}>
      Clicked {clickCount} times
    </Button>
  );
};
```

---

## Loading State Pattern

FluentUI doesn't have a built-in loading state for Button. Here's the recommended pattern:

```typescript
import * as React from 'react';
import { Button, Spinner, makeStyles } from '@fluentui/react-components';

const useStyles = makeStyles({
  spinner: {
    // Ensure spinner doesn't change button size
  },
});

export const LoadingButton: React.FC = () => {
  const styles = useStyles();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  return (
    <Button
      appearance="primary"
      onClick={handleClick}
      disabled={isLoading}
      icon={isLoading ? <Spinner size="tiny" className={styles.spinner} /> : undefined}
    >
      {isLoading ? 'Loading...' : 'Submit'}
    </Button>
  );
};
```

---

## Accessibility

### Requirements

1. **Icon-only buttons MUST have `aria-label`**:

```typescript
<Button icon={<DeleteRegular />} aria-label="Delete item" />
```

2. **Use `disabledFocusable` in menus/toolbars** for consistent tab order

3. **Wrap icon-only buttons with Tooltip** for discoverability

### Keyboard Support

| Key | Action |
|-----|--------|
| `Enter` | Activates the button |
| `Space` | Activates the button |
| `Tab` | Moves focus to next focusable element |

### ARIA Attributes

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `aria-disabled` | `true` | When `disabledFocusable` is true |
| `aria-label` | string | Icon-only buttons |
| `aria-pressed` | boolean | Toggle buttons (see ToggleButton) |

---

## Styling Customization

### Custom Styles

```typescript
import * as React from 'react';
import { Button, makeStyles, tokens, mergeClasses } from '@fluentui/react-components';

const useStyles = makeStyles({
  customButton: {
    backgroundColor: tokens.colorPaletteGreenBackground3,
    color: tokens.colorNeutralForegroundOnBrand,
    
    ':hover': {
      backgroundColor: tokens.colorPaletteGreenForeground1,
    },
    ':active': {
      backgroundColor: tokens.colorPaletteGreenForeground2,
    },
  },
});

export const CustomStyledButton: React.FC = () => {
  const styles = useStyles();

  return (
    <Button className={styles.customButton}>
      Custom Green Button
    </Button>
  );
};
```

### Using Class Names for Targeting

```typescript
import { buttonClassNames } from '@fluentui/react-components';

// buttonClassNames.root = 'fui-Button'
// buttonClassNames.icon = 'fui-Button__icon'

const useStyles = makeStyles({
  customIcon: {
    [`& .${buttonClassNames.icon}`]: {
      color: tokens.colorPaletteRedForeground1,
    },
  },
});
```

---

## Best Practices

### ✅ Do's

```typescript
// ✅ Use primary for main call-to-action
<Button appearance="primary">Submit</Button>

// ✅ Limit primary buttons to one per view section
<Dialog>
  <DialogActions>
    <Button appearance="secondary">Cancel</Button>
    <Button appearance="primary">Confirm</Button>
  </DialogActions>
</Dialog>

// ✅ Use tooltips for icon-only buttons
<Tooltip content="Delete">
  <Button icon={<DeleteRegular />} aria-label="Delete" />
</Tooltip>
```

### ❌ Don'ts

```typescript
// ❌ Don't use multiple primary buttons in same context
<div>
  <Button appearance="primary">Save</Button>
  <Button appearance="primary">Save & Continue</Button>
</div>

// ❌ Don't omit aria-label for icon-only buttons
<Button icon={<DeleteRegular />} />

// ❌ Don't use disabled without explanation
<Button disabled>Submit</Button>
// Better: Show tooltip explaining why
```

---

## See Also

- [ToggleButton](toggle-button.md) - Button with toggle state
- [CompoundButton](compound-button.md) - Button with secondary text
- [MenuButton](menu-button.md) - Button that opens a menu
- [SplitButton](split-button.md) - Button with dropdown action
- [Component Index](../00-component-index.md) - All components