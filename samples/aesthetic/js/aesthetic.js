/**
 * samples/aesthetic/js/aesthetic.js
 * Vanilla JavaScript for Aesthetic Salon Landing Page
 * - Scroll-triggered Mobile Sticky CTA Bar
 * - Accessible FAQ Accordion Toggle
 * - Accessible Booking Modal with Plan Preselection & Validation
 * - Smooth Scrolling for In-Page Anchors
 * Zero external runtime dependencies.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initStickyCTA();
    initFAQAccordion();
    initBookingModal();
    initSmoothScroll();
  });

  /**
   * 1. Mobile Sticky CTA Bar Logic
   * Shows #mobile-sticky-cta when scrolled past 350px.
   * Hides when reaching the action/booking section.
   */
  function initStickyCTA() {
    var stickyBar = document.getElementById('mobile-sticky-cta');
    var actionSection = document.getElementById('action');
    if (!stickyBar) return;

    var lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
    var ticking = false;

    function updateStickyVisibility() {
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;
      var showThreshold = 350;

      // Check if action section is in view
      var actionInView = false;
      if (actionSection) {
        var rect = actionSection.getBoundingClientRect();
        var windowHeight = window.innerHeight || document.documentElement.clientHeight;
        if (rect.top < windowHeight && rect.bottom > 100) {
          actionInView = true;
        }
      }

      if (scrollY > showThreshold && !actionInView) {
        stickyBar.classList.add('is-visible');
      } else {
        stickyBar.classList.remove('is-visible');
      }

      ticking = false;
    }

    window.addEventListener(
      'scroll',
      function () {
        if (!ticking) {
          window.requestAnimationFrame(updateStickyVisibility);
          ticking = true;
        }
      },
      { passive: true }
    );

    // Initial check
    updateStickyVisibility();
  }

  /**
   * 2. Accessible FAQ Accordion
   */
  function initFAQAccordion() {
    var faqButtons = document.querySelectorAll('.faq-question-btn');

    faqButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var faqItem = button.closest('.faq-item');
        if (!faqItem) return;

        var isExpanded = button.getAttribute('aria-expanded') === 'true';

        // Toggle current item
        if (isExpanded) {
          button.setAttribute('aria-expanded', 'false');
          faqItem.classList.remove('is-active');
        } else {
          button.setAttribute('aria-expanded', 'true');
          faqItem.classList.add('is-active');
        }
      });
    });
  }

  /**
   * 3. Accessible Booking Modal Dialog & Form Validation
   */
  function initBookingModal() {
    var modal = document.getElementById('booking-modal');
    var modalCloseBtn = document.getElementById('modal-close');
    var openModalButtons = document.querySelectorAll('.js-open-modal');
    var planSelect = document.getElementById('form-plan');
    var bookingForm = document.getElementById('modal-booking-form');
    var successState = document.getElementById('modal-success-state');
    var successCloseBtn = document.getElementById('modal-success-close-btn');

    if (!modal) return;

    var lastFocusedElement = null;

    function openModal(preselectedPlan) {
      lastFocusedElement = document.activeElement;

      // Pre-select plan if specified
      if (planSelect && preselectedPlan) {
        planSelect.value = preselectedPlan;
      }

      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      // Reset success state if reopening
      if (bookingForm && successState) {
        bookingForm.style.display = 'flex';
        successState.style.display = 'none';
      }

      // Focus first input or close button
      var firstInput = modal.querySelector('input, select, textarea, button');
      if (firstInput) {
        setTimeout(function () {
          firstInput.focus();
        }, 50);
      }
    }

    function closeModal() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';

      if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
      }
    }

    // Attach click listeners to all open buttons
    openModalButtons.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var plan = btn.getAttribute('data-plan') || 'bamboo';
        openModal(plan);
      });
    });

    // Close button click
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', function () {
        closeModal();
      });
    }

    // Close on overlay backdrop click
    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Success close button
    if (successCloseBtn) {
      successCloseBtn.addEventListener('click', function () {
        closeModal();
      });
    }

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeModal();
      }
    });

    // Form Submission & Validation
    if (bookingForm) {
      bookingForm.addEventListener('submit', function (e) {
        e.preventDefault();

        var isValid = true;
        var requiredFields = bookingForm.querySelectorAll('[required]');

        requiredFields.forEach(function (field) {
          var group = field.closest('.form-group');
          var value = field.value ? field.value.trim() : '';

          if (!value) {
            isValid = false;
            if (group) group.classList.add('has-error');
          } else {
            // Email format check
            if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
              isValid = false;
              if (group) group.classList.add('has-error');
            } else {
              if (group) group.classList.remove('has-error');
            }
          }

          // Clear error on input
          field.addEventListener(
            'input',
            function () {
              if (group) group.classList.remove('has-error');
            },
            { once: true }
          );
        });

        if (isValid) {
          // Display success state
          bookingForm.style.display = 'none';
          if (successState) {
            successState.style.display = 'block';
          }
          bookingForm.reset();
        }
      });
    }
  }

  /**
   * 4. Smooth Scrolling for In-Page Anchor Links
   */
  function initSmoothScroll() {
    var anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (!href || href === '#') return;

        var targetEl = document.querySelector(href);
        if (targetEl) {
          e.preventDefault();
          var headerOffset = 70;
          var elementPosition = targetEl.getBoundingClientRect().top;
          var offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }
})();
