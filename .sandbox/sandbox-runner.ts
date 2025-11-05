/**
 * Sandbox Runner - Executes code in isolated Docker container
 *
 * Provides secure execution environment with:
 * - Resource limits (CPU, memory, time)
 * - Path restrictions
 * - Network isolation
 * - Non-root user execution
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';

const execAsync = promisify(exec);

export interface SandboxOptions {
  /**
   * Maximum execution time in milliseconds
   * @default 30000 (30 seconds)
   */
  timeout?: number;

  /**
   * Maximum memory in MB
   * @default 512
   */
  maxMemory?: number;

  /**
   * CPU limit (0.5 = 50% of one core)
   * @default 1.0
   */
  cpuLimit?: number;

  /**
   * Allowed paths for file access
   * @default ['/workspace']
   */
  allowedPaths?: string[];

  /**
   * Enable network access
   * @default false
   */
  networkEnabled?: boolean;

  /**
   * Environment variables to pass
   */
  env?: Record<string, string>;
}

export interface SandboxResult {
  success: boolean;
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTime: number;
  error?: string;
}

/**
 * Execute code in sandbox
 */
export async function executeSandbox(
  code: string,
  options: SandboxOptions = {}
): Promise<SandboxResult> {
  const {
    timeout = 30000,
    maxMemory = 512,
    cpuLimit = 1.0,
    allowedPaths = ['/workspace'],
    networkEnabled = false,
    env = {}
  } = options;

  const startTime = Date.now();

  try {
    // Generate unique execution ID
    const execId = crypto.randomBytes(8).toString('hex');
    const tempFile = path.join('/tmp', `sandbox-${execId}.js`);

    // Write code to temp file
    await fs.writeFile(tempFile, code);

    // Build Docker run command with restrictions
    const dockerArgs = [
      'docker', 'run',
      '--rm',
      '--read-only',
      '--tmpfs', '/tmp:rw,noexec,nosuid,size=100m',
      '--memory', `${maxMemory}m`,
      '--cpus', cpuLimit.toString(),
      '--user', 'sandbox',
      networkEnabled ? '' : '--network', networkEnabled ? '' : 'none'
    ].filter(Boolean);

    // Add environment variables
    for (const [key, value] of Object.entries(env)) {
      dockerArgs.push('-e', `${key}=${value}`);
    }

    // Add volume mounts for allowed paths
    for (const allowedPath of allowedPaths) {
      dockerArgs.push('-v', `${allowedPath}:${allowedPath}:ro`);
    }

    // Mount temp file
    dockerArgs.push('-v', `${tempFile}:/workspace/script.js:ro`);

    // Specify image and command
    dockerArgs.push('sandbox-runner:latest', 'node', '/workspace/script.js');

    // Execute with timeout
    const command = dockerArgs.join(' ');
    console.log('[Sandbox] Executing:', execId);

    const { stdout, stderr } = await execAsync(command, {
      timeout,
      maxBuffer: 10 * 1024 * 1024 // 10MB
    });

    const executionTime = Date.now() - startTime;

    // Cleanup
    await fs.unlink(tempFile).catch(() => {});

    return {
      success: true,
      stdout: stdout.trim(),
      stderr: stderr.trim(),
      exitCode: 0,
      executionTime
    };

  } catch (error: any) {
    const executionTime = Date.now() - startTime;

    return {
      success: false,
      stdout: error.stdout || '',
      stderr: error.stderr || '',
      exitCode: error.code || 1,
      executionTime,
      error: error.message
    };
  }
}

/**
 * Execute TypeScript code (compiles first)
 */
export async function executeSandboxTS(
  code: string,
  options: SandboxOptions = {}
): Promise<SandboxResult> {
  // In production, would use ts-node or compile to JS first
  // For now, just pass through to executeSandbox
  return executeSandbox(code, options);
}

/**
 * Check if Docker is available
 */
export async function checkSandboxAvailable(): Promise<boolean> {
  try {
    await execAsync('docker --version');
    return true;
  } catch {
    return false;
  }
}

/**
 * Build sandbox Docker image
 */
export async function buildSandboxImage(): Promise<void> {
  const dockerfilePath = path.join(__dirname, 'Dockerfile');

  console.log('[Sandbox] Building Docker image...');

  await execAsync(`docker build -t sandbox-runner:latest -f ${dockerfilePath} .`);

  console.log('[Sandbox] Image built successfully');
}
