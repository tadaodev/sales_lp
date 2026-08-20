# E2E Test Infra: LP Portal Hub & Aesthetic Salon LP

## Test Philosophy
- Opaque-box, requirement-driven. Zero external heavy dependencies (pure Python standard library `urllib`, `html.parser`, `http.server`).
- Methodology: Category-Partition + BVA + Pairwise + Workload Testing.

## Feature Inventory
| # | Feature | Source (requirement) | Tier 1 | Tier 2 | Tier 3 |
|---|---------|---------------------|:------:|:------:|:------:|
| 1 | Relative Path Navigation & 404-free links | ORIGINAL_REQUEST §R1, R4 | ✓ | ✓ | ✓ |
| 2 | Portal Hero & 7-Genre Filtering Hub | ORIGINAL_REQUEST §R1 | ✓ | ✓ | ✓ |
| 3 | Aesthetic Featured & Teaser Cards | ORIGINAL_REQUEST §R1 | ✓ | ✓ | ✓ |
| 4 | PASONA Problem & Affinity | ORIGINAL_REQUEST §R2 | ✓ | ✓ | ✓ |
| 5 | PASONA Solution & 3 Reasons & Before/After | ORIGINAL_REQUEST §R2 | ✓ | ✓ | ✓ |
| 6 | PASONA Offer (Matsutake Pricing & Guarantee) | ORIGINAL_REQUEST §R2 | ✓ | ✓ | ✓ |
| 7 | PASONA Narrowing Down & Dual CTAs | ORIGINAL_REQUEST §R2 | ✓ | ✓ | ✓ |
| 8 | FAQ Accordion Interactive Component | ORIGINAL_REQUEST §R2, R3 | ✓ | ✓ | ✓ |
| 9 | Mobile Sticky CTA Bar on Scroll | ORIGINAL_REQUEST §R3 | ✓ | ✓ | ✓ |
| 10 | Return to Portal Navigation | ORIGINAL_REQUEST §R3 | ✓ | ✓ | ✓ |
| 11 | Static HTTP Server Compatibility | ORIGINAL_REQUEST §R4 | ✓ | ✓ | ✓ |

## Test Architecture
- Test runner: `tests/run_all_tests.py`
- Server runner: `tests/test_server.py` (simulates root and subdirectory hosting)
- Link & Asset validator: `tests/validate_links.py` (validates strict relative paths and 404s)
- PASONA DOM validator: `tests/validate_pasona_dom.py` (validates all PASONA sections, semantic headings, meta tags)
- Interactive validator: `tests/test_interactive_ui.py` (validates JS filtering logic, accordion state, sticky CTA rules)

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | 30s Working Woman Persona: Portal -> Beauty Filter -> Aesthetic LP -> Solution & Pricing -> Web Modal / LINE CTA | F1-F14 | High |
| 2 | Salon Owner / Auditor Quality Inspection: Mobile 375px -> Sticky CTA -> FAQ Accordion -> Return to Portal -> All Genre Cards | F1-F15 | High |

## Coverage Thresholds
- Tier 1: Feature Coverage (10 test cases)
- Tier 2: Boundary & Corner Cases (8 test cases)
- Tier 3: Cross-Feature Interactions (5 test cases)
- Tier 4: Real-World Scenarios (2 complete journeys)
- Total: 25 test cases + 2 real-world workload scenarios (100% pass required)
