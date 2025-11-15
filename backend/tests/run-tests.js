import { runTests, getTestResults } from './test-framework.js';
import './students.test.js';

// Generate JUnit XML for Jenkins
function generateJUnitXML() {
  const results = getTestResults();
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<testsuites>\n';

  for (const suite of results) {
    const total = suite.tests.length;
    const failures = suite.tests.filter(t => t.status === 'failed').length;
    const time = 0;

    xml += `  <testsuite name="${escapeXml(suite.name)}" tests="${total}" failures="${failures}" time="${time}">\n`;

    for (const test of suite.tests) {
      xml += `    <testcase name="${escapeXml(test.name)}" classname="${escapeXml(suite.name)}">\n`;
      if (test.status === 'failed') {
        xml += `      <failure message="${escapeXml(test.error || 'Test failed')}">${escapeXml(test.error || '')}</failure>\n`;
      }
      xml += `    </testcase>\n`;
    }

    xml += '  </testsuite>\n';
  }

  xml += '</testsuites>\n';
  return xml;
}

function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Run tests and generate report
(async () => {
  try {
    const success = await runTests();
    
    // Generate JUnit XML
    const fs = await import('fs');
    const path = await import('path');
    const xml = generateJUnitXML();
    const resultsPath = path.resolve(process.cwd(), 'test-results.xml');
    fs.writeFileSync(resultsPath, xml);
    console.log('\n📄 Test results saved to test-results.xml');
    
    // Exit with appropriate code
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error('Test execution error:', error);
    process.exit(1);
  }
})();

