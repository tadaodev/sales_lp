# Empirical Challenge & Stress-Test Report

**Target**: Italian Restaurant Sample LP (`samples/italian/index.html`) & Top Portal Integration (`index.html`)  
**Investigator**: `challenger_italian_1` (Critic & Specialist)  
**Date**: 2026-08-21  
**Overall Risk Assessment**: **LOW (0 Critical, 0 High, 0 Medium, 0 Low Issues)**  
**Final Verdict**: **APPROVE**

---

## 1. Executive Summary

A comprehensive, adversarial empirical review and stress-test was conducted on the Italian Restaurant Sample LP (*TRATTORIA & PIZZERIA BELLA TAVOLA*), its centralized configuration (`config.js`), client-side interactivity engine (`italian.js`), visual asset wiring, and integration with the Top Portal (`index.html`).

All verification criteria — including strict relative path resolution, Linux/GitHub Pages exact-case sensitivity, single `<h1>` SEO compliance, heading hierarchy, 14-day 2-shift seat calendar calculations, deterministic fallback simulation, RFC 5545 `.ics` export, 1-tap LINE integration, and bidirectional navigation — have been empirically tested and proven robust.

---

## 2. Adversarial Challenge & Stress-Test Results

| # | Challenge Dimension | Test Scenario & Attack Vector | Expected Behavior | Actual Behavior | Result |
|---|---------------------|-------------------------------|-------------------|-----------------|:------:|
| 1 | **Relative Links & 404 Guard** | Traverse all `href`, `src`, CSS `url()`, and script tags across `index.html` and `samples/italian/index.html` | 0 root-relative (`/`) links, 0 broken 404 links, all files resolve to real disk assets | All links strictly use `./`, `../../`, or whitelisted schemes (`https:`, `tel:`, `mailto:`). All referenced files exist on disk. | **PASS** |
| 2 | **Linux Case Sensitivity** | Verify character-by-character casing of `assets/images/*`, `css/*`, and `js/*` against disk entries | Exact matching on disk preventing case-sensitive 404s on GitHub Pages Linux servers | `dolce_tiramisu.jpg`, `handmade_pasta.jpg`, `pizza_margherita.jpg`, `trattoria_interior.jpg`, `italian.css`, `config.js`, `italian.js` match 100%. | **PASS** |
| 3 | **DOM & SEO Structure** | Verify single `<h1>`, strict heading hierarchy (`<h1>` $\rightarrow$ `<h2>` $\rightarrow$ `<h3>` $\rightarrow$ `<h4>`), `<meta name="viewport">`, `lang="ja"`, OGP tags | Exactly 1 `<h1>`, no skipped heading levels, valid viewport & metadata | Exactly 1 `<h1>` (Line 85), perfect hierarchy, responsive viewport, `<meta description>`, and Open Graph tags present. | **PASS** |
| 4 | **Accessibility (A11y)** | Check `alt` attributes on all images, `aria-expanded` on FAQ accordion, `aria-selected` on tabs, `role="dialog"` on modal | All `<img>` have meaningful `alt` text, accessible ARIA attributes present | 6/6 `<img>` have descriptive `alt` tags. FAQ, tabs, and modal include WAI-ARIA compliance. | **PASS** |
| 5 | **New PASONA Structure** | Verify 7 required sections: Problem, Affinity, Solution, Offer, Narrowing, Action, FAQ | Clear emotional flow, 3 pillars of excellence, Before/After comparison, Matsutake 3-tier pricing, urgency limiters, dual CTA | All 7 sections present with `id` and `data-pasona` attributes. Includes松竹梅 dinner courses (¥4,800 / ¥6,800 / ¥9,800) and lunch sets. | **PASS** |
| 6 | **Bidirectional Navigation** | Navigate from Top Portal `index.html` (`#card-italian`, `data-category="dining"`) to `samples/italian/index.html` and back via header/footer return links | Symmetrical bidirectional navigation with zero dead ends | `index.html` contains card `#card-italian` and demo button linking to `./samples/italian/index.html`. Italian LP header and footer contain return links to `../../index.html`. | **PASS** |
| 7 | **14-Day Calendar Engine** | Render 14 consecutive days with 2 shifts (Lunch 5 slots / Dinner 6 slots = 11 slots/day = 154 slots across 14 days) | Dynamic table render with responsive horizontal scroll wrapper | Calendar generates 14 days dynamically, supports lunch/dinner shift toggle, responsive scroll container prevents overflow. | **PASS** |
| 8 | **Deterministic Fallback** | Execute calendar logic with `gasWebhookUrl: ""` (empty) and simulate network drops | Offline simulation generates reproducible ◯, △, ✕, and Tuesday 休 without crashing | Deterministic PRNG algorithm produces realistic slot distribution; Tuesday closed day strictly enforced; past hours on today auto-disabled. | **PASS** |
| 9 | **Calendar Export & LINE Sync** | Generate Google Calendar URL, RFC 5545 `.ics` blob, and LINE deep link upon reservation submission | Valid ISO timestamps matching course duration (e.g. 120min for bamboo), `VALARM` 2-hour reminder, percent-encoded LINE message | Google Calendar TEMPLATE link, RFC 5545 `.ics` with `DTSTART`/`DTEND`/`VALARM: -PT2H`, and prefilled LINE message generated flawlessly. | **PASS** |
| 10| **Script Loading Order** | Check script order in HTML head/body | `config.js` loaded strictly BEFORE `italian.js` | `<script src="./js/config.js"></script>` is at Line 1093, `<script src="./js/italian.js"></script>` is at Line 1094. | **PASS** |

---

## 3. Deep-Dive Stress Test Scenarios

### Stress Scenario 1: Unhandled Network Timeout & Malformed GAS Endpoint
- **Attack Scenario**: Setting `gasWebhookUrl` to an unreachable server or slow endpoint (>5 seconds).
- **Observed Defense**: `italian.js` wraps the remote fetch in `Promise.race` with a 4.5s timeout. When the timeout fires or network rejects, the `catch` handler logs a warning and seamlessly falls back to `computeDeterministicSlotStatus`. The user experience is 100% uninterrupted.

### Stress Scenario 2: Rapid Clicking and Disabled Slot Interception
- **Attack Scenario**: User rapidly clicks on full (✕) or regular holiday (休) slots, or attempts to submit an empty form.
- **Observed Defense**: Disabled slots render with `disabled="disabled"` and `aria-disabled="true"`. JavaScript click events are only bound to active `.calendar-slot-btn:not([disabled])`. Form validation blocks incomplete inputs, highlights missing fields with `.has-error`, and shifts focus to the first invalid field.

### Stress Scenario 3: Date Boundary Rollover (Month & Year Transitions)
- **Attack Scenario**: Date generation transitioning across month ends (e.g., Aug 31 $\rightarrow$ Sep 1), leap days (Feb 28 $\rightarrow$ Feb 29), and year ends (Dec 31 $\rightarrow$ Jan 1).
- **Observed Defense**: `new Date(today.getFullYear(), today.getMonth(), today.getDate() + i)` natively handles rollover arithmetic without off-by-one errors.

---

## 4. Verdict & Recommendation

**Verdict**: **APPROVE**

The Italian Restaurant Sample LP implementation and Top Portal Hub integration are of exceptional quality, fully adhering to all interface contracts, design standards, and zero-defect requirements. Ready for GitHub Pages deployment.
