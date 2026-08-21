## 2026-08-21T22:15:00Z
You are explorer_portal_qa_1. Your working directory is `c:\Project\事業案\05_LP作成\.agents\explorer_portal_qa_1`.
You are investigating the existing Portal Hub (`index.html`), `css/portal.css`, and the Python automated test infrastructure (`tests/`) to formulate the exact integration requirements and QA expansion plan for 5 flagship LPs and 150+ test cases.

Read the following files carefully:
- `c:\Project\事業案\05_LP作成\.agents\ORIGINAL_REQUEST.md` (Latest request dated 2026-08-21T22:12:24Z / 2026-08-22, Requirements R5, R6)
- `c:\Project\事業案\05_LP作成\index.html`
- `c:\Project\事業案\05_LP作成\css/portal.css`
- `c:\Project\事業案\05_LP作成\tests/validate_links.py`
- `c:\Project\事業案\05_LP作成\tests/validate_pasona_dom.py`
- `c:\Project\事業案\05_LP作成\tests/test_interactive_ui.py`
- `c:\Project\事業案\05_LP作成\tests/test_server.py`
- `c:\Project\事業案\05_LP作成\tests/run_all_tests.py`

Investigate and document in `c:\Project\事業案\05_LP作成\.agents\explorer_portal_qa_1\handoff.md`:
1. Current Portal structure in `index.html`:
   - Filter tabs: `all`, `salon` (美容・サロン), `gourmet` (飲食・グルメ), `pro` (士業・法務). Check how counts and badges are structured.
   - Featured LP cards: currently 3 live cards (aesthetic, italian, legal). Identify where and how to add Bakery and Washoku as 4th and 5th flagship live demo cards.
   - Hero section quick links: currently `#hero-quick-aesthetic`, `#hero-quick-italian`, `#hero-quick-legal`. How to add Bakery and Washoku quick pills.
   - Relative links & bidirectional navigation requirements (404-free, `./`, `../../`).
2. Test Suite Architecture:
   - What does `tests/validate_links.py` currently check? How to extend it for `samples/bakery/` and `samples/washoku/`?
   - What does `tests/validate_pasona_dom.py` test? (PASONA sections, single h1, heading hierarchy, meta tags, alt tags, Matsutake plans). How to add Bakery and Washoku DOM validators?
   - What does `tests/test_interactive_ui.py` test? (Config schema validator, calendar simulator, deterministic fallback, slot dates). How to add `BakeryConfigSchemaValidator`, `WashokuConfigSchemaValidator`, `BakeryCalendarSimulator`, `WashokuCalendarSimulator`?
   - What does `tests/test_server.py` test? (HTTP endpoints, MIME types, subpaths).
   - What does `tests/run_all_tests.py` do? How to organize Tiers 1-4 to ensure 150+ distinct test cases with 100% pass guarantee?
3. Actionable checklist for workers implementing M1, M2, M3, M4.

Deliver your report in `handoff.md` and send a message when complete.
