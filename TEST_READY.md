# E2E Test Suite Ready: LP Portal Hub & Aesthetic Salon LP (New PASONA)

## 1. Test Architecture Overview
The automated 4-tier test suite is implemented using pure Python standard library (`http.server`, `urllib.request`, `html.parser`, `re`, `socket`, `threading`, `pathlib`). It requires **zero external heavy dependencies** or build steps, guaranteeing 100% static hosting compatibility on GitHub Pages (root and `/repo/` subdirectories).

```
tests/
├── test_server.py           # Local Static HTTP Server Runner (Root & Subdirectory simulation)
├── validate_links.py        # Strict Relative Link & Asset Validator (Case-sensitive, 404-free)
├── validate_pasona_dom.py   # New PASONA DOM & Semantic Heading Validator (SEO / A11y)
├── test_interactive_ui.py   # Interactive UI & Vanilla JS Validator (Filter, Accordion, Sticky CTA)
└── run_all_tests.py         # Integrated 4-Tier Master Test Runner
```

---

## 2. Test Execution Commands

### Integrated 4-Tier Master Suite Runner
```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8;
$env:PYTHONUTF8=1;
python tests/run_all_tests.py
```

### Individual Test Modules
```powershell
# 1. HTTP Server & Subdirectory Simulation
python tests/test_server.py

# 2. Strict Relative Link & 404 Validation
python tests/validate_links.py

# 3. PASONA DOM & Heading Hierarchy Validation
python tests/validate_pasona_dom.py

# 4. Interactive UI & Component Logic Validation
python tests/test_interactive_ui.py
```

---

## 3. Test Tier Inventory & Coverage Matrix

### Tier 1: Feature Coverage (10 Test Cases)
| ID | Test Name | Target File | Verification Criteria |
|:---|:----------|:------------|:----------------------|
| **TC-T1-01** | Portal Genre Hub & Cards DOM | `index.html` | Genre filter tabs and LP card elements generated |
| **TC-T1-02** | Portal Filtering Logic | `js/portal.js` | Tab click filters active cards |
| **TC-T1-03** | Portal → Aesthetic LP Relative Link | `index.html` | Relative path `./samples/aesthetic/index.html` |
| **TC-T1-04** | Aesthetic LP → Portal Return Link | `samples/aesthetic/index.html` | Relative path `../../index.html` |
| **TC-T1-05** | New PASONA 7 Sections Complete | `samples/aesthetic/index.html` | P-A-S-O-N-A-FAQ all present |
| **TC-T1-06** | Matsutake 3-tier Pricing Display | `samples/aesthetic/index.html` | 3 pricing cards with recommended highlight |
| **TC-T1-07** | Before/After Visual Comparison | `samples/aesthetic/index.html` | Evidence transformation UI present |
| **TC-T1-08** | LINE & Web Reservation Dual CTAs | `samples/aesthetic/index.html` | Both LINE link and Web Modal trigger present |
| **TC-T1-09** | FAQ Accordion Initial DOM | `samples/aesthetic/index.html` | >= 3 FAQ items with `aria-expanded` |
| **TC-T1-10** | Booking Modal DOM Structure | `samples/aesthetic/index.html` | Name/contact inputs and submit structure |

### Tier 2: Boundary & Corner Cases (8 Test Cases)
| ID | Test Name | Target Layer | Verification Criteria |
|:---|:----------|:-------------|:----------------------|
| **TC-T2-01** | Mobile 375px Viewport & No Horizontal Scroll | Meta & Viewport | `name="viewport"` width=device-width |
| **TC-T2-02** | Desktop 1920px Wide Max-Width Centering | CSS Tokens & Grid | CSS `max-width` constraint applied |
| **TC-T2-03** | Empty Category State (Coming Soon) | Portal Filtering | Displays clean Coming Soon without broken layout |
| **TC-T2-04** | Invalid URL Hash Safe Fallback | `js/portal.js` | Non-existent hash falls back gracefully |
| **TC-T2-05** | FAQ Rapid Sequential Toggle Idempotency | `samples/aesthetic/js/aesthetic.js` | Rapid clicking converges to stable state |
| **TC-T2-06** | Image Fallback & SVG Asset Robustness | Assets & Markup | Valid alt tags and inline SVG definitions |
| **TC-T2-07** | Progressive Enhancement (NoScript SSR) | Static Markup | Full copy/pricing legible without JS |
| **TC-T2-08** | Form Required Field Validation | Form Markup & JS | Prevents empty submission via `required` |

### Tier 3: Cross-Feature Combinations (5 Test Cases)
| ID | Test Name | Target Flow | Verification Criteria |
|:---|:----------|:------------|:----------------------|
| **TC-T3-01** | Filter → LP Transition → Sticky CTA → Booking | E2E Conversion | Seamless journey with relative links & scroll |
| **TC-T3-02** | LP FAQ Toggle → Return to Portal → Re-entry | Navigation Loop | Bidirectional link integrity without state leak |
| **TC-T3-03** | Sticky CTA → Open Modal → ESC Close → CTA Intact | Modal & Sticky CTA | Keyboard accessibility & focus restoration |
| **TC-T3-04** | Pricing Plan Selection → Modal Form Pre-fill | Offer & Action | Selected course reflects in reservation form |
| **TC-T3-05** | Subdirectory Full Static Asset Integrity | `http.server` Subdir | 0 404s, 0 root-relative `/` links |

### Tier 4: Real-World Scenarios (2 Comprehensive Journeys)
| ID | Scenario Name | Description | Complexity |
|:---|:--------------|:------------|:-----------|
| **TC-T4-01** | 30s Working Woman Persona Journey | Portal -> Beauty Filter -> Aesthetic LP -> Solution & Pricing -> Web Modal / LINE CTA | High |
| **TC-T4-02** | Salon Owner / Auditor Quality Inspection | Multi-device (375px/1440px) -> Subdirectory Hosting -> FAQ Accordion -> Return to Portal | High |

---

## 4. Pass / Fail Criteria & Exit Codes
- **Pass (Exit Code 0)**: All 25 test cases across Tier 1 to Tier 3, plus 2 Tier 4 user scenarios pass with 0 failures.
- **Fail (Exit Code 1)**: Any broken link, 404, missing PASONA section, heading hierarchy error, or JS logic fault causes immediate failure with detailed diagnostic output (file path, line number, and remediation guidance).
