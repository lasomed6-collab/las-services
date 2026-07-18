/**
 * Las Services - Discord Bot Website JS
 * Clean, production-grade vanilla javascript
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initBackToTop();
  initButtonRipples();
  highlightActiveLink();
});

/**
 * Navbar scroll behavior
 * Shrinks and adds blur effects upon scroll
 */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  // Run on load in case page is already scrolled
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * Mobile drawer navigation toggle
 */
function initMobileMenu() {
  const trigger = document.querySelector('.menu-trigger');
  const navLinks = document.querySelector('.nav-links');
  const body = document.body;

  if (!trigger || !navLinks) return;

  const toggleMenu = () => {
    const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
    trigger.setAttribute('aria-expanded', !isExpanded);
    trigger.classList.toggle('active');
    navLinks.classList.toggle('active');
    body.style.overflow = !isExpanded ? 'hidden' : '';
  };

  trigger.addEventListener('click', toggleMenu);

  // Close menu when clicking on links
  const links = navLinks.querySelectorAll('.nav-link');
  links.forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('active')) {
        toggleMenu();
      }
    });
  });
}

/**
 * Reveal-on-scroll animations using Intersection Observer
 */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal');
  
  if (!reveals.length) return;

  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Animates once only
      }
    });
  }, observerOptions);

  reveals.forEach(reveal => {
    observer.observe(reveal);
  });
}

/**
 * Back to top floating button behavior
 */
function initBackToTop() {
  const bttBtn = document.querySelector('.back-to-top');
  if (!bttBtn) return;

  const handleScrollVisibility = () => {
    if (window.scrollY > 400) {
      bttBtn.classList.add('visible');
    } else {
      bttBtn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleScrollVisibility, { passive: true });

  bttBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Button click ripple animations
 */
function initButtonRipples() {
  const buttons = document.querySelectorAll('.btn');

  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      // Append and automatically clean up after animation finishes
      button.appendChild(ripple);
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

/**
 * Navigation state updates based on scroll or page path
 */
function highlightActiveLink() {
  const navLinks = document.querySelectorAll('.nav-link');
  const currentPath = window.location.pathname;
  
  // Try matching by path first
  let matched = false;
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.endsWith(href)) {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      matched = true;
    }
  });

  if (matched) return;

  // Otherwise fallback to dynamic home page section observation
  const sections = document.querySelectorAll('section[id]');
  if (!sections.length) return;

  const observerOptions = {
    root: null,
    threshold: 0.5,
    rootMargin: '-70px 0px 0px 0px'
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${id}` || href === `/#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    observer.observe(section);
  });
}
