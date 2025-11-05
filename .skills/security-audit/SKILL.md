# Security Audit Skill

## Purpose
Runs comprehensive security audit of the Image Compressor application including dependency scanning, secret detection, and OWASP checks.

## When to Use
- Before deployments to production
- After adding new dependencies
- Weekly scheduled security audits
- When security concerns are raised
- Before major releases

## What it Does
1. **Dependency Scanning:** Uses Socket MCP to scan all npm dependencies for vulnerabilities
2. **npm Audit:** Runs built-in npm audit for additional checks
3. **Secret Detection:** Searches codebase for hardcoded secrets, API keys, passwords
4. **Environment Validation:** Ensures required environment variables are configured
5. **Report Generation:** Returns prioritized vulnerability report with actionable fixes

## Usage

```typescript
import { securityAudit } from './.skills/security-audit/audit';

// Run full security audit
const report = await securityAudit({
  checkSecrets: true,
  checkDependencies: true,
  checkEnvironment: true,
  severity: 'high' // 'critical' | 'high' | 'medium' | 'low'
});

console.log(`Security Audit ${report.passed ? 'PASSED' : 'FAILED'}`);
console.log(`Found ${report.critical.count} critical issues`);

// Review top issues
report.critical.issues.forEach(issue => {
  console.log(`- ${issue.package}: ${issue.title}`);
  console.log(`  Fix: ${issue.fix}`);
});
```

## Output Format

```typescript
{
  timestamp: string;              // ISO timestamp
  passed: boolean;                // True if no critical/high issues
  critical: {
    count: number;
    issues: Array<{
      package: string;
      title: string;
      severity: string;
      fix: string;
    }>;
  };
  high: {
    count: number;
    issues: Array<{ ... }>;
  };
  medium: {
    count: number;
    issues: Array<{ ... }>;
  };
  secrets: {
    found: number;
    action: string;
  };
  environment: {
    missingVars: string[];
    status: 'OK' | 'INCOMPLETE';
  };
  recommendation: string;         // What to do next
}
```

## Dependencies
- **Socket MCP:** For dependency vulnerability scanning
- **npm audit:** Built-in npm security audit
- **grep:** For secret detection patterns
- **fs:** For file reading (environment variables)

## Examples

### Example 1: Quick Security Check Before Deployment
```typescript
const audit = await securityAudit({ severity: 'critical' });

if (!audit.passed) {
  console.error('❌ Critical security issues found!');
  console.error('Cannot deploy until resolved.');
  process.exit(1);
}

console.log('✅ Security check passed!');
```

### Example 2: Weekly Comprehensive Audit
```typescript
const fullAudit = await securityAudit({
  checkSecrets: true,
  checkDependencies: true,
  checkEnvironment: true,
  severity: 'medium'
});

// Generate report
console.log('\n📊 Weekly Security Audit Report');
console.log(`Date: ${fullAudit.timestamp}`);
console.log(`Status: ${fullAudit.passed ? '✅ PASSED' : '⚠️ FAILED'}`);
console.log(`\nVulnerabilities:`);
console.log(`  Critical: ${fullAudit.critical.count}`);
console.log(`  High: ${fullAudit.high.count}`);
console.log(`  Medium: ${fullAudit.medium.count}`);
console.log(`\nSecrets: ${fullAudit.secrets.found} potential secrets found`);
console.log(`Environment: ${fullAudit.environment.status}`);
```

### Example 3: Post-Dependency Update Check
```typescript
// After npm install/update
console.log('🔒 Running security audit on updated dependencies...');

const audit = await securityAudit({
  checkDependencies: true,
  severity: 'high'
});

const newVulns = audit.critical.count + audit.high.count;

if (newVulns > 0) {
  console.warn(`⚠️  New vulnerabilities detected: ${newVulns}`);
  console.log('Top issues:');
  audit.critical.issues.concat(audit.high.issues).forEach(issue => {
    console.log(`  - ${issue.package}: ${issue.title}`);
  });
} else {
  console.log('✅ No new vulnerabilities!');
}
```

## Token Efficiency

**First Run:**
- Write skill code: ~200 tokens
- Execute audit: 0 tokens (in sandbox)
- Return report: ~50 tokens
- **Total:** ~250 tokens

**Subsequent Runs:**
- Load cached skill: ~20 tokens
- Execute audit: 0 tokens (in sandbox)
- Return report: ~50 tokens
- **Total:** ~70 tokens

**Savings:** 72% faster on subsequent runs!

## Maintenance

This skill is automatically saved and can be updated. To improve:

1. Add new security checks
2. Enhance secret detection patterns
3. Add more vulnerability sources
4. Improve report formatting
5. Add auto-fix capabilities

## Related Skills
- `deploy-railway/` - Uses this skill before deployment
- `run-tests/` - Can be run before security audit

## Version History
- **1.0.0:** Initial security audit with Socket MCP, npm audit, secret detection
- Auto-updates as skill is refined

---

**Last Updated:** Auto-generated on first use
