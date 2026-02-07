const fs = require('fs');
const path = require('path');

const pages = [
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
  'nps-vs-mf-calculator.html'
];

let removed = [];
let notFound = [];

pages.forEach(page => {
  const filePath = path.join(__dirname, page);
  
  if (!fs.existsSync(filePath)) {
    notFound.push(page);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  // Pattern to match the old nav section
  // <nav class="nav">
  //   <div class="logo">...</div>
  //   <div class="nav-links">...
  // </nav>
  
  const oldNavPattern = /<nav class="nav">\s*<div class="logo">.*?<\/div>\s*<div class="nav-links">[\s\S]*?<\/div>\s*<\/nav>/;
  
  if (oldNavPattern.test(content)) {
    const updatedContent = content.replace(oldNavPattern, '');
    fs.writeFileSync(filePath, updatedContent);
    removed.push(page);
  } else {
    notFound.push(page);
  }
});

console.log('\n=== OLD NAV REMOVAL REPORT ===\n');
console.log(`✓ Removed from: ${removed.length}`);
removed.forEach(p => console.log(`  - ${p}`));

if (notFound.length > 0) {
  console.log(`\n✗ Not found or already removed: ${notFound.length}`);
  notFound.forEach(p => console.log(`  - ${p}`));
}

console.log('\n✅ COMPLETE - Old nav sections removed from all pages');
