# Project: Google Calendar Integrated Aesthetic Salon LP & Reservation System

## Architecture
- **Static Frontend**: Hosted on GitHub Pages (`https://tadaodev.github.io/sales_lp/samples/aesthetic/`), zero hosting cost. Pure HTML5, Modern CSS (Glassmorphism, 3-layer tokens), Vanilla JavaScript (ES6+, zero heavy external dependencies).
- **Serverless Backend (GAS)**: Google Apps Script Web App (`gas/Code.gs`) providing REST endpoints (`doGet`, `doPost`).
  - Google Calendar event creation & real-time busy slot check.
  - Google Spreadsheet automated ledger (`予約台帳`).
  - Automated customer & salon confirmation emails (GmailApp).
- **Centralized Configuration**: `samples/aesthetic/js/config.js` (`window.SALON_CONFIG`) defining GAS URL, business hours, weekly closed days, 4 time slots (10:00, 13:00, 16:00, 18:30), salon metadata, and LINE ID.
- **Offline / Standalone Fallback**: Deterministic slot simulation engine providing realistic availability (◯, △, ✕, 休) and seamless mock booking without breaking user experience when GAS URL is unset or offline.
- **Post-Booking Retention & No-Show Prevention**:
  - Auto-generated reservation ID (`LUM-YYYYMMDD-XXXX`).
  - 1-click Google Calendar Web registration URL.
  - Apple Calendar / Outlook RFC 5545 `.ics` file download (Blob / Data URI with 2h alarm).
  - 1-tap LINE Official Account deep link with pre-filled booking confirmation message.
- **Automated Test Infrastructure**: 4-Tier Python test runner (`tests/run_all_tests.py`), zero third-party dependencies, validating DOM, links, interactive UI, GAS schemas, fallback calculations, and deployment integrity.

---

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | 14-Day Availability Calendar UI | Responsive calendar table in `#action` showing 14 days × 4 slots (10:00, 13:00, 16:00, 18:30) with ◯, △, ✕, 休 | M2 | ORIGINAL_REQUEST §R1 |
| 2 | Slot Tap-to-Form Auto-Fill | Clicking ◯ or △ slot auto-populates datetime into booking form and scrolls smoothly to form | M2 | ORIGINAL_REQUEST §R1 |
| 3 | GAS Backend Script (`gas/Code.gs`) | `doGet` availability query + `doPost` booking handler (Calendar event, Spreadsheet row, Email notification) | M1 | ORIGINAL_REQUEST §R2 |
| 4 | GAS 3-Minute Setup Guide (`gas/README.md`) | Non-technical step-by-step setup guide with copy-paste instructions for salon owners | M1 | ORIGINAL_REQUEST §R2 |
| 5 | Centralized Config (`config.js`) | Salon config (GAS endpoint, business hours, slots, closed days, LINE ID) in `samples/aesthetic/js/config.js` | M1 | ORIGINAL_REQUEST §R2 |
| 6 | Thank-You View & Reservation ID | Animated thank-you screen replacing form on submission with formatted ID (`LUM-YYYYMMDD-XXXX`) | M3 | ORIGINAL_REQUEST §R3 |
| 7 | Google Calendar & .ics Export | 1-click web calendar add and RFC 5545 `.ics` dynamic Blob download with alarm | M3 | ORIGINAL_REQUEST §R3 |
| 8 | 1-Tap LINE Official Booking Chat | Pre-filled booking summary for LINE Official Account to prevent cancellations | M3 | ORIGINAL_REQUEST §R3 |
| 9 | Dynamic Simulation Fallback | Deterministic offline calendar calculation and mock reservation fallback | M3 | ORIGINAL_REQUEST §R3 |
| 10 | Automated Test Suite Update | Python test suite verifying calendar grid, slots, tap-fill, GAS payloads, .ics, and fallback | M4 | ORIGINAL_REQUEST §R4 |
| 11 | 100% Pass Verification & Git Push | Run all tests (100% PASS), commit, and push to `https://github.com/tadaodev/sales_lp.git` (`main`) | M5 | ORIGINAL_REQUEST §R4 |

---

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | GAS Backend & Central Config | `gas/Code.gs`, `gas/README.md`, `samples/aesthetic/js/config.js` | none | DONE |
| M2 | 14-Day Real-Time Calendar UI | `samples/aesthetic/index.html`, `samples/aesthetic/css/aesthetic.css`, `samples/aesthetic/js/aesthetic.js` | M1 | DONE |
| M3 | Thank-You View, ICS, LINE & Fallback | `samples/aesthetic/index.html`, `samples/aesthetic/js/aesthetic.js`, `samples/aesthetic/css/aesthetic.css` | M2 | DONE |
| M4 | Comprehensive Test Suite & Verification | `tests/run_all_tests.py`, `tests/test_interactive_ui.py`, `tests/validate_pasona_dom.py`, `tests/validate_links.py` | M1, M2, M3 | DONE |
| M5 | Production Git Commit & GitHub Push | Full test pass, git commit, push to `origin main` | M4 | DONE |

---

## Interface Contracts

### `samples/aesthetic/js/config.js` ↔ Client Modules (`aesthetic.js`)
```javascript
window.SALON_CONFIG = {
  salonName: "LUMIERA SALON",
  salonPhone: "03-1234-5678",
  salonEmail: "info@lumiera-salon.example.com",
  salonAddress: "東京都港区南青山5-X-X",
  gasWebhookUrl: "", // Paste GAS Web App URL here
  businessHours: { start: "10:00", end: "20:00" },
  closedDays: [2], // 0: Sun, 1: Mon, 2: Tue, 3: Wed, 4: Thu, 5: Fri, 6: Sat
  timeSlots: ["10:00", "13:00", "16:00", "18:30"],
  daysToShow: 14,
  lineOfficialUrl: "https://line.me/R/ti/p/@lumiera_salon",
  fallbackSimulation: true
};
```

### Client Form ↔ GAS Web App Protocol (`gas/Code.gs`)
- **GET Request**: `GAS_URL?action=getAvailability&days=14&startDate=YYYY-MM-DD`
  - Response (JSON): `{ status: "success", availability: { "2026-08-21": { "10:00": "available", "13:00": "limited", "16:00": "full", "18:30": "closed" }, ... } }`
- **POST Request**: `POST GAS_URL` (with `Content-Type: text/plain;charset=utf-8` to bypass CORS preflight)
  - Payload: `{ action: "createBooking", name: "...", phone: "...", email: "...", plan: "...", date: "2026-08-22", time: "13:00", notes: "...", reservationId: "LUM-20260822-1234" }`
  - Response (JSON): `{ status: "success", reservationId: "LUM-20260822-1234", message: "予約が完了しました。" }`

---

## Code Layout & Write Boundaries
- **Milestone 1**: `gas/Code.gs`, `gas/README.md`, `samples/aesthetic/js/config.js`
- **Milestone 2**: `samples/aesthetic/index.html` (Calendar section inside `#action`), `samples/aesthetic/css/aesthetic.css` (Calendar styles), `samples/aesthetic/js/aesthetic.js` (Calendar logic)
- **Milestone 3**: `samples/aesthetic/index.html` (Thank-you view inside modal), `samples/aesthetic/js/aesthetic.js` (ICS, Google Cal, LINE, Fallback), `samples/aesthetic/css/aesthetic.css` (Thank-you styles)
- **Milestone 4**: `tests/run_all_tests.py`, `tests/test_interactive_ui.py`, `tests/validate_pasona_dom.py`, `tests/validate_links.py`
- **Milestone 5**: Git operations and repo synchronization
