# Search Navigation Patterns - FluentUI v9

> **Topic**: Search-Driven Navigation
> **Components**: `SearchBox`, `Input`, `Combobox`, custom implementations
> **Package**: `@fluentui/react-components`

## Overview

Search navigation enables users to find content quickly through text-based queries. This includes simple search boxes, command palettes, typeahead search, and filtered navigation patterns.

## Basic Imports

```typescript
import {
  SearchBox,
  Input,
  Combobox,
  Option,
  makeStyles,
  tokens,
  Text,
  Button,
  Spinner,
} from '@fluentui/react-components';
import {
  SearchRegular,
  DismissRegular,
  DocumentRegular,
  PersonRegular,
  SettingsRegular,
  ArrowRightRegular,
} from '@fluentui/react-icons';
```

## Basic Search Box

```tsx
const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  searchBox: {
    maxWidth: '400px',
  },
});

function BasicSearch() {
  const styles = useStyles();
  const [query, setQuery] = useState('');

  const handleSearch = (value: string) => {
    setQuery(value);
    // Perform search
    console.log('Searching for:', value);
  };

  return (
    <div className={styles.container}>
      <SearchBox
        className={styles.searchBox}
        placeholder="Search..."
        value={query}
        onChange={(_, data) => handleSearch(data.value)}
        contentAfter={query && (
          <Button
            icon={<DismissRegular />}
            appearance="subtle"
            size="small"
            onClick={() => setQuery('')}
            aria-label="Clear search"
          />
        )}
      />
    </div>
  );
}
```

## Search with Debounce

```tsx
import { useCallback, useEffect, useRef } from 'react';

/**
 * Hook for debouncing values
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

interface DebouncedSearchProps {
  onSearch: (query: string) => void;
  debounceMs?: number;
  placeholder?: string;
}

function DebouncedSearch({
  onSearch,
  debounceMs = 300,
  placeholder = 'Search...',
}: DebouncedSearchProps) {
  const styles = useStyles();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, debounceMs);

  useEffect(() => {
    if (debouncedQuery) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  return (
    <SearchBox
      className={styles.searchBox}
      placeholder={placeholder}
      value={query}
      onChange={(_, data) => setQuery(data.value)}
    />
  );
}
```

## Typeahead Search with Results

```tsx
const useTypeaheadStyles = makeStyles({
  container: {
    position: 'relative',
    maxWidth: '400px',
  },
  results: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: tokens.spacingVerticalXS,
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow16,
    maxHeight: '300px',
    overflowY: 'auto',
    zIndex: 1000,
  },
  resultItem: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    cursor: 'pointer',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  resultItemSelected: {
    backgroundColor: tokens.colorNeutralBackground1Selected,
  },
  resultIcon: {
    color: tokens.colorNeutralForeground3,
  },
  resultText: {
    flex: 1,
  },
  resultType: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  noResults: {
    padding: tokens.spacingHorizontalM,
    color: tokens.colorNeutralForeground3,
    textAlign: 'center',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    padding: tokens.spacingHorizontalM,
  },
});

interface SearchResult {
  id: string;
  title: string;
  type: 'document' | 'person' | 'setting';
  href?: string;
}

interface TypeaheadSearchProps {
  onSelect: (result: SearchResult) => void;
  searchFn: (query: string) => Promise<SearchResult[]>;
}

function TypeaheadSearch({ onSelect, searchFn }: TypeaheadSearchProps) {
  const styles = useTypeaheadStyles();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      setIsLoading(true);
      searchFn(debouncedQuery)
        .then((results) => {
          setResults(results);
          setIsOpen(true);
          setSelectedIndex(-1);
        })
        .finally(() => setIsLoading(false));
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [debouncedQuery, searchFn]);

  const getIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'document':
        return <DocumentRegular className={styles.resultIcon} />;
      case 'person':
        return <PersonRegular className={styles.resultIcon} />;
      case 'setting':
        return <SettingsRegular className={styles.resultIcon} />;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          onSelect(results[selectedIndex]);
          setIsOpen(false);
          setQuery('');
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.container} ref={containerRef}>
      <SearchBox
        placeholder="Search documents, people, settings..."
        value={query}
        onChange={(_, data) => setQuery(data.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => results.length > 0 && setIsOpen(true)}
      />

      {isOpen && (
        <div className={styles.results} role="listbox">
          {isLoading ? (
            <div className={styles.loading}>
              <Spinner size="small" />
            </div>
          ) : results.length > 0 ? (
            results.map((result, index) => (
              <div
                key={result.id}
                className={`${styles.resultItem} ${
                  index === selectedIndex ? styles.resultItemSelected : ''
                }`}
                role="option"
                aria-selected={index === selectedIndex}
                onClick={() => {
                  onSelect(result);
                  setIsOpen(false);
                  setQuery('');
                }}
              >
                {getIcon(result.type)}
                <div className={styles.resultText}>
                  <Text>{result.title}</Text>
                </div>
                <span className={styles.resultType}>{result.type}</span>
              </div>
            ))
          ) : (
            <div className={styles.noResults}>No results found</div>
          )}
        </div>
      )}
    </div>
  );
}
```

## Command Palette

A Spotlight/VS Code style command palette:

```tsx
import { Dialog, DialogSurface, DialogBody, DialogContent } from '@fluentui/react-components';

const useCommandPaletteStyles = makeStyles({
  surface: {
    maxWidth: '600px',
    width: '100%',
    padding: 0,
    overflow: 'hidden',
  },
  searchContainer: {
    padding: tokens.spacingHorizontalM,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  searchInput: {
    width: '100%',
  },
  results: {
    maxHeight: '400px',
    overflowY: 'auto',
  },
  section: {
    padding: tokens.spacingVerticalXS,
  },
  sectionHeader: {
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalM}`,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    cursor: 'pointer',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  itemSelected: {
    backgroundColor: tokens.colorNeutralBackground1Selected,
  },
  itemIcon: {
    color: tokens.colorNeutralForeground3,
    fontSize: '20px',
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    display: 'block',
  },
  itemDescription: {
    display: 'block',
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  shortcut: {
    display: 'flex',
    gap: tokens.spacingHorizontalXS,
  },
  kbd: {
    padding: `${tokens.spacingVerticalXXS} ${tokens.spacingHorizontalS}`,
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusSmall,
    fontSize: tokens.fontSizeBase100,
    fontFamily: 'monospace',
  },
});

interface CommandItem {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactElement;
  shortcut?: string[];
  section?: string;
  onSelect: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commands: CommandItem[];
  placeholder?: string;
}

function CommandPalette({
  open,
  onOpenChange,
  commands,
  placeholder = 'Type a command or search...',
}: CommandPaletteProps) {
  const styles = useCommandPaletteStyles();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter commands based on query
  const filteredCommands = useMemo(() => {
    if (!query) return commands;
    const lowerQuery = query.toLowerCase();
    return commands.filter(
      (cmd) =>
        cmd.title.toLowerCase().includes(lowerQuery) ||
        cmd.description?.toLowerCase().includes(lowerQuery)
    );
  }, [commands, query]);

  // Group by section
  const groupedCommands = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    filteredCommands.forEach((cmd) => {
      const section = cmd.section || 'Commands';
      if (!groups[section]) groups[section] = [];
      groups[section].push(cmd);
    });
    return groups;
  }, [filteredCommands]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].onSelect();
          onOpenChange(false);
        }
        break;
      case 'Escape':
        onOpenChange(false);
        break;
    }
  };

  let flatIndex = 0;

  return (
    <Dialog open={open} onOpenChange={(_, data) => onOpenChange(data.open)}>
      <DialogSurface className={styles.surface}>
        <DialogBody>
          <div className={styles.searchContainer}>
            <Input
              ref={inputRef}
              className={styles.searchInput}
              placeholder={placeholder}
              value={query}
              onChange={(_, data) => setQuery(data.value)}
              onKeyDown={handleKeyDown}
              contentBefore={<SearchRegular />}
            />
          </div>

          <div className={styles.results}>
            {Object.entries(groupedCommands).map(([section, items]) => (
              <div key={section} className={styles.section}>
                <div className={styles.sectionHeader}>{section}</div>
                {items.map((item) => {
                  const itemIndex = flatIndex++;
                  return (
                    <div
                      key={item.id}
                      className={`${styles.item} ${
                        itemIndex === selectedIndex ? styles.itemSelected : ''
                      }`}
                      onClick={() => {
                        item.onSelect();
                        onOpenChange(false);
                      }}
                    >
                      {item.icon && <span className={styles.itemIcon}>{item.icon}</span>}
                      <div className={styles.itemContent}>
                        <Text className={styles.itemTitle}>{item.title}</Text>
                        {item.description && (
                          <Text className={styles.itemDescription}>{item.description}</Text>
                        )}
                      </div>
                      {item.shortcut && (
                        <div className={styles.shortcut}>
                          {item.shortcut.map((key, i) => (
                            <kbd key={i} className={styles.kbd}>{key}</kbd>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

            {filteredCommands.length === 0 && (
              <div style={{ padding: tokens.spacingHorizontalL, textAlign: 'center' }}>
                <Text style={{ color: tokens.colorNeutralForeground3 }}>
                  No commands found
                </Text>
              </div>
            )}
          </div>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

// Usage with keyboard shortcut
function AppWithCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const commands: CommandItem[] = [
    {
      id: 'new-doc',
      title: 'New Document',
      description: 'Create a new document',
      icon: <DocumentRegular />,
      shortcut: ['⌘', 'N'],
      section: 'Actions',
      onSelect: () => console.log('New document'),
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Open application settings',
      icon: <SettingsRegular />,
      shortcut: ['⌘', ','],
      section: 'Navigation',
      onSelect: () => console.log('Settings'),
    },
  ];

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Open Command Palette (⌘K)
      </Button>
      <CommandPalette
        open={isOpen}
        onOpenChange={setIsOpen}
        commands={commands}
      />
    </>
  );
}
```

## Search with Filters

```tsx
import { Checkbox, Dropdown, Option } from '@fluentui/react-components';

const useFilteredSearchStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  filterRow: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    flexWrap: 'wrap',
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  activeFilters: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'wrap',
  },
  filterTag: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    padding: `${tokens.spacingVerticalXXS} ${tokens.spacingHorizontalS}`,
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusMedium,
    fontSize: tokens.fontSizeBase200,
  },
});

interface SearchFilters {
  types: string[];
  dateRange: string;
  sortBy: string;
}

interface FilteredSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void;
}

function FilteredSearch({ onSearch }: FilteredSearchProps) {
  const styles = useFilteredSearchStyles();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    types: [],
    dateRange: 'all',
    sortBy: 'relevance',
  });

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    onSearch(debouncedQuery, filters);
  }, [debouncedQuery, filters, onSearch]);

  const toggleType = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type],
    }));
  };

  const clearFilters = () => {
    setFilters({ types: [], dateRange: 'all', sortBy: 'relevance' });
  };

  const hasActiveFilters = filters.types.length > 0 || filters.dateRange !== 'all';

  return (
    <div className={styles.container}>
      <SearchBox
        placeholder="Search..."
        value={query}
        onChange={(_, data) => setQuery(data.value)}
      />

      <div className={styles.filterRow}>
        {/* Type filters */}
        <div className={styles.filterGroup}>
          <Text weight="semibold">Type:</Text>
          <Checkbox
            label="Documents"
            checked={filters.types.includes('document')}
            onChange={() => toggleType('document')}
          />
          <Checkbox
            label="People"
            checked={filters.types.includes('person')}
            onChange={() => toggleType('person')}
          />
          <Checkbox
            label="Settings"
            checked={filters.types.includes('setting')}
            onChange={() => toggleType('setting')}
          />
        </div>

        {/* Date range */}
        <div className={styles.filterGroup}>
          <Text weight="semibold">Date:</Text>
          <Dropdown
            value={filters.dateRange}
            onOptionSelect={(_, data) =>
              setFilters((prev) => ({ ...prev, dateRange: data.optionValue as string }))
            }
            style={{ minWidth: '120px' }}
          >
            <Option value="all">Any time</Option>
            <Option value="today">Today</Option>
            <Option value="week">This week</Option>
            <Option value="month">This month</Option>
            <Option value="year">This year</Option>
          </Dropdown>
        </div>

        {/* Sort */}
        <div className={styles.filterGroup}>
          <Text weight="semibold">Sort:</Text>
          <Dropdown
            value={filters.sortBy}
            onOptionSelect={(_, data) =>
              setFilters((prev) => ({ ...prev, sortBy: data.optionValue as string }))
            }
            style={{ minWidth: '120px' }}
          >
            <Option value="relevance">Relevance</Option>
            <Option value="date">Date</Option>
            <Option value="name">Name</Option>
          </Dropdown>
        </div>

        {hasActiveFilters && (
          <Button appearance="subtle" size="small" onClick={clearFilters}>
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
```

## useSearch Hook

```typescript
import { useState, useCallback, useEffect } from 'react';

interface UseSearchOptions<T> {
  searchFn: (query: string) => Promise<T[]>;
  debounceMs?: number;
  minQueryLength?: number;
}

interface UseSearchReturn<T> {
  query: string;
  setQuery: (query: string) => void;
  results: T[];
  isLoading: boolean;
  error: Error | null;
  clear: () => void;
}

/**
 * Hook for managing search state with debouncing
 */
export function useSearch<T>(options: UseSearchOptions<T>): UseSearchReturn<T> {
  const { searchFn, debounceMs = 300, minQueryLength = 2 } = options;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const debouncedQuery = useDebounce(query, debounceMs);

  useEffect(() => {
    if (debouncedQuery.length < minQueryLength) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    searchFn(debouncedQuery)
      .then(setResults)
      .catch((err) => setError(err instanceof Error ? err : new Error('Search failed')))
      .finally(() => setIsLoading(false));
  }, [debouncedQuery, searchFn, minQueryLength]);

  const clear = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
  }, []);

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
    clear,
  };
}

// Usage
function SearchWithHook() {
  const { query, setQuery, results, isLoading } = useSearch({
    searchFn: async (q) => {
      const response = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      return response.json();
    },
  });

  return (
    <div>
      <SearchBox value={query} onChange={(_, data) => setQuery(data.value)} />
      {isLoading && <Spinner />}
      {results.map((item) => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
}
```

## Accessibility Checklist

- [x] Search input has proper `role="searchbox"` or label
- [x] Results list uses `role="listbox"` with `role="option"` items
- [x] Keyboard navigation (Arrow keys, Enter, Escape)
- [x] Screen reader announces result count
- [x] Loading state is announced
- [x] Clear button is accessible
- [x] Focus management when results appear/disappear

## Best Practices

1. **Debounce Input**: Prevent excessive API calls
2. **Minimum Query Length**: Require 2-3 characters before searching
3. **Show Loading State**: Indicate when search is in progress
4. **Keyboard Support**: Arrow keys to navigate, Enter to select
5. **Recent Searches**: Consider showing recent/popular searches
6. **Clear Feedback**: Show "No results" when appropriate
7. **Escape to Close**: Allow users to dismiss search results

## Related Documentation

- [05-pagination-patterns.md](05-pagination-patterns.md) - Paginating search results
- [Data Fetching](../data/04-data-fetching.md) - API integration patterns
- [Combobox](../../02-components/forms/combobox.md) - For autocomplete patterns