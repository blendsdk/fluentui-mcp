# MessageBar

> **Package**: `@fluentui/react-message-bar`
> **Import**: `import { MessageBar, MessageBarBody, MessageBarTitle, MessageBarActions, MessageBarIntent } from '@fluentui/react-components'`
> **Category**: Feedback

## Overview

MessageBar displays inline messages with different intents (info, warning, error, success). Use for non-blocking notifications that relate to page content.

---

## Basic Usage

```typescript
import * as React from 'react';
import { MessageBar, MessageBarBody } from '@fluentui/react-components';

export const BasicMessageBar: React.FC = () => (
  <MessageBar>
    <MessageBarBody>This is an informational message.</MessageBarBody>
  </MessageBar>
);
```

---

## Component Structure

| Component | Purpose |
|-----------|---------|
| `MessageBar` | Root container with intent styling |
| `MessageBarBody` | Main message content |
| `MessageBarTitle` | Optional bold title |
| `MessageBarActions` | Action buttons container |

---

## MessageBar Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `intent` | `'info' \| 'warning' \| 'error' \| 'success'` | `'info'` | Message type/color |
| `layout` | `'singleline' \| 'multiline'` | `'singleline'` | Layout style |
| `shape` | `'rounded' \| 'square'` | `'rounded'` | Border shape |
| `icon` | `Slot<'span'>` | auto | Custom icon |

---

## Intent Variants

```typescript
import * as React from 'react';
import { MessageBar, MessageBarBody, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalM },
});

export const MessageBarIntents: React.FC = () => {
  const styles = useStyles();
  return (
    <div className={styles.container}>
      <MessageBar intent="info">
        <MessageBarBody>Info: General information message.</MessageBarBody>
      </MessageBar>
      <MessageBar intent="success">
        <MessageBarBody>Success: Operation completed successfully.</MessageBarBody>
      </MessageBar>
      <MessageBar intent="warning">
        <MessageBarBody>Warning: Please review before continuing.</MessageBarBody>
      </MessageBar>
      <MessageBar intent="error">
        <MessageBarBody>Error: Something went wrong.</MessageBarBody>
      </MessageBar>
    </div>
  );
};
```

---

## With Title and Actions

```typescript
import * as React from 'react';
import {
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  MessageBarActions,
  Button,
  Link,
} from '@fluentui/react-components';
import { DismissRegular } from '@fluentui/react-icons';

export const MessageBarWithActions: React.FC = () => (
  <MessageBar intent="warning">
    <MessageBarBody>
      <MessageBarTitle>Update Available</MessageBarTitle>
      A new version is available. Please update to get the latest features.
    </MessageBarBody>
    <MessageBarActions
      containerAction={<Button appearance="transparent" icon={<DismissRegular />} />}
    >
      <Button size="small">Update Now</Button>
      <Link>Learn more</Link>
    </MessageBarActions>
  </MessageBar>
);
```

---

## Multiline Layout

```typescript
<MessageBar intent="info" layout="multiline">
  <MessageBarBody>
    <MessageBarTitle>Important Information</MessageBarTitle>
    This is a longer message that spans multiple lines. Use multiline layout when
    you need to display more content or when actions should appear below the message.
  </MessageBarBody>
  <MessageBarActions>
    <Button>Action 1</Button>
    <Button>Action 2</Button>
  </MessageBarActions>
</MessageBar>
```

---

## Dismissible Pattern

```typescript
import * as React from 'react';
import {
  MessageBar,
  MessageBarBody,
  MessageBarActions,
  Button,
} from '@fluentui/react-components';
import { DismissRegular } from '@fluentui/react-icons';

export const DismissibleMessageBar: React.FC = () => {
  const [visible, setVisible] = React.useState(true);

  if (!visible) return null;

  return (
    <MessageBar intent="success">
      <MessageBarBody>Your changes have been saved.</MessageBarBody>
      <MessageBarActions
        containerAction={
          <Button
            appearance="transparent"
            icon={<DismissRegular />}
            onClick={() => setVisible(false)}
            aria-label="Dismiss"
          />
        }
      />
    </MessageBar>
  );
};
```

---

## Accessibility

- Uses `role="status"` for info/success, `role="alert"` for warning/error
- Icons have appropriate `aria-hidden`
- Dismiss buttons need `aria-label`

---

## Best Practices

### ✅ Do's

```typescript
<MessageBar intent="error">
  <MessageBarBody>
    <MessageBarTitle>Upload Failed</MessageBarTitle>
    File exceeded maximum size of 10MB.
  </MessageBarBody>
</MessageBar>
```

### ❌ Don'ts

```typescript
// Don't use MessageBar for temporary notifications (use Toast)
// Don't use multiple MessageBars of same intent stacked
```

---

## See Also

- [Toast](toast.md) - Temporary notifications
- [Dialog](dialog.md) - Modal messages
- [Component Index](../00-component-index.md)