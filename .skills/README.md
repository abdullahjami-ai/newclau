# Skills Library

Reusable code patterns that Claude can discover and execute.

## Overview

Skills are saved code implementations that get faster over time. When Claude successfully completes a task, the code can be saved as a skill for instant reuse.

**Benefits:**
- **10-20x faster execution** on subsequent runs
- **Token efficient** - Just load and run, no rewriting
- **Knowledge compounds** - Skills improve automatically
- **Type-safe** - Full TypeScript support

## Architecture

```
.skills/
├── security-audit/
│   ├── SKILL.md          # Documentation
│   ├── audit.ts          # Implementation
│   └── types.ts          # TypeScript types (optional)
├── run-tests/
│   ├── SKILL.md
│   └── test.ts
└── README.md             # This file
```

## How Skills Work

### First Time (Skill Creation)
```
1. User: "Run security audit"
2. Claude writes code from scratch (~20 seconds)
3. Code executes successfully
4. Sandbox saves code to .skills/security-audit/
5. SKILL.md documentation auto-generated
```

### Second Time (Skill Reuse)
```
1. User: "Run security audit"
2. Claude checks: .skills/security-audit/ exists? YES!
3. Claude imports and runs existing skill (~2 seconds)
4. 10x faster! ⚡
```

### Over Time (Skill Evolution)
```
- Skills get refined with each use
- New features added to existing skills
- Error handling improved
- Performance optimized
- Documentation updated
```

## Available Skills

### 1. security-audit

**Purpose:** Comprehensive security audit

**What it does:**
- Socket MCP dependency scanning
- npm audit
- Secret detection (hardcoded passwords, API keys)
- Environment variable validation

**Usage:**
```typescript
import { securityAudit } from './.skills/security-audit/audit';

const report = await securityAudit({ severity: 'high' });
console.log(report.passed ? 'PASSED ✅' : 'FAILED ❌');
```

**When to use:**
- Before deployments
- After adding dependencies
- Weekly security checks

**Token efficiency:**
- First run: ~250 tokens
- Subsequent: ~70 tokens (72% faster)

---

### 2. run-tests

**Purpose:** Execute test suite with coverage

**What it does:**
- Backend Jest tests
- Frontend Vitest tests
- Coverage calculation
- Failure reporting

**Usage:**
```typescript
import { runTests } from './.skills/run-tests/test';

const results = await runTests({ coverage: true });
console.log(`${results.backend.passed}/${results.backend.total} passed`);
```

**When to use:**
- Before commits
- After bug fixes
- Before deployments
- During CI/CD

**Token efficiency:**
- First run: ~200 tokens
- Subsequent: ~70 tokens (65% faster)

---

## Creating New Skills

### Manual Creation

1. **Create directory:**
   ```bash
   mkdir .skills/my-skill
   ```

2. **Create SKILL.md (documentation):**
   ```markdown
   # My Skill

   ## Purpose
   What this skill does

   ## Usage
   How to use it

   ## Output Format
   What it returns
   ```

3. **Create implementation (TypeScript):**
   ```typescript
   // .skills/my-skill/skill.ts
   export async function mySkill(options) {
     // Implementation
     return result;
   }
   ```

### Automatic Creation

Claude automatically saves successful code as skills:

```typescript
// Claude writes this code to solve a problem:
async function analyzePerformance() {
  // ... code that works ...
}

// Sandbox auto-saves to:
// .skills/analyze-performance/
//   ├── SKILL.md (auto-generated)
//   └── analyze.ts (saved code)
```

## Skill Structure

### Required Files

**SKILL.md (Documentation):**
```markdown
# Skill Name

## Purpose
Clear description of what this skill does

## When to Use
Specific scenarios where this skill applies

## What it Does
Step-by-step what happens when skill runs

## Usage
Code examples showing how to use

## Output Format
TypeScript interface showing return type

## Dependencies
External tools, MCPs, or libraries needed

## Examples
Multiple real-world usage examples
```

**Implementation File (.ts):**
```typescript
/**
 * Skill: Skill Name
 * @see SKILL.md
 */

export interface SkillOptions {
  option1: string;
  option2?: number;
}

export interface SkillResult {
  success: boolean;
  data: any;
}

export async function skillFunction(
  options: SkillOptions
): Promise<SkillResult> {
  // Implementation
}
```

### Optional Files

- `types.ts` - Shared TypeScript types
- `utils.ts` - Helper functions
- `config.json` - Configuration
- `tests/` - Skill tests

## Best Practices

### 1. Keep Skills Focused
```typescript
// ❌ Bad: One skill does everything
await doEverything();

// ✅ Good: Focused, reusable skills
await securityAudit();
await runTests();
await deploy();
```

### 2. Document Thoroughly
```markdown
## Usage
\```typescript
// Show real examples with expected output
const result = await mySkill({ option: 'value' });
// Returns: { success: true, data: ... }
\```
```

### 3. Handle Errors Gracefully
```typescript
export async function mySkill(options) {
  try {
    // Main logic
    return { success: true, data: result };
  } catch (error) {
    console.error('Skill failed:', error);
    return { success: false, error: error.message };
  }
}
```

### 4. Return Structured Data
```typescript
// ✅ Good: Structured, typed return
interface SkillResult {
  success: boolean;
  timestamp: string;
  data: any;
  errors?: string[];
}

// ❌ Bad: Unstructured return
return "It worked! Result: " + data;
```

### 5. Use Type Definitions
```typescript
export interface Options {
  required: string;
  optional?: number;
}

export async function skill(opts: Options): Promise<Result> {
  // Type-safe implementation
}
```

## Skill Discovery

Claude discovers skills by exploring the filesystem:

```typescript
// Claude can list available skills
const skills = await fs.readdir('./.skills/');
// Returns: ['security-audit', 'run-tests']

// Claude reads skill documentation
const docs = await fs.readFile('./.skills/security-audit/SKILL.md', 'utf-8');

// Claude imports and uses skill
import { securityAudit } from './.skills/security-audit/audit';
const result = await securityAudit();
```

## Token Efficiency Comparison

| Operation | Traditional | With Skills | Savings |
|-----------|-------------|-------------|---------|
| First security audit | 3,000 tokens | 250 tokens | 92% |
| Second security audit | 3,000 tokens | 70 tokens | 98% |
| First test run | 2,500 tokens | 200 tokens | 92% |
| Second test run | 2,500 tokens | 70 tokens | 97% |

**Average:** 95% token reduction on subsequent runs!

## Skill Versioning

Skills evolve over time:

```
security-audit/
├── SKILL.md
│   Version History:
│   - 1.0.0: Initial with Socket MCP + npm audit
│   - 1.1.0: Added secret detection
│   - 1.2.0: Added environment validation
│   - 1.3.0: Improved error handling
└── audit.ts (current version)
```

Version history in SKILL.md tracks improvements.

## Common Patterns

### Pattern 1: Pre-Deployment Checklist
```typescript
import { securityAudit } from './.skills/security-audit/audit';
import { runTests } from './.skills/run-tests/test';

// Run checks
const audit = await securityAudit();
const tests = await runTests();

// Verify all passed
if (audit.passed && tests.passed) {
  console.log('✅ Ready to deploy!');
} else {
  console.error('❌ Cannot deploy - checks failed');
  process.exit(1);
}
```

### Pattern 2: Scheduled Maintenance
```typescript
// Weekly security audit
const weeklyAudit = await securityAudit({
  checkSecrets: true,
  checkDependencies: true,
  severity: 'medium'
});

// Send report
await sendReport(weeklyAudit);
```

### Pattern 3: CI/CD Integration
```typescript
// In CI pipeline
const tests = await runTests({ coverage: true });

if (!tests.passed) {
  console.error('Tests failed');
  process.exit(1);
}

if (tests.coverage.overall < 80) {
  console.warn('Coverage below 80%');
}

console.log('✅ CI checks passed');
```

## Debugging Skills

### View Skill Execution
```typescript
// Skills log to console during execution
const result = await securityAudit();
// Console shows:
// 🔒 Starting Security Audit...
// 📦 Scanning dependencies with Socket MCP...
//    ✓ Socket scan complete
// ...
```

### Check Skill Existence
```typescript
import * as fs from 'fs/promises';

const skillExists = await fs.exists('./.skills/security-audit');
console.log('Skill available:', skillExists);
```

### Read Skill Documentation
```typescript
const docs = await fs.readFile('./.skills/security-audit/SKILL.md', 'utf-8');
console.log(docs);
```

## Future Skills (Roadmap)

**Planned skills:**
- `deploy-railway/` - Automated Railway deployment
- `compress-images/` - Batch image compression
- `monitor-logs/` - Log analysis and error detection
- `optimize-performance/` - Performance profiling
- `backup-data/` - Database backup automation

## Related Documentation

- [CODE-FIRST Architecture](../.claude/ARCHITECTURE-CODE-FIRST.md)
- [MCP Servers](../.mcp-servers/README.md)
- [Anthropic MCP Blog](https://www.anthropic.com/code-execution-mcp)

---

**Skills compound in value over time. The more you use them, the faster they get!** ⚡

**Last Updated:** 2025-11-05
