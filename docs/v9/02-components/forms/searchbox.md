# SearchBox

> **Package**: `@fluentui/react-search`
> **Import**: `import { SearchBox } from '@fluentui/react-components'`
> **Category**: Forms

## Overview

SearchBox is a specialized Input for search functionality. It includes a search icon, optional dismiss button, and optimized keyboard interactions for search scenarios.

---

## Basic Usage

```typescript
import * as React from 'react';
import { SearchBox } from '@fluentui/react-components';

export const BasicSearchBox: React.FC = () => (
  <SearchBox placeholder="Search..." />
);
```

---

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Controlled value |
| `defaultValue` | `string` | - | Default value (uncontrolled) |
| `appearance` | `'outline' \| 'underline' \| 'filled-darker' \| 'filled-lighter'` | `'outline'` | Visual style |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size of the input |
| `disabled` | `boolean` | `false` | Disabled state |
| `placeholder` | `string` | - | Placeholder text |
| `contentBefore` | `Slot<'span'>` | Search icon | Content before input |
| `contentAfter` | `Slot<'span'>` | - | Content after input |
| `dismiss` | `Slot<'span'>` | X icon | Dismiss/clear button |
| `onChange` | `(ev, data) => void` | - | Change handler |

### Slots

| Slot | Element | Description |
|------|---------|-------------|
| `root` | `<span>` | Root wrapper element |
| `input` | `<input>` | Text input element |
| `contentBefore` | `<span>` | Search icon container |
| `contentAfter` | `<span>` | Content after input |
| `dismiss` | `<span>` | Clear button |

---

## Controlled vs Uncontrolled

### Uncontrolled

```typescript
import * as React from 'react';
import { SearchBox } from '@fluentui/react-components';

export const UncontrolledSearchBox: React.FC = () => (
  <SearchBox defaultValue="" placeholder="Search files..." />
);
```

### Controlled

```typescript
import * as React from 'react';
import { SearchBox, makeStyles, tokens, Text } from '@fluentui/react-components';
import type { SearchBoxChangeEvent } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
});

export const ControlledSearchBox: React.FC = () => {
  const styles = useStyles();
  const [query, setQuery] = React.useState('');

  const handleChange = React.useCallback(
    (_ev: SearchBoxChangeEvent, data: { value: string }) => {
      setQuery(data.value);
    },
    []
  );

  return (
    <div className={styles.container}>
      <SearchBox
        value={query}
        onChange={handleChange}
        placeholder="Search..."
      />
      <Text>Query: "{query}"</Text>
    </div>
  );
};
```

---

## Appearance Variants

```typescript
import * as React from 'react';
import { SearchBox, Field, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
});

export const SearchBoxAppearances: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.form}>
      <Field label="Outline (default)">
        <SearchBox appearance="outline" placeholder="Search..." />
      </Field>

      <Field label="Underline">
        <SearchBox appearance="underline" placeholder="Search..." />
      </Field>

      <Field label="Filled Darker">
        <SearchBox appearance="filled-darker" placeholder="Search..." />
      </Field>

      <Field label="Filled Lighter">
        <SearchBox appearance="filled-lighter" placeholder="Search..." />
      </Field>
    </div>
  );
};
```

---

## Size Variants

```typescript
import * as React from 'react';
import { SearchBox, Field, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
});

export const SearchBoxSizes: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.form}>
      <Field label="Small" size="small">
        <SearchBox size="small" placeholder="Search..." />
      </Field>

      <Field label="Medium" size="medium">
        <SearchBox size="medium" placeholder="Search..." />
      </Field>

      <Field label="Large" size="large">
        <SearchBox size="large" placeholder="Search..." />
      </Field>
    </div>
  );
};
```

---

## With Dismiss Button

The dismiss button appears when the SearchBox has a value:

```typescript
import * as React from 'react';
import { SearchBox, makeStyles, tokens, Text } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
});

export const SearchBoxWithDismiss: React.FC = () => {
  const styles = useStyles();
  const [query, setQuery] = React.useState('initial search');

  return (
    <div className={styles.container}>
      <SearchBox
        value={query}
        onChange={(_, data) => setQuery(data.value)}
        placeholder="Search..."
      />
      <Text size={200}>
        The dismiss (X) button appears when there's text to clear.
        Current query: "{query}"
      </Text>
    </div>
  );
};
```

---

## Disabled State

```typescript
import * as React from 'react';
import { SearchBox, Field, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
});

export const DisabledSearchBox: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.form}>
      <Field label="Disabled (empty)">
        <SearchBox disabled placeholder="Search..." />
      </Field>

      <Field label="Disabled (with value)">
        <SearchBox disabled defaultValue="search term" />
      </Field>
    </div>
  );
};
```

---

## Search with Submit

```typescript
import * as React from 'react';
import { SearchBox, Button, makeStyles, tokens, Text } from '@fluentui/react-components';
import { SearchRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
  searchRow: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
  },
  results: {
    padding: tokens.spacingHorizontalM,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
  },
});

export const SearchWithSubmit: React.FC = () => {
  const styles = useStyles();
  const [query, setQuery] = React.useState('');
  const [submittedQuery, setSubmittedQuery] = React.useState('');

  const handleSubmit = React.useCallback(() => {
    setSubmittedQuery(query);
  }, [query]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <div className={styles.container}>
      <div className={styles.searchRow}>
        <SearchBox
          value={query}
          onChange={(_, data) => setQuery(data.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search..."
          style={{ flex: 1 }}
        />
        <Button
          appearance="primary"
          icon={<SearchRegular />}
          onClick={handleSubmit}
        >
          Search
        </Button>
      </div>
      {submittedQuery && (
        <div className={styles.results}>
          <Text>Showing results for: "{submittedQuery}"</Text>
        </div>
      )}
    </div>
  );
};
```

---

## Live Search / Filtering

```typescript
import * as React from 'react';
import { SearchBox, makeStyles, tokens, Text } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
  results: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
  item: {
    padding: tokens.spacingHorizontalS,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusSmall,
  },
});

const items = [
  'Apple', 'Banana', 'Cherry', 'Date', 'Elderberry',
  'Fig', 'Grape', 'Honeydew', 'Kiwi', 'Lemon',
];

export const LiveSearchFilter: React.FC = () => {
  const styles = useStyles();
  const [query, setQuery] = React.useState('');

  const filteredItems = React.useMemo(() => {
    if (!query.trim()) return items;
    return items.filter(item =>
      item.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <div className={styles.container}>
      <SearchBox
        value={query}
        onChange={(_, data) => setQuery(data.value)}
        placeholder="Filter fruits..."
      />
      <div className={styles.results}>
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <div key={item} className={styles.item}>
              <Text>{item}</Text>
            </div>
          ))
        ) : (
          <Text>No results found</Text>
        )}
      </div>
    </div>
  );
};
```

---

## Debounced Search

```typescript
import * as React from 'react';
import { SearchBox, Spinner, makeStyles, tokens, Text } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
  status: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
});

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export const DebouncedSearch: React.FC = () => {
  const styles = useStyles();
  const [query, setQuery] = React.useState('');
  const [isSearching, setIsSearching] = React.useState(false);
  const debouncedQuery = useDebounce(query, 500);

  React.useEffect(() => {
    if (debouncedQuery) {
      setIsSearching(true);
      // Simulate API call
      const timer = setTimeout(() => {
        setIsSearching(false);
        console.log('Searching for:', debouncedQuery);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [debouncedQuery]);

  return (
    <div className={styles.container}>
      <SearchBox
        value={query}
        onChange={(_, data) => setQuery(data.value)}
        placeholder="Type to search..."
      />
      <div className={styles.status}>
        {isSearching ? (
          <>
            <Spinner size="tiny" />
            <Text>Searching for "{debouncedQuery}"...</Text>
          </>
        ) : debouncedQuery ? (
          <Text>Results for "{debouncedQuery}"</Text>
        ) : (
          <Text>Start typing to search</Text>
        )}
      </div>
    </div>
  );
};
```

---

## Custom Icons

```typescript
import * as React from 'react';
import { SearchBox, Field, makeStyles, tokens } from '@fluentui/react-components';
import { 
  SearchRegular, 
  FilterRegular,
  PersonSearchRegular,
  DocumentSearchRegular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
});

export const CustomIconSearchBox: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.form}>
      <Field label="Default search icon">
        <SearchBox placeholder="Search..." />
      </Field>

      <Field label="Filter icon">
        <SearchBox
          contentBefore={<FilterRegular />}
          placeholder="Filter items..."
        />
      </Field>

      <Field label="Person search">
        <SearchBox
          contentBefore={<PersonSearchRegular />}
          placeholder="Find people..."
        />
      </Field>

      <Field label="Document search">
        <SearchBox
          contentBefore={<DocumentSearchRegular />}
          placeholder="Search documents..."
        />
      </Field>
    </div>
  );
};
```

---

## Accessibility

### Keyboard Support

| Key | Action |
|-----|--------|
| `Tab` | Move focus to/from SearchBox |
| `Escape` | Clear the search input |
| `Enter` | Typically triggers search (implement in onKeyDown) |

### ARIA Attributes

| Attribute | Value | Description |
|-----------|-------|-------------|
| `type` | `search` | Input type is search |
| `role` | `searchbox` | Identifies as searchbox |
| `aria-label` | string | Accessible name when no visible label |

### Best Practices

```typescript
// ✅ Always provide accessible name
<SearchBox aria-label="Search products" placeholder="Search..." />

// ✅ Or use with Field for visible label
<Field label="Search">
  <SearchBox placeholder="Type to search..." />
</Field>

// ✅ Announce search results to screen readers
<div aria-live="polite">
  {results.length} results found
</div>
```

---

## Styling Customization

```typescript
import * as React from 'react';
import {
  SearchBox,
  makeStyles,
  tokens,
  searchBoxClassNames,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  customSearchBox: {
    borderRadius: tokens.borderRadiusCircular,
    [`& .${searchBoxClassNames.input}`]: {
      fontSize: tokens.fontSizeBase300,
    },
  },
});

export const CustomStyledSearchBox: React.FC = () => {
  const styles = useStyles();

  return (
    <SearchBox
      className={styles.customSearchBox}
      placeholder="Search..."
    />
  );
};
```

---

## Best Practices

### ✅ Do's

```typescript
// ✅ Provide meaningful placeholder
<SearchBox placeholder="Search products by name..." />

// ✅ Use aria-label for accessibility
<SearchBox aria-label="Search site" placeholder="Search..." />

// ✅ Debounce API calls
const debouncedQuery = useDebounce(query, 300);

// ✅ Show clear feedback during search
{isSearching && <Spinner size="tiny" />}

// ✅ Announce results to screen readers
<div aria-live="polite">{resultCount} results found</div>
```

### ❌ Don'ts

```typescript
// ❌ Don't use without accessible name
<SearchBox placeholder="Search" /> // Missing aria-label

// ❌ Don't make API calls on every keystroke
onChange={(_, data) => fetchResults(data.value)} // Too many calls

// ❌ Don't forget to handle empty states
{results.map(...)} // What if no results?
```

---

## See Also

- [Input](input.md) - General text input
- [Combobox](combobox.md) - Searchable dropdown
- [Field](field.md) - Form field wrapper
- [Component Index](../00-component-index.md) - All components