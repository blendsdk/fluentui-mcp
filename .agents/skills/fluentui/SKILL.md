---
name: fluentui
description: Use when building React user interfaces with FluentUI React v9 (for example Button, Input, Dialog, DataGrid, FluentProvider, makeStyles, tokens). Covers setup, theming, styling, accessibility, component APIs, and task recipes, with verified examples from the real package.
license: MIT
compatibility: FluentUI React v9 with React 16.14–19 (peer range >=16.14.0 <20.0.0); examples import from @fluentui/react-components and @fluentui/react-icons.
metadata:
  author: blendsdk
---

# FluentUI React v9

This skill teaches you to build user interfaces with **FluentUI React v9**. The
knowledge base is bundled offline: every component page, category guide, and
task recipe lives under `references/` next to this file. Read the relevant
reference before writing code, and copy patterns from the verified examples
rather than guessing.

## Hard rules

1. **Check the installed version first.** Run `npm ls @fluentui/react-components`
   (or read `package.json`) before writing code. This skill targets **v9**.
2. **Import from the documented entry points.** Components come from
   `@fluentui/react-components`; icons come from `@fluentui/react-icons`. Do not
   import from an internal `@fluentui/react-*` package unless a reference page
   says to.
3. **Never invent a prop.** If a prop is not listed on the component's reference
   page, do not pass it. Look up the real name in
   `references/components/<component>.md`.
4. **Prefer the verified examples.** Each component page renders examples taken
   from FluentUI's own Storybook source. Start from one of those and adapt it.
5. **Wrap the tree in `FluentProvider`.** Theming, tokens, and right-to-left all
   depend on it. See `references/foundation/fluent-provider.md`.
6. **Style with Griffel and tokens.** Use `makeStyles` and the design tokens in
   `tokens`, not hard-coded colors or spacing. See
   `references/foundation/styling-griffel.md`.
7. **Accessibility is part of the task.** Every interactive element needs a
   label, keyboard support, and correct roles. See
   `references/foundation/accessibility.md`.
8. **Disclose the covered version and stay inside it.** Answer from what this
   skill version covers — see `## Source & versions` in `references/index.md`.
   State the covered Fluent UI version, list the reference files you used, and
   if a component, prop, or API is not present in the references, say it is
   **not covered by this skill version** instead of guessing.

## How to route a task

| If the task is about… | Read |
| --------------------- | ---- |
| Setting up a project, imports, or the provider | `references/foundation/getting-started.md`, `references/foundation/fluent-provider.md` |
| Theming, dark mode, tokens, or RTL | `references/foundation/theming.md`, `references/quick-reference/styling-tokens.md` |
| Writing styles with Griffel | `references/foundation/styling-griffel.md` |
| A specific component's props or examples | `references/components/<component>.md` |
| A whole class of controls (all buttons, all inputs) | `references/categories/<category>.md` |
| A concrete job such as a login form or a data table | `references/recipes/<group>/<recipe>.md` |
| A short cheat sheet or checklist | `references/quick-reference/<topic>.md` |
| An overview of everything available | `references/index.md` |

## Component map

Components are grouped into eight categories. Read the category page for shared
guidance, then the component page for exact props and examples.

| Category | Reference | Typical components |
| -------- | --------- | ------------------ |
| Buttons | `references/categories/buttons.md` | Button, CompoundButton, MenuButton, SplitButton, ToggleButton |
| Forms | `references/categories/forms.md` | Input, Textarea, Checkbox, Radio, Select, Switch, Slider |
| Navigation | `references/categories/navigation.md` | TabList, Breadcrumb, Link, NavDrawer |
| Data display | `references/categories/data-display.md` | DataGrid, Table, Tree, Badge, Avatar |
| Feedback | `references/categories/feedback.md` | Spinner, ProgressBar, Toast, MessageBar |
| Overlays | `references/categories/overlays.md` | Dialog, Drawer, Menu, Popover, Tooltip |
| Layout | `references/categories/layout.md` | Card, Divider, Grid, Toolbar |
| Utilities | `references/categories/utilities.md` | Accordion, Portal, and remaining components |

The full, always-current list is generated into `references/index.md`.

## Common recipes

These walk through a complete, working composition. Each lists the components it
uses and renders full examples.

- `references/recipes/forms/login-form.md` — a labelled, validated login form.
- `references/recipes/data/data-table.md` — a sortable, paginated data table.
- `references/recipes/navigation/tabs.md` — tabbed in-page navigation.
- `references/recipes/modals/confirm-dialog.md` — a confirmation dialog with a
  focus trap.
- `references/recipes/layout/dashboard-shell.md` — an application shell with a
  sidebar and content area.

The complete set of nineteen recipes is indexed in `references/index.md`.

## Assets

`assets/templates/` holds starting points you can copy into a project:

- `minimal-app.md` — the smallest correct FluentUI app.
- `form.md` — a form with validation.
- `dashboard-shell.md` — an app shell with navigation.
- `admin-crud.md` — a list-and-edit admin screen.

## Working agreement

- Read the reference page before writing component code.
- Keep imports at the top and use the public entry points.
- Prefer composition and tokens over custom CSS.
- When unsure, search `references/index.md` for the component or task name.
