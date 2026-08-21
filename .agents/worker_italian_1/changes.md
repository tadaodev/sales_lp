# Changes Report — worker_italian_1 (TRATTORIA & PIZZERIA BELLA TAVOLA)

## 1. Overview of Changes
Implemented the 2nd sample landing page for the LP Design Hub: **"TRATTORIA & PIZZERIA BELLA TAVOLA"** (`samples/italian/`).
Applied the **New PASONA Framework** with appetizing warm Italian UI tokens, wood-fired pizza and handmade pasta sizzle imagery, a 14-day 2-shift seat availability calendar (Lunch 5 slots / Dinner 6 slots), reservation modal with Google/Apple Calendar (.ics) and LINE deep link integration, and updated the top portal showcase (`index.html`).

---

## 2. File-by-File Detailed Changes

### 2.1 `samples/italian/js/config.js` (Created)
- Implemented `window.RESTAURANT_CONFIG` singleton.
- **Metadata**: Name (`TRATTORIA & PIZZERIA BELLA TAVOLA`), phone (`03-5678-9012`), address (`東京都渋谷区神宮前5-X-X 表参道テラス 1F`).
- **2-Shift Business Hours**:
  - Lunch: `11:30 - 15:00` (L.O. 14:30), 5 slots (`11:30`, `12:00`, `12:30`, `13:00`, `13:30`)
  - Dinner: `17:30 - 22:30` (L.O. 21:30), 6 slots (`17:30`, `18:00`, `18:30`, `19:00`, `19:30`, `20:00`)
- **Closed Days**: `[2]` (Tuesday), labeled `毎週火曜日（祝日の場合は翌水曜日振替休）`.
- **Course Master**:
  - 竹 (Classico ★人気No.1 / ¥6,800 / 全7品 / 乾杯酒付)
  - 梅 (Stagione / ¥4,800 / 全6品)
  - 松 (Speciale / ¥9,800 / 全8品 / 記念日特製プレート付)
  - Lunch B (Pranzo B 贅沢ランチ / ¥2,800 / 全5品)
  - 席のみ予約 (¥0 / アラカルト当日注文)
- **Integrations**: `lineOfficialUrl`, `fallbackSimulation: true`, `simulationSeedSalt: 'bella_tavola_italian_2026'`.
- Supported aliases (`restaurantInfo`, `gas`, `calendar`, `courses`, `plans`, `line`, `fallback`) and CommonJS `module.exports`.

### 2.2 `samples/italian/css/italian.css` (Created)
- **Palette Tokens**: Terracotta (`#C85A32`), Wine Red (`#722F37`), Olive Green (`#556B2F`), Warm Wood (`#8B5A2B`), Warm Plaster Cream canvas (`#FDFBF7`), Dark Espresso text (`#2D1F1D`).
- **Responsive Architecture**: Fluid layout from mobile 375px to desktop 1920px.
- **Component Styling**:
  - Sticky glass header with return navigation to portal (`../../index.html`).
  - Hero visual card with sizzle badges and gradient overlays.
  - Problem agitation cards and bridge callout box.
  - Affinity chef story quotes and portrait styling.
  - 3 Pillars cards with hover elevations and photo zoom transitions.
  - Matsutake 3-tier pricing cards with Bamboo plan popular ribbon highlight.
  - 14-day 2-shift table calendar with responsive horizontal touch scrolling.
  - Modern form controls with real-time validation error styling.
  - Accessible FAQ accordion with smooth grid transitions.
  - Mobile sticky CTA bar (`#mobile-sticky-cta`).
  - Modal dialog with summary table and calendar sync buttons.

### 2.3 `samples/italian/index.html` (Created)
- **Semantic HTML5 & Accessibility**: Single `<h1>` (`薪窯の薫香と、手打ちの弾力。今宵、一番美味しいイタリアへ。`), strict heading hierarchy (`h1` -> `h2` -> `h3` -> `h4`), `lang="ja"`, viewport, OGP, and all 6 `<img>` tags with descriptive `alt` attributes.
- **New PASONA 7 Sections**:
  - `data-pasona="problem"`: Hero First View (`#hero`) + Dilemma Checklist (`#problem`)
  - `data-pasona="affinity"`: Chef Story & Trattoria Concept (`#affinity`)
  - `data-pasona="solution"`: 3 Pillars (Pizza, Pasta, Wine) & Before/After Comparison (`#solution`)
  - `data-pasona="offer"`: Matsutake 3-Tier Courses + Lunch Sets + Tiramisu Dolce (`#offer`)
  - `data-pasona="narrowing"`: 1 Day 8 Tables / 60 Doughs Limit & 3 Web Booking Perks (`#narrowing`)
  - `data-pasona="action"`: 14-Day Calendar & Web Booking Form + LINE CTA (`#action`)
  - `data-pasona="faq"`: 6 Q&A Accordion Items (`#faq`)
- **Image Wiring**: Exact relative path references to the 4 generated assets (`./assets/images/trattoria_interior.jpg`, `pizza_margherita.jpg`, `handmade_pasta.jpg`, `dolce_tiramisu.jpg`).
- **Scripts**: Exact script load order (`config.js` before `italian.js`).

### 2.4 `samples/italian/js/italian.js` (Created)
- **14-Day 2-Shift Availability Calendar Engine**:
  - Renders 14 dates x 5 lunch slots / 6 dinner slots (11 slots/day = 154 slots total).
  - Deterministic status calculator yielding `◯` (available), `△` (limited), `✕` (full), `休` (closed on Tuesday).
  - Past slots on today disabled.
  - Shift tab switcher toggling Lunch vs Dinner grid.
  - Slot tap highlights selection, auto-populates datetime, and smooth-scrolls to `#booking-form`.
- **Course Preselectors**:
  - Clicking course buttons selects corresponding plan in `#form-course` and automatically sets shift tab.
- **Form Submitter & Modal Controller**:
  - Generates reservation ID `TAV-YYYYMMDD-XXXX`.
  - 1-Click Google Calendar Web URL generator.
  - RFC 5545 `.ics` Blob generator with 2-hour VALARM reminder.
  - 1-Tap LINE deep link generator (`https://line.me/R/oaMessage/@bella_tavola/?...`).
  - Seamless fallback simulation when GAS webhook is empty.
  - Accessible FAQ accordion and scroll-triggered mobile sticky bar.

### 2.5 `index.html` (Top Portal Showcase Upgraded)
- Upgraded the "飲食・店舗" teaser card (`data-category="dining"`) into an active live demo card (`#card-italian`).
- Set status badge to `公開中 (LIVE DEMO)`, tags for `14日2部制席予約` and `本格薪窯ピッツァ`.
- Connected direct demo button `<a href="./samples/italian/index.html" class="btn-primary-demo" id="link-italian-demo">`.
- Updated footer navigation with link to Italian restaurant LP demo.

### 2.6 `tests/validate_links.py`, `tests/validate_pasona_dom.py`, `tests/test_interactive_ui.py` (Extended)
- Added script load order check for `samples/italian/index.html` (`config.js` before `italian.js`).
- Added New PASONA DOM and SEO validation for `samples/italian/index.html`.
- Added `ItalianConfigSchemaValidator`, Italian calendar DOM, reservation ID format (`TAV-YYYYMMDD-XXXX`), and LINE deep link tests.
