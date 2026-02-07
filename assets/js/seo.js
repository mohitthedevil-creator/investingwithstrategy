// SEO Utilities for GitHub Pages

// Set canonical URL based on current location
document.addEventListener('DOMContentLoaded', function() {
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical && canonical.href.includes('YOURDOMAIN')) {
    // Replace with actual domain when deploying
    const currentPath = window.location.pathname;
    const filename = currentPath.split('/').pop() || 'index.html';
    canonical.href = `https://financialcalc.ai/${filename}`;
  }
});

// Track outbound links (optional, for future analytics)
function trackOutboundLink(url, label) {
  // Placeholder for analytics tracking
  console.log('Outbound link:', url, label);
}

// Helper to format numbers in Indian style
function formatINR(num) {
  if (!Number.isFinite(num)) return "₹0";
  const str = Math.round(num).toString();
  if (str.length <= 3) return "₹" + str;
  const lastThree = str.slice(-3);
  const remaining = str.slice(0, -3);
  return "₹" + remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree;
}
