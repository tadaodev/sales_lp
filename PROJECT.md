# Project: Sales LP Portal Suite (5 Flagship Vertical Landing Pages)

## Architecture
- **Multi-Vertical Landing Page Suite**: Hosted on GitHub Pages (`https://tadaodev.github.io/sales_lp/`), zero hosting cost.
  - **Portal Hub (`index.html`)**: Interactive showcase with category filters (All, 美容・サロン, 飲食・グルメ, 士業・法務) and 5 LIVE DEMO featured flagship cards.
  - **1. Aesthetic Salon Demo Site (`samples/aesthetic/`)**: Luxury aesthetic salon LP with 14-day slot availability, GAS integration, .ics & LINE integration.
  - **2. Italian Restaurant Demo Site (`samples/italian/`)**: Casual Italian restaurant "TRATTORIA & PIZZERIA BELLA TAVOLA" LP based on new PASONA formula, warm modern styling, lunch/dinner 2-shift seat calendar.
  - **3. Legal Consulting Demo Site (`samples/legal/`)**: Corporate legal & labor consulting "LUMEN LEGAL CONSULTING" LP based on new PASONA formula (risk avoidance), Luxury Glassmorphism UI (Navy & Champagne Gold), 14-day 2WAY consultation booking calendar (Zoom online vs In-person).
  - **4. Artisan Hard Bakery Demo Site (`samples/bakery/`)**: French artisan hard-style bakery "BOULANGERIE ARTISANALE" LP with five-sense artisan experience model, sourdough/levain story, daily baking timetable (4 batches), Matsutake 3-tier takeout assortments (梅 ¥1,980 / 竹 ¥3,480 ★人気No.1 / 松 ¥5,800), 14-day pre-order/takeout calendar.
  - **5. Washoku Banquet Izakaya Demo Site (`samples/washoku/`)**: Reasonable banquet & fresh washoku "個室和食 旬彩 縁 -ENISHI-" LP with organizer relief model, fresh seafood/yakitori/seasonal hotpot, Matsutake 3-tier all-inclusive banquet plans (梅 ¥3,980 / 竹 ¥4,980 ★人気No.1 / 松 ¥6,500), 14-day banquet availability calendar & LINE quick booking.
- **Static Frontend Architecture**: Pure HTML5, Modern CSS (Glassmorphism, custom CSS variables, responsive grids/flexbox), Vanilla ES6+ JavaScript.
- **Unified Centralized Configuration**: `samples/*/js/config.js` defining business info, hours, closed days, slots, pricing plans, and offline dynamic fallback simulation.
- **Offline / Standalone Fallback**: Deterministic calculation engine providing realistic availability (◯, △, ✕, 休) and seamless mock booking without breaking user experience when GAS URL is unset or offline.
- **Automated Test Infrastructure**: Multi-tier Python test runner (`tests/run_all_tests.py`), verifying links, DOM structures, responsive UI, calendar calculations, and deployment integrity across 179 test cases with 100% pass rate.

---

## Feature Inventory
| # | Feature | Description | Milestone | Source | Status |
|---|---------|-------------|-----------|--------|--------|
| 1 | Bakery LP HTML/CSS/JS | French hard bakery LP with artisan storytelling, baking timetable, Matsutake box pricing, 14-day takeout calendar, craft paper/gold warm UI | M1 | ORIGINAL_REQUEST §R1 | DONE |
| 2 | Bakery AI Visual Image Assets | 4 photographic image assets (`hero_baguette.jpg`, `baker_craftsman.jpg`, `campagne_slice.jpg`, `bakery_display.jpg`) under `samples/bakery/assets/images/` | M1 | ORIGINAL_REQUEST §R3 | DONE |
| 3 | Bakery Config & Takeout Booking Engine | `samples/bakery/js/config.js` (`window.BAKERY_CONFIG`) & `bakery.js` with 14-day takeout booking & .ics/LINE modal | M1 | ORIGINAL_REQUEST §R1, R4 | DONE |
| 4 | Washoku LP HTML/CSS/JS | Washoku Izakaya LP with banquet organizer reassurance, seasonal hotpot/sashimi, Matsutake banquet pricing, 14-day seat booking calendar, indigo & amber warm modern UI | M2 | ORIGINAL_REQUEST §R2 | DONE |
| 5 | Washoku AI Visual Image Assets | 4 photographic image assets (`hero_banquet_nabe.jpg`, `sashimi_platter.jpg`, `yakitori_charcoal.jpg`, `washoku_private_room.jpg`) under `samples/washoku/assets/images/` | M2 | ORIGINAL_REQUEST §R3 | DONE |
| 6 | Washoku Config & Banquet Booking Engine | `samples/washoku/js/config.js` (`window.WASHOKU_CONFIG`) & `washoku.js` with 14-day banquet booking & .ics/LINE modal | M2 | ORIGINAL_REQUEST §R2, R4 | DONE |
| 7 | Top Portal Hub 5-Flagship Integration | Update `index.html` and `css/portal.css` to feature 5 flagship live demo cards, filter badges, and quick jump navigation | M3 | ORIGINAL_REQUEST §R5 | DONE |
| 8 | Automated Test Suite Expansion (179 tests) | Extend `tests/` with Bakery & Washoku DOM validation, relative links, responsive checks, calendar logic, and multi-sample integrity | M4 | ORIGINAL_REQUEST §R6 | DONE |
| 9 | Multi-Agent Quality & Forensic Gate | Independent Reviewers, Challengers, and Forensic Auditor verification (100% PASS / CLEAN) | M5 | Process Gate | DONE |
| 10 | Git Commit & GitHub Pages Push | Commit all changes and push to `main` branch for instant GitHub Pages deployment | M6 | ORIGINAL_REQUEST §R6 | DONE |

---

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M0 | Survey & Spec Exploration | Requirements, design tokens, and QA criteria analysis | none | COMPLETED |
| M1 | Bakery LP Implementation & Assets | `samples/bakery/index.html`, `bakery.css`, `config.js`, `bakery.js`, `assets/images/*` | M0 | COMPLETED |
| M2 | Washoku LP Implementation & Assets | `samples/washoku/index.html`, `washoku.css`, `config.js`, `washoku.js`, `assets/images/*` | M0 | COMPLETED |
| M3 | Top Portal 5-Flagship Integration | `index.html`, `css/portal.css` | M1, M2 | COMPLETED |
| M4 | Automated Test Suite Expansion (179 tests) | `tests/run_all_tests.py`, `validate_links.py`, `validate_pasona_dom.py`, `test_interactive_ui.py`, `test_server.py` | M1, M2, M3 | COMPLETED |
| M5 | Multi-Agent Quality & Forensic Gate | 2 Reviewers, 2 Challengers, 1 Forensic Auditor (Iteration 2: 100% PASS / CLEAN) | M4 | COMPLETED |
| M6 | Production Deploy & GitHub Pages Push | Staging, commit, and push scripts to `origin main` | M5 | COMPLETED |

---

## Code Layout & Write Boundaries
- **Milestone 1**: `samples/bakery/*` exclusively
- **Milestone 2**: `samples/washoku/*` exclusively
- **Milestone 3**: `index.html`, `css/portal.css` exclusively
- **Milestone 4**: `tests/*` exclusively
- **Milestone 6**: Git repository commands
