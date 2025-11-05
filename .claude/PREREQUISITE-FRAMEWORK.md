# CODE-FIRST Architecture - Prerequisite Framework

**Version:** 1.0.0
**Date:** 2025-11-05
**Architecture:** CODE-FIRST with MCP Integration

---

## Table of Contents

1. [System Prerequisites](#system-prerequisites)
2. [Required Dependencies](#required-dependencies)
3. [MCP Server Setup](#mcp-server-setup)
4. [Execution Sandbox Configuration](#execution-sandbox-configuration)
5. [Environment Configuration](#environment-configuration)
6. [Validation & Testing](#validation--testing)
7. [Operational Workflows](#operational-workflows)
8. [Security Requirements](#security-requirements)
9. [Troubleshooting](#troubleshooting)
10. [Maintenance & Updates](#maintenance--updates)

---

## System Prerequisites

### Hardware Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | 2 cores | 4+ cores |
| RAM | 4GB | 8GB+ |
| Disk Space | 10GB free | 20GB+ free |
| Network | Stable internet | High-speed connection |

### Software Requirements

#### Required

- **Node.js**: v18.0.0 or newer (v22.21.0+ recommended)
- **npm**: v8.0.0 or newer (v10.9.4+ recommended)
- **Docker**: v20.10.0 or newer (for execution sandbox)
- **Git**: v2.30.0 or newer

#### Optional but Recommended

- **TypeScript**: v5.0.0+ (for type checking)
- **tsx**: Latest version (for running TypeScript directly)
- **Docker Compose**: v2.0.0+ (for multi-container setups)

### Operating System Support

✅ **Supported:**
- Linux (Ubuntu 20.04+, Debian 11+, CentOS 8+)
- macOS (11.0+)
- Windows 10/11 with WSL2

⚠️ **Limited Support:**
- Windows without WSL2 (Docker limitations)

---

## Required Dependencies

### Core Dependencies

```bash
# Node.js packages (already installed globally)
npm install -g @upstash/context7-mcp
npm install -g @socketsecurity/mcp
npm install -g @playwright/mcp
npm install -g tsx  # For TypeScript execution
```

### Project Dependencies

```bash
# Navigate to project root
cd /home/user/newclau

# Install project dependencies (if not already installed)
npm install
```

### Verification

```bash
# Check Node.js and npm
node --version  # Should show v18+
npm --version   # Should show v8+

# Check Docker
docker --version  # Should show v20.10+
docker ps         # Should run without errors

# Check MCP servers
npx @upstash/context7-mcp --version
npx @socketsecurity/mcp --version
npx @playwright/mcp --version
```

---

## MCP Server Setup

### 1. Context7 (Upstash)

**Purpose:** Up-to-date documentation and code examples

**Installation:**
```bash
npm install -g @upstash/context7-mcp
```

**Configuration:**
```json
{
  "name": "context7",
  "command": "npx",
  "args": ["-y", "@upstash/context7-mcp"]
}
```

**Optional API Key (for higher rate limits):**
```bash
# Get API key from: https://console.upstash.com/
npx @upstash/context7-mcp --api-key YOUR_API_KEY
```

**Verification:**
```bash
npx @upstash/context7-mcp --help
```

**Tools Provided:**
- `search_docs` - Search library documentation
- `get_example` - Get code examples

---

### 2. Socket Security

**Purpose:** Dependency security analysis and vulnerability scanning

**Installation:**
```bash
npm install -g @socketsecurity/mcp
```

**Configuration:**
```json
{
  "name": "socket",
  "command": "npx",
  "args": ["-y", "@socketsecurity/mcp@latest"],
  "hosted_service": "https://mcp.socket.dev/"
}
```

**Notes:**
- Uses FREE hosted service at https://mcp.socket.dev/
- No API key required for basic usage
- No authentication needed

**Verification:**
```bash
npx @socketsecurity/mcp --help
```

**Tools Provided:**
- `depscore` - Get dependency security scores
- `check_package` - Check single package for vulnerabilities

---

### 3. Playwright (Microsoft)

**Purpose:** Browser automation and UI testing

**Installation:**
```bash
npm install -g @playwright/mcp
npx playwright install  # Install browser binaries
```

**Configuration:**
```json
{
  "name": "playwright",
  "command": "npx",
  "args": ["@playwright/mcp@latest"]
}
```

**Browser Installation:**
```bash
# Install all browsers (Chromium, Firefox, WebKit)
npx playwright install

# Or install specific browsers
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit
```

**Verification:**
```bash
npx @playwright/mcp --help
npx playwright --version
```

**Tools Provided:**
- `playwright_navigate` - Navigate to URL
- `playwright_click` - Click element
- `playwright_fill` - Fill input field
- `playwright_screenshot` - Take screenshot

---

## Execution Sandbox Configuration

### Docker Setup

**1. Install Docker:**

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker
```

**macOS:**
```bash
# Install Docker Desktop from:
# https://www.docker.com/products/docker-desktop/
```

**Windows:**
```bash
# Install Docker Desktop with WSL2 backend from:
# https://www.docker.com/products/docker-desktop/
```

**2. Verify Docker:**
```bash
docker --version
docker run hello-world
```

**3. Build Sandbox Image:**
```bash
cd .sandbox
docker build -t sandbox-runner:latest .
```

**4. Test Sandbox:**
```bash
docker run --rm sandbox-runner:latest node --version
```

### Sandbox Configuration

**Location:** `.sandbox/`

**Files:**
- `Dockerfile` - Container definition
- `sandbox-runner.ts` - Execution manager
- `README.md` - Documentation

**Default Limits:**
```typescript
{
  timeout: 30000,      // 30 seconds
  maxMemory: 512,      // 512MB
  cpuLimit: 1.0,       // 1 core
  networkEnabled: false,
  allowedPaths: ['/workspace']
}
```

**Customize Limits:**
```typescript
import { executeSandbox } from './.sandbox/sandbox-runner';

const result = await executeSandbox(code, {
  timeout: 60000,        // 60 seconds
  maxMemory: 1024,       // 1GB
  cpuLimit: 2.0,         // 2 cores
  networkEnabled: true,  // Enable network
  env: {
    API_KEY: process.env.API_KEY
  }
});
```

---

## Environment Configuration

### Configuration Files

**1. `.mcp-config.json`** - MCP server configuration
```json
{
  "mcpServers": {
    "context7": { ... },
    "socket": { ... },
    "playwright": { ... }
  },
  "settings": {
    "progressive_discovery": true,
    "cache_tools": true,
    "timeout": 30000,
    "max_retries": 3
  }
}
```

**2. `.claude.json`** - CODE-FIRST architecture configuration
```json
{
  "version": "2.0.0",
  "architecture": "CODE-FIRST",
  "approach": {
    "paradigm": "CODE-FIRST",
    "principle": "AI writes code, code calls tools, tools process data"
  }
}
```

**3. `.env` (optional)** - Environment variables
```bash
# MCP API Keys (optional)
CONTEXT7_API_KEY=your_api_key_here

# Application settings
NODE_ENV=development
LOG_LEVEL=info
```

### Environment Variables

**Required:**
None (all MCP servers work without API keys)

**Optional:**
- `CONTEXT7_API_KEY` - Higher rate limits for Context7
- `NODE_ENV` - Environment (development/production)
- `LOG_LEVEL` - Logging verbosity (debug/info/warn/error)

---

## Validation & Testing

### Quick Validation

```bash
# 1. Test progressive tool discovery
npx tsx .mcp-servers/test-discovery.ts

# Expected output:
# Token Savings: 75.0%
# ✅ Progressive discovery working

# 2. Test end-to-end CODE-FIRST workflow
npx tsx .mcp-servers/test-code-first.ts

# Expected output:
# Token Savings: 94.4%
# ✅ CODE-FIRST is optimized and ready!
```

### Comprehensive Testing

**1. Verify MCP Servers:**
```bash
# Context7
npx @upstash/context7-mcp --help

# Socket
npx @socketsecurity/mcp --help

# Playwright
npx @playwright/mcp --help
npx playwright --version
```

**2. Verify Docker Sandbox:**
```bash
# Check Docker
docker --version
docker ps

# Build sandbox image
cd .sandbox
docker build -t sandbox-runner:latest .

# Test execution
docker run --rm sandbox-runner:latest node -e "console.log('Hello from sandbox!')"
```

**3. Verify Skills:**
```bash
# Check skills directory
ls -la .skills/

# Verify security-audit skill
cat .skills/security-audit/SKILL.md

# Verify run-tests skill
cat .skills/run-tests/SKILL.md
```

### Expected Results

✅ **All checks should pass:**
- Node.js v18+ installed
- npm v8+ installed
- Docker v20.10+ installed
- All 3 MCP servers installed
- Sandbox image builds successfully
- Progressive discovery test shows 75% savings
- End-to-end workflow test shows 94.4% savings
- Skills directory exists with 2+ skills

---

## Operational Workflows

### 1. Task Classification

**Every task starts with classification:**

```typescript
function classifyTask(task: string): 'DIRECT_CODE' | 'RESEARCH_ONLY' {
  const researchKeywords = ['explain', 'what is', 'how does', 'describe'];
  const isResearch = researchKeywords.some(k => task.toLowerCase().includes(k));
  return isResearch ? 'RESEARCH_ONLY' : 'DIRECT_CODE';
}
```

**DIRECT_CODE:** AI writes executable code
**RESEARCH_ONLY:** AI explores codebase only

---

### 2. Progressive Tool Discovery

**Load only needed tools:**

```typescript
// BAD: Load all tools upfront
const allTools = await loadAllTools(); // 150,000 tokens!

// GOOD: Discover progressively via filesystem
const servers = await fs.readdir('.mcp-servers/');
const targetServer = determineServer(task); // 'socket', 'context7', etc.
const tools = await loadServerTools(targetServer); // 300 tokens
```

**Token Efficiency:**
- Traditional: 150,000 tokens (all tools)
- Progressive: 2,000 tokens (only needed tools)
- Savings: 98.7%

---

### 3. Code Generation

**AI writes TypeScript code:**

```typescript
const code = `
import { scanDependencies } from '/.mcp-servers/socket';

async function audit() {
  const result = await scanDependencies({
    packageJsonPath: './backend/package.json'
  });

  console.log(JSON.stringify({
    total: result.totalCount,
    critical: result.criticalCount
  }));
}

audit();
`;
```

**Best Practices:**
- Use TypeScript for type safety
- Import only needed MCP tools
- Process data in code, return summaries only
- Handle errors gracefully

---

### 4. Sandbox Execution

**Execute code in isolated container:**

```typescript
import { executeSandbox } from './.sandbox/sandbox-runner';

const result = await executeSandbox(code, {
  timeout: 30000,
  maxMemory: 512,
  networkEnabled: false
});

if (result.success) {
  console.log('Output:', result.stdout);
} else {
  console.error('Error:', result.error);
}
```

**Security Features:**
- Isolated execution (Docker container)
- Resource limits enforced
- Read-only filesystem
- Network disabled by default
- Non-root user

---

### 5. Summary Return

**Only summaries flow to AI context:**

```typescript
// BAD: Return all data
return users; // 10,000 users → 50,000 tokens!

// GOOD: Return summary
return {
  total: users.length,
  active: users.filter(u => u.active).length,
  inactive: users.filter(u => !u.active).length
}; // 3 numbers → 50 tokens
```

**Token Efficiency:**
- Raw data: 50,000 tokens
- Summary: 50 tokens
- Savings: 99.9%

---

## Security Requirements

### Access Control

**Sandbox Restrictions:**
- ✅ Non-root user (UID 1001)
- ✅ Read-only filesystem (except /tmp)
- ✅ No network access by default
- ✅ Path restrictions enforced
- ✅ Resource limits (CPU, memory, time)

**MCP Security:**
- ✅ No hardcoded API keys
- ✅ Use environment variables
- ✅ Rate limit awareness
- ✅ Validate all inputs

### Secrets Management

**DO:**
```typescript
// Use environment variables
const apiKey = process.env.CONTEXT7_API_KEY;
```

**DON'T:**
```typescript
// Never hardcode secrets
const apiKey = 'sk-abc123...'; // ❌ NEVER DO THIS
```

### Data Privacy

**Sensitive Data Processing:**
```typescript
// Process PII in sandbox
const code = `
  const users = await getAllUsers();
  const anonymized = users.map(u => ({
    id: hash(u.id),  // Tokenize
    active: u.active
  }));
  console.log(JSON.stringify(anonymized));
`;
```

**Key Principles:**
- Process PII in sandbox only
- Don't flow sensitive data through AI context
- Tokenize identifiers when needed
- Return anonymized summaries

---

## Troubleshooting

### Common Issues

#### 1. MCP Server Not Found

**Problem:**
```
Error: Unknown MCP server: context7
```

**Solution:**
```bash
# Reinstall MCP server
npm install -g @upstash/context7-mcp

# Verify installation
npx @upstash/context7-mcp --help
```

---

#### 2. Docker Permission Denied

**Problem:**
```
docker: permission denied while trying to connect to the Docker daemon socket
```

**Solution:**
```bash
# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Or use sudo (not recommended)
sudo docker ps
```

---

#### 3. Sandbox Timeout

**Problem:**
```
Error: Sandbox execution timed out after 30000ms
```

**Solution:**
```typescript
// Increase timeout
const result = await executeSandbox(code, {
  timeout: 120000 // 2 minutes
});
```

---

#### 4. Out of Memory

**Problem:**
```
Error: Container exceeded memory limit (512MB)
```

**Solution:**
```typescript
// Increase memory limit
const result = await executeSandbox(code, {
  maxMemory: 2048 // 2GB
});
```

---

#### 5. Network Access Required

**Problem:**
```
Error: getaddrinfo ENOTFOUND api.example.com
```

**Solution:**
```typescript
// Enable network access
const result = await executeSandbox(code, {
  networkEnabled: true
});
```

---

#### 6. Tool Discovery Fails

**Problem:**
```
Error: No tools found for server: socket
```

**Solution:**
```bash
# Verify MCP servers directory
ls -la .mcp-servers/

# Check socket tools exist
ls -la .mcp-servers/socket/

# Reinstall if missing
npm install -g @socketsecurity/mcp
```

---

## Maintenance & Updates

### Regular Updates

**Monthly:**
```bash
# Update MCP servers
npm update -g @upstash/context7-mcp
npm update -g @socketsecurity/mcp
npm update -g @playwright/mcp

# Update Playwright browsers
npx playwright install

# Rebuild sandbox image
cd .sandbox
docker build -t sandbox-runner:latest .
```

**After Node.js Updates:**
```bash
# Reinstall global packages
npm install -g @upstash/context7-mcp @socketsecurity/mcp @playwright/mcp tsx

# Verify versions
node --version
npm --version
```

### Health Checks

**Run validation suite:**
```bash
# Progressive discovery test
npx tsx .mcp-servers/test-discovery.ts

# End-to-end workflow test
npx tsx .mcp-servers/test-code-first.ts

# Docker health
docker ps
docker images | grep sandbox-runner
```

### Performance Monitoring

**Track token usage:**
```typescript
const metrics = {
  traditional: 11300,
  codeFIRST: 637,
  savings: '94.4%'
};

// Log metrics
console.log('Token efficiency:', metrics);
```

**Monitor execution times:**
```typescript
const start = Date.now();
const result = await executeSandbox(code);
const time = Date.now() - start;

console.log('Execution time:', time, 'ms');
```

---

## Checklist: Ready to Use

### Pre-Flight Checklist

Before using CODE-FIRST architecture, verify:

- [ ] Node.js v18+ installed
- [ ] npm v8+ installed
- [ ] Docker v20.10+ installed
- [ ] Context7 MCP installed and working
- [ ] Socket MCP installed and working
- [ ] Playwright MCP installed and working
- [ ] Playwright browsers installed
- [ ] Sandbox Docker image built
- [ ] Progressive discovery test passes (75% savings)
- [ ] End-to-end workflow test passes (94.4% savings)
- [ ] Skills directory exists with 2+ skills
- [ ] Configuration files present (.mcp-config.json, .claude.json)
- [ ] Environment variables configured (if needed)

### Success Criteria

✅ **System is ready when:**
- All tests pass with expected token savings
- MCP servers respond to health checks
- Sandbox executes code without errors
- Skills can be imported and used
- Documentation is accessible

---

## Quick Start Command

**Run this to validate everything:**

```bash
#!/bin/bash
echo "🚀 CODE-FIRST Architecture Validation"
echo "======================================"

echo -n "Node.js: "
node --version

echo -n "npm: "
npm --version

echo -n "Docker: "
docker --version

echo ""
echo "Testing MCP Servers..."
npx tsx .mcp-servers/test-discovery.ts

echo ""
echo "Testing CODE-FIRST Workflow..."
npx tsx .mcp-servers/test-code-first.ts

echo ""
echo "✅ Validation Complete!"
```

---

## Support & Resources

### Documentation

- **Architecture:** `.claude/ARCHITECTURE-CODE-FIRST.md`
- **Optimization Report:** `OPTIMIZATION-REPORT.md`
- **Prerequisite Framework:** `.claude/PREREQUISITE-FRAMEWORK.md` (this file)
- **MCP Servers:** `.mcp-servers/README.md`
- **Sandbox:** `.sandbox/README.md`
- **Skills:** `.skills/README.md`

### External Resources

- **Anthropic MCP Article:** https://www.anthropic.com/code-execution-mcp
- **Context7 Docs:** https://github.com/upstash/context7
- **Socket.dev Docs:** https://docs.socket.dev/
- **Playwright Docs:** https://playwright.dev/

### Getting Help

1. Check documentation in `.claude/` and `.mcp-servers/`
2. Run validation tests to identify issues
3. Review troubleshooting section above
4. Check MCP server documentation

---

**Framework Version:** 1.0.0
**Last Updated:** 2025-11-05
**Status:** ✅ OPERATIONAL
