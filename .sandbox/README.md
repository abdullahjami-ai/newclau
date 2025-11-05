# Execution Sandbox

Secure execution environment for CODE-FIRST architecture.

## Features

- **Isolated Execution**: Docker containers with resource limits
- **Path Restrictions**: Read-only filesystem with specific mount points
- **Resource Limits**: CPU, memory, and time constraints
- **Non-root User**: All code runs as unprivileged `sandbox` user
- **Network Isolation**: Optional network access (disabled by default)

## Architecture

```
┌─────────────────────────────────────────┐
│  CODE-FIRST AI writes TypeScript code  │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│        Sandbox Runner (Host)            │
│  - Validates code                       │
│  - Writes to temp file                  │
│  - Builds Docker command                │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│     Docker Container (Isolated)         │
│  ┌───────────────────────────────────┐  │
│  │  Non-root user: sandbox          │  │
│  │  Read-only filesystem             │  │
│  │  Resource limits:                 │  │
│  │    - Memory: 512MB                │  │
│  │    - CPU: 1 core                  │  │
│  │    - Timeout: 30s                 │  │
│  │  Network: DISABLED                │  │
│  └───────────────────────────────────┘  │
│                                          │
│  Code executes → Results returned       │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Results (stdout/stderr/exit code)      │
│  Only summary flows to AI context       │
└─────────────────────────────────────────┘
```

## Setup

### Build Sandbox Image

```bash
cd .sandbox
docker build -t sandbox-runner:latest .
```

### Test Sandbox

```typescript
import { executeSandbox } from './.sandbox/sandbox-runner';

const code = `
console.log('Hello from sandbox!');
console.log('Process:', process.version);
`;

const result = await executeSandbox(code);
console.log(result);
```

## Usage

### Basic Execution

```typescript
import { executeSandbox } from './.sandbox/sandbox-runner';

const result = await executeSandbox(`
  const fs = require('fs');
  const files = fs.readdirSync('/workspace');
  console.log('Files:', files);
`);

if (result.success) {
  console.log('Output:', result.stdout);
} else {
  console.error('Error:', result.error);
}
```

### With Options

```typescript
const result = await executeSandbox(code, {
  timeout: 60000,        // 60 seconds
  maxMemory: 1024,       // 1GB
  cpuLimit: 2.0,         // 2 cores
  networkEnabled: true,  // Allow network
  env: {
    API_KEY: 'xxx'       // Pass env vars
  }
});
```

### Execute with MCP Tools

```typescript
import { executeSandbox } from './.sandbox/sandbox-runner';
import { callMCP } from '../.mcp-servers/real-client';

const code = `
  // This code runs in sandbox and can call MCP tools
  const { callMCP } = require('/.mcp-servers/real-client');

  // Get documentation
  const docs = await callMCP('context7__search_docs', {
    library: 'sharp',
    query: 'image resize'
  });

  console.log('Documentation:', docs.content);
`;

const result = await executeSandbox(code, {
  allowedPaths: ['/workspace', '/.mcp-servers']
});
```

## Security

### Resource Limits

- **Memory**: Default 512MB, configurable
- **CPU**: Default 1 core, configurable
- **Timeout**: Default 30s, max 5 minutes
- **Disk**: Read-only filesystem except /tmp (100MB)

### Path Restrictions

- All code runs in `/workspace`
- Filesystem is read-only except `/tmp`
- Only explicitly allowed paths are mounted
- No access to host filesystem

### Network Isolation

- Network disabled by default
- Enable only when needed (e.g., API calls)
- No access to localhost/127.0.0.1

### User Permissions

- Code runs as `sandbox` user (UID 1001)
- No root access
- No sudo/setuid capabilities

## Privacy

All data processing happens in the sandbox:

```typescript
// BAD: Large data flows through AI context
const users = await getAllUsers(); // 10,000 users
console.log(users); // All 10,000 flow to AI context!

// GOOD: Process in sandbox, return summary only
const code = `
  const users = await getAllUsers();
  const summary = {
    total: users.length,
    active: users.filter(u => u.active).length,
    inactive: users.filter(u => !u.active).length
  };
  console.log(JSON.stringify(summary));
`;

const result = await executeSandbox(code);
const summary = JSON.parse(result.stdout);
// Only summary (3 numbers) flows to AI context!
```

## Token Efficiency

### Traditional Approach
```
AI reads 10,000 user records → 50,000 tokens
AI processes in context → 30,000 tokens
AI returns summary → 100 tokens
Total: ~80,000 tokens
```

### CODE-FIRST Sandbox
```
AI writes code → 150 tokens
Code executes in sandbox → 0 tokens (not in context)
Sandbox returns summary → 50 tokens
Total: ~200 tokens (99.75% savings!)
```

## Troubleshooting

### Docker Not Available

```bash
# Check Docker installation
docker --version

# Start Docker daemon (if needed)
sudo systemctl start docker
```

### Permission Denied

```bash
# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

### Out of Memory

```typescript
// Increase memory limit
const result = await executeSandbox(code, {
  maxMemory: 2048 // 2GB
});
```

### Timeout

```typescript
// Increase timeout
const result = await executeSandbox(code, {
  timeout: 120000 // 2 minutes
});
```

## Examples

See `.skills/` for production examples:
- `.skills/security-audit/` - Security scanning with Socket MCP
- `.skills/run-tests/` - Test execution with coverage
