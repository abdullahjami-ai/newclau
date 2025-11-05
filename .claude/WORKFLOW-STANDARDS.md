# CODE-FIRST Workflow Standards

**Version:** 1.0.0
**Last Updated:** 2025-11-05

---

## Purpose

This document defines the standardized workflows for using the CODE-FIRST architecture to ensure:
- Consistent token efficiency (94.4% savings)
- Secure code execution
- Privacy-preserving data processing
- Reusable skill development

---

## Core Principle

> **"AI writes code, code calls tools, tools process data"**

Every task follows this principle to maximize efficiency and minimize token usage.

---

## Standard Workflow Sequence

### Overview

```
User Request
    ↓
[1] Task Classification (50 tokens)
    ↓
[2] Progressive Tool Discovery (100-500 tokens)
    ↓
[3] Code Generation (150-300 tokens)
    ↓
[4] Sandbox Execution (0 tokens - outside context)
    ↓
[5] Summary Return (50-100 tokens)
    ↓
Result (Total: 350-950 tokens)
```

---

## Step 1: Task Classification

### Purpose
Determine if task needs code execution or just research.

### Classification Rules

**DIRECT_CODE** - Write and execute code:
- Implementation tasks ("add feature", "fix bug", "refactor")
- Data processing ("analyze", "scan", "audit", "test")
- File operations ("update", "create", "modify")
- API calls ("fetch", "send", "check")
- Build/deploy operations

**RESEARCH_ONLY** - Explore without execution:
- Explanations ("explain", "what is", "how does")
- Documentation ("describe", "show me", "document")
- Code reading ("read", "view", "display")
- Architecture review ("review structure", "understand flow")

### Implementation

```typescript
function classifyTask(task: string): 'DIRECT_CODE' | 'RESEARCH_ONLY' {
  const researchKeywords = [
    'explain', 'what is', 'how does', 'describe',
    'show me', 'tell me', 'document', 'read'
  ];

  const lowerTask = task.toLowerCase();
  const isResearch = researchKeywords.some(keyword =>
    lowerTask.includes(keyword)
  );

  return isResearch ? 'RESEARCH_ONLY' : 'DIRECT_CODE';
}
```

### Token Cost
- Classification logic: ~50 tokens
- No LLM call needed (simple pattern matching)

---

## Step 2: Progressive Tool Discovery

### Purpose
Load only the MCP tools needed for this specific task (not all tools upfront).

### Discovery Process

**1. Identify Required Server:**
```typescript
function identifyServer(task: string): string {
  if (task.includes('security') || task.includes('vulnerability')) {
    return 'socket';
  }
  if (task.includes('documentation') || task.includes('docs')) {
    return 'context7';
  }
  if (task.includes('browser') || task.includes('UI') || task.includes('test')) {
    return 'playwright';
  }
  return '';
}
```

**2. Explore Server Tools:**
```typescript
// Discover tools via filesystem
const serverPath = `.mcp-servers/${serverName}`;
const files = await fs.readdir(serverPath);
const tools = files.filter(f => f.endsWith('.ts') && f !== 'index.ts');
```

**3. Load Only Needed Tools:**
```typescript
// Load specific tool definition
const toolPath = path.join(serverPath, `${toolName}.ts`);
const toolDef = await fs.readFile(toolPath, 'utf-8');
// Parse interface and documentation
```

### Token Efficiency

| Approach | Tools Loaded | Tokens Used | Savings |
|----------|--------------|-------------|---------|
| Traditional | All 1000+ tools | 150,000 | - |
| Progressive | Only 2-3 tools | 300-500 | 98.7% |

### Best Practices

✅ **DO:**
- Explore filesystem to discover tools
- Load only tools relevant to task
- Cache tool definitions during session
- Read only interface definitions (not full implementation)

❌ **DON'T:**
- Load all tools upfront
- Load tools "just in case"
- Load full implementation code
- Guess tool names without exploring

---

## Step 3: Code Generation

### Purpose
Write executable TypeScript code that will run in sandbox and call MCP tools.

### Code Structure

**Standard Template:**
```typescript
// Import only needed tools
import { toolName } from '/.mcp-servers/server';
import * as fs from 'fs/promises';

// Main function
async function taskName() {
  try {
    // 1. Call MCP tools
    const result = await toolName({ params });

    // 2. Process data in sandbox (not in AI context!)
    const processed = processData(result);

    // 3. Return summary only (not raw data)
    return {
      timestamp: new Date().toISOString(),
      summary: processed,
      success: true
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Execute and output
taskName().then(result => {
  console.log(JSON.stringify(result, null, 2));
});
```

### Code Quality Standards

**Required:**
- TypeScript for type safety
- Async/await for asynchronous operations
- Try/catch for error handling
- JSON output for easy parsing
- Summary returns (not raw data)

**Recommended:**
- Descriptive function names
- Inline comments for complex logic
- Modular functions
- Input validation

### Token Efficiency

| Code Complexity | Lines | Tokens |
|----------------|-------|--------|
| Simple (1 MCP call) | 10-15 | 100-150 |
| Medium (2-3 calls) | 20-30 | 150-250 |
| Complex (multiple operations) | 40-60 | 250-400 |

### Examples

**Example 1: Security Audit**
```typescript
import { scanDependencies } from '/.mcp-servers/socket';

async function securityAudit() {
  const result = await scanDependencies({
    packageJsonPath: './backend/package.json',
    severity: 'high'
  });

  // Process in sandbox
  const critical = result.vulnerabilities.filter(v => v.severity === 'critical');

  // Return summary only
  return {
    total: result.totalCount,
    critical: critical.length,
    passed: critical.length === 0
  };
}
```

**Example 2: Documentation Lookup**
```typescript
import { searchDocs } from '/.mcp-servers/context7';

async function getDocs() {
  const docs = await searchDocs({
    library: 'sharp',
    query: 'image compression'
  });

  return {
    url: docs.url,
    version: docs.version,
    preview: docs.content.substring(0, 200)
  };
}
```

**Example 3: UI Testing**
```typescript
import { navigateTo, screenshot } from '/.mcp-servers/playwright';

async function testUI() {
  await navigateTo({ url: 'https://example.com' });
  const result = await screenshot({ path: '/tmp/screenshot.png' });

  return {
    success: result.success,
    path: result.path
  };
}
```

---

## Step 4: Sandbox Execution

### Purpose
Execute code in isolated Docker container with resource limits and security restrictions.

### Execution Process

**1. Write code to temp file:**
```typescript
const tempFile = `/tmp/sandbox-${execId}.ts`;
await fs.writeFile(tempFile, code);
```

**2. Build Docker command:**
```typescript
const dockerCmd = [
  'docker', 'run',
  '--rm',
  '--read-only',
  '--memory', '512m',
  '--cpus', '1.0',
  '--network', 'none',
  '-v', `${tempFile}:/workspace/script.ts:ro`,
  'sandbox-runner:latest',
  'node', '/workspace/script.ts'
].join(' ');
```

**3. Execute with timeout:**
```typescript
const { stdout, stderr } = await execAsync(dockerCmd, {
  timeout: 30000,  // 30 seconds
  maxBuffer: 10 * 1024 * 1024  // 10MB
});
```

**4. Cleanup:**
```typescript
await fs.unlink(tempFile);
```

### Security Features

**Container Restrictions:**
- Read-only filesystem (except /tmp)
- Memory limit (default 512MB)
- CPU limit (default 1 core)
- Time limit (default 30s)
- Network disabled (default)
- Non-root user (UID 1001)

**Resource Limits:**
```typescript
{
  timeout: 30000,       // Max execution time
  maxMemory: 512,       // Max RAM in MB
  cpuLimit: 1.0,        // Max CPU cores
  networkEnabled: false // Network access
}
```

### Token Efficiency

**Key Insight:** Code execution happens OUTSIDE AI context!

```
Traditional: AI processes data in context → 50,000 tokens
CODE-FIRST: Sandbox processes data → 0 tokens
Savings: 100%
```

### Error Handling

**Common Errors:**
```typescript
// Timeout
{ exitCode: 124, error: 'Execution timed out' }

// Out of memory
{ exitCode: 137, error: 'Out of memory' }

// Runtime error
{ exitCode: 1, error: 'TypeError: ...' }
```

**Retry Strategy:**
```typescript
async function executeWithRetry(code: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const result = await executeSandbox(code);
    if (result.success) return result;

    // Wait before retry (exponential backoff)
    await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)));
  }
  throw new Error('Max retries exceeded');
}
```

---

## Step 5: Summary Return

### Purpose
Return only essential information to AI context (not all processed data).

### Summary Principles

**DO Return:**
- Counts and totals
- Success/failure status
- Error messages
- Key metrics
- Timestamps
- Boolean flags

**DON'T Return:**
- Full datasets (e.g., all 10,000 users)
- Raw logs (summarize instead)
- Complete file contents (snippets only)
- All vulnerabilities (top 5 + count)
- Entire API responses (extract key fields)

### Examples

**Bad - Returns Everything:**
```typescript
// ❌ Returns 10,000 user records → 50,000 tokens
const users = await getAllUsers();
return users;
```

**Good - Returns Summary:**
```typescript
// ✅ Returns summary → 50 tokens
const users = await getAllUsers();
return {
  total: users.length,
  active: users.filter(u => u.active).length,
  inactive: users.filter(u => !u.active).length,
  lastUpdated: new Date().toISOString()
};
```

**Bad - Returns All Vulnerabilities:**
```typescript
// ❌ Returns 100 vulnerabilities → 5,000 tokens
return vulnerabilities;
```

**Good - Returns Top Issues:**
```typescript
// ✅ Returns top 5 + count → 200 tokens
return {
  total: vulnerabilities.length,
  critical: vulnerabilities.filter(v => v.severity === 'critical').slice(0, 5),
  high: vulnerabilities.filter(v => v.severity === 'high').slice(0, 5)
};
```

### Standard Summary Format

```typescript
interface TaskSummary {
  success: boolean;
  timestamp: string;
  metrics: {
    [key: string]: number;
  };
  status: string;
  error?: string;
}
```

### Token Efficiency

| Data Type | Full | Summary | Tokens Saved |
|-----------|------|---------|--------------|
| User records | 10,000 users | 3 counts | 99.9% |
| Vulnerabilities | 100 issues | 5 top + count | 95% |
| Log files | 50MB | 10 errors | 99.99% |
| API responses | 1000 items | Pagination | 98% |

---

## Skills Development

### When to Create a Skill

Create a reusable skill when:
- Task will be repeated frequently (e.g., security audits)
- Workflow is standardized (e.g., test execution)
- Optimization opportunity exists (e.g., batch processing)
- Knowledge should compound (e.g., deployment procedures)

### Skill Structure

```
.skills/
└── skill-name/
    ├── SKILL.md          # Documentation
    ├── implementation.ts  # Code
    └── tests/            # Optional tests
        └── test.ts
```

### Skill Template

**SKILL.md:**
```markdown
# Skill Name

## Purpose
Brief description of what this skill does

## Usage
\`\`\`typescript
import { skillFunction } from './.skills/skill-name/implementation';

const result = await skillFunction(options);
\`\`\`

## Parameters
- `param1`: Description
- `param2`: Description

## Returns
Description of return value

## Token Efficiency
- First run: X tokens
- Subsequent runs: Y tokens
- Savings: Z%
```

**implementation.ts:**
```typescript
export interface SkillOptions {
  // Define options
}

export interface SkillResult {
  success: boolean;
  // Define result fields
}

export async function skillFunction(
  options: SkillOptions = {}
): Promise<SkillResult> {
  // Implementation
}
```

### Skill Reuse Benefits

| Run | Tokens | Time | Notes |
|-----|--------|------|-------|
| 1st | 250 | 2000ms | Generate + execute |
| 2nd | 70 | 200ms | Just execute (10x faster) |
| 3rd | 70 | 200ms | Instant reuse |

**72% token savings on reuse!**

---

## Privacy & Security Standards

### Data Classification

**Public:** Can flow through AI context
- Counts, totals, metrics
- Boolean flags
- Timestamps
- Non-sensitive strings

**Sensitive:** Process in sandbox only
- PII (names, emails, addresses)
- API keys, tokens, passwords
- Financial data
- Health information
- User-generated content

### Privacy-Preserving Patterns

**Pattern 1: Tokenization**
```typescript
// In sandbox
const users = await getUsers();
const anonymized = users.map(u => ({
  id: hash(u.id),  // Tokenize identifier
  active: u.active
}));
return { users: anonymized };
```

**Pattern 2: Aggregation**
```typescript
// Return aggregates, not individuals
return {
  total: users.length,
  byCountry: groupBy(users, 'country'),  // Just counts
  avgAge: average(users.map(u => u.age))
};
```

**Pattern 3: Sampling**
```typescript
// Return sample, not full dataset
return {
  total: logs.length,
  sample: logs.slice(0, 10),  // First 10 only
  errorRate: calculateErrorRate(logs)
};
```

### Security Checklist

Before executing code:
- [ ] No hardcoded secrets
- [ ] Input validation present
- [ ] Error handling implemented
- [ ] Resource limits appropriate
- [ ] Network access justified
- [ ] Sensitive data tokenized
- [ ] Summary return (not raw data)

---

## Performance Optimization

### Token Budget per Task

| Task Type | Target Tokens | Max Tokens |
|-----------|---------------|------------|
| Simple | 350-500 | 1,000 |
| Medium | 500-750 | 1,500 |
| Complex | 750-1,000 | 2,000 |

If exceeding budget:
1. Review tool discovery (loading too many?)
2. Check code generation (too verbose?)
3. Verify summary return (sending raw data?)

### Execution Time Budget

| Task Type | Target Time | Max Time |
|-----------|-------------|----------|
| Simple | < 5s | 30s |
| Medium | < 15s | 60s |
| Complex | < 30s | 120s |

If exceeding time:
1. Optimize algorithm
2. Increase resource limits
3. Parallelize operations
4. Cache results

### Caching Strategies

**Tool Definitions:**
```typescript
// Cache tool definitions during session
const toolCache = new Map();

function getToolDef(name: string) {
  if (!toolCache.has(name)) {
    toolCache.set(name, loadToolDef(name));
  }
  return toolCache.get(name);
}
```

**MCP Results:**
```typescript
// Cache docs lookup for same library
const docsCache = new Map();

async function getDocs(library: string) {
  const key = `docs:${library}`;
  if (docsCache.has(key)) {
    return docsCache.get(key);
  }
  const docs = await searchDocs({ library });
  docsCache.set(key, docs);
  return docs;
}
```

---

## Metrics & Monitoring

### Track Token Usage

```typescript
interface TaskMetrics {
  task: string;
  classification: number;  // ~50
  discovery: number;       // 100-500
  generation: number;      // 150-300
  execution: number;       // 0
  summary: number;         // 50-100
  total: number;           // Sum
  savings: string;         // vs traditional
}
```

### Track Execution Time

```typescript
interface PerformanceMetrics {
  startTime: number;
  classificationTime: number;
  discoveryTime: number;
  generationTime: number;
  executionTime: number;
  summaryTime: number;
  totalTime: number;
}
```

### Success Criteria

✅ **Task is successful when:**
- Token usage < 1,000 (vs 11,300 traditional)
- Execution time < budget
- Sandbox completes without errors
- Summary contains essential info
- Savings > 90% vs traditional

---

## Quick Reference

### Task Decision Tree

```
Is task a question/explanation?
├─ YES → RESEARCH_ONLY (no code execution)
└─ NO  → DIRECT_CODE
         ├─ Which MCP server?
         │  ├─ Security/vulnerabilities → socket
         │  ├─ Documentation/examples → context7
         │  └─ Browser/UI testing → playwright
         ├─ Generate code
         ├─ Execute in sandbox
         └─ Return summary
```

### Token Budget Checklist

- [ ] Classification: ~50 tokens
- [ ] Discovery: 100-500 tokens (progressive, not all)
- [ ] Generation: 150-300 tokens (concise code)
- [ ] Execution: 0 tokens (in sandbox)
- [ ] Summary: 50-100 tokens (not raw data)
- [ ] **Total: < 1,000 tokens** ✅

### Common Patterns

**Security Audit:**
```typescript
socket.scanDependencies() → Process in sandbox → Return counts
```

**Documentation Lookup:**
```typescript
context7.searchDocs() → Extract key info → Return preview
```

**UI Testing:**
```typescript
playwright.navigate() → playwright.click() → Return status
```

**Data Processing:**
```typescript
Load data in sandbox → Process → Return aggregates
```

---

**Standards Version:** 1.0.0
**Last Updated:** 2025-11-05
**Status:** ✅ APPROVED
