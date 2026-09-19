# data-display components

## Overview

The data display category covers the components that present information rather than collect it: identity (Avatar, Persona), short status and metadata tokens (Badge, Tags), media (Image), typographic content (Text), collections (List, Tree, Table), and loading placeholders (Skeleton). They share one job — making content scannable, comparable, and legible at a glance — and they differ mainly in the shape of the data they carry: a person, a single label, a flat sequence, a nested hierarchy, or a dense set of aligned columns. Most are read-mostly, but several support optional interaction such as selection, sorting, expansion, or removal, and that behavior should come from the component's own properties rather than from hand-rolled handlers attached to the root slot. Because these components are the pages users spend the most time reading, consistency across them matters more than novelty in any one of them.

## When to Use

Reach for this category when the user's primary task is to read, scan, compare, or interpret content; reach for forms, buttons, or navigation when the task is to enter data or move through the app. Choose within the category by the shape of the content: Avatar when only an identity image or initials are needed, Persona when a name and supporting lines must travel with that identity, Badge for a single short status or count, Tags for a set of values the user may recognize, dimiss, or act on, Text for anything typographic, Image for media, List for a flat homogeneous sequence, Tree for nested hierarchy with expand/collapse, Table when rows must be compared across aligned columns with sorting or selection, and Skeleton when the layout is known but the data has not arrived. Several of these components carry optional interaction — List, Tree, and Table accept selection modes, Table sorts, Tree expands — so prefer the built-in behavior whenever the content is anything more than static text. If you find yourself adding state, focus handling, or click semantics on top of Avatar, Badge, Image, or Tags, you have probably chosen a display component for an interactive job.

## Best Practices

### Do's

- Match the component to the shape of the data: Avatar when only an identity image is needed, Persona when primary and secondary text must accompany the avatar, Badge for one short status or count, Tags for a set of values, Text for everything typographic.
- Let Avatar derive initials from its name property, keep shape and size consistent everywhere the same person appears, and reserve the badge slot for a single small overlay such as a count.
- Express status through more than color: pair Badge color with a short label and, when helpful, an icon positioned with iconPosition, and choose among filled, outline, tint, and ghost appearances to reflect how prominent the status should be.
- Use Table's built-in capabilities — selectionMode, sortable headers with sortDirection, columnSizingOptions, and autoFitColumns — instead of layering custom sorting, resizing, or selection logic on the rendered cells.
- Size Skeleton placeholders to the geometry of the content they replace using shape, size, and width, prefer translucent when the placeholder sits over a real surface, and remove it as soon as data resolves.
- Let Image handle presentation with fit and shape rather than wrapping it in custom cropping or rounding, and set block when the image should fill its container's width.
- Drive hierarchy and selection through the components themselves: Tree's defaultOpenItems with selectionMode, List's selectedItems, and Table's selectionMode keep state, focus, and keyboard behavior in sync.
- Use Text's size, weight, and font properties within the shared ramp, and make truncation explicit with truncate while exposing the full value through a Tooltip or the surrounding layout.

### Don'ts

- Don't use Table for content that isn't column-aligned comparison; records with two or three fields read better as a List or as individual Cards.
- Don't make Badge, Avatar, Image, or Tags' base element interactive by attaching click handlers — they expose no focus, keyboard, or pressed-state contract, so actions belong in Button or Link.
- Don't encode meaning in color alone for Badge, Tags, or Avatar's active ring or shadow; a colored dot or ring without accompanying text is unreadable for many users and cannot be translated.
- Don't invent your own highlight, checkmark, or expanded state on top of Tree, List, or Table — local selection state desynchronizes from selectionMode and from the component's keyboard model.
- Don't restyle Text sizes and weights per screen to build hierarchy, and don't reassemble Avatar from Text and Image; both break the shared type ramp and identity consistency.
- Don't leave Skeleton mounted after data has arrived or reuse it as a decorative divider, and don't overwrite your own geometry on top of Avatar's size and shape properties.
- Don't overload Persona; quaternary text is the last supporting line, and further metadata belongs in the surrounding layout rather than in additional slots.

## Anti-Patterns

### Table as a general-purpose layout

❌ Table carries density and an implicit promise of column comparison, so records with two or three fields waste vertical space, force a horizontal reading pattern that doesn't pay off, and tempt developers to strip or fight the table semantics it renders.

✅ Reserve Table for data that benefits from aligned columns, sorting, and selection. Use List for homogeneous rows, Card for a handful of rich items, and Avatar or Persona plus Text for identity rows.

### Faking interactivity on display primitives

❌ Badge, Avatar, Image, and the Tags root are not interactive controls; attaching click handlers produces affordances that cannot be reached by keyboard, expose no focus or pressed state, and behave inconsistently for assistive technology.

✅ Put actions in Button or Link, and when a tag genuinely needs a dismiss or secondary affordance, enable the secondary action on Tags so the control and its accessible name exist; use TagPicker when the user is composing a set of tags.

### Color-only status and presence

❌ Badge colors, tag colors, and Avatar's active ring or shadow communicate state through a single visual channel that color-blind and non-visual users cannot perceive, and translated labels cannot repair an unlabeled dot.

✅ Always pair color with a short text label and, when useful, an icon through iconPosition. For availability, express presence in Persona's presence slot alongside text rather than relying on Avatar's active appearance alone.

### Hand-rolled selection, sorting, and expansion

❌ Tracking selection, sort order, or expanded nodes in local state or by manipulating rendered cells loses the component's keyboard model and its announcements, and quickly drifts out of sync with the visual state users see.

✅ Use Tree's selectionMode with openItems or defaultOpenItems, List's selectionMode with selectedItems and its change callback, and Table's selectionMode plus sortable and sortDirection with the sort change callback.

### Skeleton mismatch and Skeleton forever

❌ Placeholders whose shape or size differs from the final content cause a layout jump when data arrives, and a Skeleton that never unmounts reads as permanently broken or as decoration rather than as a loading signal.

✅ Mirror the final geometry with shape, size, and width, keep the placeholder short-lived, remove it the moment data resolves, and avoid long-running looping wave or pulse animations on screens that stay open.

### Reimplementing identity and typography

❌ Building initials circles out of Text and Image, or overriding Avatar's internals with gradients and borders, breaks size and color consistency across surfaces and discards the name-derived initials fallback; restyling every heading from scratch erodes the shared type ramp.

✅ Use Avatar's name, size, shape, and color properties with idForColor for stable per-person color, and use Text's size, weight, and font properties within the ramp while keeping real heading semantics for document structure.

## Accessibility

These components render meaningful native or ARIA semantics — Table produces real table structure, Tree produces tree structure, List produces list structure — so preserve those semantics instead of replacing roots with generic containers or flattening rows into styled divs. Non-text content needs a textual equivalent: Avatar derives initials from its name property and should be hidden from the accessibility tree when the same name is already rendered next to it, and Image needs alt text that describes its content, with an empty alternative when the image is purely decorative. Badge and Tags must include readable text, never color alone, and when Tags has a secondary action enabled the tag body and the action need distinct accessible names so they are not announced as duplicates. State changes must come from the component properties that expose them: selectionMode on List and Table, sortable with sortDirection on Table, and selectionMode with checkedItems or openItems on Tree, so screen readers receive the updates; Tab and Table also define their own keyboard models through focusMode and Tree through navigationMode, and overriding those keys removes the model keyboard users rely on. Skeleton is placeholder geometry and should be hidden from assistive technology while a separate live region announces that content is loading, and its looping wave or pulse animation should not persist indefinitely or ignore a reduced-motion preference in the app. Typography set through Text must still meet contrast requirements at every size and weight, and document structure such as headings must come from real heading elements rather than from enlarged text alone.

## Components in this category

- - [Avatar](../components/avatar.md)
- - [Badge](../components/badge.md)
- - [Image](../components/image.md)
- - [List](../components/list.md)
- - [Persona](../components/persona.md)
- - [Skeleton](../components/skeleton.md)
- - [Table](../components/table.md)
- - [Tags](../components/tags.md)
- - [Text](../components/text.md)
- - [Tree](../components/tree.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
