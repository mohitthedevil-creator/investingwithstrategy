// Shared Site JavaScript

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('nav');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileToggle && nav) {
    mobileToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      nav.classList.toggle('active');
    });
  }
  
  // Close mobile menu when clicking on a link
  if (navLinks) {
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function() {
        if (nav) nav.classList.remove('active');
      });
    });
  }
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', function(e) {
    if (nav && !e.target.closest('nav') && !e.target.closest('.mobile-menu-toggle')) {
      nav.classList.remove('active');
    }
  });
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href !== '#!') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          // Close mobile menu if open
          if (nav) nav.classList.remove('active');
        }
      }
    });
  });
});

// Search Filtering (Homepage only)
if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
  document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('planner-search');
    
    // Only initialize if search box exists
    if (!searchInput) return;
    
    const allCards = document.querySelectorAll('.tool-card');
    const allSections = document.querySelectorAll('.category-section');
    const noResults = document.getElementById('no-results');
    
    if (allCards.length > 0) {
      searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        let visibleCount = 0;
        
        if (query === '') {
          // Show all
          allCards.forEach(card => {
            card.style.display = 'block';
          });
          allSections.forEach(section => {
            section.style.display = 'block';
          });
          if (noResults) noResults.style.display = 'none';
          return;
        }
        
        // Filter cards
        allCards.forEach(card => {
          const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
          const description = card.querySelector('p')?.textContent.toLowerCase() || '';
          
          if (title.includes(query) || description.includes(query)) {
            card.style.display = 'block';
            visibleCount++;
          } else {
            card.style.display = 'none';
          }
        });
        
        // Hide empty sections
        allSections.forEach(section => {
          const visibleCardsInSection = section.querySelectorAll('.tool-card[style="display: block;"]');
          if (visibleCardsInSection.length === 0) {
            section.style.display = 'none';
          } else {
            section.style.display = 'block';
          }
        });
        
        // Show/hide no results message
        if (noResults) {
          noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }
      });
    }
  });
}

// Set active nav link based on current page
document.addEventListener('DOMContentLoaded', function() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('nav a');
  
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath || 
        (currentPath === '/' && link.getAttribute('href') === 'index.html')) {
      link.classList.add('active');
    }
  });
});
