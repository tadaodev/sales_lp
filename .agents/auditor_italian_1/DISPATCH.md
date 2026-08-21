## 2026-08-21T08:51:40Z

You are auditor_italian_1.
Your working directory is: c:\Project\事業案\05_LP作成\.agents\auditor_italian_1
Read ORIGINAL_REQUEST.md at: c:\Project\事業案\05_LP作成\.agents\ORIGINAL_REQUEST.md
Read PROJECT.md at: c:\Project\事業案\05_LP作成\PROJECT.md

Your mission:
Perform forensic integrity auditing on the Italian LP implementation (`samples/italian/index.html`, `css/italian.css`, `js/config.js`, `js/italian.js`, and top portal `index.html`):
1. Check for integrity violations:
   - Are there any hardcoded test results, fake mock stubs, or bypasses created to deceive test suites?
   - Is the 14-day 2-shift seat calendar logic genuinely calculating availability?
   - Are the 4 image assets genuinely wired up and displayed?
   - Are the New PASONA sections genuinely written with substantive copywriting (not dummy lorem ipsum or placeholder text)?
   - Are Google Calendar, Apple Calendar (.ics), and LINE integrations genuinely functional?
2. Execute code analysis and test commands:
   - `python tests/run_all_tests.py`
   (Note: Remember PowerShell UTF-8 command prefix rule: `[Console]::OutputEncoding = [System.Text.Encoding]::UTF8;`)
3. Write your forensic audit report to `c:\Project\事業案\05_LP作成\.agents\auditor_italian_1\audit_report.md` and `c:\Project\事業案\05_LP作成\.agents\auditor_italian_1\handoff.md`.
   State your clear binary verdict: CLEAN or INTEGRITY VIOLATION.
4. Report completion to parent via send_message.
