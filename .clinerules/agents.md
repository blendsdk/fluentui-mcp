# A.I Agent Instructions / Cline Instructions

## **🚨 ULTRA-CRITICAL RULE: ALWAYS CONSULT PROJECT DOCUMENTATION 🚨**

**Before implementing ANY feature, ALWAYS consult the project's documentation FIRST.**

**When working on ANY project:**

1. 🛑 **STOP** - Do not proceed with assumptions
2. 📖 **READ** - Check project README, docs folder, and existing code patterns
3. ✅ **VERIFY** - Confirm exact requirements and conventions
4. 🔍 **CROSS-REFERENCE** - Check existing implementations for patterns
5. 💭 **QUESTION** - Challenge any "obvious" assumptions

**This rule supersedes ALL other considerations. When uncertain about ANY feature or pattern, documentation consultation is MANDATORY.**

---

## **🚨 ULTRA-CRITICAL RULE: MANDATORY COMPLIANCE WITH CODE STANDARDS 🚨**

**In BOTH Plan Mode and Act Mode, you MUST consult and comply with `.clinerules/code.md` before ANY implementation or planning.**

### **MANDATORY Pre-Task Protocol (BOTH MODES):**

**Before ANY planning or implementation:**

1. 🛑 **STOP** - Do not proceed without compliance check
2. 📖 **READ CODE.MD** - Review relevant coding standards sections
3. 📖 **READ PROJECT DOCS** - Review any project-specific documentation
4. ✅ **VERIFY COMPLIANCE** - Ensure approach follows both documents
5. 💭 **DOCUMENT COMPLIANCE** - Explicitly state which rules/sections you're following

### **What MUST Be Checked:**

**📋 In code.md (.clinerules/code.md):**

- Testing requirements (Rules 4-8): All tests must pass, maximum coverage, end-to-end tests
- Code quality standards (Rules 1-3): DRY, clarity, single responsibility
- Documentation requirements (Rules 9-11): Comments, JSDoc, junior-dev readability
- Architecture standards (Rules 17-20): Inheritance chains for large implementations
- OOP rules (Rules 12-13): No private members, use protected instead
- Test file organization (Rule 29): Granular, logically grouped test files

### **Compliance in Plan Mode:**

**When creating ANY plan:**

1. ✅ **Reference code.md rules** - Cite specific rule numbers in your plan
2. ✅ **Reference project documentation** - Cite relevant docs/conventions
3. ✅ **Explain testing strategy** - Based on code.md Rules 4-8 and Rule 29
4. ✅ **Explain architecture strategy** - Based on code.md Rules 17-20 if >500 lines

**Example Plan Statement:**

```
Following code.md Rule 6 (maximum test coverage), Rule 7 (end-to-end tests),
and Rule 29 (test file organization), this implementation will include:
- Unit tests split across logically grouped files
- Integration tests for component interactions
- End-to-end test for complete workflow
```

### **Compliance in Act Mode:**

**When implementing ANY code:**

1. ✅ **Code.md Rule 4** - ALL tests must pass before completion
2. ✅ **Code.md Rule 6** - Create maximum test coverage
3. ✅ **Code.md Rule 9** - Add mandatory comments explaining WHY
4. ✅ **Code.md Rule 11** - Add JSDoc to all public/protected members
5. ✅ **Code.md Rule 29** - Split tests into logically grouped files

### **Violation Detection:**

**Signs you're violating this rule:**

❌ Writing code without JSDoc (violates code.md Rule 11)
❌ Writing code without tests (violates code.md Rules 4-8)
❌ Using "private" instead of "protected" (violates code.md Rule 12)
❌ Skipping comments for complex logic (violates code.md Rule 9)
❌ Putting all tests in one large file (violates code.md Rule 29)

### **Emergency Stop Protocol:**

**If you realize you've violated this rule:**

1. 🛑 **IMMEDIATE STOP** - Halt current work
2. 📖 **READ DOCUMENTS** - Review missed sections
3. 🔄 **REVISE APPROACH** - Fix non-compliant work
4. ✅ **VERIFY COMPLIANCE** - Check against documents
5. ⚡ **PROCEED ONLY AFTER FIX** - Don't continue with violations

---

## **CRITICAL RULE: Task Granularity & Architecture**

**To prevent AI context window limitations, ALL tasks must be broken down into granular subtasks with proper architecture.**

### Requirements:

- Each subtask must be completable within **50,000 tokens** of context
- Break tasks by logical boundaries: files, features, phases, or components
- Create explicit dependencies between subtasks
- Document clear completion criteria for each subtask
- Apply this rule in **BOTH Plan Mode AND Act Mode**
- **CRITICALLY IMPORTANT** Break down tasks in tiny, small, incremental, and manageable steps to prevent AI context limitations.

### How to Split Tasks:

1. **Identify the main goal** - What is the overall objective?
2. **Break into logical phases** - What are the major steps?
3. **Further subdivide each phase** - Can this step be smaller?
4. **Consider architecture** - Will implementation exceed 500 lines?
5. **Plan inheritance chain** - If large, design layer hierarchy
6. **Verify granularity** - Can this be completed in one focused session?

### Examples:

❌ **Too Large (Bad):**

- "Implement authentication system"
- "Build the API layer"
- "Add testing infrastructure"

✅ **Properly Granular (Good):**

- "Create user model type definitions"
- "Implement password hashing utility"
- "Build login endpoint handler"
- "Add session token generation"
- "Create authentication middleware"

### **Architecture Strategy for Large Implementations:**

**When Implementation Will Exceed 500 Lines:**

✅ **Use Inheritance Chain Architecture:**

- Design: `BaseClass → Layer1 → Layer2 → ConcreteClass`
- Each layer: 200-500 lines maximum
- Natural dependencies: each layer builds on previous
- Perfect for AI context window limitations

**Example: Service Layer Implementation**

```
Phase 1: BaseService (core utilities)
Phase 2: DataService extends BaseService
Phase 3: ValidationService extends DataService
Phase 4: BusinessService extends ValidationService
Phase 5: ApiService extends BusinessService
```

**Benefits:**

- Each phase fits in AI context window
- Clean separation of concerns
- Easy to test each layer independently
- Future extensions just add to appropriate layer

---

## **🚨 ULTRA-CRITICAL RULE FOR ACT MODE: ALWAYS SPLIT TASKS INTO SMALL GRANULAR STEPS 🚨**

**When in Act Mode, if a task is SLIGHTLY LARGE, you MUST split it into small, granular steps to prevent AI context window limitations.**

### **MANDATORY Act Mode Task Splitting:**

**Before executing ANY task in Act Mode:**

1. ⚠️ **ASSESS COMPLEXITY** - Is this task slightly large or complex?
2. 🔪 **SPLIT IMMEDIATELY** - Break into smallest possible subtasks
3. 📋 **CREATE CHECKLIST** - List all granular steps with task_progress
4. ⚡ **EXECUTE ONE AT A TIME** - Complete each step fully before moving on
5. ✅ **VERIFY EACH STEP** - Test and validate before proceeding

### **Objective Task Size Criteria - A Task is "LARGE" When It Meets ANY:**

- **Files:** Touches 6 or more files
- **Lines:** Adds/modifies 200+ lines of code
- **Time:** Estimated to take more than 2 hours
- **Concerns:** Involves 3 or more logical concerns/features
- **Complexity:** Contains complex algorithms or intricate logic
- **Integration:** Requires integration across multiple components
- **Uncertainty:** Any significant uncertainty about scope or approach

### **How to Split in Act Mode:**

**❌ WRONG - Executing Large Task Directly:**

```
Task: "Implement user authentication"
→ Proceed with entire implementation at once
→ RISK: Context window overflow, incomplete implementation
```

**✅ CORRECT - Split into Granular Steps:**

```
Step 1: Read and analyze existing auth infrastructure
Step 2: Create test file with 5 simple auth test cases
Step 3: Implement password hashing only
Step 4: Run tests and verify hashing works
Step 5: Implement token generation
Step 6: Run tests and verify tokens work
Step 7: Implement session management
... continue with small incremental steps
```

### **Act Mode Step Size Guidelines:**

- Each step should take **10-20 minutes maximum**
- Each step should touch **1-3 files**
- Each step should add **50-150 lines** of code
- Each step must be **immediately testable**
- Each step must have **clear success criteria**

### **Emergency Split Protocol:**

**If you find yourself in Act Mode with a large task:**

1. 🛑 **IMMEDIATE PAUSE** - Stop current implementation
2. 🔪 **DECOMPOSE** - Break into smallest possible steps
3. 📋 **DOCUMENT STEPS** - Update task_progress with granular checklist
4. ⚡ **RESTART WITH STEP 1** - Begin with first small step only
5. ✅ **COMPLETE EACH STEP** - Verify before moving to next

**This rule is ABSOLUTELY CRITICAL for Act Mode success. Task splitting prevents context window overflow and ensures complete, high-quality implementations.**

---

## **🚨 ULTRA-CRITICAL RULE: MULTI-SESSION TASK EXECUTION 🚨**

**Medium to large tasks MUST be executed across MULTIPLE SESSIONS. This is ABSOLUTELY NON-NEGOTIABLE.**

### **Why Multi-Session Execution is MANDATORY:**

1. **AI Context Limitations** - Large tasks exceed context window capacity
2. **Quality Assurance** - Smaller sessions produce higher quality output
3. **Error Prevention** - Prevents incomplete or broken implementations
4. **Progress Tracking** - Clear milestones between sessions
5. **Recovery** - Easier to recover from mistakes in smaller increments

### **Session Execution Rules:**

**🔴 CRITICAL: One Session = One Small Deliverable**

1. **✅ Each session MUST complete a SINGLE, focused deliverable**
   - One test file section (15-30 tests max)
   - One feature implementation
   - One component or module
   - One refactoring task

2. **✅ Each session MUST end with `attempt_completion`**
   - Present what was accomplished
   - List what remains for future sessions
   - Verify tests pass for completed work

3. **✅ User MUST start new session for next deliverable**
   - Fresh context window
   - Clean conversation history
   - New task_progress checklist

### **When to Split Into Multiple Sessions:**

**A task REQUIRES multiple sessions when ANY of these apply:**

| Criteria | Threshold | Sessions Needed |
|----------|-----------|-----------------|
| Test count | >30 tests | 1 session per 15-30 tests |
| Files | >3 files | 1 session per 2-3 files |
| Lines of code | >200 lines | 1 session per 100-200 lines |
| Complexity | High | Split by logical concern |
| Time estimate | >30 minutes | 1 session per 20-30 min |

### **Multi-Session Workflow:**

**Session N:**
```
1. Start with: clear && scripts/agent.sh start
2. Review task_progress from previous session (if applicable)
3. Execute ONLY the current session's deliverable
4. Run tests: clear && yarn clean && yarn build && yarn test
5. End with: clear && scripts/agent.sh finished
6. Call attempt_completion with session results
7. List remaining work for future sessions
8. User runs /compact
```

**User Action Between Sessions:**
```
1. Review completed work
2. Start new conversation/task
3. Reference this plan for next session
```

### **Session Deliverable Guidelines:**

| Task Type | Max Per Session | Session Deliverable |
|-----------|-----------------|---------------------|
| Unit Tests | 15-30 tests | One describe() block |
| Implementation | 100-200 lines | One method/function |
| Refactoring | 2-3 files | One concern |
| Documentation | 1-2 sections | One topic |
| Bug Fixes | 1-2 bugs | One fix with tests |

### **Multi-Session Progress Tracking:**

**At the START of each session, include:**
```markdown
## Multi-Session Progress

**Overall Task:** [Task name]
**Total Sessions Planned:** [N]
**Current Session:** [X of N]
**Previous Sessions Completed:**
- Session 1: ✅ [Deliverable 1]
- Session 2: ✅ [Deliverable 2]
- Session 3: ⏳ [Current deliverable]

**This Session's Goal:** [Specific deliverable]
```

**At the END of each session, include:**
```markdown
## Session Complete

**Completed:** [What was done]
**Tests Added:** [Count]
**Tests Passing:** [Status]
**Remaining Sessions:**
- Session 4: [Deliverable 4]
- Session 5: [Deliverable 5]

**User Action:** Start new task for Session 4
```

### **Enforcement:**

**This rule is ABSOLUTELY MANDATORY and NON-NEGOTIABLE.**

**If you find yourself:**
- ❌ Writing more than 30 tests in one session → STOP, split
- ❌ Touching more than 3 files → STOP, split
- ❌ Writing more than 200 lines → STOP, split
- ❌ Working for what feels like a long time → STOP, split

**Immediate Action:**
1. 🛑 STOP current work
2. 📋 Document what's complete
3. ✅ Verify completed work passes tests
4. 🏁 Call attempt_completion with partial results
5. 📝 List remaining work for next session

---

## **IMPORTANT RULES**

These rules are **mandatory** and must be applied **strictly and consistently**.

---

### **Rule 1: Shell Commands & Package Management**

**CRITICAL:** All shell command execution must follow these strict rules:

**Shell Command Requirements:**

1. **✅ Always prefix shell commands with `clear &&`**
   - Every `execute_command` must start with `clear &&`
   - This ensures a clean terminal for each command
   - Example: `clear && yarn build` NOT `yarn build`

2. **✅ Use YARN exclusively - NEVER use NPM or NPX**
   - ❌ Never use: `npm install`, `npm run`, `npx`
   - ✅ Always use: `yarn install`, `yarn run`, `yarn`
   - ❌ Never use: `npx create-react-app`
   - ✅ Always use: `yarn create react-app`

3. **✅ Standard test command from project root**
   - For building and testing: `clear && yarn clean && yarn build && yarn test`
   - This runs all packages and ensures complete build/test cycle
   - Always run from project root

**Examples:**

❌ **Wrong:**

```bash
npm test
npx vitest
yarn test
```

✅ **Correct:**

```bash
clear && yarn test
clear && yarn clean && yarn build && yarn test
clear && yarn install
```

**Purpose:** These rules ensure consistent environment, clean terminal output, and proper package management across the entire project.

---

### **Rule 2: Internal Self-Check**

Before providing any response, perform an **internal self-check** by asking yourself:

1. **"Do I fully understand this request?"**
   - Is the goal clear?
   - Are there ambiguous terms?
   - Do I know what success looks like?

2. **"Are there any questions I need to ask the user?"**
   - Is critical information missing?
   - Are there multiple valid interpretations?
   - Could clarification improve the outcome?

**Purpose:** This ensures thorough analysis and prevents wasted effort on misunderstood requirements.

**When to Ask Questions:**

- ✅ When requirements are ambiguous or incomplete
- ✅ When multiple approaches exist and user preference matters
- ✅ When critical details are missing
- ❌ Don't ask about information that can be reasonably inferred from context

---

### **Rule 3: Enhance Requirements**

If you identify issues with the user's request:

**Do:**

- Ask clarifying questions to eliminate ambiguity
- Suggest improvements to requirements if they're unclear or incomplete
- Propose alternative approaches if current approach has issues
- Ensure you understand full scope before creating implementation plans

**Example:**

User says: _"Add error handling"_

❌ **Bad Response:** Proceed without clarification

✅ **Good Response:**

- "What types of errors should be handled?"
- "Should errors be logged, displayed to user, or both?"
- "Are there specific error recovery strategies needed?"

---

### **Rule 4: Verify Previous Task Completion**

Before starting any new task implementation, **verify the previous task was fully completed**:

**Verification Checklist:**

1. ✅ Review the codebase against the previous task's requirements
2. ✅ Confirm all deliverables were implemented
3. ✅ Check that tests pass (if applicable)
4. ✅ Verify no partial implementations or TODOs were left behind
5. ✅ Ensure documentation was updated (if required)

**Purpose:** Prevents cascading failures where incomplete work causes issues in subsequent tasks.

**What to Do if Previous Task is Incomplete:**

- Alert the user immediately
- List what's missing or incomplete
- Ask whether to complete the previous task first or proceed anyway

---

### **Rule 5: Update Task Plan Documents**

Track progress by updating task plan documents throughout implementation:

**How to Update:**

1. **Locate the plan document** - Usually in project's plans directory
2. **Find the relevant task** - Match by task number or description
3. **Update completion status** - Mark checkboxes as tasks complete
4. **Add notes if needed** - Document any deviations or issues

**Example Update:**

```
- [x] Task 1.1: Create type definitions ✅
- [x] Task 1.2: Implement utility functions ✅
- [ ] Task 1.3: Add integration tests ⏳ (in progress)
```

**If no plan document exists:**

- Maintain progress using the `task_progress` parameter in tool calls
- Update it with each significant milestone

---

### **Rule 6: Final Verification Before Completion**

Before marking any task as complete or calling `attempt_completion`, perform a **comprehensive final check**:

**Final Verification Checklist:**

1. **✅ Requirements Met**
   - Re-read the original user request
   - Verify every requirement is satisfied
   - Check for any overlooked details

2. **✅ Code Quality**
   - Code follows project standards (see code.md)
   - No obvious bugs or issues
   - No debugging code or console.logs left behind

3. **✅ Testing**
   - All relevant tests pass
   - New tests added where appropriate
   - Tests are split into logically grouped files
   - No flaky or failing tests

4. **✅ Edge Cases**
   - Consider boundary conditions
   - Handle error scenarios
   - Account for unexpected inputs

5. **✅ Documentation**
   - Comments explain complex logic
   - JSDoc is complete and accurate
   - README or docs updated if needed

6. **✅ Completeness**
   - No TODO comments for current task
   - No partial implementations
   - No missing functionality

**If ANY item fails verification:**

- ❌ Do NOT call attempt_completion
- ✅ Fix the issue first
- ✅ Re-run the verification checklist

---

### **Rule 7: NEVER Overcomplicate - Use Existing Infrastructure**

**CRITICAL:** Always use existing infrastructure and avoid unnecessary complexity.

**Mandatory Approach:**

1. **✅ Always use existing tools and infrastructure FIRST**
   - ✅ Use existing utility functions, not reimplementations
   - ✅ Use existing test patterns, not custom test frameworks
   - ✅ Use existing error handling patterns, not new approaches
   - ✅ Use existing validation libraries, not custom validators

2. **❌ NEVER create custom solutions when standard ones exist**
   - ❌ Don't write custom utilities when existing ones work
   - ❌ Don't create custom test helpers when existing patterns work
   - ❌ Don't reinvent patterns when established ones exist
   - ❌ Don't create custom error handling when standard patterns exist

3. **✅ Keep implementations simple and focused**
   - ✅ Follow the principle of least complexity
   - ✅ Use the most straightforward approach that works
   - ✅ Leverage existing architecture and patterns
   - ✅ Question any custom or complex solutions

**Purpose:** Prevents wasted AI resources, reduces complexity, improves maintainability, and leverages battle-tested existing code.

---

### **Rule 8: Act Mode VS Code Settings Automation**

**CRITICAL:** In Act Mode ONLY, automatically manage VS Code settings for optimal development workflow:

**Act Mode Requirements:**

1. **✅ Execute `clear && scripts/agent.sh start` as THE VERY FIRST COMMAND of any Act Mode task**
   - This MUST be the first command executed when starting any task in Act Mode
   - Switches VS Code to development mode (settings.json.cline → settings.json)
   - Provides optimal settings for AI-assisted development

2. **✅ Execute `clear && scripts/agent.sh finished` as THE VERY LAST COMMAND of any Act Mode task**
   - This MUST be the last command executed when completing any task in Act Mode
   - Switches VS Code to completion mode (settings.json.auto → settings.json)
   - Enables full linting, formatting, and code cleanup

3. **✅ Review and analyze code.md to apply the rules described in code.md strictly for each task**

**Workflow Pattern:**

```bash
# FIRST COMMAND - Start of any Act Mode task
clear && scripts/agent.sh start

# ... perform all task implementation work ...

# LAST COMMAND - End of any Act Mode task
clear && scripts/agent.sh finished
```

**When NOT to Apply:**

- ❌ Do not use in Plan Mode (planning doesn't require setting changes)
- ❌ Do not use if already in the middle of a task (only at start/end boundaries)

**Purpose:** Automatically optimizes VS Code environment for development vs completion phases.

---

### **Rule 9: Compact Conversation After Task Completion**

**CRITICAL:** After successfully completing any task in Act Mode, compact the conversation to optimize context management:

**CRITICAL: Post-Completion Requirement:**

1. **CRITICAL: MUST run `/compact` after `attempt_completion` is successful**
   - This MUST be done after the task is fully verified and completed
   - Compacts the conversation history to optimize AI context
   - Ensures efficient context management for future tasks

**Workflow Pattern:**

```bash
# 1. Complete all task work
# 2. Run final verification (Rule 6)
# 3. Execute agent.sh finished (Rule 8)
# 4. Call attempt_completion with results
# 5. After successful completion, run /compact
```

**WHEN to Compact (MUST apply):**

- ✅ After any successfully completed Act Mode task
- ✅ After calling attempt_completion
- ✅ Task is self-contained and complete

**WHEN NOT to Compact (MUST NOT apply):**

- ❌ In the middle of a multi-phase implementation
- ❌ Before task verification is complete
- ❌ During Plan Mode (no implementation work to compact)
- ❌ User explicitly requests follow-up questions
- ❌ Task is part of ongoing work in current session

**Purpose:** Optimizes conversation context, reduces token usage, and maintains clean context boundaries between completed tasks.

---

### **Rule 10: ES Module Syntax for Node Debug Commands**

**CRITICAL:** When generating quick debug commands with `node -e` for ES module projects, ALWAYS use ES module syntax.

**Context:** Many TypeScript projects are configured with `"type": "module"` in package.json, making all code ES modules by default. CommonJS (`require`) syntax causes compatibility issues.

**ES Module Requirements:**

1. **✅ Always use ES module imports in `node -e` commands**
   - ✅ Use: `import { module1 } from './dist/file.js'`
   - ❌ Never use: `const { module1 } = require('./dist/file.js')`

2. **✅ Proper ES module command structure**
   - Use `--input-type=module` flag if needed for Node.js compatibility
   - Include `.js` extensions in import paths
   - Wrap in async context when using top-level await

**Examples:**

❌ **Wrong (CommonJS - causes errors in ES module projects):**

```bash
node -e "const { Service } = require('./dist/file.js'); console.log(Service);"
```

✅ **Correct (ES Module):**

```bash
node --input-type=module -e "import { Service } from './dist/file.js'; console.log(Service);"
```

**Purpose:** Ensures debugging commands work correctly with ES module-configured projects.

---

## **Summary: Applying These Rules**

**Every Single Time You Respond:**

0. 📖 **MANDATORY FIRST:** Consult code.md + project docs (BOTH Plan AND Act Mode)
1. 🔧 Follow shell command rules (Rule 1 - use `clear &&` and yarn only)
2. 🧠 Perform internal self-check (Rule 2)
3. 💡 Enhance requirements if unclear (Rule 3 - Plan Mode)
4. ✅ Verify previous work is complete (Rule 4 - before new tasks)
5. 📝 Update task progress (Rule 5 - during implementation)
6. 🔍 Final verification before completion (Rule 6 - before finishing)
7. 🚫 **NEVER overcomplicate** - Use existing infrastructure (Rule 7 - simplicity first)
8. ⚙️ **Act Mode ONLY:** Execute agent.sh commands (Rule 8 - start/finish settings)
9. 🗜️ **After task completion:** Run `/compact` to optimize context (Rule 9 - conversation compaction)
10. 📦 **ES modules for debug:** Use import syntax in `node -e` commands (Rule 10 - ES module projects)

**Remember:** These rules exist to ensure high-quality, complete implementations. Following them prevents errors, rework, and wasted effort.

---

## **Cross-References**

- See **plans.md** for detailed guidance on creating implementation plans with proper task breakdown
- See **code.md** for coding standards, testing requirements, and quality guidelines
- See **git.md** for git workflow instructions