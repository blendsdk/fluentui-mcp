import { defineConfig } from 'vitepress';
import { withMermaid } from 'vitepress-plugin-mermaid';

// VitePress configuration for the fluentui-mcp technical documentation site.
//
// Published to GitHub Pages at https://blendsdk.github.io/fluentui-mcp/ — the
// `base` MUST match the repository name so asset/links resolve under the
// project-pages sub-path. The source root is this `techdocs/` directory, which
// is intentionally isolated from `docs/v9/` (the FluentUI content the MCP
// server scrapes/serves) so the two never collide.
//
// `withMermaid` enables ```mermaid fenced code blocks to render as diagrams.
export default withMermaid(
  defineConfig({
  title: 'FluentUI MCP — Technical Docs',
  description:
    'Architecture documentation for fluentui-mcp: an MCP server serving FluentUI v9 documentation to AI agents.',
  base: '/fluentui-mcp/',
  lastUpdated: true,
  ignoreDeadLinks: false,

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Architecture', link: '/architecture/overview' },
      { text: 'Decisions', link: '/decisions/' },
      { text: 'Guides', link: '/guides/getting-started' },
      { text: 'Reference', link: '/reference/configuration' },
    ],

    sidebar: [
      {
        text: 'Overview',
        items: [
          { text: 'Showcase / Home', link: '/' },
          { text: 'Technical Architecture', link: '/architecture/overview' },
        ],
      },
      {
        text: 'Architecture',
        items: [
          { text: 'System Overview', link: '/architecture/system-overview' },
          { text: 'API Design (MCP Tools)', link: '/architecture/api-design' },
        ],
      },

      {
        text: 'Decisions',
        items: [
          { text: 'Decision Log', link: '/decisions/' },
          {
            text: 'ADR-001: Schema as Source of Truth',
            link: '/decisions/ADR-001-schema-as-source-of-truth',
          },
          {
            text: 'ADR-002: Bundled Enhanced JSON',
            link: '/decisions/ADR-002-bundled-enhanced-json',
          },
          {
            text: 'ADR-003: LLM Provider Model-Family Handling',
            link: '/decisions/ADR-003-llm-provider-model-family',
          },
          {
            text: 'ADR-004: TF-IDF In-Memory Search',
            link: '/decisions/ADR-004-tfidf-in-memory-search',
          },
        ],
      },
      {
        text: 'Developer Guides',
        items: [
          { text: 'Getting Started', link: '/guides/getting-started' },
          { text: 'Development Workflow', link: '/guides/development' },
        ],
      },
      {
        text: 'Reference',
        items: [
          { text: 'Configuration', link: '/reference/configuration' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/blendsdk/fluentui-mcp' },
    ],

    editLink: {
      pattern:
        'https://github.com/blendsdk/fluentui-mcp/edit/main/techdocs/:path',
      text: 'Edit this page on GitHub',
    },
  },
  }),
);
