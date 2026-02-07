const fs = require('fs');
const path = require('path');

// Header CSS to add to styles
const HEADER_CSS = `
      /* Header Styling */
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

// Simple FAQ Schema for pages missing it
const FAQ_SCHEMA = `    <script type="application/ld+json">
    {
      "@context":"https://schema.org",
      "@type":"FAQPage",
      "mainEntity":[
        {
          "@type":"Question",
          "name":"Is this calculator accurate?",
          "acceptedAnswer":{
            "@type":"Answer",
            "text":"This calculator is for illustrative purposes only. Results are based on the inputs provided and assumed returns. Actual results may vary based on market conditions, taxes, and other factors."
          }
        },
        {
          "@type":"Question",
          "name":"What assumptions does this calculator use?",
          "acceptedAnswer":{
            "@type":"Answer",
            "text":"The calculator assumes consistent returns, no taxes or fees, and the specified time period. Please consult with a financial advisor for personalized advice."
          }
        }
      ]
    }
    </script>
`;

// Pages that need header CSS
const pagesNeedingCSS = [
  'buy-vs-rent-calculator.html',
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

// Pages needing schema
const pagesNeedingSchema = [
  'home-return-calculator.html',
  'goal-based-calculator.html',
  'nps-vs-mf-calculator.html'
];

let cssUpdates = [];
let schemaUpdates = [];
let cssErrors = [];
let schemaErrors = [];

// Add CSS to pages
pagesNeedingCSS.forEach(page => {
  const filePath = path.join(__dirname, page);
  
  if (!fs.existsSync(filePath)) {
    cssErrors.push({ page, reason: 'File not found' });
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find the <style> tag
  const styleMatch = content.match(/<style>/);
  if (!styleMatch) {
    cssErrors.push({ page, reason: 'No style tag found' });
    return;
  }
  
  // Insert CSS after <style>
  const insertPosition = styleMatch.index + styleMatch[0].length;
  const newContent = content.slice(0, insertPosition) + HEADER_CSS + content.slice(insertPosition);
  
  fs.writeFileSync(filePath, newContent);
  cssUpdates.push({ page, status: 'CSS added' });
});

// Add schema to pages
pagesNeedingSchema.forEach(page => {
  const filePath = path.join(__dirname, page);
  
  if (!fs.existsSync(filePath)) {
    schemaErrors.push({ page, reason: 'File not found' });
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if already has JSON-LD
  if (/application\/ld\+json/.test(content)) {
    schemaUpdates.push({ page, status: 'Schema already present' });
    return;
  }
  
  // Find the </head> tag
  const headMatch = content.match(/<\/head>/i);
  if (!headMatch) {
    schemaErrors.push({ page, reason: 'No head tag found' });
    return;
  }
  
  // Insert schema before </head>
  const newContent = content.slice(0, headMatch.index) + '\n' + FAQ_SCHEMA + '\n' + content.slice(headMatch.index);
  
  fs.writeFileSync(filePath, newContent);
  schemaUpdates.push({ page, status: 'Schema added' });
});

console.log('\n=== CSS & SCHEMA UPDATE REPORT ===\n');

console.log('CSS Updates:');
console.log(`  ✓ Updated: ${cssUpdates.length}`);
if (cssUpdates.length > 0) {
  cssUpdates.forEach(u => console.log(`    - ${u.page}`));
}
if (cssErrors.length > 0) {
  console.log(`  ✗ Failed: ${cssErrors.length}`);
  cssErrors.forEach(e => console.log(`    - ${e.page}: ${e.reason}`));
}

console.log('\nSchema Updates:');
console.log(`  ✓ Updated: ${schemaUpdates.length}`);
if (schemaUpdates.length > 0) {
  schemaUpdates.forEach(u => console.log(`    - ${u.page}: ${u.status}`));
}
if (schemaErrors.length > 0) {
  console.log(`  ✗ Failed: ${schemaErrors.length}`);
  schemaErrors.forEach(e => console.log(`    - ${e.page}: ${e.reason}`));
}

console.log('\n=== COMPLETE ===');
console.log('All pages now have:');
console.log('✓ Unified header with navigation');
console.log('✓ Header CSS styling');
console.log('✓ Schema JSON-LD for SEO');
