import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Architecture Decision Records","description":"","frontmatter":{},"headers":[],"relativePath":"decisions/index.md","filePath":"decisions/index.md","lastUpdated":null}');
const _sfc_main = { name: "decisions/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="architecture-decision-records" tabindex="-1">Architecture Decision Records <a class="header-anchor" href="#architecture-decision-records" aria-label="Permalink to &quot;Architecture Decision Records&quot;">​</a></h1><p>This log tracks the significant architecture and design decisions made for <code>fluentui-mcp</code>. Each decision is documented with its context, the options considered, and the rationale.</p><h2 id="decision-log" tabindex="-1">Decision Log <a class="header-anchor" href="#decision-log" aria-label="Permalink to &quot;Decision Log&quot;">​</a></h2><table tabindex="0"><thead><tr><th>#</th><th>Date</th><th>Decision</th><th>Status</th></tr></thead><tbody><tr><td><a href="./ADR-001-schema-as-source-of-truth.html">ADR-001</a></td><td>2026-06-04</td><td>Schema as the single source of truth</td><td>✅ Accepted</td></tr><tr><td><a href="./ADR-002-bundled-enhanced-json.html">ADR-002</a></td><td>2026-06-04</td><td>Ship a bundled enhanced JSON; enrich offline</td><td>✅ Accepted</td></tr><tr><td><a href="./ADR-003-llm-provider-model-family.html">ADR-003</a></td><td>2026-06-04</td><td>LLM provider model-family request shaping</td><td>✅ Accepted</td></tr><tr><td><a href="./ADR-004-tfidf-in-memory-search.html">ADR-004</a></td><td>2026-06-04</td><td>TF-IDF in-memory search</td><td>✅ Accepted</td></tr></tbody></table><h2 id="how-to-read-adrs" tabindex="-1">How to Read ADRs <a class="header-anchor" href="#how-to-read-adrs" aria-label="Permalink to &quot;How to Read ADRs&quot;">​</a></h2><p>Each ADR follows a standard format:</p><ul><li><strong>Context</strong> — What situation or problem triggered this decision?</li><li><strong>Decision</strong> — What was decided?</li><li><strong>Rationale</strong> — Why was this chosen over alternatives?</li><li><strong>Consequences</strong> — What are the trade-offs and implications?</li></ul><h2 id="when-to-create-an-adr" tabindex="-1">When to Create an ADR <a class="header-anchor" href="#when-to-create-an-adr" aria-label="Permalink to &quot;When to Create an ADR&quot;">​</a></h2><p>Create a new ADR when:</p><ul><li>Choosing a technology, framework, or library;</li><li>Deciding on an architecture pattern or style;</li><li>Choosing between multiple valid approaches;</li><li>Making a decision that would be hard to reverse;</li><li>Making a decision that future developers will question.</li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("decisions/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
