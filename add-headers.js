const fs = require('fs');
const path = require('path');

// Standard header to inject
const UNIFIED_HEADER = `  <!-- Header -->
  <header>
    <div class="header-content">
      <a href="index.html" class="logo">💰 planmywealth.ai</a>
      <button class="mobile-menu-toggle" aria-label="Toggle menu">☰</button>
      <nav>
        <ul class="nav-links">
          <li><a href="index.html">Home</a></li>
          <li><a href="index.html#home-decisions">Home Decisions</a></li>
          <li><a href="index.html#loans">Loans</a></li>
          <li><a href="index.html#investing">Investing</a></li>
          <li><a href="index.html#retirement">Retirement</a></li>
        </ul>
      </nav>
    </div>
  </header>
`;

// CSS for header (to add to style tags if missing)
const HEADER_CSS = `
      header {
        background: var(--card, white);
        border-bottom: 1px solid var(--border, #d1e7e4);
        padding: 16px 0;
        position: sticky;
        top: 0;
        z-index: 100;
      }
      
      .header-content {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 clamp(16px, 3vw, 40px);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .logo {
        font-weight: 700;
        font-size: 20px;
        text-decoration: none;
        color: var(--ink, #0f2f2e);
      }
      
      .mobile-menu-toggle {
        display: none;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: var(--ink, #0f2f2e);
      }
      
      nav {
        display: flex;
      }
      
      .nav-links {
        display: flex;
        gap: 32px;
        list-style: none;
        padding: 0;
        margin: 0;
      }
      
      .nav-links a {
        text-decoration: none;
        color: var(--ink, #0f2f2e);
        font-size: 14px;
        font-weight: 500;
        transition: color 0.3s ease;
      }
      
      .nav-links a:hover {
        color: var(--brand, #0d9488);
      }
      
      @media (max-width: 700px) {
        .mobile-menu-toggle {
          display: block;
        }
        
        nav {
          display: none;
        }
        
        nav.active {
          display: flex;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          flex-direction: column;
          background: var(--card, white);
          border-bottom: 1px solid var(--border, #d1e7e4);
          padding: 16px;
        }
        
        .nav-links {
          flex-direction: column;
          gap: 12px;
        }
      }
`;

// Pages to update
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
  'nps-vs-mf-calculator.html',
  'privacy.html',
  'disclaimer.html'
];

let updated = [];
let failed = [];

pages.forEach(page => {
  const filePath = path.join(__dirname, page);
  
  if (!fs.existsSync(filePath)) {
    failed.push({ page, reason: 'File not found' });
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if already has proper header
  if (/<header>[\s\S]*?<\/header>/.test(content)) {
    const headerMatch = content.match(/<header>[\s\S]*?<\/header>/);
    if (headerMatch && headerMatch[0].includes('header-content')) {
      updated.push({ page, status: 'Already has unified header' });
      return;
    }
  }
  
  // Find body tag to insert header after
  const bodyMatch = content.match(/<body[^>]*>/i);
  if (!bodyMatch) {
    failed.push({ page, reason: 'No body tag found' });
    return;
  }
  
  // Insert header after body tag
  const insertPosition = bodyMatch.index + bodyMatch[0].length;
  const newContent = content.slice(0, insertPosition) + '\n' + UNIFIED_HEADER + content.slice(insertPosition);
  
  fs.writeFileSync(filePath, newContent);
  updated.push({ page, status: 'Header added' });
});

console.log('\n=== HEADER INJECTION REPORT ===\n');
console.log(`Updated: ${updated.length} pages`);
console.log(`Failed: ${failed.length} pages\n`);

if (updated.length > 0) {
  console.log('✓ Successfully updated:');
  updated.forEach(u => console.log(`  - ${u.page}: ${u.status}`));
}

if (failed.length > 0) {
  console.log('\n✗ Failed updates:');
  failed.forEach(f => console.log(`  - ${f.page}: ${f.reason}`));
}

console.log('\n=== NEXT STEPS ===');
console.log('1. Add CSS for header styling to pages');
console.log('2. Add missing schema JSON-LD');
console.log('3. Verify all links work');
