# ProgressBar

> **Package**: `@fluentui/react-progress`
> **Import**: `import { ProgressBar, Field } from '@fluentui/react-components'`
> **Category**: Feedback

## Overview

ProgressBar displays the progress of an operation. Supports determinate (known progress) and indeterminate (unknown duration) states.

---

## Basic Usage

```typescript
import * as React from 'react';
import { ProgressBar } from '@fluentui/react-components';

export const BasicProgressBar: React.FC = () => (
  <ProgressBar value={0.5} />
);
```

---

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | - | Progress value (0-1). Omit for indeterminate |
| `max` | `number` | `1` | Maximum value |
| `thickness` | `'medium' \| 'large'` | `'medium'` | Bar thickness |
| `color` | `'brand' \| 'success' \| 'warning' \| 'error'` | `'brand'` | Color variant |
| `shape` | `'rounded' \| 'square'` | `'rounded'` | Bar shape |

---

## Determinate Progress

```typescript
import * as React from 'react';
import { ProgressBar, Field, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalL },
});

export const DeterminateProgress: React.FC = () => {
  const styles = useStyles();
  return (
    <div className={styles.container}>
      <Field label="25% complete" validationMessage="25%">
        <ProgressBar value={0.25} />
      </Field>
      <Field label="50% complete" validationMessage="50%">
        <ProgressBar value={0.5} />
      </Field>
      <Field label="75% complete" validationMessage="75%">
        <ProgressBar value={0.75} />
      </Field>
      <Field label="100% complete" validationMessage="100%">
        <ProgressBar value={1} />
      </Field>
    </div>
  );
};
```

---

## Indeterminate Progress

```typescript
import * as React from 'react';
import { ProgressBar, Field } from '@fluentui/react-components';

export const IndeterminateProgress: React.FC = () => (
  <Field label="Loading..." validationMessage="Please wait">
    <ProgressBar />
  </Field>
);
```

---

## Color Variants

```typescript
import * as React from 'react';
import { ProgressBar, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalM },
});

export const ProgressBarColors: React.FC = () => {
  const styles = useStyles();
  return (
    <div className={styles.container}>
      <ProgressBar value={0.5} color="brand" />
      <ProgressBar value={0.5} color="success" />
      <ProgressBar value={0.5} color="warning" />
      <ProgressBar value={0.5} color="error" />
    </div>
  );
};
```

---

## Thickness Variants

```typescript
<ProgressBar value={0.5} thickness="medium" />
<ProgressBar value={0.5} thickness="large" />
```

---

## Accessibility

- Use `Field` with `label` for accessible labeling
- `aria-valuenow`, `aria-valuemin`, `aria-valuemax` applied automatically
- Indeterminate state uses `aria-busy="true"`

---

## See Also

- [Spinner](spinner.md) - Loading indicator
- [Skeleton](../data-display/skeleton.md) - Loading placeholders
- [Component Index](../00-component-index.md)