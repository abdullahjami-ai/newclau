/**
 * Progressive Tool Discovery Test
 *
 * Demonstrates how AI discovers MCP tools on-demand via filesystem exploration
 * instead of loading all tools upfront (98.7% token savings)
 */

import * as fs from 'fs/promises';
import * as path from 'path';

interface ToolDefinition {
  name: string;
  server: string;
  path: string;
  description: string;
  inputs: any;
  outputs: any;
}

/**
 * Traditional Approach: Load ALL tools upfront
 * Token cost: ~150,000 tokens for 1000+ tools
 */
async function traditionalLoadAllTools(): Promise<ToolDefinition[]> {
  console.log('[Traditional] Loading ALL tools upfront...\n');

  const allTools: ToolDefinition[] = [];
  const serversDir = path.join(__dirname);

  // Load every single tool definition
  const servers = await fs.readdir(serversDir);

  for (const server of servers) {
    const serverPath = path.join(serversDir, server);
    const stat = await fs.stat(serverPath).catch(() => null);

    if (!stat?.isDirectory()) continue;

    const files = await fs.readdir(serverPath);

    for (const file of files) {
      if (file.endsWith('.ts') && file !== 'index.ts') {
        const toolPath = path.join(serverPath, file);
        const content = await fs.readFile(toolPath, 'utf-8');

        // Parse tool definition
        allTools.push({
          name: file.replace('.ts', ''),
          server,
          path: toolPath,
          description: extractDescription(content),
          inputs: extractInterface(content, 'Input'),
          outputs: extractInterface(content, 'Output')
        });
      }
    }
  }

  console.log(`[Traditional] Loaded ${allTools.length} tools`);
  console.log(`[Traditional] Estimated tokens: ~${allTools.length * 150} tokens\n`);

  return allTools;
}

/**
 * CODE-FIRST Approach: Discover tools progressively
 * Token cost: ~2,000 tokens (only load what's needed)
 */
async function progressiveDiscovery(taskDescription: string): Promise<ToolDefinition[]> {
  console.log('[Progressive] Task:', taskDescription);
  console.log('[Progressive] Discovering tools on-demand...\n');

  const discoveredTools: ToolDefinition[] = [];
  const serversDir = path.join(__dirname);

  // Step 1: Explore available servers
  const servers = await fs.readdir(serversDir);
  const serverDirs = [];

  for (const server of servers) {
    const serverPath = path.join(serversDir, server);
    const stat = await fs.stat(serverPath).catch(() => null);
    if (stat?.isDirectory()) {
      serverDirs.push(server);
    }
  }

  console.log('[Progressive] Found servers:', serverDirs);

  // Step 2: Based on task, identify likely server
  let targetServer = '';
  if (taskDescription.includes('security') || taskDescription.includes('vulnerability')) {
    targetServer = 'socket';
  } else if (taskDescription.includes('documentation') || taskDescription.includes('docs')) {
    targetServer = 'context7';
  } else if (taskDescription.includes('browser') || taskDescription.includes('UI')) {
    targetServer = 'playwright';
  }

  console.log('[Progressive] Target server:', targetServer);

  // Step 3: Load ONLY tools from target server
  if (targetServer && serverDirs.includes(targetServer)) {
    const serverPath = path.join(serversDir, targetServer);
    const files = await fs.readdir(serverPath);

    for (const file of files) {
      if (file.endsWith('.ts') && file !== 'index.ts') {
        const toolPath = path.join(serverPath, file);
        const content = await fs.readFile(toolPath, 'utf-8');

        discoveredTools.push({
          name: file.replace('.ts', ''),
          server: targetServer,
          path: toolPath,
          description: extractDescription(content),
          inputs: extractInterface(content, 'Input'),
          outputs: extractInterface(content, 'Output')
        });

        console.log(`[Progressive] Discovered: ${targetServer}/${file.replace('.ts', '')}`);
      }
    }
  }

  console.log(`\n[Progressive] Loaded ${discoveredTools.length} tools (only what's needed)`);
  console.log(`[Progressive] Estimated tokens: ~${discoveredTools.length * 150} tokens\n`);

  return discoveredTools;
}

/**
 * Helper functions
 */
function extractDescription(content: string): string {
  const match = content.match(/\/\*\*\s*\n\s*\*\s*(.+)\s*\n/);
  return match ? match[1] : '';
}

function extractInterface(content: string, type: 'Input' | 'Output'): any {
  // Simplified - in production would parse TypeScript interfaces
  return `${type} interface definition`;
}

/**
 * Run comparison
 */
async function runComparison() {
  console.log('='.repeat(70));
  console.log('PROGRESSIVE TOOL DISCOVERY TEST');
  console.log('='.repeat(70));
  console.log();

  // Scenario: Security audit task
  const task = 'Run a security audit to check for vulnerabilities in dependencies';

  // Traditional approach
  console.log('TRADITIONAL APPROACH: Load everything upfront');
  console.log('-'.repeat(70));
  const startTraditional = Date.now();
  const allTools = await traditionalLoadAllTools();
  const timeTraditional = Date.now() - startTraditional;

  // Progressive approach
  console.log('PROGRESSIVE APPROACH: Discover on-demand');
  console.log('-'.repeat(70));
  const startProgressive = Date.now();
  const discoveredTools = await progressiveDiscovery(task);
  const timeProgressive = Date.now() - startProgressive;

  // Results
  console.log('='.repeat(70));
  console.log('RESULTS');
  console.log('='.repeat(70));
  console.log();
  console.log('Traditional:');
  console.log(`  - Tools loaded: ${allTools.length}`);
  console.log(`  - Estimated tokens: ~${allTools.length * 150}`);
  console.log(`  - Time: ${timeTraditional}ms`);
  console.log();
  console.log('Progressive:');
  console.log(`  - Tools loaded: ${discoveredTools.length}`);
  console.log(`  - Estimated tokens: ~${discoveredTools.length * 150}`);
  console.log(`  - Time: ${timeProgressive}ms`);
  console.log();

  const tokenSavings = ((1 - (discoveredTools.length / allTools.length)) * 100).toFixed(1);
  console.log(`Token Savings: ${tokenSavings}%`);
  console.log();
  console.log('🎯 With progressive discovery, we load only what we need!');
  console.log('🚀 This scales to 1000+ tools without context overflow!');
  console.log();
}

// Run if executed directly
if (require.main === module) {
  runComparison().catch(console.error);
}

export { traditionalLoadAllTools, progressiveDiscovery };
