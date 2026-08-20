# Project: LP Portal Hub & Aesthetic Salon LP (New PASONA)

## Architecture
- **Static Hosting**: 100% compatible with GitHub Pages project site subdirectories (`https://<username>.github.io/<repo>/`).
- **Path Protocol**: Strict relative paths (`./`, `../`, `../../`) without root-relative (`/`) dependencies.
- **Design Tokens**: 3-layer architecture (Primitive tokens -> Semantic tokens -> Component tokens) in pure CSS custom properties.
- **Styling & Effects**: Luxury aesthetic salon theme with Champagne Gold (`#C5A880`), Rose Beige (`#F7F3EE`), Deep Slate (`#1A1A24`), Warm White (`#FAFAF9`), and Glassmorphism (`backdrop-filter: blur(16px)`).
- **Copywriting Framework**: New PASONA (Problem -> Affinity -> Solution -> Offer -> Narrowing Down -> Action -> FAQ).
- **Interactivity**: Pure Vanilla JS (zero external runtime dependencies) for genre filtering, mobile scroll-triggered sticky CTA, FAQ accordion toggle, and booking modal form.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F1 | GitHub Pages Relative Path Navigation | Bidirectional navigation between portal (`./samples/aesthetic/index.html`) and LP (`../../index.html`) without 404s | M1, M2, M3 | ORIGINAL_REQUEST R1, R4 |
| F2 | 3-Layer Design Tokens & Base CSS | Color palette, serif/sans typography, glassmorphism, responsive grid & spacing tokens | M1 | ui-ux-pro-max, design-system |
| F3 | Top Portal Hero & Genre Hub | Header branding, hero intro, subtitle, live demo indicator | M2 | ORIGINAL_REQUEST R1 |
| F4 | Genre Filtering System | 7 industry filter tabs (Beauty, SaaS, Legal/Pro, Edu, Gourmet, Real Estate, EC) with vanilla JS filtering | M2 | ORIGINAL_REQUEST R1 |
| F5 | Featured LP & Teaser Cards | Highlight card for Aesthetic Salon LP + 6 teaser cards with status badges and animations | M2 | ORIGINAL_REQUEST R1 |
| F6 | PASONA Problem (P) | Hero with luxury headline, social proof badge, and aging skin / busy lifestyle problem cards | M3 | ORIGINAL_REQUEST R2, lp-pasona |
| F7 | PASONA Affinity (A) | Empathetic story & check list reframing customer struggle with scientific empathy | M3 | ORIGINAL_REQUEST R2, lp-pasona |
| F8 | PASONA Solution (S) | Proprietary fascia lifting + exosome technology, 3 Reasons to Choose, 5-step process, Before/After cards | M3 | ORIGINAL_REQUEST R2, lp-pasona |
| F9 | PASONA Offer (O) | Matsutake 3-tier pricing (Plum, Bamboo recommended at 72% off, Pine), full refund guarantee, 3 bonus gifts | M3 | ORIGINAL_REQUEST R2, lp-pasona |
| F10 | PASONA Narrowing Down (N) | Monthly limitation (First 10 clients only), eligibility criteria to maintain quality | M3 | ORIGINAL_REQUEST R2, lp-pasona |
| F11 | PASONA Action (A) Dual CTA | 30-second web reservation modal form + Official LINE reservation button | M3 | ORIGINAL_REQUEST R2, lp-pasona |
| F12 | FAQ Accordion Component | 6 key questions (pain, downtime, no-solicitation pledge, cancel policy, payment) with smooth toggle | M3 | ORIGINAL_REQUEST R2, R3 |
| F13 | Mobile Sticky CTA Bar | Bottom floating CTA bar with dual actions appearing after scrolling past hero | M3 | ORIGINAL_REQUEST R3 |
| F14 | Return to Portal Navigation | Floating luxury badge / header link to return to portal hub seamlessly | M3 | ORIGINAL_REQUEST R3 |
| F15 | E2E 4-Tier Automated Test Suite | Local HTTP test server, relative link validator, DOM validator, interactive UI validator across 4 tiers | E2E Track, M4 | ORIGINAL_REQUEST R4 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| E2E | E2E Testing Track | Design and implement 4-Tier test suite (`tests/`) & publish `TEST_READY.md` | none | DONE |
| M1 | Design Tokens & Base Assets | Shared CSS tokens (`css/tokens.css`, `css/reset.css`), base utility styles, SVG icons | none | DONE |
| M2 | Top Portal Page Implementation | Portal hub (`index.html`, `css/portal.css`, `js/portal.js`) with genre filtering and teaser cards | M1 | DONE |
| M3 | Aesthetic Salon LP Implementation | Salon LP (`samples/aesthetic/index.html`, `samples/aesthetic/css/aesthetic.css`, `samples/aesthetic/js/aesthetic.js`) with New PASONA copy, luxury UI, sticky CTA, FAQ accordion, booking modal | M1 | DONE |
| M4 | Final Milestone (E2E Test Pass & Hardening) | Pass 100% of 4-Tier tests, adversarial coverage verification, forensic audit verification | E2E, M1, M2, M3 | DONE |

## Interface Contracts
### Portal ↔ Samples Navigation
- Portal (`/index.html`): Link to aesthetic sample MUST use relative URL: `./samples/aesthetic/index.html`.
- Aesthetic LP (`/samples/aesthetic/index.html`): Return link to portal MUST use relative URL: `../../index.html` (or `../../` with standard directory index).

### Design Tokens Contract
- Tokens loaded in `:root` via `css/tokens.css` with standard semantic names:
  - `--color-primary: #C5A880;` (Champagne Gold)
  - `--color-primary-light: #DFCAAB;`
  - `--color-primary-dark: #9A7B54;`
  - `--color-bg-main: #FAFAF9;` (Warm Off-White)
  - `--color-bg-card: rgba(255, 255, 255, 0.85);`
  - `--color-text-primary: #1A1A24;`
  - `--color-text-secondary: #5A5A68;`
  - `--color-text-muted: #8E8E9F;`
  - `--color-accent-line: #06C755;` (LINE Official Green)
  - `--font-serif: 'Shippori Mincho', 'Noto Serif JP', 'Cinzel', serif;`
  - `--font-sans: 'Inter', 'Noto Sans JP', -apple-system, BlinkMacSystemFont, sans-serif;`
  - `--glass-bg: rgba(255, 255, 255, 0.72);`
  - `--glass-border: 1px solid rgba(255, 255, 255, 0.4);`
  - `--glass-blur: blur(16px);`

### DOM Structure Contract (PASONA Sections & QA Test Hooks)
- `data-pasona="problem"` -> Problem & Hero Section (`#problem`, `#hero`)
- `data-pasona="affinity"` -> Affinity & Empathy Section (`#affinity`)
- `data-pasona="solution"` -> Solution & 3 Reasons Section (`#solution`, `#reasons`, `#before-after`)
- `data-pasona="offer"` -> Offer & 3-tier Pricing Section (`#offer`, `#pricing`)
- `data-pasona="narrowing"` -> Narrowing Down & Urgency Section (`#narrowing`)
- `data-pasona="action"` -> Dual CTA & Booking Modal Section (`#action`, `#booking-modal`)
- `data-pasona="faq"` -> FAQ Accordion Section (`#faq`)
- Sticky Mobile Bar: `#mobile-sticky-cta` with class `.is-visible` when scrolled past 350px.
- Portal Filtering: `[data-filter-tab]` and `.lp-card[data-category="..."]`.

## Code Layout
```
c:/Project/事業案/05_LP作成/
├── index.html                           # Top Portal Hub (Genre selector)
├── css/
│   ├── tokens.css                       # 3-Layer Design Tokens (CSS Variables)
│   ├── reset.css                        # Modern CSS Reset
│   └── portal.css                       # Portal page styling & responsive grid
├── js/
│   └── portal.js                        # Vanilla JS genre filtering logic
├── samples/
│   └── aesthetic/
│       ├── index.html                   # Aesthetic Salon LP (New PASONA)
│       ├── css/
│       │   └── aesthetic.css            # Luxury Salon LP styling (Glassmorphism)
│       └── js/
│           └── aesthetic.js             # Sticky CTA, FAQ accordion, booking modal logic
└── tests/
    ├── test_server.py                   # Local static HTTP server runner
    ├── validate_links.py                # Relative link & asset validator (404-free)
    ├── validate_pasona_dom.py           # PASONA DOM & semantic validator
    ├── test_interactive_ui.py           # Portal filter, accordion, sticky CTA test
    └── run_all_tests.py                 # Integrated 4-Tier test runner
```
