import { callMCP } from '../client';
import { SecurityVulnerability, Severity } from '../types';

export interface CheckPackageInput {
  name: string;       // Package name (e.g., "express")
  version?: string;   // Specific version (optional)
}

export interface CheckPackageOutput {
  name: string;
  version: string;
  score: number;      // Security score (0-100)
  vulnerabilities: SecurityVulnerability[];
  supplyChainRisk: Severity;
  qualityScore: number;
  maintenanceScore: number;
  licenseIssues: boolean;
  recommendation: 'safe' | 'caution' | 'avoid';
}

/**
 * Check a single npm package for security issues
 *
 * Useful before adding a new dependency to your project.
 * Provides comprehensive security analysis including supply chain risks.
 *
 * @example
 * const check = await checkPackage({
 *   name: 'sharp',
 *   version: '0.33.0'
 * });
 *
 * if (check.recommendation === 'safe') {
 *   console.log('Safe to use!');
 * }
 *
 * @example
 * // Check latest version
 * const result = await checkPackage({ name: 'express' });
 * console.log(`Security score: ${result.score}/100`);
 */
export async function checkPackage(
  input: CheckPackageInput
): Promise<CheckPackageOutput> {
  return callMCP<CheckPackageOutput>('socket__check_package', input);
}
