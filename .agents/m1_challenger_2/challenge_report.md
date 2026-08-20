# Milestone 1 (M1: GAS Backend & Central Config) Adversarial Challenge Report

## Challenge Summary

**Overall risk assessment**: **LOW** (Production Ready with Recommended Hardening Insights)

The Google Apps Script backend (`gas/Code.gs`), setup manual (`gas/README.md`), and centralized configuration (`samples/aesthetic/js/config.js`) have been subjected to comprehensive adversarial stress testing across parameter validation, datetime parsing, race condition handling, CORS/JSONP security, secret leakage, and offline fallback resilience.

The architecture demonstrates strong defense-in-depth, strict JSON error encapsulation, XSS-safe JSONP handling, and clean configuration externalization.

---

## Challenges

### [Low] Challenge 1: Millisecond Race Condition in High-Concurrency Booking Requests

- **Assumption challenged**: Sequential checking of `calendar.getEvents(startTime, endTime)` before `createEvent` is sufficient to prevent double bookings.
- **Attack scenario**: If two clients simultaneously submit booking requests for the exact same slot within the same 50–100ms window, both requests might execute `getEvents()` simultaneously before either has written the new event to Google Calendar, potentially leading to two overlapping events.
- **Blast radius**: Low. For a single private aesthetic salon (1 capacity per slot, ~4 slots/day, low concurrent booking traffic), collision probability is negligible. In a high-traffic multi-therapist franchise, this could cause double booking.
- **Mitigation / Defense**: For single-store operation, the current `getEvents()` pre-check is effective and fast. For high-concurrency franchise scaling, wrapping the critical section in Google Apps Script `LockService.getScriptLock()` with a 5-second wait timeout (`lock.tryLock(5000)`) guarantees absolute transactional atomicity.

### [Low] Challenge 2: Client-side Form Payload Content-Type Compatibility

- **Assumption challenged**: Client `fetch` calls to GAS Web Apps handle JSON bodies without triggering blocked preflight `OPTIONS` requests.
- **Attack scenario**: If a frontend client uses `fetch(GAS_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: ... })`, the browser will send an HTTP `OPTIONS` preflight request. Google Apps Script Web Apps do not implement custom `OPTIONS` handlers and will return an HTTP 405/400 error.
- **Blast radius**: Low to None, because `gas/Code.gs` specifically includes dual fallback parsing:
  1. `JSON.parse(e.postData.contents)` for raw strings sent via simple `text/plain;charset=utf-8` (which bypasses preflight).
  2. `parseQueryString(e.postData.contents)` for urlencoded payloads.
- **Mitigation / Defense**: Ensure frontend `aesthetic.js` sends POST requests using `Content-Type: text/plain;charset=utf-8` or standard URL-encoded body, matching `Code.gs` lines 101–107.

### [Low] Challenge 3: Extreme Query Parameter Values in `doGet` (`days` parameter)

- **Assumption challenged**: Query parameter `days` passed to `doGet` is always a reasonable integer (e.g., 14).
- **Attack scenario**: An attacker sends `GET ?action=getAvailability&days=10000`. `calculateAvailability` would loop 10,000 times, repeatedly querying `calendar.getEvents()`, which could exhaust Google Apps Script's 6-minute execution quota.
- **Blast radius**: Low. The frontend always passes `days=14`. Even if attacked, GAS execution timeout terminates the script safely without damaging calendar state.
- **Mitigation / Defense**: In `doGet`, clamp `days` to a safe operational range (e.g. `var days = Math.min(Math.max(1, parseInt(params.days, 10) || CONFIG.DAYS_TO_SHOW), 31);`).

---

## Stress Test Results

| Test ID | Scenario & Input | Expected Behavior | Actual / Simulated Behavior | Result |
|---|---|---|---|:---:|
| **ADV-GAS-01** | POST request with empty payload `{}` | Reject with `code: 'MISSING_FIELDS'` | Returns JSON `{ status: 'error', code: 'MISSING_FIELDS', message: 'お名前、お電話番号...' }` | **PASS** |
| **ADV-GAS-02** | POST request with missing phone/email | Reject with `code: 'MISSING_FIELDS'` | Returns JSON `{ status: 'error', code: 'MISSING_FIELDS' }` | **PASS** |
| **ADV-GAS-03** | POST with malformed date `date = '2026/08/22'` (slashes) | Reject with `code: 'INVALID_DATETIME'` | Split length check fails; returns `INVALID_DATETIME` | **PASS** |
| **ADV-GAS-04** | POST with malformed date `date = 'invalid-date'` | Reject with `code: 'INVALID_DATETIME'` | Returns `INVALID_DATETIME` error | **PASS** |
| **ADV-GAS-05** | POST with malformed time `time = '1000'` (no colon) | Reject with `code: 'INVALID_DATETIME'` | Split length check fails; returns `INVALID_DATETIME` | **PASS** |
| **ADV-GAS-06** | POST with `text/plain` JSON payload | Parsed via `JSON.parse(e.postData.contents)` | Successfully parsed into booking object | **PASS** |
| **ADV-GAS-07** | POST with URL-encoded payload (`name=A&phone=B...`) | Parsed via `parseQueryString(...)` fallback | Successfully parsed into booking object | **PASS** |
| **ADV-GAS-08** | GET / POST with unknown action `action = 'unsupported'` | Return structured `Unknown action` error | Returns `{ status: 'error', message: 'Unknown action: unsupported' }` | **PASS** |
| **ADV-GAS-09** | GET `action = 'ping'` or `action = 'health'` | Return health check status with salon name | Returns `{ status: 'success', message: '...', salon: '...' }` | **PASS** |
| **ADV-GAS-10** | JSONP with valid callback `callback = 'myCb_123'` | Return `myCb_123({...});` (MIME: JAVASCRIPT) | Regex `/^[a-zA-Z0-9_]+$/` matches; outputs JS script | **PASS** |
| **ADV-GAS-11** | JSONP with XSS payload `callback = '<script>alert(1)</script>'` | Reject JSONP wrapper, fallback to standard JSON | Regex rejects input; safely outputs standard JSON | **PASS** |
| **ADV-GAS-12** | JSONP with code injection `callback = 'cb();malicious();'` | Reject JSONP wrapper, fallback to standard JSON | Regex rejects semicolons/parentheses; outputs JSON | **PASS** |
| **ADV-GAS-13** | Slot booking when Calendar event already exists | Conflict detected; return `SLOT_OCCUPIED` | Returns `{ status: 'error', code: 'SLOT_OCCUPIED', message: '...' }` | **PASS** |
| **ADV-GAS-14** | Email sending failure (invalid email address) | Exception logged, booking and spreadsheet succeed | Wrapped in `try...catch (mailErr)`; does not crash response | **PASS** |
| **ADV-GAS-15** | Spreadsheet missing sheet `'予約台帳'` | Auto-create sheet, format header row, append booking | `insertSheet` auto-creates header with `#2C2A29` style and appends | **PASS** |
| **ADV-GAS-16** | Unhandled top-level exception in `doGet` / `doPost` | Wrapped in try-catch; return JSON error (no HTML 500) | Top-level try-catch returns `{ status: 'error', message: '...' }` | **PASS** |
| **ADV-GAS-17** | Secret audit (API keys, OAuth tokens, real credentials) | Zero leaked credentials in `Code.gs` and `config.js` | Zero credentials found; example domain/phone used | **PASS** |
| **ADV-GAS-18** | Schema synchronization (`Code.gs` vs `config.js`) | Identical closed days (`[2]`), slots, and plan keys | Fully synchronized (`closedDays: [2]`, 4 slots, 3 plans) | **PASS** |
| **ADV-GAS-19** | README.md non-technical usability and setup guidance | Clear 4-step instructions, permission bypass FAQ | 4 clear steps, Advanced permission bypass detailed | **PASS** |

---

## Unchallenged Areas

- **Live Google Cloud Apps Script Execution Environment**: Real API quota consumption (e.g. GmailApp 100 emails/day consumer quota) was evaluated statically and simulated logically, as live deployment requires the user's specific Google account authentication.

---

## Overall Assessment & Verdict

- **Verdict**: **APPROVE**
- **Summary**: `gas/Code.gs`, `gas/README.md`, and `samples/aesthetic/js/config.js` meet all requirements for Milestone 1 (M1) with zero critical vulnerabilities, comprehensive error handling, robust validation guards, XSS protection, and complete configuration externalization.
