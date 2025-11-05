/**
 * Socket MCP Server
 *
 * Provides dependency security scanning and vulnerability detection.
 * Helps identify supply chain risks and outdated packages.
 *
 * **Available Tools:**
 * - scanDependencies: Scan package.json for vulnerabilities
 * - checkPackage: Check a single package before adding it
 *
 * **Installation:**
 * Use the FREE hosted service: https://mcp.socket.dev/
 * OR install locally: `npx @socketsecurity/mcp`
 *
 * **Cost:** FREE (hosted service)
 *
 * @see https://docs.socket.dev/mcp
 */

export {
  scanDependencies,
  type ScanDependenciesInput,
  type ScanDependenciesOutput
} from './scanDependencies';

export {
  checkPackage,
  type CheckPackageInput,
  type CheckPackageOutput
} from './checkPackage';
