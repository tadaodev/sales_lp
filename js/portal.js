/**
 * Portal Hub Tab Filtering & Deep Linking Logic (js/portal.js)
 * Vanilla JavaScript (Zero External Dependencies)
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', initPortal);

  function initPortal() {
    const tabButtons = document.querySelectorAll('[data-filter-tab]');
    const lpCards = document.querySelectorAll('.lp-card');
    const emptyState = document.getElementById('empty-state');
    const resetBtn = document.getElementById('btn-reset-filter');

    if (!tabButtons.length || !lpCards.length) {
      return;
    }

    // List of valid category keys
    const validCategories = new Set(['all']);
    tabButtons.forEach(btn => {
      const cat = btn.getAttribute('data-filter-tab');
      if (cat) {
        validCategories.add(cat);
      }
    });

    /**
     * Parse category from current URL hash
     * Supports both #filter=beauty and #beauty formats
     */
    function getCategoryFromHash() {
      const hash = window.location.hash.replace(/^#/, '').trim();
      if (!hash) return 'all';

      // Check if hash is #filter=xxx
      if (hash.startsWith('filter=')) {
        const paramCat = hash.replace('filter=', '').trim();
        return validCategories.has(paramCat) ? paramCat : 'all';
      }

      // Check direct hash #xxx
      return validCategories.has(hash) ? hash : 'all';
    }

    /**
     * Apply category filter across tab buttons and card items
     */
    function applyFilter(category, updateHash = true) {
      const targetCategory = validCategories.has(category) ? category : 'all';

      // 1. Update Tab Buttons UI & ARIA
      tabButtons.forEach(btn => {
        const cat = btn.getAttribute('data-filter-tab');
        const isActive = cat === targetCategory;
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        btn.setAttribute('tabindex', isActive ? '0' : '-1');
      });

      // 2. Filter Cards with Smooth Transition
      let visibleCount = 0;

      lpCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        const shouldShow = targetCategory === 'all' || cardCategory === targetCategory;

        if (shouldShow) {
          card.classList.remove('is-hidden');
          visibleCount++;
        } else {
          card.classList.add('is-hidden');
        }
      });

      // 3. Handle Empty State
      if (emptyState) {
        if (visibleCount === 0) {
          emptyState.classList.add('is-visible');
        } else {
          emptyState.classList.remove('is-visible');
        }
      }

      // 4. Synchronize URL Hash without page jump
      if (updateHash) {
        const newHash = targetCategory === 'all' ? '' : `#${targetCategory}`;
        if (window.location.hash !== newHash) {
          if (history.replaceState) {
            history.replaceState(null, '', newHash || window.location.pathname + window.location.search);
          } else {
            window.location.hash = newHash;
          }
        }
      }
    }

    // Click handler for tab buttons
    tabButtons.forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const category = this.getAttribute('data-filter-tab');
        applyFilter(category, true);
      });
    });

    // Keyboard navigation (WAI-ARIA Tablist pattern)
    const tabList = document.querySelector('[role="tablist"]');
    if (tabList) {
      tabList.addEventListener('keydown', function (e) {
        const tabsArray = Array.from(tabButtons);
        const currentIndex = tabsArray.indexOf(document.activeElement);

        if (currentIndex === -1) return;

        let nextIndex = -1;

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          nextIndex = (currentIndex + 1) % tabsArray.length;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          nextIndex = (currentIndex - 1 + tabsArray.length) % tabsArray.length;
        } else if (e.key === 'Home') {
          e.preventDefault();
          nextIndex = 0;
        } else if (e.key === 'End') {
          e.preventDefault();
          nextIndex = tabsArray.length - 1;
        }

        if (nextIndex !== -1) {
          tabsArray[nextIndex].focus();
          const category = tabsArray[nextIndex].getAttribute('data-filter-tab');
          applyFilter(category, true);
        }
      });
    }

    // Reset button in empty state
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        applyFilter('all', true);
        const allTab = document.querySelector('[data-filter-tab="all"]');
        if (allTab) {
          allTab.focus();
        }
      });
    }

    // Listen for browser back/forward navigation
    window.addEventListener('hashchange', function () {
      const cat = getCategoryFromHash();
      applyFilter(cat, false);
    });

    // Initial load from URL hash
    const initialCategory = getCategoryFromHash();
    applyFilter(initialCategory, false);
  }
})();
