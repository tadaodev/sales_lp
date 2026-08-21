# Execution Plan — Bakery & Washoku Izakaya LP Suite (orchestrator_5)

## Overview
Develop and deploy two flagship landing pages:
1. **BOULANGERIE ARTISANALE** (Hard-style Bakery LP in `samples/bakery/`)
2. **個室和食 旬彩 縁 -ENISHI-** (Reasonable Banquet Washoku Izakaya LP in `samples/washoku/`)

Integrate both into Top Portal Hub (`index.html`), expand test suite to 150+ cases (100% pass), pass forensic audit and multi-agent review, and push to GitHub Pages `main` branch.

## Milestones & Execution Stages

### Stage 0: Survey & Spec Exploration
- Subagents:
  - `spec_miner_bakery_1` (Spec Miner: French Hard Bakery requirements, sourdough/levain story, baking schedule, 3-tier box pricing, takeout calendar)
  - `spec_miner_washoku_1` (Spec Miner: Washoku Izakaya requirements, banquet organizer problem-solving, seasonal hotpot/sashimi, 3-tier banquet pricing, seat booking calendar)
  - `explorer_portal_qa_1` (Explorer: Existing portal structure, 5-card layout, test suite architecture, link consistency rules)

### Stage 1: Implementation (Parallel Workers)
- Subagents:
  - `worker_bakery_m1`: Builds `samples/bakery/index.html`, `css/bakery.css`, `js/config.js`, `js/bakery.js`, creates 4 visual image assets (`hero_baguette.jpg`, `baker_craftsman.jpg`, `campagne_slice.jpg`, `bakery_display.jpg`).
  - `worker_washoku_m2`: Builds `samples/washoku/index.html`, `css/washoku.css`, `js/config.js`, `js/washoku.js`, creates 4 visual image assets (`hero_banquet_nabe.jpg`, `sashimi_platter.jpg`, `yakitori_charcoal.jpg`, `washoku_private_room.jpg`).

### Stage 2: Portal Integration & Test Suite Expansion
- Subagents:
  - `worker_portal_m3`: Updates `index.html` and `css/portal.css` to feature 5 flagship demo cards with live navigation, filter badges, and quick jump buttons.
  - `worker_test_m4`: Expands `tests/validate_links.py`, `tests/validate_pasona_dom.py`, `tests/test_interactive_ui.py`, `tests/test_server.py`, `tests/run_all_tests.py` to cover all 5 samples with 150+ test cases at 100% pass rate.

### Stage 3: Multi-Agent Verification Gate
- Subagents:
  - `reviewer_1` & `reviewer_2`: Independent code and design review.
  - `challenger_1` & `challenger_2`: Empirical and interactive stress testing.
  - `auditor_1`: Forensic integrity audit (non-negotiable hard veto).

### Stage 4: Production Deployment
- Subagents:
  - `worker_deploy_m6`: Git add, commit, and push to GitHub `main` branch, verify remote status.
