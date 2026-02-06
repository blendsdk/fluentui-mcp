# Spinner

> **Package**: `@fluentui/react-spinner`
> **Import**: `import { Spinner } from '@fluentui/react-components'`
> **Category**: Feedback

## Overview

Spinner indicates loading or processing state with an animated circular indicator.

---

## Basic Usage

```typescript
import * as React from 'react';
import { Spinner } from '@fluentui/react-components';

export const BasicSpinner: React.FC = () => (
  <Spinner />
);
```

---

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'extra-tiny' \| 'tiny' \| 'extra-small' \| 'small' \| 'medium' \| 'large' \| 'extra-large' \| 'huge'` | `'medium'` | Spinner size |
| `appearance` | `'primary' \| 'inverted'` | `'primary'` | Color scheme |
| `label` | `string` | - | Label text |
| `labelPosition` | `'above' \| 'below' \| 'before' \| 'after'` | `'after'` | Label position |

---

## Size Variants

```typescript
import * as React from 'react';
import { Spinner, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: { display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalL },
});

export const SpinnerSizes: React.FC = () => {
  const styles = useStyles();
  return (
    <div className={styles.container}>
      <Spinner size="extra-tiny" />
      <Spinner size="tiny" />
      <Spinner size="extra-small" />
      <Spinner size="small" />
      <Spinner size="medium" />
      <Spinner size="large" />
      <Spinner size="extra-large" />
      <Spinner size="huge" />
    </div>
  );
};
```

---

## With Label

```typescript
<Spinner label="Loading..." />
<Spinner label="Processing" labelPosition="below" />
<Spinner label="Please wait" labelPosition="above" />
```

---

## In Button

```typescript
import * as React from 'react';
import { Button, Spinner } from '@fluentui/react-components';

export const LoadingButton: React.FC = () => {
  const [loading, setLoading] = React.useState(false);

  return (
    <Button
      appearance="primary"
      disabled={loading}
      icon={loading ? <Spinner size="tiny" /> : undefined}
      onClick={() => setLoading(true)}
    >
      {loading ? 'Saving...' : 'Save'}
    </Button>
  );
};
```

---

## Accessibility

- Has `role="progressbar"` applied automatically
- Use `label` prop for screen reader announcement
- Or use `aria-label` for custom labels

---

## See Also

- [ProgressBar](progressbar.md) - Progress with percentage
- [Skeleton](../data-display/skeleton.md) - Content placeholders
- [Component Index](../00-component-index.md)