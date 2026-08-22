# Dispatch Record — worker_washoku_1

## 2026-08-23T07:24:45+09:00

### Invoking Task
- **Role**: `implementer`, `qa`, `specialist`
- **Working directory**: `c:/Project/事業案/05_LP作成/.agents/worker_washoku_1/`
- **Original User Request**: `c:/Project/事業案/05_LP作成/.agents/ORIGINAL_REQUEST.md`
- **Survey Report**: `c:/Project/事業案/05_LP作成/.agents/survey_washoku_explorer/handoff.md`
- **Project Index**: `c:/Project/事業案/05_LP作成/.agents/PROJECT.md`

### Requirements
1. Complete removal of negative agitation (e.g. `#problem`, "幹事様が夜も眠れなくなる居酒屋選びの4大トラブル", hero failure anxiety, `#affinity` shame/worry text, Before/After competitor comparisons).
2. Official store MEO/Instagram optimization:
   - **Hero**: Steaming hot pot & sashimi platter sizzle + Shinbashi 2-min walk & private room badge + instant booking CTA
   - **Hospitality**: 3 major reasons to choose (All private rooms 2-40 persons, Toyosu fresh fish & Bincho charcoal yakitori, 2-hr all-you-can-drink clear tax-included accounting) + 4 signature dishes (豊洲鮮魚5点盛り, 土佐備長炭火焼き鳥, 特選和牛もつ鍋, 地酒30種飲み放題)
   - **Courses**: Banquet Course List (松竹梅: 梅¥3,980 / 竹¥4,980 ★人気No.1 / 松¥6,500) all with 2-hr all-you-can-drink and tax included
   - **Atmosphere**: Private room guide from small parties to max 40 persons horigotatsu (free mic/projector)
   - **Reservation**: 14-day banquet seat availability calendar (◯・△・✕・Sun holiday) -> Web booking / LINE tentative reservation
   - **Access**: Access map, directions, invoice registration number `T1234567890123`, phone `03-6789-0123`, business hours
3. Clean up `samples/washoku/css/washoku.css` and update header navigation anchor links (`#hospitality`, `#courses`, `#atmosphere`, `#reservation`, `#access`, etc.) so there are no broken links.
4. Verify HTML semantics (single H1, clean heading hierarchy, WCAG contrast, ARIA tags).
5. Run tests (e.g., `python tests/validate_pasona_dom.py`, `python tests/validate_links.py`, `python tests/run_all_tests.py` with terminal UTF-8 encoding).
