# Accessibility in FluentUI v9

> **Category**: Foundation
> **Prerequisites**: [Getting Started](01-getting-started.md), [Component Architecture](05-component-architecture.md)

## Overview

FluentUI v9 is designed with accessibility as a core principle. All components:

- Follow WCAG 2.1 AA guidelines
- Include proper ARIA attributes
- Support keyboard navigation
- Work with screen readers
- Support high contrast mode

---

## Built-in Accessibility

### What FluentUI Provides

Every component includes:

```typescript
// Example: Button has built-in accessibility
<Button appearance="primary">
  Submit
</Button>

// Renders with proper semantics
// <button type="button" class="...">Submit</button>
```

**Automatic features:**

| Feature | Description |
|---------|-------------|
| Semantic HTML | Uses correct HTML elements |
| ARIA roles | Applied when needed |
| Focus management | Tab order and focus indicators |
| Keyboard handlers | Enter, Space, Escape, Arrow keys |
| Screen reader support | Proper announcements |

---

## Keyboard Navigation

### Tab Navigation

FluentUI components follow standard tab navigation:

```typescript
import * as React from 'react';
import { Button, Input, Checkbox } from '@fluentui/react-components';

// Tab order follows DOM order
const Form = () => (
  <form>
    <Input placeholder="Name" />        {/* Tab index 1 */}
    <Input placeholder="Email" />       {/* Tab index 2 */}
    <Checkbox label="Subscribe" />      {/* Tab index 3 */}
    <Button type="submit">Submit</Button> {/* Tab index 4 */}
  </form>
);
```

### Arrow Key Navigation

Use `useArrowNavigationGroup` for arrow key navigation within groups:

```typescript
import * as React from 'react';
import {
  useArrowNavigationGroup,
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  toolbar: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
  },
});

export const Toolbar: React.FC = () => {
  const styles = useStyles();
  const arrowNavAttr = useArrowNavigationGroup({ axis: 'horizontal' });

  return (
    <div className={styles.toolbar} role="toolbar" {...arrowNavAttr}>
      <Button>Bold</Button>
      <Button>Italic</Button>
      <Button>Underline</Button>
    </div>
  );
};
```

### Arrow Navigation Options

```typescript
import { useArrowNavigationGroup } from '@fluentui/react-components';

// Horizontal navigation (left/right arrows)
const horizontal = useArrowNavigationGroup({ axis: 'horizontal' });

// Vertical navigation (up/down arrows)
const vertical = useArrowNavigationGroup({ axis: 'vertical' });

// Both directions
const both = useArrowNavigationGroup({ axis: 'both' });

// Circular navigation (wraps from last to first)
const circular = useArrowNavigationGroup({ 
  axis: 'horizontal',
  circular: true,
});

// Memory-based (remembers last focused item)
const memory = useArrowNavigationGroup({
  axis: 'horizontal',
  memorizeCurrent: true,
});
```

### Focus Group

Use `useFocusableGroup` for groups that act as a single tab stop:

```typescript
import * as React from 'react';
import {
  useFocusableGroup,
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  buttonGroup: {
    display: 'flex',
    gap: tokens.spacingHorizontalXS,
  },
});

export const ButtonGroup: React.FC = () => {
  const styles = useStyles();
  const focusGroupAttr = useFocusableGroup({ tabBehavior: 'limited' });

  return (
    <div className={styles.buttonGroup} role="group" {...focusGroupAttr}>
      <Button>Option A</Button>
      <Button>Option B</Button>
      <Button>Option C</Button>
    </div>
  );
};
```

---

## Focus Management

### Focus Finders

Find and manage focus within containers:

```typescript
import * as React from 'react';
import { useFocusFinders } from '@fluentui/react-components';

export const FocusExample: React.FC = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { findFirstFocusable, findLastFocusable } = useFocusFinders();

  const focusFirst = () => {
    if (containerRef.current) {
      const first = findFirstFocusable(containerRef.current);
      first?.focus();
    }
  };

  const focusLast = () => {
    if (containerRef.current) {
      const last = findLastFocusable(containerRef.current);
      last?.focus();
    }
  };

  return (
    <div ref={containerRef}>
      <button onClick={focusFirst}>Focus First</button>
      <input placeholder="First input" />
      <input placeholder="Second input" />
      <button onClick={focusLast}>Focus Last</button>
    </div>
  );
};
```

### Modal Focus Trapping

Modals automatically trap focus:

```typescript
import * as React from 'react';
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  DialogContent,
  DialogTrigger,
  Button,
} from '@fluentui/react-components';

export const ModalExample: React.FC = () => (
  <Dialog>
    <DialogTrigger>
      <Button>Open Modal</Button>
    </DialogTrigger>
    <DialogSurface>
      {/* Focus is automatically trapped within DialogSurface */}
      <DialogTitle>Confirmation</DialogTitle>
      <DialogContent>
        Are you sure you want to proceed?
      </DialogContent>
      <DialogActions>
        <DialogTrigger>
          <Button appearance="secondary">Cancel</Button>
        </DialogTrigger>
        <Button appearance="primary">Confirm</Button>
      </DialogActions>
    </DialogSurface>
  </Dialog>
);
```

### useModalAttributes

For custom modal-like components:

```typescript
import * as React from 'react';
import { useModalAttributes, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  modal: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    backgroundColor: tokens.colorNeutralBackground1,
    padding: tokens.spacingHorizontalL,
    borderRadius: tokens.borderRadiusMedium,
  },
});

export const CustomModal: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const styles = useStyles();
  const { modalAttributes, triggerAttributes } = useModalAttributes({
    trapFocus: true,
  });

  if (!open) return null;

  return (
    <div className={styles.modal} onClick={onClose}>
      <div
        className={styles.content}
        onClick={e => e.stopPropagation()}
        {...modalAttributes}
      >
        <h2>Custom Modal</h2>
        <p>This modal traps focus.</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};
```

---

## Focus Indicators

### Default Focus Ring

FluentUI provides consistent focus indicators:

```typescript
import { makeStyles, tokens } from '@fluentui/react-components';

// Focus ring is automatically applied to focusable elements
// You can customize it using createFocusOutlineStyle
```

### Custom Focus Styles

```typescript
import {
  makeStyles,
  createFocusOutlineStyle,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  customFocus: {
    // Create standard focus outline
    ...createFocusOutlineStyle(),
  },
  
  customFocusRing: {
    // Customize focus appearance
    ':focus-visible': {
      outline: `2px solid ${tokens.colorBrandStroke1}`,
      outlineOffset: '2px',
      borderRadius: tokens.borderRadiusMedium,
    },
  },
});
```

### createCustomFocusIndicatorStyle

For complex focus indicators:

```typescript
import {
  makeStyles,
  createCustomFocusIndicatorStyle,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  card: {
    ...createCustomFocusIndicatorStyle({
      outline: `3px solid ${tokens.colorBrandStroke1}`,
      outlineOffset: '2px',
      borderRadius: tokens.borderRadiusLarge,
    }),
  },
});
```

---

## ARIA Attributes

### Automatic ARIA

Components apply ARIA attributes automatically:

```typescript
// Menu applies proper ARIA roles
<Menu>
  <MenuTrigger>
    <Button aria-haspopup="menu">Open Menu</Button>
  </MenuTrigger>
  <MenuPopover>
    <MenuList role="menu">
      <MenuItem role="menuitem">Item 1</MenuItem>
      <MenuItem role="menuitem">Item 2</MenuItem>
    </MenuList>
  </MenuPopover>
</Menu>
```

### When to Add ARIA

Add ARIA attributes when:

1. **Content needs labels:**

```typescript
// Icon-only button needs accessible label
<Button
  appearance="subtle"
  icon={<SearchRegular />}
  aria-label="Search"
/>
```

2. **Describing relationships:**

```typescript
// Connect error message to input
<Input
  aria-describedby="email-error"
  aria-invalid={hasError}
/>
<Text id="email-error" role="alert">
  Please enter a valid email
</Text>
```

3. **Live regions for announcements:**

```typescript
// Announce dynamic content changes
<div aria-live="polite" aria-atomic="true">
  {status === 'success' && 'Form submitted successfully!'}
</div>
```

### Common ARIA Patterns

| Pattern | Attributes | Use Case |
|---------|------------|----------|
| Label | `aria-label` | Icon buttons, unlabeled elements |
| Describedby | `aria-describedby` | Help text, errors |
| Invalid | `aria-invalid` | Form validation |
| Expanded | `aria-expanded` | Collapsible sections |
| Selected | `aria-selected` | Tabs, options |
| Pressed | `aria-pressed` | Toggle buttons |
| Hidden | `aria-hidden` | Decorative elements |

---

## Screen Readers

### useAnnounce

Announce messages to screen readers:

```typescript
import * as React from 'react';
import { useAnnounce, Button } from '@fluentui/react-components';

export const SaveButton: React.FC = () => {
  const { announce } = useAnnounce();
  const [saving, setSaving] = React.useState(false);

  const handleSave = async () => {
    setSaving(true);
    announce('Saving document...', { polite: true });
    
    await saveDocument();
    
    setSaving(false);
    announce('Document saved successfully', { polite: true });
  };

  return (
    <Button onClick={handleSave} disabled={saving}>
      {saving ? 'Saving...' : 'Save'}
    </Button>
  );
};
```

### AnnounceProvider

Wrap your app to enable announcements:

```typescript
import * as React from 'react';
import {
  FluentProvider,
  AnnounceProvider,
  webLightTheme,
} from '@fluentui/react-components';

export const App: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <FluentProvider theme={webLightTheme}>
    <AnnounceProvider>
      {children}
    </AnnounceProvider>
  </FluentProvider>
);
```

### Best Practices for Screen Readers

```typescript
// ✅ Good: Descriptive button labels
<Button aria-label="Close dialog">
  <DismissRegular />
</Button>

// ✅ Good: Associated labels
<Label htmlFor="username">Username</Label>
<Input id="username" />

// ✅ Good: Error descriptions
<Field
  label="Email"
  validationMessage={error}
  validationState={error ? 'error' : 'none'}
>
  <Input />
</Field>

// ❌ Bad: Missing label
<Button>
  <DismissRegular />
</Button>

// ❌ Bad: Unlabeled input
<Input placeholder="Enter email" />
```

---

## High Contrast Mode

### Built-in Support

FluentUI themes automatically support high contrast:

```typescript
import {
  FluentProvider,
  teamsHighContrastTheme,
} from '@fluentui/react-components';

// Use high contrast theme
export const App: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <FluentProvider theme={teamsHighContrastTheme}>
    {children}
  </FluentProvider>
);
```

### Token Usage for Compatibility

Always use tokens for colors to ensure high contrast compatibility:

```typescript
import { makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  // ✅ Good: Uses tokens - works in high contrast
  card: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderColor: tokens.colorNeutralStroke1,
    color: tokens.colorNeutralForeground1,
  },
  
  // ❌ Bad: Hardcoded colors - breaks in high contrast
  badCard: {
    backgroundColor: '#ffffff',
    borderColor: '#e0e0e0',
    color: '#333333',
  },
});
```

### Testing High Contrast

```typescript
// Media query for forced colors mode
const useStyles = makeStyles({
  element: {
    borderColor: tokens.colorNeutralStroke1,
    
    // Ensure visibility in forced colors mode
    '@media (forced-colors: active)': {
      borderColor: 'CanvasText',
      forcedColorAdjust: 'none',
    },
  },
});
```

---

## Form Accessibility

### Field Component

Use `Field` for accessible form fields:

```typescript
import * as React from 'react';
import {
  Field,
  Input,
  Select,
  Checkbox,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
});

export const AccessibleForm: React.FC = () => {
  const styles = useStyles();

  return (
    <form className={styles.form}>
      <Field
        label="Full Name"
        required
        hint="Enter your full legal name"
      >
        <Input />
      </Field>

      <Field
        label="Email"
        required
        validationMessage="Please enter a valid email address"
        validationState="error"
      >
        <Input type="email" />
      </Field>

      <Field label="Country">
        <Select>
          <option value="">Select a country</option>
          <option value="us">United States</option>
          <option value="uk">United Kingdom</option>
        </Select>
      </Field>

      <Checkbox label="I agree to the terms and conditions" required />
    </form>
  );
};
```

---

## Accessibility Checklist

### Pre-Launch Checklist

| Category | Check |
|----------|-------|
| **Keyboard** | ✅ All interactive elements are reachable via Tab |
| | ✅ Focus order is logical |
| | ✅ Focus is visible |
| | ✅ No keyboard traps |
| **Screen Reader** | ✅ All images have alt text |
| | ✅ Form fields have labels |
| | ✅ Buttons have accessible names |
| | ✅ Dynamic content is announced |
| **Visual** | ✅ Color contrast meets WCAG AA (4.5:1) |
| | ✅ Text is resizable to 200% |
| | ✅ Content works in high contrast mode |
| **Semantics** | ✅ Proper heading hierarchy |
| | ✅ Landmarks are used (main, nav, etc.) |
| | ✅ Lists use proper markup |

### Testing Tools

| Tool | Purpose |
|------|---------|
| **Accessibility Insights** | Browser extension for automated testing |
| **NVDA** | Screen reader (Windows) |
| **VoiceOver** | Screen reader (macOS/iOS) |
| **JAWS** | Screen reader (Windows) |
| **axe DevTools** | Automated accessibility testing |
| **Lighthouse** | Accessibility auditing |

---

## See Also

- [Getting Started](01-getting-started.md) - Initial setup
- [Component Architecture](05-component-architecture.md) - Component patterns
- [FluentProvider](02-fluent-provider.md) - Theme configuration
- [Overview](../00-overview.md) - Training program overview