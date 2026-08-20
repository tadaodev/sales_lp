# E2E Test Suite Ready: LP Portal Hub & Aesthetic Salon LP (4-Tier Suite)

## 1. Test Architecture Overview
The automated 4-tier test suite is implemented using pure Python standard library (`http.server`, `urllib.request`, `html.parser`, `re`, `json`, `datetime`, `socket`, `threading`, `pathlib`). It requires **zero external heavy dependencies** or build steps, guaranteeing 100% static hosting compatibility on GitHub Pages (root and `/repo/` subdirectories).

```
tests/
├── test_server.py           # Local Static HTTP Server Runner (Root & Subdirectory simulation)
├── validate_links.py        # Strict Relative Link & Asset Validator (Case-sensitive, 404-free)
├── validate_pasona_dom.py   # New PASONA DOM & Semantic Heading Validator (SEO / A11y / Calendar)
├── test_interactive_ui.py   # Interactive UI, GAS Backend, Calendar Logic, ICS & LINE Validator
└── run_all_tests.py         # Integrated 4-Tier Master Test Runner (115 Test Cases)
```

---

## 2. Test Execution Commands

### Integrated 4-Tier Master Suite Runner (115 Test Cases)
```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8;
$env:PYTHONUTF8=1;
python tests/run_all_tests.py
```

### Individual Test Modules
```powershell
# 1. HTTP Server & Subdirectory Simulation
python tests/test_server.py

# 2. Strict Relative Link & 404 Validation
python tests/validate_links.py

# 3. PASONA DOM & Heading Hierarchy Validation
python tests/validate_pasona_dom.py

# 4. Interactive UI, GAS, Calendar & Fallback Validation
python tests/test_interactive_ui.py
```

---

## 3. Test Tier Inventory & Full Coverage Matrix (115 Test Cases)

### Tier 1: Feature Coverage (50 Test Cases)
| ID | Category | Test Name | Target Layer / File | Verification Criteria |
|:---|:---------|:----------|:--------------------|:----------------------|
| **TC-CAL-01** | F1: Calendar | 14-Day Date Range Generation | `CalendarEngine` | Generates consecutive 14-day date sequence |
| **TC-CAL-02** | F1: Calendar | 4 Time Slots Definition | `config.js` | Defines 10:00, 13:00, 16:00, 18:30 slots |
| **TC-CAL-03** | F1: Calendar | Calendar DOM Container | `samples/aesthetic/index.html` | Schedule container presence inside `#action` |
| **TC-CAL-04** | F1: Calendar | 56 Slot Elements Capacity | DOM & Grid Structure | 14 days × 4 slots = 56 slots structure |
| **TC-CAL-05** | F1: Calendar | Weekday Headers & Weekend Styles | `aesthetic.js` / CSS | Weekday headers and weekend formatting |
| **TC-SLT-01** | F2: Slots | Available Status (◯ / is-available) | Status Engine / CSS | Symbol `◯` and `.is-available` class |
| **TC-SLT-02** | F2: Slots | Limited Status (△ / is-limited) | Status Engine / CSS | Symbol `△` and `.is-limited` class |
| **TC-SLT-03** | F2: Slots | Full Status (✕ / is-full) | Status Engine / CSS | Symbol `✕` and `.is-full` class |
| **TC-SLT-04** | F2: Slots | Closed Status (休 / is-closed) | Status Engine / CSS | Symbol `休` and `.is-closed` class |
| **TC-SLT-05** | F2: Slots | Regular Closed Day (Tuesday) | `config.js` (`closedDays: [2]`) | Automatic closure on weekly Tuesday |
| **TC-TAP-01** | F3: Tap-Fill | Slot Tap Event Listener | `aesthetic.js` | Click event listener on slot elements |
| **TC-TAP-02** | F3: Tap-Fill | `#form-datetime` Auto-Fill | `index.html` / `aesthetic.js` | Selected date/time auto-populated in form |
| **TC-TAP-03** | F3: Tap-Fill | Smooth Scroll / Modal Trigger | `aesthetic.js` | Scrolls or opens modal upon slot selection |
| **TC-TAP-04** | F3: Tap-Fill | Active Slot Highlight (`.is-selected`) | `aesthetic.js` / CSS | Visual highlight on selected slot |
| **TC-TAP-05** | F3: Tap-Fill | Disabled State for ✕ and 休 | `aesthetic.js` / CSS | Prevents selection of full or closed slots |
| **TC-GAS-01** | F4: GAS | `gas/Code.gs` Existence & Syntax | `gas/Code.gs` | Valid JavaScript syntax & core functions |
| **TC-GAS-02** | F4: GAS | `doGet(e)` Availability Endpoint | `gas/Code.gs` | REST GET availability query handler |
| **TC-GAS-03** | F4: GAS | `doPost(e)` Booking Handler | `gas/Code.gs` | Calendar event, Sheet row, Email confirmation |
| **TC-GAS-04** | F4: GAS | Booking JSON Payload Schema | `gas/Code.gs` | Validates name, email, date, time payload fields |
| **TC-GAS-05** | F4: GAS | `gas/README.md` 3-Min Setup Guide | `gas/README.md` | Clear setup steps for spreadsheet, deploy, URL |
| **TC-CFG-01** | F5: Config | `config.js` & `SALON_CONFIG` Object | `samples/aesthetic/js/config.js` | Global salon configuration definition |
| **TC-CFG-02** | F5: Config | `businessHours` & `timeSlots` Schema | `config.js` | Valid business hours and 4 time slot strings |
| **TC-CFG-03** | F5: Config | `closedDays` Array Definition | `config.js` | Array of day indices (e.g. `[2]` for Tuesday) |
| **TC-CFG-04** | F5: Config | `gasWebhookUrl` & `lineOfficialUrl` | `config.js` | Endpoint and LINE URL properties |
| **TC-CFG-05** | F5: Config | Script Load Order in HTML | `samples/aesthetic/index.html` | `config.js` loaded before `aesthetic.js` |
| **TC-TNK-01** | F6: Thank-You | Thank-You View DOM Container | `samples/aesthetic/index.html` | Modal success state / thank-you view markup |
| **TC-TNK-02** | F6: Thank-You | Reservation ID Format | Generator Logic | Matches `^LUM-\d{8}-[A-Z0-9]{4}$` regex |
| **TC-TNK-03** | F6: Thank-You | Booking Summary Display | `aesthetic.js` / DOM | Shows customer name, plan, and selected time |
| **TC-TNK-04** | F6: Thank-You | Form Reset & View Transition | `aesthetic.js` | Clears form inputs and switches view |
| **TC-TNK-05** | F6: Thank-You | Thank-You Close / Return Button | `index.html` / `aesthetic.js` | Restores standard LP state on close |
| **TC-ICS-01** | F7: Calendar Sync | Google Calendar 1-Click URL | URL Generator | `calendar.google.com/calendar/render` URL |
| **TC-ICS-02** | F7: Calendar Sync | RFC 5545 .ics VCALENDAR/VEVENT | `.ics` Generator | Standard compliant iCalendar structure |
| **TC-ICS-03** | F7: Calendar Sync | DTSTART & DTEND ISO Format | `.ics` Generator | Valid `YYYYMMDDTHHMMSS` timestamps |
| **TC-ICS-04** | F7: Calendar Sync | VALARM 2-Hour Reminder Trigger | `.ics` Generator | `TRIGGER:-PT2H` reminder alarm block |
| **TC-ICS-05** | F7: Calendar Sync | .ics Client Download Trigger | `aesthetic.js` | Dynamic Blob / Data URI file download |
| **TC-LIN-01** | F8: LINE | LINE Official Deep Link Structure | URL Generator | `https://line.me/R/oaMessage/...` link |
| **TC-LIN-02** | F8: LINE | Pre-filled Message URL Encoding | URL Generator | Safe `encodeURIComponent` formatting |
| **TC-LIN-03** | F8: LINE | Pre-filled Message Booking Content | URL Generator | Contains Res ID, Plan Name, and Date/Time |
| **TC-LIN-04** | F8: LINE | Dual CTA LINE Button in LP | `index.html` | LINE buttons in `#action` & mobile sticky bar |
| **TC-LIN-05** | F8: LINE | LINE Confirmation on Thank-You | `index.html` / `aesthetic.js` | Direct LINE chat launch after booking |
| **TC-FBK-01** | F9: Fallback | Fallback Trigger on Empty URL | `aesthetic.js` / `config.js` | Activates simulation when webhook URL is blank |
| **TC-FBK-02** | F9: Fallback | Deterministic Availability Reproducibility | `CalendarEngine` | Identical date/slot seed produces same status |
| **TC-FBK-03** | F9: Fallback | Local Mock Booking Completion | `aesthetic.js` | Seamless submission flow without backend crash |
| **TC-FBK-04** | F9: Fallback | Realistic Slot Distribution Mix | `CalendarEngine` | Coexistence of ◯, △, ✕, and 休 over 14 days |
| **TC-FBK-05** | F9: Fallback | `fallbackSimulation` Toggle Flag | `config.js` | Configurable fallback activation switch |
| **TC-DEP-01** | F10: Deployment | Zero Root-Relative (`/`) Paths | `validate_links.py` | 0 root links across all HTML & CSS files |
| **TC-DEP-02** | F10: Deployment | 100% Valid Local File References | `validate_links.py` | 0 404 missing local file references |
| **TC-DEP-03** | F10: Deployment | Disk Case-Sensitivity Match | `validate_links.py` | Linux/GitHub Pages case-sensitive match |
| **TC-DEP-04** | F10: Deployment | Bidirectional Navigation Integrity | `index.html` / LP | Clean links between Portal and Aesthetic LP |
| **TC-DEP-05** | F10: Deployment | Subdirectory HTTP Simulation (200 OK) | `test_server.py` | Serves successfully under simulated subpath |

---

### Tier 2: Boundary & Corner Cases (50 Test Cases)
| ID | Category | Test Name | Verification Focus |
|:---|:---------|:----------|:-------------------|
| **TC-CAL-B01** | F1 Boundary | Month Rollover (8/31 -> 9/1) | Date math crosses month boundary cleanly |
| **TC-CAL-B02** | F1 Boundary | Year-End Rollover (12/31 -> 1/1) | Date math crosses year boundary cleanly |
| **TC-CAL-B03** | F1 Boundary | Leap Year February 29 Handling | February 29 handled on leap years (e.g. 2028) |
| **TC-CAL-B04** | F1 Boundary | Non-Leap Year February 28 Handling | February 28 rolls to March 1 on common years |
| **TC-CAL-B05** | F1 Boundary | 14-Day Calendar Exact Span | Exact 14-day delta between first and last date |
| **TC-SLT-B01** | F2 Boundary | Full Day Booked (All ✕) | All 4 slot buttons disabled when fully booked |
| **TC-SLT-B02** | F2 Boundary | Full Day Open (All ◯) | All 4 slot buttons selectable when wide open |
| **TC-SLT-B03** | F2 Boundary | Multi-Day Closed Days (`[1, 2]`) | Supports multiple weekly regular holidays |
| **TC-SLT-B04** | F2 Boundary | Past Time Slot Disable on Today | Prevents booking past hours on current day |
| **TC-SLT-B05** | F2 Boundary | Non-Integer Hour Slot (`18:30`) | Correctly parses half-hour minutes in slots |
| **TC-TAP-B01** | F3 Boundary | Rapid Consecutive Slot Clicking | Idempotent selection without UI jitter or race |
| **TC-TAP-B02** | F3 Boundary | Slot Re-selection Overwrite | Updating slot selection overwrites datetime field |
| **TC-TAP-B03** | F3 Boundary | Full Slot Click Protection | Clicking ✕ does not overwrite existing form value |
| **TC-TAP-B04** | F3 Boundary | Closed Slot Click Protection | Clicking 休 does not overwrite existing form value |
| **TC-TAP-B05** | F3 Boundary | Modal Duplicate Open Prevention | Clean modal state if opened while already open |
| **TC-GAS-B01** | F4 Boundary | Empty Date/Time Parameter Guard | GAS returns clean error JSON for blank input |
| **TC-GAS-B02** | F4 Boundary | Customer Name XSS / Special Chars | Sanitizes `<script>` and quotes in customer input |
| **TC-GAS-B03** | F4 Boundary | Malformed Email Rejection | Rejects invalid email formats gracefully |
| **TC-GAS-B04** | F4 Boundary | Google Calendar Double Booking Guard | Conflict detection in GAS booking script |
| **TC-GAS-B05** | F4 Boundary | GAS Exception Safe Catch Block | try-catch blocks prevent unhandled 500 HTML |
| **TC-CFG-B01** | F5 Boundary | Missing Optional Fields Fallback | Default values used when optional keys missing |
| **TC-CFG-B02** | F5 Boundary | Empty `gasWebhookUrl` String Safety | Prevents runtime crash when webhook URL is "" |
| **TC-CFG-B03** | F5 Boundary | 7-Day Open Salon (`closedDays: []`) | Supports salons with zero weekly holidays |
| **TC-CFG-B04** | F5 Boundary | Sunday Closed Salon (`closedDays: [0]`) | Correctly maps Sunday as weekly holiday |
| **TC-CFG-B05** | F5 Boundary | Custom `daysToShow` Parameter | Dynamically supports 7, 14, or 21 days view |
| **TC-TNK-B01** | F6 Boundary | 1000 Sequential IDs Collision-Free | Zero collisions across 1,000 generated IDs |
| **TC-TNK-B02** | F6 Boundary | Multibyte Emoji in Customer Name | Renders customer names with emoji/Japanese chars |
| **TC-TNK-B03** | F6 Boundary | Empty Notes Field Handling | Formats blank notes cleanly in summary |
| **TC-TNK-B04** | F6 Boundary | Sequential Bookings in Same Session | Generates fresh ID for each consecutive booking |
| **TC-TNK-B05** | F6 Boundary | Browser Refresh Post-Booking Safety | Page reload cleanly restores initial LP state |
| **TC-ICS-B01** | F7 Boundary | 18:30 + 80min DTEND Calculation | Correctly computes `19:50` end time |
| **TC-ICS-B02** | F7 Boundary | Course Duration Mapping | Plum: 60m, Bamboo: 80m, Pine: 100m mapped |
| **TC-ICS-B03** | F7 Boundary | RFC 5545 Special Char Escaping | Escapes commas, semicolons, and backslashes |
| **TC-ICS-B04** | F7 Boundary | Multi-line Description `\n` Wrap | Encodes line breaks as literal `\n` in .ics |
| **TC-ICS-B05** | F7 Boundary | JST (UTC+9) Timestamp Consistency | Ensures consistent local timezone timestamps |
| **TC-LIN-B01** | F8 Boundary | Japanese Percent-Encoding Roundtrip | Perfect roundtrip decode matching original |
| **TC-LIN-B02** | F8 Boundary | Long Notes URL Length Limit | Enforces safe URL length (< 2,000 chars) |
| **TC-LIN-B03** | F8 Boundary | Custom LINE Official Account ID | Supports replacing default LINE ID in config |
| **TC-LIN-B04** | F8 Boundary | Newline (%0A) Preservation in LINE | Preserves line breaks in pre-filled message |
| **TC-LIN-B05** | F8 Boundary | Special Symbols in Plan (★, %, ¥) | Encodes plan symbols without URL corruption |
| **TC-FBK-B01** | F9 Boundary | Network Timeout Fallback | Network timeout triggers local fallback mode |
| **TC-FBK-B02** | F9 Boundary | HTTP 500 Response Fallback | Server error triggers seamless fallback mode |
| **TC-FBK-B03** | F9 Boundary | Malformed JSON Fallback | Bad JSON response triggers safe fallback mode |
| **TC-FBK-B04** | F9 Boundary | 100-Run Consistency Guarantee | 100 repeated calls produce exact same seed |
| **TC-FBK-B05** | F9 Boundary | Diverse Date Distribution | Varied availability patterns across 14 dates |
| **TC-DEP-B01** | F10 Boundary | Mobile 375px Viewport & Overflow | Meta viewport prevents horizontal scroll |
| **TC-DEP-B02** | F10 Boundary | Desktop 1920px Max-Width Centering | `max-width` tokens center content on wide displays |
| **TC-DEP-B03** | F10 Boundary | NoScript Progressive Enhancement | Full copy & pricing visible without JavaScript |
| **TC-DEP-B04** | F10 Boundary | Deep Anchor & Query Parameter Route | Handles `#action?plan=bamboo` safely |
| **TC-DEP-B05** | F10 Boundary | Trailing Slash URL Resolution | Resolves `/` and `/index.html` identically |

---

### Tier 3: Cross-Feature Combinations (10 Test Cases)
| ID | Combination Flow | Scope | Verification Goal |
|:---|:-----------------|:------|:------------------|
| **TC-INT-01** | Calendar Slot Tap → Form DateTime Auto-Fill → Modal | F1 + F3 | Slot tap automatically sets `#form-datetime` and opens modal |
| **TC-INT-02** | Pricing Plan Card Tap → Modal Plan Pre-selection | F5 + F3 | Pricing button preselects Bamboo/Plum/Pine in modal |
| **TC-INT-03** | Combined Plan & Slot Selection State | F1 + F3 + F5 | Form preserves both preselected plan and chosen slot |
| **TC-INT-04** | Validation Barrier → Thank-You Transition | F3 + F6 | Required validation prevents empty submission; transitions on valid |
| **TC-INT-05** | Thank-You View → Google Calendar Sync URL | F6 + F7 | Generates Google Cal URL with matching Res ID and Datetime |
| **TC-INT-06** | Thank-You View → RFC 5545 .ics File Generation | F6 + F7 | Generates .ics payload matching reservation details |
| **TC-INT-07** | Thank-You View → LINE Official Deep Link | F6 + F8 | Pre-populates LINE chat with Res ID, Plan, and Datetime |
| **TC-INT-08** | Fallback Simulation → Calendar → Mock Reservation | F9 + F1 + F6 | Full end-to-end booking works offline without server |
| **TC-INT-09** | FAQ Accordion → Sticky CTA → Calendar Scroll | F1 + F3 + F10 | Smooth in-page scrolling and sticky CTA coordination |
| **TC-INT-10** | Portal Filtering → Aesthetic LP → Return Loop | F10 + Portal | Clean bidirectional navigation and category filtering |

---

### Tier 4: Real-World Scenarios (5 Comprehensive Workload Journeys)
| ID | Persona | Scenario Description | Complexity |
|:---|:--------|:---------------------|:-----------|
| **TC-APP-01** | 30s Office Worker | Mobile 375px access → Browses LP → Picks Friday 18:30 slot → Bamboo Plan → Submits → Downloads .ics → Launches LINE confirmation | High |
| **TC-APP-02** | Weekend Bride | Bridal care search → Selects Saturday 10:00 Pine Plan → Enters custom bridal notes → Submits → Adds to Google Calendar | High |
| **TC-APP-03** | Salon Owner | 3-minute GAS setup → Deploys `gas/Code.gs` → Configures `config.js` → Validates zero hosting cost automated ledger | High |
| **TC-APP-04** | Offline Commuter | Subways intermittent network → GAS timeout triggers fallback → Deterministic calendar renders → Completes mock booking | High |
| **TC-APP-05** | Quality Auditor | Production verification on GitHub Pages subdirectory (`/lp-portal-hub/`) → 0 404s, 0 broken links → 100% PASS exit code 0 | High |

---

## 4. Pass / Fail Criteria & Exit Codes
- **Pass (Exit Code 0)**: All 115 test cases across Tier 1 (50), Tier 2 (50), Tier 3 (10), and Tier 4 (5) pass with 0 errors.
- **Fail (Exit Code 1)**: Any assertion failure, missing section, broken link, or runtime exception results in immediate exit code 1 with actionable diagnostic output.
