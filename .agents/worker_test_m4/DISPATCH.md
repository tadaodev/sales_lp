## 2026-08-22T07:32:46Z
You are worker_test_m4. Your working directory is `c:\Project\事業案\05_LP作成\.agents\worker_test_m4`.
You own exclusive write permissions for the `tests/` directory.

Read the following files carefully:
- `c:\Project\事業案\05_LP作成\.agents\ORIGINAL_REQUEST.md` (Specifically R6)
- `c:\Project\事業案\05_LP作成\PROJECT.md`
- `c:\Project\事業案\05_LP作成\.agents\explorer_portal_qa_1\handoff.md` (Full QA architecture, 170+ test cases breakdown, validators)
- `c:\Project\事業案\05_LP作成\.agents\worker_bakery_1\handoff.md`
- `c:\Project\事業案\05_LP作成\.agents\worker_washoku_1\handoff.md`
- `c:\Project\事業案\05_LP作成\.agents\worker_portal_m3\handoff.md`
- Existing test scripts: `tests/validate_links.py`, `tests/validate_pasona_dom.py`, `tests/test_interactive_ui.py`, `tests/test_server.py`, `tests/run_all_tests.py`

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your Tasks:
1. Update `tests/validate_links.py`:
   - Extend link validation to include `samples/bakery/index.html` and `samples/washoku/index.html`.
   - Verify script load order (`config.js` before `bakery.js` / `washoku.js`).
   - Verify disk presence of all 8 newly created image assets under `samples/bakery/assets/images/` and `samples/washoku/assets/images/`.
   - Verify bidirectional navigation between Portal Hub (`index.html`) and all 5 sample LPs (`samples/aesthetic/`, `samples/italian/`, `samples/legal/`, `samples/bakery/`, `samples/washoku/`).
2. Update `tests/validate_pasona_dom.py`:
   - Add PASONA DOM validators for `samples/bakery/index.html` and `samples/washoku/index.html`:
     - Single `<h1>`, strict heading hierarchy (h1 -> h2 -> h3).
     - New PASONA 7 sections (`problem`, `affinity`, `solution`, `offer`, `narrowing`, `action`, `faq`).
     - Matsutake 3-tier pricing structure.
     - Baking timetable (Bakery) and 3 Organizer Guarantees / 4 Signature Dishes (Washoku).
     - 14-day reservation calendar container.
     - All `<img>` tags have descriptive `alt` attributes.
3. Update `tests/test_interactive_ui.py`:
   - Add `BakeryConfigSchemaValidator` validating `window.BAKERY_CONFIG`.
   - Add `WashokuConfigSchemaValidator` validating `window.WASHOKU_CONFIG`.
   - Add `BakeryCalendarSimulator` and `WashokuCalendarSimulator` testing 14-day slot math, past slot disable, closed days, and deterministic fallback reproducibility.
   - Update `ThankYouViewValidator` to test `BAK-YYYYMMDD-XXXX` and `WSH-YYYYMMDD-XXXX` formats, Google Calendar URLs, RFC 5545 `.ics` strings (with 2h VALARM), and LINE deep links.
4. Update `tests/test_server.py`:
   - Add Root and Subdirectory HTTP 200 checks for `samples/bakery/index.html` and `samples/washoku/index.html`.
   - Add CSS MIME type validation for `samples/bakery/css/bakery.css` and `samples/washoku/css/washoku.css`.
5. Update `tests/run_all_tests.py`:
   - Integrate all tests across 4 Tiers:
     - Tier 1: Feature Coverage (Aesthetic, Italian, Legal, Bakery, Washoku, Portal Hub) - ~85 tests
     - Tier 2: Boundary & Corner Cases (Past dates, leap years, overflow parties, closed days, fallback seeds) - ~65 tests
     - Tier 3: Cross-Feature Integration (Slot select -> Form fill -> Modal -> .ics -> LINE -> Fallback) - ~19 tests
     - Tier 4: Real-World Scenarios (End-to-end customer bookings across all 5 flagship verticals) - ~10 tests
     - Total: 175+ tests (far exceeding 150+ requirement).
6. Run all test suites in PowerShell with UTF-8 encoding:
   ```powershell
   [Console]::OutputEncoding = [System.Text.Encoding]::UTF8;
   $env:PYTHONUTF8=1;
   python tests/validate_links.py
   python tests/validate_pasona_dom.py
   python tests/test_interactive_ui.py
   python tests/test_server.py
   python tests/run_all_tests.py
   ```
   Ensure 100% test pass rate with 0 errors.

Deliver your detailed report in `c:\Project\事業案\05_LP作成\.agents\worker_test_m4\handoff.md` with full execution outputs and send a message when complete.
