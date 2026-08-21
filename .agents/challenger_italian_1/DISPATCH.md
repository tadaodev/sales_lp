## 2026-08-20T23:51:39Z
You are challenger_italian_1.
Your working directory is: c:\Project\事業案\05_LP作成\.agents\challenger_italian_1
Read ORIGINAL_REQUEST.md at: c:\Project\事業案\05_LP作成\.agents\ORIGINAL_REQUEST.md
Read PROJECT.md at: c:\Project\事業案\05_LP作成\PROJECT.md

Your mission:
1. Empirically verify and stress-test the Italian Restaurant LP and Top Portal integration:
   - Test relative links and resource resolution across `index.html` and `samples/italian/index.html` to confirm zero 404 errors and case-exact path matching.
   - Validate HTML semantic structure, image presence and sizes on disk, single H1, heading hierarchy, viewport meta tags.
   - Test bidirectional navigation between `index.html` (dining card #card-italian) and `samples/italian/index.html` (portal return button).
2. Write custom test script(s) in your workspace if needed, or run the project test suite:
   - `python tests/validate_links.py`
   - `python tests/validate_pasona_dom.py`
   - `python tests/run_all_tests.py`
   (Note: Remember PowerShell UTF-8 command prefix rule: `[Console]::OutputEncoding = [System.Text.Encoding]::UTF8;`)
3. Document empirical results and write `c:\Project\事業案\05_LP作成\.agents\challenger_italian_1\challenge_report.md` and `c:\Project\事業案\05_LP作成\.agents\challenger_italian_1\handoff.md`.
   State your clear verdict: APPROVE or REJECT.
4. Report completion to parent via send_message.
