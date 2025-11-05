# MCP Servers

Model Context Protocol integration for the Image Compressor project.

## Overview

This directory contains TypeScript APIs for calling MCP (Model Context Protocol) servers. Claude discovers these tools by exploring the filesystem, achieving **98.7% token savings** compared to loading all tool definitions upfront.

## Architecture

```
.mcp-servers/
├── client.ts          # MCP client (calls MCP servers)
├── types.ts           # Shared TypeScript types
├── context7/          # Documentation and examples
│   ├── searchDocs.ts
│   ├── getExample.ts
│   └── index.ts
├── socket/            # Security scanning
│   ├── scanDependencies.ts
│   ├── checkPackage.ts
│   └── index.ts
└── playwright/        # Browser automation
    ├── navigateTo.ts
    ├── click.ts
    ├── fill.ts
    ├── screenshot.ts
    └── index.ts
```

## Available MCP Servers

### 1. Context7 (Documentation)

**Purpose:** Get up-to-date library documentation and code examples

**Tools:**
- `searchDocs(library, query)` - Search documentation
- `getExample(library, topic)` - Get code examples

**Installation:**
```bash
npx @upstash/context7-mcp
```

**Cost:** FREE

**Example:**
```typescript
import { searchDocs } from './.mcp-servers/context7';

const docs = await searchDocs({
  library: 'sharp',
  query: 'resize images'
});
console.log(docs.content);
```

---

### 2. Socket (Security Scanning)

**Purpose:** Scan dependencies for security vulnerabilities

**Tools:**
- `scanDependencies(packageJsonPath)` - Scan all dependencies
- `checkPackage(name, version)` - Check single package

**Installation:**
Use hosted service: https://mcp.socket.dev/ (no installation!)

OR install locally:
```bash
npx @socketsecurity/mcp
```

**Cost:** FREE (hosted service)

**Example:**
```typescript
import { scanDependencies } from './.mcp-servers/socket';

const report = await scanDependencies({
  packageJsonPath: './backend/package.json',
  severity: 'high'
});

console.log(`Found ${report.criticalCount} critical issues`);
```

---

### 3. Playwright (Browser Automation)

**Purpose:** Automate browser interactions and take screenshots

**Tools:**
- `navigateTo(url)` - Navigate to URL
- `click(selector)` - Click element
- `fill(selector, value)` - Fill input field
- `screenshot(options)` - Take screenshot

**Installation:**
```bash
npx @playwright/mcp@latest
```

**Cost:** FREE

**Example:**
```typescript
import { navigateTo, click, screenshot } from './.mcp-servers/playwright';

// Test the frontend
await navigateTo({ url: 'https://front-end-production-8703.up.railway.app' });
await click({ selector: 'text=Compress Image' });
const result = await screenshot({ fullPage: true });
```

---

## Progressive Tool Discovery

**Traditional Approach (Bad):**
```typescript
// Load ALL 1000 tools upfront
const allTools = [...]; // 150,000 tokens!
```

**Code-First Approach (Good):**
```typescript
// Claude explores filesystem
const servers = await fs.readdir('./.mcp-servers/');
// Returns: ['context7', 'socket', 'playwright']

// Claude reads only what it needs
const socketTools = await fs.readFile('./.mcp-servers/socket/scanDependencies.ts');
// Only ~500 tokens!
```

**Token Savings:** 98.7% (150K → 2K tokens)

---

## Usage Patterns

### Pattern 1: Get Documentation

```typescript
import { searchDocs } from './.mcp-servers/context7';

// Need to implement Sharp image compression
const sharpDocs = await searchDocs({
  library: 'sharp',
  query: 'compress jpeg quality settings'
});

// Use docs to write code
console.log(sharpDocs.content);
```

### Pattern 2: Security Audit

```typescript
import { scanDependencies } from './.mcp-servers/socket';

// Scan all dependencies
const report = await scanDependencies({
  packageJsonPath: './backend/package.json'
});

// Process in code (not in Claude context!)
const critical = report.vulnerabilities.filter(
  v => v.severity === 'critical'
);

// Claude only sees summary
console.log(`${critical.length} critical issues found`);
```

### Pattern 3: UI Testing

```typescript
import { navigateTo, click, fill, screenshot } from './.mcp-servers/playwright';

// Test image upload flow
await navigateTo({ url: 'http://localhost:3000' });

// Upload image (simulate drag-and-drop)
await click({ selector: 'input[type="file"]' });
await fill({ selector: 'input[type="file"]', value: './test-image.jpg' });

// Click compress
await click({ selector: 'text=Compress Image' });

// Verify result
const screenshot = await screenshot({ selector: '.result-container' });
console.log('Test passed!');
```

---

## Adding New MCP Servers

To add a new MCP server:

1. **Create directory:**
   ```bash
   mkdir .mcp-servers/new-server
   ```

2. **Create tool files:**
   ```typescript
   // .mcp-servers/new-server/myTool.ts
   import { callMCP } from '../client';

   export interface MyToolInput { ... }
   export interface MyToolOutput { ... }

   export async function myTool(input: MyToolInput): Promise<MyToolOutput> {
     return callMCP('new_server__my_tool', input);
   }
   ```

3. **Create index.ts:**
   ```typescript
   // .mcp-servers/new-server/index.ts
   export { myTool, type MyToolInput, type MyToolOutput } from './myTool';
   ```

4. **Update main index:**
   ```typescript
   // .mcp-servers/index.ts
   export * as newServer from './new-server';
   ```

---

## Best Practices

### 1. Load Tools On-Demand
```typescript
// ❌ Bad: Load everything upfront
import * as allTools from './.mcp-servers';

// ✅ Good: Load only what you need
import { searchDocs } from './.mcp-servers/context7';
```

### 2. Process Data in Code
```typescript
// ❌ Bad: Return all data to Claude
const allRows = await getSheet({ id: 'data' });
return allRows; // 10,000 rows through context!

// ✅ Good: Process in code, return summary
const allRows = await getSheet({ id: 'data' });
const filtered = allRows.filter(r => r.status === 'active');
return { total: allRows.length, active: filtered.length }; // Just summary!
```

### 3. Cache MCP Results
```typescript
// Check cache first
const cacheKey = `docs:${library}:${query}`;
const cached = await cache.get(cacheKey);
if (cached) return cached;

// Call MCP
const docs = await searchDocs({ library, query });

// Cache for next time
await cache.set(cacheKey, docs, { ttl: 3600 });
```

---

## Troubleshooting

### MCP Server Not Responding

**Check if server is running:**
```typescript
import { checkMCPServer } from './.mcp-servers/client';

const isAvailable = await checkMCPServer('context7');
if (!isAvailable) {
  console.error('Context7 MCP server not available');
}
```

**List available servers:**
```typescript
import { listMCPServers } from './.mcp-servers/client';

const servers = await listMCPServers();
console.log('Available:', servers);
```

### Installation Issues

**Context7:**
```bash
npx @upstash/context7-mcp
# Should start immediately, no config needed
```

**Socket:**
```bash
# Use hosted service (easiest):
# Just call https://mcp.socket.dev/ - no installation!

# OR install locally:
npx @socketsecurity/mcp
# Requires SOCKET_API_KEY env var
```

**Playwright:**
```bash
npx @playwright/mcp@latest
# May need to install browser binaries:
npx playwright install
```

---

## Token Efficiency

**Traditional Approach:**
- Load all tool definitions: 150,000 tokens
- Every tool call: +200 tokens
- Intermediate results: through context
- **Total:** ~150-200K tokens per task

**Code-First Approach:**
- Discover tools: 500 tokens (progressive)
- Tool calls: in code (0 tokens)
- Data processing: in code (0 tokens)
- **Total:** ~500-1000 tokens per task

**Savings:** 99.5% ✨

---

## Related Documentation

- [CODE-FIRST Architecture](./.claude/ARCHITECTURE-CODE-FIRST.md)
- [Skills Library](../.skills/README.md)
- [Anthropic MCP Blog](https://www.anthropic.com/code-execution-mcp)
- [MCP Specification](https://modelcontextprotocol.io/)

---

**Last Updated:** 2025-11-05
