# Bakery LP Official Store Survey & Architecture Investigation Report

**Author**: survey_bakery_explorer  
**Date**: 2026-08-23T07:23:00+09:00  
**Target Files**:
- `samples/bakery/index.html` (56.2 KB, 969 lines)
- `samples/bakery/css/bakery.css` (42.7 KB, 2019 lines)
- `samples/bakery/js/config.js` (7.8 KB, 185 lines)
- `samples/bakery/js/bakery.js` (26.3 KB, 702 lines)
- `samples/bakery/assets/images/*` (4 image assets: `hero_baguette.jpg`, `baker_craftsman.jpg`, `campagne_slice.jpg`, `bakery_display.jpg`)
- `tests/run_all_tests.py`, `tests/test_interactive_ui.py`, `tests/validate_pasona_dom.py`, `tests/validate_links.py`

---

## 1. Observation

### 1.1 Negative Pain-Point Agitation Elements Identified for Removal

Direct observations in existing codebase:

1. **Hero Subtitle & Pre-heading Negative Questioning**:
   - `samples/bakery/index.html` Line 88: `<span class="title-accent">噛みしめるほどに広がる、本物のフランスパンに出会えていますか？</span>` (Dissatisfaction / agitation hook)
   - `samples/bakery/index.html` Line 92: `量産化と効率を優先した短時間イースト発酵では決して出せない、小麦本来の芳醇な香りと力強い旨味。` (Mass-production criticism)
   - `samples/bakery/index.html` Line 77: Section attribute `data-pasona="problem"`

2. **Dedicated Pain Points Block (`.pain-points-block`)**:
   - `samples/bakery/index.html` Lines 137–163:
     ```html
     <div class="pain-points-block">
       <div class="pain-header">
         <span class="section-tag">Bread Dilemma</span>
         <h2 class="pain-main-title">こんな「パンの物足りなさ」を感じていませんか？</h2>
       </div>
       <div class="pain-grid">
         <div class="pain-card">
           <div class="pain-num">01</div>
           <h3 class="pain-title">小麦の香りが薄く、甘みを感じられない</h3>
           <p class="pain-desc">人工イーストによる2〜3時間の超スピード発酵では、小麦のデンプンが十分に糖化せず、噛んでも深みのある香りと旨味が広がりません。</p>
         </div>
         <div class="pain-card">
           <div class="pain-num">02</div>
           <h3 class="pain-title">翌朝にはパサつき、皮がゴムのように硬い</h3>
           <p class="pain-desc">十分な水分保持力を持たない生地は、焼き上がりから数時間で水分が抜け落ち、翌朝にはパサパサで噛み切りにくい食感になってしまいます。</p>
         </div>
         <div class="pain-card">
           <div class="pain-num">03</div>
           <h3 class="pain-title">日持ちや膨らみのための添加物への不安</h3>
           <p class="pain-desc">乳化剤、イーストフード、保存料、人工香料など、本来パンには不要な化学物質が多く使われている量産パンに違和感を抱いていませんか？</p>
         </div>
       </div>
     </div>
     ```
   - Corresponding CSS rules in `samples/bakery/css/bakery.css` Lines 499–558 (`.pain-points-block`, `.pain-header`, `.pain-grid`, `.pain-card`, `.pain-num`, `.pain-title`, `.pain-desc`) and Lines 1995–1997 (`@media (max-width: 768px) { .pain-grid { grid-template-columns: 1fr; } }`).

3. **Competitor/Mass-Product Negative Comparison Table (`.before-after-block`)**:
   - `samples/bakery/index.html` Lines 308–353: Comparison table explicitly contrasting "一般的な量産・チェーン店パン" with phrases like "2〜3時間（人工イーストで急速発酵）", "パサつき、皮が湿気てゴム化", "乳化剤・イーストフード・保存料を使用".
   - Corresponding CSS in `samples/bakery/css/bakery.css` Lines 755–865.

---

### 1.2 Current Structure vs Required Official Store Model Gap Analysis

| Official Store Section Requirement | Current State in `samples/bakery/index.html` | Required Refactoring & Enhancement |
|---|---|---|
| **1. Header & Navigation** | Sticky header (`#site-header`), returns to LP portal (`../../index.html`), logo `BOULANGERIE ARTISANALE`, tel link `03-3456-7890`, nav links (`#solution`, `#offer`, `#narrowing`, `#action`, `#faq`, `#access`). | Update nav links to official store section IDs (`#hero`, `#concept`, `#timetable`, `#menu`, `#booking`, `#access`, `#faq`). Maintain portal return link and telephone CTA. |
| **2. Hero Section** | Contains baguette visual (`hero_baguette.jpg`), social proof badges, and negative pain-points block. Missing real-time / styled "本日営業中 (Open Today)" business badge and business hours pill. | Refactor Hero into pure artisan sizzle:<br>- Title: "粉・水・酵母・塩。薪石窯が奏でる極上の香ばしさ"<br>- Subtitle: "72時間低温熟成とフランス直輸入耐火レンガ石窯直焼き。本場パリ仕込みのアルチザンブレッド。"<br>- Badges: Add **"本日営業中 07:30〜18:30" (Open Today Badge)** + "自由が丘駅 徒歩8分" + "看板バゲット累計15万本突破"<br>- Instant Reserve CTA: "【焼きたて取り置き】直近14日間の受取枠を見る" + LINE友だち追加<br>- Remove `.pain-points-block` completely. |
| **3. Concept Section (3 Craftsmanship Commitments)** | Split across `#affinity` (Baker Masato Hyuga, lines 169–204) and `#solution` (4 pillars, lines 208–267). | Consolidate into a unified **Concept / 3大職人こだわり (`#concept`)**:<br>1. **フランス産伝統小麦T65 × 北海道キタノカオリ** (石臼挽き粉の豊かな風味と保水性)<br>2. **自家製ルヴァン天然酵母 × 72時間低温熟成発酵** (アミノ酸の旨味と消化の良さ)<br>3. **フランス直輸入耐火レンガ薪石窯 260℃直焼き** (熱風では出せない極薄パリッとクラストと蜂の巣クラム)<br>+ シェフ・ブーランジェ 日向 雅人のストーリー & 写真 (`baker_craftsman.jpg`) & カンパーニュ気泡断面 (`campagne_slice.jpg`). |
| **4. Timetable Section (1日4便 焼きたて時刻表)** | Nested inside `#solution` (lines 270–306) with times `07:30 / 10:30 / 13:30 / 16:00`. | Elevate to independent section (`#timetable`) with the required official schedule:<br>- **第1便 08:00** モーニング・ヴィエノワズリー (クロワッサン/パン・オ・ショコラ/クイニーアマン)<br>- **第2便 11:30** 石窯直焼き看板ハードパン (バゲット・トラディション/カンパーニュ・オ・ルヴァン)<br>- **第3便 14:00** ルヴァン＆ライ麦スペシャリテ (ノア・レザン/パン・ド・セーグル)<br>- **第4便 16:30** 夕方焼きたてイブニングバゲット (夕方便バゲット/石窯ハードパンドミ)<br>Sync `config.js` and `bakery.js` schedule arrays. |
| **5. Menu Section (松竹梅 アソートBOX & アラカルト)** | `#offer` (lines 360–513) contains 3 plan cards: 梅 (¥1,980), 竹 (¥3,480 ★人気No.1), 松 (¥5,800), plus Alacarte option (¥0), and boutique display visual (`bakery_display.jpg`). | Retain and polish `#menu` / `#offer`:<br>- 梅 ¥1,980 (税込, モーニングハードセット 2〜3名様分)<br>- 竹 ¥3,480 (税込, 人気定番7種詰め合わせBOX 3〜5名様分 ★人気No.1)<br>- 松 ¥5,800 (税込, プレミアム薪窯バゲット＆贅沢オードブルBOX 4〜6名様分)<br>- 単品・アラカルト店頭受取指定 (¥0)<br>- "このBOXを取り置き予約" buttons link directly to modal with plan pre-selected. |
| **6. Booking Section (14日間 焼きたて取り置きカレンダー)** | `#action` (lines 551–620) with calendar container `#bakery-calendar-container`, legend symbols (◯, △, ✕, 休), Web modal button `#btn-open-modal-main`, LINE reservation button. | Retain full interactive calendar engine in `#booking` / `#action`:<br>- 14 days dynamic date columns from today<br>- 4 daily pickup slots: 08:00, 11:30, 14:00, 16:30 (30-min pickup window)<br>- Monday & Tuesday automatic closed status (休)<br>- Modal trigger with automatic slot datetime population. |
| **7. Access Section (店舗情報・アクセス・MEO/SNS)** | `#access` (lines 742–798) with table and Google Maps button. Missing Instagram official link and Schema.org structured data. | Enhance `#access`:<br>- Store info: Address (東京都目黒区八雲3-12-8 ブーランジェリーテラス 1F), Access (自由が丘駅 正面口 徒歩8分), Tel (03-3456-7890), Hours (7:30〜18:30 / パン無くなり次第終了), Closed (月・火), Terrace seats (8席 / ペット可)<br>- Google Maps interactive card & direct map link<br>- **Instagram Link**: `@boulangerie_artisanale`公式Instagramリンク<br>- JSON-LD `Bakery` / `Store` structured data for local MEO SEO. |
| **8. FAQ Section** | `#faq` (lines 625–737) with 6 accessible WAI-ARIA accordion items. | Keep all 6 FAQ items intact (Storage methods, Rebake tips, Allergies/Additives, Walk-in purchases, Payment methods, Gift delivery). |
| **9. Booking Modal & Thank-You Screen** | Lines 835–946: 2-step modal dialog with client form validation, reservation ID (`BAK-YYYYMMDD-XXXX`), Google Calendar URL, RFC 5545 `.ics` download (2-hour reminder), LINE confirmation deep link. | Keep 100% intact and functional with exact ID conventions. |
| **10. Mobile Sticky CTA Bar** | Lines 951–960: Fixed bottom bar for mobile screens with LINE and Web Reserve buttons. | Retain and optimize for mobile conversions. |

---

### 1.3 JavaScript & Configuration State

- **`samples/bakery/js/config.js`**:
  - `BAKERY_CONFIG.timeSlots`: Currently `['08:00', '11:00', '14:00', '16:30']`. To match requirement, slot 2 should be `11:30` (or `11:00`/`11:30` unified).
  - `BAKERY_CONFIG.bakingSchedule`: Times currently `['07:30', '10:30', '13:30', '16:00']`. To match requirement, update to `['08:00', '11:30', '14:00', '16:30']`.
  - `BAKERY_CONFIG.planMaster`: 梅 (1980), 竹 (3480), 松 (5800), alacarte (0). Correct pricing.
  - `BAKERY_CONFIG.closedDays`: `[1, 2]` (Mon, Tue).
  - `BAKERY_CONFIG.daysToShow`: `14`.

- **`samples/bakery/js/bakery.js`**:
  - Script loads after `config.js` (`TC-BAK-CFG-01` compliance).
  - Calendar rendering handles status: `available` (◯), `limited` (△), `full` (✕), `closed` (休).
  - Booking modal generates `BAK-YYYYMMDD-XXXX` reservation IDs.
  - Generates RFC 5545 .ics blob with `DTSTART`/`DTEND` (30 min duration) and `VALARM` (2h before).
  - Generates Google Calendar URL with encoded title, location, and 30-min timespan.
  - Generates LINE deep link `https://line.me/R/oaMessage/@boulangerie_art/?...`.

---

### 1.4 Test Suite Impact Analysis

| Test File | Test Case / Validator | Expected Behavior & Update Scope |
|---|---|---|
| `tests/validate_pasona_dom.py` | `validate_bakery_pasona` / `validate_file_pasona` | Currently checks legacy PASONA sections (`problem`, `affinity`, `solution`, `offer`, `narrowing`, `action`, `faq`) and Before/After. Needs to be updated/relaxed to support Official Store sections (`hero`, `concept`, `timetable`, `menu`/`offer`, `booking`/`action`, `access`, `faq`) while accepting either legacy `data-pasona` or new semantic IDs/data attributes without requiring negative Before/After. |
| `tests/run_all_tests.py` | `TC-BAK-CAL-01`, `TC-BAK-TT-01`, `TC-BAK-B01`..`B05` | 10 Bakery tests in Tier 1 and 5 in Tier 2. All expect 14-day calendar, 松竹梅 prices (¥1,980 / ¥3,480 / ¥5,800), Mon/Tue holidays, 30-min pickup slot, reservation ID format `BAK-YYYYMMDD-XXXX`, Google Cal / .ics / LINE URLs, and 4 images. |
| `tests/test_interactive_ui.py` | `TC-BAK-CFG-VAL`, `TC-BAK-CAL-DOM`, `TC-BAK-TNK-RESID`, `TC-BAK-ICS-RFC`, `TC-BAK-LIN-URL` | Validates `config.js` schema, calendar DOM container, reservation ID regex, .ics RFC format, and LINE OA URL. |
| `tests/validate_links.py` | Rules L1, L2, L3, L4, Script load order, 4 Bakery image files, bidirectional navigation (`../../index.html` ⇔ `samples/bakery/index.html`) | Enforces zero 404s, strict relative paths, `#id` target existence, and script order (`config.js` before `bakery.js`). |

---

## 2. Logic Chain

1. **Premise**: Official store model for bakery requires showcasing craftsmanship, product sizzle, fresh-bake schedule, and instant takeout booking, rather than agitating customer dissatisfaction or attacking mass-produced commercial breads.
2. **Step 1 (Eliminate Pain Points)**: Removing `.pain-points-block` (lines 137–163) and `.before-after-block` (lines 308–353) removes negative copy ("パサつき", "物足りなさ", "ゴムのように硬い", "添加物への不安") and cleanses the brand presentation to high-end French artisan warmth.
3. **Step 2 (Hero Enhancement)**: Adding the "本日営業中 07:30〜18:30" live status badge and focusing the hero copy purely on the aroma of stone-oven baking ("薪石窯バゲットの極上シズル") creates immediate trust and appetite appeal for local visitors and Instagram/MEO traffic.
4. **Step 3 (3 Craftsmanship Commitments)**: Merging the 4 pillars into 3 core artisan commitments (T65 wheat, 72h levain, direct firewood stone oven) creates a punchy, memorable triad that highlights the baker's credentials without cognitive overload.
5. **Step 4 (Schedule & Booking Synchronization)**: Aligning the 4-batch timetable (08:00, 11:30, 14:00, 16:30) across HTML markup, `config.js`, and `bakery.js` ensures that when customers click on the calendar or timetable, pickup slots directly correspond to fresh-out-of-the-oven batches.
6. **Step 5 (Access & MEO / SNS)**: Adding Instagram deep link `@boulangerie_artisanale` and JSON-LD structured data enhances local MEO search performance on Google Maps and mobile browsers.
7. **Step 6 (Preserving Links & IDs)**: Retaining or alias-mapping critical anchor IDs (`#hero`, `#concept` / `#solution`, `#timetable`, `#menu` / `#offer`, `#booking` / `#action`, `#faq`, `#access`) and form/modal IDs (`#booking-modal`, `#bakery-booking-form`, `#form-plan`, `#form-datetime`, etc.) guarantees zero breakage in `validate_links.py`, `run_all_tests.py`, and `test_interactive_ui.py`.

---

## 3. Caveats

1. **Test Suite Compatibility (`validate_pasona_dom.py`)**:
   - `validate_pasona_dom.py` currently inspects `data-pasona` tags (`problem`, `affinity`, `solution`, `offer`, `narrowing`, `action`, `faq`) and searches for Before/After comparisons (`has_before_after`).
   - In the implementation phase, either (a) keep dual data attributes (e.g. `id="concept" data-pasona="solution"`) or (b) update `validate_pasona_dom.py` to recognize Official Store DOM structures (`hero`, `concept`, `timetable`, `menu`, `booking`, `access`, `faq`). The orchestrator/worker should update `tests/validate_pasona_dom.py` as required by Mission Item 3.
2. **Timetable Times**:
   - Current `config.js` has `bakingSchedule` with `07:30`, `10:30`, `13:30`, `16:00` and `timeSlots` with `08:00`, `11:00`, `14:00`, `16:30`.
   - The user request explicitly specifies: `08:00 / 11:30 / 14:00 / 16:30`. Both `config.js` and `bakery.js` should be updated to `08:00`, `11:30`, `14:00`, `16:30`, and the timetable card display updated to match.
3. **No External CDN Dependencies**:
   - All styles and fonts use relative paths (`../../css/reset.css`, `../../css/tokens.css`, `./css/bakery.css`) and standard Google Fonts. No external script libraries are used.

---

## 4. Conclusion & Actionable Recommendations

### 4.1 Recommended DOM & Section Architecture for `samples/bakery/index.html`

```html
<!-- 1. Header & Floating Navigation -->
<header class="site-header" id="site-header">
  <!-- Portal Return Link, Logo, Nav Links, Tel, Instant Reserve CTA -->
</header>

<main>
  <!-- 2. Hero Section: Firewood Stone-Oven Baguette Sizzle + Open Today Badge + Instant CTA -->
  <section class="hero-section" id="hero" data-pasona="problem">
    <!-- Breadcrumb / Open Today Badge ("本日営業中 07:30〜18:30") -->
    <!-- Sizzle Headline & Artisan Subtitle -->
    <!-- 3 Proof Badges (15万本突破, 72h熟成, ★4.9) -->
    <!-- Hero Dual CTA (Web Reserve + LINE) -->
    <!-- Hero Visual Card (hero_baguette.jpg) -->
  </section>

  <!-- 3. Concept Section: 3 Craftsmanship Commitments & Baker Profile -->
  <section class="concept-section" id="concept" data-pasona="affinity">
    <!-- 3 Pillars Grid:
         01. フランス産伝統小麦T65 × 北海道キタノカオリ
         02. 自家製ルヴァン天然酵母 × 72時間低温熟成発酵 (campagne_slice.jpg)
         03. フランス直輸入耐火レンガ薪石窯 260℃直焼き -->
    <!-- Baker Profile Card: 日向 雅人 シェフ・ブーランジェ (baker_craftsman.jpg) -->
  </section>

  <!-- 4. Timetable Section: 1日4便 焼きたて時刻表 (08:00 / 11:30 / 14:00 / 16:30) -->
  <section class="timetable-section" id="timetable" data-pasona="solution">
    <!-- 4 Batch Cards:
         - 08:00 第1便：モーニング・ヴィエノワズリー
         - 11:30 第2便：石窯直焼き看板ハードパン
         - 14:00 第3便：ルヴァン＆ライ麦スペシャリテ
         - 16:30 第4便：夕方焼きたてイブニングバゲット -->
  </section>

  <!-- 5. Menu Section: Matsutake 3-Tier Takeout Assortment BOX & Alacarte -->
  <section class="menu-section" id="menu" data-pasona="offer">
    <!-- Boutique Display Banner (bakery_display.jpg) -->
    <!-- Matsutake Pricing Grid:
         - 梅: ¥1,980 モーニングハードセット
         - 竹: ¥3,480 人気定番7種詰め合わせBOX (★一番人気)
         - 松: ¥5,800 プレミアム薪窯バゲット＆贅沢オードブルBOX -->
    <!-- Alacarte Option Card (¥0) -->
  </section>

  <!-- 6. Scarcity & Quality Guarantee Note -->
  <section class="narrowing-section" id="narrowing" data-pasona="narrowing">
    <!-- Artisan batch limit note (72h fermentation, limited to 30-50 breads per batch) -->
  </section>

  <!-- 7. Booking Section: 14-Day Availability Calendar & Dual CTA -->
  <section class="booking-section" id="booking" data-pasona="action">
    <!-- 14-Day Calendar Container (#bakery-calendar-container) -->
    <!-- Dual CTA Banners: Web Modal Trigger + LINE Official CTA -->
  </section>

  <!-- 8. FAQ Section: 6 Accessible Accordion Items -->
  <section class="faq-section" id="faq" data-pasona="faq">
    <!-- 6 Q&A Items (Preserved from existing) -->
  </section>

  <!-- 9. Access & Store Info Section: Google Map, Tel, Hours, Instagram -->
  <section class="access-section" id="access">
    <!-- Store Details Table -->
    <!-- Google Map Card -->
    <!-- Instagram Link Button (@boulangerie_artisanale) -->
  </section>
</main>

<!-- 10. Footer -->
<footer class="site-footer" id="site-footer">...</footer>

<!-- 11. Modal Dialog & Thank-You View (Preserve all IDs & handlers) -->
<div class="modal-overlay" id="booking-modal" ...>...</div>

<!-- 12. Mobile Sticky CTA Bar -->
<div class="mobile-sticky-bar" id="mobile-sticky-cta">...</div>
```

### 4.2 CSS Rules to Add / Clean in `samples/bakery/css/bakery.css`

1. Remove `.pain-points-block`, `.pain-header`, `.pain-grid`, `.pain-card`, `.pain-num`, `.pain-title`, `.pain-desc` (lines 499–558) and `.before-after-block` (lines 755–865).
2. Add `.open-badge` styling for the "本日営業中 07:30〜18:30" live badge:
   ```css
   .open-badge {
     display: inline-flex;
     align-items: center;
     gap: 6px;
     background: rgba(45, 122, 76, 0.15);
     color: #2D7A4C;
     border: 1px solid rgba(45, 122, 76, 0.4);
     padding: 4px 12px;
     border-radius: var(--radius-pill);
     font-size: 0.85rem;
     font-weight: 700;
   }
   .open-badge::before {
     content: '';
     display: inline-block;
     width: 8px;
     height: 8px;
     border-radius: 50%;
     background: #2D7A4C;
     box-shadow: 0 0 8px rgba(45, 122, 76, 0.8);
   }
   ```
3. Add `.instagram-btn` styling in Access section:
   ```css
   .instagram-btn {
     display: inline-flex;
     align-items: center;
     gap: 8px;
     background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
     color: #FFFFFF;
     font-weight: 700;
     font-size: 0.95rem;
     padding: 10px 20px;
     border-radius: var(--radius-pill);
     box-shadow: 0 4px 14px rgba(220, 39, 67, 0.35);
   }
   ```

---

## 5. Verification Method

To verify the implementation once completed by the worker agent:

1. **Visual & Pain-Point Inspection**:
   - Verify that `samples/bakery/index.html` contains zero negative words ("パサつき", "物足りなさ", "ゴムのように硬い", "添加物への不安", "Bread Dilemma").
   - Verify that `.pain-points-block` and `.before-after-block` are removed.
   - Verify presence of "本日営業中 07:30〜18:30" open status badge in Hero.
   - Verify 3 craftsmanship pillars in Concept section.
   - Verify 4 fresh-bake times (08:00 / 11:30 / 14:00 / 16:30) in Timetable.
   - Verify 3-tier Matsutake assortment boxes (梅¥1,980 / 竹¥3,480 / 松¥5,800).
   - Verify 14-day calendar DOM container (`#bakery-calendar-container`).
   - Verify Access section with Google Map, address, phone, hours, and Instagram link.

2. **Link & Anchor Verification**:
   - Inspect all internal `#` anchor targets (`#hero`, `#concept`, `#timetable`, `#menu`, `#booking`, `#access`, `#faq`) and confirm matching element IDs.
   - Inspect all image references to `assets/images/` and portal return links `../../index.html`.

3. **DOM & Test Suite Validation Command**:
   - Run `python tests/run_all_tests.py`
   - Run `python tests/validate_links.py`
   - Run `python tests/test_interactive_ui.py`
   - Run `python tests/validate_pasona_dom.py`
   - All tests must pass with 100% success rate.
