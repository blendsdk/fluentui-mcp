# ADR-001: Retire the MCP server in favor of an Agent Skill

> **Status**: Accepted
> **Date**: 2026-09-19
> **Authorising decision**: AR-1, AR-3

## Context

The repository shipped a Model Context Protocol (MCP) server. It exposed twelve tools over stdio
and served an enhanced JSON schema that bundled FluentUI documentation. Using it required a running
process and per-client configuration, and every answer cost a tool round-trip that consumed context
before the agent could write code. Only clients that speak MCP could benefit.

The content itself was already offline and versioned. The MCP layer added a process and a protocol
on top of data that an agent could read directly.

## Decision

Replace the MCP server with an **Agent Skill** named `fluentui`. The skill is a static Markdown
corpus plus a manifest, installed into an agent's skills directory and read on demand. The MCP
runtime, its tool implementations, and the `@modelcontextprotocol/sdk` dependency are deleted.

## Alternatives considered

- **Keep the MCP server.** Rejected: it keeps the process, the configuration, and the client
  limitation while the content can be read without any of them.
- **Ship both an MCP server and a skill.** Rejected: two delivery paths to maintain and test, and
  the schema-to-response formatters would have to stay.
- **Keep the server as a plain library.** Rejected: no consumer remains once the skill reads the
  generated content directly.

## Consequences

- No process, no configuration, and no network at read time; the skill works in any agent that can
  read files.
- The content becomes the product, so it must be curated and generated carefully.
- The on-demand tool API (fuzzy search, suggestions, implementation guides) is replaced by an index
  and a routing table in `SKILL.md`.
- Packaging moves from an executable package to an npm package that carries the skill tree.
