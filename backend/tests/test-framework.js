// Simple test framework for Node.js
let testResults = [];
let currentSuite = null;
let currentTest = null;

export function describe(suiteName, fn) {
  currentSuite = {
    name: suiteName,
    tests: [],
    beforeEach: null,
  };
  fn();
  testResults.push(currentSuite);
  currentSuite = null;
}

export function it(testName, fn) {
  const test = {
    name: testName,
    fn,
    status: 'pending',
    error: null,
  };
  
  if (currentSuite) {
    currentSuite.tests.push(test);
  } else {
    // Standalone test
    testResults.push({ name: 'Standalone', tests: [test] });
  }
}

export function beforeEach(fn) {
  if (currentSuite) {
    currentSuite.beforeEach = fn;
  }
}

export function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`Expected ${actual} to be ${expected}`);
      }
    },
    toHaveProperty(prop) {
      if (!(prop in actual)) {
        throw new Error(`Expected object to have property ${prop}`);
      }
    },
    toEqual(expected) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`);
      }
    },
  };
}

export async function runTests() {
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  console.log('\n🧪 Running Tests...\n');
  console.log('⚠️  Note: Make sure the server is running on http://localhost:3000\n');

  // Wait a bit for server to be ready
  await new Promise(resolve => setTimeout(resolve, 1000));

  for (const suite of testResults) {
    console.log(`\n📦 ${suite.name}`);
    console.log('─'.repeat(50));

    for (const test of suite.tests) {
      totalTests++;
      currentTest = test;
      
      try {
        // Run beforeEach if exists
        if (suite.beforeEach) {
          await suite.beforeEach();
        }
        
        // Run the test
        await test.fn();
        test.status = 'passed';
        passedTests++;
        console.log(`  ✅ ${test.name}`);
      } catch (error) {
        test.status = 'failed';
        test.error = error.message || String(error);
        failedTests++;
        console.log(`  ❌ ${test.name}`);
        console.log(`     Error: ${test.error}`);
      }
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`📊 Test Results: ${passedTests}/${totalTests} passed`);
  
  if (failedTests > 0) {
    console.log(`❌ ${failedTests} test(s) failed`);
    return false;
  } else {
    console.log('✅ All tests passed!');
    return true;
  }
}

export function getTestResults() {
  return testResults;
}

