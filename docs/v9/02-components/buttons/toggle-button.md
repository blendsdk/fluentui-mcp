# ToggleButton

> **Package**: `@fluentui/react-button`
> **Import**: `import { ToggleButton } from '@fluentui/react-components'`
> **Category**: Buttons

## Overview

ToggleButton is a button that maintains a checked/unchecked state. It supports all Button props plus toggle-specific functionality. Perfect for actions like favorite/unfavorite, bold/unbold text formatting, etc.

---

## Basic Usage

```typescript
import * as React from 'react';
import { ToggleButton } from '@fluentui/react-components';
import { StarRegular, StarFilled, bundleIcon } from '@fluentui/react-icons';

const Star = bundleIcon(StarFilled, StarRegular);

export const BasicToggleButton: React.FC = () => (
  <ToggleButton icon={<Star />}>
    Favorite
  </ToggleButton>
);
```

---

## Props Reference

Inherits all [Button props](button.md) plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | - | Controlled checked state |
| `defaultChecked` | `boolean` | `false` | Initial checked state (uncontrolled) |

### Slots

Same as Button:

| Slot | Element | Description |
|------|---------|-------------|
| `root` | `<button>` | Root element |
| `icon` | `<span>` | Icon container |

---

## Controlled vs Uncontrolled

### Uncontrolled (Default)

ToggleButton manages its own state:

```typescript
import * as React from 'react';
import { ToggleButton } from '@fluentui/react-components';
import { PinRegular, PinFilled, bundleIcon } from '@fluentui/react-icons';

const Pin = bundleIcon(PinFilled, PinRegular);

export const UncontrolledToggle: React.FC = () => (
  // defaultChecked sets initial state, then it's self-managed
  <ToggleButton defaultChecked={false} icon={<Pin />}>
    Pin
  </ToggleButton>
);
```

### Controlled

Parent component manages state:

```typescript
import * as React from 'react';
import { ToggleButton, Text, makeStyles, tokens } from '@fluentui/react-components';
import { HeartRegular, HeartFilled, bundleIcon } from '@fluentui/react-icons';

const Heart = bundleIcon(HeartFilled, HeartRegular);

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
});

export const ControlledToggle: React.FC = () => {
  const styles = useStyles();
  const [isFavorite, setIsFavorite] = React.useState(false);

  const handleToggle = React.useCallback(() => {
    setIsFavorite(prev => !prev);
    // You can also trigger API calls here
  }, []);

  return (
    <div className={styles.container}>
      <ToggleButton
        checked={isFavorite}
        icon={<Heart />}
        onClick={handleToggle}
      >
        {isFavorite ? 'Favorited' : 'Favorite'}
      </ToggleButton>
      <Text>Current state: {isFavorite ? 'Checked' : 'Unchecked'}</Text>
    </div>
  );
};
```

---

## Appearance Variants

ToggleButton supports all Button appearances:

```typescript
import * as React from 'react';
import { ToggleButton, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    flexWrap: 'wrap',
  },
});

export const ToggleButtonAppearances: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <ToggleButton appearance="secondary">Secondary</ToggleButton>
      <ToggleButton appearance="primary">Primary</ToggleButton>
      <ToggleButton appearance="outline">Outline</ToggleButton>
      <ToggleButton appearance="subtle">Subtle</ToggleButton>
      <ToggleButton appearance="transparent">Transparent</ToggleButton>
    </div>
  );
};
```

---

## Common Use Cases

### Text Formatting Toolbar

```typescript
import * as React from 'react';
import {
  ToggleButton,
  Toolbar,
  ToolbarGroup,
  makeStyles,
} from '@fluentui/react-components';
import {
  TextBoldRegular,
  TextBoldFilled,
  TextItalicRegular,
  TextItalicFilled,
  TextUnderlineRegular,
  TextUnderlineFilled,
  bundleIcon,
} from '@fluentui/react-icons';

const Bold = bundleIcon(TextBoldFilled, TextBoldRegular);
const Italic = bundleIcon(TextItalicFilled, TextItalicRegular);
const Underline = bundleIcon(TextUnderlineFilled, TextUnderlineRegular);

const useStyles = makeStyles({
  toolbar: {
    // Toolbar styling
  },
});

interface FormatState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
}

export const FormattingToolbar: React.FC = () => {
  const styles = useStyles();
  const [format, setFormat] = React.useState<FormatState>({
    bold: false,
    italic: false,
    underline: false,
  });

  const toggleFormat = (key: keyof FormatState) => {
    setFormat(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Toolbar className={styles.toolbar}>
      <ToolbarGroup>
        <ToggleButton
          appearance="subtle"
          checked={format.bold}
          icon={<Bold />}
          onClick={() => toggleFormat('bold')}
          aria-label="Bold"
        />
        <ToggleButton
          appearance="subtle"
          checked={format.italic}
          icon={<Italic />}
          onClick={() => toggleFormat('italic')}
          aria-label="Italic"
        />
        <ToggleButton
          appearance="subtle"
          checked={format.underline}
          icon={<Underline />}
          onClick={() => toggleFormat('underline')}
          aria-label="Underline"
        />
      </ToolbarGroup>
    </Toolbar>
  );
};
```

### Favorite/Bookmark Toggle

```typescript
import * as React from 'react';
import {
  ToggleButton,
  Card,
  CardHeader,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import {
  BookmarkRegular,
  BookmarkFilled,
  bundleIcon,
} from '@fluentui/react-icons';

const Bookmark = bundleIcon(BookmarkFilled, BookmarkRegular);

const useStyles = makeStyles({
  card: {
    width: '300px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

interface ArticleCardProps {
  title: string;
  isBookmarked?: boolean;
  onBookmarkChange?: (bookmarked: boolean) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  title,
  isBookmarked = false,
  onBookmarkChange,
}) => {
  const styles = useStyles();
  const [bookmarked, setBookmarked] = React.useState(isBookmarked);

  const handleToggle = () => {
    const newValue = !bookmarked;
    setBookmarked(newValue);
    onBookmarkChange?.(newValue);
  };

  return (
    <Card className={styles.card}>
      <CardHeader
        header={
          <div className={styles.header}>
            <Text weight="semibold">{title}</Text>
            <ToggleButton
              appearance="transparent"
              checked={bookmarked}
              icon={<Bookmark />}
              onClick={handleToggle}
              aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
              size="small"
            />
          </div>
        }
      />
    </Card>
  );
};
```

---

## With Different Sizes

```typescript
import * as React from 'react';
import { ToggleButton, makeStyles, tokens } from '@fluentui/react-components';
import { MicRegular, MicFilled, bundleIcon } from '@fluentui/react-icons';

const Mic = bundleIcon(MicFilled, MicRegular);

const useStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
  },
});

export const ToggleButtonSizes: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <ToggleButton size="small" icon={<Mic />}>Small</ToggleButton>
      <ToggleButton size="medium" icon={<Mic />}>Medium</ToggleButton>
      <ToggleButton size="large" icon={<Mic />}>Large</ToggleButton>
    </div>
  );
};
```

---

## Disabled State

```typescript
import * as React from 'react';
import { ToggleButton, makeStyles, tokens } from '@fluentui/react-components';
import { LockClosedRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
  },
});

export const DisabledToggleButtons: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <ToggleButton disabled icon={<LockClosedRegular />}>
        Disabled Unchecked
      </ToggleButton>
      <ToggleButton disabled defaultChecked icon={<LockClosedRegular />}>
        Disabled Checked
      </ToggleButton>
    </div>
  );
};
```

---

## Accessibility

### ARIA Attributes

ToggleButton automatically sets `aria-pressed` based on checked state:

| State | aria-pressed |
|-------|--------------|
| Unchecked | `false` |
| Checked | `true` |

### Requirements

```typescript
// ✅ Icon-only toggle buttons need aria-label
<ToggleButton
  icon={<Bold />}
  aria-label="Toggle bold formatting"
  checked={isBold}
  onClick={toggleBold}
/>
```

### Keyboard Support

| Key | Action |
|-----|--------|
| `Enter` | Toggle checked state |
| `Space` | Toggle checked state |
| `Tab` | Move to next focusable element |

---

## Styling Customization

### Custom Checked Styles

```typescript
import * as React from 'react';
import {
  ToggleButton,
  makeStyles,
  tokens,
  mergeClasses,
} from '@fluentui/react-components';
import { HeartFilled, HeartRegular, bundleIcon } from '@fluentui/react-icons';

const Heart = bundleIcon(HeartFilled, HeartRegular);

const useStyles = makeStyles({
  heartButton: {
    // Custom styles for checked state
    '&[aria-pressed="true"]': {
      backgroundColor: tokens.colorPaletteRedBackground2,
      color: tokens.colorPaletteRedForeground1,
    },
    '&[aria-pressed="true"]:hover': {
      backgroundColor: tokens.colorPaletteRedBackground3,
    },
  },
});

export const CustomStyledToggle: React.FC = () => {
  const styles = useStyles();

  return (
    <ToggleButton
      className={styles.heartButton}
      appearance="subtle"
      icon={<Heart />}
    >
      Like
    </ToggleButton>
  );
};
```

---

## Best Practices

### ✅ Do's

```typescript
// ✅ Use for binary state actions
<ToggleButton checked={isMuted} icon={<Mic />}>
  {isMuted ? 'Unmute' : 'Mute'}
</ToggleButton>

// ✅ Update label to reflect state when meaningful
<ToggleButton checked={isPlaying}>
  {isPlaying ? 'Pause' : 'Play'}
</ToggleButton>

// ✅ Use appropriate icons that indicate state
import { StarFilled, StarRegular, bundleIcon } from '@fluentui/react-icons';
const Star = bundleIcon(StarFilled, StarRegular);
<ToggleButton icon={<Star />} checked={isFavorite} />
```

### ❌ Don'ts

```typescript
// ❌ Don't use for navigation or one-time actions
<ToggleButton>Go to Settings</ToggleButton> // Use Button instead

// ❌ Don't use confusing labels
<ToggleButton checked={isActive}>Toggle</ToggleButton>
// Better: Use descriptive label that indicates what's being toggled

// ❌ Don't forget aria-label for icon-only buttons
<ToggleButton icon={<Mic />} /> // Missing aria-label
```

---

## See Also

- [Button](button.md) - Standard action button
- [CompoundButton](compound-button.md) - Button with secondary text
- [Toolbar](../utilities/toolbar.md) - Container for toggle buttons
- [Component Index](../00-component-index.md) - All components