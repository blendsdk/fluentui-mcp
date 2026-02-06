# FluentUI Documentation Update Prompt

## **TRIGGER KEYWORD: `update_fluentui <version> <path-to-sources>`**

When the user types `update_fluentui <version> <path-to-sources>`, execute this comprehensive workflow to scan the FluentUI source code and update/generate the documentation set for the specified version.

**Examples:**

```
update_fluentui v9 /Users/gevik/repos/fluentui
update_fluentui v10 /tmp/fluentui-main
update_fluentui v9 ../fluentui
```

---

## Overview

This prompt guides the AI agent through a structured process to:

1. **Scan the FluentUI source code** at the provided path to discover all components, their props, slots, and usage patterns
2. **Compare against the existing docs** in `docs/<version>/` to identify what's new, changed, or removed
3. **Generate or update markdown files** in the exact format the MCP server indexer expects
4. **Report a summary** of all changes made

The goal is to keep the MCP server's documentation in sync with the actual FluentUI source code.

---

## Phase 1: Parameter Validation

**When triggered, IMMEDIATELY validate:**

1. **Version parameter** — Must be provided (e.g., `v9`, `v10`, `v10-preview`)
2. **Source path parameter** — Must be provided and must exist on the filesystem
3. **Source path must contain FluentUI source code** — Look for `packages/react-components/` directory structure

**If validation fails:**
- ❌ STOP and inform the user with clear error message
- Suggest correct usage: `update_fluentui v9 /path/to/fluentui`

**Validation checks:**

```bash
# Verify source path exists
ls <path-to-sources>/packages/react-components/

# Verify it's a FluentUI repo (check for key indicators)
ls <path-to-sources>/packages/react-components/react-button/
ls <path-to-sources>/packages/react-components/react-components/
```

---

## Phase 2: Source Code Discovery

### 2.1 Discover All Component Packages

Scan `<path-to-sources>/packages/react-components/` to find all component packages:

```bash
ls <path-to-sources>/packages/react-components/
```

**Each directory like `react-button`, `react-input`, `react-dialog` is a component package.**

### 2.2 For Each Component Package, Extract:

#### A. Component Exports

Read the package's entry point to find exported components:

```
<package>/src/index.ts
<package>/library/src/index.ts
```

Look for:
- `export { ComponentName } from './ComponentName'`
- `export type { ComponentNameProps } from './ComponentName.types'`

#### B. Props Interface

Find the TypeScript props interface for each component:

```
<package>/library/src/components/<ComponentName>/<ComponentName>.types.ts
<package>/src/components/<ComponentName>/<ComponentName>.types.ts
<package>/src/<ComponentName>.types.ts
```

Extract from the props interface:
- **Prop name** — The property name
- **Prop type** — The TypeScript type (resolve type aliases when possible)
- **Default value** — Look in `use<ComponentName>.ts` or `use<ComponentName>Styles.ts` for defaults
- **Description** — JSDoc comment above the prop
- **Required/Optional** — Whether the prop has `?` (optional) or not

#### C. Slot Definitions

Look for slot definitions in:
- `<ComponentName>.types.ts` — Look for `Slot<>` type usage
- `use<ComponentName>.ts` — Look for `resolveShorthand()` or `slot()` calls

Extract:
- **Slot name** — Property name with `Slot<>` type
- **Element type** — The HTML element or component in the Slot generic
- **Description** — JSDoc if available

#### D. Component Stories / Examples

Find usage examples in:
```
<package>/stories/src/<ComponentName>*.stories.tsx
<package>/stories/<ComponentName>*.stories.tsx
```

Or in the docs:
```
<path-to-sources>/apps/public-docsite-v9/src/Concepts/<ComponentName>/
```

Extract:
- **Basic usage example** — The simplest story/example
- **Variant examples** — Stories showing different props/appearances
- **Complex examples** — Stories showing real-world patterns

#### E. Package Information

From `<package>/package.json`:
- **Package name** — e.g., `@fluentui/react-button`
- **Version** — Current version number

### 2.3 Discover Foundation Topics

Scan for foundation-level documentation:
```
<path-to-sources>/packages/react-components/react-components/
<path-to-sources>/packages/react-components/react-provider/
<path-to-sources>/packages/react-components/react-theme/
<path-to-sources>/packages/react-components/react-shared-contexts/
```

Extract:
- **Theme definitions** — Theme types, token names, built-in themes
- **Provider configuration** — FluentProvider props and setup
- **Styling system** — Griffel/makeStyles usage patterns

---

## Phase 3: Compare Against Existing Docs

### 3.1 Read Existing Documentation

Load all existing docs from `docs/<version>/`:

```bash
find docs/<version>/ -name "*.md" -type f
```

### 3.2 Build Comparison Matrix

For each component found in source code, check:

| Status | Meaning | Action |
|--------|---------|--------|
| **NEW** | Component exists in source but not in docs | Create new doc file |
| **UPDATED** | Component exists in both, but props/slots changed | Update existing doc |
| **UNCHANGED** | Component exists in both, no changes detected | Skip (no action) |
| **REMOVED** | Component exists in docs but not in source | Flag for review (don't auto-delete) |

### 3.3 Change Detection Criteria

A component doc needs updating when ANY of these differ:
- New props added to the interface
- Props removed from the interface
- Prop types changed
- New slots added
- Slot types changed
- Package version significantly changed (major/minor)
- New exports added to the package

---

## Phase 4: Generate / Update Documentation

### 4.1 Document Generation Rules

**CRITICAL:** All generated docs MUST follow the exact format expected by the MCP server's metadata extractor. See `maintenance/DOCS-MAINTENANCE.md` for the complete format reference.

### 4.2 Component Doc Template

For each component, generate a markdown file with this EXACT structure:

```markdown
# ComponentName

> **Package**: `@fluentui/react-package-name`
> **Import**: `import { ComponentName } from '@fluentui/react-components'`
> **Category**: CategoryName

## Overview

[AI-generated description of the component based on source code JSDoc and README]

---

## Basic Usage

```typescript
import * as React from 'react';
import { ComponentName } from '@fluentui/react-components';

export const BasicExample: React.FC = () => (
  <ComponentName>[appropriate content]</ComponentName>
);
```

---

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `propName` | `type` | `default` | [from JSDoc or type description] |

### Slots

| Slot | Element | Description |
|------|---------|-------------|
| `root` | `<element>` | [slot description] |
| `slotName` | `<element>` | [slot description] |

---

## [Feature/Variant Sections]

[Generated from stories and source code patterns]

```typescript
// Code examples extracted from stories or generated from props
```

---

## Accessibility

### Requirements

[Extract from component source — look for aria attributes, role settings]

### Keyboard Support

| Key | Action |
|-----|--------|
| [key] | [action from source code] |

---

## Styling Customization

```typescript
import { makeStyles, tokens } from '@fluentui/react-components';
import { componentNameClassNames } from '@fluentui/react-components';

// classNames reference for targeting specific parts
// componentNameClassNames.root
// componentNameClassNames.[slot]
```

---

## Best Practices

### ✅ Do's

[Generated based on component patterns and accessibility requirements]

### ❌ Don'ts

[Generated based on common anti-patterns]

---

## See Also

- [RelatedComponent](relative-path.md) - Description
- [Component Index](../00-component-index.md) - All components
```

### 4.3 File Placement Rules

| Component Package | Category | File Path |
|-------------------|----------|-----------|
| `react-button` | buttons | `docs/<version>/02-components/buttons/button.md` |
| `react-input` | forms | `docs/<version>/02-components/forms/input.md` |
| `react-dialog` | feedback | `docs/<version>/02-components/feedback/dialog.md` |
| `react-menu` | navigation | `docs/<version>/02-components/navigation/menu.md` |
| `react-avatar` | data-display | `docs/<version>/02-components/data-display/avatar.md` |
| `react-popover` | overlays | `docs/<version>/02-components/overlays/popover.md` |
| `react-card` | layout | `docs/<version>/02-components/layout/card.md` |
| `react-accordion` | utilities | `docs/<version>/02-components/utilities/accordion.md` |

**Category Assignment Heuristics:**

| Package Pattern | Category |
|----------------|----------|
| `react-button`, `react-*-button` | `buttons` |
| `react-input`, `react-textarea`, `react-select`, `react-combobox`, `react-checkbox`, `react-radio`, `react-switch`, `react-slider`, `react-spinbutton`, `react-field`, `react-search*`, `react-rating`, `react-color-picker`, `react-swatch-picker`, `react-tag-picker`, `react-infolabel`, `react-label`, `react-*picker*`, `react-calendar*`, `react-date*`, `react-time*` | `forms` |
| `react-menu`, `react-tabs`, `react-breadcrumb`, `react-nav*`, `react-link` | `navigation` |
| `react-avatar`, `react-badge`, `react-table`, `react-list`, `react-tree`, `react-tag`, `react-persona`, `react-text`, `react-image`, `react-skeleton` | `data-display` |
| `react-dialog`, `react-toast`, `react-message-bar`, `react-spinner`, `react-progress*`, `react-tooltip` | `feedback` |
| `react-popover`, `react-drawer`, `react-teaching-popover` | `overlays` |
| `react-card`, `react-divider` | `layout` |
| `react-accordion`, `react-toolbar`, `react-overflow`, `react-carousel`, `react-motion*` | `utilities` |

**If a package doesn't match any heuristic:** Ask the user which category to place it in, or default to `utilities`.

### 4.4 Component Index Update

After generating/updating component docs, regenerate `docs/<version>/02-components/00-component-index.md`:
- List all components grouped by category
- Include package names and brief descriptions
- Link to each component's doc file

### 4.5 Overview Update

Update `docs/<version>/00-overview.md`:
- Update component counts per category
- Update the total component count
- Update the "Last Updated" date

---

## Phase 5: Quality Checks

### 5.1 Generated Doc Validation

For every generated/updated doc, verify:

- [ ] Has a `# Title` heading (first line)
- [ ] Has `> **Package**: ...` metadata blockquote
- [ ] Has `> **Import**: ...` metadata blockquote
- [ ] Has `## Overview` section with description
- [ ] Has `## Props Reference` section with markdown table
- [ ] Has at least one `typescript` fenced code block example
- [ ] Has `## Accessibility` section
- [ ] Has `## See Also` section with at least a link to the component index
- [ ] File is in the correct category folder
- [ ] Filename is lowercase kebab-case (e.g., `compound-button.md`)

### 5.2 Cross-Reference Validation

- [ ] All `## See Also` links point to files that exist
- [ ] Component index lists all generated component docs
- [ ] No duplicate component docs in different categories

### 5.3 Build Verification

After all docs are generated/updated:

```bash
clear && yarn clean && yarn build && yarn test
```

All 137+ tests must pass. The indexer should discover all new docs.

---

## Phase 6: Report

### 6.1 Change Summary

After completion, present a summary:

```markdown
## FluentUI Docs Update Summary

**Version:** <version>
**Source:** <path-to-sources>
**Date:** <current date>

### New Components Added
| Component | Category | File |
|-----------|----------|------|
| NewComponent | forms | `docs/<version>/02-components/forms/new-component.md` |

### Updated Components
| Component | Changes |
|-----------|---------|
| Button | Added 2 new props: `iconOnly`, `loading` |
| Input | Updated slot types |

### Removed Components (Flagged for Review)
| Component | Last Known File |
|-----------|-----------------|
| DeprecatedComponent | `docs/<version>/02-components/forms/deprecated.md` |

### Unchanged Components
[List of components that had no changes]

### Statistics
- Total components documented: XX
- New docs created: XX
- Docs updated: XX
- Docs flagged for removal: XX

### Index Files Updated
- [x] `docs/<version>/02-components/00-component-index.md`
- [x] `docs/<version>/00-overview.md`

### Verification
- [x] Build passes
- [x] All tests pass
```

---

## Execution Strategy

### Multi-Session Approach

Due to AI context window limitations, this task should be executed across multiple sessions:

**Session 1: Discovery & Analysis**
1. Validate parameters
2. Scan source code packages
3. Build comparison matrix
4. Present findings and get user approval before generating docs

**Session 2-N: Doc Generation (by category)**
- Session 2: Generate/update `buttons` category docs
- Session 3: Generate/update `forms` category docs
- Session 4: Generate/update `navigation` category docs
- Session 5: Generate/update `data-display` category docs
- Session 6: Generate/update `feedback` + `overlays` category docs
- Session 7: Generate/update `layout` + `utilities` category docs
- Session 8: Update index files, cross-reference validation, final verification

Each session should:
1. Focus on one or two categories
2. Generate all component docs for those categories
3. Verify the generated docs are correctly indexed
4. Report progress

### Context Window Management

- Process **at most 5-8 components per session**
- Complete each component's doc fully before moving to the next
- End session at ~70% context usage
- Always leave the docs in a valid, buildable state between sessions

---

## Source Code Navigation Reference

### FluentUI Repo Structure (microsoft/fluentui)

```
fluentui/
├── packages/
│   └── react-components/
│       ├── react-components/          # Main rollup package
│       │   └── library/src/index.ts   # All stable exports
│       ├── react-button/              # Button component package
│       │   ├── library/
│       │   │   └── src/
│       │   │       ├── index.ts       # Package exports
│       │   │       └── components/
│       │   │           └── Button/
│       │   │               ├── Button.types.ts    # Props interface
│       │   │               ├── useButton.ts       # Hook (defaults)
│       │   │               ├── useButtonStyles.ts  # Styles
│       │   │               └── Button.tsx          # Component
│       │   ├── stories/               # Storybook stories
│       │   │   └── src/
│       │   │       └── Button/
│       │   │           └── *.stories.tsx
│       │   └── package.json
│       ├── react-input/               # Input component package
│       ├── react-dialog/              # Dialog component package
│       └── ...                        # All other component packages
├── apps/
│   └── public-docsite-v9/             # Official docs site (may have examples)
└── ...
```

### Key Files to Read Per Component

| Priority | File | What to Extract |
|----------|------|-----------------|
| 1 | `<pkg>/library/src/components/<Name>/<Name>.types.ts` | Props interface, slot types |
| 2 | `<pkg>/library/src/components/<Name>/use<Name>.ts` | Default values, behavior |
| 3 | `<pkg>/library/src/index.ts` | Exported names |
| 4 | `<pkg>/stories/src/<Name>/*.stories.tsx` | Usage examples |
| 5 | `<pkg>/package.json` | Package name, version |
| 6 | `<pkg>/README.md` | Component description |

### Alternative File Paths

Some packages may use different structures. Try these fallbacks:

```
# Newer structure
<pkg>/library/src/components/<Name>/<Name>.types.ts
<pkg>/library/src/index.ts

# Older structure
<pkg>/src/components/<Name>/<Name>.types.ts
<pkg>/src/index.ts

# Stories locations
<pkg>/stories/src/<Name>/<Name>Default.stories.tsx
<pkg>/stories/src/<Name>/index.stories.tsx
<pkg>/stories/<Name>.stories.tsx
```

---

## Error Handling

### If source code structure is unexpected:

1. **Log the anomaly** — Note which packages have non-standard structure
2. **Skip gracefully** — Don't generate a doc if you can't extract enough info
3. **Report in summary** — List packages that couldn't be processed

### If existing doc has custom content:

1. **Preserve custom sections** — If the existing doc has sections not in the template (e.g., custom patterns, migration notes), keep them
2. **Update only structured sections** — Props table, slots table, package info
3. **Flag for review** — Note docs where manual content was preserved

### If a component is deprecated:

1. **Check for `@deprecated` JSDoc tags** in the source
2. **Add deprecation notice** to the doc if found
3. **Don't auto-delete** — Flag for user review

---

## Integration with MCP Server

After running this update workflow:

1. **Rebuild the server**: `clear && yarn clean && yarn build`
2. **Run tests**: `clear && yarn test`
3. **Restart the MCP server** to pick up new docs
4. **Verify** using the `list_all_docs` or `search_docs` tools to confirm new components are indexed

The server's dynamic scanner will automatically discover all new files without any code changes.
