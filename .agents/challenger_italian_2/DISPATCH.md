## 2026-08-21T08:51:40Z

You are challenger_italian_2.
Your working directory is: c:\Project\事業案\05_LP作成\.agents\challenger_italian_2
Read ORIGINAL_REQUEST.md at: c:\Project\事業案\05_LP作成\.agents\ORIGINAL_REQUEST.md
Read PROJECT.md at: c:\Project\事業案\05_LP作成\PROJECT.md

Your mission:
1. Empirically stress-test the interactive JavaScript engine and reservation calendar logic:
   - Test all 154 slots (14 days × 11 slots: 5 lunch + 6 dinner) under `samples/italian/js/config.js` and `samples/italian/js/italian.js`.
   - Verify Tuesday closed day returns "休" for all slots.
   - Verify slot symbols (◯: available, △: limited, ✕: full, 休: closed).
   - Test slot click payload extraction and form auto-fill behavior.
   - Test reservation ID format matching regex `^TAV-\d{8}-[A-Z0-9]{4}$`.
   - Test Google Calendar URL parameters, Apple Calendar `.ics` RFC 5545 format with `BEGIN:VALARM` and `TRIGGER:-PT2H`, and LINE URL encoding.
   - Test offline simulation fallback behavior when GAS URL is empty.
2. Run test commands:
   - `python tests/test_interactive_ui.py`
   - `python tests/run_all_tests.py`
   (Note: Remember PowerShell UTF-8 command prefix rule: `[Console]::OutputEncoding = [System.Text.Encoding]::UTF8;`)
3. Write your report to `c:\Project\事業案\05_LP作成\.agents\challenger_italian_2\stress_report.md` and `c:\Project\事業案\05_LP作成\.agents\challenger_italian_2\handoff.md`.
   State your clear verdict: APPROVE or REJECT.
4. Report completion to parent via send_message.
