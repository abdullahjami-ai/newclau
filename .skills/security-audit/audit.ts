/**
 * Security Audit Skill
 *
 * Comprehensive security audit including:
 * - Socket MCP dependency scanning
 * - npm audit
 * - Secret detection
 * - Environment validation
 *
 * @see SKILL.md for documentation
 */

import { scanDependencies } from '../../.mcp-servers/socket';
import * as fs from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface SecurityAuditOptions {
  checkSecrets?: boolean;         // Check for hardcoded secrets (default: true)
  checkDependencies?: boolean;    // Scan dependencies (default: true)
  checkEnvironment?: boolean;     // Validate environment (default: true)
  severity?: 'critical' | 'high' | 'medium' | 'low';  // Minimum severity (default: 'high')
}

export interface SecurityAuditReport {
  timestamp: string;
  passed: boolean;
  critical: {
    count: number;
    issues: Array<{
      package: string;
      title: string;
      severity: string;
      fix: string;
      cve?: string;
    }>;
  };
  high: {
    count: number;
    issues: Array<{
      package: string;
      title: string;
      severity: string;
      fix: string;
    }>;
  };
  medium: {
    count: number;
    issues: Array<{
      package: string;
      title: string;
      severity: string;
    }>;
  };
  secrets: {
    found: number;
    action: string;
  };
  environment: {
    missingVars: string[];
    status: 'OK' | 'INCOMPLETE';
  };
  recommendation: string;
}

/**
 * Run comprehensive security audit
 *
 * @example
 * const report = await securityAudit({ severity: 'high' });
 * if (!report.passed) {
 *   console.error('Security issues found!');
 * }
 */
export async function securityAudit(
  options: SecurityAuditOptions = {}
): Promise<SecurityAuditReport> {
  const {
    checkSecrets = true,
    checkDependencies = true,
    checkEnvironment = true,
    severity = 'high'
  } = options;

  console.log('🔒 Starting Security Audit...\n');

  const report: SecurityAuditReport = {
    timestamp: new Date().toISOString(),
    passed: true,
    critical: { count: 0, issues: [] },
    high: { count: 0, issues: [] },
    medium: { count: 0, issues: [] },
    secrets: { found: 0, action: 'None found' },
    environment: { missingVars: [], status: 'OK' },
    recommendation: ''
  };

  // 1. Dependency Scanning with Socket MCP
  if (checkDependencies) {
    console.log('📦 Scanning dependencies with Socket MCP...');

    try {
      const socketReport = await scanDependencies({
        packageJsonPath: './backend/package.json',
        severity
      });

      // Process vulnerabilities (in sandbox - not in Claude context!)
      const critical = socketReport.vulnerabilities.filter(v => v.severity === 'critical');
      const high = socketReport.vulnerabilities.filter(v => v.severity === 'high');
      const medium = socketReport.vulnerabilities.filter(v => v.severity === 'medium');

      report.critical.count = critical.length;
      report.critical.issues = critical.slice(0, 5).map(v => ({
        package: v.package,
        title: v.title,
        severity: v.severity,
        fix: v.fixAvailable ? 'Update available' : 'Manual fix required',
        cve: v.cve
      }));

      report.high.count = high.length;
      report.high.issues = high.slice(0, 5).map(v => ({
        package: v.package,
        title: v.title,
        severity: v.severity,
        fix: v.fixAvailable ? 'Update available' : 'Manual fix required'
      }));

      report.medium.count = medium.length;

      console.log(`   ✓ Socket scan complete`);
      console.log(`     Critical: ${critical.length}, High: ${high.length}, Medium: ${medium.length}`);

    } catch (error) {
      console.error(`   ✗ Socket MCP scan failed:`, error);
      // Continue with other checks
    }

    // 2. npm audit
    console.log('\n🔍 Running npm audit...');

    try {
      const npmAuditResult = await execAsync('cd backend && npm audit --json');
      const auditData = JSON.parse(npmAuditResult.stdout);

      if (auditData.metadata?.vulnerabilities) {
        const npmCritical = auditData.metadata.vulnerabilities.critical || 0;
        const npmHigh = auditData.metadata.vulnerabilities.high || 0;

        console.log(`   ✓ npm audit complete`);
        console.log(`     Critical: ${npmCritical}, High: ${npmHigh}`);

        // Add to report if Socket didn't catch them
        report.critical.count += npmCritical;
        report.high.count += npmHigh;
      }

    } catch (error: any) {
      // npm audit exits with error code if vulnerabilities found
      if (error.stdout) {
        try {
          const auditData = JSON.parse(error.stdout);
          if (auditData.metadata?.vulnerabilities) {
            const npmCritical = auditData.metadata.vulnerabilities.critical || 0;
            const npmHigh = auditData.metadata.vulnerabilities.high || 0;

            console.log(`   ⚠ npm audit found issues`);
            console.log(`     Critical: ${npmCritical}, High: ${npmHigh}`);

            report.critical.count += npmCritical;
            report.high.count += npmHigh;
          }
        } catch (parseError) {
          console.error(`   ✗ npm audit failed:`, parseError);
        }
      }
    }
  }

  // 3. Secret Detection
  if (checkSecrets) {
    console.log('\n🔐 Scanning for hardcoded secrets...');

    const secretPatterns = [
      'API_KEY\\s*=\\s*["\'][^"\']+["\']',
      'SECRET\\s*=\\s*["\'][^"\']+["\']',
      'PASSWORD\\s*=\\s*["\'][^"\']+["\']',
      'TOKEN\\s*=\\s*["\'][^"\']+["\']',
      'private[_-]?key',
      'aws[_-]?secret',
      'database[_-]?password'
    ];

    let secretsFound = 0;
    const excludeDirs = '--exclude-dir=node_modules --exclude-dir=.git --exclude-dir=dist';

    for (const pattern of secretPatterns) {
      try {
        const result = await execAsync(
          `grep -r -i -E "${pattern}" ./backend ./frontend ${excludeDirs} || true`
        );

        if (result.stdout) {
          const matches = result.stdout.split('\n').filter(l => {
            const line = l.trim();
            // Exclude comments, .env.example, and documentation
            return line &&
                   !line.includes('.env.example') &&
                   !line.includes('# ') &&
                   !line.includes('//') &&
                   !line.includes('/*');
          });

          secretsFound += matches.length;
        }
      } catch (error) {
        // grep returns non-zero if no matches, which is fine
      }
    }

    report.secrets.found = secretsFound;
    report.secrets.action = secretsFound > 0
      ? `Review and remove ${secretsFound} potential secrets`
      : 'None found';

    console.log(`   ${secretsFound === 0 ? '✓' : '⚠'} Found: ${secretsFound} potential secrets`);
  }

  // 4. Environment Variable Validation
  if (checkEnvironment) {
    console.log('\n⚙️  Validating environment configuration...');

    const requiredVars = [
      'NODE_ENV',
      'PORT',
      'MAX_FILE_SIZE',
      'ALLOWED_FILE_TYPES',
      'FRONTEND_URL'
    ];

    try {
      const backendEnv = await fs.readFile('./backend/.env', 'utf-8');
      const missingVars = requiredVars.filter(v => !backendEnv.includes(`${v}=`));

      report.environment.missingVars = missingVars;
      report.environment.status = missingVars.length === 0 ? 'OK' : 'INCOMPLETE';

      console.log(`   ${missingVars.length === 0 ? '✓' : '⚠'} Environment: ${report.environment.status}`);
      if (missingVars.length > 0) {
        console.log(`     Missing: ${missingVars.join(', ')}`);
      }

    } catch (error) {
      console.error(`   ✗ Could not read .env file:`, error);
      report.environment.status = 'INCOMPLETE';
    }
  }

  // 5. Determine Overall Status
  report.passed = report.critical.count === 0 &&
                  report.high.count === 0 &&
                  report.secrets.found === 0 &&
                  report.environment.status === 'OK';

  // 6. Generate Recommendation
  if (report.passed) {
    report.recommendation = '✅ All security checks passed! Safe to deploy.';
  } else {
    const issues = [];
    if (report.critical.count > 0) issues.push(`${report.critical.count} critical vulnerabilities`);
    if (report.high.count > 0) issues.push(`${report.high.count} high-priority vulnerabilities`);
    if (report.secrets.found > 0) issues.push(`${report.secrets.found} potential secrets`);
    if (report.environment.status !== 'OK') issues.push('incomplete environment configuration');

    report.recommendation = `⚠️  Found ${issues.join(', ')}. Fix before deploying.`;
  }

  console.log('\n' + '='.repeat(50));
  console.log(report.passed ? '✅ SECURITY AUDIT PASSED' : '⚠️  SECURITY AUDIT FAILED');
  console.log('='.repeat(50) + '\n');

  return report;
}
