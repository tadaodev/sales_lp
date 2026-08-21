# Test & QA Master Plan & Test Suite Extension Specification for Legal Consulting LP (samples/legal/)

## 1. Observation

### 1.1 Project Structure & Existing Test Architecture
Inspection of the project root (`c:\Project\事業案\05_LP作成\`) and test suite (`tests/`) reveals the following components:

- **Master Test Runner (`tests/run_all_tests.py`)**:
  - Contains 842 lines of Python standard library code.
  - Implements a 4-Tier test architecture:
    - Tier 1: Feature Coverage (50 Test Cases across F1 to F10)
    - Tier 2: Boundary & Corner Cases (50 Test Cases across F1 to F10)
    - Tier 3: Cross-Feature Combinations (10 Test Cases: `TC-INT-01..10`)
    - Tier 4: Real-World Scenarios (5 Scenarios: `TC-APP-01..05`)
  - Currently targets Aesthetic Salon LP (`samples/aesthetic/`) and partially Italian Restaurant LP (`samples/italian/`).
- **Link & Relative Path Validator (`tests/validate_links.py`)**:
  - Implements `HTMLLinkExtractor`, `extract_css_links()`, `verify_case_sensitive_path()`, and `LinkValidator`.
  - Checks Rule-L1 (Zero root-relative `/` paths), Rule-L2 (100% file existence and disk case-sensitivity), Rule-L3 (In-page/cross-page anchor `#id` existence), Rule-L4 (Allowed URL schemes).
  - Lines 186–216 currently enforce script load order (`config.js` before `aesthetic.js` and `italian.js`), but **does not yet check `legal.js`**.
- **PASONA DOM & A11y Validator (`tests/validate_pasona_dom.py`)**:
  - Implements `DOMTreeBuilder` and `PASONADOMValidator`.
  - Validates 7 New PASONA sections (`problem`, `affinity`, `solution`, `offer`, `narrowing`, `action`, `faq`), Matsutake 3-tier pricing, Before/After comparison, Dual CTA, single `<h1>`, heading hierarchy continuity (no skipped levels), `<html lang="ja">`, `<meta name="viewport">`, `<meta name="description">`, and `<img>` `alt` attributes.
  - Lines 342–354 in `validate_all()` check `samples/aesthetic/index.html` and `samples/italian/index.html`, but **does not yet include `samples/legal/index.html`**.
- **Interactive UI, GAS & Fallback Validator (`tests/test_interactive_ui.py`)**:
  - Contains `ConfigSchemaValidator` for `SALON_CONFIG` and `ItalianConfigSchemaValidator` for `RESTAURANT_CONFIG`.
  - Implements `CalendarEngineSimulator`, `ThankYouViewValidator`, and `InteractiveUIValidator`.
  - Validates calendar DOM, reservation ID formats (`LUM-YYYYMMDD-XXXX`, `TAV-YYYYMMDD-XXXX`), RFC 5545 `.ics` payload, LINE deep links, and deterministic fallback consistency.
  - Currently **lacks `LegalConfigSchemaValidator`**, Legal 2WAY consultation mode logic, and Legal reservation ID validation (`LEG-YYYYMMDD-XXXX`).
- **Static HTTP Server Suite (`tests/test_server.py`)**:
  - Spawns a background `http.server.HTTPServer` on dynamic ports.
  - Validates Root Mode (`http://127.0.0.1:port/index.html`) and GitHub Pages Subdirectory Simulation Mode (`http://127.0.0.1:port/lp-portal-hub/...`).
  - Currently checks `index.html` and `samples/aesthetic/index.html`, but **does not yet include `samples/legal/index.html`**.

### 1.2 Original Requirements for Legal Consulting LP (`ORIGINAL_REQUEST.md` §R1–R5)
- **Brand**: LUMEN LEGAL CONSULTING（ルーメン法務総合事務所）
- **Copywriting / Framework**:
  - 新PASONA: Problem (契約・労務・未払いリスク) / Affinity (代表パートナー・寄り添いストーリー) / Solution (予防法務×スピード解決の3大強み) / Offer (松竹梅顧問・スポット料金) / Narrowing (毎月先着10社無料相談) / Action (14日間2WAY相談予約カレンダー & LINE即時相談) / FAQ (士業Q&A).
- **Design System & UI**:
  - Luxury Glassmorphism UI: Deep Navy (`#0A192F` / `#0F172A`), Champagne Gold (`#D4AF37` / `#C5A059` / `#E5C158`), frosted glass cards (`backdrop-filter: blur()`), glowing accents.
- **Image Assets (`samples/legal/assets/images/`)**:
  1. `hero_consultation.jpg`: エグゼクティブルームでの親身な法務相談
  2. `partner_portrait.jpg`: 誠実で信頼感あふれる代表パートナーポートレート
  3. `legal_contract_review.jpg`: 契約書・重要書類を緻密にチェックするプロの手元
  4. `boardroom_meeting.jpg`: カンファレンスルームでの戦略的コンサルティング風景
- **2WAY Booking Calendar & Modal**:
  - `samples/legal/js/config.js` (`LEGAL_CONFIG`): 4 consultation slots (10:00, 13:00, 15:30, 18:00), closed on weekends (`closedDays: [0, 6]`), 14-day calculation.
  - 2WAY Mode: Zoom Online Consultation vs Tokyo Marunouchi Office In-Person Consultation.
  - Tap-to-form auto-fill, reservation ID generator (`LEG-YYYYMMDD-XXXX`), Google Calendar URL with dynamic location, RFC 5545 `.ics` with 2-hour reminder, LINE deep link with pre-filled consultation parameters, and deterministic offline fallback.
- **Portal Navigation**:
  - Top Portal (`index.html`) LIVE DEMO card integration under "士業・法務" filter and bidirectional navigation (`../../index.html` ⇔ `samples/legal/index.html`).

---

## 2. Logic Chain

1. **Given** that GitHub Pages enforces case-sensitive static hosting and project subpath routing (`/repo-name/`), **any** root-relative link (`/`), casing mismatch, or missing file reference will immediately result in a production HTTP 404 error.
2. **Therefore**, `tests/validate_links.py` must automatically scan all HTML and CSS files in `samples/legal/`, verify all 4 AI image assets on disk, validate bidirectional links between `index.html` and `samples/legal/index.html`, and ensure `config.js` is loaded before `legal.js`.
3. **Given** that high-converting B2B legal landing pages require rigorous psychological flow (Problem -> Affinity -> Solution -> Offer -> Narrowing Down -> Action -> FAQ) and strict accessibility for corporate decision-makers, **therefore**, `tests/validate_pasona_dom.py` must be extended to validate all 7 PASONA sections in `samples/legal/index.html`, the Matsutake 3-tier pricing model, single `<h1>` hierarchy, responsive `<meta name="viewport">`, `<meta name="description">`, and `alt` attributes on all legal imagery.
4. **Given** that the Legal LP introduces a specialized 2WAY consultation booking engine (Zoom Online vs In-Person), 4 corporate consultation time slots (10:00/13:00/15:30/18:00), weekend holiday closures (`closedDays: [0, 6]`), and multi-channel post-booking integrations (Google Calendar, Apple .ics with 60min duration, and LINE instant consultation), **therefore**, `tests/test_interactive_ui.py` must introduce `LegalConfigSchemaValidator`, `LegalCalendarEngineSimulator`, and extended `ThankYouViewValidator` methods.
5. **Given** that the test suite must maintain zero external dependencies and run synchronously with 100% pass guarantee across all modules, **therefore**, `tests/run_all_tests.py` and `tests/test_server.py` must incorporate comprehensive Tier 1 to Tier 4 test cases for the Legal LP.

---

## 3. Comprehensive Test Specification & Test Cases for Legal LP

### 3.1 Tier 1: Feature Coverage (50 Test Cases for Legal LP)

| Test ID | Feature Category | Target Function / File | Verification Criteria |
|:---|:---|:---|:---|
| **TC-LEG-CAL-01** | F1: Calendar Grid | `LegalCalendarEngine` | Generates consecutive 14-day date sequence starting from base date |
| **TC-LEG-CAL-02** | F1: Calendar Grid | `LEGAL_CONFIG.timeSlots` | Defines 4 consultation time slots: `["10:00", "13:00", "15:30", "18:00"]` |
| **TC-LEG-CAL-03** | F1: Calendar Grid | `samples/legal/index.html` | Schedule/Calendar DOM container present inside `#action` or `.booking-section` |
| **TC-LEG-CAL-04** | F1: Calendar Grid | DOM & Grid Structure | Capacity for 56 slots (14 days × 4 slots) with weekday headers |
| **TC-LEG-CAL-05** | F1: Calendar Grid | `legal.js` / CSS | Weekday header formatting (Mon–Fri) and weekend styling (Sat/Sun) |
| **TC-LEG-SLT-01** | F2: Slot Status | Status Engine / CSS | Available status `◯` mapped to `.is-available` class |
| **TC-LEG-SLT-02** | F2: Slot Status | Status Engine / CSS | Limited status `△` (1 slot left) mapped to `.is-limited` class |
| **TC-LEG-SLT-03** | F2: Slot Status | Status Engine / CSS | Fully booked status `✕` mapped to `.is-full` class |
| **TC-LEG-SLT-04** | F2: Slot Status | Status Engine / CSS | Closed status `休` mapped to `.is-closed` class |
| **TC-LEG-SLT-05** | F2: Slot Status | `LEGAL_CONFIG.closedDays` | Automatic closure (`休`) for Saturday (`6`) and Sunday (`0`) |
| **TC-LEG-2WY-01** | F3: 2WAY Consultation | `samples/legal/index.html` | 2WAY consultation mode toggle/radio (Zoom Online vs In-Person) |
| **TC-LEG-2WY-02** | F3: 2WAY Consultation | `legal.js` | Switching consultation mode dynamically updates form hidden input |
| **TC-LEG-2WY-03** | F3: 2WAY Consultation | `legal.js` | Zoom Online mode sets meeting location to "Zoom Online (URL auto-issued)" |
| **TC-LEG-2WY-04** | F3: 2WAY Consultation | `legal.js` | In-Person mode sets meeting location to "東京・丸の内オフィス" |
| **TC-LEG-2WY-05** | F3: 2WAY Consultation | `legal.js` | Mode selection is preserved during calendar slot tap and modal launch |
| **TC-LEG-TAP-01** | F4: Tap-to-Form | `legal.js` | Click event listener on selectable calendar slot tiles |
| **TC-LEG-TAP-02** | F4: Tap-to-Form | `#form-datetime` / Form | Auto-populates selected date and time into consultation booking form |
| **TC-LEG-TAP-03** | F4: Tap-to-Form | `legal.js` | Smooth scrolls or triggers consultation booking modal on slot click |
| **TC-LEG-TAP-04** | F4: Tap-to-Form | `legal.js` / CSS | Adds `.is-selected` active highlight class to chosen slot tile |
| **TC-LEG-TAP-05** | F4: Tap-to-Form | `legal.js` / CSS | Prevents clicking / disables `✕` (full) and `休` (weekend/closed) slots |
| **TC-LEG-GAS-01** | F5: GAS Backend | `gas/Code.gs` | Valid JavaScript syntax and doGet/doPost availability handlers |
| **TC-LEG-GAS-02** | F5: GAS Backend | `gas/Code.gs` | Availability query endpoint supports legal consultation slot schema |
| **TC-LEG-GAS-03** | F5: GAS Backend | `gas/Code.gs` | Booking handler writes company name, person, email, mode, plan, datetime |
| **TC-LEG-GAS-04** | F5: GAS Backend | `gas/Code.gs` | Automated confirmation email template for corporate legal consultation |
| **TC-LEG-GAS-05** | F5: GAS Backend | `gas/README.md` | Clear 3-minute setup instructions for Google Calendar + Spreadsheet ledger |
| **TC-LEG-CFG-01** | F6: Central Config | `samples/legal/js/config.js` | `window.LEGAL_CONFIG` object existence and core properties |
| **TC-LEG-CFG-02** | F6: Central Config | `config.js` | `firmName`, `firmPhone`, `firmAddress`, and `firmEmail` properties |
| **TC-LEG-CFG-03** | F6: Central Config | `config.js` | `businessHours` (10:00–18:00) and `timeSlots` (4 slots) schema |
| **TC-LEG-CFG-04** | F6: Central Config | `config.js` | `gasWebhookUrl`, `lineOfficialUrl`, and `fallbackSimulation` flags |
| **TC-LEG-CFG-05** | F6: Central Config | `samples/legal/index.html` | Script load order: `config.js` is loaded BEFORE `legal.js` |
| **TC-LEG-TNK-01** | F7: Thank-You View | `samples/legal/index.html` | Modal success state / thank-you view DOM container markup |
| **TC-LEG-TNK-02** | F7: Thank-You View | ID Generator Logic | Reservation ID matches regex `^(?:LEG\|LUM)-\d{8}-[A-Z0-9]{4}$` |
| **TC-LEG-TNK-03** | F7: Thank-You View | `legal.js` / DOM | Summary displays company name, contact person, mode, plan, and datetime |
| **TC-LEG-TNK-04** | F7: Thank-You View | `legal.js` | Form reset and view transition to success state upon submission |
| **TC-LEG-TNK-05** | F7: Thank-You View | `samples/legal/index.html` | "閉じる" (Close/Return) button restores standard LP state |
| **TC-LEG-ICS-01** | F8: Calendar Sync | URL Generator | Google Calendar 1-click URL with corporate title, mode location, 60m span |
| **TC-LEG-ICS-02** | F8: Calendar Sync | `.ics` Generator | RFC 5545 VCALENDAR/VEVENT compliance with UID, DTSTAMP, DTSTART, DTEND |
| **TC-LEG-ICS-03** | F8: Calendar Sync | `.ics` Generator | DTSTART and DTEND formatted as valid `YYYYMMDDTHHMMSS` (60m duration) |
| **TC-LEG-ICS-04** | F8: Calendar Sync | `.ics` Generator | RFC 5545 `VALARM` 2-hour reminder (`TRIGGER:-PT2H`) included |
| **TC-LEG-ICS-05** | F8: Calendar Sync | `legal.js` | Client-side `.ics` dynamic Blob/Data URI download trigger |
| **TC-LEG-LIN-01** | F9: LINE Integration | URL Generator | LINE Official deep link structure (`https://line.me/R/oaMessage/...`) |
| **TC-LEG-LIN-02** | F9: LINE Integration | URL Generator | Safe URL percent-encoding for Japanese consultation message |
| **TC-LEG-LIN-03** | F9: LINE Integration | URL Generator | Pre-filled text includes Res ID, Company Name, 2WAY Mode, Date/Time |
| **TC-LEG-LIN-04** | F9: LINE Integration | `samples/legal/index.html` | Dual CTA: LINE consultation buttons in `#action` and mobile sticky bar |
| **TC-LEG-LIN-05** | F9: LINE Integration | `legal.js` / DOM | Thank-you screen includes 1-tap LINE confirmation button |
| **TC-LEG-FBK-01** | F10: Fallback Mode | `legal.js` / `config.js` | Deterministic simulation activated when `gasWebhookUrl` is blank |
| **TC-LEG-FBK-02** | F10: Fallback Mode | `LegalCalendarEngine` | Deterministic pseudo-random seed reproduces identical slot availability |
| **TC-LEG-FBK-03** | F10: Fallback Mode | `legal.js` | Seamless local booking simulation completion without server crash |
| **TC-LEG-FBK-04** | F10: Fallback Mode | `LegalCalendarEngine` | Balanced slot distribution (◯, △, ✕, 休) across 14-day schedule |
| **TC-LEG-FBK-05** | F10: Fallback Mode | `config.js` | `fallbackSimulation: true` flag cleanly controls mode |

---

### 3.2 Tier 2: Boundary & Corner Cases (20 Key Boundary Cases for Legal LP)

1. **TC-LEG-B01 (Month/Year Date Rollover)**:
   - Calendar date calculation cleanly crosses month ends (e.g. Aug 31 -> Sep 1) and year ends (Dec 31 -> Jan 1) with correct day-of-week indexing.
2. **TC-LEG-B02 (Weekend Holiday Multi-Day Closure)**:
   - `closedDays: [0, 6]` correctly closes both Saturday and Sunday for all 4 slots across the entire 14-day span.
3. **TC-LEG-B03 (Past Hour Slot Protection)**:
   - For consultations on the current day ("今日"), past time slots (e.g. 10:00 when accessing at 14:00) are automatically marked disabled/unavailable.
4. **TC-LEG-B04 (30-Minute Non-Integer Slot Time Calculation)**:
   - 15:30 slot calculation adds 60-minute consultation duration to produce exact DTEND of `16:30`.
5. **TC-LEG-B05 (Rapid Consecutive Slot Switching)**:
   - Rapidly clicking different slot tiles idempotently updates `#form-datetime` without state corruption or duplicate event triggers.
6. **TC-LEG-B06 (Full & Closed Slot Click Immunity)**:
   - Clicking `✕` or `休` tiles does not overwrite or corrupt an already selected valid datetime value.
7. **TC-LEG-B07 (Corporate Name & Legal Inquiry XSS Sanitization)**:
   - Special characters (`<script>`, `"`, `'`, `&`, `株式会社`) in company name and inquiry notes are sanitized safely.
8. **TC-LEG-B08 (Corporate Email Format Validation)**:
   - Form strictly validates standard corporate email syntax before allowing booking submission.
9. **TC-LEG-B09 (Reservation ID Collision-Free Guarantee)**:
   - 1,000 sequentially generated reservation IDs (`LEG-YYYYMMDD-XXXX`) have zero duplicate collisions.
10. **TC-LEG-B10 (2WAY Mode Toggle with Pre-Selected Slot)**:
    - Toggling between Zoom and In-Person after selecting a calendar slot retains the selected datetime while updating the consultation type.
11. **TC-LEG-B11 (RFC 5545 Multi-Line & Special Character Escaping)**:
    - Escapes semicolons (`;`), commas (`,`), and backslashes (`\`) and converts newlines to literal `\n` in `.ics` description.
12. **TC-LEG-B12 (LINE URL Length & Japanese Roundtrip)**:
    - Pre-filled message with long corporate inquiry (< 2,000 chars) maintains valid URL percent-encoding and roundtrip decode fidelity.
13. **TC-LEG-B13 (Offline Network Timeout Simulation)**:
    - 5-second simulated network timeout during GAS submission cleanly fails over to local thank-you view without unhandled exception.
14. **TC-LEG-B14 (HTTP 500 & Malformed JSON Response Guard)**:
    - Simulating server errors (500 or malformed JSON) in `fetch` is safely caught, executing graceful fallback.
15. **TC-LEG-B15 (100-Run Fallback Determinism)**:
    - Calling deterministic status calculation 100 consecutive times on the same date and slot produces the exact same status output.
16. **TC-LEG-B16 (Mobile 375px Horizontal Scroll Overflow Zero)**:
    - Zero horizontal scrolling on 375px mobile viewport (`overflow-x: hidden` / responsive containers).
17. **TC-LEG-B17 (Desktop 1920px Max-Width Centering)**:
    - Container width constrained to `max-width: 1200px` (or `1280px`) with clean margin centering on ultra-wide screens.
18. **TC-LEG-B18 (NoScript Copy & Pricing Accessibility)**:
    - With JavaScript disabled, all 7 PASONA sections, copy, lawyer profiles, and 3-tier pricing tables remain 100% visible and readable.
19. **TC-LEG-B19 (Deep Anchor `#action` with Query Params)**:
    - Loading URL with `#action?plan=take&mode=online` safely routes to action section with plan and mode preselected.
20. **TC-LEG-B20 (Modal Focus Trapping & ESC Key Dismissal)**:
    - Opening consultation modal traps keyboard focus inside dialog; pressing ESC cleanly closes modal.

---

### 3.3 Tier 3: Cross-Feature Combinations (5 Combinations for Legal LP)

- **TC-LEG-INT-01 (Pricing Card Tap -> Plan Preselect -> Modal Open)**:
  - Clicking "このプランで相談する" on 竹スタンダード顧問 card opens modal with 竹プラン pre-selected.
- **TC-LEG-INT-02 (2WAY Mode Selection -> Calendar Slot Tap -> Form Datetime & Mode Synchronized)**:
  - Selecting "Zoomオンライン相談" and tapping "8月25日 13:00 ◯" synchronizes both mode and datetime into the consultation booking form.
- **TC-LEG-INT-03 (Validation Pass -> Transition to Thank-You View -> Res ID Display)**:
  - Completing all required fields (Company, Name, Email, Tel, Mode, DateTime) transitions form to success view and displays formatted reservation ID `LEG-YYYYMMDD-XXXX`.
- **TC-LEG-INT-04 (Thank-You View -> Dynamic Google Calendar URL + .ics Download + LINE Chat)**:
  - Generates synchronized Google Calendar URL (with Zoom/Office location), dynamic `.ics` file download, and LINE deep link with matching reservation details.
- **TC-LEG-INT-05 (Portal Hub Category Filter "士業・法務" -> Legal LP Navigation -> Return Loop)**:
  - Clicking "士業・法務" filter on top portal displays LUMEN LEGAL card; clicking LIVE DEMO navigates to `samples/legal/index.html`; clicking "ポータルへ戻る" returns to `../../index.html`.

---

### 3.4 Tier 4: Real-World Scenarios (3 Scenarios for Legal LP)

- **TC-LEG-APP-01 (Startup CEO Urgently Booking Zoom Contract Review on Mobile 375px)**:
  - Mobile user accesses Legal LP -> reads Problem & Solution -> taps Zoom Online Consultation mode -> picks tomorrow 15:30 slot -> enters startup details -> submits booking -> adds to Google Calendar -> launches LINE consultation for quick question.
- **TC-LEG-APP-02 (HR Director Booking In-Person Labor Dispute Consultation for Matsu Plan)**:
  - Desktop user reviews Matsu VIP plan -> clicks "無料相談を予約する" -> selects In-Person Marunouchi Office mode -> picks next Tuesday 10:00 slot -> enters corporate inquiry -> submits -> downloads `.ics` file for Outlook/Apple Calendar.
- **TC-LEG-APP-03 (Legal Office Administrator Verifying Zero-Cost GAS Automated Ledger & 404-Free Subdirectory Hosting)**:
  - Administrator configures `config.js` -> deploys `gas/Code.gs` -> runs `tests/test_server.py` and `tests/validate_links.py` -> verifies 100% PASS with 0 404s under `/lp-portal-hub/samples/legal/index.html`.

---

### 3.5 Image Assets Verification Specification

| Image Path | Expected Content | Validation Checks |
|:---|:---|:---|
| `samples/legal/assets/images/hero_consultation.jpg` | 親身に相談を受ける知的な日本人法務コンサルタント・弁護士 | File exists on disk, byte size > 10KB, referenced in `index.html` with valid `alt` attribute |
| `samples/legal/assets/images/partner_portrait.jpg` | 誠実で信頼感あふれる代表パートナーポートレート | File exists on disk, byte size > 10KB, referenced in `index.html` with valid `alt` attribute |
| `samples/legal/assets/images/legal_contract_review.jpg` | 契約書・重要書類を緻密にチェックするプロの手元 | File exists on disk, byte size > 10KB, referenced in `index.html` with valid `alt` attribute |
| `samples/legal/assets/images/boardroom_meeting.jpg` | カンファレンスルームでの戦略的コンサルティング風景 | File exists on disk, byte size > 10KB, referenced in `index.html` with valid `alt` attribute |

---

## 4. Test Code Extension Blueprint

### 4.1 Modifications to `tests/validate_links.py`
In `validate()` method (around line 202):
```python
# Check script order in samples/legal/index.html (config.js before legal.js)
if html_file.name == "index.html" and "legal" in str(html_file):
    has_config = any("config.js" in s for s in scripts)
    has_legal = any("legal.js" in s for s in scripts)
    if has_config and has_legal:
        config_idx = next(i for i, s in enumerate(scripts) if "config.js" in s)
        legal_idx = next(i for i, s in enumerate(scripts) if "legal.js" in s)
        if config_idx > legal_idx:
            self.violations.append({
                "rule": "SCRIPT_LOAD_ORDER",
                "file": str(html_file.relative_to(self.root_dir)),
                "line": 1,
                "target": "config.js",
                "message": "config.js must be loaded BEFORE legal.js in HTML."
            })
```

### 4.2 Modifications to `tests/validate_pasona_dom.py`
In `validate_all()` method (around line 355):
```python
legal_html = self.project_root / "samples" / "legal" / "index.html"
if legal_html.exists():
    v_seo = self.validate_semantics_and_seo(legal_html)
    v_pasona = self.validate_file_pasona(legal_html)
    self.violations.extend(v_seo)
    self.violations.extend(v_pasona)
else:
    self.violations.append({
        "rule": "LEGAL_LP_MISSING",
        "file": "samples/legal/index.html",
        "message": "Legal Consulting LP samples/legal/index.html not yet found on disk."
    })
```

### 4.3 Modifications to `tests/test_interactive_ui.py`
Add `LegalConfigSchemaValidator`:
```python
class LegalConfigSchemaValidator:
    """Validates samples/legal/js/config.js structure and schema."""
    def __init__(self, project_root: Path = PROJECT_ROOT):
        self.config_path = project_root / "samples" / "legal" / "js" / "config.js"

    def parse_config(self) -> Tuple[bool, Dict[str, Any], str]:
        if not self.config_path.exists():
            return False, {}, f"Config file not found at {self.config_path}"
        content = self.config_path.read_text(encoding="utf-8", errors="replace")
        if "LEGAL_CONFIG" not in content and "CONSULTING_CONFIG" not in content:
            return False, {}, "window.LEGAL_CONFIG object definition not found."
        # Parse fields: firmName, firmPhone, closedDays, timeSlots, consultationTypes, plans
        # ...
```
Extend `ThankYouViewValidator.validate_reservation_id`:
```python
@staticmethod
def validate_reservation_id(res_id: str, prefix: str = "LUM|TAV|LEG") -> bool:
    """Validates format (LUM|TAV|LEG)-YYYYMMDD-XXXX."""
    pattern = rf'^(?:{prefix})-\d{{8}}-[A-Z0-9]{{4}}$'
    return bool(re.match(pattern, res_id))
```

### 4.4 Modifications to `tests/test_server.py`
Add Legal LP endpoint checks in `run_server_tests()`:
- `SRV-ROOT-03`: `GET /samples/legal/index.html` returns 200 OK with `text/html`.
- `SRV-SUBDIR-03`: `GET /{SUBDIR_NAME}/samples/legal/index.html` returns 200 OK.
- `SRV-MIME-02`: `GET /samples/legal/css/legal.css` returns 200 OK with `text/css`.

---

## 5. Caveats
- `samples/legal/` files are currently being constructed by the implementation agent (`spec_miner_legal_1` / developer). This test plan defines all validation criteria in advance so tests can be run as soon as implementation completes.
- No other caveats.

---

## 6. Conclusion
The test and QA strategy for the Legal Consulting LP is fully formulated across all 5 required dimensions:
1. Relative links & zero 404s (Rule-L1, Rule-L2, case-sensitivity, script load order).
2. 新PASONA DOM elements, Matsutake pricing, SEO (single H1, lang="ja", description), and WCAG A11y.
3. Responsive design across 375px mobile (sticky consultation bar, touch targets ≥ 44px) to 1920px desktop.
4. 2WAY Consultation Booking Calendar (Zoom vs In-Person), 14-day calculation (4 slots: 10:00/13:00/15:30/18:00), weekend closures, tap-to-form auto-fill, reservation ID generator (`LEG-YYYYMMDD-XXXX`), Google Calendar URL with dynamic location, RFC 5545 `.ics` with 2h alarm, LINE consultation deep link, and deterministic fallback simulation.
5. Verification of all 4 AI photographic assets (`hero_consultation.jpg`, `partner_portrait.jpg`, `legal_contract_review.jpg`, `boardroom_meeting.jpg`).

---

## 7. Verification Method
1. **Link & 404 Validation**:
   ```powershell
   [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; $env:PYTHONUTF8=1; python tests/validate_links.py
   ```
2. **PASONA DOM, Heading & A11y Validation**:
   ```powershell
   [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; $env:PYTHONUTF8=1; python tests/validate_pasona_dom.py
   ```
3. **Interactive UI, Config & Calendar Validation**:
   ```powershell
   [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; $env:PYTHONUTF8=1; python tests/test_interactive_ui.py
   ```
4. **Static Server & Subdirectory Validation**:
   ```powershell
   [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; $env:PYTHONUTF8=1; python tests/test_server.py
   ```
5. **Master 4-Tier Test Runner**:
   ```powershell
   [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; $env:PYTHONUTF8=1; python tests/run_all_tests.py
   ```
- **Invalidation Condition**: Exit code > 0 or any reported link, DOM, calendar, or image asset failure.
