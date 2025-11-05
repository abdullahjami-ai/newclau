/**
 * Run Tests Skill
 *
 * Executes test suite for backend and frontend with coverage.
 *
 * @see SKILL.md for documentation
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface RunTestsOptions {
  backend?: boolean;      // Run backend tests (default: true)
  frontend?: boolean;     // Run frontend tests (default: true)
  coverage?: boolean;     // Calculate coverage (default: false)
  watch?: boolean;        // Watch mode (default: false)
}

export interface TestFailure {
  suite: string;
  test: string;
  error: string;
}

export interface TestResults {
  passed: boolean;
  backend: {
    passed: number;
    failed: number;
    total: number;
    duration: number;
    failures: TestFailure[];
  };
  frontend: {
    passed: number;
    failed: number;
    total: number;
    duration: number;
    failures: TestFailure[];
  };
  coverage?: {
    overall: number;
    backend: number;
    frontend: number;
    statements: number;
    branches: number;
    functions: number;
    lines: number;
  };
}

/**
 * Run test suite
 *
 * @example
 * const results = await runTests({ coverage: true });
 * if (results.passed) console.log('All tests passed!');
 */
export async function runTests(
  options: RunTestsOptions = {}
): Promise<TestResults> {
  const {
    backend = true,
    frontend = true,
    coverage = false,
    watch = false
  } = options;

  console.log('🧪 Running Tests...\n');

  const results: TestResults = {
    passed: true,
    backend: {
      passed: 0,
      failed: 0,
      total: 0,
      duration: 0,
      failures: []
    },
    frontend: {
      passed: 0,
      failed: 0,
      total: 0,
      duration: 0,
      failures: []
    }
  };

  // Run Backend Tests
  if (backend) {
    console.log('📦 Running backend tests...');

    try {
      const coverageFlag = coverage ? '--coverage' : '';
      const watchFlag = watch ? '--watch' : '';

      const startTime = Date.now();
      const result = await execAsync(
        `cd backend && npm test ${coverageFlag} ${watchFlag}`,
        { timeout: 60000 } // 60 second timeout
      );
      const duration = Date.now() - startTime;

      // Parse Jest output
      const output = result.stdout + result.stderr;

      // Extract test counts
      const passedMatch = output.match(/(\d+) passed/);
      const failedMatch = output.match(/(\d+) failed/);
      const totalMatch = output.match(/Tests:\s+(\d+) total/);

      results.backend.passed = passedMatch ? parseInt(passedMatch[1]) : 0;
      results.backend.failed = failedMatch ? parseInt(failedMatch[1]) : 0;
      results.backend.total = totalMatch ? parseInt(totalMatch[1]) : results.backend.passed;
      results.backend.duration = duration;

      // Extract failures
      if (results.backend.failed > 0) {
        const failureRegex = /●\s+(.*?)\s+›\s+(.*?)\n\n\s+(.*?)(?=\n\n|\n●|$)/gs;
        const failures = [...output.matchAll(failureRegex)];

        results.backend.failures = failures.slice(0, 5).map(match => ({
          suite: match[1].trim(),
          test: match[2].trim(),
          error: match[3].trim().substring(0, 200)
        }));

        results.passed = false;
      }

      console.log(`   ✓ Backend: ${results.backend.passed}/${results.backend.total} passed (${duration}ms)`);

      // Extract coverage if available
      if (coverage && output.includes('Coverage')) {
        const coverageMatch = output.match(/All files\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)/);
        if (coverageMatch) {
          if (!results.coverage) {
            results.coverage = {
              overall: 0,
              backend: parseFloat(coverageMatch[1]),
              frontend: 0,
              statements: parseFloat(coverageMatch[1]),
              branches: parseFloat(coverageMatch[2]),
              functions: parseFloat(coverageMatch[3]),
              lines: parseFloat(coverageMatch[4])
            };
          }
        }
      }

    } catch (error: any) {
      console.error(`   ✗ Backend tests failed`);

      // Jest exits with error code if tests fail
      const output = error.stdout + error.stderr;

      // Try to extract test results even from failure
      const passedMatch = output.match(/(\d+) passed/);
      const failedMatch = output.match(/(\d+) failed/);

      results.backend.passed = passedMatch ? parseInt(passedMatch[1]) : 0;
      results.backend.failed = failedMatch ? parseInt(failedMatch[1]) : 0;
      results.backend.total = results.backend.passed + results.backend.failed;
      results.passed = false;
    }
  }

  // Run Frontend Tests
  if (frontend) {
    console.log('\n🎨 Running frontend tests...');

    try {
      const coverageFlag = coverage ? '--coverage' : '';
      const watchFlag = watch ? '--watch' : '';

      const startTime = Date.now();
      const result = await execAsync(
        `cd frontend && npm test ${coverageFlag} ${watchFlag}`,
        { timeout: 60000 }
      );
      const duration = Date.now() - startTime;

      // Parse Vitest output (similar format to Jest)
      const output = result.stdout + result.stderr;

      const passedMatch = output.match(/(\d+) passed/);
      const failedMatch = output.match(/(\d+) failed/);
      const totalMatch = output.match(/Tests\s+(\d+) passed/);

      results.frontend.passed = passedMatch ? parseInt(passedMatch[1]) : 0;
      results.frontend.failed = failedMatch ? parseInt(failedMatch[1]) : 0;
      results.frontend.total = totalMatch ? parseInt(totalMatch[1]) : results.frontend.passed;
      results.frontend.duration = duration;

      if (results.frontend.failed > 0) {
        results.passed = false;
      }

      console.log(`   ✓ Frontend: ${results.frontend.passed}/${results.frontend.total} passed (${duration}ms)`);

    } catch (error: any) {
      console.error(`   ✗ Frontend tests failed or not configured`);

      // Try to extract results
      const output = error.stdout + error.stderr;
      const passedMatch = output.match(/(\d+) passed/);
      const failedMatch = output.match(/(\d+) failed/);

      results.frontend.passed = passedMatch ? parseInt(passedMatch[1]) : 0;
      results.frontend.failed = failedMatch ? parseInt(failedMatch[1]) : 0;
      results.frontend.total = results.frontend.passed + results.frontend.failed;

      if (results.frontend.failed > 0) {
        results.passed = false;
      }
    }
  }

  // Calculate overall coverage
  if (coverage && results.coverage) {
    results.coverage.overall = Math.round(
      (results.coverage.backend + results.coverage.frontend) / 2
    );
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log(results.passed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED');
  console.log('='.repeat(50));

  const totalPassed = results.backend.passed + results.frontend.passed;
  const totalTests = results.backend.total + results.frontend.total;
  const totalDuration = results.backend.duration + results.frontend.duration;

  console.log(`\nTotal: ${totalPassed}/${totalTests} passed (${totalDuration}ms)`);

  if (coverage && results.coverage) {
    console.log(`Coverage: ${results.coverage.overall}%`);
  }

  console.log('');

  return results;
}
