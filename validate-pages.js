const fs = require('fs');
const path = require('path');

const pages = [
  'index.html',
  'buy-vs-rent-calculator.html',
  'house-cost-calculator.html',
  'home-return-calculator.html',
  'emi-calculator.html',
  'car-loan-sip-calculator-updated-v5-seo.html',
  'investment-calculator.html',
  'goal-based-calculator.html',
  'fd-calculator.html',
  'simple-sip-calculator.html',
  'step-up-sip-calculator.html',
  'step-down-sip-goal-seeker.html',
  'swp-calculator.html',
  'lumpsum-calculator.html',
  'nps-calculator.html',
  'nps-vs-mf-calculator.html',
  'privacy.html',
  'disclaimer.html'
];

const results = [];

pages.forEach(page => {
  const filePath = path.join(__dirname, page);
  
  if (!fs.existsSync(filePath)) {
    results.push({
      page,
      exists: false,
      hasHeader: 'N/A',
      hasNav: 'N/A',
      hasSchemaJSON: 'N/A',
      links: 'N/A'
    });
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check for header
  const hasHeader = /<header/.test(content);
  
  // Check for nav
  const hasNav = /<nav|class="nav/.test(content);
  
  // Check for schema JSON-LD
  const hasSchemaJSON = /application\/ld\+json/.test(content);
  
  // Extract links
  const linkMatches = content.match(/href=["']([^"']*\.html)["']/g) || [];
  const links = [...new Set(linkMatches.map(m => m.match(/href=["']([^"']*)["']/)[1]))];
  
  results.push({
    page,
    exists: true,
    hasHeader,
    hasNav,
    hasSchemaJSON,
    linksCount: links.length,
    links: links.slice(0, 5) // Show first 5
  });
});

console.log('\n=== PAGE AUDIT REPORT ===\n');
console.log('Page Structure Analysis:');
console.table(results.map(r => ({
  'Page': r.page.substring(0, 30),
  'Exists': r.exists ? '✓' : '✗',
  'Header': r.hasHeader ? '✓' : '✗',
  'Nav': r.hasNav ? '✓' : '✗',
  'Schema': r.hasSchemaJSON ? '✓' : '✗'
})));

console.log('\n=== DETAILED RESULTS ===\n');
results.forEach(r => {
  console.log(`\n📄 ${r.page}`);
  console.log(`   Exists: ${r.exists ? '✓' : '✗'}`);
  if (r.exists) {
    console.log(`   Has Header: ${r.hasHeader ? '✓' : '✗'}`);
    console.log(`   Has Navigation: ${r.hasNav ? '✓' : '✗'}`);
    console.log(`   Has Schema JSON-LD: ${r.hasSchemaJSON ? '✓' : '✗'}`);
    console.log(`   Internal Links: ${r.linksCount}`);
    if (r.links.length > 0) {
      console.log(`   Sample Links:`, r.links.slice(0, 3).join(', '));
    }
  }
});

// Summary
console.log('\n=== SUMMARY ===');
const summary = {
  totalPages: pages.length,
  existingPages: results.filter(r => r.exists).length,
  pagesWithHeader: results.filter(r => r.exists && r.hasHeader).length,
  pagesWithNav: results.filter(r => r.exists && r.hasNav).length,
  pagesWithSchema: results.filter(r => r.exists && r.hasSchemaJSON).length
};

console.log(`Total Pages: ${summary.totalPages}`);
console.log(`Existing: ${summary.existingPages}`);
console.log(`With Header: ${summary.pagesWithHeader}`);
console.log(`With Navigation: ${summary.pagesWithNav}`);
console.log(`With Schema JSON-LD: ${summary.pagesWithSchema}`);
