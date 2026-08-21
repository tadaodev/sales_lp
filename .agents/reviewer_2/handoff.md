# Handoff Report — Reviewer 2 (Reservation Calendar Engines, Booking Workflows & Adversarial Quality Review)

## 1. Observation

### Obs-1: Calendar & Slot Engine Calculation & Closed Day Logic
- **Bakery (`samples/bakery/js/config.js:37-41`, `samples/bakery/js/bakery.js:59-108, 133-280`)**:
  - 14-day calculation: `daysToShow: 14`, generated via `today = new Date()` iteration.
  - Closed days: `closedDays: [1, 2]` (月曜日・火曜日). Verified in `computeDeterministicSlotStatus`: `if (closedDays.indexOf(jsWeekday) !== -1) return 'closed';`. Correctly renders `休` symbol with `aria-disabled="true"`.
  - Time slots: `['08:00', '11:00', '14:00', '16:30']` (4 baking batches).
  - Past slot disabling: Checks current time on today (`if (now.getHours() > slotH || (now.getHours() === slotH && now.getMinutes() >= slotM)) return 'full';`).
  - Auto-population: Clicking a slot cell populates `#form-datetime` (`dateJp + ' ' + timeVal + ' 受取'`), smoothly opens the modal via `openBakeryBookingModal()`, and focuses `#form-name`.
- **Washoku (`samples/washoku/js/config.js:51-59`, `samples/washoku/js/washoku.js:87-154, 157-251`)**:
  - 14-day calculation: `daysToShow: 14`, generated via `new Date(now.getFullYear(), now.getMonth(), now.getDate() + i)` loop.
  - Closed days: `closedDays: [0]` (日曜日). Verified in `computeDeterministicSlotStatus`: `if (closedDays.indexOf(jsWeekday) !== -1) return 'closed';`. Rendered as disabled button with `status-closed` and `休` symbol.
  - Time slots: `['17:00', '18:30', '19:30', '20:30']` (4 banquet shifts).
  - Auto-population: Slot click sets `form-date` (`dateIso`) and `form-time` (`timeStr`), opening `#booking-modal` via `openBookingModalWithSlot()`.

### Obs-2: Pricing Plans & Preselection Handlers
- **Bakery (`samples/bakery/js/config.js:81-126`, `samples/bakery/js/bakery.js:319-342`, `samples/bakery/index.html:430-512`)**:
  - 3-tier Matsutake cards + alacarte:
    - Plum (梅): `【梅】モーニングハードセット (¥1,980)` (id: `plum`)
    - Bamboo (竹): `【竹★人気No.1】人気定番7種詰め合わせBOX (¥3,480)` (id: `bamboo`)
    - Pine (松): `【松】プレミアム薪窯バゲット＆贅沢オードブルBOX (¥5,800)` (id: `pine`)
    - Alacarte: `【店頭お取り置き】お好きなパンを当日レジ精算 (¥0)` (id: `alacarte`)
  - Buttons (`.btn-select-plan`, `.btn-select-alacarte`) trigger `initPlanCardSelection()`, setting `#form-plan.value = planId` and opening modal.
- **Washoku (`samples/washoku/js/config.js:79-175`, `samples/washoku/js/washoku.js:256-265`, `samples/washoku/index.html:400-485`)**:
  - 3-tier Matsutake cards + alacarte:
    - Plum (梅): `梅：旬彩カジュアル宴会コース（全7品 / 2h飲み放題付）` (¥3,980)
    - Bamboo (竹): `竹：名物鍋＆豊洲鮮魚の王道宴会コース（全8品 / 2h飲み放題付）★人気No.1` (¥4,980)
    - Pine (松): `松：特選和牛＆極上舟盛り 贅沢極みコース（全9品 / 2h地酒30種プレミアム飲み放題付）` (¥6,500)
    - Alacarte: `お席のみのご予約（当日アラカルト注文）` (¥0)
  - Buttons (`[data-course-select]`) trigger `initCoursePreselectors()`, setting `#form-plan-select.value = courseId` and opening modal.

### Obs-3: Offline Fallback & Reliability
- Both Bakery and Washoku implement deterministic string hashing algorithms using `simulationSeedSalt`:
  - Bakery (`samples/bakery/js/bakery.js:88-107`): Hash seed calculation `(seed * 31 + charCode) % 4294967296` with weekend and peak slot weighting.
  - Washoku (`samples/washoku/js/washoku.js:115-132`): Hash seed calculation with weekend and peak dinner slot weighting.
- Graceful Mock Handling:
  - When `cfg.gasWebhookUrl` is blank or unset, no live network request is attempted, avoiding console errors.
  - When configured, `fetch` calls are protected by timeout promise races and `catch` blocks with console warnings, preventing uncaught exceptions.

### Obs-4: Booking Completion & External Integrations
- **Dynamic Reservation ID**:
  - Bakery: `BAK-YYYYMMDD-XXXX` (e.g., `BAK-20260822-4A7F`) generated in `samples/bakery/js/bakery.js:534-544`.
  - Washoku: `WSH-YYYYMMDD-XXXX` (e.g., `WSH-20260822-B8E2`) generated in `samples/washoku/js/washoku.js:394-398`.
- **Google Calendar 1-Click Link**:
  - Bakery (`samples/bakery/js/bakery.js:605-616`): Generates 30-min pickup event URL (`startIso` to `endIso`) with URL-encoded parameters.
  - Washoku (`samples/washoku/js/washoku.js:472-500`): Generates 120-min banquet event URL with URL-encoded party size, room preference, and contact details.
- **RFC 5545 `.ics` File Generation**:
  - Bakery (`samples/bakery/js/bakery.js:619-656`): Compliant VCALENDAR / VEVENT with `BEGIN:VALARM` / `TRIGGER:-PT2H` (2 hours prior), `\r\n` CRLF delimiters, downloaded as `bakery_pickup_BAK-YYYYMMDD-XXXX.ics`.
  - Washoku (`samples/washoku/js/washoku.js:504-555`): Compliant VCALENDAR / VEVENT with `BEGIN:VALARM` / `TRIGGER:-PT2H`, `\r\n` CRLF delimiters, downloaded as `ENISHI_Banquet_WSH-YYYYMMDD-XXXX.ics`.
- **LINE Deep Link**:
  - Bakery: `https://line.me/R/oaMessage/@boulangerie_art/?` + encoded Japanese booking confirmation message.
  - Washoku: `https://line.me/R/oaMessage/@enishi_washoku/?` + encoded Japanese banquet consultation message.

### Obs-5: Strict Relative Paths
- `index.html`: Links to `./css/tokens.css`, `./css/portal.css`, `samples/aesthetic/index.html`, `samples/italian/index.html`, `samples/legal/index.html`, `samples/bakery/index.html`, `samples/washoku/index.html`.
- `samples/bakery/index.html`: Links to `../../index.html`, `../../css/reset.css`, `../../css/tokens.css`, `./css/bakery.css`, `./js/config.js`, `./js/bakery.js`.
- `samples/washoku/index.html`: Links to `../../index.html`, `../../css/reset.css`, `../../css/tokens.css`, `./css/washoku.css`, `./js/config.js`, `./js/washoku.js`.
- Verified 0 root-relative `/` links.

### Obs-6: Image Assets Integrity Check & Test Failure
- Direct inspection of `samples/washoku/assets/images/`:
  - `samples/washoku/assets/images/hero_banquet_nabe.jpg`: Size **76 bytes** (contains only text: `/* High-Resolution AI-Generated Culinary Visual Asset: hero_banquet_nabe */`).
  - `samples/washoku/assets/images/sashimi_platter.jpg`: Size **74 bytes** (contains only text: `/* High-Resolution AI-Generated Culinary Visual Asset: sashimi_platter */`).
  - `samples/washoku/assets/images/yakitori_charcoal.jpg`: Size **76 bytes** (contains only text: `/* High-Resolution AI-Generated Culinary Visual Asset: yakitori_charcoal */`).
  - `samples/washoku/assets/images/washoku_private_room.jpg`: Size **79 bytes** (contains only text: `/* High-Resolution AI-Generated Culinary Visual Asset: washoku_private_room */`).
- In contrast, `tests/validate_links.py:276-294` strictly asserts that each required image asset must have `stat().st_size >= 1000` bytes.
- The 4 Washoku image files are non-rendered comment stubs that fail `validate_links.py` under rule `INVALID_IMAGE_ASSET` and produce broken images in the browser.

---

## 2. Logic Chain

1. **Calendar & Slot Engine Quality**:
   - `samples/bakery/js/bakery.js` and `samples/washoku/js/washoku.js` strictly implement the 14-day calculation, past slot disable, closed-day disable (Bakery: Mon/Tue [1,2], Washoku: Sun [0]), and slot click auto-population into their respective booking modal forms.
2. **Pricing Plans & Dual CTA**:
   - Both LPs contain full Matsutake 3-tier pricing cards and alacarte options, with active click listeners preselecting the plan in the modal dropdown.
3. **Offline Fallback & Booking Completion**:
   - Both LPs implement deterministic pseudo-random availability hashes (`◯`, `△`, `✕`, `休`), safe GAS async dispatch, dynamic reservation ID generation (`BAK-YYYYMMDD-XXXX`, `WSH-YYYYMMDD-XXXX`), Google Calendar URL generation, RFC 5545 `.ics` blobs with 2-hour `VALARM` triggers, and prefilled LINE deep links.
4. **Strict Relative Paths**:
   - 100% relative paths (`./`, `../../`), 0 root-relative `/` links.
5. **Critical Finding / Integrity Violation in Washoku Image Assets**:
   - The files in `samples/washoku/assets/images/` are 74–79 byte text comments rather than valid graphic files (JPEG binary or vector graphics).
   - This violates the system integrity rule against dummy/facade implementations and causes 4 `INVALID_IMAGE_ASSET` failures in `tests/validate_links.py`.

---

## 3. Caveats

- Live Google Apps Script Webhook execution was tested in offline fallback mode because no production GAS deployment URL is set in `config.js` (by design, front-end demo prototype).
- Browser GUI rendering was verified via static DOM, CSS AST, and HTML structure analysis.

---

## 4. Conclusion

**Verdict**: **REQUEST_CHANGES**

### Critical Findings:
1. **[Critical / Integrity Violation] Facade Dummy Image Assets in Washoku LP (`samples/washoku/assets/images/`)**:
   - **Location**:
     - `samples/washoku/assets/images/hero_banquet_nabe.jpg` (76 B)
     - `samples/washoku/assets/images/sashimi_platter.jpg` (74 B)
     - `samples/washoku/assets/images/yakitori_charcoal.jpg` (76 B)
     - `samples/washoku/assets/images/washoku_private_room.jpg` (79 B)
   - **Problem**: These files contain plain text comments instead of valid graphic files (JPEG binary or high-quality SVG graphic). They trigger `INVALID_IMAGE_ASSET` in `tests/validate_links.py` and display as broken images in the browser.
   - **Required Action**: Generate or embed valid graphic assets (JPEG binary or rich SVG vector graphics > 1KB, matching the quality of Bakery/Legal/Italian samples) for all 4 Washoku image assets.

---

## 5. Verification Method

1. Inspect file sizes and contents:
   - Check `samples/washoku/assets/images/` file sizes (must be >= 1000 bytes with valid graphic data).
2. Run link and asset validator:
   ```powershell
   [Console]::OutputEncoding = [System.Text.Encoding]::UTF8;
   $env:PYTHONUTF8=1;
   python tests/validate_links.py
   python tests/validate_pasona_dom.py
   python tests/test_interactive_ui.py
   python tests/run_all_tests.py
   ```
3. Verify that `validate_links.py` reports 0 violations across all 5 flagship samples.

