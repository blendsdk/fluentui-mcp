# Link

> **Package**: `@fluentui/react-link`
> **Import**: `import { Link } from '@fluentui/react-components'`
> **Category**: Navigation

## Overview

Link is a hyperlink component for navigating to other pages or resources. It supports inline and standalone usage, various appearances, and integrates with routing libraries.

---

## Basic Usage

```typescript
import * as React from 'react';
import { Link } from '@fluentui/react-components';

export const BasicLink: React.FC = () => (
  <Link href="https://example.com">Visit Example.com</Link>
);
```

---

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `href` | `string` | - | URL to navigate to |
| `appearance` | `'default' \| 'subtle'` | `'default'` | Visual style |
| `inline` | `boolean` | `false` | Inline with text |
| `disabled` | `boolean` | `false` | Disabled state |
| `as` | `'a' \| 'button' \| 'span'` | `'a'` | Element type |

---

## Appearance Variants

```typescript
import * as React from 'react';
import { Link, Text, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
});

export const LinkAppearances: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <Text>
        This is <Link href="#">default link</Link> appearance.
      </Text>
      <Text>
        This is <Link href="#" appearance="subtle">subtle link</Link> appearance.
      </Text>
    </div>
  );
};
```

---

## Inline Links

```typescript
import * as React from 'react';
import { Link, Text } from '@fluentui/react-components';

export const InlineLinks: React.FC = () => (
  <Text>
    Read our <Link href="/terms" inline>Terms of Service</Link> and{' '}
    <Link href="/privacy" inline>Privacy Policy</Link> before continuing.
  </Text>
);
```

---

## Standalone Links

```typescript
import * as React from 'react';
import { Link, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
});

export const StandaloneLinks: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <Link href="/dashboard">Go to Dashboard</Link>
      <Link href="/settings">Settings</Link>
      <Link href="/help">Help Center</Link>
    </div>
  );
};
```

---

## External Links

```typescript
import * as React from 'react';
import { Link } from '@fluentui/react-components';
import { OpenRegular } from '@fluentui/react-icons';

export const ExternalLink: React.FC = () => (
  <Link 
    href="https://example.com" 
    target="_blank" 
    rel="noopener noreferrer"
  >
    Open External Site <OpenRegular />
  </Link>
);
```

---

## Link as Button

```typescript
import * as React from 'react';
import { Link, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
  },
});

export const LinkAsButton: React.FC = () => {
  const styles = useStyles();

  const handleClick = () => {
    console.log('Link button clicked');
  };

  return (
    <div className={styles.container}>
      <Link as="button" onClick={handleClick}>
        Perform Action
      </Link>
      <Link as="button" onClick={() => alert('Clicked!')}>
        Show Alert
      </Link>
    </div>
  );
};
```

---

## With React Router

```typescript
import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Link, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  nav: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
  },
});

export const RouterLinks: React.FC = () => {
  const styles = useStyles();

  return (
    <nav className={styles.nav}>
      <Link as={RouterLink} to="/">Home</Link>
      <Link as={RouterLink} to="/about">About</Link>
      <Link as={RouterLink} to="/contact">Contact</Link>
    </nav>
  );
};
```

---

## Disabled State

```typescript
import * as React from 'react';
import { Link, Text } from '@fluentui/react-components';

export const DisabledLinks: React.FC = () => (
  <>
    <Text>
      This link is <Link href="#" disabled>disabled</Link>.
    </Text>
  </>
);
```

---

## Accessibility

### Keyboard Support

| Key | Action |
|-----|--------|
| `Tab` | Focus the link |
| `Enter` | Activate the link |

### Best Practices

```typescript
// ✅ External links should indicate they open new tab
<Link href="..." target="_blank" rel="noopener noreferrer">
  External Site (opens in new tab)
</Link>

// ✅ Use meaningful link text
<Link href="/pricing">View pricing details</Link>

// ❌ Avoid generic link text
<Link href="/pricing">Click here</Link>
```

---

## Best Practices

### ✅ Do's

```typescript
// ✅ Use descriptive link text
<Link href="/docs">View documentation</Link>

// ✅ Use inline for links within text
<Text>Read our <Link href="/terms" inline>terms</Link>.</Text>

// ✅ Indicate external links
<Link href="..." target="_blank">External <OpenRegular /></Link>

// ✅ Use as="button" for actions
<Link as="button" onClick={handleAction}>Perform action</Link>
```

### ❌ Don'ts

```typescript
// ❌ Don't use generic text
<Link href="/pricing">Click here</Link>

// ❌ Don't use Link for primary actions (use Button)
<Link href="#">Submit Form</Link>
```

---

## See Also

- [Button](../buttons/button.md) - For primary actions
- [Breadcrumb](breadcrumb.md) - Breadcrumb navigation
- [Nav](nav.md) - Side navigation
- [Component Index](../00-component-index.md) - All components