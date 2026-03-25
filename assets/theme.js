/**
 * Buenacopa Theme - Main JS
 * Handles: mobile menu, FAQ accordion, smooth scroll, cart count
 */

document.addEventListener('DOMContentLoaded', function () {
  // ===== Mobile Menu Toggle =====
  var menuToggle = document.getElementById('mobile-menu-toggle');
  var mobileNav = document.getElementById('mobile-nav');
  var menuIconOpen = document.getElementById('menu-icon-open');
  var menuIconClose = document.getElementById('menu-icon-close');

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function () {
      var isOpen = mobileNav.style.display !== 'none';
      mobileNav.style.display = isOpen ? 'none' : 'block';
      menuToggle.setAttribute('aria-expanded', !isOpen);
      if (menuIconOpen) menuIconOpen.style.display = isOpen ? 'inline' : 'none';
      if (menuIconClose) menuIconClose.style.display = isOpen ? 'none' : 'inline';
    });

    // Close mobile nav when a link is clicked
    document.querySelectorAll('.mobile-nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.style.display = 'none';
        menuToggle.setAttribute('aria-expanded', 'false');
        if (menuIconOpen) menuIconOpen.style.display = 'inline';
        if (menuIconClose) menuIconClose.style.display = 'none';
      });
    });
  }

  // ===== Smooth Scroll for Anchor Links =====
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var headerHeight = document.querySelector('header') ? document.querySelector('header').offsetHeight : 0;
        var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // ===== Update Cart Count on Load =====
  updateCartCount();
});

// ===== FAQ Accordion =====
function toggleFaq(button) {
  var item = button.closest('.faq-item');
  var content = item.querySelector('.faq-content');
  var chevron = item.querySelector('.faq-chevron');
  var isOpen = content.classList.contains('open');

  // Close all other FAQs
  document.querySelectorAll('.faq-item').forEach(function (otherItem) {
    if (otherItem !== item) {
      var otherContent = otherItem.querySelector('.faq-content');
      var otherChevron = otherItem.querySelector('.faq-chevron');
      var otherButton = otherItem.querySelector('button[aria-expanded]');
      if (otherContent) otherContent.classList.remove('open');
      if (otherChevron) otherChevron.style.transform = '';
      if (otherButton) otherButton.setAttribute('aria-expanded', 'false');
    }
  });

  // Toggle current
  if (isOpen) {
    content.classList.remove('open');
    if (chevron) chevron.style.transform = '';
    button.setAttribute('aria-expanded', 'false');
  } else {
    content.classList.add('open');
    if (chevron) chevron.style.transform = 'rotate(180deg)';
    button.setAttribute('aria-expanded', 'true');
  }
}

// ===== Cart Count Update =====
function updateCartCount() {
  fetch('/cart.js')
    .then(function (r) { return r.json(); })
    .then(function (cart) {
      var count = cart.item_count;
      var desktopBadge = document.getElementById('cart-count-desktop');
      var mobileBadge = document.getElementById('cart-count-mobile');

      [desktopBadge, mobileBadge].forEach(function (badge) {
        if (badge) {
          if (count > 0) {
            badge.textContent = count;
            badge.style.display = 'flex';
          } else {
            badge.style.display = 'none';
          }
        }
      });
    })
    .catch(function () {});
}
