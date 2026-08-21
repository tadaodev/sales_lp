# Code Quality & Adversarial Review Report

**Target Files**:
- `samples/italian/js/config.js`
- `samples/italian/js/italian.js`
- Context: `samples/italian/index.html`, `samples/italian/css/italian.css`, `tests/test_interactive_ui.py`, `tests/run_all_tests.py`

**Reviewer**: `reviewer_italian_2` (Roles: reviewer, critic)  
**Date**: 2026-08-21  
**Verdict**: **APPROVE**

---

## 1. Executive Summary

A comprehensive quality and adversarial review was conducted on the JavaScript codebase for the Italian restaurant landing page (*TRATTORIA & PIZZERIA BELLA TAVOLA*). The implementation provides a production-grade, zero-dependency Vanilla ES6+ architecture featuring:
1. A centralized configuration module (`config.js`) exposing `window.RESTAURANT_CONFIG` and supporting CommonJS for automated test suites.
2. A 14-day 2-shift (Lunch 5 slots / Dinner 6 slots) seat availability calendar engine with deterministic pseudo-random offline fallback simulation, Tuesday closed-day enforcement, and past-hour auto-disabling.
3. Smooth slot-to-form auto-population and course preselection with viewport compensation.
4. Robust client-side validation, unique reservation ID generation (`TAV-YYYYMMDD-XXXX`), Google Calendar Web URL generation, RFC 5545 `.ics` Blob generation with a 2-hour `VALARM` reminder, and 1-tap LINE URL deep linking.
5. Zero integrity violations detected (no hardcoded test outputs, no facade stubs, no cheating).

---

## 2. Detailed Evaluation by Dimension

### A. Configuration Schema Conformance (`config.js`)
- **Global Scope**: Correctly wraps definitions in an IIFE and binds to `global.RESTAURANT_CONFIG` (`window.RESTAURANT_CONFIG` in browsers, `module.exports` in CommonJS/test runners).
- **Business Hours & Shifts**: Defines lunch (11:30–15:00, L.O. 14:30) and dinner (17:30–22:30, L.O. 21:30).
- **Closed Days**: Configured to `[2]` (Tuesday), with human-readable label `毎週火曜日（祝日の場合は翌水曜日振替休）`.
- **Time Slots**: Exactly 11 slots/day:
  - Lunch (5 slots): `["11:30", "12:00", "12:30", "13:00", "13:30"]`
  - Dinner (6 slots): `["17:30", "18:00", "18:30", "19:00", "19:30", "20:00"]`
- **Course Master**: Fully populated with 松竹梅 + Lunch + Seat-only options:
  - `bamboo` (Classico ¥6,800, 120 min, `isPopular: true`)
  - `plum` (Stagione ¥4,800, 90 min)
  - `pine` (Speciale VIP ¥9,800, 150 min)
  - `lunch_b` (Pranzo B ¥2,800, 60 min)
  - `seat_only` (席のみ ¥0, 120 min)
  - Aliases (`cena_classico`, `cena_stagione`, `cena_speciale`, `pranzo_speciale`) provided for backward compatibility.
- **Fallback Simulation**: `fallbackSimulation: true`, `simulationSeedSalt: 'bella_tavola_italian_2026'`.

### B. Calendar Engine & Availability Logic (`italian.js`)
- **14-Day Consecutive Range**: Starts from `today` and generates 14 days using local Date constructor arithmetic.
- **Tuesday Regular Holiday Handling**: Checks `closedDays.indexOf(jsWeekday) !== -1` and deterministically returns `'closed'` ('休', disabled button).
- **Past Slot Handling**: For current day (`isToday`), checks `now.getHours()` and `now.getMinutes()` against slot hours. If past, flags as `'full'` ('✕', disabled button).
- **Deterministic Simulation**: Combines date, slot time, and salt into a hash score, applying realistic weekend/dinner popularity weighting so that slot statuses (◯, △, ✕) are stably reproducible across re-renders.
- **Shift Switching**: Tab buttons (`[data-shift-tab="lunch"]` / `[data-shift-tab="dinner"]`) update `aria-selected` and immediately re-render the calendar table for the chosen shift.

### C. Form Interaction & Usability
- **Slot Selection Flow**: Clicking an available slot (`.calendar-slot-btn:not([disabled])`) updates visual selection (`.is-selected`), populates `#form-datetime`, `#form-date`, `#form-time`, `#form-shift`, clears existing error styling, smoothly scrolls to `#booking-form-section` (with 70px fixed header offset deduction), and focuses `#form-name`.
- **Course Card Selection**: Clicking `.js-select-course` auto-selects `#form-course`, switches the active shift tab (e.g. lunch tab for lunch course), and scrolls to `#availability-calendar`.
- **Form Validation**: Validates required fields, email pattern (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`), and phone pattern (`/^[0-9\-+]{10,15}$/`). Attaches input listeners for immediate error dismissal upon user correction.

### D. Post-Booking & External Integrations
- **Reservation ID**: Generates `TAV-YYYYMMDD-XXXX` where `XXXX` is a 4-character uppercase hex code (`0-9A-F`). Matches specification.
- **Google Calendar URL**: Encodes title, start/end timestamps (`YYYYMMDDTHHmmss`), details, and location using `encodeURIComponent()`. Correctly computes end time using course `durationMin`.
- **Apple / Outlook RFC 5545 (`.ics`) Blob**: Generates compliant VCALENDAR/VEVENT payload with `\r\n` line endings, unique UID, `DTSTART`, `DTEND`, `SUMMARY`, `DESCRIPTION`, and a 2-hour reminder alarm (`BEGIN:VALARM`, `TRIGGER:-PT2H`, `ACTION:DISPLAY`). Downloads seamlessly via dynamic `Blob` and temporary anchor.
- **1-Tap LINE Confirmation Link**: Deep links to `https://line.me/R/oaMessage/@bella_tavola/?...` with complete URL-encoded booking details.
- **Offline / Zero-Config Fallback**: If `gasWebhookUrl` is empty or unreachable, catches errors gracefully and executes the complete booking modal flow locally without throwing uncaught exceptions or breaking UX.

---

## 3. Adversarial Analysis & Stress-Testing

| Challenge / Attack Surface | Scenario & Edge Case | Mitigation in Code | Assessment |
|---|---|---|---|
| **Month/Year Boundary** | Booking on 8/31 -> 9/1 or 12/31 -> 1/1 | Handled natively by `new Date(y, m, d + i)` normalization. | PASS |
| **Leap Year Handling** | Feb 28 -> Feb 29 in leap years | Native Date object handles leap years without fixed 28-day assumptions. | PASS |
| **XSS / Special Chars in Name** | Multibyte names, quotes, emojis, or `<script>` tags in customer name/notes | Sanitized via DOM `textContent` assignment and `encodeURIComponent()` for URL/RFC parameters. | PASS |
| **RFC 5545 Line Endings** | Non-CRLF line breaks causing Apple Calendar parse errors | Strict `icsLines.join('\r\n')` ensures compliance with RFC 5545 §3.1. | PASS |
| **Network Failure / GAS Hang** | Slow network or GAS endpoint 500 error | Promise.race timeout (4.5s) + `try/catch` block prevents UI locking. | PASS |
| **Double Booking / Fast Clicking** | Rapid consecutive taps on different slots | State converges cleanly to the latest clicked slot (`is-selected` managed idempotently). | PASS |

---

## 4. Integrity & Anti-Cheating Attestation

- **No Hardcoded Test Facades**: Calendar slots, dates, IDs, and availability matrices are computed algorithmically from live Date objects and configuration parameters.
- **No Stubs / Empty Mocking**: All 12 subsystems are genuinely implemented in pure JavaScript with full event handling, DOM manipulation, ARIA attributes, and Blob generation.
- **Layout & Boundary Conformance**: All changes are strictly contained in `samples/italian/js/`, adhering to `PROJECT.md` milestones and write boundaries.

---

## 5. Review Verdict

**VERDICT**: **APPROVE**  
The implementation meets all technical, functional, visual, and safety requirements with high code quality and zero regressions.
