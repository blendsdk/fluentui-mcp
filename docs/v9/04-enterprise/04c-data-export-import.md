# Data-Heavy Apps: Export & Import

> **Module**: 04-enterprise
> **FluentUI Version**: 9.x
> **Last Updated**: 2026-06-02

## Overview

Enterprise applications require bulk data operations: exporting tables to CSV/Excel, importing data from files, and performing bulk actions on selected rows. This guide covers export/import UI patterns, file upload dialogs, progress feedback, and bulk action toolbars using FluentUI v9 components.

---

## Export Menu

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
} from '@fluentui/react-components';
import {
  ArrowDownloadRegular,
  DocumentTableRegular,
  DocumentPdfRegular,
  ClipboardRegular,
} from '@fluentui/react-icons';

interface ExportMenuProps {
  /** Called with the chosen format */
  onExport: (format: 'csv' | 'xlsx' | 'pdf' | 'clipboard') => void;
  /** Whether only selected rows should be exported */
  hasSelection: boolean;
  selectedCount: number;
}

/**
 * ExportMenu — Dropdown with export format options.
 *
 * Shows different label text based on whether rows are selected:
 * "Export All" vs "Export 5 Selected".
 */
export function ExportMenu({ onExport, hasSelection, selectedCount }: ExportMenuProps) {
  const label = hasSelection ? `Export ${selectedCount} Selected` : 'Export All';

  return (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <Button icon={<ArrowDownloadRegular />} appearance="subtle" size="small">
          {label}
        </Button>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          <MenuItem
            icon={<DocumentTableRegular />}
            onClick={() => onExport('csv')}
          >
            Export as CSV
          </MenuItem>
          <MenuItem
            icon={<DocumentTableRegular />}
            onClick={() => onExport('xlsx')}
          >
            Export as Excel
          </MenuItem>
          <MenuItem
            icon={<DocumentPdfRegular />}
            onClick={() => onExport('pdf')}
          >
            Export as PDF
          </MenuItem>
          <MenuDivider />
          <MenuItem
            icon={<ClipboardRegular />}
            onClick={() => onExport('clipboard')}
          >
            Copy to Clipboard
          </MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  );
}
```

---

## CSV Export Utility

```tsx
/**
 * exportToCsv — Converts an array of objects to a CSV file and triggers download.
 *
 * @param filename - Name of the downloaded file (e.g. "users.csv")
 * @param data - Array of objects to export
 * @param columns - Column definitions with key and header label
 */
export function exportToCsv<T extends Record<string, unknown>>(
  filename: string,
  data: T[],
  columns: Array<{ key: keyof T; header: string }>,
): void {
  // Build header row
  const headerRow = columns.map((col) => `"${col.header}"`).join(',');

  // Build data rows
  const dataRows = data.map((item) =>
    columns
      .map((col) => {
        const value = item[col.key];
        // Escape double quotes in strings
        const escaped = String(value ?? '').replace(/"/g, '""');
        return `"${escaped}"`;
      })
      .join(','),
  );

  const csv = [headerRow, ...dataRows].join('\n');

  // Trigger browser download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

// Usage:
function handleExportUsers(users: User[]) {
  exportToCsv('users.csv', users, [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role' },
    { key: 'status', header: 'Status' },
    { key: 'lastLogin', header: 'Last Login' },
  ]);
}
```

---

## Import File Dialog

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
  Text,
  ProgressBar,
  MessageBar,
  MessageBarBody,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { ArrowUploadRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  dropZone: {
    border: `2px dashed ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingVerticalXXL,
    textAlign: 'center',
    cursor: 'pointer',
    '&:hover': {
      borderColor: tokens.colorBrandStroke1,
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  dropZoneActive: {
    borderColor: tokens.colorBrandStroke1,
    backgroundColor: tokens.colorBrandBackground2,
  },
  fileInfo: {
    marginTop: tokens.spacingVerticalM,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
});

type ImportStatus = 'idle' | 'selected' | 'uploading' | 'success' | 'error';

interface ImportDialogProps {
  open: boolean;
  onImport: (file: File) => Promise<{ imported: number; errors: number }>;
  onClose: () => void;
  /** Accepted file types (e.g. ".csv,.xlsx") */
  accept?: string;
}

/**
 * ImportDialog — File upload dialog with drag-and-drop zone.
 *
 * Supports drag-and-drop or click-to-browse.
 * Shows upload progress and import results.
 */
export function ImportDialog({ open, onImport, onClose, accept = '.csv' }: ImportDialogProps) {
  const styles = useStyles();
  const [file, setFile] = React.useState<File | null>(null);
  const [status, setStatus] = React.useState<ImportStatus>('idle');
  const [result, setResult] = React.useState<{ imported: number; errors: number } | null>(null);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setStatus('selected');
    setResult(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    setStatus('uploading');
    try {
      const res = await onImport(file);
      setResult(res);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const handleClose = () => {
    setFile(null);
    setStatus('idle');
    setResult(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(e, data) => !data.open && handleClose()}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Import Data</DialogTitle>
          <DialogContent>
            <div
              className={`${styles.dropZone} ${isDragOver ? styles.dropZoneActive : ''}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
            >
              <ArrowUploadRegular fontSize={32} />
              <Text block>Drag a file here or click to browse</Text>
              <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                Accepted: {accept}
              </Text>
              <input
                ref={inputRef}
                type="file"
                accept={accept}
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
            </div>

            {file && (
              <div className={styles.fileInfo}>
                <Text weight="semibold">{file.name}</Text>
                <Text size={200}>{(file.size / 1024).toFixed(1)} KB</Text>
              </div>
            )}

            {status === 'uploading' && (
              <ProgressBar style={{ marginTop: 12 }} />
            )}

            {status === 'success' && result && (
              <MessageBar intent="success" style={{ marginTop: 12 }}>
                <MessageBarBody>
                  Imported {result.imported} records. {result.errors} errors.
                </MessageBarBody>
              </MessageBar>
            )}

            {status === 'error' && (
              <MessageBar intent="error" style={{ marginTop: 12 }}>
                <MessageBarBody>Import failed. Please check your file format.</MessageBarBody>
              </MessageBar>
            )}
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={handleClose}>
              {status === 'success' ? 'Done' : 'Cancel'}
            </Button>
            {status === 'selected' && (
              <Button appearance="primary" onClick={handleUpload}>
                Import
              </Button>
            )}
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
```

---

## Bulk Actions Bar

```tsx
import * as React from 'react';
import {
  MessageBar,
  MessageBarBody,
  MessageBarActions,
  Button,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { DeleteRegular, ArchiveRegular, TagRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  bar: {
    position: 'sticky',
    bottom: 0,
    zIndex: 10,
  },
});

interface BulkActionsBarProps {
  selectedCount: number;
  onDelete: () => void;
  onArchive: () => void;
  onTag: () => void;
  onClearSelection: () => void;
}

/**
 * BulkActionsBar — Sticky bar showing available actions for selected rows.
 *
 * Appears at the bottom of the screen when 1+ rows are selected.
 * Provides Delete, Archive, Tag, and Clear Selection actions.
 */
export function BulkActionsBar({
  selectedCount,
  onDelete,
  onArchive,
  onTag,
  onClearSelection,
}: BulkActionsBarProps) {
  const styles = useStyles();

  if (selectedCount === 0) return null;

  return (
    <MessageBar intent="info" className={styles.bar}>
      <MessageBarBody>
        <Text weight="semibold">{selectedCount} items selected</Text>
      </MessageBarBody>
      <MessageBarActions>
        <Button icon={<TagRegular />} size="small" onClick={onTag}>Tag</Button>
        <Button icon={<ArchiveRegular />} size="small" onClick={onArchive}>Archive</Button>
        <Button icon={<DeleteRegular />} size="small" onClick={onDelete}>Delete</Button>
        <Button appearance="subtle" size="small" onClick={onClearSelection}>
          Clear Selection
        </Button>
      </MessageBarActions>
    </MessageBar>
  );
}
```

---

## Copy to Clipboard

```tsx
import * as React from 'react';
import {
  useToastController,
  Toast,
  ToastTitle,
  useId,
  Toaster,
} from '@fluentui/react-components';

/**
 * copyTableToClipboard — Copies table data as tab-separated text.
 *
 * This format pastes correctly into spreadsheet applications
 * (Excel, Google Sheets, Numbers).
 */
export async function copyTableToClipboard<T extends Record<string, unknown>>(
  data: T[],
  columns: Array<{ key: keyof T; header: string }>,
): Promise<void> {
  const header = columns.map((c) => c.header).join('\t');
  const rows = data.map((item) =>
    columns.map((c) => String(item[c.key] ?? '')).join('\t'),
  );
  const text = [header, ...rows].join('\n');
  await navigator.clipboard.writeText(text);
}

// Usage with toast feedback:
function CopyButton({ data, columns }: { data: unknown[]; columns: unknown[] }) {
  const toasterId = useId('copy-toast');
  const { dispatchToast } = useToastController(toasterId);

  const handleCopy = async () => {
    await copyTableToClipboard(data, columns);
    dispatchToast(
      <Toast><ToastTitle>Copied to clipboard</ToastTitle></Toast>,
      { intent: 'success', timeout: 2000 },
    );
  };

  return (
    <>
      <Button onClick={handleCopy}>Copy</Button>
      <Toaster toasterId={toasterId} />
    </>
  );
}
```

---

## Best Practices

### ✅ Do

- **Offer multiple export formats** (CSV, Excel, PDF) via a single menu
- **Show "Export N Selected" vs "Export All"** based on selection state
- **Provide drag-and-drop** for file imports alongside click-to-browse
- **Show import results** with counts of successes and errors
- **Use tab-separated text** for clipboard copies — compatible with spreadsheets

### ❌ Don't

- **Don't generate huge files client-side** — for 100K+ rows, use server-side export
- **Don't import without validation** — check file format and show errors
- **Don't skip progress indicators** during long import/export operations
- **Don't allow bulk delete without confirmation** — always show a Dialog

---

## Related Documentation

- [Data Virtualization](04a-data-virtualization.md) — Virtualization for large datasets
- [Data Filtering & Sorting](04b-data-filtering-sorting.md) — Filter/sort patterns
- [CRUD Tables](03a-admin-crud.md) — Admin CRUD table patterns
- [Dialog Patterns](../03-patterns/modals/01-dialog-patterns.md) — Dialog patterns
