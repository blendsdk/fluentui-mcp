# Documentation Maintenance Guide

> **Purpose**: How to update, add, and manage FluentUI documentation sets for the MCP server
> **Last Updated**: 2026-06-02

## Overview

The FluentUI MCP server uses a **fully dynamic document scanner** — it auto-discovers modules, categories, and files from the folder structure at startup. This means **zero code changes** are required when updating or adding documentation. Just follow the folder naming conventions described below.

---

## Folder Structure Convention

```
docs/
└── <version>/                          # e.g., v9, v10
    ├── 00-overview.md                  # Version overview (optional)
    ├── XX-<module-name>/               # Module folder (numeric prefix required)
    │   ├── 00-<module>-index.md        # Module index (optional)
    │   └── *.md                        # Module docs
    ├── XX-components/                  # Special: "components" module
    │   ├── 00-component-index.md       # Component index (optional)
    │   └── <category>/                 # Category subfolder
    │       └── *.md                    # Component docs
    └── XX-<another-module>/
        └── *.md
```

### Naming Rules

| Element | Convention | Example |
|---------|-----------|---------|
| **Version folder** | Any name under `docs/` | `docs/v9/`, `docs/v10/` |
| **Module folder** | `XX-name` (numeric prefix + hyphen) | `01-foundation/`, `02-components/` |
| **Category folder** | Plain name under components module | `buttons/`, `forms/`, `charts/` |
| **Doc files** | `.md` extension | `button.md`, `01-getting-started.md` |

### How Auto-Discovery Works

1. **Modules**: Every top-level `XX-name/` folder becomes a module. The numeric prefix (`XX-`) is stripped → `01-foundation` becomes module `"foundation"`
2. **Categories**: Every subfolder under the `components` module folder becomes a category → `02-components/buttons/` becomes category `"buttons"`
3. **Root files**: `.md` files at the version root (like `00-overview.md`) are classified as module `"foundation"` by default

---

## Updating Existing Docs

Simply edit the `.md` file in place. No other action required.

```bash
# Example: Update the Button component docs
vim docs/v9/02-components/buttons/button.md
```

The server will pick up changes on next startup or when the `reindex` tool is called.

---

## Adding a New Component Doc

1. Create the `.md` file in the appropriate category folder:

```bash
# Example: Add an IconButton component to the buttons category
touch docs/v9/02-components/buttons/icon-button.md
```

2. Write the doc following the [Document Format Reference](#document-format-reference) below.

That's it — the scanner will auto-discover it.

---

## Adding a New Category

1. Create a new subfolder under the components module:

```bash
# Example: Add a "charts" category
mkdir docs/v9/02-components/charts
```

2. Add component docs inside it:

```bash
touch docs/v9/02-components/charts/bar-chart.md
touch docs/v9/02-components/charts/pie-chart.md
```

The scanner will auto-discover `charts` as a new category.

---

## Adding a New Module

1. Create a new `XX-name/` folder at the version root:

```bash
# Example: Add a "migration" module
mkdir docs/v9/05-migration
```

2. Add docs inside it:

```bash
touch docs/v9/05-migration/01-v8-to-v9.md
touch docs/v9/05-migration/02-breaking-changes.md
```

The scanner will auto-discover `migration` as a new module (prefix `05-` is stripped).

---

## Adding a New Version (e.g., v10)

### Step 1: Create the Folder Structure

```bash
mkdir -p docs/v10/01-foundation
mkdir -p docs/v10/02-components/buttons
mkdir -p docs/v10/02-components/forms
mkdir -p docs/v10/02-components/navigation
mkdir -p docs/v10/02-components/data-display
mkdir -p docs/v10/02-components/feedback
mkdir -p docs/v10/02-components/overlays
mkdir -p docs/v10/02-components/layout
mkdir -p docs/v10/02-components/utilities
mkdir -p docs/v10/03-patterns
mkdir -p docs/v10/04-enterprise
mkdir -p docs/v10/99-quick-reference
```

### Step 2: Add the Overview Doc

Create `docs/v10/00-overview.md` with the version overview. Use `docs/v9/00-overview.md` as a template.

### Step 3: Populate with Docs

Add `.md` files to each module/category following the [Document Format Reference](#document-format-reference). You can:
- Copy and adapt docs from the v9 folder for components that haven't changed
- Create new docs for new components
- Use the `update_fluentui` Cline command to auto-generate docs from the FluentUI source code (see `.clinerules/update_fluentui.md`)

### Step 4: Run the Server with the New Version

```bash
# Method 1: CLI argument
fluentui-mcp v10

# Method 2: Environment variable
FLUENTUI_VERSION=v10 fluentui-mcp

# Method 3: Custom path (docs located anywhere)
FLUENTUI_DOCS_PATH=/path/to/my/v10-docs fluentui-mcp
```

### Step 5: Verify

Build and test the server to confirm the new docs are indexed:

```bash
yarn clean && yarn build && yarn test
```

---

## Document Format Reference

The metadata extractor parses specific patterns from markdown files. Following these formats ensures full indexing and searchability.

### Component Doc Template

```markdown
# ComponentName

> **Package**: `@fluentui/react-component-name`
> **Import**: `import { ComponentName } from '@fluentui/react-components'`
> **Category**: CategoryName

## Overview

One or two paragraphs describing what this component does and when to use it.

---

## Basic Usage

\`\`\`typescript
import * as React from 'react';
import { ComponentName } from '@fluentui/react-components';

export const BasicExample: React.FC = () => (
  <ComponentName>Content</ComponentName>
);
\`\`\`

---

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `propName` | `type` | `default` | What it does |

### Slots

| Slot | Element | Description |
|------|---------|-------------|
| `root` | `<element>` | Root element description |

---

## Variants / Features

(Sections with code examples for each major feature)

---

## Accessibility

### Requirements
(Accessibility requirements)

### Keyboard Support
| Key | Action |
|-----|--------|
| `Enter` | Does something |

---

## Styling Customization

\`\`\`typescript
// Custom styling example
\`\`\`

---

## Best Practices

### ✅ Do's
### ❌ Don'ts

---

## See Also

- [RelatedComponent](relative-path.md) - Description
```

### Foundation Doc Template

```markdown
# Topic Title

> **Package**: `@fluentui/react-components` (version info)
> **Prerequisites**: Requirements
> **Category**: Foundation

## Overview

Description of the foundation topic.

---

(Sections with explanations and code examples)

---

## See Also

- [Related Topic](relative-path.md) - Description
```

### Key Metadata Fields

The metadata extractor looks for these specific patterns:

| Field | Pattern | Required? |
|-------|---------|-----------|
| **Title** | `# Heading` (first H1) | Yes |
| **Package** | `> **Package**: \`@fluentui/...\`` | Recommended |
| **Import** | `> **Import**: \`import {...} from '...'\`` | Recommended |
| **Description** | First paragraph after `## Overview`, or first paragraph after title | Yes |
| **Props table** | `## Props Reference` section with markdown table | For components |
| **Code examples** | Fenced code blocks with `typescript`/`tsx`/`jsx` language | Recommended |
| **See Also** | `## See Also` section with markdown links | Optional |

---

## Verification Checklist

After making any changes to docs:

- [ ] Files are `.md` format
- [ ] Module folders follow `XX-name/` convention
- [ ] Component docs have the metadata blockquotes (`Package`, `Import`)
- [ ] Docs have a `# Title` heading
- [ ] Docs have an `## Overview` section with a description
- [ ] Code examples use `typescript`/`tsx`/`jsx` language hints
- [ ] Server builds without errors: `yarn clean && yarn build`
- [ ] All tests pass: `yarn test`
- [ ] New docs appear in the index (use `list_all_docs` or `search_docs` tool to verify)

---

## Automated Doc Generation

For bulk updates or generating docs from the FluentUI source code, use the AI agent prompt:

```
update_fluentui <version> <path-to-fluentui-sources>
```

See `.clinerules/update_fluentui.md` for the full prompt specification.
