# TagPicker

> **Component**: `TagPicker`, `TagPickerControl`, `TagPickerGroup`, `TagPickerInput`, `TagPickerList`, `TagPickerOption`, `TagPickerOptionGroup`, `TagPickerButton`
> **Package**: `@fluentui/react-components` (from `@fluentui/react-tag-picker`)

## Overview

TagPicker is a multi-select component that displays selected items as tags. It combines a combobox-style input with a tag-based selection display, commonly used for selecting multiple items like recipients, categories, or filters.

## Import

```typescript
import {
  TagPicker,
  TagPickerControl,
  TagPickerGroup,
  TagPickerInput,
  TagPickerList,
  TagPickerOption,
  TagPickerOptionGroup,
  TagPickerButton,
  useTagPickerFilter,
  tagPickerInputClassNames,
  tagPickerListClassNames,
  tagPickerControlClassNames,
  tagPickerOptionClassNames,
  tagPickerGroupClassNames,
  tagPickerButtonClassNames,
} from '@fluentui/react-components';
```

## Components

| Component | Description |
|-----------|-------------|
| `TagPicker` | Root container managing state and context |
| `TagPickerControl` | Wrapper for the input and selected tags |
| `TagPickerGroup` | Container for selected Tag components |
| `TagPickerInput` | Text input for filtering/selecting options |
| `TagPickerButton` | Alternative trigger button (instead of input) |
| `TagPickerList` | Dropdown list of available options |
| `TagPickerOption` | Individual selectable option |
| `TagPickerOptionGroup` | Group of options with a label |

---

## Basic Usage

```tsx
import { useState } from 'react';
import {
  TagPicker,
  TagPickerControl,
  TagPickerGroup,
  TagPickerInput,
  TagPickerList,
  TagPickerOption,
  Tag,
  Avatar,
  Field,
} from '@fluentui/react-components';
import type { TagPickerProps } from '@fluentui/react-components';

const options = [
  'John Doe',
  'Jane Doe',
  'Max Mustermann',
  'Erika Mustermann',
];

function BasicTagPicker() {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const onOptionSelect: TagPickerProps['onOptionSelect'] = (_, data) => {
    setSelectedOptions(data.selectedOptions);
  };

  // Filter out already selected options
  const availableOptions = options.filter(
    option => !selectedOptions.includes(option)
  );

  return (
    <Field label="Select Employees" style={{ maxWidth: 400 }}>
      <TagPicker
        onOptionSelect={onOptionSelect}
        selectedOptions={selectedOptions}
      >
        <TagPickerControl>
          <TagPickerGroup aria-label="Selected Employees">
            {selectedOptions.map(option => (
              <Tag
                key={option}
                shape="rounded"
                media={<Avatar aria-hidden name={option} color="colorful" />}
                value={option}
              >
                {option}
              </Tag>
            ))}
          </TagPickerGroup>
          <TagPickerInput aria-label="Select Employees" />
        </TagPickerControl>

        <TagPickerList>
          {availableOptions.length > 0 ? (
            availableOptions.map(option => (
              <TagPickerOption
                key={option}
                value={option}
                media={<Avatar shape="square" aria-hidden name={option} color="colorful" />}
              >
                {option}
              </TagPickerOption>
            ))
          ) : (
            <TagPickerOption value="no-options">
              No options available
            </TagPickerOption>
          )}
        </TagPickerList>
      </TagPicker>
    </Field>
  );
}
```

---

## TagPicker Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `selectedOptions` | `string[]` | - | Array of selected option values |
| `defaultSelectedOptions` | `string[]` | - | Default selected options (uncontrolled) |
| `onOptionSelect` | `(event, data) => void` | - | Callback when option is selected/deselected |
| `open` | `boolean` | - | Controlled open state |
| `defaultOpen` | `boolean` | - | Default open state (uncontrolled) |
| `onOpenChange` | `(event, data) => void` | - | Callback when dropdown opens/closes |
| `disabled` | `boolean` | `false` | Disable the picker |
| `size` | `'medium' \| 'large' \| 'extra-large'` | `'medium'` | Size of the picker |
| `appearance` | `'outline' \| 'underline' \| 'filled-darker' \| 'filled-lighter'` | `'outline'` | Visual appearance |
| `positioning` | `PositioningProps` | - | Dropdown positioning options |
| `inline` | `boolean` | `false` | Render popup in DOM order |
| `noPopover` | `boolean` | `false` | Treat single child as trigger |

### Event Data

```typescript
// onOptionSelect
type TagPickerOnOptionSelectData = {
  value: string;           // The value that triggered the event
  selectedOptions: string[]; // Updated list of selected options
};

// onOpenChange
type TagPickerOnOpenChangeData = {
  open: boolean;
};
```

---

## Filtering Options

Use the `useTagPickerFilter` hook for filtering options based on user input.

```tsx
import { useState } from 'react';
import {
  TagPicker,
  TagPickerControl,
  TagPickerGroup,
  TagPickerInput,
  TagPickerList,
  TagPickerOption,
  Tag,
  Avatar,
  Field,
  useTagPickerFilter,
} from '@fluentui/react-components';
import type { TagPickerProps } from '@fluentui/react-components';

const options = [
  'John Doe',
  'Jane Doe',
  'Max Mustermann',
  'Erika Mustermann',
];

function FilteringTagPicker() {
  const [query, setQuery] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const onOptionSelect: TagPickerProps['onOptionSelect'] = (_, data) => {
    if (data.value === 'no-matches') return;
    setSelectedOptions(data.selectedOptions);
    setQuery(''); // Clear query after selection
  };

  const children = useTagPickerFilter({
    query,
    options,
    noOptionsElement: (
      <TagPickerOption value="no-matches">
        No matches found
      </TagPickerOption>
    ),
    renderOption: option => (
      <TagPickerOption
        key={option}
        value={option}
        secondaryContent="Microsoft FTE"
        media={<Avatar shape="square" aria-hidden name={option} color="colorful" />}
      >
        {option}
      </TagPickerOption>
    ),
    filter: option =>
      !selectedOptions.includes(option) &&
      option.toLowerCase().includes(query.toLowerCase()),
  });

  return (
    <Field label="Select Employees" style={{ maxWidth: 400 }}>
      <TagPicker
        onOptionSelect={onOptionSelect}
        selectedOptions={selectedOptions}
      >
        <TagPickerControl>
          <TagPickerGroup aria-label="Selected Employees">
            {selectedOptions.map(option => (
              <Tag
                key={option}
                shape="rounded"
                media={<Avatar aria-hidden name={option} color="colorful" />}
                value={option}
              >
                {option}
              </Tag>
            ))}
          </TagPickerGroup>
          <TagPickerInput
            aria-label="Select Employees"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </TagPickerControl>

        <TagPickerList>{children}</TagPickerList>
      </TagPicker>
    </Field>
  );
}
```

### useTagPickerFilter Options

| Option | Type | Description |
|--------|------|-------------|
| `query` | `string` | Current search query |
| `options` | `T[]` | Array of options to filter |
| `filter` | `(option: T) => boolean` | Filter function |
| `renderOption` | `(option: T) => ReactNode` | Render function for each option |
| `noOptionsElement` | `ReactNode` | Element to show when no matches |

---

## Grouped Options

Use `TagPickerOptionGroup` to organize options into categories.

```tsx
import { useState } from 'react';
import {
  TagPicker,
  TagPickerControl,
  TagPickerGroup,
  TagPickerInput,
  TagPickerList,
  TagPickerOption,
  TagPickerOptionGroup,
  Tag,
  Avatar,
  Field,
} from '@fluentui/react-components';
import type { TagPickerProps } from '@fluentui/react-components';

const managers = ['John Doe', 'Jane Doe'];
const developers = ['Max Mustermann', 'Erika Mustermann'];

function GroupedTagPicker() {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const onOptionSelect: TagPickerProps['onOptionSelect'] = (_, data) => {
    if (data.value === 'no-options') return;
    setSelectedOptions(data.selectedOptions);
  };

  const unselectedManagers = managers.filter(o => !selectedOptions.includes(o));
  const unselectedDevs = developers.filter(o => !selectedOptions.includes(o));

  return (
    <Field label="Select Employees" style={{ maxWidth: 400 }}>
      <TagPicker
        onOptionSelect={onOptionSelect}
        selectedOptions={selectedOptions}
      >
        <TagPickerControl>
          <TagPickerGroup aria-label="Selected Employees">
            {selectedOptions.map(option => (
              <Tag key={option} shape="rounded" value={option}>
                {option}
              </Tag>
            ))}
          </TagPickerGroup>
          <TagPickerInput aria-label="Select Employees" />
        </TagPickerControl>

        <TagPickerList>
          {unselectedManagers.length === 0 && unselectedDevs.length === 0 && (
            <TagPickerOption value="no-options">
              No options available
            </TagPickerOption>
          )}

          {unselectedManagers.length > 0 && (
            <TagPickerOptionGroup label="Managers">
              {unselectedManagers.map(option => (
                <TagPickerOption key={option} value={option}>
                  {option}
                </TagPickerOption>
              ))}
            </TagPickerOptionGroup>
          )}

          {unselectedDevs.length > 0 && (
            <TagPickerOptionGroup label="Developers">
              {unselectedDevs.map(option => (
                <TagPickerOption key={option} value={option}>
                  {option}
                </TagPickerOption>
              ))}
            </TagPickerOptionGroup>
          )}
        </TagPickerList>
      </TagPicker>
    </Field>
  );
}
```

---

## TagPickerOption Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | **required** | Unique identifier for this option |
| `media` | `ReactNode` | - | Media content (avatar, icon) before text |
| `secondaryContent` | `ReactNode` | - | Secondary text below main content |
| `disabled` | `boolean` | `false` | Disable this option |

```tsx
<TagPickerOption
  value="john-doe"
  media={<Avatar name="John Doe" />}
  secondaryContent="Engineering Team Lead"
>
  John Doe
</TagPickerOption>
```

---

## Size Variants

```tsx
import { TagPicker, TagPickerControl, TagPickerInput } from '@fluentui/react-components';

function TagPickerSizes() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <TagPicker size="medium">
        <TagPickerControl>
          <TagPickerInput placeholder="Medium (default)" />
        </TagPickerControl>
        {/* TagPickerList... */}
      </TagPicker>

      <TagPicker size="large">
        <TagPickerControl>
          <TagPickerInput placeholder="Large" />
        </TagPickerControl>
        {/* TagPickerList... */}
      </TagPicker>

      <TagPicker size="extra-large">
        <TagPickerControl>
          <TagPickerInput placeholder="Extra Large" />
        </TagPickerControl>
        {/* TagPickerList... */}
      </TagPicker>
    </div>
  );
}
```

---

## Appearance Variants

```tsx
import { TagPicker, TagPickerControl, TagPickerInput } from '@fluentui/react-components';

function TagPickerAppearances() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <TagPicker appearance="outline">
        <TagPickerControl>
          <TagPickerInput placeholder="Outline (default)" />
        </TagPickerControl>
      </TagPicker>

      <TagPicker appearance="underline">
        <TagPickerControl>
          <TagPickerInput placeholder="Underline" />
        </TagPickerControl>
      </TagPicker>

      <TagPicker appearance="filled-darker">
        <TagPickerControl>
          <TagPickerInput placeholder="Filled Darker" />
        </TagPickerControl>
      </TagPicker>

      <TagPicker appearance="filled-lighter">
        <TagPickerControl>
          <TagPickerInput placeholder="Filled Lighter" />
        </TagPickerControl>
      </TagPicker>
    </div>
  );
}
```

---

## Using TagPickerButton

Use `TagPickerButton` instead of `TagPickerInput` when you want a button-style trigger.

```tsx
import { useState } from 'react';
import {
  TagPicker,
  TagPickerControl,
  TagPickerGroup,
  TagPickerButton,
  TagPickerList,
  TagPickerOption,
  Tag,
} from '@fluentui/react-components';

const options = ['Option 1', 'Option 2', 'Option 3'];

function ButtonTagPicker() {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  return (
    <TagPicker
      selectedOptions={selectedOptions}
      onOptionSelect={(_, data) => setSelectedOptions(data.selectedOptions)}
    >
      <TagPickerControl>
        <TagPickerGroup>
          {selectedOptions.map(option => (
            <Tag key={option} shape="rounded" value={option}>
              {option}
            </Tag>
          ))}
        </TagPickerGroup>
        <TagPickerButton aria-label="Select options" />
      </TagPickerControl>

      <TagPickerList>
        {options
          .filter(o => !selectedOptions.includes(o))
          .map(option => (
            <TagPickerOption key={option} value={option}>
              {option}
            </TagPickerOption>
          ))}
      </TagPickerList>
    </TagPicker>
  );
}
```

---

## Disabled State

```tsx
import { TagPicker, TagPickerControl, TagPickerInput, Tag } from '@fluentui/react-components';

function DisabledTagPicker() {
  return (
    <TagPicker disabled selectedOptions={['Option 1', 'Option 2']}>
      <TagPickerControl>
        <Tag shape="rounded" value="Option 1">Option 1</Tag>
        <Tag shape="rounded" value="Option 2">Option 2</Tag>
        <TagPickerInput aria-label="Disabled picker" />
      </TagPickerControl>
    </TagPicker>
  );
}
```

---

## Accessibility

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Move focus to/from the picker |
| `Arrow Down` | Open dropdown / Move to next option |
| `Arrow Up` | Move to previous option |
| `Enter` | Select focused option |
| `Escape` | Close dropdown |
| `Backspace` | Remove last selected tag (when input empty) |

### ARIA Requirements

```tsx
<TagPicker>
  <TagPickerControl>
    {/* aria-label on TagPickerGroup for screen readers */}
    <TagPickerGroup aria-label="Selected items">
      {/* Tags with value prop for removal */}
      <Tag value="item1">Item 1</Tag>
    </TagPickerGroup>
    {/* aria-label on input */}
    <TagPickerInput aria-label="Select items" />
  </TagPickerControl>

  <TagPickerList>
    {/* Options are automatically handled */}
    <TagPickerOption value="option1">Option 1</TagPickerOption>
  </TagPickerList>
</TagPicker>
```

---

## Styling

### Class Names

```typescript
import {
  tagPickerInputClassNames,
  tagPickerListClassNames,
  tagPickerControlClassNames,
  tagPickerOptionClassNames,
  tagPickerGroupClassNames,
  tagPickerButtonClassNames,
} from '@fluentui/react-components';

// TagPickerInput
tagPickerInputClassNames.root

// TagPickerList
tagPickerListClassNames.root

// TagPickerControl
tagPickerControlClassNames.root

// TagPickerOption
tagPickerOptionClassNames.root

// TagPickerGroup
tagPickerGroupClassNames.root

// TagPickerButton
tagPickerButtonClassNames.root
```

### Custom Styling

```tsx
import {
  TagPicker,
  TagPickerControl,
  TagPickerInput,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  control: {
    minHeight: '60px',
  },
  input: {
    '::placeholder': {
      color: tokens.colorNeutralForeground4,
    },
  },
});

function StyledTagPicker() {
  const styles = useStyles();

  return (
    <TagPicker>
      <TagPickerControl className={styles.control}>
        <TagPickerInput
          className={styles.input}
          placeholder="Search and select..."
        />
      </TagPickerControl>
    </TagPicker>
  );
}
```

---

## Common Patterns

### Email Recipients Picker

```tsx
import { useState } from 'react';
import {
  TagPicker,
  TagPickerControl,
  TagPickerGroup,
  TagPickerInput,
  TagPickerList,
  TagPickerOption,
  Tag,
  Avatar,
  Field,
  useTagPickerFilter,
} from '@fluentui/react-components';
import { MailRegular } from '@fluentui/react-icons';

const contacts = [
  { name: 'John Doe', email: 'john@example.com' },
  { name: 'Jane Smith', email: 'jane@example.com' },
  { name: 'Bob Wilson', email: 'bob@example.com' },
];

function EmailRecipientsPicker() {
  const [query, setQuery] = useState('');
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

  const selectedContacts = contacts.filter(c =>
    selectedEmails.includes(c.email)
  );

  const children = useTagPickerFilter({
    query,
    options: contacts,
    noOptionsElement: (
      <TagPickerOption value="no-match">No contacts found</TagPickerOption>
    ),
    renderOption: contact => (
      <TagPickerOption
        key={contact.email}
        value={contact.email}
        media={<Avatar name={contact.name} size={24} />}
        secondaryContent={contact.email}
      >
        {contact.name}
      </TagPickerOption>
    ),
    filter: contact =>
      !selectedEmails.includes(contact.email) &&
      (contact.name.toLowerCase().includes(query.toLowerCase()) ||
        contact.email.toLowerCase().includes(query.toLowerCase())),
  });

  return (
    <Field label="To:" style={{ maxWidth: 500 }}>
      <TagPicker
        selectedOptions={selectedEmails}
        onOptionSelect={(_, data) => {
          if (data.value !== 'no-match') {
            setSelectedEmails(data.selectedOptions);
            setQuery('');
          }
        }}
      >
        <TagPickerControl>
          <TagPickerGroup aria-label="Recipients">
            {selectedContacts.map(contact => (
              <Tag
                key={contact.email}
                shape="rounded"
                media={<Avatar name={contact.name} size={20} />}
                value={contact.email}
              >
                {contact.name}
              </Tag>
            ))}
          </TagPickerGroup>
          <TagPickerInput
            aria-label="Add recipients"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search contacts..."
          />
        </TagPickerControl>

        <TagPickerList>{children}</TagPickerList>
      </TagPicker>
    </Field>
  );
}
```

### Category Tags Picker

```tsx
import { useState } from 'react';
import {
  TagPicker,
  TagPickerControl,
  TagPickerGroup,
  TagPickerInput,
  TagPickerList,
  TagPickerOption,
  Tag,
  tokens,
} from '@fluentui/react-components';

const categories = [
  { id: 'bug', label: 'Bug', color: tokens.colorPaletteRedForeground1 },
  { id: 'feature', label: 'Feature', color: tokens.colorPaletteGreenForeground1 },
  { id: 'docs', label: 'Documentation', color: tokens.colorPaletteBlueForeground1 },
  { id: 'urgent', label: 'Urgent', color: tokens.colorPaletteMarigoldForeground1 },
];

function CategoryPicker() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selectedCategories = categories.filter(c => selectedIds.includes(c.id));
  const availableCategories = categories.filter(c => !selectedIds.includes(c.id));

  return (
    <TagPicker
      selectedOptions={selectedIds}
      onOptionSelect={(_, data) => setSelectedIds(data.selectedOptions)}
    >
      <TagPickerControl>
        <TagPickerGroup aria-label="Selected categories">
          {selectedCategories.map(cat => (
            <Tag
              key={cat.id}
              shape="circular"
              style={{ backgroundColor: cat.color, color: 'white' }}
              value={cat.id}
            >
              {cat.label}
            </Tag>
          ))}
        </TagPickerGroup>
        <TagPickerInput aria-label="Add categories" placeholder="Add labels..." />
      </TagPickerControl>

      <TagPickerList>
        {availableCategories.map(cat => (
          <TagPickerOption key={cat.id} value={cat.id}>
            <span style={{ color: cat.color }}>●</span> {cat.label}
          </TagPickerOption>
        ))}
      </TagPickerList>
    </TagPicker>
  );
}
```

---

## Best Practices

### Do's ✅

- Always provide aria-labels for accessibility
- Filter out already-selected options from the list
- Clear the search query after selection
- Show a "no options" message when list is empty
- Use meaningful option values for form submission
- Group related options with `TagPickerOptionGroup`

### Don'ts ❌

- Don't forget to handle the "no-options" value in onOptionSelect
- Don't use very long option lists without filtering
- Don't forget to add `value` prop to Tag components for removal
- Don't mix TagPickerInput and TagPickerButton in same picker

---

## Related Components

- [Combobox](./combobox.md) - Single-select dropdown
- [Tag](../data-display/tag.md) - Individual tag component
- [Field](./field.md) - Form field wrapper with label