# Handoff Report: Italian Restaurant LP Technical Architecture & Engine Design

**Agent**: explorer_italian_tech_1  
**Working Directory**: `c:\Project\事業案\05_LP作成\.agents\explorer_italian_tech_1`  
**Target Milestone**: M1 (Italian Restaurant LP Architecture & Implementation)  
**Date**: 2026-08-21T08:44:00+09:00  

---

## 1. Observation

Direct observations from the workspace code, assets, configurations, and test suites:

1. **Asset Inventory**:
   - Location: `samples/italian/assets/images/`
   - Files verified on disk:
     - `trattoria_interior.jpg` (1,119,899 bytes)
     - `pizza_margherita.jpg` (845,976 bytes)
     - `handmade_pasta.jpg` (853,958 bytes)
     - `dolce_tiramisu.jpg` (769,104 bytes)
   - Status: All 4 high-resolution imagery assets exist and are ready for integration.

2. **Aesthetic Reference Implementation (`samples/aesthetic/`)**:
   - `samples/aesthetic/js/config.js` (Lines 1–165): Implements `window.SALON_CONFIG` single source of truth pattern with `gasWebhookUrl`, `businessHours`, `closedDays: [2]`, `timeSlots`, `daysToShow: 14`, `lineOfficialUrl`, `fallbackSimulation: true`, and plan definitions.
   - `samples/aesthetic/js/aesthetic.js` (Lines 1–725): Provides deterministic 14-day slot calculation (`computeDeterministicSlotStatus`), modal booking dialog, reservation ID generator (`LUM-YYYYMMDD-XXXX`), 1-click Google Calendar URL constructor, Apple Calendar RFC 5545 `.ics` Dynamic Blob generator with 2-hour VALARM, 1-tap LINE URL generator, mobile sticky CTA, and FAQ accordion.

3. **Portal Hub State (`index.html`)**:
   - Lines 303–332: Card `<article class="lp-card teaser" data-category="dining">` is currently a teaser with "Coming Soon". Needs to be upgraded to an active live demo card (`card-italian`) linking to `./samples/italian/index.html`.
   - Lines 108–142: Filter tab navigation contains `data-filter-tab="dining"` with count badge `1`.

4. **Automated Test Infrastructure (`tests/`)**:
   - `tests/run_all_tests.py` (842 lines): Orchestrates a 4-tier test runner (50 Tier-1 feature cases, 50 Tier-2 boundary cases, 10 Tier-3 combinatorial cases, 5 Tier-4 real-world scenarios).
   - `tests/test_interactive_ui.py` (497 lines): Tests `ConfigSchemaValidator`, `CalendarEngineSimulator`, `ThankYouViewValidator`, and GAS backend.
   - `tests/validate_links.py` (339 lines): Tests strict relative paths, case sensitivity, script order (`config.js` before LP JS), and bi-directional links.
   - `tests/validate_pasona_dom.py` (360 lines): Tests 7 New PASONA sections, heading hierarchy, and accessibility attributes.

---

## 2. Logic Chain

1. **Step 1: Restaurant Domain & Shift Model Differentiation**:
   - Unlike an aesthetic salon (which operates on single treatment slots, e.g., 4 slots/day), a casual Italian restaurant operates on a **2-shift business model** (Lunch: 11:30–15:00 [5 slots: 11:30, 12:00, 12:30, 13:00, 13:30] and Dinner: 17:30–22:30 [6 slots: 17:30, 18:00, 18:30, 19:00, 19:30, 20:00]).
   - Total slots per day: 11 slots. Across 14 days, total possible booking slots = 154 slots.
   - To provide optimal mobile UX (375px–430px) without horizontal/vertical clutter, a **Shift Tab Switcher** (`[data-shift-tab="lunch"]` vs `[data-shift-tab="dinner"]`) must be implemented to cleanly toggle the 14-day calendar grid.

2. **Step 2: Schema Design in `config.js`**:
   - `window.RESTAURANT_CONFIG` encapsulates restaurant metadata (TRATTORIA & PIZZERIA BELLA TAVOLA, 03-5678-9012, 恵比寿1-23-45), 2-shift business hours, Tuesday closed days (`[2]`), 2-shift `timeSlots` (`lunch: 5 slots`, `dinner: 6 slots`), `daysToShow: 14`, `capacityPerSlot: 4`, `maxPartySize: 8`, LINE official account links (`@bella_tavola`), and `courseMaster` (松: スペチャーレ ¥8,800, 竹: スタジオーネ ¥5,800, 梅: クラシコ ¥3,800, ランチ: ベッラランチ ¥2,200, 席のみ: ¥0).
   - Global export and CommonJS support allow both frontend runtime and Python test runners to parse the configuration seamlessly.

3. **Step 3: Reservation Flow & Multi-Platform Calendar Synchronization**:
   - Slot click (◯: available, △: limited) extracts date, time, shift, and formatted string, populates `#form-datetime`, `#form-date`, `#form-time`, `#form-shift`, and smoothly scrolls to `#booking-form`.
   - On submission, form validates name, tel (`/^[0-9\-+]{10,15}$/`), email, party size (1–8 guests), course selection, and seating preference.
   - Unique Reservation ID generator emits `TAV-YYYYMMDD-XXXX`.
   - Post-submit action populates modal thank-you summary and sets up:
     1. Google Calendar Web 1-Click URL with exact start/end ISO timestamps calculated by course duration (default 120 min).
     2. RFC 5545 Apple / Outlook `.ics` Dynamic Blob download with 2-hour VALARM reminder (`TRIGGER:-PT2H`).
     3. 1-Tap LINE deep link (`https://line.me/R/oaMessage/@bella_tavola/?...`) with full Japanese booking summary.
     4. Non-blocking asynchronous GAS POST request with silent offline fallback if webhook is unconfigured.

4. **Step 4: Top Portal Integration**:
   - Upgrading `index.html` card `card-italian` under `data-category="dining"` from Teaser to Live Demo Card with thumbnail (`pizza_margherita.jpg`), badges, highlights, and direct link (`./samples/italian/index.html`).

5. **Step 5: Automated Testing Extension**:
   - `tests/test_interactive_ui.py`, `tests/validate_links.py`, `tests/validate_pasona_dom.py`, and `tests/run_all_tests.py` are extended to validate the Italian LP schema, 2-shift 154-slot calendar grid, reservation ID formatting (`TAV-YYYYMMDD-XXXX`), image asset existence, and relative navigation.

---

## 3. Caveats

1. **GAS Webhook**: The default configuration has `gasWebhookUrl: ""` (empty). All booking interactions run deterministically in client-side simulation mode, ensuring zero-dependency standalone execution on GitHub Pages without requiring a deployed Google Apps Script.
2. **Shift Switching UX**: On desktop, both shifts could theoretically fit side-by-side, but the tab-switcher pattern ensures optimal responsiveness down to 375px mobile screens.

---

## 4. Conclusion

The complete technical architecture for the Italian Restaurant LP is fully designed and documented in `c:\Project\事業案\05_LP作成\.agents\explorer_italian_tech_1\tech_analysis.md`. The design adheres to all user requirements, matches the established patterns from the aesthetic salon implementation, and provides ready-to-use production code blueprints for `config.js`, `italian.js`, `index.html` portal card, and test runner extensions.

---

## 5. Verification Method

Independent verification steps for the implementer:

1. **File Blueprint Inspection**:
   - Read `c:\Project\事業案\05_LP作成\.agents\explorer_italian_tech_1\tech_analysis.md` for complete code blueprints and schema definitions.
2. **File Structure Check**:
   - Verify `samples/italian/js/config.js` and `samples/italian/js/italian.js` match the exact exported variable names (`window.RESTAURANT_CONFIG`, `currentSelectedShift`, etc.).
3. **Link & Asset Verification**:
   - Run `python tests/validate_links.py` to ensure all 4 images and relative scripts resolve with zero 404s.
4. **DOM Structure Verification**:
   - Run `python tests/validate_pasona_dom.py` to ensure New PASONA sections, `#calendar-table-container`, `#booking-form`, and `#booking-modal` are present.
5. **Master Test Suite Run**:
   - Run `python tests/run_all_tests.py` to confirm all 4 tiers pass 100%.
