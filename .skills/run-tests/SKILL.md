# Run Tests Skill

## Purpose
Executes the test suite for both backend and frontend, providing detailed results and coverage information.

## When to Use
- After implementing new features
- Before committing code
- Before deployments
- During continuous integration
- After bug fixes to verify resolution

## What it Does
1. **Backend Tests:** Runs Jest tests for Node.js/Express backend
2. **Frontend Tests:** Runs Vitest tests for React/Vite frontend
3. **Coverage Analysis:** Calculates test coverage percentages
4. **Result Summary:** Returns pass/fail status with details

## Usage

```typescript
import { runTests } from './.skills/run-tests/test';

// Run all tests
const results = await runTests({
  backend: true,
  frontend: true,
  coverage: true
});

console.log(`Tests: ${results.passed ? 'PASSED ✅' : 'FAILED ❌'}`);
console.log(`Backend: ${results.backend.passed}/${results.backend.total}`);
console.log(`Frontend: ${results.frontend.passed}/${results.frontend.total}`);
console.log(`Coverage: ${results.coverage.overall}%`);
```

## Output Format

```typescript
{
  passed: boolean;                // True if all tests passed
  backend: {
    passed: number;               // Number of passed tests
    failed: number;               // Number of failed tests
    total: number;                // Total tests
    duration: number;             // Duration in ms
    failures: Array<{             // Failed test details
      suite: string;
      test: string;
      error: string;
    }>;
  };
  frontend: {
    passed: number;
    failed: number;
    total: number;
    duration: number;
    failures: Array<{ ... }>;
  };
  coverage: {
    overall: number;              // Overall coverage %
    backend: number;              // Backend coverage %
    frontend: number;             // Frontend coverage %
    statements: number;
    branches: number;
    functions: number;
    lines: number;
  };
}
```

## Examples

### Example 1: Quick Test Before Commit
```typescript
const results = await runTests();

if (!results.passed) {
  console.error('❌ Tests failed! Cannot commit.');
  results.backend.failures.forEach(f => {
    console.error(`  - ${f.suite}: ${f.test}`);
  });
  process.exit(1);
}

console.log('✅ All tests passed!');
```

### Example 2: Run Backend Tests Only
```typescript
const backendResults = await runTests({
  backend: true,
  frontend: false
});

console.log(`Backend: ${backendResults.backend.passed}/${backendResults.backend.total} passed`);
```

### Example 3: Coverage Report
```typescript
const results = await runTests({ coverage: true });

console.log('\n📊 Test Coverage Report:');
console.log(`Overall: ${results.coverage.overall}%`);
console.log(`Statements: ${results.coverage.statements}%`);
console.log(`Branches: ${results.coverage.branches}%`);
console.log(`Functions: ${results.coverage.functions}%`);
console.log(`Lines: ${results.coverage.lines}%`);

if (results.coverage.overall < 80) {
  console.warn('⚠️  Coverage below 80% target');
}
```

## Dependencies
- **Jest:** Backend testing (already installed)
- **Vitest:** Frontend testing (need to install)
- **npm test:** Configured test scripts

## Token Efficiency

**First Run:**
- Write skill code: ~150 tokens
- Execute tests: 0 tokens (in sandbox)
- Return results: ~50 tokens
- **Total:** ~200 tokens

**Subsequent Runs:**
- Load cached skill: ~20 tokens
- Execute tests: 0 tokens (in sandbox)
- Return results: ~50 tokens
- **Total:** ~70 tokens

## Related Skills
- `security-audit/` - Run after tests pass
- `deploy-railway/` - Requires tests to pass first

---

**Last Updated:** Auto-generated on first use
