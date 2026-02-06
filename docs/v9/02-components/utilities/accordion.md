# Accordion

> **Package**: `@fluentui/react-accordion`
> **Import**: `import { Accordion, AccordionItem, AccordionHeader, AccordionPanel } from '@fluentui/react-components'`
> **Category**: Utilities

## Overview

Accordion displays collapsible content sections. Only one or multiple sections can be expanded at a time. Use for organizing related content into expandable/collapsible groups.

---

## Basic Usage

```typescript
import * as React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
} from '@fluentui/react-components';

export const BasicAccordion: React.FC = () => (
  <Accordion>
    <AccordionItem value="1">
      <AccordionHeader>Section 1</AccordionHeader>
      <AccordionPanel>
        Content for section 1
      </AccordionPanel>
    </AccordionItem>
    <AccordionItem value="2">
      <AccordionHeader>Section 2</AccordionHeader>
      <AccordionPanel>
        Content for section 2
      </AccordionPanel>
    </AccordionItem>
    <AccordionItem value="3">
      <AccordionHeader>Section 3</AccordionHeader>
      <AccordionPanel>
        Content for section 3
      </AccordionPanel>
    </AccordionItem>
  </Accordion>
);
```

---

## Component Structure

| Component | Purpose |
|-----------|---------|
| `Accordion` | Root container, manages state |
| `AccordionItem` | Individual collapsible section |
| `AccordionHeader` | Clickable header that toggles panel |
| `AccordionPanel` | Collapsible content area |

---

## Accordion Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `openItems` | `AccordionItemValue[]` | - | Controlled open items |
| `defaultOpenItems` | `AccordionItemValue[]` | `[]` | Default open items |
| `onToggle` | `(ev, data) => void` | - | Toggle handler |
| `multiple` | `boolean` | `false` | Allow multiple open items |
| `collapsible` | `boolean` | `false` | Allow all items to be closed |
| `navigation` | `'linear' \| 'circular'` | - | Keyboard navigation mode |

## AccordionItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `AccordionItemValue` | required | Unique identifier |
| `disabled` | `boolean` | `false` | Disabled state |

## AccordionHeader Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `Slot<'span'>` | Chevron | Custom expand icon |
| `expandIcon` | `Slot<'span'>` | - | Alias for icon |
| `expandIconPosition` | `'start' \| 'end'` | `'start'` | Icon position |
| `size` | `'small' \| 'medium' \| 'large' \| 'extra-large'` | `'medium'` | Header size |
| `inline` | `boolean` | `false` | Inline header layout |

---

## Controlled vs Uncontrolled

### Uncontrolled

```typescript
import * as React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
} from '@fluentui/react-components';

export const UncontrolledAccordion: React.FC = () => (
  <Accordion defaultOpenItems={['1']}>
    <AccordionItem value="1">
      <AccordionHeader>Initially Open</AccordionHeader>
      <AccordionPanel>This panel is open by default.</AccordionPanel>
    </AccordionItem>
    <AccordionItem value="2">
      <AccordionHeader>Initially Closed</AccordionHeader>
      <AccordionPanel>This panel is closed by default.</AccordionPanel>
    </AccordionItem>
  </Accordion>
);
```

### Controlled

```typescript
import * as React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
  AccordionToggleEventHandler,
} from '@fluentui/react-components';

export const ControlledAccordion: React.FC = () => {
  const [openItems, setOpenItems] = React.useState<string[]>(['1']);

  const handleToggle: AccordionToggleEventHandler<string> = (_, data) => {
    setOpenItems(data.openItems);
  };

  return (
    <Accordion openItems={openItems} onToggle={handleToggle}>
      <AccordionItem value="1">
        <AccordionHeader>Section 1</AccordionHeader>
        <AccordionPanel>Content 1</AccordionPanel>
      </AccordionItem>
      <AccordionItem value="2">
        <AccordionHeader>Section 2</AccordionHeader>
        <AccordionPanel>Content 2</AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
```

---

## Multiple Open Items

```typescript
import * as React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
} from '@fluentui/react-components';

export const MultipleAccordion: React.FC = () => (
  <Accordion multiple defaultOpenItems={['1', '2']}>
    <AccordionItem value="1">
      <AccordionHeader>Section 1</AccordionHeader>
      <AccordionPanel>Content 1 - Can be open with others</AccordionPanel>
    </AccordionItem>
    <AccordionItem value="2">
      <AccordionHeader>Section 2</AccordionHeader>
      <AccordionPanel>Content 2 - Can be open with others</AccordionPanel>
    </AccordionItem>
    <AccordionItem value="3">
      <AccordionHeader>Section 3</AccordionHeader>
      <AccordionPanel>Content 3 - Can be open with others</AccordionPanel>
    </AccordionItem>
  </Accordion>
);
```

---

## Collapsible (All Can Be Closed)

```typescript
import * as React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
} from '@fluentui/react-components';

export const CollapsibleAccordion: React.FC = () => (
  <Accordion collapsible>
    <AccordionItem value="1">
      <AccordionHeader>Click to toggle</AccordionHeader>
      <AccordionPanel>
        All items can be collapsed. Click header again to close.
      </AccordionPanel>
    </AccordionItem>
    <AccordionItem value="2">
      <AccordionHeader>Another section</AccordionHeader>
      <AccordionPanel>This can also be collapsed.</AccordionPanel>
    </AccordionItem>
  </Accordion>
);
```

---

## Header Sizes

```typescript
import * as React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  accordion: { maxWidth: '400px' },
});

export const AccordionSizes: React.FC = () => {
  const styles = useStyles();

  return (
    <Accordion className={styles.accordion} collapsible>
      <AccordionItem value="1">
        <AccordionHeader size="small">Small Header</AccordionHeader>
        <AccordionPanel>Small size content</AccordionPanel>
      </AccordionItem>
      <AccordionItem value="2">
        <AccordionHeader size="medium">Medium Header (default)</AccordionHeader>
        <AccordionPanel>Medium size content</AccordionPanel>
      </AccordionItem>
      <AccordionItem value="3">
        <AccordionHeader size="large">Large Header</AccordionHeader>
        <AccordionPanel>Large size content</AccordionPanel>
      </AccordionItem>
      <AccordionItem value="4">
        <AccordionHeader size="extra-large">Extra Large Header</AccordionHeader>
        <AccordionPanel>Extra large size content</AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
```

---

## Custom Expand Icon

```typescript
import * as React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
} from '@fluentui/react-components';
import { AddRegular, SubtractRegular } from '@fluentui/react-icons';

export const CustomIconAccordion: React.FC = () => (
  <Accordion collapsible>
    <AccordionItem value="1">
      <AccordionHeader
        expandIcon={<AddRegular />}
        expandIconPosition="end"
      >
        Custom expand icon at end
      </AccordionHeader>
      <AccordionPanel>Content with custom icon</AccordionPanel>
    </AccordionItem>
    <AccordionItem value="2">
      <AccordionHeader icon={<SubtractRegular />}>
        Another custom icon
      </AccordionHeader>
      <AccordionPanel>More content</AccordionPanel>
    </AccordionItem>
  </Accordion>
);
```

---

## Disabled Items

```typescript
import * as React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
} from '@fluentui/react-components';

export const DisabledAccordion: React.FC = () => (
  <Accordion collapsible>
    <AccordionItem value="1">
      <AccordionHeader>Available Section</AccordionHeader>
      <AccordionPanel>This section works normally.</AccordionPanel>
    </AccordionItem>
    <AccordionItem value="2" disabled>
      <AccordionHeader>Disabled Section</AccordionHeader>
      <AccordionPanel>This content cannot be accessed.</AccordionPanel>
    </AccordionItem>
    <AccordionItem value="3">
      <AccordionHeader>Another Available Section</AccordionHeader>
      <AccordionPanel>This section also works.</AccordionPanel>
    </AccordionItem>
  </Accordion>
);
```

---

## With Inline Header

```typescript
import * as React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
} from '@fluentui/react-components';

export const InlineHeaderAccordion: React.FC = () => (
  <Accordion collapsible>
    <AccordionItem value="1">
      <AccordionHeader inline>Inline header style</AccordionHeader>
      <AccordionPanel>
        Inline headers take only the width of their content.
      </AccordionPanel>
    </AccordionItem>
  </Accordion>
);
```

---

## FAQ Pattern

```typescript
import * as React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  container: { maxWidth: '600px' },
  panel: {
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase300,
  },
});

const faqs = [
  {
    question: 'How do I create an account?',
    answer: 'Click the "Sign Up" button in the top right corner and follow the registration process.',
  },
  {
    question: 'How can I reset my password?',
    answer: 'Go to the login page and click "Forgot Password". Enter your email to receive reset instructions.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, PayPal, and bank transfers.',
  },
];

export const FAQAccordion: React.FC = () => {
  const styles = useStyles();

  return (
    <Accordion className={styles.container} collapsible multiple>
      {faqs.map((faq, index) => (
        <AccordionItem key={index} value={index.toString()}>
          <AccordionHeader size="large">{faq.question}</AccordionHeader>
          <AccordionPanel>
            <Text className={styles.panel}>{faq.answer}</Text>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
```

---

## Accessibility

### Keyboard Support

| Key | Action |
|-----|--------|
| `Tab` | Move focus between accordion headers |
| `Enter` / `Space` | Toggle the focused accordion item |
| `Arrow Down` | Move focus to next header |
| `Arrow Up` | Move focus to previous header |
| `Home` | Move focus to first header |
| `End` | Move focus to last header |

### ARIA Attributes

| Element | Attribute | Value |
|---------|-----------|-------|
| AccordionHeader | `role` | `button` |
| AccordionHeader | `aria-expanded` | `true/false` |
| AccordionHeader | `aria-controls` | Panel ID |
| AccordionPanel | `role` | `region` |
| AccordionPanel | `aria-labelledby` | Header ID |

---

## Best Practices

### ✅ Do's

```typescript
// Use descriptive headers
<AccordionHeader>Shipping & Delivery Information</AccordionHeader>

// Use collapsible when all can be closed
<Accordion collapsible>...</Accordion>

// Use multiple when several can be open
<Accordion multiple>...</Accordion>
```

### ❌ Don'ts

```typescript
// Don't nest accordions deeply
<Accordion>
  <AccordionPanel>
    <Accordion>...</Accordion>  {/* Avoid nesting */}
  </AccordionPanel>
</Accordion>

// Don't use for navigation (use Nav or Tabs)
// Don't put critical content only in accordion
```

---

## See Also

- [Tabs](../navigation/tabs.md) - Tab navigation
- [Card](../layout/card.md) - Content container
- [Component Index](../00-component-index.md)