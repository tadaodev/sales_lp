# Project: Sales LP Portal & Italian Restaurant Sample LP (TRATTORIA & PIZZERIA BELLA TAVOLA)

## Architecture
- **Multi-Vertical Landing Page Suite**: Hosted on GitHub Pages (`https://tadaodev.github.io/sales_lp/`), zero hosting cost.
  - Portal (`index.html`): Filterable showcase with category tabs (All, 美容・サロン, 飲食・店舗, 士業・コンサル, etc.) and preview modals.
  - Aesthetic Salon Sample (`samples/aesthetic/`): Luxury aesthetic salon LP with 14-day slot availability, GAS integration, .ics & LINE integration.
  - Italian Restaurant Sample (`samples/italian/`): Casual Italian restaurant "TRATTORIA & PIZZERIA BELLA TAVOLA" LP based on new PASONA formula, rich warm modern styling (terracotta `#C85A32`, wine red `#722F37`, olive green `#556B2F`, warm wood `#8B5A2B`, cream background `#FDFBF7`), pizza & pasta sizzle, 14-day lunch/dinner 2-shift seat calendar, instant reservation modal, Google/Apple calendar and LINE integration.
- **Static Frontend Architecture**: Pure HTML5, Modern CSS (CSS custom properties, glassmorphism, responsive grid/flexbox), Vanilla ES6+ JavaScript.
- **Serverless Backend (GAS)**: Google Apps Script Web App (`gas/Code.gs`) providing reservation endpoints and ledger recording.
- **Centralized Configuration**: `samples/italian/js/config.js` (`window.RESTAURANT_CONFIG`) defining GAS URL, business hours (Lunch 11:30-15:00 / Dinner 17:30-22:30), closed days (Tuesday), table seat capacity, time shifts, LINE ID, and fallback simulation flag.
- **Offline / Standalone Fallback**: Deterministic seat calculation engine providing realistic availability (◯, △, ✕, 休) and seamless mock booking without breaking user experience when GAS URL is unset or offline.
- **Automated Test Infrastructure**: Multi-tier Python test runner (`tests/run_all_tests.py`), verifying links, DOM structures, responsive UI, seat reservation calendar calculations, and deployment integrity.

---

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Italian Restaurant Sample LP HTML/CSS/JS | Full new PASONA structure (Problem, Affinity, Solution, Offer, Narrowing, Action) with warm sizzling UI | M1 | ORIGINAL_REQUEST §R1 |
| 2 | Image Asset Wiring & Sizzle Visuals | Proper placement of 4 generated high-res images (`trattoria_interior.jpg`, `pizza_margherita.jpg`, `handmade_pasta.jpg`, `dolce_tiramisu.jpg`) | M1 | ORIGINAL_REQUEST §R2 |
| 3 | Unified Config & Seat Calendar Logic | `config.js` with lunch/dinner 2-shift seat reservation calendar (◯, △, ✕, 休) and dynamic fallback calculation | M1 | ORIGINAL_REQUEST §R3 |
| 4 | Reservation Modal & ICS / LINE Integration | Modal on submit with booking ID, Google Calendar, Apple Calendar (.ics), and 1-tap LINE confirmation | M1 | ORIGINAL_REQUEST §R3 |
| 5 | Top Portal Integration & Bi-directional Nav | Add Italian LP card to `index.html` under "飲食・店舗", ensure bidirectional navigation with zero 404s | M2 | ORIGINAL_REQUEST §R4 |
| 6 | Automated Test Suite Extension | Extend `tests/` with Italian LP DOM, relative links, responsive checks, and seat calendar verification (100% pass) | M3 | ORIGINAL_REQUEST §R5 |
| 7 | Git Commit & GitHub Pages Push | Commit all changes and push to `main` for instant deployment | M4 | ORIGINAL_REQUEST §R5 |

---

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Italian Restaurant LP Implementation | `samples/italian/index.html`, `samples/italian/css/italian.css`, `samples/italian/js/config.js`, `samples/italian/js/italian.js`, asset wiring | none | DONE |
| M2 | Top Portal Integration & Nav | `index.html`, `samples/italian/index.html` return links | M1 | DONE |
| M3 | Automated Test Suite Extension | `tests/run_all_tests.py`, `tests/validate_pasona_dom.py`, `tests/validate_links.py`, `tests/test_interactive_ui.py` | M1, M2 | DONE |
| M4 | Git Commit & GitHub Pages Deploy | Git commit and push to `origin main` | M3 | DONE |

---

## Interface Contracts

### `samples/italian/js/config.js` ↔ `samples/italian/js/italian.js`
```javascript
window.RESTAURANT_CONFIG = {
  restaurantName: "TRATTORIA & PIZZERIA BELLA TAVOLA",
  restaurantPhone: "03-5678-9012",
  restaurantEmail: "info@bellatavola.example.com",
  restaurantAddress: "東京都渋谷区神宮前5-X-X",
  gasWebhookUrl: "", // Optional GAS Web App URL
  businessHours: {
    lunch: { start: "11:30", end: "15:00", lastOrder: "14:30" },
    dinner: { start: "17:30", end: "22:30", lastOrder: "21:30" }
  },
  closedDays: [2], // Tuesday (0: Sun, 1: Mon, 2: Tue, 3: Wed, 4: Thu, 5: Fri, 6: Sat)
  timeSlots: {
    lunch: ["11:30", "12:00", "12:30", "13:00", "13:30"],
    dinner: ["17:30", "18:00", "18:30", "19:00", "19:30", "20:00"]
  },
  daysToShow: 14,
  lineOfficialUrl: "https://line.me/R/ti/p/@bella_tavola",
  fallbackSimulation: true
};
```

---

## Code Layout & Write Boundaries
- **Milestone 1**: `samples/italian/index.html`, `samples/italian/css/italian.css`, `samples/italian/js/config.js`, `samples/italian/js/italian.js`
- **Milestone 2**: `index.html` (Top portal integration)
- **Milestone 3**: `tests/run_all_tests.py`, `tests/validate_links.py`, `tests/validate_pasona_dom.py`, `tests/test_interactive_ui.py`
- **Milestone 4**: Git repository sync
