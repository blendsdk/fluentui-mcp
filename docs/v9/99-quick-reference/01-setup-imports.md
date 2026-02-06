# Quick Reference: Setup & Imports

> **Parent**: [Quick Reference Index](00-quick-ref-index.md)

## Installation

```bash
# Main package (includes all components)
yarn add @fluentui/react-components

# Icons
yarn add @fluentui/react-icons

# Motion (preview)
yarn add @fluentui/react-motion-components-preview

# Compat packages (date/time)
yarn add @fluentui/react-calendar-compat
yarn add @fluentui/react-datepicker-compat
yarn add @fluentui/react-timepicker-compat
```

### Peer Dependencies

```bash
# Required
yarn add react react-dom
# React 17.x or 18.x supported
```

---

## FluentProvider Setup

### Basic App Root

```typescript
import { FluentProvider, webLightTheme } from '@fluentui/react-components';

const App: React.FC = () => (
  <FluentProvider theme={webLightTheme}>
    {/* All FluentUI components must be inside FluentProvider */}
    <YourApp />
  </FluentProvider>
);
```

### Dark Theme

```typescript
import { FluentProvider, webDarkTheme } from '@fluentui/react-components';

<FluentProvider theme={webDarkTheme}>
  <YourApp />
</FluentProvider>
```

### Theme Switching

```typescript
import { FluentProvider, webLightTheme, webDarkTheme } from '@fluentui/react-components';

const App: React.FC = () => {
  const [isDark, setIsDark] = React.useState(false);

  return (
    <FluentProvider theme={isDark ? webDarkTheme : webLightTheme}>
      <button onClick={() => setIsDark((d) => !d)}>Toggle Theme</button>
      <YourApp />
    </FluentProvider>
  );
};
```

### Custom Theme

```typescript
import {
  FluentProvider,
  webLightTheme,
  createLightTheme,
  createDarkTheme,
  type BrandVariants,
} from '@fluentui/react-components';

const brand: BrandVariants = {
  10: '#020305', 20: '#111723', 30: '#16263D',
  40: '#193253', 50: '#1B3F6A', 60: '#1E4D82',
  70: '#205B9A', 80: '#236AB3', 90: '#4A89C8',
  100: '#6BA1D4', 110: '#89B8E0', 120: '#A6CEEB',
  130: '#C2E3F5', 140: '#DEF2FC', 150: '#F5FBFE',
  160: '#FFFFFF',
};

const lightTheme = createLightTheme(brand);
const darkTheme = createDarkTheme(brand);

<FluentProvider theme={lightTheme}>...</FluentProvider>
```

### Nested Providers (Local Theme Override)

```typescript
<FluentProvider theme={webLightTheme}>
  <div>Light theme content</div>
  <FluentProvider theme={webDarkTheme}>
    <div>This section uses dark theme</div>
  </FluentProvider>
</FluentProvider>
```

### RTL Support

```typescript
<FluentProvider theme={webLightTheme} dir="rtl">
  <YourApp />
</FluentProvider>
```

---

## Import Patterns

### Main Package Import (Recommended)

```typescript
// Import everything from main package
import {
  // Provider
  FluentProvider, webLightTheme, webDarkTheme,

  // Buttons
  Button, CompoundButton, MenuButton, SplitButton, ToggleButton,

  // Forms
  Input, Textarea, Select, Combobox, Checkbox, Radio, RadioGroup,
  Switch, Slider, SpinButton, Field, SearchBox, Label,

  // Navigation
  Menu, MenuTrigger, MenuPopover, MenuList, MenuItem,
  TabList, Tab,
  Breadcrumb, BreadcrumbItem, BreadcrumbButton,
  Link,

  // Data Display
  Avatar, Badge, Text, Image, Persona, Skeleton,
  Table, TableHeader, TableRow, TableCell, TableBody,
  DataGrid, DataGridHeader, DataGridRow, DataGridCell, DataGridBody,
  Tag, Tree, TreeItem,

  // Feedback
  Dialog, DialogTrigger, DialogSurface, DialogTitle, DialogBody, DialogActions,
  Toast, Toaster, useToastController,
  MessageBar, MessageBarBody, MessageBarTitle, MessageBarActions,
  Tooltip, Spinner, ProgressBar,

  // Overlays
  Popover, PopoverTrigger, PopoverSurface,
  Drawer, DrawerHeader, DrawerBody,

  // Layout
  Card, CardHeader, CardFooter, CardPreview,
  Divider,

  // Utilities
  Accordion, AccordionItem, AccordionHeader, AccordionPanel,
  Toolbar, ToolbarButton, ToolbarDivider,
  Overflow, OverflowItem,
  Carousel, CarouselCard,

  // Styling
  makeStyles, mergeClasses, tokens, shorthands,
} from '@fluentui/react-components';
```

### Icons Import

```typescript
// Icons use PascalCase + size suffix: Regular, Filled
import {
  AddRegular,
  DeleteRegular,
  EditRegular,
  SearchRegular,
  SettingsRegular,
  PersonRegular,
  CalendarMonthRegular,
  ChevronDownRegular,
  ChevronRightRegular,
  DismissRegular,
  CheckmarkRegular,
  WarningRegular,
  InfoRegular,
  ErrorCircleRegular,
} from '@fluentui/react-icons';

// Filled variants
import {
  AddFilled,
  StarFilled,
  HeartFilled,
} from '@fluentui/react-icons';
```

### Motion Import

```typescript
// Core motion (included in react-components)
import {
  createMotionComponent,
  createPresenceComponent,
  motionTokens,
  PresenceGroup,
} from '@fluentui/react-motion';

// Pre-built motion components (separate package)
import {
  Fade, FadeSnappy, FadeRelaxed,
  Scale, ScaleSnappy, ScaleRelaxed,
  Slide, SlideSnappy, SlideRelaxed,
  Collapse, CollapseSnappy, CollapseRelaxed, CollapseDelayed,
  Blur, Rotate, Stagger,
} from '@fluentui/react-motion-components-preview';
```

### Nav Import (Separate Package)

```typescript
import {
  NavDrawer, NavDrawerBody, NavDrawerHeader, NavDrawerFooter,
  Nav, NavItem, NavCategory, NavCategoryItem,
  NavSubItem, NavSubItemGroup, NavSectionHeader, NavDivider,
  Hamburger, AppItem, AppItemStatic,
} from '@fluentui/react-nav';
```

### Compat Date/Time Import

```typescript
import { Calendar } from '@fluentui/react-calendar-compat';
import { DatePicker } from '@fluentui/react-datepicker-compat';
import { TimePicker } from '@fluentui/react-timepicker-compat';
```

---

## Project Structure Template

```
src/
├── App.tsx              # FluentProvider wrapping
├── theme.ts             # Custom theme (if needed)
├── styles/
│   └── shared.ts        # Shared makeStyles
├── components/
│   ├── Layout.tsx       # App layout shell
│   ├── Sidebar.tsx      # Navigation
│   └── ...
├── pages/
│   ├── Dashboard.tsx
│   └── ...
└── index.tsx            # Entry point
```

---

## See Also

- [FluentProvider Deep Dive](../01-foundation/02-fluent-provider.md)
- [Theming Guide](../01-foundation/03-theming.md)
- [Component Index](../02-components/00-component-index.md)
