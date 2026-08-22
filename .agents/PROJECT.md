# Project: Sales LP Official Store-Model Refresh

## Architecture
- Two Flagship Landing Pages:
  1. Bakery LP: `samples/bakery/` (`index.html`, `css/bakery.css`, `js/config.js`, `js/bakery.js`)
  2. Washoku Izakaya LP: `samples/washoku/` (`index.html`, `css/washoku.css`, `js/config.js`, `js/washoku.js`)
- Test & Quality Assurance Suite: `tests/` (`run_all_tests.py`, `validate_pasona_dom.py`, `validate_links.py`, `validate_aria_wcag.py`, etc. — 179+ tests)
- Production Deployment: GitHub Pages (`main` branch)

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Bakery Negative Agitation Removal | Remove `.pain-points-block`, "パサつき", "物足りなさ", commercial comparison table | M1 | ORIGINAL_REQUEST |
| 2 | Bakery Hero & Live Badge | Firewood stone-oven baguette sizzle + "本日営業中 07:30〜18:30" badge + reserve CTA + LINE button | M1 | ORIGINAL_REQUEST |
| 3 | Bakery Craftsmanship Concept | 3 commitments: French Wheat T65, 72h cold fermentation levain, 260℃ direct stone oven + Masato Hyuga story | M1 | ORIGINAL_REQUEST |
| 4 | Bakery Fresh Bake Timetable | 4 daily bake batches (08:00 / 11:30 / 14:00 / 16:30) with status indicators | M1 | ORIGINAL_REQUEST |
| 5 | Bakery Assortment BOX Menu | 松竹梅 3-tier Box (梅¥1,980 / 竹¥3,480 ★人気No.1 / 松¥5,800) + alacarte menu items | M1 | ORIGINAL_REQUEST |
| 6 | Bakery 14-Day Reserve Calendar | 14-day takeout booking with 30-min pickup slots, dynamic availability, modal auto-fill | M1 | ORIGINAL_REQUEST |
| 7 | Bakery Access & Social MEO | Google Map direct link, address, phone, business hours, `@boulangerie_artisanale` Instagram, JSON-LD Schema | M1 | ORIGINAL_REQUEST |
| 8 | Washoku Negative Agitation Removal | Remove `#problem` 4大トラブル, failure anxiety copy, shame/worry text, negative competitor comparison | M2 | ORIGINAL_REQUEST |
| 9 | Washoku Hero & Live Badge | Steaming hot pot & sashimi platter sizzle + Shinbashi 2-min walk & private room badge + instant reserve CTA | M2 | ORIGINAL_REQUEST |
| 10 | Washoku Hospitality & 4 Specialties | 3 reasons to choose (All private rooms 2-40p, Toyosu fresh fish & Bincho charcoal yakitori, 2-hr all-you-can-drink clear pricing) + 4 signature dishes | M2 | ORIGINAL_REQUEST |
| 11 | Washoku Banquet Courses (松竹梅) | 松竹梅 courses (梅¥3,980 / 竹¥4,980 ★人気No.1 / 松¥6,500) all with 2-hr all-you-can-drink and tax included | M2 | ORIGINAL_REQUEST |
| 12 | Washoku Private Room Guide | Complete floor/room guide (2-6p, 8-16p, max 40p horigotatsu, free mic/projector) | M2 | ORIGINAL_REQUEST |
| 13 | Washoku 14-Day Seat Calendar | 14-day banquet seat availability (◯・△・✕・Sun holiday) + Web modal & LINE tentative booking | M2 | ORIGINAL_REQUEST |
| 14 | Washoku Access & Invoice Compliance | Access guide, map, invoice registration # T1234567890123, phone 03-6789-0123, business hours | M2 | ORIGINAL_REQUEST |
| 15 | Test Suite Harmonization | Update validators & scenario tests for official store DOM while ensuring 179+ tests pass 100% | M3 | ORIGINAL_REQUEST |
| 16 | Git Commit & Production Main Push | Clean Git commits in Japanese and push to main branch for GitHub Pages deployment | M4 | ORIGINAL_REQUEST |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Bakery LP Official Store Refresh | `samples/bakery/` (HTML, CSS, JS) | none | DONE |
| M2 | Washoku LP Official Store Refresh | `samples/washoku/` (HTML, CSS, JS) | none | DONE |
| M3 | Test Suite Harmonization & Verification | `tests/` and full test execution (179+ tests) | M1, M2 | DONE |
| M4 | Production Git Commit & Main Push | Git commit & push | M3 | DONE |

## Code Layout & Ownership
- `samples/bakery/**`: Owned exclusively by `worker_bakery_1`
- `samples/washoku/**`: Owned exclusively by `worker_washoku_1`
- `tests/**`: Owned exclusively by `worker_tests_1`
- `.agents/**`: Orchestrator and agent metadata
