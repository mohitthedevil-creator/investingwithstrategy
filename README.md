# Wealth Planning Hub - financialcalc.ai

A comprehensive collection of financial planning tools for India, built as a static website optimized for GitHub Pages.

## 🚀 Features

- **15+ Financial Planners** covering home decisions, loans, investments, and retirement
- **SEO-Optimized** landing page with category-based navigation
- **Mobile-Responsive** design matching a consistent theme
- **Client-Side Search** for quick planner discovery
- **Zero Backend** - all calculations happen in your browser
- **Privacy-First** - no data collection or transmission

## 📁 Project Structure

```
Calculator/
├── index.html                          # Landing page (Wealth Planning Hub)
├── assets/
│   ├── styles/
│   │   ├── theme.css                  # CSS variables & theming
│   │   ├── utilities.css              # Utility classes
│   │   └── components.css             # Component styles
│   └── js/
│       ├── site.js                    # Shared navigation & search
│       └── seo.js                     # SEO utilities
├── buy-vs-rent-calculator.html        # Buy vs Rent Decision
├── house-cost-calculator.html         # True Cost of Home Ownership
├── emi-calculator.html                # EMI Breakdown
├── car-loan-sip-calculator-updated-v5-seo.html  # Car Loan Payoff Planner
├── investment-calculator.html         # Investment Growth Planner
├── simple-sip-calculator.html         # SIP Growth
├── step-up-sip-calculator.html        # SIP Step-Up
├── step-down-sip-goal-seeker.html     # SIP Step-Down
├── swp-calculator.html                # Systematic Withdrawal Planner
├── lumpsum-calculator.html            # Lumpsum Growth
├── goal-based-calculator.html         # Goal Planner
├── fd-calculator.html                 # FD Maturity Planner
├── home-return-calculator.html        # Home Return Planner
├── nps-calculator.html                # NPS Growth Planner
├── nps-vs-mf-calculator.html          # NPS vs Mutual Funds
├── privacy.html                       # Privacy Policy
├── disclaimer.html                    # Disclaimer
└── README.md                          # This file
```

## 🎨 Design System

The site uses a consistent design language based on the Investment Calculator theme:

**Colors:**
- Brand: `#0d9488` (Teal)
- Background: `#f0fdf9` (Light mint)
- Text: `#0f2f2e` (Dark teal)
- Muted: `#64748b` (Gray)
- Accent: `#5eead4` (Light teal)

**Typography:**
- Font: Inter (Google Fonts)
- Responsive sizing with CSS clamp()

**Components:**
- Sticky header with mobile menu
- Featured planners strip
- Category-based sections
- Hover-animated cards
- Consistent footer across all pages

## 🖥️ Local Development

### Option 1: Double-Click (Simplest)
1. Navigate to the project folder
2. Double-click `index.html`
3. Opens in your default browser

### Option 2: VS Code Live Server (Recommended)
1. Install [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
2. Right-click `index.html`
3. Select "Open with Live Server"
4. Opens at `http://127.0.0.1:5500/`

### Option 3: Python HTTP Server
```bash
# Python 3
python -m http.server 8000

# Then visit: http://localhost:8000
```

### Option 4: Node.js http-server
```bash
npx http-server -p 8000
```

## 🚢 Deploying to GitHub Pages

### Step 1: Create GitHub Repository
1. Create a new repository on GitHub (e.g., `wealth-planning-hub`)
2. Initialize locally:
```bash
cd Calculator
git init
git add .
git commit -m "Initial commit: Wealth Planning Hub"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/wealth-planning-hub.git
git push -u origin main
```

### Step 2: Enable GitHub Pages
1. Go to repository **Settings**
2. Navigate to **Pages** (left sidebar)
3. Under **Source**, select:
   - Branch: `main`
   - Folder: `/ (root)`
4. Click **Save**
5. Wait 1-2 minutes for deployment

### Step 3: Access Your Site
Your site will be available at:
```
https://YOUR-USERNAME.github.io/wealth-planning-hub/
```

### Step 4: Custom Domain (Optional)
1. Add `CNAME` file to repository root:
```
financialcalc.ai
```
2. Configure DNS with your domain provider:
   - Type: `CNAME`
   - Name: `@` (or `www`)
   - Value: `YOUR-USERNAME.github.io`
3. In GitHub Pages settings, enter custom domain: `financialcalc.ai`
4. Enable "Enforce HTTPS"

## 🔧 Customization

### Changing Colors
Edit `assets/styles/theme.css`:
```css
:root {
  --brand: #0d9488;        /* Primary brand color */
  --bg: #f0fdf9;           /* Page background */
  --accent: #5eead4;       /* Accent highlights */
}
```

### Adding New Calculator
1. Create `new-calculator.html` following existing template structure
2. Add entry to `index.html` in appropriate category section
3. Update JSON-LD structured data in `index.html`
4. Add to related planners sections where relevant

### Modifying Navigation
Edit header in each page or create a shared header include:
```html
<nav>
  <ul class="nav-links">
    <li><a href="index.html">Home</a></li>
    <li><a href="#section">Category</a></li>
  </ul>
</nav>
```

## 📱 Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

All modern browsers with ES6+ support.

## 🔍 SEO Features

- Semantic HTML5 structure
- Meta descriptions on all pages
- Canonical tags for URL consistency
- OpenGraph tags for social sharing
- JSON-LD structured data (ItemList)
- Mobile-responsive design
- Fast load times (no external dependencies)

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions welcome! To contribute:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## ⚠️ Disclaimer

All tools are for educational purposes only. Not financial advice. See [disclaimer.html](disclaimer.html) for full terms.

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Visit the [homepage](index.html)

---

Built with ❤️ for smarter money decisions in India | © 2026 financialcalc.ai
