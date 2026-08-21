## 2026-08-21T08:43:07Z
You are a test engineer and QA specialist (worker_test_legal_m3_1) assigned to Milestone 3 (M3): Automated Test Suite Extension & Verification.
Your working directory is c:\Project\事業案\05_LP作成\.agents\worker_test_legal_m3_1.

Read the authoritative documents first:
1. c:\Project\事業案\05_LP作成\.agents\ORIGINAL_REQUEST.md (§R5)
2. c:\Project\事業案\05_LP作成\PROJECT.md
3. c:\Project\事業案\05_LP作成\.agents\explorer_legal_qa_1\handoff.md (Detailed test specification and extension blueprint)
4. Existing test files: `tests/validate_links.py`, `tests/validate_pasona_dom.py`, `tests/test_interactive_ui.py`, `tests/test_server.py`, `tests/run_all_tests.py`
5. Implementation files: `samples/legal/index.html`, `samples/legal/css/legal.css`, `samples/legal/js/config.js`, `samples/legal/js/legal.js`, `samples/legal/assets/images/*`, and `index.html`

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Scope & Tasks:
1. Extend `tests/validate_links.py`:
   - Enforce script order check: `config.js` must be loaded BEFORE `legal.js` in `samples/legal/index.html`.
   - Validate zero root-relative `/` paths, 100% case-sensitive file existence, and bidirectional navigation between `index.html` and `samples/legal/index.html`.
2. Extend `tests/validate_pasona_dom.py`:
   - Include `samples/legal/index.html` in `validate_all()`.
   - Validate 7 PASONA sections (`problem`, `affinity`, `solution`, `offer`, `narrowing`, `action`, `faq`), Matsutake 3-tier pricing, Before/After comparison, single `<h1>`, heading hierarchy, `<html lang="ja">`, viewport meta, description, and descriptive `alt` tags on all 4 legal images.
3. Extend `tests/test_interactive_ui.py`:
   - Add `LegalConfigSchemaValidator` for `LEGAL_CONFIG` (firmName, closedDays, timeSlots, consultationModes, planMaster, fallbackSimulation).
   - Add `LegalCalendarEngineSimulator` for 14-day calculation, 4 slots (10:00, 13:00, 15:30, 18:00), 2WAY mode logic, and weekend closures.
   - Update reservation ID regex validator to accept `LUM-YYYYMMDD-XXXX` and `LEG-YYYYMMDD-XXXX`.
   - Test Google Calendar URL, RFC 5545 `.ics` (with 2-hour VALARM), and LINE deep link generation.
4. Extend `tests/test_server.py`:
   - Add root mode and GitHub Pages subdirectory simulation mode checks for `samples/legal/index.html` and `samples/legal/css/legal.css`.
5. Extend `tests/run_all_tests.py`:
   - Integrate Legal LP test cases across Tier 1, Tier 2, Tier 3, Tier 4.
6. Execute the entire test suite and verify that ALL tests pass 100% with exit code 0:
   - Run `python tests/validate_links.py`
   - Run `python tests/validate_pasona_dom.py`
   - Run `python tests/test_interactive_ui.py`
   - Run `python tests/test_server.py`
   - Run `python tests/run_all_tests.py`
   (Ensure all command executions use the terminal UTF-8 preamble `[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; $env:PYTHONUTF8=1;`).

Write your detailed test execution and handoff report to `c:\Project\事業案\05_LP作成\.agents\worker_test_legal_m3_1\handoff.md` and report back with `send_message`.
