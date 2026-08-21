# Orchestrator 3 Execution Plan: Casual Italian Restaurant Sample LP

## 1. Goal & Requirements
Deliver a production-ready, highly engaging, delicious/sizzling Casual Italian Restaurant Sample LP ("TRATTORIA & PIZZERIA BELLA TAVOLA") to GitHub Pages with 100% automated test coverage.

## 2. Milestone Breakdown
- **M1: Italian Restaurant LP Implementation & Image Integration**
  - Construct `samples/italian/index.html` following new PASONA formula:
    - Problem (P): 気軽に美味しい本格イタリアンが食べたい、記念日・女子会・普段使いできる店を探している
    - Affinity (A): 敷居が高い高級店や画一的なチェーン店ではなく、薪窯ピッツァと手打ちパスタを陽気な空間で楽しみたい
    - Solution (S): 本場ナポリ直送の薪窯ピッツァ・毎朝手打ちの生パスタ・厳選イタリア自然派ワイン
    - Offer (O): ランチセット・ディナー松竹梅コース（歓送迎会・記念日ドルチェプレート特典）
    - Narrowing Down (N): 席数限定・ディナー予約限定特典・週末満席御礼
    - Action (A): 14日席空き状況カレンダー（Lunch/Dinner 2部制）・Web席予約フォーム・LINE予約ボタン・予約完了モーダル・ICS/LINE
  - Wire up generated high-res images from `samples/italian/assets/images/`:
    - `trattoria_interior.jpg` (Hero / Atmosphere / Access)
    - `pizza_margherita.jpg` (Signature Pizza / Solution / Menu)
    - `handmade_pasta.jpg` (Fresh Pasta / Story / Menu)
    - `dolce_tiramisu.jpg` (Dolce / Course Offer / Dessert)
  - Create `samples/italian/css/italian.css` with warm Italian color palette:
    - Terracotta `#C85A32`, Wine Red `#722F37`, Olive Green `#556B2F`, Warm Wood `#8B5A2B`, Cream background `#FDFBF7`
    - Responsive layout (375px ~ 1920px), sticky bottom CTA on mobile, smooth scroll.
  - Implement `samples/italian/js/config.js` and `samples/italian/js/italian.js`:
    - Unified configuration (hours, closed days, slots, LINE URL).
    - 14-day 2-shift (Lunch/Dinner) calendar with ◯, △, ✕, 休 slots.
    - Slot click -> auto-fill date/time into booking form & scroll to form.
    - Form submit -> generate booking ID (`TAV-YYYYMMDD-XXXX`), display modal with Google Calendar / Apple Calendar (.ics) / LINE 1-tap booking.
    - Deterministic fallback logic when GAS URL is not provided.

- **M2: Top Portal Integration (`index.html`)**
  - Add "TRATTORIA & PIZZERIA BELLA TAVOLA" card under the "飲食・店舗" filter in `index.html`.
  - Set status to "公開中", thumbnail pointing to `samples/italian/assets/images/pizza_margherita.jpg`, tag badges (新PASONA, 席予約, カレンダー連動, 料理シズル感).
  - Add bidirectional links: `index.html` -> `samples/italian/index.html` and return header button in `samples/italian/index.html`.

- **M3: Test Suite Extension & Verification**
  - Extend `tests/validate_pasona_dom.py` to validate Italian LP DOM (all PASONA sections, meta tags, images).
  - Extend `tests/validate_links.py` to check all relative links, image paths, anchors.
  - Extend `tests/test_interactive_ui.py` to test seat calendar generation, lunch/dinner slot clicking, mock booking submission, ICS generation, and fallback logic.
  - Run `tests/run_all_tests.py` and ensure 100% PASS across all tiers.

- **M4: Git Commit & GitHub Pages Push**
  - Check `git status`, commit all newly created and updated files with a descriptive message, and push to `origin main`.

## 3. Subagent Dispatch Plan
1. **Survey / Explorer**:
   - `explorer_italian_1`: Explore asset specs, design requirements, PASONA structure, and configuration schema.
   - `spec_miner_italian_1`: Mine specific copy, menu items, course details, time slots, and calendar requirements.
2. **Worker**:
   - `worker_italian_lp_1`: Implement `samples/italian/index.html`, `css/italian.css`, `js/config.js`, `js/italian.js`, update `index.html` top portal.
   - `worker_test_italian_1`: Update and extend `tests/` for full test validation.
3. **Reviewers & Challengers & Auditor**:
   - `reviewer_italian_1`: Review design, responsive styling, PASONA copywriting, and portal integration.
   - `reviewer_italian_2`: Review code quality, JS safety, calendar calculation, and fallback logic.
   - `challenger_italian_1`: Execute DOM and link tests across browsers/resolutions.
   - `challenger_italian_2`: Stress test reservation calendar edge cases and slot selection.
   - `auditor_italian_1`: Run forensic integrity checks (no mock cheats, authentic logic, clean implementation).
4. **Final Worker**:
   - `worker_deploy_1`: Execute final test suite check, git commit, and push.
