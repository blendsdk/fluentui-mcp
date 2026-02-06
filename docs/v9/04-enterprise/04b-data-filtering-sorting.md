# Data-Heavy Apps: Filtering & Sorting

> **Module**: 04-enterprise
> **FluentUI Version**: 9.x
> **Last Updated**: 2026-06-02

## Overview

Enterprise data views need powerful filtering and sorting: text search, multi-select filters, date ranges, column sorting, and saved filter presets. This guide covers building a complete filter toolbar, server-side vs client-side filtering, and advanced compound filter patterns using FluentUI v9 components.

---

## Filter Toolbar

```tsx
import * as React from 'react';
import {
  SearchBox,
  Select,
  Combobox,
  Option,
  Button,
  Badge,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { FilterRegular, DismissRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  toolbar: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    padding: `${tokens.spacingVerticalS} 0`,
  },
  activeFilters: {
    display: 'flex',
    gap: tokens.spacingHorizontalXS,
    flexWrap: 'wrap',
  },
});

interface FilterState {
  search: string;
  status: string;
  category: string;
  dateRange: string;
}

interface FilterToolbarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClearAll: () => void;
}

/**
 * FilterToolbar — Row of filter controls above a data table.
 *
 * Combines SearchBox, Select dropdowns, and active filter badges.
 * Active filters show as dismissible badges below the controls.
 */
export function FilterToolbar({ filters, onFilterChange, onClearAll }: FilterToolbarProps) {
  const styles = useStyles();

  const update = (key: keyof FilterState, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <div>
      <div className={styles.toolbar}>
        <SearchBox
          placeholder="Search..."
          size="small"
          value={filters.search}
          onChange={(e, data) => update('search', data.value)}
          style={{ minWidth: '200px' }}
        />
        <Select
          size="small"
          value={filters.status}
          onChange={(e, data) => update('status', data.value)}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="closed">Closed</option>
        </Select>
        <Select
          size="small"
          value={filters.category}
          onChange={(e, data) => update('category', data.value)}
        >
          <option value="">All Categories</option>
          <option value="sales">Sales</option>
          <option value="support">Support</option>
          <option value="billing">Billing</option>
        </Select>
        <Select
          size="small"
          value={filters.dateRange}
          onChange={(e, data) => update('dateRange', data.value)}
        >
          <option value="">All Time</option>
          <option value="today">Today</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </Select>

        {activeCount > 0 && (
          <Button
            appearance="subtle"
            size="small"
            icon={<DismissRegular />}
            onClick={onClearAll}
          >
            Clear all ({activeCount})
          </Button>
        )}
      </div>

      {/* Active filter badges */}
      {activeCount > 0 && (
        <div className={styles.activeFilters}>
          {filters.search && (
            <Badge appearance="outline" size="small">
              Search: &quot;{filters.search}&quot;
              <Button
                appearance="transparent"
                size="small"
                icon={<DismissRegular fontSize={10} />}
                onClick={() => update('search', '')}
                aria-label="Clear search"
              />
            </Badge>
          )}
          {filters.status && (
            <Badge appearance="outline" size="small">
              Status: {filters.status}
              <Button
                appearance="transparent"
                size="small"
                icon={<DismissRegular fontSize={10} />}
                onClick={() => update('status', '')}
                aria-label="Clear status filter"
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## Multi-Select Filter with Combobox

```tsx
import * as React from 'react';
import {
  Combobox,
  Option,
  useComboboxFilter,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  filter: {
    minWidth: '200px',
  },
});

interface MultiSelectFilterProps {
  label: string;
  options: Array<{ value: string; label: string }>;
  selected: string[];
  onChange: (selected: string[]) => void;
}

/**
 * MultiSelectFilter — Combobox that allows selecting multiple filter values.
 *
 * Uses multiselect mode so users can pick several options at once.
 * Shows selected count in the trigger text.
 */
export function MultiSelectFilter({
  label,
  options,
  selected,
  onChange,
}: MultiSelectFilterProps) {
  const styles = useStyles();

  const displayText = selected.length === 0
    ? label
    : `${label} (${selected.length})`;

  return (
    <Combobox
      className={styles.filter}
      multiselect
      placeholder={displayText}
      selectedOptions={selected}
      onOptionSelect={(e, data) => {
        onChange(data.selectedOptions);
      }}
      size="small"
    >
      {options.map((opt) => (
        <Option key={opt.value} value={opt.value}>
          {opt.label}
        </Option>
      ))}
    </Combobox>
  );
}

// Usage:
function TagFilter() {
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const tagOptions = [
    { value: 'urgent', label: 'Urgent' },
    { value: 'bug', label: 'Bug' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'docs', label: 'Documentation' },
  ];

  return (
    <MultiSelectFilter
      label="Tags"
      options={tagOptions}
      selected={selectedTags}
      onChange={setSelectedTags}
    />
  );
}
```

---

## Client-Side Filter Hook

```tsx
import * as React from 'react';

interface UseFilterOptions<T> {
  items: T[];
  /** Map of filter keys to filter functions */
  filterFns: Record<string, (item: T, value: string) => boolean>;
  /** Current active filter values */
  activeFilters: Record<string, string>;
}

/**
 * useClientFilter — Applies multiple filters to a dataset client-side.
 *
 * Memoizes the filtered result so it only recalculates when
 * items or active filters change.
 */
export function useClientFilter<T>({
  items,
  filterFns,
  activeFilters,
}: UseFilterOptions<T>): T[] {
  return React.useMemo(() => {
    return items.filter((item) => {
      return Object.entries(activeFilters).every(([key, value]) => {
        if (!value) return true; // empty filter = no filtering
        const fn = filterFns[key];
        return fn ? fn(item, value) : true;
      });
    });
  }, [items, filterFns, activeFilters]);
}

// Usage:
interface Ticket {
  id: string;
  title: string;
  status: string;
  category: string;
  assignee: string;
}

function TicketList({ tickets }: { tickets: Ticket[] }) {
  const [filters, setFilters] = React.useState({ search: '', status: '', category: '' });

  const filterFns = React.useMemo(() => ({
    search: (item: Ticket, value: string) =>
      item.title.toLowerCase().includes(value.toLowerCase()),
    status: (item: Ticket, value: string) => item.status === value,
    category: (item: Ticket, value: string) => item.category === value,
  }), []);

  const filtered = useClientFilter({ items: tickets, filterFns, activeFilters: filters });

  return (
    <>
      <FilterToolbar
        filters={filters}
        onFilterChange={setFilters}
        onClearAll={() => setFilters({ search: '', status: '', category: '' })}
      />
      <TicketTable items={filtered} />
    </>
  );
}
```

---

## Server-Side Filtering

```tsx
import * as React from 'react';

interface ServerFilterParams {
  search?: string;
  status?: string;
  category?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

/**
 * useServerFilter — Debounced server-side filter/sort/paginate.
 *
 * Builds a query string from filter state and fetches from the API.
 * Debounces the search input to avoid excessive requests.
 */
function useServerFilter(baseUrl: string) {
  const [params, setParams] = React.useState<ServerFilterParams>({
    page: 1,
    limit: 25,
  });
  const [data, setData] = React.useState<{ items: unknown[]; total: number }>({
    items: [],
    total: 0,
  });
  const [isLoading, setIsLoading] = React.useState(false);

  // Debounce search input
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(params.search ?? ''), 300);
    return () => clearTimeout(timer);
  }, [params.search]);

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const query = new URLSearchParams();
      if (debouncedSearch) query.set('search', debouncedSearch);
      if (params.status) query.set('status', params.status);
      if (params.category) query.set('category', params.category);
      if (params.sortBy) query.set('sortBy', params.sortBy);
      if (params.sortDir) query.set('sortDir', params.sortDir);
      query.set('page', String(params.page ?? 1));
      query.set('limit', String(params.limit ?? 25));

      const response = await fetch(`${baseUrl}?${query}`);
      const result = await response.json();
      setData(result);
      setIsLoading(false);
    };

    fetchData();
  }, [baseUrl, debouncedSearch, params.status, params.category, params.sortBy, params.sortDir, params.page, params.limit]);

  return { data, isLoading, params, setParams };
}
```

---

## Saved Filter Presets

```tsx
import * as React from 'react';
import {
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  MenuDivider,
  Button,
  Text,
} from '@fluentui/react-components';
import { BookmarkRegular, SaveRegular } from '@fluentui/react-icons';

interface FilterPreset {
  name: string;
  filters: Record<string, string>;
}

interface FilterPresetsProps {
  presets: FilterPreset[];
  onApply: (filters: Record<string, string>) => void;
  onSave: (name: string) => void;
}

/**
 * FilterPresets — Menu with saved filter configurations.
 *
 * Users can save the current filter state and quickly
 * switch between frequently used filter combinations.
 */
export function FilterPresets({ presets, onApply, onSave }: FilterPresetsProps) {
  return (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <Button icon={<BookmarkRegular />} appearance="subtle" size="small">
          Presets
        </Button>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          {presets.map((preset) => (
            <MenuItem key={preset.name} onClick={() => onApply(preset.filters)}>
              {preset.name}
            </MenuItem>
          ))}
          {presets.length > 0 && <MenuDivider />}
          <MenuItem
            icon={<SaveRegular />}
            onClick={() => {
              const name = prompt('Preset name:');
              if (name) onSave(name);
            }}
          >
            Save Current Filters
          </MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  );
}
```

---

## Best Practices

### ✅ Do

- **Debounce search input** (300ms) to avoid filtering on every keystroke
- **Show active filter count** and dismissible badges so users know what's active
- **Provide "Clear all" button** to reset all filters at once
- **Use server-side filtering** for datasets over ~5,000 rows
- **Persist filter state** in URL query params for shareable links

### ❌ Don't

- **Don't filter on every keystroke** without debouncing — causes UI jank
- **Don't hide active filters** — always show what's currently applied
- **Don't use client-side filtering for huge datasets** — use server-side with pagination
- **Don't forget empty state** — show "No results match your filters" with a clear button

---

## Related Documentation

- [Data Virtualization](04a-data-virtualization.md) — Virtualization for large datasets
- [Data Export & Import](04c-data-export-import.md) — Bulk data operations
- [Search Navigation](../03-patterns/navigation/06-search-navigation.md) — Search patterns
- [Combobox Component](../02-components/forms/combobox.md) — Combobox API reference
