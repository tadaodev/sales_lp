# UI/UX アーキテクチャ & デザインシステム仕様書 (UI Architecture & Design Token Specification)

**プロジェクト名**: GitHub Pages対応 業種別LPサンプル集 ポータル & エステサロンLP  
**作成者**: `teamwork_preview_explorer` (Explorer - UI/UX Architecture & Tokens)  
**作成日**: 2026-08-20  
**対象範囲**: トップポータルハブ (`index.html`)、エステサロンLP (`samples/aesthetic/index.html`)、共通デザインシステム  

---

## 1. エグゼクティブサマリー & 設計思想

### 1.1 背景と目的
本プロジェクトは、GitHub Pages（ルート配下および `<username>.github.io/<repo>/` のサブディレクトリ配下）において完全な相対パスで動作する、**「業種別LPサンプル集のトップポータル」**と**「新PASONAの法則に基づくエステサロン向け高品質LP」**のUI/UXアーキテクチャを定義するものである。

### 1.2 コアデザイン哲学:「Subtle Luxury & High Conversion」
1. **和モダン・ラグジュアリー (Japanese Subtle Luxury)**:
   - シャンパンゴールド、ローズベージュ、ディープスレート、ウォームオフホワイトを基調とした上質なサロン空間を演出。
   - 繊細なグラデーションとすりガラス効果（Glassmorphism）、微細なゴールドヘアラインボーダーによる洗練された高級感。
2. **新PASONA心理誘導モデル (Direct-Response Conversion)**:
   - 読者の感情曲線（Problem → Affinity → Solution → Offer → Narrowing Down → Action）に完全に合致した視線誘導と情報階層。
3. **完全自律型・ゼロ障害設計 (Zero Runtime Breakage)**:
   - 外部JSライブラリや複雑なNodeビルドに一切依存せず、Vanilla HTML5 / CSS3 / Vanilla JavaScriptで実装。
   - すべてのアイコン・装飾をインラインSVGおよび純粋なCSSジオメトリで構築し、オフラインやCDNブロック環境でも100%崩れない耐障害性を保証。

---

## 2. デザインシステム & トークン仕様（3層トークン構造）

### 2.1 トークン設計方針
`design-system` スキルおよび `ui-ux-pro-max` の推奨に基づき、**Primitive（プリミティブ）→ Semantic（セマンティック）→ Component（コンポーネント）** の3層構造でCSS変数を設計する。

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Primitive Tokens (生の値: カラーコード、px、ウェイトなど)           │
├─────────────────────────────────────────────────────────────┤
│ 2. Semantic Tokens (役割・意味: 背景、テキスト、ボーダー、CTAなど)       │
├─────────────────────────────────────────────────────────────┤
│ 3. Component Tokens (UI部品専用: カード、モーダル、固定バーなど)        │
└─────────────────────────────────────────────────────────────┘
```

---

### 2.2 Layer 1: Primitive Tokens (プリミティブトークン)

```css
:root {
  /* ==========================================================
     1. Color Primitives (ラグジュアリー・サロンカラーパレット)
     ========================================================== */
  /* Champagne Gold (アクセント・高級感・信頼) */
  --primitive-gold-50:  #FAF6F0;
  --primitive-gold-100: #F3EBDD;
  --primitive-gold-200: #E6D4B8;
  --primitive-gold-300: #D8BD93;
  --primitive-gold-400: #C5A880; /* Main Accent */
  --primitive-gold-500: #B8976C;
  --primitive-gold-600: #9E7D52;
  --primitive-gold-700: #7E613B;
  --primitive-gold-800: #5C4528;
  --primitive-gold-900: #3D2D19;

  /* Rose Beige (温かみ・フェミニン・上質ベース) */
  --primitive-rose-50:  #FDFCFA;
  --primitive-rose-100: #F7F3EE; /* Main Surface */
  --primitive-rose-200: #EFE9DF;
  --primitive-rose-300: #E3D9CA;
  --primitive-rose-400: #D4C5B1;
  --primitive-rose-500: #C2AF97;

  /* Deep Slate / Charcoal (テキスト・高級コントラスト) */
  --primitive-slate-900: #121217;
  --primitive-slate-800: #1A1A24; /* Main Dark / Main Text */
  --primitive-slate-700: #262635;
  --primitive-slate-600: #3E3E50;
  --primitive-slate-500: #5E5E72;
  --primitive-slate-400: #88889C;
  --primitive-slate-300: #B5B5C4;
  --primitive-slate-200: #E2E2EA;
  --primitive-slate-100: #F0F0F5;

  /* Neutral Off-White */
  --primitive-white:     #FFFFFF;
  --primitive-offwhite:  #FAFAF9; /* Main Page BG */

  /* Functional Accents */
  --primitive-line-green: #06C755; /* LINE Brand Green */
  --primitive-line-hover: #05B34C;
  --primitive-success:    #10B981;
  --primitive-urgent-red: #E11D48;

  /* ==========================================================
     2. Typography Primitives (明朝＋サンセリフ ハイブリッド)
     ========================================================== */
  --font-serif: 'Shippori Mincho', 'Noto Serif JP', 'Yu Mincho', 'Hiragino Mincho ProN', serif;
  --font-sans: 'Inter', 'Noto Sans JP', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-display: 'Cinzel', 'Playfair Display', var(--font-serif);

  /* Fluid Font Sizes (clampによるモバイル〜PC滑らか拡縮) */
  --text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.8125rem);      /* 12px ~ 13px */
  --text-sm: clamp(0.8125rem, 0.775rem + 0.2vw, 0.875rem);     /* 13px ~ 14px */
  --text-base: clamp(0.9375rem, 0.8875rem + 0.25vw, 1rem);     /* 15px ~ 16px */
  --text-md: clamp(1.0625rem, 1rem + 0.35vw, 1.125rem);        /* 17px ~ 18px */
  --text-lg: clamp(1.1875rem, 1.1rem + 0.5vw, 1.3125rem);      /* 19px ~ 21px */
  --text-xl: clamp(1.375rem, 1.25rem + 0.7vw, 1.625rem);       /* 22px ~ 26px */
  --text-2xl: clamp(1.625rem, 1.45rem + 1vw, 2rem);           /* 26px ~ 32px */
  --text-3xl: clamp(2rem, 1.7rem + 1.6vw, 2.625rem);           /* 32px ~ 42px */
  --text-4xl: clamp(2.375rem, 2rem + 2.2vw, 3.25rem);          /* 38px ~ 52px */
  --text-hero: clamp(2.75rem, 2.2rem + 3vw, 4.25rem);          /* 44px ~ 68px */

  /* Line Heights */
  --leading-tight: 1.25;
  --leading-snug: 1.4;
  --leading-normal: 1.65;
  --leading-relaxed: 1.85;

  /* Letter Spacing */
  --tracking-tight: -0.015em;
  --tracking-normal: 0.02em;
  --tracking-wide: 0.06em;
  --tracking-luxury: 0.12em;
  --tracking-display: 0.2em;

  /* ==========================================================
     3. Elevation & Glassmorphism Primitives
     ========================================================== */
  --shadow-sm: 0 2px 8px -2px rgba(26, 26, 36, 0.05);
  --shadow-md: 0 8px 24px -4px rgba(26, 26, 36, 0.08);
  --shadow-lg: 0 16px 40px -8px rgba(26, 26, 36, 0.12);
  --shadow-gold: 0 12px 32px -6px rgba(197, 168, 128, 0.28);
  --shadow-gold-hover: 0 16px 40px -4px rgba(197, 168, 128, 0.42);

  --glass-blur-sm: blur(8px);
  --glass-blur-md: blur(16px);
  --glass-blur-lg: blur(24px);

  /* ==========================================================
     4. Spacing & Sizing Scale (8pt Grid System)
     ========================================================== */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
  --space-32: 128px;

  /* Fluid Section Spacing */
  --section-padding-y: clamp(3.5rem, 2.5rem + 5vw, 6.5rem);

  /* Border Radii */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-xl: 32px;
  --radius-full: 9999px;

  /* Transitions */
  --transition-fast: 150ms cubic-bezier(0.16, 1, 0.3, 1);
  --transition-normal: 250ms cubic-bezier(0.16, 1, 0.3, 1);
  --transition-slow: 450ms cubic-bezier(0.16, 1, 0.3, 1);
}
```

---

### 2.3 Layer 2: Semantic Tokens (セマンティックトークン)

```css
:root {
  /* Surfaces & Backgrounds */
  --color-bg-page: var(--primitive-offwhite);
  --color-bg-surface: var(--primitive-white);
  --color-bg-subtle: var(--primitive-rose-100);
  --color-bg-dark: var(--primitive-slate-800);
  --color-bg-darker: var(--primitive-slate-900);

  /* Glassmorphic Surfaces */
  --color-bg-glass-light: rgba(255, 255, 255, 0.72);
  --color-bg-glass-card: rgba(255, 255, 255, 0.85);
  --color-bg-glass-dark: rgba(26, 26, 36, 0.85);

  /* Typography / Text */
  --color-text-main: var(--primitive-slate-800);
  --color-text-muted: var(--primitive-slate-500);
  --color-text-subtle: var(--primitive-slate-400);
  --color-text-gold: var(--primitive-gold-600);
  --color-text-gold-light: var(--primitive-gold-400);
  --color-text-inverse: var(--primitive-white);
  --color-text-inverse-muted: var(--primitive-slate-200);

  /* Borders & Dividers */
  --color-border-subtle: rgba(26, 26, 36, 0.08);
  --color-border-light: rgba(255, 255, 255, 0.5);
  --color-border-gold: rgba(197, 168, 128, 0.35);
  --color-border-gold-solid: var(--primitive-gold-400);

  /* CTAs & Interactive */
  --color-cta-primary-bg: linear-gradient(135deg, var(--primitive-gold-400) 0%, var(--primitive-gold-600) 100%);
  --color-cta-primary-text: var(--primitive-white);
  --color-cta-primary-shadow: var(--shadow-gold);
  --color-cta-primary-hover-shadow: var(--shadow-gold-hover);

  --color-cta-line-bg: var(--primitive-line-green);
  --color-cta-line-hover: var(--primitive-line-hover);
  --color-cta-line-text: var(--primitive-white);

  --color-cta-dark-bg: var(--primitive-slate-800);
  --color-cta-dark-hover: var(--primitive-slate-900);
  --color-cta-dark-text: var(--primitive-white);

  /* Badges & Indicators */
  --badge-live-bg: rgba(16, 185, 129, 0.12);
  --badge-live-text: #059669;
  --badge-live-dot: #10B981;

  --badge-upcoming-bg: rgba(136, 136, 156, 0.12);
  --badge-upcoming-text: var(--primitive-slate-600);

  --badge-gold-bg: rgba(197, 168, 128, 0.14);
  --badge-gold-text: var(--primitive-gold-700);
  --badge-gold-border: rgba(197, 168, 128, 0.4);
}
```

---

### 2.4 Layer 3: Component Tokens (コンポーネントトークン)

```css
:root {
  /* Hero Component */
  --hero-min-height: 85vh;
  --hero-badge-radius: var(--radius-full);
  --hero-badge-padding: 8px 18px;
  --hero-title-font: var(--font-serif);
  --hero-title-tracking: var(--tracking-luxury);

  /* Bento / Genre Card */
  --card-radius: var(--radius-lg);
  --card-padding: clamp(20px, 16px + 1.2vw, 32px);
  --card-bg: var(--color-bg-glass-card);
  --card-border: 1px solid var(--color-border-subtle);
  --card-hover-border: 1px solid var(--color-border-gold-solid);
  --card-hover-transform: translateY(-6px);

  /* Sticky Bottom Bar (Mobile) */
  --sticky-bar-height: 68px;
  --sticky-bar-bg: rgba(255, 255, 255, 0.92);
  --sticky-bar-blur: var(--glass-blur-md);
  --sticky-bar-border: 1px solid rgba(197, 168, 128, 0.25);
  --sticky-bar-z-index: 900;

  /* Matsutake Pricing Cards */
  --pricing-card-bg: var(--primitive-white);
  --pricing-recommended-bg: linear-gradient(180deg, #FFFFFF 0%, var(--primitive-gold-50) 100%);
  --pricing-recommended-border: 2px solid var(--primitive-gold-400);
  --pricing-recommended-glow: var(--shadow-gold);

  /* Modal UX */
  --modal-overlay-bg: rgba(18, 18, 23, 0.65);
  --modal-overlay-blur: blur(8px);
  --modal-card-bg: var(--primitive-white);
  --modal-card-radius: var(--radius-xl);
  --modal-max-width: 580px;

  /* Accordion FAQ */
  --accordion-item-border: 1px solid rgba(26, 26, 36, 0.08);
  --accordion-header-py: 20px;
  --accordion-content-line-height: var(--leading-relaxed);
}
```

---

## 3. トップポータルハブ仕様 (`index.html`)

### 3.1 画面構造 & レイアウト構成
トップポータルは、今後様々な業種（SaaS、士業、飲食、不動産、教育など）のLPサンプルが拡張追加されることを前提とした**「LPデザインライブラリ・ハブ」**として設計する。

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Header & Navigation                                      │
│    - ブランドロゴ: "LP DESIGN HUB" / "業種別LPコレクション"   │
│    - ステータスバッジ: "GitHub Pages Ready"                   │
├─────────────────────────────────────────────────────────────┤
│ 2. Hero Section                                             │
│    - タイトル: "成約を生み出す、業種特化型モダンLPデザイン集"     │
│    - サブコピー: "新PASONAの法則 × 洗練されたモダンUI"       │
│    - メトリクス表示: "業種別特化 / 100%レスポンシブ / 実装検証済" │
├─────────────────────────────────────────────────────────────┤
│ 3. Category Filter Tabs (ジャンル切り替えタブ)               │
│    [すべて] [美容・サロン★] [SaaS・IT] [士業] [教育] [飲食] [不動産] │
├─────────────────────────────────────────────────────────────┤
│ 4. LP Showcase Grid (Bento & Card Layout)                   │
│    ┌───────────────────────────────────────────────────┐    │
│    │ ★ FEATURED (公開中): エステサロン向けラグジュアリーLP   │    │
│    │   [画像/UIプレビュー] [新PASONA対応] [実機デモを見る →] │    │
│    └───────────────────────────────────────────────────┘    │
│    ┌──────────────────┐ ┌──────────────────┐ ┌────────────────┐│
│    │ SaaS・IT (近日公開)│ │ 士業・法務 (近日公開)│ │ スクール(近日公開)││
│    └──────────────────┘ └──────────────────┘ └────────────────┘│
│    ┌──────────────────┐ ┌──────────────────┐                    │
│    │ 飲食・カフェ(近日) │ │ 不動産・住宅(近日)  │                    │
│    └──────────────────┘ └──────────────────┘                    │
├─────────────────────────────────────────────────────────────┤
│ 5. Features / Architecture Notes                            │
│    - "新PASONA法則の解説", "ゼロ依存CSS/SVG設計", "GitHub Pages" │
├─────────────────────────────────────────────────────────────┤
│ 6. Footer                                                   │
│    - コピーライト、相対パスリンク、仕様リンク                   │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 ジャンルフィルタリング仕様 (Vanilla JavaScript)
- **タブ項目**:
  1. `all`: すべて (All)
  2. `beauty`: 美容・エステサロン (Beauty & Salon) — **現在公開中**
  3. `saas`: SaaS・ITツール (SaaS & Tech) — 次回公開予定
  4. `pro`: 士業・コンサルティング (Legal & Consulting) — 企画中
  5. `edu`: スクール・教育 (Education & Academy) — 企画中
  6. `dining`: 飲食・グルメ (Dining & Cafe) — 企画中
  7. `realestate`: 不動産・建築 (Real Estate & Architecture) — 企画中
- **動作要件**:
  - タブクリック時に `data-category` に応じて対象カードのみを表示し、非対象カードは `opacity: 0; transform: scale(0.96); display: none;` で滑らかに遷移。
  - URLハッシュ (`#beauty`, `#saas`, `#all` など) と双方向同期。ハッシュ付きURLで直接アクセスされた場合も自動で該当タブがアクティブ化。
  - キーボード操作 (`Tab` / `Enter` / 矢印キー) および `aria-selected` に完全対応。

### 3.3 Featuredカード（エステサロン）仕様
- **リンクパス**: `./samples/aesthetic/index.html` (相対パス)
- **バッジ**: `公開中 (LIVE DEMO)` (エメラルドグリーン点滅ドット付き)、`新PASONA対応`、`Glassmorphism UI`
- **サムネイルUI**: 純粋なCSSグラデーションとSVGによるシャンパンゴールドのラグジュアリーサロンビジュアル。
- **メタデータ表示**: ターゲット層（30〜40代女性）、成約導線（松竹梅プラン＋LINE/WEB予約）、実装特徴（下部固定CTA・FAQアコーディオン）。

---

## 4. エステサロンLP仕様 (`samples/aesthetic/index.html`)

### 4.1 新PASONAの法則 セクション構成 & UIデザイン詳細

| ステップ | セクション名 | コピーライト・心理動線 | UI/UX デザイン表現 |
|---|---|---|---|
| **Header** | グローバルナビ | 戻りリンク ("← LPジャンル選択ハブ") + サロンロゴ + 電話/WEB予約ボタン | すりガラス固定ヘッダー（`backdrop-filter: blur`）、ゴールドヘアライン |
| **P: Problem** | ファーストビュー (Hero) | 「鏡を見るたび、自信が満ちていく。<br>大人の素肌に、極上の再生トリートメントを。」 | 明朝体（Shippori Mincho）の大見出し、シャンパンゴールドのアクセント、信頼実績バッジ（顧客満足度98.4%） |
| **P: Problem** | 悩み共感チェックリスト | 「こんなお悩み、諦めていませんか？」<br>・夕方になると毛穴や乾燥が目立つ<br>・高級化粧品でも効果を感じにくくなった<br>・エステに通っても一時的で戻ってしまう | 3枚のすりガラスカード、ゴールドのチェックボックスSVG、微細なホバーリフト効果 |
| **A: Affinity** | 共感・肌科学ストーリー | 「実は、肌表面だけのケアでは根本改善しません。<br>深層からのアプローチが必要です。」 | 柔らかなローズベージュ背景（#F7F3EE）、サロンオーナー・肌専門家のメッセージ、温かみのある寄り添いトーン |
| **S: Solution** | 3つの選ばれる理由 | **Reason 1**: オーダーメイド幹細胞深層導入<br>**Reason 2**: 完全個室のプライベート空間・専任制<br>**Reason 3**: 肌診断に基づく継続アフターケア | 3カラムのラグジュアリーカード、ゴールドアイコンSVG、番号バッジ（01, 02, 03） |
| **S: Solution** | Before / After 実績 | 年齢別・悩み別の実例変化（30代・40代・50代）<br>「3回の施術でハリと透明感が復活」 | Before/After比較カード、肌質・年代メタタグ、お客様のリアルな声引用 |
| **O: Offer** | 松竹梅 3段階料金プラン | **梅 (Light)**: スタンダード美肌 70分 ¥12,800<br>**竹 (Standard / 推奨)**: プレミアム深層再生 100分 <del>¥28,000</del> → **初回限定 ¥9,800 (65%OFF)**<br>**松 (Premium)**: エグゼクティブ極上 130分 ¥35,000 | 3段プライシングテーブル。中央の「竹」プランをゴールド枠線・人気No.1バッジ・拡大スケールでハイライト |
| **N: Narrowing Down** | 限定性・安心保証 | 「【今月限定】先着15名様のみ初回特別価格適用（残り4枠）」<br>「無理な勧誘は一切いたしません」「全額返金保証」 | ゴールドグラデーションの限定バナー、残り枠数カウント表示、安心の保証エンブレムSVG |
| **A: Action** | 予約CTA & フォーム | 「たった60秒で完了。極上の素肌体験を今すぐ予約」<br>Web即時予約フォーム ＋ LINE公式相談ボタン | 高コントラストのゴールドグラデーションボタン、LINE公式グリーンボタン、入力しやすい入力フォーム |
| **FAQ** | よくある質問 | 1. 施術に痛みはありますか？<br>2. メイクをしたまま行っても大丈夫ですか？<br>3. 敏感肌でも受けられますか？<br>4. キャンセル料は発生しますか？<br>5. 支払い方法は何が使えますか？ | インタラクティブ・アコーディオンUI（クリックで滑らかに開閉、ARIA属性対応） |
| **Access** | サロン案内・アクセス | 営業時間、所在地（銀座・表参道想定）、駅徒歩3分のアクセス、完全予約制の案内 | 上品なサロン情報カード、Google Maps互換レイアウト、お問い合わせ電話番号 |
| **Footer** | フッター | ポータルへの戻りリンク、プライバシーポリシー、著作権表記 | ダークスレート（#1A1A24）の引き締めフッター、ゴールドアクセントテキスト |

---

### 4.2 インタラクティブUIコンポーネント詳細仕様

#### 1. スマホ追従型 予約CTAバー (Sticky Mobile Bar)
- **表示条件**: 画面幅 `< 768px` の環境で、Heroセクションを通過（スクロール量 `> 350px`）した際に下部からスライドイン（`translateY(0)`）。
- **最下部抑制**: フッター付近の予約フォームセクションに入った際は自動的に非表示となり、入力の邪魔をしない。
- **構成**:
  - 左: LINE公式相談ボタン（グリーン、アイコン付き）
  - 右: WEB初回予約ボタン（ゴールドグラデーション、脈動パルスエフェクト付き）
- **CSS仕様**: `position: fixed; bottom: 0; left: 0; right: 0; height: 68px; padding-bottom: env(safe-area-inset-bottom); z-index: 900;`

#### 2. ポータル復帰ナビゲーション (Portal Return Nav)
- **設置場所**:
  - ヘッダー左上: `← LPジャンル選択ハブに戻る`
  - ページ最下部フッター: `← 業種別LPデザイン一覧へ戻る`
- **リンクパス**: `../../index.html` (確実な相対パス指定)
- **UX**: ホバー時に左矢印が左へ2pxスライドするマイクロインタラクション。

#### 3. FAQアコーディオン (Accessible Accordion)
- **実装方式**: Vanilla JavaScript + CSS `grid-template-rows: 0fr -> 1fr` または `max-height` アニメーション。
- **アクセシビリティ**:
  - ボタンに `aria-expanded="false"` / `aria-controls="faq-answer-N"` を付与。
  - 開閉状態に応じて右側のプラス・マイナスアイコンが180度回転。

#### 4. WEB予約モーダル & フォームUX (Booking Modal)
- **トリガー**: 「WEB予約」ボタンクリックでモーダルがフェードイン＋スケールイン（`scale(0.95) -> scale(1)`）。
- **UX配慮**:
  - 背景オーバーレイ（`rgba(18,18,23,0.65)`）ですりガラスブラー効果。
  - 背景クリックまたは `ESC` キーで即座にクローズ。
  - フォーカストラップ対応（モーダル外へのフォーカス流出防止）。
  - 入力項目は5つ以下（お名前、電話番号、希望コース、希望日時、ご要望）で離脱率を極小化。

---

## 5. 相対パスルーティング & GitHub Pages 配信規約

### 5.1 ディレクトリ構成 & 相対リンクマップ

```
[GitHub Repository Root / c:/Project/事業案/05_LP作成/]
│
├── index.html                     <-- トップポータル（LPジャンル選択ハブ）
│     └─ リンク: ./samples/aesthetic/index.html
│
└── samples/
      └── aesthetic/
            └── index.html         <-- エステサロン向けラグジュアリーLP
                  └─ 戻りリンク: ../../index.html
```

### 5.2 ルーティング整合性検証ルール
1. **絶対パス（`/index.html` や `/samples/...`）の禁止**:
   - GitHub Pagesのプロジェクトサイト（`https://username.github.io/repo-name/`）では、`/index.html` と書くと `https://username.github.io/index.html` に飛んでしまい404となる。
   - **必ず `./` または `../../` を使用する**。
2. **CDN・外部リソース遮断テスト**:
   - Google Fontsが仮に通信切断された場合でも、ローカルOSの標準明朝体（`'Yu Mincho', 'Hiragino Mincho ProN', serif`）および標準サンセリフ（`-apple-system, sans-serif`）にフォールバックし、レイアウト崩れが起きないよう `font-display: swap;` を指定する。
3. **SVGアセットのインライン化**:
   - 外部画像ファイルが欠損するリスクをゼロにするため、すべてのアイコン（チェックマーク、電話、LINE、星、矢印、クローズボタンなど）はインラインSVG（`xmlns="http://www.w3.org/2000/svg"`）で記述する。

---

## 6. アクセシビリティ (WCAG 2.1 AA) & パフォーマンス指針

### 6.1 コントラスト比の検証
- **通常テキスト（16px以下）**: ディープスレート `#1A1A24` on ウォームオフホワイト `#FAFAF9` → コントラスト比 **14.2:1**（WCAG AAA 7:1 を大幅クリア）。
- **ゴールドテキスト**: 読みやすさを確保するため、背景が明るい箇所では `--primitive-gold-700`（#7E613B, コントラスト比 **4.8:1**）を使用。
- **ゴールドCTAボタン**: 金色背景グラデーション（#C5A880〜#9E7D52）にホワイト `#FFFFFF` 太字テキスト（シャドウ付き）またはディープスレート `#121217` を採用し、視認性を最大化。

### 6.2 パフォーマンス最適化
- **Critical CSS**: すべてのCSSをインライン `<style>` または単一の高速CSSファイルとして配信。レンダーブロッキングを排除。
- **Cumulative Layout Shift (CLS) = 0**: フォント読み込み時のガタつきを防ぐ `size-adjust` / `font-display: swap`。
- **Touch Target**: すべてのボタン・タップ領域は `min-height: 48px`, `min-width: 48px` を確保。

---

## 7. 実装・検証チェックリスト（下流エージェント向け）

- [ ] **Top Portal (`index.html`)**:
  - [ ] タイトル・ヘッダー・ヒーローが正しくレンダリングされる
  - [ ] 7つのジャンルタブが切り替わり、該当カードがアニメーション表示される
  - [ ] URLハッシュ（`#beauty`等）による初期タブ指定が機能する
  - [ ] エステサロンカードから `./samples/aesthetic/index.html` へ正常に遷移できる
  - [ ] 将来ジャンル（SaaS, 士業, 教育等）のカードが整然とプレビュー表示される

- [ ] **Aesthetic Salon LP (`samples/aesthetic/index.html`)**:
  - [ ] 新PASONA全セクション（Problem / Affinity / Solution / Offer / Narrowing Down / Action / FAQ）が完備されている
  - [ ] トップポータルへの戻りリンク（`../../index.html`）が正常に動作する
  - [ ] 松竹梅の3段階プライシングで「竹（プレミアム）」が目立つ構成になっている
  - [ ] モバイルスクロール時に下部固定の予約バー（LINE・WEB）が滑らかに出現する
  - [ ] FAQアコーディオンがクリックで正常に開閉する
  - [ ] WEB予約モーダルが開き、フォーム入力と閉じる操作ができる
  - [ ] ブラウザのコンソールにJavaScriptエラーが一切出ない

---
*以上が UI/UX アーキテクチャおよびデザインシステムの完全仕様である。*
