import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderSuspense, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"fluentui-mcp — Technical Architecture","description":"","frontmatter":{"techdocs":true},"headers":[],"relativePath":"index.md","filePath":"index.md","lastUpdated":null}');
const _sfc_main = { name: "index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Mermaid = resolveComponent("Mermaid");
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="fluentui-mcp-—-technical-architecture" tabindex="-1">fluentui-mcp — Technical Architecture <a class="header-anchor" href="#fluentui-mcp-—-technical-architecture" aria-label="Permalink to &quot;fluentui-mcp — Technical Architecture&quot;">​</a></h1><blockquote><p><strong>Project</strong>: fluentui-mcp <strong>Type</strong>: Library / CLI (MCP server) <strong>Tech Stack</strong>: TypeScript (ESM), Node.js ≥18, MCP SDK, Vitest, ts-morph <strong>Last Updated</strong>: 2026-06-04</p></blockquote><hr><h2 id="system-purpose" tabindex="-1">System Purpose <a class="header-anchor" href="#system-purpose" aria-label="Permalink to &quot;System Purpose&quot;">​</a></h2><p><code>fluentui-mcp</code> is a <a href="https://modelcontextprotocol.io/" target="_blank" rel="noreferrer">Model Context Protocol</a> server that gives AI assistants intelligent, context-efficient access to Microsoft <strong>FluentUI v9</strong> documentation. Instead of forcing an agent to crawl raw documentation, it exposes <strong>12 specialized tools</strong> (query a component, search docs, suggest components, generate an implementation guide, and more) backed by a single, pre-built, LLM-enhanced JSON schema served from memory.</p><p>The runtime is deliberately lightweight: it ships one production dependency (<code>@modelcontextprotocol/sdk</code>), loads a bundled schema file at startup, builds an in-memory store plus a TF-IDF search index, and answers tool calls over a stdio transport. All of the expensive work — scraping FluentUI source and enriching it with an LLM — happens <strong>offline at build time</strong>, never at runtime.</p><p>This documentation is for developers who will maintain or extend the server, the schema pipeline, or the toolset. It is <strong>not</strong> end-user product documentation.</p><h2 id="architecture-at-a-glance" tabindex="-1">Architecture at a Glance <a class="header-anchor" href="#architecture-at-a-glance" aria-label="Permalink to &quot;Architecture at a Glance&quot;">​</a></h2>`);
  ssrRenderSuspense(_push, {
    default: () => {
      _push(ssrRenderComponent(_component_Mermaid, {
        id: "mermaid-24",
        class: "mermaid",
        graph: "graph%20TB%0A%20%20%20%20subgraph%20Offline%5B%22Offline%20%E2%80%94%20build-time%20pipeline%22%5D%0A%20%20%20%20%20%20%20%20FUI%5BFluentUI%20source%20repos%5D%20--%3E%20Scraper%5BScraper%3Cbr%2F%3Ets-morph%20extraction%5D%0A%20%20%20%20%20%20%20%20Scraper%20--%3E%20Raw%5B(fluentui-schema.json%3Cbr%2F%3Eraw)%5D%0A%20%20%20%20%20%20%20%20Raw%20--%3E%20Enhancer%5BEnhancer%3Cbr%2F%3ELLM%20enrichment%5D%0A%20%20%20%20%20%20%20%20Enhancer%20--%3E%20Enhanced%5B(fluentui-schema-enhanced.json%3Cbr%2F%3Ebundled)%5D%0A%20%20%20%20end%0A%0A%20%20%20%20subgraph%20Runtime%5B%22Runtime%20%E2%80%94%20MCP%20server%22%5D%0A%20%20%20%20%20%20%20%20Enhanced%20--%3E%20Loader%5BSchema%20Loader%20%2B%20Validator%5D%0A%20%20%20%20%20%20%20%20Loader%20--%3E%20Store%5BIn-memory%20SchemaStore%5D%0A%20%20%20%20%20%20%20%20Store%20--%3E%20Index%5BTF-IDF%20Search%20Index%5D%0A%20%20%20%20%20%20%20%20Store%20--%3E%20Tools%5B12%20MCP%20Tools%5D%0A%20%20%20%20%20%20%20%20Index%20--%3E%20Tools%0A%20%20%20%20%20%20%20%20Tools%20--%3E%20Formatters%5BMarkdown%20Formatters%5D%0A%20%20%20%20end%0A%0A%20%20%20%20Formatters%20--%3E%20Agent%5BAI%20Agent%20via%20stdio%2FMCP%5D%0A"
      }, null, _parent));
    },
    fallback: () => {
      _push(` Loading... `);
    },
    _: 1
  });
  _push(`<h2 id="key-components" tabindex="-1">Key Components <a class="header-anchor" href="#key-components" aria-label="Permalink to &quot;Key Components&quot;">​</a></h2><table tabindex="0"><thead><tr><th>Component</th><th>Location</th><th>Purpose</th></tr></thead><tbody><tr><td>Scraper</td><td><code>scripts/scraper/</code></td><td>Extract props/slots/stories/utilities from FluentUI source via ts-morph</td></tr><tr><td>Enhancer</td><td><code>scripts/enhancer/</code></td><td>Enrich the raw schema with LLM-generated descriptions, guides, and patterns</td></tr><tr><td>Schema subsystem</td><td><code>src/schema/</code></td><td>Loader, in-memory store, and lenient validator</td></tr><tr><td>Search</td><td><code>src/search/</code></td><td>TF-IDF search engine + index builder</td></tr><tr><td>Formatters</td><td><code>src/formatters/</code></td><td>Render schema entries to markdown for tool output</td></tr><tr><td>Tools</td><td><code>src/tools/</code></td><td>The 12 MCP tools (one file per tool)</td></tr><tr><td>Server core</td><td><code>src/server.ts</code></td><td>Tool manifest, state factory, dispatcher</td></tr><tr><td>Entry point</td><td><code>src/index.ts</code></td><td>Process/stdio-transport wiring</td></tr></tbody></table><h2 id="technology-decisions" tabindex="-1">Technology Decisions <a class="header-anchor" href="#technology-decisions" aria-label="Permalink to &quot;Technology Decisions&quot;">​</a></h2><p>See the <a href="/fluentui-mcp/decisions/">Architecture Decision Records</a> for the rationale behind the schema-as-source-of-truth design, the bundled enhanced JSON, the LLM provider model-family handling, and the in-memory TF-IDF search.</p><h2 id="getting-started" tabindex="-1">Getting Started <a class="header-anchor" href="#getting-started" aria-label="Permalink to &quot;Getting Started&quot;">​</a></h2><p>New to the project? Start with the <a href="/fluentui-mcp/guides/getting-started.html">Getting Started Guide</a>, then read the <a href="/fluentui-mcp/architecture/system-overview.html">System Overview</a> to understand how the pieces fit together.</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
