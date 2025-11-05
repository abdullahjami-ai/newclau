import { callMCP } from '../client';
import { SecurityVulnerability } from '../types';

export interface ScanDependenciesInput {
  packageJsonPath: string;  // Path to package.json
  severity?: 'critical' | 'high' | 'medium' | 'low';  // Minimum severity to report
}

export interface ScanDependenciesOutput {
  vulnerabilities: SecurityVulnerability[];
  totalCount: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  score: number;  // Overall security score (0-100)
  passed: boolean;  // True if no critical/high vulnerabilities
}

/**
 * Scan package.json dependencies for security vulnerabilities
 *
 * Uses Socket MCP to check all dependencies against their security database.
 * Provides detailed vulnerability information and remediation advice.
 *
 * @example
 * const report = await scanDependencies({
 *   packageJsonPath: './backend/package.json',
 *   severity: 'high'
 * });
 *
 * console.log(`Found ${report.criticalCount} critical issues`);
 * report.vulnerabilities.forEach(v => {
 *   console.log(`${v.package}: ${v.title}`);
 * });
 *
 * @example
 * // Quick scan
 * const scan = await scanDependencies({
 *   packageJsonPath: './package.json'
 * });
 * if (!scan.passed) {
 *   console.error('Security issues found!');
 * }
 */
export async function scanDependencies(
  input: ScanDependenciesInput
): Promise<ScanDependenciesOutput> {
  return callMCP<ScanDependenciesOutput>('socket__scan_dependencies', input);
}
