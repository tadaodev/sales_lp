# Project: Sales LP Portal & Legal Consulting Sample LP (LUMEN LEGAL CONSULTING)

## Architecture
- **Multi-Vertical Landing Page Suite**: Hosted on GitHub Pages (`https://tadaodev.github.io/sales_lp/`), zero hosting cost.
  - Portal (`index.html`): Filterable showcase with category tabs (All, 美容・サロン, 飲食・店舗, 士業・法務, etc.) and preview modals.
  - Aesthetic Salon Sample (`samples/aesthetic/`): Luxury aesthetic salon LP with 14-day slot availability, GAS integration, .ics & LINE integration.
  - Italian Restaurant Sample (`samples/italian/`): Casual Italian restaurant "TRATTORIA & PIZZERIA BELLA TAVOLA" LP based on new PASONA formula, warm modern styling, lunch/dinner 2-shift seat calendar.
  - Legal Consulting Sample (`samples/legal/`): Corporate legal & labor consulting "LUMEN LEGAL CONSULTING" LP based on new PASONA formula (risk avoidance), Luxury Glassmorphism UI (Navy `#0A192F` & Champagne Gold `#D4AF37`), 4 photographic AI visual assets, 14-day 2WAY consultation booking calendar (Zoom online vs In-person Marunouchi office), Matsutake 3-tier pricing, Google/Apple (.ics with 2h alarm) calendar integration, and LINE instant consultation.
- **Static Frontend Architecture**: Pure HTML5, Modern CSS (CSS custom properties, Glassmorphism `backdrop-filter: blur(16px)`), Vanilla ES6+ JavaScript.
- **Serverless Backend (GAS)**: Google Apps Script Web App (`gas/Code.gs`) providing reservation endpoints and ledger recording.
- **Centralized Configuration**: `samples/legal/js/config.js` (`window.LEGAL_CONFIG`) defining firm info, consultation modes (Zoom online / In-person), business hours (9:30-19:30), closed days (Sat/Sun [0, 6]), time slots (10:00/13:00/15:30/18:00), 14-day span, LINE ID, and deterministic fallback simulation.
- **Offline / Standalone Fallback**: Deterministic calculation engine providing realistic availability (◯, △, ✕, 休) and seamless mock booking without breaking user experience when GAS URL is unset or offline.
- **Automated Test Infrastructure**: Multi-tier Python test runner (`tests/run_all_tests.py`), verifying links, DOM structures, responsive UI, 2WAY consultation calendar calculations, and deployment integrity (100% pass guarantee).

---

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Legal Consulting Sample LP HTML/CSS/JS | Full new PASONA structure (Problem, Affinity, Solution, Offer, Narrowing, Action, FAQ) with Luxury Glassmorphism (Navy & Champagne Gold) | M1 | ORIGINAL_REQUEST §R1 |
| 2 | High-Resolution AI Image Assets | 4 photographic visual assets (`hero_consultation.jpg`, `partner_portrait.jpg`, `legal_contract_review.jpg`, `boardroom_meeting.jpg`) under `samples/legal/assets/images/` | M1 | ORIGINAL_REQUEST §R2 |
| 3 | Unified Config & 2WAY Consultation Calendar | `config.js` with `window.LEGAL_CONFIG`, Zoom online vs In-person 2WAY mode, 4 slots (10:00/13:00/15:30/18:00), 14-day availability calculation & fallback | M1 | ORIGINAL_REQUEST §R3 |
| 4 | Consultation Modal & ICS / LINE Integration | Modal on submit with booking ID (`LEG-YYYYMMDD-XXXX` or `LUM-YYYYMMDD-XXXX`), Google Calendar, Apple Calendar (.ics with 2h alarm), and 1-tap LINE confirmation | M1 | ORIGINAL_REQUEST §R3 |
| 5 | Top Portal Integration & Bi-directional Nav | Add Legal LP card to `index.html` under "士業・法務" filter with LIVE DEMO badge, quick links, and bidirectional navigation | M2 | ORIGINAL_REQUEST §R4 |
| 6 | Automated Test Suite Extension | Extend `tests/` with Legal LP DOM, relative links, responsive checks, 2WAY calendar, and image presence (100% pass) | M3 | ORIGINAL_REQUEST §R5 |
| 7 | Git Commit & GitHub Pages Push | Commit all changes and push to `main` for instant deployment | M4 | ORIGINAL_REQUEST §R5 |

---

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Legal Consulting LP Implementation & Assets | `samples/legal/index.html`, `samples/legal/css/legal.css`, `samples/legal/js/config.js`, `samples/legal/js/legal.js`, `samples/legal/assets/images/*` | none | COMPLETED |
| M2 | Top Portal Integration & Nav | `index.html` (portal card, quick links, filter badge) & bidirectional nav | M1 | COMPLETED |
| M3 | Automated Test Suite Extension | `tests/run_all_tests.py`, `tests/validate_links.py`, `tests/validate_pasona_dom.py`, `tests/test_interactive_ui.py`, `tests/test_server.py` | M1, M2 | COMPLETED |
| M4 | Git Commit & GitHub Pages Deploy | Git commit and push to `origin main` | M3 | COMPLETED |

---

## Interface Contracts

### `samples/legal/js/config.js` ↔ `samples/legal/js/legal.js`
```javascript
window.LEGAL_CONFIG = {
  firmName: "LUMEN LEGAL CONSULTING",
  firmJapaneseName: "ルーメン総合法律事務所",
  firmTagline: "企業法務・労務リスク解決特化 総合法律事務所",
  postalCode: "100-0005",
  address: "東京都千代田区丸の内1-8-3 丸の内トラストタワーN館 18F",
  access: "JR東京駅 日本橋口 徒歩1分 / 東京メトロ大手町駅 B7出口 徒歩2分",
  phone: "03-6890-1234",
  email: "contact@lumen-legal.example.com",
  gasWebhookUrl: "",
  businessHours: { weekday: "9:30 - 19:30", label: "平日 9:30 - 19:30（土日祝 定休）" },
  closedDays: [0, 6], // 0: Sun, 6: Sat
  closedDaysLabel: "土曜日・日曜日・祝日",
  timeSlots: ["10:00", "13:00", "15:30", "18:00"],
  daysToShow: 14,
  consultationModes: {
    online: { id: "online", label: "Zoomオンライン相談", badge: "全国対応・移動ゼロ" },
    in_person: { id: "in_person", label: "丸の内オフィス対面相談", badge: "完全個室・重要書類持参" }
  },
  lineOfficialUrl: "https://line.me/R/ti/p/@lumen_legal",
  fallbackSimulation: true,
  simulationSeedSalt: "lumen_legal_consulting_2026",
  planMaster: {
    free_trial: { id: "free_trial", name: "初回60分 無料法律相談", price: 0, priceLabel: "¥0（通常 ¥15,000）" },
    bamboo: { id: "bamboo", name: "【竹】スタンダード顧問プラン ★人気No.1", price: 50000, priceLabel: "¥50,000 / 月" },
    plum: { id: "plum", name: "【梅】ライト顧問プラン", price: 30000, priceLabel: "¥30,000 / 月" },
    pine: { id: "pine", name: "【松】プレミアム顧問プラン", price: 100000, priceLabel: "¥100,000 / 月" },
    spot_review: { id: "spot_review", name: "【スポット】契約書作成・チェック", price: 20000, priceLabel: "¥20,000〜 / 通" }
  }
};
```

---

## Code Layout & Write Boundaries
- **Milestone 1**: `samples/legal/index.html`, `samples/legal/css/legal.css`, `samples/legal/js/config.js`, `samples/legal/js/legal.js`, `samples/legal/assets/images/*`
- **Milestone 2**: `index.html` (Top portal integration)
- **Milestone 3**: `tests/run_all_tests.py`, `tests/validate_links.py`, `tests/validate_pasona_dom.py`, `tests/test_interactive_ui.py`, `tests/test_server.py`
- **Milestone 4**: Git repository sync
