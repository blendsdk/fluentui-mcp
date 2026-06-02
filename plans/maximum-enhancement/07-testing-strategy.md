# Testing Strategy: Maximum Enhancement

> **Document**: 07-testing-strategy.md
> **Parent**: [Index](00-index.md)

## Testing Overview

### Coverage Goals

- Unit tests: high coverage on new capacity, grounding, schema, validator logic.
- Integration: enhancer orchestration with the mock provider (continuation path).
- Regression: all existing tests pass (updated where shapes changed).

## 🚨 Specification Test Cases (MANDATORY)

> Derived from `01-requirements.md`, `03`–`06`, `08`, and the Ambiguity Register.
> IMMUTABLE ORACLE: implementation conforms to these, not vice versa.

### Phase 1 — LLM Capacity

| # | Input / Scenario | Expected Output / Behavior | Source |
|---|------------------|----------------------------|--------|
| ST-1 | `findJsonEnd('{"a":1}')` | Returns index of final `}` (balanced) | 03 / AR #1 |
| ST-2 | `findJsonEnd('{"a":"}{"')` | Ignores braces inside strings; balanced → valid end index | 03 / AR #1 |
| ST-3 | `findJsonEnd('{"a":1')` | Returns `-1` (incomplete) | 03 / AR #1 |
| ST-4 | `isLikelyComplete` on truncated JSON | Returns `false` | 03 / AR #1 |
| ST-5 | `repairJson('{"a":"unterminated')` | Returns parseable JSON (closes string+object) | 03 / AR #1 |
| ST-6 | `chatComplete` with mock returning JSON split across 3 turns | Stitched content parses to the intended object | 03 / AR #1 |
| ST-7 | `resolveEnhancerConfig` with `LLM_MAX_TOKENS=12000` | `config.maxTokens === 12000` | 03 / AR #1 |
| ST-8 | `resolveEnhancerConfig` with no env | `config.maxTokens === undefined` (⇒ provider uses model ceiling) | 03 / PF-005 |
| ST-9 | OpenAI provider `chat` (`gpt-4o`) with no `maxTokens` | request body `max_tokens === 16384` (model ceiling) | 03 / PF-002 |
| ST-10 | Anthropic provider `chat` (`claude-3-5-sonnet`) with no `maxTokens` | request body `max_tokens === 8192` (model ceiling) | 03 / PF-002 |
| ST-9b | `resolveMaxTokens('gpt-4-turbo', 16384)` | clamped to `4096` (never exceeds model limit) | 03 / PF-002 |
| ST-9c | `resolveMaxTokens('unknown-model', undefined)` | `FALLBACK_OUTPUT_CEILING` (4096) | 03 / PF-002 |
| ST-6b | `chatComplete` continuation turns | continuation calls use plain-text mode (`responseFormat !== 'json'`, no `json_object`) | 03 / PF-001 |
| ST-6c | `chatComplete` that never completes via continuation | escalates to a re-request, then `repairJson`, and increments `repairsUsed` | 03 / PF-003 |

### Phase 2 — Grounding Data


| # | Input / Scenario | Expected Output / Behavior | Source |
|---|------------------|----------------------------|--------|
| ST-11 | `toComponentSummary` on a component with 20 props | summary `props.length === 20` (no cap) | 04 / AR #6 |
| ST-12 | `toComponentSummary` output | includes `slots`, `relatedComponents`, `additionalExports` | 04 / AR #7 |
| ST-13 | `serializeComponentSummaries` | contains every prop name AND its type | 04 / AR #6 |
| ST-14 | `serializeComponentForPrompt` | contains full story `code` (not only renderCode) | 04 / AR #4 |
| ST-15 | Guide context with `targetComponentIds:['button']` | `targetComponents` includes the Button entry | 04 / AR #3 |
| ST-16 | Guide context with unknown id `['nope']` | id skipped, no throw | 04 / AR #3 |
| ST-17 | `KEY_PROPS_LIMIT` | symbol does not exist anywhere in repo | 04 / AR #6 |
| ST-17b | Guide builder when full inventory exceeds `GROUNDING_INPUT_BUDGET_TOKENS` | targeted components stay full-fidelity; non-targeted degrade to compact lines | 04 / PF-008 |
| ST-17c | Guide builder when inventory fits the budget | full inventory emitted (no degradation) | 04 / PF-008 |


### Phase 3/4 — Schema & Validator

| # | Input / Scenario | Expected Output / Behavior | Source |
|---|------------------|----------------------------|--------|
| ST-18 | `mapComponentEnhanced` with new raw fields present | new fields copied to output | 05 / AR #2 |
| ST-19 | `mapComponentEnhanced` with new raw fields absent | new fields `undefined`, no throw | 05 / AR #2 |
| ST-20 | Validate enhanced schema lacking new fields | 0 errors (back-compat) | 05 / AR #2 |
| ST-21 | Validate component with `propGuidance.prop` unknown | exactly 1 warning, 0 errors | 05 / AR #2 |
| ST-22 | Validate component with valid new fields | 0 errors, 0 warnings | 05 / AR #2 |

### Phase 5 — Prompts

| # | Input / Scenario | Expected Output / Behavior | Source |
|---|------------------|----------------------------|--------|
| ST-23 | `buildComponentEnhanceMessages` system prompt | contains `propGuidance`, `antiPatterns`, `compositionExamples`, and the self-check block | 06 / AR #2 |
| ST-24 | `buildUtilityEnhanceMessages` system prompt | contains `exportGuidance` + self-check | 06 / AR #2 |
| ST-25 | `buildPatternGuideMessages` user content (targeted) | includes targeted component full data | 06 / AR #3 |
| ST-26 | Every `buildXxxMessages` | system prompt still says "ONLY valid JSON" | 06 / AR #1 |

### Phase 7 — Formatters & Tools

| # | Input / Scenario | Expected Output / Behavior | Source |
|---|------------------|----------------------------|--------|
| ST-27 | Component formatter with new fields | renders anti-patterns, perf, theming, compositions sections | 08 / AR #2 |
| ST-28 | Component formatter without new fields | omits those sections, no error | 08 / AR #2 |
| ST-29 | `get_props_reference` / `query_component` output | includes propGuidance when present | 08 / AR #2 |
| ST-30 | Guide formatter with new fields | renders `keyTakeaways`, `pitfalls`, `accessibilityNotes`; omits them when absent (no error) | 08 / PF-004 |
| ST-31 | Pattern formatter with new fields | renders `whenToUse`, `whenNotToUse`, `pitfalls`, `accessibilityNotes`; omits them when absent (no error) | 08 / PF-004 |

## Test Categories


### Specification Tests (BEFORE implementation)

| Test File | ST Cases | Component |
|-----------|----------|-----------|
| `src/__tests__/enhancer/capacity.spec.test.ts` | ST-1..ST-10, ST-9b/9c, ST-6b/6c | LLM capacity |
| `src/__tests__/enhancer/grounding.spec.test.ts` | ST-11..ST-17, ST-17b/17c | Grounding data |
| `src/__tests__/schema/schema-expansion.spec.test.ts` | ST-18..ST-22 | Schema/validator |
| `src/__tests__/enhancer/prompts-max.spec.test.ts` | ST-23..ST-26 | Prompts |
| `src/__tests__/formatters/enriched-formatter.spec.test.ts` | ST-27..ST-31 | Formatters/tools |


### Implementation Tests (AFTER implementation)

| Test File | Description | Priority |
|-----------|-------------|----------|
| `src/__tests__/enhancer/capacity.impl.test.ts` | Edge cases: nested strings, escaped quotes, max-rounds exhaustion | High |
| `src/__tests__/enhancer/grounding.impl.test.ts` | Empty props/slots, very large inventories | Med |

### Integration Tests

| Test | Components | Description |
|------|-----------|-------------|
| enhancer + mock provider | enhancer.ts, complete.ts | Full run with a mock that truncates once, verifies stitched output and new fields populate |

### End-to-End

| Scenario | Steps | Expected Result |
|----------|-------|-----------------|
| Live `--full` run | `yarn enhance --version v9 --full` with gpt-4o | Valid enhanced schema, 0 validation errors, new fields populated |

## Verification Checklist

- [ ] All ST cases defined with concrete input/output
- [ ] Spec tests written BEFORE implementation; verified to FAIL (red)
- [ ] All spec tests pass after implementation (green)
- [ ] Impl tests written for edge cases
- [ ] All existing tests pass (no regressions)
- [ ] `yarn build && yarn test` green
