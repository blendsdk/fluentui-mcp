# Quick Reference: Common Patterns

> **Parent**: [Quick Reference Index](00-quick-ref-index.md)

## Form Pattern

```typescript
import * as React from 'react';
import {
  Button, Field, Input, Textarea, Select, Checkbox,
  makeStyles, tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  form: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalM, maxWidth: '480px' },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: tokens.spacingHorizontalS },
});

export const BasicForm: React.FC = () => {
  const styles = useStyles();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // form logic
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Field label="Name" required>
        <Input />
      </Field>
      <Field label="Email" required validationMessage="Enter a valid email" validationState="error">
        <Input type="email" />
      </Field>
      <Field label="Role">
        <Select>
          <option>Developer</option>
          <option>Designer</option>
          <option>Manager</option>
        </Select>
      </Field>
      <Field label="Notes">
        <Textarea resize="vertical" />
      </Field>
      <Checkbox label="I agree to the terms" />
      <div className={styles.actions}>
        <Button appearance="secondary">Cancel</Button>
        <Button appearance="primary" type="submit">Submit</Button>
      </div>
    </form>
  );
};
```

---

## Controlled vs Uncontrolled

```typescript
// Uncontrolled (simpler — FluentUI manages state)
<Input defaultValue="initial" />
<Checkbox defaultChecked />
<Select defaultValue="option1">...</Select>

// Controlled (you manage state)
const [value, setValue] = React.useState('');
<Input value={value} onChange={(e, data) => setValue(data.value)} />

const [checked, setChecked] = React.useState(false);
<Checkbox checked={checked} onChange={(e, data) => setChecked(data.checked)} />
```

---

## Data Table with Sorting & Selection

```typescript
import {
  DataGrid, DataGridHeader, DataGridRow, DataGridHeaderCell,
  DataGridBody, DataGridCell, TableColumnDefinition,
  createTableColumn, TableCellLayout,
} from '@fluentui/react-components';

type Item = { name: string; status: string; date: string };

const columns: TableColumnDefinition<Item>[] = [
  createTableColumn<Item>({
    columnId: 'name',
    compare: (a, b) => a.name.localeCompare(b.name),
    renderHeaderCell: () => 'Name',
    renderCell: (item) => <TableCellLayout>{item.name}</TableCellLayout>,
  }),
  createTableColumn<Item>({
    columnId: 'status',
    renderHeaderCell: () => 'Status',
    renderCell: (item) => item.status,
  }),
];

<DataGrid items={items} columns={columns} sortable selectionMode="multiselect">
  <DataGridHeader>
    <DataGridRow>
      {({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}
    </DataGridRow>
  </DataGridHeader>
  <DataGridBody<Item>>
    {({ item, rowId }) => (
      <DataGridRow<Item> key={rowId}>
        {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
      </DataGridRow>
    )}
  </DataGridBody>
</DataGrid>
```

---

## Dialog (Modal) Pattern

```typescript
import {
  Dialog, DialogTrigger, DialogSurface, DialogTitle,
  DialogBody, DialogContent, DialogActions, Button,
} from '@fluentui/react-components';

// Alert dialog (non-dismissable)
<Dialog modalType="alert">
  <DialogTrigger><Button>Delete</Button></DialogTrigger>
  <DialogSurface>
    <DialogBody>
      <DialogTitle>Delete item?</DialogTitle>
      <DialogContent>This cannot be undone.</DialogContent>
      <DialogActions>
        <DialogTrigger><Button appearance="secondary">Cancel</Button></DialogTrigger>
        <Button appearance="primary" onClick={onConfirm}>Delete</Button>
      </DialogActions>
    </DialogBody>
  </DialogSurface>
</Dialog>

// Controlled dialog
const [open, setOpen] = React.useState(false);
<Dialog open={open} onOpenChange={(e, data) => setOpen(data.open)}>
  <DialogSurface>...</DialogSurface>
</Dialog>
```

---

## Toast Pattern

```typescript
import {
  Toaster, useToastController, useId,
  Toast, ToastTitle, ToastBody,
} from '@fluentui/react-components';

const MyComponent: React.FC = () => {
  const toasterId = useId('toaster');
  const { dispatchToast } = useToastController(toasterId);

  const showSuccess = () => dispatchToast(
    <Toast><ToastTitle>Saved!</ToastTitle></Toast>,
    { intent: 'success', position: 'bottom-end', timeout: 3000 },
  );

  const showError = () => dispatchToast(
    <Toast>
      <ToastTitle>Error</ToastTitle>
      <ToastBody>Something went wrong.</ToastBody>
    </Toast>,
    { intent: 'error', position: 'bottom-end' },
  );

  return (
    <>
      <Toaster toasterId={toasterId} />
      <Button onClick={showSuccess}>Save</Button>
    </>
  );
};
```

---

## Loading States Pattern

```typescript
import { Spinner, Skeleton, SkeletonItem, makeStyles, tokens } from '@fluentui/react-components';

// Spinner for async operations
{isLoading ? <Spinner label="Loading..." /> : <Content />}

// Skeleton for content placeholders
const useStyles = makeStyles({
  skeleton: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalS },
});

{isLoading ? (
  <div className={styles.skeleton}>
    <SkeletonItem shape="rectangle" style={{ width: '100%', height: '20px' }} />
    <SkeletonItem shape="rectangle" style={{ width: '75%', height: '20px' }} />
    <SkeletonItem shape="rectangle" style={{ width: '50%', height: '20px' }} />
  </div>
) : <Content />}
```

---

## Error / Empty States

```typescript
import { MessageBar, MessageBarBody, MessageBarTitle, MessageBarActions, Button } from '@fluentui/react-components';

// Error message
<MessageBar intent="error">
  <MessageBarBody>
    <MessageBarTitle>Error</MessageBarTitle>
    Failed to load data. Please try again.
  </MessageBarBody>
  <MessageBarActions>
    <Button onClick={retry}>Retry</Button>
  </MessageBarActions>
</MessageBar>

// Empty state (custom)
<div style={{ textAlign: 'center', padding: '48px' }}>
  <Text size={500} weight="semibold" block>No items found</Text>
  <Text size={300} block>Try adjusting your filters</Text>
  <Button appearance="primary" style={{ marginTop: '16px' }}>Create Item</Button>
</div>
```

---

## Navigation Sidebar Pattern

```typescript
import {
  NavDrawer, NavDrawerBody, NavDrawerHeader,
  Nav, NavItem, NavCategory, NavCategoryItem, NavSubItem,
  Hamburger,
} from '@fluentui/react-nav';

<NavDrawer open={isOpen} type="inline" size="medium">
  <NavDrawerHeader>
    <Hamburger onClick={() => setIsOpen((o) => !o)} />
  </NavDrawerHeader>
  <NavDrawerBody>
    <Nav selectedValue={currentPage} onNavItemSelect={(e, data) => navigate(data.value)}>
      <NavItem value="home">Home</NavItem>
      <NavItem value="dashboard">Dashboard</NavItem>
      <NavCategory value="settings">
        <NavCategoryItem>Settings</NavCategoryItem>
        <NavSubItem value="profile">Profile</NavSubItem>
        <NavSubItem value="security">Security</NavSubItem>
      </NavCategory>
    </Nav>
  </NavDrawerBody>
</NavDrawer>
```

---

## Drawer (Side Panel) Pattern

```typescript
import {
  Drawer, DrawerHeader, DrawerHeaderTitle, DrawerBody,
  Button,
} from '@fluentui/react-components';
import { DismissRegular } from '@fluentui/react-icons';

<Drawer open={isOpen} onOpenChange={(e, { open }) => setIsOpen(open)} position="end" size="medium">
  <DrawerHeader>
    <DrawerHeaderTitle
      action={<Button appearance="subtle" icon={<DismissRegular />} onClick={() => setIsOpen(false)} />}
    >
      Details
    </DrawerHeaderTitle>
  </DrawerHeader>
  <DrawerBody>
    <p>Drawer content here</p>
  </DrawerBody>
</Drawer>
```

---

## Popover Pattern

```typescript
import { Popover, PopoverTrigger, PopoverSurface, Button } from '@fluentui/react-components';

<Popover>
  <PopoverTrigger>
    <Button>Show info</Button>
  </PopoverTrigger>
  <PopoverSurface>
    <p>Popover content</p>
  </PopoverSurface>
</Popover>

// Controlled
<Popover open={open} onOpenChange={(e, data) => setOpen(data.open)}>
  ...
</Popover>
```

---

## Overflow Menu Pattern

```typescript
import {
  Overflow, OverflowItem, useIsOverflowItemVisible, useOverflowMenu,
  Button, Menu, MenuTrigger, MenuPopover, MenuList, MenuItem,
} from '@fluentui/react-components';

const OverflowMenu: React.FC<{ items: string[] }> = ({ items }) => {
  const { ref, isOverflowing } = useOverflowMenu<HTMLButtonElement>();

  if (!isOverflowing) return null;

  return (
    <Menu>
      <MenuTrigger>
        <Button ref={ref} appearance="subtle">More</Button>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          {items.map((item) => (
            <OverflowMenuItem key={item} id={item} />
          ))}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};

// In parent:
<Overflow>
  {items.map((item) => (
    <OverflowItem key={item} id={item}>
      <Button>{item}</Button>
    </OverflowItem>
  ))}
  <OverflowMenu items={items} />
</Overflow>
```

---

## See Also

- [Patterns Deep Dive](../03-patterns/) — Detailed pattern guides
- [Component Cheatsheet](02-component-cheatsheet.md) — Component selection
- [Enterprise Patterns](../04-enterprise/) — Production-ready examples
