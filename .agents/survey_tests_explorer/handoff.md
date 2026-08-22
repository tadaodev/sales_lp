# Test Infrastructure & QA Investigation Handoff Report

**Agent**: `survey_tests_explorer`  
**Working Directory**: `c:/Project/事業案/05_LP作成/.agents/survey_tests_explorer/`  
**Target Milestone**: Official Store-Model Refresh for Bakery & Washoku LPs  
**Date**: 2026-08-23

---

## 1. Observation

### 1.1 Test Files and Architecture Inventory
The project features a **pure Python standard library test architecture** with zero external dependencies (`pytest`, `unittest`, or npm build steps are NOT required; custom Python test runners are utilized).

| Test File | Size | Role & Coverage | Key Classes / Entry Points |
|:---|:---|:---|:---|
| `tests/run_all_tests.py` | 96.7 KB (1,510 lines) | **Master 4-Tier Test Runner** Orchestrates all 179 test cases across Portal Hub & 5 Flagship LPs. | `MasterTestRunner`, `TestCaseResult` |
| `tests/validate_pasona_dom.py` | 21.9 KB (479 lines) | **DOM / SEO / Accessibility / PASONA Validator** Parses HTML into lightweight DOM, checks 7 PASONA sections, single H1, heading hierarchy, OGP, alt attributes. | `DOMTreeBuilder`, `PASONADOMValidator` |
| `tests/validate_links.py` | 21.4 KB (462 lines) | **Strict Relative Link & Asset Validator** Validates zero root `/` links, local file existence, Linux case-sensitivity, in-page/cross-page anchors (`#id`), script load order, image asset byte size. | `HTMLLinkExtractor`, `LinkValidator`, `verify_case_sensitive_path` |
| `tests/test_interactive_ui.py` | 62.9 KB (1,339 lines) | **Interactive UI, GAS & Fallback Validator** 31 discrete component assertions for Config schemas, GAS backend payloads, calendar slot engine, RFC 5545 `.ics`, LINE deep linking, and deterministic fallback. | `InteractiveUIValidator`, `ConfigSchemaValidator`, `BakeryConfigSchemaValidator`, `WashokuConfigSchemaValidator`, `ThankYouViewValidator` |
| `tests/test_server.py` | 17.0 KB (418 lines) | **Static HTTP Server & Subdirectory Simulator** Simulates GitHub Pages root and `/lp-portal-hub/` subdirectory serving, validates HTTP 200/404, MIME types. | `LocalTestServer`, `SubdirSimulatingHTTPRequestHandler`, `run_server_tests` |

---

### 1.2 Master Suite Test Inventory (179 Automated Tests)
As declared in `tests/run_all_tests.py` (lines 8-17):

```python
# Architecture:
# - Tier 1: Feature Coverage (Aesthetic, Italian, Legal, Bakery, Washoku - 85 tests)
# - Tier 2: Boundary & Corner Cases (Date rollovers, closures, parties, IDs - 65 tests)
# - Tier 3: Cross-Feature Combinations (Modals, .ics, LINE, 5-Flagship Navigation - 19 tests)
# - Tier 4: Real-World Scenarios (End-to-End Persona Journeys across 5 Verticals - 10 tests)
# Total: 179 Automated Tests (100% PASS Guarantee)
```

Breakdown of the 179 tests:
- **Tier 1 (85 Tests)**:
  - Aesthetic Salon: `TC-CAL-01..05`, `TC-SLT-01..05`, `TC-TAP-01..05`, `TC-GAS-01..05`, `TC-CFG-01..05`, `TC-TNK-01..05`, `TC-ICS-01..05`, `TC-LIN-01..05`, `TC-FBK-01..05`, `TC-DEP-01..05` (50 tests)
  - Legal Consulting: `TC-LEG-CAL-01..02`, `TC-LEG-SLT-01`, `TC-LEG-2WY-01`, `TC-LEG-CFG-01`, `TC-LEG-TNK-01`, `TC-LEG-ICS-01`, `TC-LEG-LIN-01`, `TC-LEG-IMG-01`, `TC-LEG-NAV-01` (10 tests)
  - Italian Restaurant: `TC-ITL-CFG-01`, `TC-ITL-CAL-01`, `TC-ITL-TNK-01`, `TC-ITL-LIN-01`, `TC-ITL-NAV-01` (5 tests)
  - Hard Bakery: `TC-BAK-CAL-01..02`, `TC-BAK-SLT-01`, `TC-BAK-TT-01`, `TC-BAK-CFG-01`, `TC-BAK-TNK-01`, `TC-BAK-ICS-01`, `TC-BAK-LIN-01`, `TC-BAK-IMG-01`, `TC-BAK-NAV-01` (10 tests)
  - Washoku Izakaya: `TC-WSH-CAL-01..02`, `TC-WSH-SLT-01`, `TC-WSH-PTY-01`, `TC-WSH-CFG-01`, `TC-WSH-TNK-01`, `TC-WSH-ICS-01`, `TC-WSH-LIN-01`, `TC-WSH-IMG-01`, `TC-WSH-NAV-01` (10 tests)
- **Tier 2 (65 Tests)**:
  - Core Boundary Cases: `TC-CAL-B01..B05`, `TC-SLT-B01..B05`, `TC-TAP-B01..B05`, `TC-GAS-B01..B05`, `TC-CFG-B01..B05`, `TC-TNK-B01..B05`, `TC-ICS-B01..B05`, `TC-LIN-B01..B05`, `TC-FBK-B01..B05`, `TC-DEP-B01..B05` (50 tests)
  - Legal Boundaries: `TC-LEG-B01..B05` (5 tests)
  - Bakery Boundaries: `TC-BAK-B01..B05` (5 tests)
  - Washoku Boundaries: `TC-WSH-B01..B05` (5 tests)
- **Tier 3 (19 Tests)**:
  - `TC-INT-01..10` (Aesthetic / Portal Combinations, 10 tests)
  - `TC-INT-11..13` (Legal 2WAY, Modal Submit, Portal Loop, 3 tests)
  - `TC-INT-14` (Italian Table Booking, 1 test)
  - `TC-INT-15..16` (Bakery Assortment Box Modal & .ics/LINE, 2 tests)
  - `TC-INT-17..18` (Washoku Banquet Course Modal & .ics/LINE, 2 tests)
  - `TC-INT-19` (Portal 5-Flagship Hub Navigation Loop, 1 test)
- **Tier 4 (10 Tests)**:
  - `TC-APP-01..05` (Office Worker, Bride, Salon Owner, Offline, Multi-device Auditor, 5 tests)
  - `TC-APP-06..07` (Startup CEO Zoom, HR Director In-Person, 2 tests)
  - `TC-APP-08` (Bakery Morning Artisan Lover, 1 test)
  - `TC-APP-09` (Izakaya Banquet Organizer, 1 test)
  - `TC-APP-10` (LP Portal 5-Flagship Explorer, 1 test)

---

### 1.3 Specific Assertions and DOM Checks for Bakery & Washoku

#### A. Bakery LP Assertions
1. **PASONA DOM (`validate_pasona_dom.py`)**:
   - `validate_file_pasona`:
     - Checks 7 sections (`problem`, `affinity`, `solution`, `offer`, `narrowing`, `action`, `faq`).
     - In `DOMTreeBuilder`: `problem` is satisfied by either `data-pasona="problem"` OR `id="problem"` OR `id="hero"`.
     - `PASONA_SOLUTION_BEFORE_AFTER`: `re.search(r'(before|after|ビフォー|アフター|効果実証|変化)', content, re.IGNORECASE)`.
     - `PASONA_DUAL_CTA`: `line` + `modal/form/booking`.
     - `PASONA_FAQ_COUNT`: >= 3 FAQ items (`faq-item`, `<details>`, `<dt>`, `accordion-item`).
   - `validate_bakery_pasona`:
     - Timetable check: `re.search(r'(timetable|baking-schedule|焼き上がり時刻表|焼き上がり|第1便|第2便|第3便|第4便)', content, re.IGNORECASE)`.
     - Assortment Box check: `re.search(r'(モーニングハード|人気定番7種|プレミアム薪|アソートBOX|詰め合わせ)', content, re.IGNORECASE)`.
2. **Master Runner (`run_all_tests.py`)**:
   - `TC-BAK-CAL-01`: 14-day date range + 4 pickup slots (`08:00`, `11:00`, `14:00`, `16:30`).
   - `TC-BAK-CAL-02`: Container in `#action` (`calendar|カレンダー|reservation|schedule|timetable`).
   - `TC-BAK-SLT-01`: Monday & Tuesday regular closed days (`closedDays: [1, 2]`).
   - `TC-BAK-TT-01`: `bakingSchedule` in config OR `第1便` & `第4便` in HTML.
   - `TC-BAK-CFG-01`: Script order (`config.js` before `bakery.js`).
   - `TC-BAK-TNK-01`: Res ID format `^BAK-\d{8}-[A-Z0-9]{4}$`.
   - `TC-BAK-ICS-01`: 30-min pickup duration (`11:00 -> 11:30`).
   - `TC-BAK-LIN-01`: LINE deep link with `BAK-20260822-2H4L` and `竹 定番7種詰め合わせBOX`.
   - `TC-BAK-IMG-01`: 4 image files exist and size >= 1000 bytes:
     - `samples/bakery/assets/images/hero_baguette.jpg`
     - `samples/bakery/assets/images/baker_craftsman.jpg`
     - `samples/bakery/assets/images/campagne_slice.jpg`
     - `samples/bakery/assets/images/bakery_display.jpg`
   - `TC-BAK-NAV-01`: Forward `samples/bakery` in portal, return `../../index.html` in bakery.
   - `TC-BAK-B01`: 16:30 slot DTEND calculation (`17:00`).
   - `TC-BAK-B02`: 14-day Mon & Tue closures.
   - `TC-BAK-B03`: Matsutake pricing (`梅: 1980, 竹: 3480, 松: 5800`).
   - `TC-BAK-B05`: NoScript SSR text length > 1000.
   - `TC-INT-15`: Assortment card tap -> modal auto-fill.
   - `TC-INT-16`: 30-min .ics + LINE order confirmation.
   - `TC-APP-08`: Persona 8 checks `松`/`プレミアム`, `line`, and `timetable`/`焼き上がり`.

#### B. Washoku LP Assertions
1. **PASONA DOM (`validate_pasona_dom.py`)**:
   - `validate_file_pasona`:
     - Checks 7 sections (`problem`, `affinity`, `solution`, `offer`, `narrowing`, `action`, `faq`).
     - `problem` is satisfied by `id="hero"` or `data-pasona="problem"` (does not require `#problem`).
   - `validate_washoku_pasona`:
     - 3 Guarantees: `re.search(r'(3大安心保証|3大保証|安心保証|guarantee|幹事様を絶対に|明朗会計)', content, re.IGNORECASE)`.
     - 4 Signature Dishes: `re.search(r'(名物料理|4大名物|鮮魚.*5点盛り|炭火焼き鳥|もつ鍋|寄せ鍋|天ぷら|舟盛り)', content, re.IGNORECASE)`.
     - Matsutake banquet courses: `re.search(r'(3,980|4,980|6,500|飲み放題|宴会コース)', content)`.
2. **Master Runner (`run_all_tests.py`)**:
   - `TC-WSH-CAL-01`: 14-day date range + 4 banquet slots (`17:00`, `18:30`, `19:30`, `20:30`).
   - `TC-WSH-CAL-02`: Container in `#action` (`calendar|カレンダー|reservation|schedule|宴会`).
   - `TC-WSH-SLT-01`: Sunday regular closed day (`closedDays: [0]`).
   - `TC-WSH-PTY-01`: Party size validation (max 40) + 3 guarantees (`3大安心保証` or `安心保証`).
   - `TC-WSH-CFG-01`: Script order (`config.js` before `washoku.js`).
   - `TC-WSH-TNK-01`: Res ID format `^WSH-\d{8}-[A-Z0-9]{4}$`.
   - `TC-WSH-ICS-01`: 120-min banquet duration (`18:30 -> 20:30`).
   - `TC-WSH-LIN-01`: LINE deep link with `WSH-20260822-7T2W`, `竹 王道宴会コース`, `20名様`.
   - `TC-WSH-IMG-01`: 4 image files exist and size >= 1000 bytes:
     - `samples/washoku/assets/images/hero_banquet_nabe.jpg`
     - `samples/washoku/assets/images/sashimi_platter.jpg`
     - `samples/washoku/assets/images/yakitori_charcoal.jpg`
     - `samples/washoku/assets/images/washoku_private_room.jpg`
   - `TC-WSH-NAV-01`: Forward `samples/washoku` in portal, return `../../index.html` in washoku.
   - `TC-WSH-B01`: 18:30 slot DTEND calculation (`20:30`).
   - `TC-WSH-B02`: 14-day Sunday closures.
   - `TC-WSH-B03`: Party size bounds (allow 2..40, reject 1, reject 41).
   - `TC-WSH-B05`: NoScript SSR text length > 1000.
   - `TC-INT-17`: Course card tap -> modal auto-fill -> party size & calendar slot.
   - `TC-INT-18`: 120-min .ics + LINE tentative reservation.
   - `TC-APP-09`: Persona 9 checks `竹`/`4,980`, `安心保証`/`3大保証`, and `line`.

---

## 2. Logic Chain

```
[Observation 1.1 - 1.3: Current Test Structure]
   │
   ├─ 1. DOM Parser Map: `DOMTreeBuilder` maps `id="hero"` or `data-pasona="problem"` to `problem`.
   │     └─ Logic: Removal of the old negative agitation blocks (`pain-points-block` in Bakery, `#problem` in Washoku)
   │        will NOT break the 7-section PASONA validation as long as the Hero section retains `id="hero"` or `data-pasona="problem"`.
   │
   ├─ 2. Anchor Validation: `LinkValidator` checks all `href="#..."` anchors against existing element IDs.
   │     └─ Logic: When `#problem` is removed from `samples/washoku/index.html`, any `<a href="#problem">` in navigation or
   │        header links must be updated (e.g. to `#hospitality` or `#solution`) to prevent `Rule-L3 (Broken In-Page Anchor)` failures.
   │
   ├─ 3. Specific Text Keyword Assertions:
   │     ├─ Bakery: requires timetable keywords (`baking-schedule|焼き上がり時刻表|第1便|第4便`), assortment boxes (`モーニングハード|人気定番7種|プレミアム薪|アソートBOX`), Matsutake prices (¥1,980/¥3,480/¥5,800).
   │     ├─ Washoku: requires guarantee keywords (`3大安心保証|安心保証|明朗会計`), signature dish keywords (`名物料理|鮮魚.*5点盛り|炭火焼き鳥|もつ鍋`), banquet courses (¥3,980/¥4,980/¥6,500).
   │     └─ Logic: The official store refresh copy for Bakery and Washoku must include these exact core keywords and Matsutake tiers
   │        so that `validate_pasona_dom.py`, `run_all_tests.py`, and `test_interactive_ui.py` pass without regression.
   │
   ├─ 4. Before / After Assertion in `validate_file_pasona`:
   │     └─ Logic: `validate_file_pasona` checks `re.search(r'(before|after|ビフォー|アフター|効果実証|変化)', content)`.
   │        In official store copy, texture/taste transformation or craftsmanship evolution (e.g. "焼きたてと翌朝の食感の変化", "72時間熟成による風味の変化")
   │        satisfies this check, or the validator can explicitly support official store craftsmanship proofs.
   │
   └─ 5. Negative Agitation Absence Assurance:
         └─ Logic: Test assertions can be extended in `validate_bakery_pasona` and `validate_washoku_pasona` to explicitly verify
            the absence of negative agitation phrases (`pain-points-block`, "幹事様が夜も眠れなくなる", "物足りなさ", "パサつき").
```

---

## 3. Caveats
1. **Interactive Terminal Execution**: `run_command` in subagents requires interactive permission or background async handling. When running full regression runs, the orchestrator/sentinel should execute commands with `$env:PYTHONUTF8=1; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8;`.
2. **Time Slot Consistency**: In `ORIGINAL_REQUEST.md`, Bakery fresh bake times mention `08:00 / 11:30 / 14:00 / 16:30` while `config.js` and test slot engines use `08:00 / 11:00 / 14:00 / 16:30`. The pickup slots in `config.js` (`11:00` vs `11:30`) must be kept synchronized between `config.js`, HTML markup, and `test_interactive_ui.py`/`run_all_tests.py` to maintain 100% test pass rate.
3. **No Unexamined Directories**: All 5 test files (`run_all_tests.py`, `validate_pasona_dom.py`, `validate_links.py`, `test_interactive_ui.py`, `test_server.py`) and config/HTML files were completely inspected.

---

## 4. Conclusion
1. **Total Test Suite**: 179 master tests in `tests/run_all_tests.py`, complemented by standalone validators in `validate_pasona_dom.py`, `validate_links.py`, `test_interactive_ui.py` (31 tests), and `test_server.py` (17 tests).
2. **Official Store Refresh Compatibility**:
   - Negative agitation removal (`pain-points-block` in Bakery, `#problem` in Washoku) is **fully architecturally compatible** with the test suite.
   - The DOM tree parser maps `id="hero"` as the primary `problem` entry point, so removing negative agitation does not violate the 7-section structure.
   - Header navigation links (`href="#..."`) must be updated to target valid IDs (`#concept`, `#hospitality`, `#solution`, `#timetable`, `#courses`).
   - All 8 AI image assets (`.jpg`, >= 1000 bytes) are already indexed and tested on disk.
3. **Recommended Test Suite Enhancements**:
   - Add negative agitation regression guards to `validate_bakery_pasona` and `validate_washoku_pasona` ensuring negative pain words do not reappear.
   - Verify all 179 tests pass with 0 errors.

---

## 5. Verification Method

### Test Execution Commands

```powershell
# 1. Master 4-Tier Test Runner (179 Test Cases)
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; $env:PYTHONUTF8=1; python tests/run_all_tests.py

# 2. PASONA DOM & Semantic Heading Validator
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; $env:PYTHONUTF8=1; python tests/validate_pasona_dom.py

# 3. Strict Relative Link & Asset Validator
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; $env:PYTHONUTF8=1; python tests/validate_links.py

# 4. Interactive UI, GAS Backend, Calendar & Fallback Validator
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; $env:PYTHONUTF8=1; python tests/test_interactive_ui.py

# 5. Static HTTP Server & Subdirectory Simulator
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; $env:PYTHONUTF8=1; python tests/test_server.py
```

### Invalidation Conditions
- Any test returning Exit Code > 0 or reporting `[FAIL]`.
- Any missing image asset under `samples/bakery/assets/images/` or `samples/washoku/assets/images/`.
- Any broken in-page anchor (`Rule-L3`) after `#problem` removal.
- Any discrepancy in pickup time slots or reservation ID regex formats.
