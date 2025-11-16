/**
 * Movexa - Frontend Main JavaScript
 * Handles dynamic content loading from MongoDB API
 */

// API Base URL - works in both local and production
const API_BASE = window.location.origin;

// Loading state management
let isLoading = false;

/**
 * Show loading spinner
 */
function showLoading(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>Cargando...</p>
      </div>
    `;
  }
}

/**
 * Hide loading spinner
 */
function hideLoading(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    const spinner = container.querySelector('.loading-spinner');
    if (spinner) {
      spinner.remove();
    }
  }
}

/**
 * Fetch services from MongoDB
 */
async function loadServices() {
  try {
    showLoading('servicios-container');
    
    const response = await fetch(`${API_BASE}/api/services`);
    
    if (!response.ok) {
      throw new Error('Error al cargar servicios');
    }
    
    const services = await response.json();
    renderServices(services);
  } catch (error) {
    console.error('Error loading services:', error);
    const container = document.getElementById('servicios-container');
    if (container) {
      container.innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-triangle"></i>
          <p>No se pudieron cargar los servicios. Por favor, intenta más tarde.</p>
        </div>
      `;
    }
  }
}

/**
 * Render services dynamically
 */
function renderServices(services) {
  const container = document.getElementById('servicios-container');
  
  if (!container) return;
  
  if (!services || services.length === 0) {
    container.innerHTML = `
      <div class="no-services">
        <i class="fas fa-info-circle"></i>
        <p>No hay servicios disponibles en este momento.</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = services.map(service => `
    <div class="servicio fade-in" data-service-id="${service._id}">
      <div class="servicio-icon">
        <i class="${service.icon || 'fas fa-cog'}"></i>
      </div>
      <h3>${escapeHtml(service.title)}</h3>
      <p>${escapeHtml(service.description)}</p>
    </div>
  `).join('');
  
  // Apply fade-in animation to new elements
  setTimeout(() => {
    observeElements();
  }, 100);
}

/**
 * Load dynamic content (hero, about, contact)
 */
async function loadContent() {
  try {
    const response = await fetch(`${API_BASE}/api/content`);
    
    if (!response.ok) {
      console.warn('Content API not available, using defaults');
      return;
    }
    
    const content = await response.json();
    
    if (content.hero) updateHero(content.hero);
    if (content.about) updateAbout(content.about);
    if (content.contact) updateContact(content.contact);
  } catch (error) {
    console.error('Error loading content:', error);
    // Continue with default content
  }
}

/**
 * Update hero section
 */
function updateHero(heroData) {
  const titleEl = document.querySelector('#inicio .hero-title');
  const subtitleEl = document.querySelector('#inicio .hero-subtitle');
  const heroImageEl = document.querySelector('#inicio .hero-image');
  
  if (titleEl && heroData.title) {
    titleEl.textContent = heroData.title;
  }
  
  if (subtitleEl && heroData.subtitle) {
    subtitleEl.textContent = heroData.subtitle;
  }
  
  if (heroImageEl && heroData.image) {
    heroImageEl.src = heroData.image;
    heroImageEl.alt = heroData.title || 'Hero image';
  }
}

/**
 * Update about section
 */
function updateAbout(aboutData) {
  const titleEl = document.querySelector('#nosotros h2');
  const descEl = document.querySelector('#nosotros .about-description');
  const quoteEl = document.querySelector('#nosotros .quote-text');
  const imageEl = document.querySelector('#nosotros .about-image');
  
  if (titleEl && aboutData.title) {
    titleEl.textContent = aboutData.title;
  }
  
  if (descEl && aboutData.text) {
    descEl.textContent = aboutData.text;
  }
  
  if (quoteEl && aboutData.data && aboutData.data.quote) {
    quoteEl.textContent = aboutData.data.quote;
  }
  
  if (imageEl && aboutData.image) {
    imageEl.src = aboutData.image;
    imageEl.alt = aboutData.title || 'About image';
  }
}

/**
 * Update contact section
 */
function updateContact(contactData) {
  if (!contactData.data) return;
  
  const data = contactData.data;
  
  if (data.email) {
    const emailEl = document.querySelector('.contact-email');
    if (emailEl) emailEl.textContent = data.email;
  }
  
  if (data.phone) {
    const phoneEl = document.querySelector('.contact-phone');
    if (phoneEl) phoneEl.textContent = data.phone;
  }
  
  if (data.address) {
    const addressEl = document.querySelector('.contact-address');
    if (addressEl) addressEl.textContent = data.address;
  }
  
  if (data.hours) {
    const hoursEl = document.querySelector('.contact-hours');
    if (hoursEl) hoursEl.textContent = data.hours;
  }
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Smooth scroll functionality
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      // Skip empty anchors
      if (href === '#' || href === '#!') return;
      
      e.preventDefault();
      
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const headerOffset = 80; // Height of sticky header
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Intersection Observer for fade-in animations
 */
function observeElements() {
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, options);
  
  // Observe all fade-in elements
  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });
}

/**
 * Lazy load images
 */
function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.menu');
  
  if (menuToggle && menu) {
    menuToggle.addEventListener('click', () => {
      menu.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('active');
        menuToggle.classList.remove('active');
      });
    });
  }
}

/**
 * Initialize all functionality on DOM load
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('Movexa Frontend initialized');
  
  // Load dynamic content
  loadServices();
  loadContent();
  
  // Initialize features
  initSmoothScroll();
  initLazyLoading();
  initMobileMenu();
  
  // Observe fade-in elements
  setTimeout(() => {
    observeElements();
  }, 200);
});

/**
 * Add scroll header effect
 */
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  
  lastScroll = currentScroll;
});
