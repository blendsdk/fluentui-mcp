# Admin Interface: User Management

> **Module**: 04-enterprise
> **FluentUI Version**: 9.x
> **Last Updated**: 2026-06-02

## Overview

User management is a core admin feature: listing users, assigning roles, managing permissions, and handling invitations. This guide shows how to build user list views, role assignment dialogs, invitation forms, and permission matrices using FluentUI v9 components.

---

## User List Table

```tsx
import * as React from 'react';
import {
  DataGrid,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridBody,
  DataGridRow,
  DataGridCell,
  TableColumnDefinition,
  createTableColumn,
  Avatar,
  Badge,
  Text,
  Button,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { MoreHorizontalRegular } from '@fluentui/react-icons';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'invited' | 'disabled';
  lastLogin?: string;
}

const roleBadge: Record<User['role'], { color: 'brand' | 'informative' | 'subtle'; label: string }> = {
  admin: { color: 'brand', label: 'Admin' },
  editor: { color: 'informative', label: 'Editor' },
  viewer: { color: 'subtle', label: 'Viewer' },
};

const statusBadge: Record<User['status'], { color: 'success' | 'warning' | 'danger'; label: string }> = {
  active: { color: 'success', label: 'Active' },
  invited: { color: 'warning', label: 'Invited' },
  disabled: { color: 'danger', label: 'Disabled' },
};

interface UserListProps {
  users: User[];
  onEditRole: (user: User) => void;
  onDisable: (user: User) => void;
  onResendInvite: (user: User) => void;
  onRemove: (user: User) => void;
}

/**
 * UserListTable — DataGrid for managing users with role and status columns.
 *
 * Each row shows avatar + name, email, role badge, status badge,
 * last login timestamp, and an actions overflow menu.
 */
export function UserListTable({
  users,
  onEditRole,
  onDisable,
  onResendInvite,
  onRemove,
}: UserListProps) {
  const columns: TableColumnDefinition<User>[] = [
    createTableColumn<User>({
      columnId: 'user',
      renderHeaderCell: () => 'User',
      renderCell: (item) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar name={item.name} image={{ src: item.avatar }} size={28} />
          <div>
            <Text weight="semibold" size={200}>{item.name}</Text>
            <br />
            <Text size={100} style={{ color: tokens.colorNeutralForeground3 }}>
              {item.email}
            </Text>
          </div>
        </div>
      ),
      compare: (a, b) => a.name.localeCompare(b.name),
    }),
    createTableColumn<User>({
      columnId: 'role',
      renderHeaderCell: () => 'Role',
      renderCell: (item) => {
        const badge = roleBadge[item.role];
        return <Badge color={badge.color} appearance="outline">{badge.label}</Badge>;
      },
    }),
    createTableColumn<User>({
      columnId: 'status',
      renderHeaderCell: () => 'Status',
      renderCell: (item) => {
        const badge = statusBadge[item.status];
        return <Badge color={badge.color} appearance="filled">{badge.label}</Badge>;
      },
    }),
    createTableColumn<User>({
      columnId: 'lastLogin',
      renderHeaderCell: () => 'Last Login',
      renderCell: (item) => (
        <Text size={200}>{item.lastLogin ?? 'Never'}</Text>
      ),
    }),
    createTableColumn<User>({
      columnId: 'actions',
      renderHeaderCell: () => '',
      renderCell: (item) => (
        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <Button
              icon={<MoreHorizontalRegular />}
              appearance="subtle"
              size="small"
              aria-label={`Actions for ${item.name}`}
            />
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              <MenuItem onClick={() => onEditRole(item)}>Change Role</MenuItem>
              {item.status === 'invited' && (
                <MenuItem onClick={() => onResendInvite(item)}>Resend Invite</MenuItem>
              )}
              <MenuItem onClick={() => onDisable(item)}>
                {item.status === 'disabled' ? 'Enable' : 'Disable'}
              </MenuItem>
              <MenuItem onClick={() => onRemove(item)}>Remove</MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
      ),
    }),
  ];

  return (
    <DataGrid
      items={users}
      columns={columns}
      getRowId={(item) => item.id}
      sortable
      selectionMode="multiselect"
    >
      <DataGridHeader>
        <DataGridRow>
          {({ renderHeaderCell }) => (
            <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
          )}
        </DataGridRow>
      </DataGridHeader>
      <DataGridBody<User>>
        {({ item, rowId }) => (
          <DataGridRow<User> key={rowId}>
            {({ renderCell }) => (
              <DataGridCell>{renderCell(item)}</DataGridCell>
            )}
          </DataGridRow>
        )}
      </DataGridBody>
    </DataGrid>
  );
}
```

---

## Invite User Dialog

```tsx
import * as React from 'react';
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogContent,
  DialogActions,
  Button,
  Input,
  Select,
  Field,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
});

interface InviteUserDialogProps {
  open: boolean;
  onSubmit: (email: string, role: string) => void;
  onCancel: () => void;
}

/**
 * InviteUserDialog — Form dialog for inviting a new user.
 *
 * Collects email and role, then dispatches an invitation.
 */
export function InviteUserDialog({ open, onSubmit, onCancel }: InviteUserDialogProps) {
  const styles = useStyles();
  const [email, setEmail] = React.useState('');
  const [role, setRole] = React.useState('viewer');

  const handleSubmit = () => {
    onSubmit(email, role);
    setEmail('');
    setRole('viewer');
  };

  return (
    <Dialog open={open} onOpenChange={(e, data) => !data.open && onCancel()}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Invite User</DialogTitle>
          <DialogContent>
            <div className={styles.form}>
              <Field label="Email address" required>
                <Input
                  type="email"
                  value={email}
                  onChange={(e, data) => setEmail(data.value)}
                  placeholder="user@company.com"
                />
              </Field>
              <Field label="Role">
                <Select value={role} onChange={(e, data) => setRole(data.value)}>
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </Select>
              </Field>
            </div>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onCancel}>Cancel</Button>
            <Button appearance="primary" onClick={handleSubmit} disabled={!email}>
              Send Invitation
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
```

---

## Change Role Dialog

```tsx
import * as React from 'react';
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogContent,
  DialogActions,
  Button,
  RadioGroup,
  Radio,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  description: {
    color: tokens.colorNeutralForeground3,
    marginBottom: tokens.spacingVerticalM,
  },
});

interface ChangeRoleDialogProps {
  open: boolean;
  userName: string;
  currentRole: string;
  onSubmit: (newRole: string) => void;
  onCancel: () => void;
}

/**
 * ChangeRoleDialog — Dialog for changing a user's role.
 *
 * Uses RadioGroup so the admin can see all options at once
 * with descriptions of each role's permissions.
 */
export function ChangeRoleDialog({
  open,
  userName,
  currentRole,
  onSubmit,
  onCancel,
}: ChangeRoleDialogProps) {
  const styles = useStyles();
  const [role, setRole] = React.useState(currentRole);

  return (
    <Dialog open={open} onOpenChange={(e, data) => !data.open && onCancel()}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Change Role for {userName}</DialogTitle>
          <DialogContent>
            <Text className={styles.description}>
              Select the new role for this user. Changes take effect immediately.
            </Text>
            <RadioGroup value={role} onChange={(e, data) => setRole(data.value)}>
              <Radio value="admin" label="Admin — Full access to all features" />
              <Radio value="editor" label="Editor — Create and edit content" />
              <Radio value="viewer" label="Viewer — Read-only access" />
            </RadioGroup>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onCancel}>Cancel</Button>
            <Button
              appearance="primary"
              onClick={() => onSubmit(role)}
              disabled={role === currentRole}
            >
              Update Role
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
```

---

## Permission Matrix

```tsx
import * as React from 'react';
import {
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  table: {
    width: '100%',
  },
  featureCell: {
    fontWeight: tokens.fontWeightSemibold,
  },
});

interface Permission {
  feature: string;
  admin: boolean;
  editor: boolean;
  viewer: boolean;
}

interface PermissionMatrixProps {
  permissions: Permission[];
  onToggle: (feature: string, role: 'admin' | 'editor' | 'viewer', checked: boolean) => void;
}

/**
 * PermissionMatrix — Checkbox grid showing role-based feature permissions.
 *
 * Rows = features, Columns = roles. Admin checkboxes may be
 * disabled if admin always has full access.
 */
export function PermissionMatrix({ permissions, onToggle }: PermissionMatrixProps) {
  const styles = useStyles();

  return (
    <Table className={styles.table} aria-label="Permission matrix">
      <TableHeader>
        <TableRow>
          <TableHeaderCell>Feature</TableHeaderCell>
          <TableHeaderCell>Admin</TableHeaderCell>
          <TableHeaderCell>Editor</TableHeaderCell>
          <TableHeaderCell>Viewer</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {permissions.map((perm) => (
          <TableRow key={perm.feature}>
            <TableCell className={styles.featureCell}>
              <Text>{perm.feature}</Text>
            </TableCell>
            <TableCell>
              <Checkbox
                checked={perm.admin}
                disabled
                aria-label={`Admin: ${perm.feature}`}
              />
            </TableCell>
            <TableCell>
              <Checkbox
                checked={perm.editor}
                onChange={(e, data) =>
                  onToggle(perm.feature, 'editor', data.checked === true)
                }
                aria-label={`Editor: ${perm.feature}`}
              />
            </TableCell>
            <TableCell>
              <Checkbox
                checked={perm.viewer}
                onChange={(e, data) =>
                  onToggle(perm.feature, 'viewer', data.checked === true)
                }
                aria-label={`Viewer: ${perm.feature}`}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// Usage:
const defaultPermissions: Permission[] = [
  { feature: 'View Dashboard', admin: true, editor: true, viewer: true },
  { feature: 'Create Content', admin: true, editor: true, viewer: false },
  { feature: 'Edit Content', admin: true, editor: true, viewer: false },
  { feature: 'Delete Content', admin: true, editor: false, viewer: false },
  { feature: 'Manage Users', admin: true, editor: false, viewer: false },
  { feature: 'System Settings', admin: true, editor: false, viewer: false },
];
```

---

## Best Practices

### ✅ Do

- **Show avatar + name + email** in user rows for easy identification
- **Use Badge for roles and statuses** — instant visual differentiation
- **Confirm role changes** that grant elevated permissions
- **Disable admin checkboxes** in permission matrix (admin always has full access)
- **Show "Last Login"** to help identify inactive accounts

### ❌ Don't

- **Don't allow self-removal** — prevent admins from removing their own account
- **Don't change roles without confirmation** for elevated permissions
- **Don't show raw permission IDs** — use human-readable feature names
- **Don't forget to handle pending invitations** — show resend option

---

## Related Documentation

- [Admin CRUD Tables](03a-admin-crud.md) — Generic CRUD table patterns
- [Admin Settings](03c-admin-settings.md) — Settings panel patterns
- [Avatar Component](../02-components/data-display/avatar.md) — Avatar API reference
- [Form Dialogs](../03-patterns/modals/03-form-dialogs.md) — Dialog form patterns
