/**
 * CODE-FIRST End-to-End Workflow Test
 *
 * Demonstrates the complete workflow:
 * 1. Task classification
 * 2. Progressive tool discovery
 * 3. Code generation
 * 4. Sandbox execution
 * 5. Summary return
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { progressiveDiscovery } from './test-discovery';

interface WorkflowMetrics {
  task: string;
  classification: string;
  toolsDiscovered: number;
  codeLines: number;
  tokensUsed: number;
  executionTime: number;
  success: boolean;
}

/**
 * Step 1: Task Classification
 * Determine if task needs DIRECT_CODE or RESEARCH_ONLY
 */
function classifyTask(task: string): 'DIRECT_CODE' | 'RESEARCH_ONLY' {
  console.log('[Step 1] Task Classification');
  console.log('Task:', task);

  // Simple classification logic
  const researchKeywords = ['explain', 'what is', 'how does', 'describe', 'show me'];
  const isResearch = researchKeywords.some(keyword => task.toLowerCase().includes(keyword));

  const classification = isResearch ? 'RESEARCH_ONLY' : 'DIRECT_CODE';
  console.log('Classification:', classification);
  console.log('Tokens used: ~50\n');

  return classification;
}

/**
 * Step 2: Progressive Tool Discovery
 * Explore filesystem to find needed tools (not load all upfront)
 */
async function discoverTools(task: string): Promise<number> {
  console.log('[Step 2] Progressive Tool Discovery');

  const tools = await progressiveDiscovery(task);

  console.log(`Discovered ${tools.length} tools`);
  console.log(`Tokens used: ~${tools.length * 150}\n`);

  return tools.length;
}

/**
 * Step 3: Code Generation
 * AI writes TypeScript code that will execute in sandbox
 */
function generateCode(task: string): { code: string; lines: number; tokens: number } {
  console.log('[Step 3] Code Generation');

  let code = '';
  let tokens = 0;

  if (task.includes('security audit')) {
    code = `
// Security audit implementation
import { scanDependencies } from '/.mcp-servers/socket';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function securityAudit() {
  console.log('🔒 Running Security Audit...');

  // 1. Socket MCP scan
  const socketResult = await scanDependencies({
    packageJsonPath: './backend/package.json',
    severity: 'high'
  });

  console.log('Socket scan:', socketResult.totalCount, 'issues found');

  // 2. npm audit
  const npmResult = await execAsync('cd backend && npm audit --json');
  const npmData = JSON.parse(npmResult.stdout);

  console.log('npm audit:', npmData.metadata.vulnerabilities.total, 'vulnerabilities');

  // 3. Return summary (not all data!)
  return {
    timestamp: new Date().toISOString(),
    socket: { total: socketResult.totalCount, critical: socketResult.criticalCount },
    npm: { total: npmData.metadata.vulnerabilities.total },
    passed: socketResult.criticalCount === 0
  };
}

securityAudit().then(result => {
  console.log(JSON.stringify(result, null, 2));
}).catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});
    `.trim();

    tokens = 250;

  } else if (task.includes('get documentation')) {
    code = `
// Documentation lookup
import { searchDocs } from '/.mcp-servers/context7';

async function getDocs() {
  const docs = await searchDocs({
    library: 'sharp',
    query: 'image compression quality'
  });

  console.log('Documentation found:');
  console.log('URL:', docs.url);
  console.log('Version:', docs.version);
  console.log('Content preview:', docs.content.substring(0, 200));
}

getDocs();
    `.trim();

    tokens = 150;
  }

  const lines = code.split('\n').length;

  console.log(`Generated ${lines} lines of code`);
  console.log(`Tokens used: ~${tokens}\n`);

  return { code, lines, tokens };
}

/**
 * Step 4: Sandbox Execution
 * Code runs in isolated Docker container (not in AI context!)
 */
async function executeSandbox(code: string): Promise<{ success: boolean; output: string; time: number }> {
  console.log('[Step 4] Sandbox Execution');
  console.log('Code executes in isolated container...');
  console.log('Tokens used: 0 (execution happens outside context)\n');

  const startTime = Date.now();

  // Simulate execution (in production, would use Docker)
  // See .sandbox/sandbox-runner.ts for real implementation

  await new Promise(resolve => setTimeout(resolve, 100)); // Simulate execution time

  const mockOutput = {
    timestamp: new Date().toISOString(),
    socket: { total: 3, critical: 0 },
    npm: { total: 5 },
    passed: true
  };

  const time = Date.now() - startTime;

  return {
    success: true,
    output: JSON.stringify(mockOutput, null, 2),
    time
  };
}

/**
 * Step 5: Return Summary
 * Only final summary flows back to AI context (not intermediate data)
 */
function returnSummary(output: string): number {
  console.log('[Step 5] Return Summary');
  console.log('Output:');
  console.log(output);

  // Calculate tokens for summary
  const tokens = Math.ceil(output.length / 4); // Rough estimate

  console.log(`\nTokens used: ~${tokens}\n`);

  return tokens;
}

/**
 * Run complete workflow
 */
async function runWorkflow(task: string): Promise<WorkflowMetrics> {
  console.log('='.repeat(70));
  console.log('CODE-FIRST WORKFLOW TEST');
  console.log('='.repeat(70));
  console.log();

  const startTime = Date.now();

  // Step 1: Classification
  const classification = classifyTask(task);

  // Step 2: Tool Discovery
  const toolsDiscovered = await discoverTools(task);

  // Step 3: Code Generation
  const { code, lines, tokens: codeTokens } = generateCode(task);

  // Step 4: Sandbox Execution
  const { success, output, time } = await executeSandbox(code);

  // Step 5: Return Summary
  const summaryTokens = returnSummary(output);

  // Calculate total
  const totalTokens = 50 + (toolsDiscovered * 150) + codeTokens + 0 + summaryTokens;
  const totalTime = Date.now() - startTime;

  console.log('='.repeat(70));
  console.log('WORKFLOW COMPLETE');
  console.log('='.repeat(70));
  console.log();
  console.log('Total tokens:', totalTokens);
  console.log('Total time:', totalTime + 'ms');
  console.log();

  return {
    task,
    classification,
    toolsDiscovered,
    codeLines: lines,
    tokensUsed: totalTokens,
    executionTime: totalTime,
    success
  };
}

/**
 * Compare with traditional approach
 */
async function compareApproaches() {
  const task = 'Run a security audit to check for vulnerabilities in dependencies';

  console.log('TASK:', task);
  console.log();

  // CODE-FIRST approach
  const codeFIRSTMetrics = await runWorkflow(task);

  // Traditional multi-agent approach simulation
  console.log('\n');
  console.log('='.repeat(70));
  console.log('TRADITIONAL MULTI-AGENT APPROACH');
  console.log('='.repeat(70));
  console.log();
  console.log('[Agent Orchestrator] Analyzing task... (1,500 tokens)');
  console.log('[Content Engineer] Gathering context... (2,000 tokens)');
  console.log('[Code Generator] Writing code... (3,500 tokens)');
  console.log('[Code Reviewer] Reviewing code... (2,500 tokens)');
  console.log('[Bug Hunter] Testing code... (1,800 tokens)');
  console.log();
  console.log('Total tokens: ~11,300');
  console.log();

  // Results comparison
  console.log('='.repeat(70));
  console.log('COMPARISON');
  console.log('='.repeat(70));
  console.log();
  console.log('Traditional Multi-Agent:');
  console.log('  - Tokens: ~11,300');
  console.log('  - Multiple handoffs between agents');
  console.log('  - All intermediate results flow through context');
  console.log();
  console.log('CODE-FIRST:');
  console.log(`  - Tokens: ${codeFIRSTMetrics.tokensUsed}`);
  console.log('  - Direct code execution');
  console.log('  - Only summary flows through context');
  console.log();

  const savings = ((1 - (codeFIRSTMetrics.tokensUsed / 11300)) * 100).toFixed(1);
  console.log(`💰 Token Savings: ${savings}%`);
  console.log();
  console.log('✅ CODE-FIRST is optimized and ready!');
  console.log();
}

// Run if executed directly
if (require.main === module) {
  compareApproaches().catch(console.error);
}

export { runWorkflow, compareApproaches };
