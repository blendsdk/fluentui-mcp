---
layout: home

hero:
  name: "Fluent UI MCP"
  text: "AI that actually understands Fluent UI v9"
  tagline: "A Model Context Protocol server that turns your AI agent into a Fluent UI expert — so it builds real, production-grade React UIs instead of guessing."
  actions:
    - theme: brand
      text: See it in action ↓
      link: "#showcase"
    - theme: alt
      text: Get Started
      link: /guides/getting-started
    - theme: alt
      text: Architecture
      link: /architecture/overview
    - theme: alt
      text: View on npm
      link: https://www.npmjs.com/package/fluentui-mcp

features:
  - icon: 🧠
    title: Real component knowledge
    details: 12 specialized tools expose props, slots, examples, patterns, and implementation guides — accurate, structured Fluent UI v9 context on demand.
  - icon: ⚡
    title: Fast & lightweight
    details: A single bundled, LLM-enhanced schema served from memory with TF-IDF search. One production dependency, zero runtime crawling.
  - icon: 🎯
    title: Production-grade results
    details: Agents produce idiomatic Fluent UI code — proper theming, accessibility, and component composition — not hand-rolled HTML.
---

## Why fluentui-mcp? {#why}

If you've tried building Fluent UI apps with an AI assistant, you already know
the problem: models guess. They hallucinate prop names, mix up v8 and v9 APIs,
reach for hand-styled `<div>`s instead of real components, and produce code that
*looks* plausible but doesn't compile or doesn't follow Fluent UI conventions.

**fluentui-mcp fixes that.** It's a Model Context Protocol server that gives your
AI agent direct, structured access to Fluent UI v9 — component references, props
and slots, ready-to-use examples, design patterns, and step-by-step
implementation guides. The agent stops guessing and starts building from real
knowledge.

The results below were produced by AI agents (Cline + Claude) with **nothing but
a prompt and this MCP server** — no manual fixups, no copy-pasting from docs.

---

## Showcase {#showcase}

### 🗂️ A complete To-Do app — from a single prompt {#todo-app}

We asked for a demo-only To-Do application: React + TypeScript, Fluent UI v9
components, localStorage persistence, inline editing, filtering, search, light/dark
theming, and a clean modular architecture. Here's what came back.

<details>
<summary><strong>📋 Show the prompt</strong></summary>

```markdown
# Build a FluentUI To-Do App (React + TypeScript, Demo Only)

Create a demo-only To-Do application using ReactJS + TypeScript and Fluent UI v9
components. No backend is required; the app should run entirely in the browser.

## Tech Requirements
- ReactJS + TypeScript only (no JavaScript files).
- UI must use Fluent UI v9 components (avoid custom-styled HTML unless necessary).
- No backend / API.
- Data persistence:
  - Store tasks in localStorage (so reload keeps tasks).
  - Include a simple data migration/version key to avoid breaking stored data later.

## Core Features
Task Model — each task has: id, title, completed, createdAt, optional notes.
Required functionality:
- Add a task (input + button, Enter key support).
- Edit a task title (inline edit).
- Mark complete/incomplete.
- Delete a task (with confirmation dialog).
- Filter tasks: All / Active / Completed.
- Search tasks by title.
- Clear completed tasks.
- Show counters: total, active, completed.

## UI/UX Requirements (Fluent UI)
- Layout resembling a modern productivity app (header, input row, task list, footer controls).
- Use Fluent UI v9 components: Input, Button, Checkbox, Card, Toolbar, Dialog, Badge, Divider, Spinner, etc.
- Support light/dark mode using Fluent UI theming where possible.

## Architecture Requirements
- Keep code modular and readable (components/, hooks/, types/, utils/).
- Avoid `any`. Use strict, meaningful types.
- Include comments for key decisions.

## Deliverables
- A complete working React + TypeScript app.
- Clear instructions to run locally.
- Short documentation explaining state management, persistence, and UX decisions.
```

</details>

<div class="showcase-gallery">

![To-Do app — main task list](/showcase/todo-app-01.png)

![To-Do app — adding a task](/showcase/todo-app-02.png)

![To-Do app — filtering and search](/showcase/todo-app-03.png)

![To-Do app — completed tasks view](/showcase/todo-app-04.png)

![To-Do app — inline editing](/showcase/todo-app-05.png)

![To-Do app — delete confirmation dialog](/showcase/todo-app-06.png)

![To-Do app — dark theme](/showcase/todo-app-07.png)

</div>

Every screen uses real Fluent UI v9 components — `Input`, `Button`, `Checkbox`,
`Card`, `Toolbar`, `Dialog`, `Badge`, and friends — with proper theming and a
confirmation dialog for destructive actions. The agent knew which components to
reach for because the MCP server told it.

---

### 🛠️ An admin panel — users, posts & invitations {#admin-panel}

A second, deliberately open-ended prompt: build a demo admin panel for managing
users, posts, and invitations. No backend, UI only. The agent composed a full
dashboard-style interface with data tables, actions, and navigation.

<details>
<summary><strong>📋 Show the prompt</strong></summary>

```markdown
TASK:

- Using Fluent UI, create a demo admin panel for managing users, posts, and invitations.
- We do not need a backend; the UI alone is sufficient.
- For data storage, use either an in-memory solution or the browser's local storage.
```

</details>

<div class="showcase-gallery">

![Admin panel — users management](/showcase/admin-panel-01.png)

![Admin panel — posts management](/showcase/admin-panel-02.png)

![Admin panel — invitations management](/showcase/admin-panel-03.png)

</div>

From three short sentences, the agent produced a coherent admin experience —
data grids, toolbars, and consistent Fluent UI styling throughout. That's the
difference structured component knowledge makes.

---

## How it works {#how-it-works}

fluentui-mcp ships a single, pre-built, LLM-enhanced schema of Fluent UI v9 and
serves it from memory over the Model Context Protocol. Your agent calls
**12 specialized tools** — query a component, search the docs, get props and
examples, suggest components for a scenario, or generate a full implementation
guide — and gets back clean, structured context exactly when it needs it.

All the heavy lifting (scraping the Fluent UI source and enriching it with an
LLM) happens **offline at build time**, so the runtime stays fast and dependency-light.

> Want the technical deep-dive? Read the
> [Architecture Overview](/architecture/overview) and the
> [MCP Tools / API Design](/architecture/api-design).

---

## Get started in minutes {#get-started}

Install the package:

```bash
npm install -g fluentui-mcp
# or use it directly
npx fluentui-mcp
```

Then point your AI agent (Cline, Claude Desktop, or any MCP-compatible client) at
the server and start building. The full walkthrough — including client
configuration — is in the [Getting Started Guide](/guides/getting-started).

<div style="margin-top: 2rem;">

[**📦 fluentui-mcp on npm**](https://www.npmjs.com/package/fluentui-mcp) &nbsp;·&nbsp;
[**🚀 Getting Started**](/guides/getting-started) &nbsp;·&nbsp;
[**🏗️ Architecture**](/architecture/overview)

</div>

<style>
.showcase-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
}
.showcase-gallery img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}
</style>
