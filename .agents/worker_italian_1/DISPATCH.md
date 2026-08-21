## 2026-08-21T08:45:00Z
You are worker_italian_1.
Your working directory is: c:\Project\事業案\05_LP作成\.agents\worker_italian_1

You MUST read the following authoritative specification files before coding:
- c:\Project\事業案\05_LP作成\.agents\ORIGINAL_REQUEST.md
- c:\Project\事業案\05_LP作成\PROJECT.md
- c:\Project\事業案\05_LP作成\.agents\spec_miner_italian_1\spec_report.md
- c:\Project\事業案\05_LP作成\.agents\explorer_italian_1\analysis.md
- c:\Project\事業案\05_LP作成\.agents\explorer_italian_tech_1\tech_analysis.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. An auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your assignments:
1. Create `samples/italian/js/config.js`:
   - Implement `window.RESTAURANT_CONFIG` exactly as designed in `tech_analysis.md` and `spec_report.md`.
   - Include restaurant metadata (TRATTORIA & PIZZERIA BELLA TAVOLA, 03-5678-9012, 渋谷区神宮前5-X-X), 2-shift business hours (Lunch 11:30-15:00 / Dinner 17:30-22:30), closedDays: [2] (Tuesday), timeSlots (lunch 5 slots: 11:30, 12:00, 12:30, 13:00, 13:30; dinner 6 slots: 17:30, 18:00, 18:30, 19:00, 19:30, 20:00), daysToShow: 14, courseMaster, lineOfficialUrl, fallbackSimulation: true.

2. Create `samples/italian/css/italian.css`:
   - Warm appetizing Italian color palette tokens: Terracotta (`#C85A32`), Wine Red (`#722F37`), Olive Green (`#556B2F`), Warm Wood (`#8B5A2B`), Warm Cream background (`#FDFBF7`), Dark Espresso text (`#2A2421`).
   - Sizzling modern UI styles for cards, badges, menus, course tables, image gallery hover effects, 14-day calendar grid, lunch/dinner shift tabs, booking modal, sticky mobile CTA bar, FAQ accordion, access map.
   - Fully responsive design from 375px mobile to 1920px desktop.

3. Create `samples/italian/index.html`:
   - Complete new PASONA framework structure with semantic HTML5 tags:
     - Header & Nav with return link to portal (`../../index.html`), phone, opening hours, booking CTA.
     - Hero section (`#hero` / `data-pasona="problem"`): Sizzle catchcopy, badges, quick reserve button.
     - Problem section (`#problem` / `data-pasona="problem"`): Dining dilemmas & authentic craving checklist.
     - Affinity section (`#affinity` / `data-pasona="affinity"`): Chef story, passion for handmade Napoli style, trattoria warmth.
     - Solution section (`#solution` / `data-pasona="solution"`): 3 Pillars (500℃ wood-fired pizza, fresh handmade pasta, organic bio wine).
     - Menu & Offer section (`#offer` / `data-pasona="offer"`): Pranzo lunch sets, Matsutake dinner courses (梅: Stagione ¥4,800, 竹: Classico ¥6,800, 松: Speciale ¥9,800), Dolce (Tiramisu).
     - Image Wiring: `samples/italian/assets/images/trattoria_interior.jpg` (Hero/Affinity), `pizza_margherita.jpg` (Pizza), `handmade_pasta.jpg` (Pasta), `dolce_tiramisu.jpg` (Dolce/Offer).
     - Narrowing Down section (`#narrowing` / `data-pasona="narrowing"`): 1 day 8 tables / 60 doughs limit, booking benefits.
     - Action section (`#action` / `data-pasona="action"`): 14-day lunch/dinner 2-shift seat availability calendar, web seat reservation form, LINE booking option.
     - Modal: Reservation completion dialog with booking ID (`TAV-YYYYMMDD-XXXX`), Google Calendar URL, Apple Calendar .ics download button, 1-tap LINE confirmation.
     - FAQ section (`#faq`): 6 accordion items addressing reservations, allergies, children, cancellation, etc.
     - Access & Store Info (`#access`): Map, address, opening hours, station info, footer.

4. Create `samples/italian/js/italian.js`:
   - 14-day 2-shift calendar renderer with Lunch / Dinner shift tab switcher.
   - Deterministic availability simulation algorithm computing ◯ (available), △ (limited), ✕ (full), 休 (closed on Tuesdays).
   - Tap/click on ◯ or △ slot -> auto-populates datetime into reservation form and smoothly scrolls to `#booking-form`.
   - Reservation form validation, submission handler, unique reservation ID generator (`TAV-YYYYMMDD-XXXX`).
   - Modal popup showing reservation summary, 1-click Google Calendar URL generation, RFC 5545 `.ics` dynamic Blob download with 2h alarm, and 1-tap LINE deep link.
   - Silent graceful fallback when GAS URL is not provided.
   - Accordion, smooth scroll, and mobile sticky CTA bar behaviors.

5. Update `index.html` (Top Portal):
   - Upgrade the "飲食・店舗" teaser card (`data-category="dining"`) into an active live demo card for "TRATTORIA & PIZZERIA BELLA TAVOLA" linking to `./samples/italian/index.html`.
   - Set status badge to "公開中", thumbnail to `samples/italian/assets/images/pizza_margherita.jpg`, tag badges for 新PASONA, 席予約, 14日カレンダー, 本格薪窯ピッツァ.

6. Validation:
   - Run syntax and link checks, verify all relative paths (`../../` and `./`) are correct.
   - Test that opening the HTML pages renders cleanly without console errors or missing assets.
