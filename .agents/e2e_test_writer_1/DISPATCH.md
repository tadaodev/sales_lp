## 2026-08-20T14:23:00Z

You are the Test Writer for the E2E Testing Track.
Your working directory is: `c:/Project/事業案/05_LP作成/.agents/e2e_test_writer_1/`.
Read `c:/Project/事業案/05_LP作成/.agents/ORIGINAL_REQUEST.md`, `c:/Project/事業案/05_LP作成/PROJECT.md`, and `c:/Project/事業案/05_LP作成/TEST_INFRA.md` before starting work.
Refer also to `c:/Project/事業案/05_LP作成/.agents/survey_explorer_3/survey_report.md`.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

File Ownership:
You EXCLUSIVELY own:
1. `c:/Project/事業案/05_LP作成/tests/test_interactive_ui.py`
2. `c:/Project/事業案/05_LP作成/tests/validate_pasona_dom.py`
3. `c:/Project/事業案/05_LP作成/tests/validate_links.py`
4. `c:/Project/事業案/05_LP作成/tests/run_all_tests.py`
5. `c:/Project/事業案/05_LP作成/TEST_READY.md`

Tasks:
1. Expand and enrich the test suite across all 4 Tiers:
   - Tier 1 (Feature Coverage):
     - `TC-CAL`: 14-day calendar DOM structure, 4 slots header, slot buttons.
     - `TC-SLT`: Status representation (◯/△/✕/休), status classes (`is-available`, `is-limited`, `is-full`, `is-closed`).
     - `TC-TAP`: Slot selection event handling, `#form-datetime` auto-fill formatting, scroll target.
     - `TC-GAS`: `gas/Code.gs` syntax & schema validation, `gas/README.md` structure & completeness.
     - `TC-CFG`: `samples/aesthetic/js/config.js` schema validation (`SALON_CONFIG` fields).
     - `TC-TNK`: Thank-you screen DOM, reservation ID generator format (`LUM-YYYYMMDD-XXXX`).
     - `TC-ICS`: RFC 5545 `.ics` content format validation (DTSTART, DTEND, SUMMARY, DESCRIPTION, VALARM).
     - `TC-LIN`: LINE official chat URL encoding and parameter validation.
     - `TC-FBK`: Deterministic fallback calculation algorithm consistency.
   - Tier 2 (Boundary & Corner Cases):
     - End of month date rollover (e.g. 8/31 -> 9/1), leap year / February handling.
     - Full day booked, all slots closed day (Tuesday), first day / last day boundary.
     - Missing form fields, empty notes, special characters in customer name/notes.
     - GAS empty URL handling, simulated network timeout.
   - Tier 3 (Cross-Feature Combinations):
     - Slot tap -> Form fill -> Submission -> Thank-you view transition -> ICS export.
     - Fallback mode -> Slot status -> Tap -> Mock reservation.
   - Tier 4 (Real-World Application Scenarios):
     - E2E scenario: Customer views calendar on mobile, picks Friday 18:30 slot, selects Luxury Plan, submits booking, downloads .ics, and launches LINE confirmation.
2. Ensure tests use Python standard library only.
3. Once all test cases and runners are prepared, generate `c:/Project/事業案/05_LP作成/TEST_READY.md` containing the test runner command and full coverage matrix.
4. Write your handoff report to `c:/Project/事業案/05_LP作成/.agents/e2e_test_writer_1/handoff.md` and send a message to parent when complete.
