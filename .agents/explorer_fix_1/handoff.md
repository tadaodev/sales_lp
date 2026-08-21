# Handoff Report — Explorer Fix Remediation Strategy (explorer_fix_1)

**Target Investigation**: Remediation Specification following Forensic Audit Integrity Violations  
**Author**: `explorer_fix_1`  
**Date**: 2026-08-22  
**Verdict**: **REMEDIATION SPECIFICATION COMPLETE**

---

## 1. Observation

Direct empirical inspection of audit evidence (`auditor_1/handoff.md`, `reviewer_1/handoff.md`, `reviewer_2/handoff.md`, `challenger_1/handoff.md`), codebase (`samples/washoku/`, `samples/bakery/`, `samples/legal/`, `samples/italian/`), and test harnesses (`tests/validate_links.py`, `tests/validate_pasona_dom.py`, `tests/run_all_tests.py`):

### A. Integrity Violation in Washoku Visual Image Assets
1. **Disk State**: All 4 image files under `samples/washoku/assets/images/` are 74–79 byte dummy plain text comment files:
   - `samples/washoku/assets/images/hero_banquet_nabe.jpg` (76 bytes): `/* High-Resolution AI-Generated Culinary Visual Asset: hero_banquet_nabe */`
   - `samples/washoku/assets/images/sashimi_platter.jpg` (74 bytes): `/* High-Resolution AI-Generated Culinary Visual Asset: sashimi_platter */`
   - `samples/washoku/assets/images/yakitori_charcoal.jpg` (76 bytes): `/* High-Resolution AI-Generated Culinary Visual Asset: yakitori_charcoal */`
   - `samples/washoku/assets/images/washoku_private_room.jpg` (79 bytes): `/* High-Resolution AI-Generated Culinary Visual Asset: washoku_private_room */`
2. **Test Failure**:
   - `tests/validate_links.py` (lines 287–294): Asserts `abs_img_path.stat().st_size >= 1000`. Returns `INVALID_IMAGE_ASSET` for all 4 files.
   - `tests/run_all_tests.py` (lines 801–808, `TC-WSH-IMG-01`): Returns `TC-WSH-IMG-01 FAIL` ("too small").
3. **Reference Benchmarks**:
   - `samples/bakery/assets/images/`: 4 SVG graphic files (1,360 to 2,257 bytes) saved with `.jpg` extensions containing full vector scenes and Japanese typography.
   - `samples/legal/assets/images/`: 4 rich SVG graphic files (up to 8,636 bytes) with gradients, filters, and executive law firm scenes.
   - `samples/italian/assets/images/`: Binary photographic JPEG assets.

### B. Heading Hierarchy Violations in `samples/washoku/index.html`
1. **Narrowing Section (`#narrowing`)**:
   - Line 474: `<h2 class="section-title">早期ご予約限定の特別特典 ＆ 金・土・祝前日の残席状況</h2>`
   - Lines 486, 494, 502 in `.benefits-card`:
     - Line 486: `<h4>特典①: 8名様以上のご予約で「幹事様1名無料」</h4>`
     - Line 494: `<h4>特典②: 20名様以上のご予約で「金箔入り特選日本酒（1升瓶）」進呈</h4>`
     - Line 502: `<h4>安心保証: ご宴会7日前までキャンセル料無料</h4>`
   - Line 509: `<h3 class="urgency-title">⚠️ 金曜・土曜・祝前日のゴールデンタイムは残りわずか</h3>`
   - **Flaw**: DOM hierarchy jumps directly from `<h2>` (Line 474) to `<h4>` (Line 486) without an intervening `<h3>`.
2. **Access Section (`#access`)**:
   - Line 669: `<h2 class="section-title">店舗情報・アクセス案内</h2>`
   - Line 722 in `.access-visual-body`: `<h4>下見・ロケハンも大歓迎です</h4>`
   - **Flaw**: DOM hierarchy jumps from `<h2>` (Line 669) to `<h4>` (Line 722) without an intervening `<h3>`.
3. **Test Detection**:
   - `tests/validate_pasona_dom.py` (lines 307–315) checks `curr_level > prev_level + 1` and flags `HEADING_HIERARCHY_SKIPPED`.

---

## 2. Logic Chain

1. **Root Cause Analysis**:
   - The initial worker generated placeholder text files instead of genuine graphic assets in `samples/washoku/assets/images/`, violating the strict prohibition against dummy facade files.
   - In `samples/washoku/index.html`, semantic heading tags were selected based on visual font size preference (`<h4>`) rather than hierarchical tree continuity, causing `HEADING_HIERARCHY_SKIPPED` failures under WCAG and the test validator.

2. **Remediation Requirement 1: Genuine Visual Image Assets**:
   - All 4 Washoku image files must be replaced with rich, high-resolution, valid graphic assets (size >= 1,000 bytes; ideally > 2.5KB vector SVG graphics or photographic JPEGs) adhering to the Washoku design system palette (Indigo Navy `#0B162C`, Charcoal `#121824`, Amber Gold `#E5A93C`, Vermilion `#C53D25`, Off-White `#F8F5EE`).
   - Specifically:
     - `hero_banquet_nabe.jpg`: Steaming wagyu motsunabe &寄せ鍋 banquet scene with toasting glasses and golden broth.
     - `sashimi_platter.jpg`: Toyosu market supreme 5-piece sashimi platter on crushed ice with shiso and wasabi.
     - `yakitori_charcoal.jpg`: Binchotan charcoal grill with glowing embers, smoke, and glistening tare-glazed yakitori skewers.
     - `washoku_private_room.jpg`: Sunken kotatsu private dining room with warm andon lantern illumination and tatami seating.

3. **Remediation Requirement 2: Heading Hierarchy Normalization**:
   - In `samples/washoku/index.html`:
     - Replace `<h4>` with `<h3>` at lines 486, 494, 502 (perk items in `#narrowing`).
     - Replace `<h4>` with `<h3>` at line 722 (preview note in `#access`).
   - In `samples/washoku/css/washoku.css`:
     - Update selector at line 1081 from `.benefit-content h4` to `.benefit-content h3, .benefit-content h4` so the typography, gold accent color, and spacing remain identical.

4. **Remediation Requirement 3: Automated Test Verification**:
   - Once the above fixes are applied, `validate_links.py`, `validate_pasona_dom.py`, `test_interactive_ui.py`, `test_server.py`, and `run_all_tests.py` will execute cleanly with 0 violations across all 179 test cases.

---

## 3. Caveats

- **Graphic Formats**: Both SVG vector files saved with `.jpg` extensions (as in `samples/bakery/` and `samples/legal/`) and true binary JPEG files pass `validate_links.py` and `run_all_tests.py` as long as `st_size >= 1000` bytes and valid graphic XML/binary headers are present. High-resolution SVG graphics (>2.5KB each) provide deterministic, crisp, scalable visual rendering without external binary asset drift.
- **CSS Selectors**: Changing `<h4>` to `<h3>` in `samples/washoku/index.html` requires extending the CSS rule in `samples/washoku/css/washoku.css` line 1081 to avoid any layout or font size regression.

---

## 4. Conclusion & Actionable Fix Specifications

### Fix Action 1: Replace Washoku Image Assets (`samples/washoku/assets/images/`)

The implementer must write genuine visual graphic content (> 2,500 bytes each) to the following 4 files:

#### 1. `samples/washoku/assets/images/hero_banquet_nabe.jpg` (~3,200 bytes)
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <radialGradient id="nabeGlow" cx="50%" cy="55%" r="65%">
      <stop offset="0%" stop-color="#FF9E40" stop-opacity="0.95"/>
      <stop offset="35%" stop-color="#C53D25" stop-opacity="0.75"/>
      <stop offset="70%" stop-color="#1A2744" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#070C18" stop-opacity="1"/>
    </radialGradient>
    <linearGradient id="potGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#4A4A4A"/>
      <stop offset="50%" stop-color="#242424"/>
      <stop offset="100%" stop-color="#111111"/>
    </linearGradient>
    <linearGradient id="soupGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFA834"/>
      <stop offset="50%" stop-color="#E57A1E"/>
      <stop offset="100%" stop-color="#A83210"/>
    </linearGradient>
    <linearGradient id="goldText" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFEBB0"/>
      <stop offset="50%" stop-color="#E5A93C"/>
      <stop offset="100%" stop-color="#9E6B15"/>
    </linearGradient>
    <filter id="steamBlur">
      <feGaussianBlur stdDeviation="18"/>
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="#070C18"/>
  <rect width="100%" height="100%" fill="url(#nabeGlow)"/>
  <!-- Lantern / Izakaya Ambient Bokeh -->
  <g opacity="0.4">
    <circle cx="250" cy="200" r="120" fill="#FFA500" filter="url(#steamBlur)"/>
    <circle cx="1650" cy="240" r="140" fill="#FF6B35" filter="url(#steamBlur)"/>
    <circle cx="960" cy="180" r="180" fill="#FFE082" opacity="0.3" filter="url(#steamBlur)"/>
  </g>
  <!-- Nabe Iron Pot Illustration -->
  <g transform="translate(960, 620)">
    <!-- Pot Outer Rim & Handles -->
    <ellipse cx="0" cy="0" rx="620" ry="240" fill="url(#potGrad)" stroke="#111" stroke-width="8"/>
    <path d="M-640,-20 C-680,-40 -670,-90 -620,-80 L-590,-40 Z" fill="#333"/>
    <path d="M640,-20 C680,-40 670,-90 620,-80 L590,-40 Z" fill="#333"/>
    <!-- Broth Inner -->
    <ellipse cx="0" cy="0" rx="560" ry="210" fill="url(#soupGrad)"/>
    <!-- Wagyu Motsu & Tofu Ingredients -->
    <ellipse cx="-180" cy="-30" rx="75" ry="45" fill="#FFF5EB" stroke="#E5C3A6" stroke-width="4"/>
    <ellipse cx="-240" cy="30" rx="65" ry="40" fill="#FFF5EB" stroke="#E5C3A6" stroke-width="4"/>
    <ellipse cx="-100" cy="40" rx="80" ry="50" fill="#FFF5EB" stroke="#E5C3A6" stroke-width="4"/>
    <!-- Fresh Green Chives (Nira) -->
    <rect x="-120" y="-80" width="240" height="22" rx="6" fill="#2E7D32" transform="rotate(-5)"/>
    <rect x="-110" y="-55" width="220" height="20" rx="5" fill="#388E3C" transform="rotate(3)"/>
    <rect x="-130" y="-30" width="260" height="22" rx="6" fill="#1B5E20" transform="rotate(-2)"/>
    <!-- Red Chili & Garlic Slices -->
    <circle cx="-30" cy="-65" r="8" fill="#D32F2F"/>
    <circle cx="20" cy="-40" r="7" fill="#D32F2F"/>
    <circle cx="50" cy="-70" r="8" fill="#D32F2F"/>
    <ellipse cx="160" cy="-20" rx="35" ry="20" fill="#FFF9C4" transform="rotate(15)"/>
    <ellipse cx="220" cy="30" rx="40" ry="25" fill="#FFF9C4" transform="rotate(-20)"/>
    <!-- Toasting Beer & Sake Glasses -->
    <g transform="translate(-480, -260) rotate(-18)" opacity="0.9">
      <rect x="-35" y="-70" width="70" height="130" rx="12" fill="#FFCA28" stroke="#FFE082" stroke-width="4"/>
      <rect x="-35" y="-95" width="70" height="30" rx="10" fill="#FFFFFF"/>
    </g>
    <g transform="translate(480, -260) rotate(18)" opacity="0.9">
      <rect x="-35" y="-70" width="70" height="130" rx="12" fill="#FFCA28" stroke="#FFE082" stroke-width="4"/>
      <rect x="-35" y="-95" width="70" height="30" rx="10" fill="#FFFFFF"/>
    </g>
    <!-- Steaming Hot Vapor Clouds -->
    <path d="M-180,-120 Q-120,-240 -60,-160 Q0,-280 80,-180 Q160,-260 220,-130" fill="none" stroke="#FFFFFF" stroke-width="28" opacity="0.45" stroke-linecap="round" filter="url(#steamBlur)"/>
  </g>
  <!-- Japanese Visual Typography -->
  <text x="960" y="930" text-anchor="middle" font-family="'Shippori Mincho', 'Noto Serif JP', serif" font-size="52" font-weight="bold" fill="url(#goldText)" letter-spacing="6">個室和食 旬彩 縁 -ENISHI-</text>
  <text x="960" y="990" text-anchor="middle" font-family="'Noto Sans JP', sans-serif" font-size="26" font-weight="600" fill="#F8F5EE" letter-spacing="4">特選和牛もつ鍋＆豊洲直送鮮魚 忘年会・歓送迎会ご予約受付中</text>
</svg>
```

#### 2. `samples/washoku/assets/images/sashimi_platter.jpg` (~3,100 bytes)
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <defs>
    <radialGradient id="iceGlow" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#E0F7FA"/>
      <stop offset="40%" stop-color="#80DEEA" stop-opacity="0.5"/>
      <stop offset="80%" stop-color="#0D1B2A"/>
      <stop offset="100%" stop-color="#050B14"/>
    </radialGradient>
    <linearGradient id="getaWood" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#5D4037"/>
      <stop offset="30%" stop-color="#8D6E63"/>
      <stop offset="70%" stop-color="#5D4037"/>
      <stop offset="100%" stop-color="#3E2723"/>
    </linearGradient>
    <linearGradient id="maguroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#B71C1C"/>
      <stop offset="60%" stop-color="#880E4F"/>
      <stop offset="100%" stop-color="#4A001F"/>
    </linearGradient>
    <linearGradient id="salmonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF7043"/>
      <stop offset="50%" stop-color="#F4511E"/>
      <stop offset="100%" stop-color="#D84315"/>
    </linearGradient>
    <linearGradient id="taiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF0F5"/>
      <stop offset="50%" stop-color="#F8BBD0"/>
      <stop offset="100%" stop-color="#E91E63"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="#050B14"/>
  <rect width="100%" height="100%" fill="url(#iceGlow)"/>
  <!-- Wooden Geta Serving Platter -->
  <g transform="translate(600, 440)">
    <polygon points="-460,160 460,160 400,-120 -400,-120" fill="url(#getaWood)" stroke="#271406" stroke-width="6"/>
    <!-- Crushed Ice Mound -->
    <ellipse cx="0" cy="10" rx="380" ry="110" fill="#E0F7FA" opacity="0.9"/>
    <!-- Shiso Leaves (Green Perilla) -->
    <path d="M-220,-60 Q-280,-140 -200,-150 Q-160,-90 -220,-60 Z" fill="#2E7D32"/>
    <path d="M0,-80 Q-40,-170 30,-170 Q60,-100 0,-80 Z" fill="#388E3C"/>
    <path d="M220,-60 Q160,-150 240,-150 Q280,-90 220,-60 Z" fill="#2E7D32"/>
    <!-- Sashimi Slices: Maguro (Tuna) -->
    <g transform="translate(-200, -20) rotate(-15)">
      <path d="M-60,-25 C-30,-45 40,-40 60,-15 C40,25 -30,25 -60,-25 Z" fill="url(#maguroGrad)"/>
      <line x1="-40" y1="-20" x2="40" y2="-10" stroke="#FFCDD2" stroke-width="2" opacity="0.6"/>
    </g>
    <!-- Sashimi Slices: Salmon -->
    <g transform="translate(-60, -40) rotate(-5)">
      <path d="M-65,-25 C-30,-45 45,-40 65,-15 C45,25 -30,25 -65,-25 Z" fill="url(#salmonGrad)"/>
      <line x1="-45" y1="-22" x2="45" y2="-12" stroke="#FFFFFF" stroke-width="3" opacity="0.7"/>
    </g>
    <!-- Sashimi Slices: Tai (Sea Bream) -->
    <g transform="translate(80, -35) rotate(12)">
      <path d="M-60,-25 C-30,-45 40,-40 60,-15 C40,25 -30,25 -60,-25 Z" fill="url(#taiGrad)"/>
      <line x1="-35" y1="-20" x2="35" y2="-10" stroke="#E91E63" stroke-width="2" opacity="0.7"/>
    </g>
    <!-- Botan Ebi (Sweet Prawn) -->
    <path d="M190,-30 Q270,-90 250,-10 Q210,30 190,-30 Z" fill="#FF8A65" stroke="#D84315" stroke-width="3"/>
    <!-- Wasabi Mound & Lemon -->
    <circle cx="-280" cy="50" r="28" fill="#7CB342" stroke="#558B2F" stroke-width="3"/>
    <circle cx="280" cy="40" r="32" fill="#FDD835" stroke="#FBC02D" stroke-width="4"/>
  </g>
  <!-- Typography -->
  <text x="600" y="690" text-anchor="middle" font-family="'Shippori Mincho', 'Noto Serif JP', serif" font-size="36" font-weight="bold" fill="#E5A93C" letter-spacing="4">豊洲市場直送 鮮魚極上5点盛り合わせ</text>
  <text x="600" y="740" text-anchor="middle" font-family="'Noto Sans JP', sans-serif" font-size="20" fill="#E0F7FA" letter-spacing="3">毎朝料理長が目利きする 本マグロ・旬の白身・極上生雲丹</text>
</svg>
```

#### 3. `samples/washoku/assets/images/yakitori_charcoal.jpg` (~3,000 bytes)
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <defs>
    <radialGradient id="fireGlow" cx="50%" cy="60%" r="55%">
      <stop offset="0%" stop-color="#FF5722" stop-opacity="0.95"/>
      <stop offset="35%" stop-color="#E65100" stop-opacity="0.7"/>
      <stop offset="70%" stop-color="#211006" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#080402"/>
    </radialGradient>
    <linearGradient id="charcoalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1A1A1A"/>
      <stop offset="30%" stop-color="#D84315"/>
      <stop offset="50%" stop-color="#FF8A65"/>
      <stop offset="70%" stop-color="#BF360C"/>
      <stop offset="100%" stop-color="#1A1A1A"/>
    </linearGradient>
    <linearGradient id="tareGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#8D4004"/>
      <stop offset="50%" stop-color="#4E2203"/>
      <stop offset="100%" stop-color="#260F01"/>
    </linearGradient>
    <filter id="glowSpark">
      <feGaussianBlur stdDeviation="8"/>
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="#080402"/>
  <rect width="100%" height="100%" fill="url(#fireGlow)"/>
  <!-- Binchotan Charcoal Grill & Embers -->
  <g transform="translate(600, 480)">
    <!-- Charcoal Logs -->
    <rect x="-420" y="40" width="840" height="60" rx="15" fill="url(#charcoalGrad)" stroke="#FF3D00" stroke-width="2"/>
    <rect x="-360" y="0" width="720" height="50" rx="12" fill="url(#charcoalGrad)" opacity="0.9"/>
    <!-- Iron Grill Mesh Lines -->
    <line x1="-460" y1="-20" x2="460" y2="-20" stroke="#757575" stroke-width="6"/>
    <line x1="-460" y1="20" x2="460" y2="20" stroke="#757575" stroke-width="6"/>
    <!-- Yakitori Skewer 1: Negima -->
    <g transform="translate(-240, -50) rotate(-8)">
      <line x1="0" y1="140" x2="0" y2="-140" stroke="#D7CCC8" stroke-width="6"/>
      <rect x="-35" y="-110" width="70" height="40" rx="12" fill="url(#tareGrad)"/>
      <rect x="-25" y="-60" width="50" height="35" rx="6" fill="#2E7D32" stroke="#1B5E20" stroke-width="2"/>
      <rect x="-35" y="-15" width="70" height="40" rx="12" fill="url(#tareGrad)"/>
      <rect x="-25" y="35" width="50" height="35" rx="6" fill="#2E7D32" stroke="#1B5E20" stroke-width="2"/>
      <rect x="-35" y="80" width="70" height="40" rx="12" fill="url(#tareGrad)"/>
      <!-- Glaze Shimmer -->
      <circle cx="-10" cy="-90" r="5" fill="#FFE082" opacity="0.8"/>
      <circle cx="-10" cy="5" r="5" fill="#FFE082" opacity="0.8"/>
    </g>
    <!-- Yakitori Skewer 2: Tsukune (Meatball) -->
    <g transform="translate(0, -60)">
      <line x1="0" y1="140" x2="0" y2="-140" stroke="#D7CCC8" stroke-width="6"/>
      <ellipse cx="0" cy="-90" rx="35" ry="28" fill="url(#tareGrad)"/>
      <ellipse cx="0" cy="-30" rx="35" ry="28" fill="url(#tareGrad)"/>
      <ellipse cx="0" cy="30" rx="35" ry="28" fill="url(#tareGrad)"/>
      <ellipse cx="0" cy="90" rx="35" ry="28" fill="url(#tareGrad)"/>
      <circle cx="-8" cy="-35" r="6" fill="#FFE082" opacity="0.8"/>
    </g>
    <!-- Yakitori Skewer 3: Kawa / Momo -->
    <g transform="translate(240, -50) rotate(8)">
      <line x1="0" y1="140" x2="0" y2="-140" stroke="#D7CCC8" stroke-width="6"/>
      <rect x="-35" y="-110" width="70" height="42" rx="12" fill="url(#tareGrad)"/>
      <rect x="-32" y="-55" width="64" height="42" rx="12" fill="url(#tareGrad)"/>
      <rect x="-35" y="0" width="70" height="42" rx="12" fill="url(#tareGrad)"/>
      <rect x="-32" y="55" width="64" height="42" rx="12" fill="url(#tareGrad)"/>
    </g>
    <!-- Floating Glowing Sparks -->
    <circle cx="-150" cy="-180" r="4" fill="#FFD54F" filter="url(#glowSpark)"/>
    <circle cx="-50" cy="-220" r="5" fill="#FFAB00" filter="url(#glowSpark)"/>
    <circle cx="120" cy="-190" r="4" fill="#FFD54F" filter="url(#glowSpark)"/>
    <circle cx="180" cy="-240" r="6" fill="#FF6D00" filter="url(#glowSpark)"/>
  </g>
  <!-- Typography -->
  <text x="600" y="700" text-anchor="middle" font-family="'Shippori Mincho', 'Noto Serif JP', serif" font-size="36" font-weight="bold" fill="#FFB74D" letter-spacing="4">職人手打ち 備長炭火焼き鳥</text>
  <text x="600" y="750" text-anchor="middle" font-family="'Noto Sans JP', sans-serif" font-size="20" fill="#FFE082" letter-spacing="3">土佐備長炭の強火で旨味を閉じ込めた 秘伝創業タレ仕込み</text>
</svg>
```

#### 4. `samples/washoku/assets/images/washoku_private_room.jpg` (~3,200 bytes)
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <defs>
    <radialGradient id="roomWarmth" cx="50%" cy="40%" r="65%">
      <stop offset="0%" stop-color="#FFD54F" stop-opacity="0.6"/>
      <stop offset="40%" stop-color="#C58525" stop-opacity="0.3"/>
      <stop offset="80%" stop-color="#141E30"/>
      <stop offset="100%" stop-color="#070B14"/>
    </radialGradient>
    <linearGradient id="tatamiGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#556B2F"/>
      <stop offset="50%" stop-color="#6B8E23"/>
      <stop offset="100%" stop-color="#3B4D1A"/>
    </linearGradient>
    <linearGradient id="woodTable" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2D1810"/>
      <stop offset="50%" stop-color="#1A0D08"/>
      <stop offset="100%" stop-color="#0F0804"/>
    </linearGradient>
    <linearGradient id="shojiLight" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFFDE7" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#FFF9C4" stop-opacity="0.4"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="#070B14"/>
  <rect width="100%" height="100%" fill="url(#roomWarmth)"/>
  <!-- Shoji Screen Backdrop -->
  <g opacity="0.35">
    <rect x="100" y="80" width="1000" height="340" fill="url(#shojiLight)" stroke="#3E2723" stroke-width="8"/>
    <line x1="350" y1="80" x2="350" y2="420" stroke="#3E2723" stroke-width="4"/>
    <line x1="600" y1="80" x2="600" y2="420" stroke="#3E2723" stroke-width="6"/>
    <line x1="850" y1="80" x2="850" y2="420" stroke="#3E2723" stroke-width="4"/>
    <line x1="100" y1="190" x2="1100" y2="190" stroke="#3E2723" stroke-width="3"/>
    <line x1="100" y1="300" x2="1100" y2="300" stroke="#3E2723" stroke-width="3"/>
  </g>
  <!-- Andon Lantern Glow -->
  <g transform="translate(200, 240)">
    <rect x="-40" y="-70" width="80" height="140" fill="#FFF8E1" stroke="#4E342E" stroke-width="6" rx="4"/>
    <line x1="-40" y1="0" x2="40" y2="0" stroke="#4E342E" stroke-width="3"/>
    <circle cx="0" cy="0" r="30" fill="#FFB300" opacity="0.6"/>
  </g>
  <g transform="translate(1000, 240)">
    <rect x="-40" y="-70" width="80" height="140" fill="#FFF8E1" stroke="#4E342E" stroke-width="6" rx="4"/>
    <line x1="-40" y1="0" x2="40" y2="0" stroke="#4E342E" stroke-width="3"/>
    <circle cx="0" cy="0" r="30" fill="#FFB300" opacity="0.6"/>
  </g>
  <!-- Sunken Kotatsu Floor & Table -->
  <polygon points="0,520 1200,520 1200,800 0,800" fill="url(#tatamiGrad)"/>
  <!-- Horigotatsu Recessed Well -->
  <polygon points="250,560 950,560 1020,740 180,740" fill="#0A0604"/>
  <!-- Solid Lacquered Wood Table -->
  <polygon points="280,510 920,510 990,660 210,660" fill="url(#woodTable)" stroke="#8D6E63" stroke-width="3"/>
  <!-- Tableware & Sake Tokkuri Sets -->
  <g transform="translate(600, 560)">
    <!-- Tokkuri (Sake Flask) -->
    <path d="M-80,-25 L-75,-5 C-70,10 -90,10 -85,-5 Z" fill="#ECEFF1"/>
    <circle cx="-50" cy="5" r="8" fill="#ECEFF1"/>
    <!-- Lacquer Tray -->
    <rect x="-30" y="-15" width="60" height="35" rx="4" fill="#C62828" stroke="#8E0000" stroke-width="2"/>
    <line x1="-20" y1="0" x2="20" y2="0" stroke="#D7CCC8" stroke-width="3"/>
  </g>
  <!-- Typography -->
  <text x="600" y="720" text-anchor="middle" font-family="'Shippori Mincho', 'Noto Serif JP', serif" font-size="34" font-weight="bold" fill="#E5A93C" letter-spacing="4">完全個室 掘りごたつ空間</text>
  <text x="600" y="765" text-anchor="middle" font-family="'Noto Sans JP', sans-serif" font-size="20" fill="#FFF8E1" letter-spacing="3">2名様〜最大40名様対応 扉付き完全プライベート空間</text>
</svg>
```

---

### Fix Action 2: Fix Heading Hierarchy in `samples/washoku/index.html`

In `samples/washoku/index.html`:

#### 1. Lines 486, 494, 502 (`#narrowing`)
Change `<h4>` tags to `<h3>`:
```html
<<<< TARGET LINES 482-506:
          <div class="benefits-card">
            <div class="benefit-item">
              <span class="benefit-icon">🎁</span>
              <div class="benefit-content">
                <h4>特典①: 8名様以上のご予約で「幹事様1名無料」</h4>
                <p>8名様以上でコースをご予約いただくと、幹事様1名様分のお食事・飲み放題代金を完全無料にいたします（または地酒30種プレミアム飲み放題へ無料アップグレード）。</p>
              </div>
            </div>

            <div class="benefit-item">
              <span class="benefit-icon">🍶</span>
              <div class="benefit-content">
                <h4>特典②: 20名様以上のご予約で「金箔入り特選日本酒（1升瓶）」進呈</h4>
                <p>大型個室・部署宴会をご予約いただいたグループ様全員に、乾杯用の金箔入り日本酒をプレゼント。</p>
              </div>
            </div>

            <div class="benefit-item">
              <span class="benefit-icon">🛡️</span>
              <div class="benefit-content">
                <h4>安心保証: ご宴会7日前までキャンセル料無料</h4>
                <p>急な日程調整や人数変更があっても安心。まずはWebまたはLINEからお席を仮押さえいただけます。</p>
              </div>
            </div>
          </div>
==== REPLACEMENT:
          <div class="benefits-card">
            <div class="benefit-item">
              <span class="benefit-icon">🎁</span>
              <div class="benefit-content">
                <h3>特典①: 8名様以上のご予約で「幹事様1名無料」</h3>
                <p>8名様以上でコースをご予約いただくと、幹事様1名様分のお食事・飲み放題代金を完全無料にいたします（または地酒30種プレミアム飲み放題へ無料アップグレード）。</p>
              </div>
            </div>

            <div class="benefit-item">
              <span class="benefit-icon">🍶</span>
              <div class="benefit-content">
                <h3>特典②: 20名様以上のご予約で「金箔入り特選日本酒（1升瓶）」進呈</h3>
                <p>大型個室・部署宴会をご予約いただいたグループ様全員に、乾杯用の金箔入り日本酒をプレゼント。</p>
              </div>
            </div>

            <div class="benefit-item">
              <span class="benefit-icon">🛡️</span>
              <div class="benefit-content">
                <h3>安心保証: ご宴会7日前までキャンセル料無料</h3>
                <p>急な日程調整や人数変更があっても安心。まずはWebまたはLINEからお席を仮押さえいただけます。</p>
              </div>
            </div>
          </div>
>>>>
```

#### 2. Line 722 (`#access`)
Change `<h4>` tag to `<h3>`:
```html
<<<< TARGET LINES 720-727:
            <img src="./assets/images/washoku_private_room.jpg" alt="縁 -ENISHI- の完全個室掘りごたつ空間" width="400" height="240">
            <div class="access-visual-body">
              <h4>下見・ロケハンも大歓迎です</h4>
              <p class="text-muted" style="font-size: 0.875rem;">
                営業時間前（15:00〜17:00）のお時間帯で、個室のレイアウトやマイク・プロジェクターの投影テストを実際にご確認いただけます。お気軽にお電話またはLINEでお問い合わせください。
              </p>
            </div>
==== REPLACEMENT:
            <img src="./assets/images/washoku_private_room.jpg" alt="縁 -ENISHI- の完全個室掘りごたつ空間" width="400" height="240">
            <div class="access-visual-body">
              <h3>下見・ロケハンも大歓迎です</h3>
              <p class="text-muted" style="font-size: 0.875rem;">
                営業時間前（15:00〜17:00）のお時間帯で、個室のレイアウトやマイク・プロジェクターの投影テストを実際にご確認いただけます。お気軽にお電話またはLINEでお問い合わせください。
              </p>
            </div>
>>>>
```

#### 3. Update CSS in `samples/washoku/css/washoku.css` (Line 1081)
```css
<<<< TARGET LINES 1081-1085:
.benefit-content h4 {
  font-size: 1.05rem;
  color: var(--color-accent-gold-light);
  margin-bottom: 0.35rem;
}
==== REPLACEMENT:
.benefit-content h3,
.benefit-content h4 {
  font-size: 1.05rem;
  color: var(--color-accent-gold-light);
  margin-bottom: 0.35rem;
}
>>>>
```

---

## 5. Verification Method

To independently verify the complete resolution after the worker applies the changes:

### Step 1: Verify Image File Sizes and Headers
```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8;
Get-Item samples/washoku/assets/images/*.jpg | Select-Object Name, Length
```
**Pass Criteria**: All 4 files (`hero_banquet_nabe.jpg`, `sashimi_platter.jpg`, `yakitori_charcoal.jpg`, `washoku_private_room.jpg`) report `Length >= 1000` (typically 3,000–3,300 bytes).

### Step 2: Run Link & Asset Validation
```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8;
$env:PYTHONUTF8=1;
python tests/validate_links.py
```
**Pass Criteria**:
- Scanned 6 HTML files and 6 CSS files.
- `[PASS] All relative links, assets, and anchor IDs are 100% valid! Zero 404s, zero root '/' links.`
- 0 violations, exit code 0.

### Step 3: Run DOM & PASONA Validation
```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8;
$env:PYTHONUTF8=1;
python tests/validate_pasona_dom.py
```
**Pass Criteria**:
- `[PASS] PASONA architecture, H1-H6 hierarchy, SEO, and A11y DOM validation passed 100%!`
- 0 `HEADING_HIERARCHY_SKIPPED` errors, exit code 0.

### Step 4: Run Master Integrated Test Suite
```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8;
$env:PYTHONUTF8=1;
python tests/run_all_tests.py
```
**Pass Criteria**:
- Tier 1 (85 tests), Tier 2 (65 tests), Tier 3 (19 tests), Tier 4 (10 tests).
- Total: 179/179 automated test cases **PASS (100%)**.
- `TC-WSH-IMG-01` PASS.
- Exit code 0.
