# E2E Test Infra: Aesthetic Salon LP & Reservation System

## Test Philosophy
- Opaque-box, requirement-driven, zero external dependencies (Python standard library only).
- Methodology: Category-Partition + Boundary Value Analysis + Pairwise Combinatorial Testing + Real-World Workload Testing.

## Feature Inventory & Test Mapping
| # | Feature | Source | Tier 1 (Coverage) | Tier 2 (Boundary) | Tier 3 (Cross-Feature) | Tier 4 (Scenario) |
|---|---------|--------|:----------------:|:-----------------:|:---------------------:|:-----------------:|
| F1 | 14-Day Calendar Grid | ORIGINAL_REQUEST §R1 | TC-CAL-01..05 | TC-CAL-B01..B05 | TC-INT-01 | TC-APP-01 |
| F2 | Slot Status (◯/△/✕/休) | ORIGINAL_REQUEST §R1 | TC-SLT-01..05 | TC-SLT-B01..B05 | TC-INT-02 | TC-APP-01 |
| F3 | Tap-to-Form Auto-Fill | ORIGINAL_REQUEST §R1 | TC-TAP-01..05 | TC-TAP-B01..B05 | TC-INT-03 | TC-APP-02 |
| F4 | GAS Backend & Payloads | ORIGINAL_REQUEST §R2 | TC-GAS-01..05 | TC-GAS-B01..B05 | TC-INT-04 | TC-APP-03 |
| F5 | Central Config (`config.js`) | ORIGINAL_REQUEST §R2 | TC-CFG-01..05 | TC-CFG-B01..B05 | TC-INT-05 | TC-APP-03 |
| F6 | Thank-You View & Res ID | ORIGINAL_REQUEST §R3 | TC-TNK-01..05 | TC-TNK-B01..B05 | TC-INT-06 | TC-APP-04 |
| F7 | Google / Apple (.ics) Sync | ORIGINAL_REQUEST §R3 | TC-ICS-01..05 | TC-ICS-B01..B05 | TC-INT-07 | TC-APP-04 |
| F8 | LINE Official Integration | ORIGINAL_REQUEST §R3 | TC-LIN-01..05 | TC-LIN-B01..B05 | TC-INT-08 | TC-APP-04 |
| F9 | Deterministic Fallback | ORIGINAL_REQUEST §R3 | TC-FBK-01..05 | TC-FBK-B01..B05 | TC-INT-09 | TC-APP-05 |
| F10 | Relative Path & Deployment | ORIGINAL_REQUEST §R4 | TC-DEP-01..05 | TC-DEP-B01..B05 | TC-INT-10 | TC-APP-05 |

## Test Architecture
- **Runner**: `python tests/run_all_tests.py`
- **Sub-modules**:
  - `tests/test_server.py`: HTTP serving & routing
  - `tests/validate_links.py`: Relative paths, 404s, case sensitivity
  - `tests/validate_pasona_dom.py`: DOM structures, accessibility, heading hierarchy
  - `tests/test_interactive_ui.py`: Interactive components, calendar, slots, form auto-fill, thank-you screen, fallback, config schema
- **Pass/Fail Semantics**: Exit Code 0 = PASS, Exit Code > 0 = FAIL

## Coverage Thresholds
- Tier 1: ≥ 50 test cases (≥ 5 per feature)
- Tier 2: ≥ 50 boundary test cases
- Tier 3: ≥ 10 cross-feature combination test cases
- Tier 4: ≥ 5 realistic customer booking workflows
- **Total Minimum Goal**: ≥ 115 test cases
