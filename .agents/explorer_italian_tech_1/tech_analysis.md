# Technical Architecture Blueprint: Italian Restaurant Sample LP (TRATTORIA & PIZZERIA BELLA TAVOLA)

## 1. Executive Summary & Architecture Overview

The Italian Restaurant Sample LP ("TRATTORIA & PIZZERIA BELLA TAVOLA") is the 2nd flagship sample in the LP Design Hub suite. It applies the **New PASONA Framework** with an appetite-inducing sizzle aesthetic (warm terracotta `#C85A32`, wine red `#722F37`, olive green `#556B2F`, warm wood `#8B5A2B`) and a 100% serverless, zero-maintenance frontend architecture hosted on GitHub Pages.

```
+-----------------------------------------------------------------------------------+
|                           TOP PORTAL (index.html)                                 |
|          Filterable Showcase | Category: 飲食・グルメ (card-italian)                |
+-----------------------------------------+-----------------------------------------+
                                          |
                      +-------------------+-------------------+
                      | (Bi-directional Relative Link)        |
                      v                                       v
+-----------------------------------------------------------------------------------+
|               ITALIAN RESTAURANT LP (samples/italian/index.html)                  |
|  +-----------------------------------------------------------------------------+  |
|  | New PASONA Sections: Problem -> Affinity -> Solution -> Offer -> Narrow ->  |  |
|  |                      Action (14-Day 2-Shift Seat Calendar + Booking Form)   |  |
|  +-----------------------------------------------------------------------------+  |
|                                         |                                         |
|             +---------------------------+---------------------------+             |
|             v                                                       v             |
|  +-----------------------------+                         +---------------------+  |
|  | samples/italian/js/         |                         | samples/italian/    |  |
|  | config.js                   |                         | js/italian.js       |  |
|  | (window.RESTAURANT_CONFIG)  |                         | (Engine & Handlers) |  |
|  +--------------+--------------+                         +----------+----------+  |
|                 |                                                   |             |
|                 +-----------------------+---------------------------+             |
|                                         |                                         |
|       +---------------------------------+---------------------------------+       |
|       v                                 v                                 v       |
|  +-----------------------+    +-----------------------+    +-------------------+  |
|  | 14-Day 2-Shift Engine |    | Booking Modal & ResID |    | 1-Click Sync      |  |
|  | (Lunch 5 / Dinner 6)  |    | (TAV-YYYYMMDD-XXXX)   |    | - Google Cal URL  |  |
|  | ◯ / △ / ✕ / 休        |    | Form Validation & GAS |    | - Apple/iCal .ics |  |
|  | Deterministic Fallback|    | Mock Offline Handling |    | - LINE Deep Link  |  |
|  +-----------------------+    +-----------------------+    +-------------------+  |
+-----------------------------------------------------------------------------------+
```

---

## 2. Centralized Configuration Schema (`samples/italian/js/config.js`)

### 2.1 Interface Contract
`samples/italian/js/config.js` is loaded prior to `italian.js` and attaches `window.RESTAURANT_CONFIG` to the global scope.

```javascript
/**
 * samples/italian/js/config.js
 * Centralized Restaurant & Seat Reservation Configuration
 * Single Source of Truth for TRATTORIA & PIZZERIA BELLA TAVOLA
 */

(function (global) {
  'use strict';

  var RESTAURANT_CONFIG = {
    // ==========================================
    // 1. 店舗基本情報 (Restaurant Metadata)
    // ==========================================
    restaurantName: 'TRATTORIA & PIZZERIA BELLA TAVOLA',
    restaurantJapaneseName: 'トラットリア＆ピッツェリア ベッラ・ターヴォラ',
    restaurantTagline: '恵比寿・薪窯ナポリピッツァ＆手打ち生パスタの本格イタリアン',
    restaurantPostalCode: '150-0013',
    restaurantAddress: '東京都渋谷区恵比寿1-23-45 BELLAビル 1F',
    restaurantAccess: 'JR恵比寿駅 東口徒歩3分 / 東京メトロ日比谷線 恵比寿駅 徒歩5分',
    restaurantPhone: '03-5678-9012',
    restaurantEmail: 'info@bellatavola.example.com',

    // ==========================================
    // 2. GAS Webhook エンドポイント設定
    // ==========================================
    // GASデプロイ後に発行されたWebアプリURLをここに設定します。
    // 空文字 ("") の場合は自動的に決定論的オフラインシミュレーションモードで動作します。
    gasWebhookUrl: '',
    gasTimeoutMs: 8000,

    // ==========================================
    // 3. 営業時間・定休日・2部制予約枠設定
    // ==========================================
    businessHours: {
      lunch: {
        start: '11:30',
        end: '15:00',
        lastOrder: '14:30',
        label: 'ランチ 11:30 - 15:00（L.O. 14:30）'
      },
      dinner: {
        start: '17:30',
        end: '22:30',
        lastOrder: '21:30',
        label: 'ディナー 17:30 - 22:30（L.O. 21:30）'
      },
      label: 'ランチ 11:30-15:00 (L.O.14:30) / ディナー 17:30-22:30 (L.O.21:30)'
    },

    // 定休日設定 (0: 日, 1: 月, 2: 火, 3: 水, 4: 木, 5: 金, 6: 土)
    closedDays: [2], // 毎週火曜日定休
    closedDaysLabel: '毎週火曜日（祝日の場合は翌水曜日振替）',

    // ランチ（5枠）＆ディナー（6枠）の予約枠一覧（合計11枠/日）
    timeSlots: {
      lunch: ['11:30', '12:00', '12:30', '13:00', '13:30'],
      dinner: ['17:30', '18:00', '18:30', '19:00', '19:30', '20:00']
    },

    // カレンダー表示日数
    daysToShow: 14,

    // 席数・予約制限
    capacityPerSlot: 4, // 1枠あたりの受付可能組数
    maxPartySize: 8,    // Web予約での最大人数（9名以上はお電話）
    defaultPartySize: 2,

    // ==========================================
    // 4. 公式LINEアカウント連携設定
    // ==========================================
    lineOfficialUrl: 'https://line.me/R/ti/p/@bella_tavola',
    lineAccountId: '@bella_tavola',
    lineOaMessageUrl: 'https://line.me/R/oaMessage/@bella_tavola/?',

    // ==========================================
    // 5. 動的シミュレーション・フォールバック設定
    // ==========================================
    fallbackSimulation: true,
    simulationSeedSalt: 'bella_tavola_italian_2026',

    // ==========================================
    // 6. 提供コースマスター (Course Master List)
    // ==========================================
    courseMaster: {
      cena_stagione: {
        id: 'cena_stagione',
        name: '竹：スタジオーネコース（全7品）★人気No.1',
        fullName: '【竹★人気No.1】薪窯ピッツァ＆手打ちパスタ プレミアムコース（全7品）',
        tier: 'bamboo',
        price: 5800,
        priceLabel: '¥5,800（税込）',
        includesDrink: '乾杯スパークリング付',
        durationMin: 120,
        isPopular: true,
        summary: '薪窯マルゲリータと手打ちタリアテッレ ボロネーゼを両方味わえる当店一番人気コース'
      },
      cena_classico: {
        id: 'cena_classico',
        name: '梅：クラシココース（全5品）',
        fullName: '【梅】ナポリ直送モッツァレラの薪窯マルゲリータコース（全5品）',
        tier: 'plum',
        price: 3800,
        priceLabel: '¥3,800（税込）',
        includesDrink: 'ワンドリンク別',
        durationMin: 90,
        isPopular: false,
        summary: '本場ナポリの味を気軽に楽しめるリーズナブルなカジュアルディナーコース'
      },
      cena_speciale: {
        id: 'cena_speciale',
        name: '松：スペチャーレコース（全8品）',
        fullName: '【松★特選】厳選黒毛和牛の薪窯グリルとトリュフ生パスタ フルコース（全8品）',
        tier: 'pine',
        price: 8800,
        priceLabel: '¥8,800（税込）',
        includesDrink: '乾杯スプマンテ＆食後酒付',
        durationMin: 150,
        isPopular: false,
        summary: '記念日やご会食に。薪窯で香ばしく焼き上げる黒毛和牛と季節の贅沢食材を堪能するVIPコース'
      },
      pranzo_speciale: {
        id: 'pranzo_speciale',
        name: 'ランチ：ベッラランチセット',
        fullName: '【平日・土日祝ランチ】薪窯焼き立てピッツァ＆前菜ドルチェセット',
        tier: 'lunch',
        price: 2200,
        priceLabel: '¥2,200（税込）',
        includesDrink: '食後のカフェ付き',
        durationMin: 60,
        isPopular: false,
        summary: '選べる薪窯ピッツァまたは日替わり手打ちパスタ、前菜盛り合わせ、ティラミス、カフェの満足セット'
      },
      seat_only: {
        id: 'seat_only',
        name: 'お席のみのご予約',
        fullName: '【席のみ予約】お料理・お飲み物は当日アラカルトよりご注文',
        tier: 'custom',
        price: 0,
        priceLabel: 'お料理は当日注文',
        includesDrink: 'アラカルト注文',
        durationMin: 120,
        isPopular: false,
        summary: 'ご来店後に薪窯ピッツァや前菜、厳選イタリアワインを自由にお選びいただけます'
      }
    }
  };

  // 下位互換・構造化エイリアス
  RESTAURANT_CONFIG.restaurantInfo = {
    name: RESTAURANT_CONFIG.restaurantName,
    japaneseName: RESTAURANT_CONFIG.restaurantJapaneseName,
    tagline: RESTAURANT_CONFIG.restaurantTagline,
    postalCode: RESTAURANT_CONFIG.restaurantPostalCode,
    address: RESTAURANT_CONFIG.restaurantAddress,
    access: RESTAURANT_CONFIG.restaurantAccess,
    tel: RESTAURANT_CONFIG.restaurantPhone,
    email: RESTAURANT_CONFIG.restaurantEmail,
    businessHours: RESTAURANT_CONFIG.businessHours.label,
    regularHolidays: RESTAURANT_CONFIG.closedDays,
    regularHolidaysLabel: RESTAURANT_CONFIG.closedDaysLabel
  };

  RESTAURANT_CONFIG.gas = {
    webhookUrl: RESTAURANT_CONFIG.gasWebhookUrl,
    timeoutMs: RESTAURANT_CONFIG.gasTimeoutMs
  };

  RESTAURANT_CONFIG.calendar = {
    daysToShow: RESTAURANT_CONFIG.daysToShow,
    shifts: {
      lunch: RESTAURANT_CONFIG.timeSlots.lunch,
      dinner: RESTAURANT_CONFIG.timeSlots.dinner
    },
    closedDays: RESTAURANT_CONFIG.closedDays,
    capacityPerSlot: RESTAURANT_CONFIG.capacityPerSlot
  };

  RESTAURANT_CONFIG.courses = RESTAURANT_CONFIG.courseMaster;
  RESTAURANT_CONFIG.plans = RESTAURANT_CONFIG.courseMaster; // alias for compatibility

  RESTAURANT_CONFIG.line = {
    accountUrl: RESTAURANT_CONFIG.lineOfficialUrl,
    accountId: RESTAURANT_CONFIG.lineAccountId,
    oaMessageBaseUrl: RESTAURANT_CONFIG.lineOaMessageUrl
  };

  RESTAURANT_CONFIG.fallback = {
    enableSimulation: RESTAURANT_CONFIG.fallbackSimulation,
    simulationSeedSalt: RESTAURANT_CONFIG.simulationSeedSalt
  };

  // Global Export
  global.RESTAURANT_CONFIG = RESTAURANT_CONFIG;

  // CommonJS Support for Test Framework
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = RESTAURANT_CONFIG;
  }
})(typeof window !== 'undefined' ? window : this);
```

---

## 3. JavaScript Engine Architecture (`samples/italian/js/italian.js`)

### 3.1 Core Subsystems Overview

| Subsystem | Responsibility | Key Elements |
|---|---|---|
| **1. Shift & Calendar Engine** | 14-day date calculation, lunch/dinner shift tab switching, slot status calculation (◯, △, ✕, 休), deterministic pseudo-random seed | `#calendar-table-container`, `[data-shift-tab]`, `computeDeterministicSlotStatus` |
| **2. Tap-to-Form Auto-Fill** | Selected slot highlight, auto-populating `#form-datetime`, `#form-date`, `#form-time`, `#form-shift`, smooth scroll to `#booking-form` | `.calendar-slot-btn`, `#form-datetime`, `currentSelectedSlot` |
| **3. Form Validation & Submitter** | Real-time field error clearing, RFC-compliant email & tel validation, party size, reservation ID generation (`TAV-YYYYMMDD-XXXX`), non-blocking GAS fetch | `#booking-form`, `has-error`, `resId` |
| **4. Thank-You Modal & 1-Click Sync** | Reservation summary presentation, 1-click Google Calendar Web URL, RFC 5545 `.ics` Dynamic Blob download with 2h alarm, 1-tap pre-filled LINE chat deep link | `#booking-modal`, `#res-id`, `#btn-google-cal`, `#btn-download-ics`, `#btn-line-confirm` |
| **5. Mobile Sticky CTA & Accordion** | Scroll-triggered mobile sticky booking bar, accessible FAQ accordion with `aria-expanded` toggle | `#mobile-sticky-cta`, `.faq-question-btn` |

### 3.2 Detailed Logic & Algorithms

#### A. 14-Day 2-Shift Date & Slot Calculation
1. **Date Generation**: Generates 14 `Date` objects starting from `new Date()` (today).
2. **Shift Switcher**:
   - `lunch`: `['11:30', '12:00', '12:30', '13:00', '13:30']` (5 slots)
   - `dinner`: `['17:30', '18:00', '18:30', '19:00', '19:30', '20:00']` (6 slots)
   - Total possible reservation points: 14 days × 11 slots = 154 slots.
3. **Deterministic Slot Status Algorithm**:
   - If `closedDays.includes(d.getDay())` -> `'closed'` (Symbol: `休`, Label: `定休`, disabled).
   - If `isToday` and current time exceeds slot time -> `'full'` (Symbol: `✕`, Label: `満席`, disabled).
   - Hash seed: `DateString + "-" + SlotTime + "-" + Salt`.
   - Score calculation: `(seed + slotIndex * 7 + (isDinner ? 13 : 0) + (isWeekend ? 17 : 0)) % 100`.
   - Realistic distribution:
     - `score < 48`: `'available'` (`◯` 空き)
     - `48 <= score < 78`: `'limited'` (`△` 残りわずか)
     - `score >= 78`: `'full'` (`✕` 満席)

#### B. Reservation ID Format
- **Format**: `TAV-YYYYMMDD-XXXX`
  - Prefix: `TAV` (Bella Tavola)
  - Date: `YYYYMMDD` (Submission date, e.g. `20260821`)
  - Random code: 4 uppercase hex characters (e.g. `4B2E`)
  - Regex verification: `^TAV-\d{8}-[A-Z0-9]{4}$`

#### C. Calendar & LINE Integration Payload URLs
1. **Google Calendar Web URL**:
   - Start ISO: `YYYYMMDDTHHMMSS`
   - End ISO: `YYYYMMDDTHHMMSS` (calculated based on course duration, default 120 mins)
   - URL: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=...&dates=...&details=...&location=...`
2. **RFC 5545 Apple / Outlook `.ics` Dynamic Blob**:
   - Content includes `BEGIN:VCALENDAR`, `BEGIN:VEVENT`, `UID:TAV-...@bellatavola.example.com`, `DTSTART`, `DTEND`, `SUMMARY`, `DESCRIPTION`, `LOCATION`, and `BEGIN:VALARM` (`TRIGGER:-PT2H` for 2-hour reminder).
   - Generated client-side using `new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' })` and triggered via transient `<a>` download.
3. **1-Tap LINE Official Account Deep Link**:
   - URL: `https://line.me/R/oaMessage/@bella_tavola/?` + `encodeURIComponent(messageText)`
   - Pre-filled message with reservation ID, customer name, date/time, party size, course, seating preference, and special requests.

---

## 4. Complete Code Blueprints

### 4.1 Production Code: `samples/italian/js/config.js`
*(See Section 2.1 for complete 160-line specification)*

### 4.2 Production Code: `samples/italian/js/italian.js`

```javascript
/**
 * samples/italian/js/italian.js
 * Vanilla JavaScript for TRATTORIA & PIZZERIA BELLA TAVOLA Landing Page
 * 
 * Subsystems:
 * 1. 14-Day 2-Shift (Lunch / Dinner) Seat Availability Calendar Engine
 * 2. Deterministic Offline Fallback Simulation & GAS Real-time Sync
 * 3. Slot Tap-to-Form Auto-Fill & Smooth Scroll Navigation
 * 4. Course Plan Preselection from Menu Buttons
 * 5. Booking Form Validation & Submit Handling
 * 6. Reservation ID Generation (TAV-YYYYMMDD-XXXX)
 * 7. 1-Click Google Calendar Web Integration
 * 8. RFC 5545 Apple / Outlook (.ics) Dynamic Blob Generator (with 2-Hour VALARM)
 * 9. 1-Tap LINE Official Account Deep Link Confirmation
 * 10. Scroll-triggered Mobile Sticky CTA Bar
 * 11. Accessible FAQ Accordion Toggle (WAI-ARIA compliant)
 * 12. Smooth In-Page Anchor Scrolling with Sticky Header Offset
 * 
 * Zero external runtime dependencies.
 */

(function () {
  'use strict';

  // Global State
  var currentSelectedShift = 'dinner'; // default active shift tab
  var currentSelectedSlot = null;
  var cachedRemoteAvailability = null;

  document.addEventListener('DOMContentLoaded', function () {
    initItalianCalendar();
    initCoursePreselectors();
    initBookingForm();
    initStickyCTA();
    initFAQAccordion();
    initSmoothScroll();
  });

  /**
   * Helper: Format Date object to YYYY-MM-DD
   */
  function formatDateIso(d) {
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  /**
   * Helper: Format Date object to Japanese Display String (e.g. 2026年8月22日(土))
   */
  function formatDateJapanese(d) {
    var weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    var y = d.getFullYear();
    var m = d.getMonth() + 1;
    var day = d.getDate();
    var w = weekdays[d.getDay()];
    return y + '年' + m + '月' + day + '日(' + w + ')';
  }

  /**
   * Helper: Compute deterministic status for offline fallback
   */
  function computeDeterministicSlotStatus(dateObj, slotTime, shift, cfg) {
    var jsWeekday = dateObj.getDay();
    var closedDays = (cfg && cfg.closedDays) || [2];
    if (closedDays.indexOf(jsWeekday) !== -1) {
      return 'closed';
    }

    // Check if slot time has passed on current day
    var now = new Date();
    var isToday = (
      dateObj.getFullYear() === now.getFullYear() &&
      dateObj.getMonth() === now.getMonth() &&
      dateObj.getDate() === now.getDate()
    );

    if (isToday) {
      var timeParts = slotTime.split(':');
      var slotH = parseInt(timeParts[0], 10);
      var slotM = parseInt(timeParts[1], 10);
      if (now.getHours() > slotH || (now.getHours() === slotH && now.getMinutes() >= slotM)) {
        return 'full';
      }
    }

    var dateStr = formatDateIso(dateObj);
    var isDinner = shift === 'dinner';
    var isWeekend = (jsWeekday === 0 || jsWeekday === 6);

    var seedStr = dateStr + '-' + slotTime + '-' + (cfg.simulationSeedSalt || 'bella_tavola');
    var seed = 0;
    for (var i = 0; i < seedStr.length; i++) {
      seed = (seed * 31 + seedStr.charCodeAt(i)) % 4294967296;
    }

    // Popularity weighting: weekend dinners are more limited/full
    var bonus = (isDinner ? 12 : 0) + (isWeekend ? 18 : 0);
    var score = (seed + bonus) % 100;

    if (score < 45) {
      return 'available';
    } else if (score < 75) {
      return 'limited';
    } else {
      return 'full';
    }
  }

  function getStatusSymbol(status) {
    switch (status) {
      case 'available': return '◯';
      case 'limited':   return '△';
      case 'full':      return '✕';
      case 'closed':    return '休';
      default:          return '✕';
    }
  }

  function getStatusLabel(status) {
    switch (status) {
      case 'available': return '空き';
      case 'limited':   return '残りわずか';
      case 'full':      return '満席';
      case 'closed':    return '定休';
      default:          return '満席';
    }
  }

  /**
   * 1. 14-Day 2-Shift Seat Availability Calendar Engine
   */
  function initItalianCalendar() {
    var container = document.getElementById('calendar-table-container');
    var shiftTabs = document.querySelectorAll('[data-shift-tab]');
    if (!container) return;

    var cfg = window.RESTAURANT_CONFIG || {
      closedDays: [2],
      timeSlots: {
        lunch: ['11:30', '12:00', '12:30', '13:00', '13:30'],
        dinner: ['17:30', '18:00', '18:30', '19:00', '19:30', '20:00']
      },
      daysToShow: 14,
      gasWebhookUrl: ''
    };

    var daysToShow = cfg.daysToShow || 14;
    var weekdays = ['日', '月', '火', '水', '木', '金', '土'];

    // Generate 14 consecutive dates starting from today
    var today = new Date();
    var dates = [];
    for (var i = 0; i < daysToShow; i++) {
      var d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
      dates.push(d);
    }

    function renderGrid(shift) {
      var slots = (cfg.timeSlots && cfg.timeSlots[shift]) || (shift === 'lunch'
        ? ['11:30', '12:00', '12:30', '13:00', '13:30']
        : ['17:30', '18:00', '18:30', '19:00', '19:30', '20:00']);

      var shiftLabel = shift === 'lunch' ? 'ランチ席予約' : 'ディナー席予約';
      var tableHtml = '<table class="calendar-grid-table" aria-label="14日間 ' + shiftLabel + ' 空き状況カレンダー">';

      // THEAD
      tableHtml += '<thead><tr>';
      tableHtml += '<th scope="col" class="calendar-corner-th">時間枠</th>';

      dates.forEach(function (d, idx) {
        var isToday = idx === 0;
        var jsWeekday = d.getDay();
        var isSat = jsWeekday === 6;
        var isSun = jsWeekday === 0;
        var dateStr = (d.getMonth() + 1) + '/' + d.getDate();
        var weekdayStr = weekdays[jsWeekday];

        var thClass = 'calendar-date-th';
        if (isToday) thClass += ' is-today';
        if (isSat) thClass += ' is-sat';
        if (isSun) thClass += ' is-sun';

        tableHtml += '<th scope="col" class="' + thClass + '">';
        if (isToday) {
          tableHtml += '<span class="th-today-badge">本日</span>';
        }
        tableHtml += '<span class="th-date-str">' + dateStr + '</span>';
        tableHtml += '<span class="th-weekday-str">(' + weekdayStr + ')</span>';
        tableHtml += '</th>';
      });

      tableHtml += '</tr></thead>';

      // TBODY
      tableHtml += '<tbody>';

      slots.forEach(function (slotTime) {
        tableHtml += '<tr>';
        tableHtml += '<td class="calendar-time-td">' + slotTime + '</td>';

        dates.forEach(function (d) {
          var dateIso = formatDateIso(d);
          var jsWeekday = d.getDay();
          var weekdayStr = weekdays[jsWeekday];
          var shiftJp = shift === 'lunch' ? 'ランチ' : 'ディナー';
          var formattedJapanese = formatDateJapanese(d) + ' ' + slotTime + '〜 (' + shiftJp + ')';

          var status = 'full';
          if (cachedRemoteAvailability && cachedRemoteAvailability[dateIso] && cachedRemoteAvailability[dateIso][slotTime]) {
            var s = cachedRemoteAvailability[dateIso][slotTime];
            status = typeof s === 'string' ? s : (s.status || 'full');
          } else {
            status = computeDeterministicSlotStatus(d, slotTime, shift, cfg);
          }

          var symbol = getStatusSymbol(status);
          var label = getStatusLabel(status);
          var isDisabled = (status === 'full' || status === 'closed');
          var isSelected = currentSelectedSlot && currentSelectedSlot.date === dateIso && currentSelectedSlot.time === slotTime;
          var btnClass = 'calendar-slot-btn is-' + status + (isSelected ? ' is-selected' : '');

          tableHtml += '<td class="calendar-slot-td">';
          tableHtml += '<button type="button" class="' + btnClass + '" ';
          tableHtml += 'data-date="' + dateIso + '" ';
          tableHtml += 'data-time="' + slotTime + '" ';
          tableHtml += 'data-shift="' + shift + '" ';
          tableHtml += 'data-day="' + weekdayStr + '" ';
          tableHtml += 'data-status="' + status + '" ';
          tableHtml += 'data-formatted="' + formattedJapanese + '" ';
          tableHtml += 'aria-label="' + formattedJapanese + ' 空き状況: ' + label + '" ';
          if (isDisabled) {
            tableHtml += 'disabled="disabled" aria-disabled="true"';
          }
          tableHtml += '>';
          tableHtml += '<span class="slot-symbol">' + symbol + '</span>';
          tableHtml += '<span class="slot-sublabel">' + label + '</span>';
          tableHtml += '</button>';
          tableHtml += '</td>';
        });

        tableHtml += '</tr>';
      });

      tableHtml += '</tbody></table>';
      container.innerHTML = tableHtml;

      // Attach Click Listeners
      var slotButtons = container.querySelectorAll('.calendar-slot-btn:not([disabled])');
      slotButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          // Update selection
          var allSlots = container.querySelectorAll('.calendar-slot-btn');
          allSlots.forEach(function (s) { s.classList.remove('is-selected'); });
          btn.classList.add('is-selected');

          var formattedStr = btn.getAttribute('data-formatted') || '';
          var dateVal = btn.getAttribute('data-date') || '';
          var timeVal = btn.getAttribute('data-time') || '';
          var shiftVal = btn.getAttribute('data-shift') || 'dinner';
          var dayVal = btn.getAttribute('data-day') || '';

          currentSelectedSlot = {
            date: dateVal,
            time: timeVal,
            shift: shiftVal,
            day: dayVal,
            formatted: formattedStr
          };

          // Populate Form Inputs
          var datetimeInput = document.getElementById('form-datetime');
          var dateHidden = document.getElementById('form-date');
          var timeHidden = document.getElementById('form-time');
          var shiftHidden = document.getElementById('form-shift');

          if (datetimeInput) {
            datetimeInput.value = formattedStr;
            var group = datetimeInput.closest('.form-group');
            if (group) group.classList.remove('has-error');
          }
          if (dateHidden) dateHidden.value = dateVal;
          if (timeHidden) timeHidden.value = timeVal;
          if (shiftHidden) shiftHidden.value = shiftVal;

          // If course is not set, select default based on shift
          var courseSelect = document.getElementById('form-course');
          if (courseSelect && !courseSelect.value) {
            courseSelect.value = shiftVal === 'lunch' ? 'pranzo_speciale' : 'cena_stagione';
          }

          // Smoothly scroll down to the booking form
          var bookingFormSection = document.getElementById('booking-form') || document.getElementById('action');
          if (bookingFormSection) {
            var headerOffset = 70;
            var elementPosition = bookingFormSection.getBoundingClientRect().top;
            var offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }

          // Focus on party size or name
          var guestsSelect = document.getElementById('form-guests');
          if (guestsSelect) {
            setTimeout(function () { guestsSelect.focus(); }, 400);
          }
        });
      });
    }

    // Shift Tab Switching Listener
    shiftTabs.forEach(function (tab) {
      tab.addEventListener('click', function (e) {
        e.preventDefault();
        var shift = this.getAttribute('data-shift-tab') || 'dinner';
        currentSelectedShift = shift;

        shiftTabs.forEach(function (t) {
          var isActive = t === tab;
          t.classList.toggle('is-active', isActive);
          t.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        renderGrid(shift);
      });
    });

    // Remote GAS Fetch (Optional)
    if (cfg.gasWebhookUrl && typeof cfg.gasWebhookUrl === 'string' && cfg.gasWebhookUrl.trim() !== '') {
      var startDateStr = formatDateIso(dates[0]);
      var fetchUrl = cfg.gasWebhookUrl + '?action=getAvailability&days=' + daysToShow + '&startDate=' + startDateStr;

      var timeoutPromise = new Promise(function (_, reject) {
        setTimeout(function () { reject(new Error('GAS fetch timeout')); }, 4500);
      });

      Promise.race([fetch(fetchUrl), timeoutPromise])
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.json();
        })
        .then(function (data) {
          if (data && data.status === 'success' && (data.availability || data.slots)) {
            cachedRemoteAvailability = data.availability || data.slots;
            renderGrid(currentSelectedShift);
          } else {
            renderGrid(currentSelectedShift);
          }
        })
        .catch(function (err) {
          console.warn('GAS live availability fetch failed, fallback simulation active:', err);
          renderGrid(currentSelectedShift);
        });
    } else {
      renderGrid(currentSelectedShift);
    }
  }

  /**
   * 2. Course Preselection from Menu/Offer Buttons
   */
  function initCoursePreselectors() {
    var courseButtons = document.querySelectorAll('.js-select-course');
    var courseSelect = document.getElementById('form-course');

    courseButtons.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        var courseId = btn.getAttribute('data-course');
        if (courseSelect && courseId) {
          courseSelect.value = courseId;
        }

        // Check if shift matches course
        if (courseId === 'pranzo_speciale') {
          var lunchTab = document.querySelector('[data-shift-tab="lunch"]');
          if (lunchTab && !lunchTab.classList.contains('is-active')) {
            lunchTab.click();
          }
        } else if (courseId.indexOf('cena_') === 0) {
          var dinnerTab = document.querySelector('[data-shift-tab="dinner"]');
          if (dinnerTab && !dinnerTab.classList.contains('is-active')) {
            dinnerTab.click();
          }
        }
      });
    });
  }

  /**
   * 3. Booking Form Validation, Submission & Thank-You Modal
   */
  function initBookingForm() {
    var bookingForm = document.getElementById('booking-form');
    var modal = document.getElementById('booking-modal');
    var modalCloseBtn = document.getElementById('modal-close');
    var modalSuccessCloseBtn = document.getElementById('modal-success-close-btn');

    if (!bookingForm) return;

    function openModal() {
      if (!modal) return;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      if (!modal) return;
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalSuccessCloseBtn) modalSuccessCloseBtn.addEventListener('click', closeModal);

    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) closeModal();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
        closeModal();
      }
    });

    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var isValid = true;
      var requiredFields = bookingForm.querySelectorAll('[required]');

      requiredFields.forEach(function (field) {
        var group = field.closest('.form-group');
        var value = field.value ? field.value.trim() : '';

        if (!value) {
          isValid = false;
          if (group) group.classList.add('has-error');
        } else {
          if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            isValid = false;
            if (group) group.classList.add('has-error');
          } else if (field.type === 'tel' && !/^[0-9\-+]{10,15}$/.test(value.replace(/[\s\(\)]/g, ''))) {
            isValid = false;
            if (group) group.classList.add('has-error');
          } else {
            if (group) group.classList.remove('has-error');
          }
        }

        field.addEventListener('input', function () {
          if (group) group.classList.remove('has-error');
        }, { once: true });
      });

      if (!isValid) {
        var firstErr = bookingForm.querySelector('.has-error input, .has-error select');
        if (firstErr) firstErr.focus();
        return;
      }

      // Extract Form Values
      var nameVal = (document.getElementById('form-name') || {}).value || '';
      var phoneVal = (document.getElementById('form-phone') || {}).value || '';
      var emailVal = (document.getElementById('form-email') || {}).value || '';
      var guestsVal = (document.getElementById('form-guests') || {}).value || '2';
      var courseSelect = document.getElementById('form-course');
      var courseKey = courseSelect ? courseSelect.value : 'cena_stagione';
      var seatingSelect = document.getElementById('form-seating');
      var seatingVal = seatingSelect ? seatingSelect.options[seatingSelect.selectedIndex].text : 'テーブル席';
      var datetimeVal = (document.getElementById('form-datetime') || {}).value || '';
      var notesVal = (document.getElementById('form-notes') || {}).value || '';

      var cfg = window.RESTAURANT_CONFIG || {};
      var restaurantName = cfg.restaurantName || 'TRATTORIA & PIZZERIA BELLA TAVOLA';
      var restaurantAddress = cfg.restaurantAddress || '東京都渋谷区恵比寿1-23-45 BELLAビル 1F';
      var restaurantPhone = cfg.restaurantPhone || '03-5678-9012';
      var lineId = cfg.lineAccountId || '@bella_tavola';

      var courseObj = (cfg.courseMaster && cfg.courseMaster[courseKey]) || {
        name: '竹：スタジオーネコース（全7品）',
        durationMin: 120,
        priceLabel: '¥5,800'
      };
      var courseName = courseObj.name || '竹：スタジオーネコース（全7品）';
      var durationMin = courseObj.durationMin || 120;

      // 1. Generate Reservation ID (format: TAV-YYYYMMDD-XXXX)
      var now = new Date();
      var yStr = String(now.getFullYear());
      var mStr = String(now.getMonth() + 1).padStart(2, '0');
      var dStr = String(now.getDate()).padStart(2, '0');
      var hexChars = '0123456789ABCDEF';
      var randCode = '';
      for (var ci = 0; ci < 4; ci++) {
        randCode += hexChars.charAt(Math.floor(Math.random() * hexChars.length));
      }
      var resId = 'TAV-' + yStr + mStr + dStr + '-' + randCode;

      // 2. Parse Date & Start/End Timestamps
      var dateMatch = datetimeVal.match(/(\d{4})[年\-\/](\d{1,2})[月\-\/](\d{1,2})/);
      var timeMatch = datetimeVal.match(/(\d{1,2}):(\d{2})/);

      var bYear = dateMatch ? dateMatch[1] : yStr;
      var bMonth = dateMatch ? String(dateMatch[2]).padStart(2, '0') : mStr;
      var bDay = dateMatch ? String(dateMatch[3]).padStart(2, '0') : dStr;
      var dateClean = bYear + '-' + bMonth + '-' + bDay;

      var startH = timeMatch ? parseInt(timeMatch[1], 10) : 18;
      var startM = timeMatch ? parseInt(timeMatch[2], 10) : 30;
      var startIso = bYear + bMonth + bDay + 'T' + String(startH).padStart(2, '0') + String(startM).padStart(2, '0') + '00';

      var endTotalMin = startH * 60 + startM + durationMin;
      var endH = Math.floor(endTotalMin / 60) % 24;
      var endM = endTotalMin % 60;
      var endIso = bYear + bMonth + bDay + 'T' + String(endH).padStart(2, '0') + String(endM).padStart(2, '0') + '00';

      // 3. Optional Async GAS Webhook Dispatch
      if (cfg.gasWebhookUrl && typeof cfg.gasWebhookUrl === 'string' && cfg.gasWebhookUrl.trim() !== '') {
        try {
          fetch(cfg.gasWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
              action: 'createBooking',
              restaurant: restaurantName,
              reservationId: resId,
              name: nameVal,
              phone: phoneVal,
              email: emailVal,
              guests: guestsVal,
              course: courseName,
              courseId: courseKey,
              seating: seatingVal,
              date: dateClean,
              time: String(startH).padStart(2, '0') + ':' + String(startM).padStart(2, '0'),
              datetime: datetimeVal,
              shift: currentSelectedShift,
              notes: notesVal,
              createdAt: new Date().toISOString()
            })
          }).catch(function (err) {
            console.warn('GAS POST booking error (fallback handled seamlessly):', err);
          });
        } catch (postErr) {
          console.warn('GAS POST exception:', postErr);
        }
      }

      // 4. Populate Thank-You View Details in Modal
      var resIdElem = document.getElementById('res-id');
      var resNameElem = document.getElementById('res-name');
      var resGuestsElem = document.getElementById('res-guests');
      var resCourseElem = document.getElementById('res-course');
      var resDatetimeElem = document.getElementById('res-datetime');
      var resSeatingElem = document.getElementById('res-seating');
      var resRestaurantElem = document.getElementById('res-restaurant');

      if (resIdElem) resIdElem.textContent = resId;
      if (resNameElem) resNameElem.textContent = nameVal + ' 様';
      if (resGuestsElem) resGuestsElem.textContent = guestsVal + ' 名様';
      if (resCourseElem) resCourseElem.textContent = courseName;
      if (resDatetimeElem) resDatetimeElem.textContent = datetimeVal;
      if (resSeatingElem) resSeatingElem.textContent = seatingVal;
      if (resRestaurantElem) resRestaurantElem.textContent = restaurantName + ' (' + restaurantAddress + ')';

      // 5. Setup Google Calendar 1-Click Link
      var gcalTitle = '【席予約完了】' + restaurantName + ' (' + guestsVal + '名様)';
      var gcalDetails = 'ご予約番号: ' + resId + '\nお名前: ' + nameVal + ' 様\n人数: ' + guestsVal + '名様\nコース: ' + courseName + '\nお席: ' + seatingVal + '\n店舗: ' + restaurantName + '\n電話: ' + restaurantPhone + '\n※ご来店を心よりお待ち申し上げております。';
      var gcalUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' +
        encodeURIComponent(gcalTitle) +
        '&dates=' + startIso + '/' + endIso +
        '&details=' + encodeURIComponent(gcalDetails) +
        '&location=' + encodeURIComponent(restaurantAddress);

      var googleCalBtn = document.getElementById('btn-google-cal');
      if (googleCalBtn) {
        googleCalBtn.href = gcalUrl;
      }

      // 6. Setup Apple Calendar / Outlook (.ics) RFC 5545 Generator
      var icsDownloadBtn = document.getElementById('btn-download-ics');
      if (icsDownloadBtn) {
        icsDownloadBtn.onclick = function () {
          var dtStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
          var icsLines = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//BELLA TAVOLA//Restaurant Reservation System//JA',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH',
            'BEGIN:VEVENT',
            'UID:' + resId + '@bellatavola.example.com',
            'DTSTAMP:' + dtStamp,
            'DTSTART:' + startIso,
            'DTEND:' + endIso,
            'SUMMARY:【席予約】' + restaurantName + ' (' + guestsVal + '名様)',
            'DESCRIPTION:ご予約番号: ' + resId + '\\nお名前: ' + nameVal + ' 様\\n人数: ' + guestsVal + '名様\\nコース: ' + courseName + '\\n場所: ' + restaurantAddress + '\\n電話: ' + restaurantPhone,
            'LOCATION:' + restaurantAddress,
            'STATUS:CONFIRMED',
            'BEGIN:VALARM',
            'TRIGGER:-PT2H',
            'ACTION:DISPLAY',
            'DESCRIPTION:BELLA TAVOLA ご予約の2時間前リマインダー',
            'END:VALARM',
            'END:VEVENT',
            'END:VCALENDAR'
          ];

          var icsContent = icsLines.join('\r\n');
          var icsBlob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
          var downloadLink = document.createElement('a');
          downloadLink.href = URL.createObjectURL(icsBlob);
          downloadLink.download = 'bella_tavola_reservation_' + resId + '.ics';
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        };
      }

      // 7. Setup LINE 1-Tap Confirmation Deep Link
      var timeDisplayStr = String(startH).padStart(2, '0') + ':' + String(startM).padStart(2, '0');
      var shiftJp = currentSelectedShift === 'lunch' ? 'ランチ' : 'ディナー';
      var lineMsg = '【席予約確認】\n予約番号: ' + resId + '\nお名前: ' + nameVal + ' 様\nご予約日時: ' + dateClean + ' ' + timeDisplayStr + ' (' + shiftJp + ')\n人数: ' + guestsVal + '名様\n選択コース: ' + courseName + '\nお席希望: ' + seatingVal + (notesVal ? '\nご要望: ' + notesVal : '') + '\nよろしくお願いいたします。';
      var lineUrl = 'https://line.me/R/oaMessage/' + lineId + '/?' + encodeURIComponent(lineMsg);

      var lineConfirmBtn = document.getElementById('btn-line-confirm');
      if (lineConfirmBtn) {
        lineConfirmBtn.href = lineUrl;
      }

      // 8. Open Confirmation Modal & Reset Form
      openModal();
      bookingForm.reset();
    });
  }

  /**
   * 4. Mobile Sticky CTA Bar Logic
   */
  function initStickyCTA() {
    var stickyBar = document.getElementById('mobile-sticky-cta');
    var actionSection = document.getElementById('action') || document.getElementById('booking-form');
    if (!stickyBar) return;

    var ticking = false;

    function updateStickyVisibility() {
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;
      var showThreshold = 350;

      var actionInView = false;
      if (actionSection) {
        var rect = actionSection.getBoundingClientRect();
        var windowHeight = window.innerHeight || document.documentElement.clientHeight;
        if (rect.top < windowHeight && rect.bottom > 100) {
          actionInView = true;
        }
      }

      if (scrollY > showThreshold && !actionInView) {
        stickyBar.classList.add('is-visible');
      } else {
        stickyBar.classList.remove('is-visible');
      }

      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(updateStickyVisibility);
        ticking = true;
      }
    }, { passive: true });

    updateStickyVisibility();
  }

  /**
   * 5. Accessible FAQ Accordion
   */
  function initFAQAccordion() {
    var faqButtons = document.querySelectorAll('.faq-question-btn');

    faqButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var faqItem = button.closest('.faq-item');
        if (!faqItem) return;

        var isExpanded = button.getAttribute('aria-expanded') === 'true';

        if (isExpanded) {
          button.setAttribute('aria-expanded', 'false');
          faqItem.classList.remove('is-active');
        } else {
          button.setAttribute('aria-expanded', 'true');
          faqItem.classList.add('is-active');
        }
      });
    });
  }

  /**
   * 6. Smooth Scrolling for In-Page Anchor Links
   */
  function initSmoothScroll() {
    var anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (!href || href === '#') return;

        var targetEl = document.querySelector(href);
        if (targetEl) {
          e.preventDefault();
          var headerOffset = 70;
          var elementPosition = targetEl.getBoundingClientRect().top;
          var offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }
})();
```

---

## 5. Top Portal Showcase Integration (`index.html`)

### 5.1 Card Upgrade in `index.html` (飲食・グルメ Category)
In `index.html`, replace the teaser card under `data-category="dining"` with a live featured card:

```html
<!-- 4. Dining / Gourmet Live Card (Italian Restaurant LP) -->
<article class="lp-card live-card" data-category="dining" id="card-italian">
  <div class="card-visual-preview">
    <img src="./samples/italian/assets/images/pizza_margherita.jpg" alt="本格石窯ピッツァ＆手打ちパスタ LP プレビュー" class="card-thumb-img" loading="lazy">
    <div class="card-badge-overlay">
      <span class="badge-live">
        <span class="status-dot" aria-hidden="true"></span>
        <span>公開中 (LIVE DEMO)</span>
      </span>
      <span class="badge-pasona">新PASONA完全準拠</span>
    </div>
  </div>
  <div class="card-content-body">
    <div class="card-tags-list">
      <span class="badge-tag">薪窯ピッツァ</span>
      <span class="badge-tag">手打ち生パスタ</span>
      <span class="badge-tag">14日2部制席予約</span>
    </div>
    <h3 class="card-title">本格石窯ピッツァ＆手打ちパスタ イタリアン LP</h3>
    <p class="card-subtitle">TRATTORIA & PIZZERIA BELLA TAVOLA</p>
    <p class="card-desc">
      新PASONAの法則によるシズル感あふれる訴求、ランチ/ディナー2部制の14日間リアルタイム席予約カレンダー、Google/Appleカレンダー登録＆LINE連動を備えたカジュアルイタリアンLP。
    </p>
    <div class="card-highlights">
      <div class="highlight-item">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        <span>新PASONA全7セクション（シズル写真・3大こだわり・コース比較・松竹梅プラン）</span>
      </div>
      <div class="highlight-item">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        <span>ランチ＆ディナー2部制 14日間席空き状況カレンダー（◯・△・✕・定休）</span>
      </div>
      <div class="highlight-item">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        <span>1クリックGoogle/Appleカレンダー登録 ＆ LINE公式1タップ予約連動</span>
      </div>
    </div>
    <div class="card-footer-actions">
      <a href="./samples/italian/index.html" class="btn-primary-demo" id="link-italian-demo">
        <span>実機デモを見る</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </a>
      <span class="target-audience-text">ターゲット: 20〜40代 カップル・女子会・歓送迎会幹事</span>
    </div>
  </div>
</article>
```

---

## 6. Image Asset Mapping & Sizzle Visual Specification

The 4 generated image assets in `samples/italian/assets/images/` are mapped to PASONA sections as follows:

| File Path | Dimensions / Type | PASONA Section | Purpose & Visual Design |
|---|---|---|---|
| `samples/italian/assets/images/trattoria_interior.jpg` | High-res JPEG (1.1MB) | Hero (#hero) & Problem/Affinity | Warm wood, ambient amber lighting, open kitchen with authentic brick wood-fired oven |
| `samples/italian/assets/images/pizza_margherita.jpg` | High-res JPEG (845KB) | Solution (#solution) & Menu (#offer) | Wood-fired blistered crust, melted fresh Campania mozzarella, fresh basil, extra virgin olive oil sizzle |
| `samples/italian/assets/images/handmade_pasta.jpg` | High-res JPEG (853KB) | Solution (#solution) & Menu (#offer) | Freshly extruded golden tagliatelle bolognese, rich slow-cooked beef ragù, aged Parmigiano Reggiano dusting |
| `samples/italian/assets/images/dolce_tiramisu.jpg` | High-res JPEG (769KB) | Menu (#offer) & Dessert Showcase | House-made mascarpone tiramisu dusted with Valrhona cocoa powder paired with Italian espresso |

---

## 7. Testing Infrastructure Extension Blueprint

### 7.1 Automated Test Suite Structure
The test suite (`tests/run_all_tests.py`, `tests/test_interactive_ui.py`, `tests/validate_links.py`, `tests/validate_pasona_dom.py`) will be extended to assert the following:

```
[Tier 1: Feature Coverage]
- TC-ITL-CFG-01: samples/italian/js/config.js existence and window.RESTAURANT_CONFIG schema
- TC-ITL-CFG-02: businessHours lunch/dinner 2-shift and timeSlots (5 lunch / 6 dinner slots)
- TC-ITL-CAL-01: 14-day date range generation across lunch & dinner shifts
- TC-ITL-CAL-02: Total 154 slot capacity (14 days × 11 slots/day)
- TC-ITL-CAL-03: Tuesday closed day automatic '休' status calculation
- TC-ITL-SLT-01: ◯ (available), △ (limited), ✕ (full), 休 (closed) status and CSS classes
- TC-ITL-TAP-01: Slot tap event binding and #form-datetime auto-population
- TC-ITL-TNK-01: Reservation ID format compliance (TAV-YYYYMMDD-XXXX)
- TC-ITL-ICS-01: Google Calendar Web URL generation and RFC 5545 .ics Blob generation with VALARM
- TC-ITL-LIN-01: LINE Official deep link URL generation with pre-filled party size & course
- TC-ITL-DEP-01: Bi-directional relative navigation (index.html <-> samples/italian/index.html)
- TC-ITL-DEP-02: Asset zero 404 guarantee (all 4 images exist with exact case matching)

[Tier 2: Boundary & Corner Cases]
- TC-ITL-B01: Month-end rollover across shifts (e.g. 8/31 -> 9/1)
- TC-ITL-B02: Past-hour slot disabling on current day
- TC-ITL-B03: Rapid shift tab toggling without DOM memory leak
- TC-ITL-B04: Party size boundary testing (1 to 8 guests)
- TC-ITL-B05: Reservation ID uniqueness across 1,000 simulations
- TC-ITL-B06: Multibyte Japanese customer names and special allergy notes encoding
```

---

## 8. Verification Strategy for Implementer

1. **Static Analysis**:
   - `python tests/validate_links.py`: Verifies zero root-relative `/` links, 100% existing image/script paths, and script load order (`config.js` before `italian.js`).
   - `python tests/validate_pasona_dom.py`: Verifies New PASONA 7 sections, single H1, and ARIA attributes.
2. **Master Test Runner**:
   - `python tests/run_all_tests.py`: Runs all 4 tiers of test cases (100% PASS requirement).
3. **Browser Simulation**:
   - Verify shift switching (Lunch vs Dinner), slot clicking, modal submission, .ics downloading, Google Calendar URL opening, and LINE URL opening.
