## 2026-08-21T22:18:34Z
You are worker_bakery_1. Your working directory is `c:\Project\事業案\05_LP作成\.agents\worker_bakery_1`.
You own exclusive write permissions for `samples/bakery/` directory.

Read the following files carefully:
- `c:\Project\事業案\05_LP作成\.agents\ORIGINAL_REQUEST.md` (Specifically R1, R3, R4)
- `c:\Project\事業案\05_LP作成\PROJECT.md`
- `c:\Project\事業案\05_LP作成\.agents\spec_miner_bakery_1\handoff.md` (Full specification, copy, tokens, timetable, pricing, image prompts, config schema)
- `c:\Project\事業案\05_LP作成\.agents\explorer_portal_qa_1\handoff.md`
- Reference existing samples: `samples/italian/` and `samples/legal/`

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your Tasks:
1. Generate/create 4 high-resolution visual image assets under `samples/bakery/assets/images/`:
   - `hero_baguette.jpg` (16:9 freshly baked authentic artisan baguette tradition with crispy ear cuts, flour dusting, stone oven glow)
   - `baker_craftsman.jpg` (1:1 portrait of master baker Masato Hyuga in chef jacket & flour dusted apron holding sourdough pain de campagne)
   - `campagne_slice.jpg` (4:3 cross section of sourdough Pain de Campagne showing aerated alveoli honeycomb crumb and roasted crust)
   - `bakery_display.jpg` (16:9 French antique artisan bakery boutique interior with overflowing wicker baskets of baguettes & croissants)
   (You can use generate_image or high-fidelity realistic image generation scripts / SVG-backed Canvas / realistic photo assets)
2. Implement `samples/bakery/js/config.js` defining `window.BAKERY_CONFIG` matching the schema in `spec_miner_bakery_1/handoff.md §6` (store info, 7:30-18:30, closed days [1, 2], timeSlots ['08:00', '11:00', '14:00', '16:30'], daysToShow: 14, planMaster: bamboo ¥3,480 ★人気No.1, plum ¥1,980, pine ¥5,800, alacarte ¥0, bakingSchedule: 4 batches, fallbackSimulation: true, lineOfficialUrl).
3. Implement `samples/bakery/index.html` with:
   - Full new PASONA structure: `#problem` (data-pasona="problem"), `#affinity` (data-pasona="affinity"), `#solution` (data-pasona="solution"), `#offer` (data-pasona="offer"), `#narrowing` (data-pasona="narrowing"), `#action` (data-pasona="action"), `#faq` (data-pasona="faq", 6 items WAI-ARIA accordion), `#access`.
   - Single `<h1>`, strict heading hierarchy (h1 -> h2 -> h3), meta tags, ogp, `alt` attributes on all images.
   - Daily Baking Timetable (07:30, 10:30, 13:30, 16:00) with visual cards.
   - Matsutake 3-tier assortment cards + alacarte option with buttons to preselect plan into reservation form.
   - 14-day reservation calendar container (`#bakery-calendar-container`).
   - Sticky mobile takeout CTA bar (`#mobile-sticky-cta`).
   - Booking modal & Thank-You confirmation view.
   - Bidirectional link to portal (`../../index.html`).
4. Implement `samples/bakery/css/bakery.css` with Warm French Artisan Organic Glassmorphism (craft paper `#F9F6F0`, wheat gold `#D4A359`, crust brown `#5C3A21`, deep charcoal `#221C16`, backdrop-filter blur, responsive 375px-1920px).
5. Implement `samples/bakery/js/bakery.js` with:
   - 14-day slot calculation (◯, △, ✕, 休), past slot disable, closed days disable.
   - Deterministic offline fallback calculation with salt.
   - Slot tap event listener auto-filling date/time and scrolling to form.
   - Plan card selection event listener auto-updating form plan.
   - Form validation, dynamic booking ID generation (`BAK-YYYYMMDD-XXXX`).
   - 1-click Google Calendar URL generator, RFC 5545 `.ics` file generator (with 2h VALARM reminder), LINE deep link with pre-filled message.
   - Async GAS webhook POST with graceful offline fallback.
   - FAQ accordion toggle.
6. Verify your implementation by running test scripts (e.g. `python tests/validate_links.py`, `python tests/validate_pasona_dom.py`, `python tests/test_interactive_ui.py`) and documenting results.

Deliver your detailed report in `c:\Project\事業案\05_LP作成\.agents\worker_bakery_1\handoff.md` and send a message when complete.
