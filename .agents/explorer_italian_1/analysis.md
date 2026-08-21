# Analysis & Technical Specification: Casual Italian Restaurant Sample LP
**Project**: LP DESIGN HUB — Casual Italian Restaurant Sample LP ("TRATTORIA & PIZZERIA BELLA TAVOLA")
**Target**: `samples/italian/index.html`, `samples/italian/css/italian.css`, `samples/italian/js/config.js`, `samples/italian/js/italian.js`, `index.html`
**Author**: explorer_italian_1
**Date**: 2026-08-21

---

## 1. Executive Summary & Problem Scope

### 1.1 Objective
Construct a high-converting, aesthetically rich, and fully responsive Landing Page (LP) for a casual Italian trattoria & pizzeria ("TRATTORIA & PIZZERIA BELLA TAVOLA") hosted on GitHub Pages with zero operational overhead. The LP integrates:
1. **New PASONA Formula Copywriting**: Problem → Affinity → Solution → Offer → Narrowing Down → Action.
2. **Sizzling Modern Warm UI**: Terracotta, wine red, olive green, warm wood, and creamy backdrop with appetitive visual enhancements.
3. **Generated High-Resolution Imagery**: Optimal layout integration of the 4 pre-rendered realistic assets (`trattoria_interior.jpg`, `pizza_margherita.jpg`, `handmade_pasta.jpg`, `dolce_tiramisu.jpg`).
4. **14-Day 2-Shift Seat Availability Calendar**: Lunch (11:30–15:00) and Dinner (17:30–22:30) slot matrix (`◯`, `△`, `✕`, `休`) with deterministic offline simulation and Google Apps Script (GAS) sync capability.
5. **Instant Booking Modal & Sync**: Automated booking ID generation (`BEL-YYYYMMDD-XXXX`), Google Calendar 1-click URL, RFC 5545 `.ics` file generator, and 1-tap LINE confirmation deep link.
6. **Top Portal Integration & Bi-Directional Nav**: Upgrading the top portal (`index.html`) "飲食・店舗" teaser to an active live demo card with zero broken relative links.

---

## 2. Design System Specification

### 2.1 Color Palette & Design Tokens
The color palette is engineered to stimulate appetite, convey artisan craftsmanship (wood-fired pizza, handmade pasta), and provide high readability (WCAG AA contrast >= 4.5:1 for body text).

| Token Name | Hex Code | Role & Usage | WCAG Ratio |
|---|---|---|---|
| `--color-terracotta` | `#C85A32` | Primary brand accent, primary CTA buttons, active states, wood-fire badges | 4.6:1 (on white/cream) |
| `--color-terracotta-dark` | `#A64420` | Primary CTA hover/focus state, heading accents | 6.2:1 |
| `--color-wine-red` | `#722F37` | Secondary luxury accent, section headers, badges, card accents | 7.8:1 |
| `--color-wine-red-dark` | `#4F1C23` | Dark contrast headers, footer background | 11.4:1 |
| `--color-olive-green` | `#556B2F` | Fresh ingredient accents, organic wine badges, success/available `◯` symbol | 4.8:1 |
| `--color-olive-dark` | `#3D4E22` | Olive badges, high-contrast highlights | 7.2:1 |
| `--color-warm-wood` | `#8B5A2B` | Artisan wood accents, card borders, subtle decorative dividers | 5.2:1 |
| `--color-warm-cream-bg` | `#FDFBF7` | Main page background (warm Italian trattoria plaster wall feel) | Base Canvas |
| `--color-cream-subtle` | `#F5EFEB` | Secondary card background, alternating section backgrounds | - |
| `--color-card-surface` | `#FFFFFF` | Primary card surface for crisp contrast | - |
| `--color-text-main` | `#2D1F1D` | Primary text (charcoal warm brown, softer and richer than pure black) | 12.1:1 on cream |
| `--color-text-muted` | `#6E5D57` | Secondary text, photo captions, metadata | 4.9:1 on cream |
| `--color-border-warm` | `#E8DDD3` | Soft warm divider lines, table borders | - |
| `--color-gold-accent` | `#D97706` | Star ratings, limited badges, seasonal highlights | 4.5:1 on dark |
| `--color-line-green` | `#06C755` | Official LINE CTA button background | High |

### 2.2 Typography Hierarchy
- **Italian Headers & Brand Logo**: `Cinzel`, `Playfair Display`, `serif` (elegant, classic Italian trattoria charm).
- **Japanese Headings & Body**: `Noto Sans JP`, `"Hiragino Sans"`, `"Yu Gothic"`, sans-serif (crisp, modern legibility).
- **Numbers, Prices, Times**: `Inter`, sans-serif (tabular figures for aligned prices and calendar slots).

```css
:root {
  --font-serif: 'Cinzel', 'Playfair Display', 'Shippori Mincho', serif;
  --font-sans: 'Noto Sans JP', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-display: 'Cinzel', 'Playfair Display', serif;
}
```

### 2.3 Sizzle Visual Treatment for Food Imagery
Food imagery must evoke the aroma of wood fire, melting mozzarella, rich bolognese sauce, and cocoa powder.

```css
/* Sizzle Food Photo Styling */
.sizzle-image-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 12px 32px rgba(114, 47, 55, 0.12), 0 2px 6px rgba(45, 31, 29, 0.06);
  background: var(--color-warm-wood);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
}

.sizzle-image-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.6s ease;
}

.sizzle-image-card:hover img {
  transform: scale(1.05);
  filter: saturate(1.08) brightness(1.02);
}

.sizzle-image-card .sizzle-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(45, 31, 29, 0) 40%, rgba(45, 31, 29, 0.75) 100%);
  pointer-events: none;
}

.sizzle-image-card .sizzle-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  background: rgba(200, 90, 50, 0.92);
  color: #ffffff;
  padding: 6px 14px;
  border-radius: 9999px;
  font-size: 0.8125rem;
  font-weight: 700;
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

---

## 3. New PASONA Structural Breakdown

| PASONA Phase | LP Section | Section ID | Key Content & Copywriting Angle |
|---|---|---|---|
| **P: Problem** (問題提起) | Hero & First View | `#hero` | **「特別な日も、何気ない週末も。本当に美味しい本場のピッツァとパスタを、気取らず笑顔で楽しみたい。」**<br>薪窯の香ばしい薫りと活気あふれるトラットリア。外食選びで失敗したくない大人たちへ。 |
| **A: Affinity** (親近感・共感) | Concept & Chef Story | `#affinity` | **「ナポリの街角にある陽気なトラットリアのように。」**<br>職人の手仕事、毎日仕込む手打ちパスタ、イタリア現地で出会った本物の味を日本の皆様へ届けたい情熱ストーリー。 |
| **S: Solution** (解決策・こだわり) | 3 Core Commitments | `#solution` | **BELLA TAVOLAの3つの真髄**<br>1. **薪窯450℃速焼きナポリピッツァ**（外サク中モチの黄金比）<br>2. **毎朝仕込むセモリナ100%手打ち生パスタ**（濃厚ソースが絡む絶品）<br>3. **ソムリエ厳選の自然派オーガニックワイン**（料理を引き立てる20種以上） |
| **O: Offer** (提案・コース・料理) | Menu & Matsutake Plans | `#offer` | **【松竹梅コース ＆ アラカルト】**<br>・**竹（一番人気）: BELLA スペシャルコース** (5,800円/人) 薪窯ピッツァ＆手打ちパスタ＆熟成肉<br>・**松（記念日VIP）: プレミアムアニバーサリーコース** (8,800円/人) 乾杯スプマンテ＆特製ドルチェプレート付<br>・**梅（お気軽）: トラットリア カジュアルコース** (3,980円/人)<br>・**平日ランチセット** (1,480円〜) |
| **N: Narrowing Down** (限定性・緊急性) | Limited Craft & Atmosphere | `#narrowing` | **「薪窯の天然酵母生地と手打ちパスタは1日数量限定。」**<br>テーブル席全28席・カウンター6席。週末ディナーおよび記念日アニバーサリー席は埋まりやすいため事前Web予約を推奨。 |
| **A: Action** (行動喚起・予約連動) | 14-Day Calendar & Web Booking | `#action` | **直近14日間の席空き状況カレンダー（ランチ・ディナー2部制）**<br>◯（空きあり）・△（残りわずか）・✕（満席）・休（定休日）を即時視覚化。タップで予約フォームに自動セット。 |
| **Plus: Social Proof & FAQ** | Reviews, Access, FAQ | `#reviews`, `#access`, `#faq` | お客様の声（デート・女子会・家族会）、Googleマップ店舗案内、営業時間、よくあるご質問（ドレスコードなし・貸切可・ベビーカー可等）。 |

---

## 4. Asset Placement Blueprint

| Image Asset Path | Section | UI Position & Role |
|---|---|---|
| `samples/italian/assets/images/trattoria_interior.jpg` | Hero / `#affinity` | Hero background / Atmospheric Trattoria introduction with warm ambient lighting, open kitchen, and welcoming Italian ambiance. |
| `samples/italian/assets/images/pizza_margherita.jpg` | `#solution` (Commitment 1) & `#offer` | Featured Hero Pizza Card showing fresh basil, bubbling buffalo mozzarella, and blistered crust fresh from the 450°C wood oven. |
| `samples/italian/assets/images/handmade_pasta.jpg` | `#solution` (Commitment 2) & `#offer` | Handcrafted Tagliatelle Bolognese card with rich slow-cooked ragù and freshly shaved Parmigiano-Reggiano. |
| `samples/italian/assets/images/dolce_tiramisu.jpg` | `#offer` (Dolce & Course) & `#narrowing` | Homemade Mascarpone Tiramisu dusted with cocoa, paired with authentic espresso for dessert showcase and anniversary plates. |

---

## 5. Responsive Architecture & Breakpoints

```
Mobile Breakpoint:  375px  - 767px   (Single column bento, scrollable calendar grid, sticky bottom reservation bar)
Tablet Breakpoint:  768px  - 1023px  (2-column bento, horizontal menu cards, expanded calendar table)
Desktop Breakpoint: 1024px - 1920px+ (Full 3-column matsutake grid, parallax photo highlights, sticky side/top nav)
```

### 5.1 Sticky Mobile Bottom CTA
- Visible on scroll past hero (>300px) on mobile/tablet screens (<1024px).
- Dual Action Bar:
  - Left/Center Button (Terracotta `#C85A32`): **「📅 席の空き状況・Web予約」** (scrolls to `#calendar` or opens modal).
  - Right Button (LINE Green `#06C755`): **「💬 LINE予約・相談」** (deep link to official LINE).
- Uses `padding-bottom: max(12px, env(safe-area-inset-bottom))` for iPhone notch/home indicator compatibility.

### 5.2 Navigation & Return Link
- Top navigation bar includes:
  - Logo: `TRATTORIA & PIZZERIA BELLA TAVOLA`
  - Anchor Links: `こだわり` (`#solution`), `メニュー・コース` (`#offer`), `店内の雰囲気` (`#gallery`), `空き状況・予約` (`#calendar`), `店舗案内` (`#access`)
  - Desktop CTA: `WEB席予約`
  - Portal Return Link: `← LPデザインハブへ戻る` (`../../index.html` or `../index.html` as appropriate based on relative path from `samples/italian/index.html` which is `../../index.html`).

---

## 6. JavaScript & Configuration Architecture

### 6.1 `samples/italian/js/config.js` Contract
```javascript
(function (global) {
  'use strict';

  var RESTAURANT_CONFIG = {
    restaurantName: 'TRATTORIA & PIZZERIA BELLA TAVOLA',
    restaurantTagline: '薪窯ピッツァと手打ちパスタの陽気なイタリアン',
    restaurantPostalCode: '150-0001',
    restaurantAddress: '東京都渋谷区神宮前4-12-10 表参道ヒルズ裏手 1F',
    restaurantAccess: '東京メトロ表参道駅 A2出口 徒歩3分 / 明治神宮前駅 徒歩6分',
    restaurantPhone: '03-5678-9012',
    restaurantEmail: 'info@bellatavola.example.com',
    
    gasWebhookUrl: '', // Optional GAS Web App endpoint
    gasTimeoutMs: 8000,

    businessHours: {
      lunch: { start: '11:30', end: '15:00', lastOrder: '14:30', label: '11:30 - 15:00 (L.O. 14:30)' },
      dinner: { start: '17:30', end: '22:30', lastOrder: '21:30', label: '17:30 - 22:30 (L.O. 21:30)' }
    },
    
    closedDays: [2], // 2: Tuesday
    closedDaysLabel: '毎週火曜日（祝日の場合は翌水曜休）',
    
    // Time slots organized by lunch / dinner
    timeSlots: {
      lunch: ['11:30', '12:00', '12:30', '13:00', '13:30', '14:00'],
      dinner: ['17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30']
    },
    
    daysToShow: 14,
    totalSeats: 34, // 28 table seats + 6 counter seats
    maxPartySize: 12,

    lineOfficialUrl: 'https://line.me/R/ti/p/@bella_tavola',
    lineAccountId: '@bella_tavola',
    lineOaMessageUrl: 'https://line.me/R/oaMessage/@bella_tavola/?',

    fallbackSimulation: true,
    simulationSeedSalt: 'bella_tavola_italian_2026',

    courseMaster: {
      bamboo: {
        id: 'bamboo',
        name: 'BELLA スペシャルコース（全7品）★人気No.1',
        shortName: '竹：BELLAスペシャルコース',
        price: 5800,
        isPopular: true,
        durationMin: 120,
        summary: '薪窯マルゲリータ＆手打ちボロネーゼ＆特選牛グリルを堪能する名物フルコース'
      },
      plum: {
        id: 'plum',
        name: 'トラットリア カジュアルコース（全5品）',
        shortName: '梅：カジュアルコース',
        price: 3980,
        isPopular: false,
        durationMin: 90,
        summary: '前菜盛り合わせ、選べるピッツァ/パスタ、名物ティラミスが付いた気軽なプラン'
      },
      pine: {
        id: 'pine',
        name: 'プレミアムアニバーサリーコース（全8品・乾杯スパークリング付）',
        shortName: '松：アニバーサリーコース',
        price: 8800,
        isPopular: false,
        durationMin: 120,
        summary: '乾杯スプマンテ、トリュフ手打ちパスタ、国産牛ヒレ肉、メッセージ付き特製デザートプレート'
      },
      seat_only: {
        id: 'seat_only',
        name: 'お席のみのご予約（当日アラカルト注文）',
        shortName: '席のみ予約',
        price: 0,
        isPopular: false,
        durationMin: 120,
        summary: '当日メニューからお好きなピッツァ・パスタ・ワインをご注文いただけます'
      }
    }
  };

  global.RESTAURANT_CONFIG = RESTAURANT_CONFIG;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = RESTAURANT_CONFIG;
  }
})(typeof window !== 'undefined' ? window : this);
```

### 6.2 `samples/italian/js/italian.js` Functional Matrix
1. **Calendar Engine**:
   - Generates 14 days starting from today.
   - Calculates lunch / dinner availability matrix.
   - Closed days (Tuesday) marked with `✕` or `休`.
   - Past slots for today disabled automatically.
   - Deterministic pseudo-random seed generator ensures consistent testability and realistic distribution (mostly `◯`, some `△`, high peak `✕`).
   - Slot tap triggers smooth scroll to reservation form & populates date, time, and shift.
2. **Reservation Modal & Validation**:
   - Name, Phone, Email, Party Size (1 to 12), Date & Time Slot, Course Selection, Special Requests / Allergy notes.
   - Inline real-time validation without layout shifts.
3. **Thank-You Screen & External Integrations**:
   - Generates booking ID: `BEL-YYYYMMDD-XXXX`.
   - Google Calendar 1-Click Link with proper location, dates, and restaurant details.
   - Apple / Outlook `.ics` RFC 5545 dynamic Blob download with 2-hour reminder alarm.
   - LINE Official Account prefilled message launcher.
4. **Interactive UI**:
   - Mobile sticky CTA reveal on scroll.
   - Accessible FAQ Accordion (`aria-expanded`, keyboard friendly).
   - Smooth anchor navigation with active state highlight.

---

## 7. Top Portal (`index.html`) Integration Plan

In `index.html`:
1. Find `<article class="lp-card teaser" data-category="dining">` (currently line 303–332).
2. Transform it from a `teaser` card into a full `featured` / active card:
   - Visual mock or thumbnail representing the Italian restaurant LP.
   - Badges: `公開中 (LIVE DEMO)`, `新PASONA完全準拠`, `イタリアン特化`, `薪窯ピッツァ＆パスタ`.
   - Title: `本格薪窯ピッツァ＆手打ちパスタ カジュアルイタリアン LP`
   - Description: `本場ナポリ仕込みの薪窯ピッツァと毎朝手打ちの生パスタを訴求。新PASONA心理動線、松竹梅コース提案、リアルタイム席予約カレンダーを備えた高成約型レストランLP。`
   - Action Button: `<a href="./samples/italian/index.html" class="btn-primary-demo" id="link-italian-demo"><span>実機デモを見る</span>...</a>`
   - Target Audience Tag: `ターゲット: 20〜40代 カップル・女子会・ファミリー・記念日利用層`
3. Update category count badge for "飲食・グルメ" if needed, ensuring filter buttons work smoothly.

---

## 8. Implementation Checklist for Subsequent Agents

- [ ] **M1 — Italian LP Files**:
  - `samples/italian/index.html`: Semantic HTML5, New PASONA sections, 4 image assets, reservation modal, thank-you screen, FAQ, back-to-portal link.
  - `samples/italian/css/italian.css`: Warm Italian palette, Cinzel/Noto typography, sizzle photo cards, responsive grids (375px–1920px), sticky bottom CTA.
  - `samples/italian/js/config.js`: `RESTAURANT_CONFIG` singleton with lunch/dinner slots, course master, fallback simulation.
  - `samples/italian/js/italian.js`: Calendar engine, modal controller, ICS generator, Google Cal generator, LINE launcher.
- [ ] **M2 — Top Portal Integration**:
  - `index.html`: Promote dining teaser card to active live demo card pointing to `./samples/italian/index.html`.
- [ ] **M3 — Test Suite Extension**:
  - `tests/validate_pasona_dom.py`: Add validation for Italian LP PASONA sections, DOM elements, images, and heading hierarchy.
  - `tests/validate_links.py`: Validate all relative links between portal and Italian LP.
  - `tests/run_all_tests.py`: Extend master test runner to cover both Aesthetic LP and Italian LP (100% pass).
