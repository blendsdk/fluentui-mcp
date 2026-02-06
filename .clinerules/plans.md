### A.I Agent Instructions for Creating Implementation Plans

## **IMPORTANT**

These rules are **mandatory** and must be applied **strictly and consistently** when creating implementation plans.

---

## **Rules for Implementation Plans**

### **Rule 1: Split Plans into Logical Phases**

When asked to create implementation plans, always split the plan into **logical phases** that can be implemented sequentially.

**What Makes a Good Phase:**

- ✅ Represents a complete, cohesive unit of work
- ✅ Has clear start and end points
- ✅ Can be implemented and tested independently
- ✅ Builds upon previous phases
- ✅ Typically takes 2-5 tasks to complete

**Examples:**

❌ **Bad Phase Breakdown:**

- Phase 1: "Build everything"
- Phase 2: "Test and deploy"

✅ **Good Phase Breakdown:**

- Phase 1: Core Data Models
- Phase 2: Service Layer Implementation
- Phase 3: API Endpoints
- Phase 4: Authentication & Authorization
- Phase 5: Testing Infrastructure

---

### **Rule 2: Define Phase Dependencies**

For each phase, explicitly define dependencies from the previous phase.

**How to Document Dependencies:**

```markdown
## Phase 2: Service Layer Implementation

**Dependencies:**

- Phase 1 must be complete (data models available)
- Type definitions from Phase 1.2 must be tested
- Base interfaces from Phase 1.3 must be documented

**What This Phase Provides for Next Phase:**

- Complete service layer infrastructure
- Data validation capabilities
- Error handling mechanisms
```

---

### **Rule 3: Provide Context and Reasoning**

Provide detailed context and reasoning for each phase.

**What to Include:**

- **Why this phase is needed** - Business/technical justification
- **What problem it solves** - Specific issues being addressed
- **Key decisions made** - Architecture choices and rationale
- **Potential challenges** - Known risks or complexities
- **Success criteria** - How to verify phase completion

**Example:**

```markdown
## Phase 1: Core Data Models

**Context:**
The data models are the foundation for all services and API endpoints.
We need strong type definitions to ensure type safety throughout the application.

**Reasoning:**
Starting with models allows us to:

1. Define clear contracts for all components
2. Enable better IDE support during development
3. Catch errors at compile-time rather than runtime

**Key Decision:**
Use TypeScript interfaces with proper type guards to enable exhaustive
type checking and runtime validation.
```

---

### **Rule 4: Define Clear Deliverables**

Each phase must have **clear, measurable deliverables**.

**Examples:**

❌ **Vague Deliverables:**

- "Service improvements"
- "Better error handling"
- "Code cleanup"

✅ **Clear Deliverables:**

- Complete TypeScript type definitions for all data models
- Service layer that handles CRUD operations with proper validation
- Error handling that provides meaningful error messages to clients
- 95%+ test coverage for service methods

---

### **Rule 5: Create Granular Tasks**

**IMPORTANT:** Create small, **granular**, and manageable tasks. More tasks are better than a few large tasks.

**Task Granularity Guidelines:**

- Each task should be completable within **2-4 hours** of work
- Each task should touch **5-15 files maximum**
- Each task should have **one clear objective**
- Each task should produce **testable output**

**Examples:**

❌ **Too Large (Bad):**

- "Implement the service layer" (too broad)
- "Add error handling system" (too vague)
- "Build authentication with OAuth" (too complex)

✅ **Properly Granular (Good):**

- "Create User model type definitions"
- "Implement UserService.create() with validation"
- "Add error handling for duplicate email registration"
- "Create validation utilities for user input"
- "Write unit tests for user creation flow"

---

### **Rule 6: Task Numbering Convention**

Tasks **must** have a sequence number in the format: `Task [Phase].[Number]`

**Format:**

```
Task 1.1, Task 1.2, Task 1.3  (Phase 1, tasks 1-3)
Task 2.1, Task 2.2, Task 2.3  (Phase 2, tasks 1-3)
```

**Example:**

```markdown
### Phase 1: Core Data Models

- Task 1.1: Create base entity types
- Task 1.2: Define User model types
- Task 1.3: Define Product model types
- Task 1.4: Add type guards and validation

### Phase 2: Service Layer

- Task 2.1: Implement base service class
- Task 2.2: Add UserService methods
- Task 2.3: Add ProductService methods
```

---

### **Rule 7: Task Presentation Format**

**IMPORTANT:** Place all tasks in a **table format** at the end of each plan with completion checkboxes.

**Required Format:**

```markdown
## Task Implementation Checklist

| Task | Description                  | Dependencies     | Status |
| ---- | ---------------------------- | ---------------- | ------ |
| 1.1  | Create base entity types     | None             | [ ]    |
| 1.2  | Define User model types      | 1.1              | [ ]    |
| 1.3  | Define Product model types   | 1.1              | [ ]    |
| 1.4  | Add type guards              | 1.1, 1.2, 1.3    | [ ]    |
| 2.1  | Implement base service       | Phase 1 complete | [ ]    |
| 2.2  | Add UserService methods      | 2.1              | [ ]    |

**Legend:**

- [ ] Not started
- [x] Complete
```

**Why This Format:**

- ✅ Clear visual overview of all tasks
- ✅ Easy to track progress
- ✅ Dependencies are explicit
- ✅ Can be updated incrementally

---

### **Rule 8: Granular Testing Requirements**

**IMPORTANT:** It is critical to have **granular tests and testing** for each task.

**Testing Guidelines:**

1. **Each task must specify its testing requirements**

   ```markdown
   Task 1.1: Create base entity types
   Tests: Unit tests for type creation, property access, type guards
   Coverage: 100% for public APIs
   ```

2. **Test types per task:**
   - **Unit tests** - Test individual functions/classes
   - **Integration tests** - Test component interactions
   - **End-to-end tests** - Test complete workflows

3. **Test granularity:**
   - Each task should add 5-20 test cases
   - Tests should be specific to that task's functionality
   - Tests should be automated and reproducible

4. **Test file organization:**
   - Tests MUST be split into logically grouped files
   - See code.md Rule 29 for detailed test file organization requirements

**Example Task with Testing:**

```markdown
Task 2.2: Implement UserService.create() method

**Implementation:**

- Validate user input data
- Check for duplicate emails
- Hash password securely
- Create user record

**Tests:** (in separate test files per concern)

- user.creation.test.ts: Basic user creation, required fields
- user.validation.test.ts: Input validation, email format
- user.duplicates.test.ts: Duplicate email handling
- user.integration.test.ts: Full creation flow with database
- Coverage target: 95%+
```

---

### **Rule 9: Pre-Implementation Re-evaluation**

**IMPORTANT:** Always re-evaluate the implementation plan before implementing, to be absolutely sure nothing was missed and to identify inconsistencies.

**Re-evaluation Checklist:**

1. **✅ Completeness**
   - Are all requirements from original request covered?
   - Are there any missing features or edge cases?
   - Is each phase fully specified?

2. **✅ Task Granularity**
   - Are tasks small enough (2-4 hours each)?
   - Can each task be tested independently?
   - Are there any tasks that should be split further?

3. **✅ Dependencies**
   - Are all task dependencies documented?
   - Is the dependency order logical?
   - Are there any circular dependencies?

4. **✅ Testing Coverage**
   - Does every task have testing requirements?
   - Are test types appropriate for each task?
   - Is coverage realistic and measurable?
   - Are tests split into logically grouped files?

5. **✅ Consistency**
   - Do task numbers follow the convention?
   - Are naming patterns consistent?
   - Is the table format correct?

6. **✅ Feasibility**
   - Can this plan actually be implemented?
   - Are time estimates reasonable?
   - Are there any blocking technical issues?

7. **✅ Architecture Assessment**
   - Will any implementation exceed 500 lines?
   - Is inheritance chain architecture planned?
   - Are layer dependencies clearly defined?

**When to Re-evaluate:**

- ✅ Before starting Phase 1
- ✅ After completing each phase (before starting next)
- ✅ When requirements change
- ✅ When discovering new technical constraints

---

### **Rule 10: Inheritance Chain Planning**

**IMPORTANT:** When planning large implementations (>500 lines), design inheritance chain architecture.

**Inheritance Chain Planning Process:**

1. **Identify Logical Layers**
   - What are the natural functional dependencies?
   - Which components build on others?
   - What's the core foundation vs specialized features?

2. **Design Layer Hierarchy**
   - Base class: Core utilities and infrastructure
   - Layer classes: Specialized functionality that builds up
   - Concrete class: Final implementation with orchestration

3. **Plan Layer Implementation**
   - Each layer = separate phase with dedicated tasks
   - Layer size target: 200-500 lines each
   - Test each layer independently

4. **File Structure Planning**
   - `base.ts` - Foundation class
   - `[feature].ts` - Each logical layer
   - `[main].ts` - Final concrete implementation
   - `index.ts` - Public exports

**Example: Service Layer Implementation Plan**

```markdown
Phase 1: BaseService (utilities, error handling)
Phase 2: DataService extends BaseService
Phase 3: ValidationService extends DataService
Phase 4: BusinessService extends ValidationService
Phase 5: ApiService extends BusinessService

Files:

- base.ts (BaseService)
- data.ts (DataService)
- validation.ts (ValidationService)
- business.ts (BusinessService)
- api.ts (ApiService)
- index.ts (exports)
```

**When to Apply:**

- ✅ Any implementation approaching 500+ lines
- ✅ Complex systems with multiple concerns
- ✅ Systems that will grow over time
- ✅ Components with natural layer dependencies

---

## **Complete Example: Implementation Plan**

### **Project: User Management API**

---

### **Phase 1: Type Definitions**

**Context:** Need strong type definitions for API components.

**Reasoning:** Type-first approach enables better tooling and catches errors early.

**Dependencies:** None

**Deliverables:**

- Complete TypeScript types for entities
- Complete TypeScript types for DTOs
- 100% type coverage

**Tasks:**

| Task | Description                   | Dependencies  | Status |
| ---- | ----------------------------- | ------------- | ------ |
| 1.1  | Create base entity types      | None          | [ ]    |
| 1.2  | Create User entity types      | 1.1           | [ ]    |
| 1.3  | Define DTO types              | 1.2           | [ ]    |
| 1.4  | Add unit tests for types      | 1.1, 1.2, 1.3 | [ ]    |

---

### **Phase 2: Service Layer Implementation**

**Context:** Need business logic layer for user operations.

**Reasoning:** Service layer provides clean separation between controllers and data access.

**Dependencies:** Phase 1 complete (types defined)

**Deliverables:**

- Working UserService with CRUD operations
- Input validation for all operations
- 95%+ test coverage

**Tasks:**

| Task | Description                      | Dependencies  | Status |
| ---- | -------------------------------- | ------------- | ------ |
| 2.1  | Implement base service class     | Phase 1       | [ ]    |
| 2.2  | Add UserService.create()         | 2.1           | [ ]    |
| 2.3  | Add UserService.findById()       | 2.1           | [ ]    |
| 2.4  | Add comprehensive service tests  | 2.1, 2.2, 2.3 | [ ]    |

---

## **Summary: Creating Effective Plans**

**Every implementation plan must include:**

1. 📋 **Logical phases** - Sequential, buildable units of work
2. 🔗 **Dependencies** - Clear phase and task dependencies
3. 💡 **Context & reasoning** - Why this approach, key decisions
4. ✅ **Clear deliverables** - Measurable outcomes for each phase
5. 🔨 **Granular tasks** - Small, focused, testable tasks (2-4 hours each)
6. 🔢 **Numbered tasks** - Format: Task [Phase].[Number]
7. 📊 **Table format** - All tasks in a table with checkboxes
8. 🧪 **Testing requirements** - Specific tests for each task (split into files)
9. 🔍 **Pre-implementation review** - Verify completeness and consistency

**Remember:** A good plan prevents wasted effort, reduces rework, and ensures nothing is forgotten. Take time to plan thoroughly before implementing.

---

## **Cross-References**

- See **agents.md** for task granularity requirements and verification rules
- See **code.md** for testing standards and quality guidelines that inform task planning
- See **code.md Rules 17-20** for inheritance chain architecture requirements
- See **code.md Rule 29** for test file organization requirements
- Note: Inheritance chain planning in this file (Rule 10) works with architectural standards in code.md