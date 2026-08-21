# Handoff Report: Portal Hub & Automated Test Suite Architecture for 5 Flagship LPs

- **Author**: `explorer_portal_qa_1`
- **Working Directory**: `c:\Project\事業案\05_LP作成\.agents\explorer_portal_qa_1`
- **Target Milestones**: M1 (Bakery LP), M2 (Washoku LP), M3 (Portal Hub 5-Flagship Integration), M4 (150+ Automated Test Suite Expansion)
- **Status**: Completed (Read-Only Architectural Investigation)

---

## 1. Observation (直接観察事実とコード引用)

### 1.1 Portal Hub (`index.html`) の現状構造

#### A. ヒーローセクション・クイックリンク (`index.html:95-111`)
```html
<div class="hero-quick-demos">
  <a href="./samples/aesthetic/index.html" class="quick-demo-pill pill-aesthetic" id="hero-quick-aesthetic">
    <span class="pill-dot aesthetic"></span>
    <span>🌸 美容エステLP 実機デモ</span>
    <span class="pill-arrow">→</span>
  </a>
  <a href="./samples/italian/index.html" class="quick-demo-pill pill-italian" id="hero-quick-italian">
    <span class="pill-dot italian"></span>
    <span>🍕 本格イタリアンLP 実機デモ</span>
    <span class="pill-arrow">→</span>
  </a>
  <a href="./samples/legal/index.html" class="quick-demo-pill pill-legal" id="hero-quick-legal">
    <span class="pill-dot legal"></span>
    <span>⚖️ 士業・法務LP 実機デモ</span>
    <span class="pill-arrow">→</span>
  </a>
</div>
```
- 現在3件の実機デモリンクが存在（`#hero-quick-aesthetic`, `#hero-quick-italian`, `#hero-quick-legal`）。

#### B. 業種フィルタータブ (`index.html:123-156`)
```html
<div class="filter-tabs-container" role="tablist" aria-label="業種別LPフィルター">
  <button type="button" class="filter-tab-btn is-active" data-filter-tab="all" role="tab" aria-selected="true" aria-controls="showcase-grid" id="tab-all">
    <span>すべて</span>
    <span class="tab-count-badge">7</span>
  </button>
  <button type="button" class="filter-tab-btn" data-filter-tab="beauty" role="tab" aria-selected="false" aria-controls="showcase-grid" id="tab-beauty" tabindex="-1">
    <span>美容・サロン</span>
    <span class="tab-count-badge">1</span>
  </button>
  <button type="button" class="filter-tab-btn" data-filter-tab="saas" role="tab" aria-selected="false" aria-controls="showcase-grid" id="tab-saas" tabindex="-1">
    <span>SaaS・IT</span>
    <span class="tab-count-badge">1</span>
  </button>
  <button type="button" class="filter-tab-btn" data-filter-tab="pro" role="tab" aria-selected="false" aria-controls="showcase-grid" id="tab-pro" tabindex="-1">
    <span>士業・法務</span>
    <span class="tab-count-badge">1</span>
  </button>
  <button type="button" class="filter-tab-btn" data-filter-tab="edu" role="tab" aria-selected="false" aria-controls="showcase-grid" id="tab-edu" tabindex="-1">
    <span>スクール・教育</span>
    <span class="tab-count-badge">1</span>
  </button>
  <button type="button" class="filter-tab-btn" data-filter-tab="dining" role="tab" aria-selected="false" aria-controls="showcase-grid" id="tab-dining" tabindex="-1">
    <span>飲食・グルメ</span>
    <span class="tab-count-badge">1</span>
  </button>
  <button type="button" class="filter-tab-btn" data-filter-tab="realestate" role="tab" aria-selected="false" aria-controls="showcase-grid" id="tab-realestate" tabindex="-1">
    <span>不動産・住宅</span>
    <span class="tab-count-badge">1</span>
  </button>
  <button type="button" class="filter-tab-btn" data-filter-tab="ec" role="tab" aria-selected="false" aria-controls="showcase-grid" id="tab-ec" tabindex="-1">
    <span>EC・D2C</span>
    <span class="tab-count-badge">1</span>
  </button>
</div>
```
- 現在のカード総数は 7（Featured 3件: beauty 1, dining 1, pro 1 + Teaser 4件: saas 1, edu 1, realestate 1, ec 1）。
- `js/portal.js` は `data-filter-tab` とカードの `data-category` 属性に基づいて表示・非表示クラス `.is-hidden` をトグルしている。

#### C. 公開中（FEATURED）カード群 (`index.html:163-364`)
- Card 1: `id="card-aesthetic"`, `data-category="beauty"` (`samples/aesthetic/index.html`)
- Card 2: `id="card-italian"`, `data-category="dining"` (`samples/italian/index.html`)
- Card 3: `id="card-legal"`, `data-category="pro"` (`samples/legal/index.html`)

#### D. フッターナビゲーション (`index.html:566-571`)
```html
<nav class="footer-nav" aria-label="フッターナビゲーション">
  <a href="./index.html" class="footer-link">トップポータル</a>
  <a href="./samples/aesthetic/index.html" class="footer-link">エステサロンLP実機デモ</a>
  <a href="./samples/italian/index.html" class="footer-link">イタリアンレストランLP実機デモ</a>
  <a href="./samples/legal/index.html" class="footer-link">士業・法務LP実機デモ</a>
</nav>
```

---

### 1.2 ポータルCSS構造 (`css/portal.css`)
- クイックリンクボタンスタイル (`css/portal.css:284-332`): `.quick-demo-pill.pill-aesthetic`, `.quick-demo-pill.pill-italian`, `.quick-demo-pill.pill-legal`
- ピルドットスタイル: `.pill-dot.aesthetic` (`#10B981`), `.pill-dot.italian` (`#E26D45`), `.pill-dot.legal` (`#D4AF37`)
- フィーチャードカードスタイル (`css/portal.css:482-714`): 2カラムグリッド（左側: 実機モックアッププレビュー、右側: バッジ、タイトル、新PASONAハイライト3点、実機デモCTAボタン、ターゲット属性）。

---

### 1.3 既存テストインフラの構造 (`tests/`)

| ファイル | 行数 | 主な役割 |
|---|---|---|
| `tests/validate_links.py` | 372行 | ルート相対パス（`/`）排除（Rule-L1）、ローカル実在性（Rule-L2）、大文字小文字完全一致、アンカー検証（Rule-L3）、外部スキーム（Rule-L4）、`config.js` 読み込み順序ガード |
| `tests/validate_pasona_dom.py` | 387行 | 単一H1タグ、見出し連続性（H1→H2→H3）、`html lang="ja"`、viewport、title、description、img alt属性、新PASONA 7セクション（problem, affinity, solution, offer, narrowing, action, faq）、松竹梅プラン構造、Before/After、LINE+Web Dual CTA、FAQ件数（3件以上）、カレンダーDOM検証 |
| `tests/test_interactive_ui.py` | 855行 | `ConfigSchemaValidator`（エステ）、`ItalianConfigSchemaValidator`（イタリアン）、`LegalConfigSchemaValidator`（士業）、`GASBackendValidator`（`Code.gs`, `README.md`）、`CalendarEngineSimulator`、`LegalCalendarEngineSimulator`、`ThankYouViewValidator`（予約番号、Google Cal URL、RFC 5545 .ics、LINEディープリンク） |
| `tests/test_server.py` | 310行 | `LocalTestServer`（8080〜8099）、Rootモード（`GET /index.html` 等）、サブディレクトリモード（`GET /lp-portal-hub/...`）、404ハンドリング、CSS/MIMEタイプ検証 |
| `tests/run_all_tests.py` | 1042行 | 4-Tier Master Runner（Tier 1: 機能カバレッジ、Tier 2: 境界値・異常系、Tier 3: 複合結合、Tier 4: 実世界シナリオ）。現在115〜120テストケース |

---

## 2. Logic Chain (観察事実から導かれる設計論理と拡張計画)

### 2.1 トップポータル (`index.html`) の5大看板化統合設計

1. **業種タブカウントの更新**:
   - ベーカリー（`samples/bakery/`）および和食居酒屋（`samples/washoku/`）は共に `data-category="dining"`（飲食・グルメ）に属する。
   - `dining` のカード数: 1（イタリアン） + 1（ベーカリー） + 1（和食居酒屋） = **3件**。
   - `all` の総カード数: 5（Featured） + 4（Teasers: saas, edu, realestate, ec） = **9件**。
   - タグ属性:
     - `tab-all`: バッジ表示 `9`
     - `tab-dining`: バッジ表示 `3`
     - その他（`beauty: 1`, `pro: 1`, `saas: 1`, `edu: 1`, `realestate: 1`, `ec: 1`）は維持。

2. **ヒーロークイックリンクの拡張**:
   - `#hero-quick-bakery`: `🥖 ハード系ベーカリーLP 実機デモ` (クラス: `quick-demo-pill pill-bakery`, ドット: `pill-dot bakery`)
   - `#hero-quick-washoku`: `🍶 個室和食居酒屋LP 実機デモ` (クラス: `quick-demo-pill pill-washoku`, ドット: `pill-dot washoku`)
   - `css/portal.css` に `.quick-demo-pill.pill-bakery` (琥珀ゴールド・小麦色ボーダー `rgba(217, 119, 6, 0.45)`), `.quick-demo-pill.pill-washoku` (藍色・提灯ゴールド `rgba(30, 58, 138, 0.45)`), `.pill-dot.bakery` (`#D97706`), `.pill-dot.washoku` (`#2563EB` または `#D4AF37`) を追加。

3. **Featured カードの配置順と仕様**:
   - Card 1: エステサロン (`id="card-aesthetic"`, `data-category="beauty"`)
   - Card 2: 本格イタリアン (`id="card-italian"`, `data-category="dining"`)
   - Card 3: 士業・法務 (`id="card-legal"`, `data-category="pro"`)
   - Card 4: ハード系ベーカリー (`id="card-bakery"`, `data-category="dining"`)
     - ビジュアル: `url(./samples/bakery/assets/images/hero_baguette.jpg)`
     - バッジ: `五感刺激・アルチザン体験型モデル`, `14日焼きたて取り置き ◯・△・✕`, `自家製ルヴァン酵母`
     - タイトル: `本場フランス伝統製法 ハード系特化ベーカリー LP`
     - CTAボタン: `id="link-bakery-demo"`, `href="./samples/bakery/index.html"`
     - ターゲット: `ターゲット: 20〜50代 本物志向のパン愛好家・手土産・モーニング層`
   - Card 5: 個室和食居酒屋 (`id="card-washoku"`, `data-category="dining"`)
     - ビジュアル: `url(./samples/washoku/assets/images/hero_banquet_nabe.jpg)`
     - バッジ: `幹事悩み解決・忘年会特化モデル`, `14日宴会席予約 ◯・△・✕`, `最大40名完全個室`
     - タイトル: `忘年会・個室宴会特化 旬彩和食居酒屋 LP`
     - CTAボタン: `id="link-washoku-demo"`, `href="./samples/washoku/index.html"`
     - ターゲット: `ターゲット: 20〜50代 忘年会・歓送迎会幹事・会社宴会・個室会食層`

4. **フッターリンクの更新**:
   - `./samples/bakery/index.html` (ベーカリーLP実機デモ)
   - `./samples/washoku/index.html` (和食居酒屋LP実機デモ) を追加。

5. **双方向ナビゲーションの厳格保証**:
   - ポータルから各サンプルへのリンクは `./samples/<name>/index.html`
   - 各サンプルからポータルへの復帰リンクは `../../index.html`
   - ルート相対パス（`/`）は Rule-L1 により 100% 排除。

---

### 2.2 テストスイート拡張アーキテクチャ (150+ テストケース体系)

```
tests/
├── validate_links.py         # [更新] Bakery/Washoku スクリプト順序 & 相対パス検証
├── validate_pasona_dom.py    # [更新] Bakery/Washoku DOM, 新PASONA 7セクション, 松竹梅, 画像alt検証
├── test_interactive_ui.py    # [更新] Bakery/Washoku ConfigSchema, CalendarSim, .ics, LINE検証
├── test_server.py            # [更新] Bakery/Washoku Root/Subdir HTTP 200, CSS MIME検証
└── run_all_tests.py          # [更新] 4-Tier Master Runner (全 165+ テストケース統合)
```

#### A. `tests/validate_links.py` 拡張内容
- `samples/bakery/index.html` における `config.js` が `bakery.js` より前に読み込まれていることの検証。
- `samples/washoku/index.html` における `config.js` が `washoku.js` より前に読み込まれていることの検証。
- `samples/bakery/assets/images/*` および `samples/washoku/assets/images/*` の大文字小文字・パス実在性検証。

#### B. `tests/validate_pasona_dom.py` 拡張内容
- `samples/bakery/index.html` の検証:
  - `BAKERY_LP_MISSING` ガード
  - 単一H1、見出し階層、メタタグ、OGP、4画像alt属性
  - 新PASONA 7セクション（problem, affinity, solution, offer, narrowing, action, faq）
  - 松竹梅アソートBOX（梅：モーニングハードセット / 竹：人気定番7種 / 松：プレミアム薪窯バゲット＆贅沢オードブル）
  - 焼き上がり時刻表（タイムテーブル）コンポーネント
  - 14日間取り置きカレンダーコンテナ
  - LINE + Web Dual CTA、FAQ（3件以上）
- `samples/washoku/index.html` の検証:
  - `WASHOKU_LP_MISSING` ガード
  - 単一H1、見出し階層、メタタグ、OGP、4画像alt属性
  - 新PASONA 7セクション（problem, affinity, solution, offer, narrowing, action, faq）
  - 忘年会松竹梅コース（梅：¥3,980 / 竹：¥4,980 / 松：¥6,500）
  - 幹事3大安心保証（駅チカ2分、完全個室最大40名、飲み放題付明朗会計）
  - 14日間宴会席予約カレンダーコンテナ
  - LINE + Web Dual CTA、FAQ（3件以上）

#### C. `tests/test_interactive_ui.py` 拡張内容
1. **`BakeryConfigSchemaValidator` クラス**:
   - `samples/bakery/js/config.js` の `window.BAKERY_CONFIG` 解析。
   - 必須フィールド: `bakeryName`, `bakeryPhone`, `bakeryAddress`, `daysToShow: 14`, `closedDays: [1, 2]` (月・火定休など), `timeSlots: ["09:00", "11:30", "14:00", "16:30"]`, `boxMaster` / `assortments`, `fallbackSimulation: true`, `lineOfficialUrl`, `gasWebhookUrl`。
2. **`WashokuConfigSchemaValidator` クラス**:
   - `samples/washoku/js/config.js` の `window.WASHOKU_CONFIG` 解析。
   - 必須フィールド: `restaurantName`, `restaurantPhone`, `restaurantAddress`, `daysToShow: 14`, `closedDays: [0]` (日限定休など), `timeSlots: ["17:00", "18:00", "19:00", "20:00", "21:00"]`, `courseMaster` / `courses`, `maxPartySize: 40`, `fallbackSimulation: true`, `lineOfficialUrl`, `gasWebhookUrl`。
3. **`BakeryCalendarSimulator` / `WashokuCalendarSimulator` クラス**:
   - 14日分の日付レンジ生成。
   - 定休日スロットの自動「休」判定。
   - 決定論的擬似乱数による ◯・△・✕ の再現性計算。
4. **`ThankYouViewValidator` の拡張**:
   - 予約番号フォーマット正規表現: `^(?:LUM|TAV|LEG|BAK|WSH)-\d{8}-[A-Z0-9]{4}$`
   - ベーカリー用 Google Calendar URL & RFC 5545 .ics 生成（受取所要時間30分、VALARM 2時間前リマインダー）
   - 和食居酒屋用 Google Calendar URL & RFC 5545 .ics 生成（宴会2時間枠120分、VALARM 2時間前リマインダー）
   - ベーカリー用 LINE起動URL生成（アソートBOX名・受取日時埋め込み）
   - 和食居酒屋用 LINE起動URL生成（宴会コース名・人数・日時埋め込み）

#### D. `tests/test_server.py` 拡張内容
- Root モード:
  - `SRV-ROOT-04`: `GET /samples/italian/index.html` (200 OK)
  - `SRV-ROOT-05`: `GET /samples/bakery/index.html` (200 OK)
  - `SRV-ROOT-06`: `GET /samples/washoku/index.html` (200 OK)
- Subdirectory モード:
  - `SRV-SUBDIR-04`: `GET /lp-portal-hub/samples/italian/index.html` (200 OK)
  - `SRV-SUBDIR-05`: `GET /lp-portal-hub/samples/bakery/index.html` (200 OK)
  - `SRV-SUBDIR-06`: `GET /lp-portal-hub/samples/washoku/index.html` (200 OK)
- MIME タイプ:
  - `SRV-MIME-03`: `samples/bakery/css/bakery.css` -> `text/css`
  - `SRV-MIME-04`: `samples/washoku/css/washoku.css` -> `text/css`

#### E. `tests/run_all_tests.py` 4-Tier Master Suite 構成 (合計 168+ テストケース)

| Tier | カテゴリ | 内訳 | テスト数 |
|---|---|---|:---:|
| **Tier 1** | 基本機能カバレッジ | エステサロン (F1..F10 x 5 = 50)<br>イタリアン (TC-ITL-CFG..NAV = 5)<br>士業・法務 (TC-LEG-CAL..NAV = 10)<br>ベーカリー (TC-BAK-CAL..NAV = 10)<br>和食居酒屋 (TC-WSH-CAL..NAV = 10) | **85** |
| **Tier 2** | 境界値・エッジケース | エステ境界値 (F1..F10 x 5 = 50)<br>士業境界値 (TC-LEG-B01..B05 = 5)<br>ベーカリー境界値 (TC-BAK-B01..B05 = 5)<br>和食居酒屋境界値 (TC-WSH-B01..B05 = 5) | **65** |
| **Tier 3** | 複合機能結合・画面遷移 | 既存結合フロー (TC-INT-01..10 = 10)<br>士業結合フロー (TC-INT-11..13 = 3)<br>イタリアン結合 (TC-INT-14 = 1)<br>ベーカリー結合 (TC-INT-15..16 = 2)<br>和食居酒屋結合 (TC-INT-17..18 = 2)<br>ポータル5看板循環 (TC-INT-19 = 1) | **19** |
| **Tier 4** | 実世界シナリオ | 既存シナリオ 1..7 (7)<br>【シナリオ8】ベーカリー朝活愛好家（松アソートBOX予約＆.ics＆LINE）(1)<br>【シナリオ9】忘年会幹事（20名個室竹もつ鍋コース予約＆LINE確認）(1)<br>【シナリオ10】ポータル5大看板探索＆レスポンシブフィルタリング (1) | **10** |
| **合計** | **全 4-Tier Master Suite** | **全件 100% PASS 保証体系** | **179** |

---

## 3. Caveats (調査の前提と注意事項)

1. **Read-Only 制約**: 本調査報告書はエクスプローラーとして現状のコードベースおよび仕様要件を分析したものであり、実際の `index.html`、`samples/bakery/`、`samples/washoku/`、`tests/` へのファイル修正は各実装担当エージェント（M1, M2, M3, M4）が行う。
2. **テスト実行環境**: Windows環境におけるコンソール文字化け防止のため、テスト実行時は必ず `[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; $env:PYTHONUTF8=1;` を指定すること。
3. **外部依存ゼロの維持**: 全てのPythonテストスクリプトは標準ライブラリ（`html.parser`, `re`, `json`, `datetime`, `urllib.request`, `http.server` 等）のみで完結させること（サードパーティ製ライブラリのインストール不要）。

---

## 4. Conclusion (最終評価と総合結論)

1. **ポータルの拡張容易性**: `index.html` および `css/portal.css` は Glassmorphism および Bento Grid 設計により極めて拡張性が高く、`card-bakery` および `card-washoku` を追加することで自然な5大看板LPハブが完成する。
2. **テスト基盤の堅牢性**: 既存の4-Tier Pythonテストスイートはモジュール化されており、`BakeryConfigSchemaValidator` や `WashokuConfigSchemaValidator`、および対応するテストケース（合計165+件）をシームレスに追加拡張可能である。
3. **品質基準（100% PASS）の達成性**: 各LPで共通の契約（`config.js` の一元設定、14日カレンダー、松竹梅料金、サンクス画面、.ics生成、LINE連携、フォールバック計算、厳格相対パス）を遵守することで、GitHub Pages 上で 404 エラーおよび例外クラッシュがゼロであることが完全に自動検証される。

---

## 5. Verification Method & Actionable Checklist (検証手順と作業者向けチェックリスト)

### 5.1 作業者向けアクションチェックリスト (M1, M2, M3, M4)

#### ■ M1: ハード系ベーカリーLP実装 (`samples/bakery/`)
- [ ] `samples/bakery/assets/images/` に Gemini AI 生成画像 4 点を配置
  - `hero_baguette.jpg` (薪窯バゲット)
  - `baker_craftsman.jpg` (パン職人)
  - `campagne_slice.jpg` (カンパーニュ断面)
  - `bakery_display.jpg` (欧風店内ディスプレイ)
- [ ] `samples/bakery/js/config.js` を作成し `window.BAKERY_CONFIG` を定義（定休日・時間枠・松竹梅アソートBOX・フォールバック）
- [ ] `samples/bakery/index.html` を作成（新PASONA全7セクション、焼き上がり時刻表、松竹梅BOX、14日カレンダー、Dual CTA、FAQ）
- [ ] `samples/bakery/css/bakery.css` を作成（クラフト紙・小麦ゴールド・ナチュラルウッドの温もりあるGlassmorphism UI）
- [ ] `samples/bakery/js/bakery.js` を作成（取り置きカレンダー、フォーム連動、サンクス画面、.ics生成、LINE連携）

#### ■ M2: 個室和食居酒屋LP実装 (`samples/washoku/`)
- [ ] `samples/washoku/assets/images/` に Gemini AI 生成画像 4 点を配置
  - `hero_banquet_nabe.jpg` (忘年会もつ鍋・乾杯)
  - `sashimi_platter.jpg` (豊洲直送刺身盛り)
  - `yakitori_charcoal.jpg` (炭火焼き鳥)
  - `washoku_private_room.jpg` (掘りごたつ個室)
- [ ] `samples/washoku/js/config.js` を作成し `window.WASHOKU_CONFIG` を定義（定休日・時間枠・松竹梅宴会コース・フォールバック）
- [ ] `samples/washoku/index.html` を作成（新PASONA全7セクション、幹事3大安心保証、松竹梅コース、14日カレンダー、Dual CTA、FAQ）
- [ ] `samples/washoku/css/washoku.css` を作成（藍色インディゴ×提灯ゴールド×和紙木目の和モダンUI）
- [ ] `samples/washoku/js/washoku.js` を作成（宴会カレンダー、フォーム連動、サンクス画面、.ics生成、LINE連携）

#### ■ M3: トップポータル統合 (`index.html`, `css/portal.css`)
- [ ] `index.html` のヒーロー直下に `#hero-quick-bakery` および `#hero-quick-washoku` クイックボタンを追加
- [ ] `index.html` のフィルタータブバッジ数値を更新（`tab-all: 9`, `tab-dining: 3`）
- [ ] `index.html` の Bento Grid に `card-bakery` および `card-washoku` を追加（LIVE DEMOバッジ、新PASONAタグ、実写モック）
- [ ] `index.html` のフッターナビにベーカリーおよび和食居酒屋のリンクを追加
- [ ] `css/portal.css` にベーカリー・和食用のピルボタンスタイルおよびホバー演出を追加

#### ■ M4: 自動テストスイート拡張 (`tests/`)
- [ ] `tests/validate_links.py`: ベーカリー・和食の `config.js` 読み込み順序とアセット存在確認を追加
- [ ] `tests/validate_pasona_dom.py`: `samples/bakery/index.html` および `samples/washoku/index.html` の New PASONA / SEO / A11y DOM検証を追加
- [ ] `tests/test_interactive_ui.py`: `BakeryConfigSchemaValidator`, `WashokuConfigSchemaValidator`, カレンダーシミュレータ、.ics/LINE検証を追加
- [ ] `tests/test_server.py`: ベーカリー・和食の Root/Subdir HTTP 200 OK および CSS MIME タイプ検証を追加
- [ ] `tests/run_all_tests.py`: Tier 1 (85件), Tier 2 (65件), Tier 3 (19件), Tier 4 (10件) の全 179 テストケースを統合実装し、100% PASS を達成

---

### 5.2 独立検証コマンド

```powershell
# PowerShell UTF-8 環境設定
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8;
$env:PYTHONUTF8=1;

# 1. リンク・アセット・読み込み順序検証
python tests/validate_links.py

# 2. PASONA DOM・見出し・SEO・アクセシビリティ検証
python tests/validate_pasona_dom.py

# 3. インタラクティブUI・カレンダー・GAS・フォールバック検証
python tests/test_interactive_ui.py

# 4. 静的HTTPサーバー・サブディレクトリ配信検証
python tests/test_server.py

# 5. 全 4-Tier 統合テストマスターランナー (150+ テストケース 100% 合格検証)
python tests/run_all_tests.py
```
