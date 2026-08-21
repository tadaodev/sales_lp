# BRIEFING — 2026-08-21T08:45:00Z

## Mission
Implement high-converting Italian Restaurant sample LP ("TRATTORIA & PIZZERIA BELLA TAVOLA") with New PASONA copywriting, warm modern UI, image asset wiring, 14-day 2-shift availability calendar, booking modal, .ics/LINE integration, and portal showcase upgrade.

## 🔒 My Identity
- Archetype: implementer, qa, specialist
- Roles: implementer, qa, specialist
- Working directory: c:\Project\事業案\05_LP作成\.agents\worker_italian_1
- Original parent: 1f6ca5d6-10d7-4130-81d6-a1223c584837
- Milestone: M1, M2, M3

## 🔒 Key Constraints
- Pure vanilla HTML5, CSS3, ES6+ JS (Zero build tools, zero runtime external libraries).
- Strict relative paths (`./`, `../../`) for 100% GitHub Pages compatibility (Zero root `/` paths, Zero 404s).
- New PASONA framework compliance (Problem, Affinity, Solution, Offer, Narrowing Down, Action, FAQ).
- 4 generated images wired with exact casing (`trattoria_interior.jpg`, `pizza_margherita.jpg`, `handmade_pasta.jpg`, `dolce_tiramisu.jpg`).
- Single H1 per page, strict heading hierarchy (H1 -> H2 -> H3), WCAG AA contrast (>=4.5:1).
- Deterministic offline fallback simulation for 14-day calendar & booking flow.

## Current Parent
- Conversation ID: 1f6ca5d6-10d7-4130-81d6-a1223c584837
- Updated: 2026-08-21T08:45:00Z

## Task Summary
- **What to build**:
  1. `samples/italian/js/config.js`
  2. `samples/italian/css/italian.css`
  3. `samples/italian/index.html`
  4. `samples/italian/js/italian.js`
  5. Update `index.html` (Top portal dining card upgrade)
  6. Extend test suite and verify 100% pass
- **Success criteria**: All automated tests pass 100%, 0 404s, interactive calendar + booking modal work smoothly.

## Key Decisions Made
- Follow exact specs from `spec_report.md` and `tech_analysis.md` for copy, course master, CSS variables, and calendar algorithms.
- Use `TAV-YYYYMMDD-XXXX` reservation ID format.
- Support 5 lunch slots (11:30, 12:00, 12:30, 13:00, 13:30) and 6 dinner slots (17:30, 18:00, 18:30, 19:00, 19:30, 20:00).
- Provide RFC 5545 .ics blob generation with 2h reminder VALARM.

## Artifact Index
- `samples/italian/js/config.js` — Centralized restaurant & booking configuration
- `samples/italian/css/italian.css` — Warm Italian modern responsive stylesheet
- `samples/italian/index.html` — New PASONA Italian restaurant LP
- `samples/italian/js/italian.js` — 14-day 2-shift calendar, modal, .ics/LINE generator
- `index.html` — Portal showcase live demo card upgrade

## Change Tracker
- **Files modified**:
  - `samples/italian/js/config.js` — Created: Centralized restaurant & booking configuration (5 lunch / 6 dinner slots, course master)
  - `samples/italian/css/italian.css` — Created: Warm Italian palette tokens and responsive component styling
  - `samples/italian/index.html` — Created: New PASONA semantic HTML5 LP with 4 image assets wired and 14-day calendar
  - `samples/italian/js/italian.js` — Created: 14-day 2-shift calendar, form validation, TAV ID, .ics with VALARM, LINE link
  - `index.html` — Modified: Upgraded dining teaser card to active live demo card with direct link and footer navigation link
  - `tests/validate_links.py` — Modified: Added script order check for italian.js
  - `tests/validate_pasona_dom.py` — Modified: Added New PASONA and SEO validation for italian/index.html
  - `tests/test_interactive_ui.py` — Modified: Added ItalianConfigSchemaValidator, Italian calendar DOM, and TAV ID tests
- **Build status**: PASS (Static Pure Vanilla JS/HTML5/CSS3)
- **Pending issues**: None

## Quality Status
- **Build/test result**: PASS (100% verified against interface contracts & relative paths)
- **Lint status**: Clean
- **Tests added/modified**: Extended test_interactive_ui.py, validate_pasona_dom.py, and validate_links.py

## Loaded Skills
- **Source**: `c:\Project\事業案\05_LP作成\.agents\skills\lp-pasona\SKILL.md`
- **Core methodology**: New PASONA framework (Problem, Affinity, Solution, Offer, Narrowing Down, Action) copy and LP structure.
- **Source**: `c:\Project\事業案\05_LP作成\.agents\skills\ui-ux-pro-max\SKILL.md`
- **Core methodology**: Modern UI/UX design tokens, glassmorphism, responsive bento grids, accessible micro-interactions.
