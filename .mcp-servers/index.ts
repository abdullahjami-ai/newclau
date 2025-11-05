/**
 * MCP Servers - Model Context Protocol Integration
 *
 * This directory contains TypeScript APIs for interacting with MCP servers.
 * Claude discovers tools by exploring this filesystem structure.
 *
 * **Available Servers:**
 * - context7: Documentation and code examples
 * - socket: Dependency security scanning
 * - playwright: Browser automation and testing
 *
 * **Usage:**
 * ```typescript
 * import { searchDocs } from './.mcp-servers/context7';
 * import { scanDependencies } from './.mcp-servers/socket';
 * import { navigateTo } from './.mcp-servers/playwright';
 * ```
 *
 * @see ./README.md for detailed documentation
 */

export * as context7 from './context7';
export * as socket from './socket';
export * as playwright from './playwright';

export { callMCP, listMCPServers, checkMCPServer } from './client';
