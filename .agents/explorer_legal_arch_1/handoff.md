# 士業・法務コンサルティング特化LP（LUMEN LEGAL CONSULTING）アーキテクチャ・設計仕様書

- **作成Agent**: explorer_legal_arch_1 (Codebase Architecture Explorer)
- **対象ディレクトリ**: `samples/legal/`
- **成果物パス**: `c:\Project\事業案\05_LP作成\.agents\explorer_legal_arch_1\handoff.md`
- **作成日時**: 2026-08-21T17:30:00+09:00

---

## 1. Observation（現状調査とコードベース分析）

既存の2つのサンプルLP（`samples/aesthetic/`、`samples/italian/`）およびトップポータル（`index.html`）、自動テストスイート（`tests/`）を詳細に調査・分析した結果は以下の通りです。

### 1.1 ディレクトリ構成とファイル配置の共通パターン
```
c:/Project/事業案/05_LP作成/
├── index.html                       # トップポータル（ジャンル一覧、タブ切替、LIVEデモカード）
├── css/
│   ├── reset.css                    # CSSリセット
│   ├── tokens.css                   # 3層デザインシステム（Primitive, Semantic, Component）
│   └── portal.css                   # ポータル専用スタイル
├── js/
│   └── portal.js                    # タブフィルタリング＆ハッシュディープリンク（Vanilla JS）
├── samples/
│   ├── aesthetic/                   # 第1弾：美容エステサロンLP（ラグジュアリー・フェミニン）
│   │   ├── assets/images/           # 実写画像アセット
│   │   ├── css/aesthetic.css        # 専用CSS（Glassmorphism、ゴールド×ローズ）
│   │   ├── js/config.js             # サロン設定・GAS URL・プラン・予約枠一元管理
│   │   ├── js/aesthetic.js          # 14日カレンダー、予約モーダル、.ics生成、LINE連携
│   │   └── index.html               # 新PASONA準拠 7セクション
│   ├── italian/                     # 第2弾：本格イタリアンLP（シズル感・暖色系）
│   │   ├── assets/images/           # 料理・店内実写画像4点
│   │   ├── css/italian.css          # 専用CSS（テラコッタ×ワインレッド、Chic Dark）
│   │   ├── js/config.js             # 店舗設定・ランチ/ディナー2部制・席数・コース管理
│   │   ├── js/italian.js            # 2部制席予約カレンダー、席のみ/コース予約、.ics生成
│   │   └── index.html               # 新PASONA準拠 7セクション＋五感刺激ギャラリー
│   └── legal/                       # ★【新規作成対象】第3弾：士業・法務コンサルティング特化LP
└── tests/
    ├── validate_links.py            # 相対パス整合性、404ゼロ、スクリプト読み込み順検証
    ├── validate_pasona_dom.py       # 新PASONA 7セクション、H1-H6階層、SEO、松竹梅、アクセシビリティ検証
    ├── test_interactive_ui.py       # カレンダーエンジン、予約シミュレータ、.ics構文、LINE URL検証
    ├── test_server.py               # GitHub Pages サブディレクトリ配信ローカル検証
    └── run_all_tests.py             # 4層統合マスターテストランナー（115+ テストケース）
```

### 1.2 既存LPにおける設計仕様と実装パターンの比較

| 項目 | 美容エステLP (`aesthetic`) | カジュアルイタリアンLP (`italian`) | 士業・法務LP (`legal`) 設計方針 |
| :--- | :--- | :--- | :--- |
| **業種・テーマ** | ラグジュアリー美肌再生サロン | 薪窯ピッツァ＆手打ちパスタ | 企業法務・労務・契約書トラブル特化総合法務事務所 |
| **屋号・ブランド名** | SALON DE ÉTOILE / LUMIÈRE | TRATTORIA & PIZZERIA BELLA TAVOLA | **LUMEN LEGAL CONSULTING**<br>（ルーメン総合法務・労務コンサルティング事務所） |
| **ブランドカラー** | シャンパンゴールド / ローズベージュ / スレート | テラコッタ / ワインレッド / オリーブ / 木目 | **ディープネイビー (`#0B192C` / `#1E3E62`)**<br>**シャンパンゴールド (`#D4AF37` / `#F1D06E`)**<br>信頼のスレートグレー＆純白 |
| **UIスタイル** | Japanese Subtle Luxury Glassmorphism | Sizzling Chic Dark Modern UI | **Corporate Trust & Modern Glassmorphism**（重厚感・透明性・信頼性） |
| **PASONA軸** | 欲望充足＆エイジング悩み解消 | 食欲刺激＆シズル体験・記念日 | **リスク回避・危機回避・事業成長支援型** |
| **予約・相談形式** | 1日4枠 サロン来店施術 | ランチ5枠 / ディナー6枠 席予約 | **直近14日間 4枠/日 × 2WAY相談（Zoomオンライン / 丸の内対面）** |
| **時間枠定義** | 10:00 / 13:00 / 16:00 / 18:30 | 11:30..13:30 / 17:30..20:00 | **10:00 / 13:00 / 15:30 / 18:00**（各60分） |
| **松竹梅プラン** | 竹: エクソソーム / 梅: ショート / 松: VIP | 竹: Classico / 梅: Stagione / 松: Speciale | **竹: 月額顧問ライト（★人気No.1）**<br>**梅: スポット契約書レビュー・労務相談**<br>**松: 総合企業法務パートナー（専任チーム）** |
| **予約ID体系** | `LUM-YYYYMMDD-XXXX` | `TAV-YYYYMMDD-XXXX` | **`LEG-YYYYMMDD-XXXX`** |
| **外部連携** | Googleカレンダー / Apple .ics / LINE公式 | Googleカレンダー / Apple .ics / LINE公式 | **Googleカレンダー / Apple .ics / LINE公式（初回相談申込）** |

### 1.3 ポータル統合（`index.html`）の調査結果
- `index.html` lines 117-150: ジャンルフィルタタブ `data-filter-tab="pro"`（士業・法務）が存在。現在のカウントバッジは `1`。
- `index.html` lines 323-350: 現在は `lp-card teaser`（「企画制作中」Coming Soon）として配置されている。
- `index.html` lines 95-106: ヒーロー直下に実機デモクイックリンク（`#hero-quick-aesthetic`, `#hero-quick-italian`）が配置されている。
- `index.html` lines 521-528: フッターナビゲーションに各LPへの直接リンクが存在。

### 1.4 自動テストスイートの制約事項と検証ルール
1. **パス整合性（`validate_links.py`）**: ルート相対パス（`/` で始まるパス）は禁止。すべて厳密な相対パス（`./`, `../../`）で記述し、ファイル名の大文字小文字を完全一致させること。
2. **スクリプト順序（`validate_links.py`）**: `config.js` を必ず `legal.js` の前に読み込むこと。
3. **PASONAセクション構成（`validate_pasona_dom.py`）**:
   - `data-pasona="problem"` または `id="problem"` / `id="hero"`
   - `data-pasona="affinity"` または `id="affinity"`
   - `data-pasona="solution"` または `id="solution"`（Before/After または 実績数値の明記）
   - `data-pasona="offer"` または `id="offer"`（松竹梅3段階以上の料金カード）
   - `data-pasona="narrowing"` または `id="narrowing"`（限定枠・特典の明記）
   - `data-pasona="action"` または `id="action"`（14日カレンダー、Web予約モーダル、LINE CTA）
   - `data-pasona="faq"` または `id="faq"`（アコーディオン形式、最低3問以上）
4. **HTML / SEO / アクセシビリティ（`validate_pasona_dom.py`）**:
   - `<html lang="ja">`
   - `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
   - `<h1>` はページ内に厳密に1つのみ。見出しタグ（h1〜h6）のレベル飛ばし（例: h1→h3）は不可。
   - すべての `<img>` に具体的かつ意味のある `alt` 属性を付与。

---

## 2. Logic Chain（設計根拠とアーキテクチャ導出）

### 2.1 新PASONAの法則（リスク回避・課題解決型）心理誘導モデルの構築
士業・企業法務を求める経営者・役員・事業責任者は、「契約トラブルによる損害」「労務問題・残業代請求・労基署是正勧告」「売掛金未回収」「情報漏洩・知財侵害」といった**事業の存続に関わる重大なリスクを即座に回避・解消したい**という強い課題感を持っています。

```
[Problem: 経営を脅かす法務・労務リスク]
  └─ 「契約書の1行で数千万円の損害」「従業員からの突然の労務申告」「未払い債権の回収遅延」
     経営者が夜も眠れなくなる潜在リスクを顕在化
       ↓
[Affinity: 代表弁護士・専門家チームの寄り添い]
  └─ 大手事務所出身・累計1,200社以上の企業法務を支援してきたパートナー弁護士が、
     「経営者の孤独な決断に寄り添い、攻めと守りの両輪で支える」想いと理念を提示
       ↓
[Solution: 予防法務×即日スピード初動×明朗定額]
  └─ 強み1: 24時間以内の初回レスポンス＆即日初動対応
     強み2: 契約書AI解析×弁護士・社労士ダブルチェックによる予防法務
     強み3: 業界別トラブル解決実績（回収率94.2%、労務紛争未然防止率99%）
     ★Before / After 対比（Before: 属人的対応・高額タイムチャージ → After: 定額安心・即時チャット相談）
       ↓
[Offer: 松竹梅 3段階の明朗料金プラン]
  └─ 【梅】スポット契約書レビュー・労務診断（¥33,000〜）
     【竹★人気No.1】月額顧問ライトプラン（月額¥55,000 / 月3件レビュー・チャット相談無制限）
     【松】総合企業法務パートナープラン（月額¥110,000 / 役員会同席・労務体制構築・専任弁護士）
       ↓
[Narrowing Down: 限定性と安心の保証]
  └─ 質の高い対応を維持するため「毎月先着10社限定 初回60分無料相談（通常¥22,000相当）」
     完全秘密保持契約（NDA）下での相談確約
       ↓
[Action: 14日間 2WAY相談予約カレンダー ＆ LINE即時相談]
  └─ Zoomオンライン / 丸の内オフィス対面 を選べる直近14日間カレンダー（◯・△・✕・休）
     ワンタップで希望日時が入力される予約フォーム＋LINE公式アカウント相談
       ↓
[FAQ & Access: 不安払拭と信頼性の補強]
  └─ 顧問契約の範囲、スポットとの違い、オンライン相談の流れ、丸の内オフィス所在地、代表経歴
```

### 2.2 デザインシステム（Navy & Champagne Gold Glassmorphism）
- **背景・基調**: 深みと重厚感のあるディープネイビー（`#081220`〜`#0E2038`）および高コントラストなオフホワイト（`#F8FAFC`）。
- **アクセント**: 権威性と上質感を象徴するシャンパンゴールド（`#D4AF37` / `#F3E5AB`）のグラデーション。
- **カード・サーフェス**: `backdrop-filter: blur(16px)` を用いた高品位Glassmorphismカード、繊細なゴールド＆スレート境界線（`rgba(212, 175, 55, 0.2)`）。
- **タイポグラフィ**: 見出しには洗練された `Shippori Mincho` / `Cinzel`、本文には高い可読性を誇る `Inter` / `Noto Sans JP`。

### 2.3 2WAY相談予約カレンダー＆予約完了（サンクス）モーダル設計
- **相談形式切替**: 「Zoomオンライン相談（全国対応・推奨）」と「丸の内オフィス対面相談」を切り替え可能。
- **相談枠**: 1日4枠（10:00 / 13:00 / 15:30 / 18:00、各60分）。
- **決定論的オフラインシミュレーション**: GAS Webhook未設定時でも、日付・枠番・曜日・ソルトに基づく決定論的ハッシュ計算で（◯: 空き、△: 残り1枠、✕: 満席、休: 日曜・祝日定休）をリアルタイム描画。
- **サンクスビュー**:
  - 受付番号 `LEG-YYYYMMDD-XXXX` 自動発行
  - Googleカレンダー登録用ワンクリックURL（Zoom情報またはオフィス所在地を自動挿入）
  - RFC 5545 準拠 Apple / Outlook 用 `.ics` ファイル生成（2時間前リマインダー `VALARM` 組み込み）
  - 選択プラン・相談形式・希望日時が自動入力された LINE公式アカウント相談リンク

---

## 3. Caveats（前提条件と調査上の留意事項）

1. **実写画像アセットの生成**: 画像ファイル4点（`hero_consultation.jpg`, `partner_portrait.jpg`, `legal_contract_review.jpg`, `boardroom_meeting.jpg`）は、Gemini画像生成ツールを用いて `samples/legal/assets/images/` に生成・配置する必要があります。
2. **ネットワークモードとオフライン自律性**: 本プロジェクトは外部CDNや外部DBに依存せず、ブラウザ単体（Vanilla JS）で100%完結して動作する設計となっています。GAS Webhookが空文字の場合でも、全機能が破綻なくオフラインフォールバック動作します。
3. **文字コード・環境依存**: Windows環境およびGitHub Pages（Linuxサーバー）双方での互換性を保つため、ファイルパスの大文字小文字を完全一致させ、改行コードやUTF-8エンコーディングを厳格に保持します。

---

## 4. Conclusion（ファイル構成と完全設計仕様）

### 4.1 作成対象ファイル一覧

```
samples/legal/
├── assets/
│   └── images/
│       ├── hero_consultation.jpg       # エグゼクティブルームでの親身な法務相談風景
│       ├── partner_portrait.jpg        # 代表パートナー弁護士の誠実なポートレート
│       ├── legal_contract_review.jpg   # 契約書・重要書類を精査するプロフェッショナルの手元
│       └── boardroom_meeting.jpg       # 会議室での戦略的コンサルティング風景
├── css/
│   └── legal.css                       # ネイビー＆ゴールド Glassmorphism 専用CSS
├── js/
│   ├── config.js                       # LEGAL_CONFIG 一元管理ファイル
│   └── legal.js                        # 2WAYカレンダー・予約フォーム・モーダル・.ics生成JS
└── index.html                           # 新PASONA完全準拠 HTML5 LP
```

### 4.2 各ファイルの詳細設計

#### (1) 設定一元管理ファイル：`samples/legal/js/config.js`
```javascript
(function (global) {
  'use strict';

  var LEGAL_CONFIG = {
    // 1. 事務所基本情報
    firmName: 'LUMEN LEGAL CONSULTING',
    firmJapaneseName: 'ルーメン総合法務・労務コンサルティング事務所',
    firmTagline: '企業法務・労務コンサルティング・契約書リスク予防に強い士業総合事務所',
    firmPostalCode: '100-0005',
    firmAddress: '東京都千代田区丸の内1-X-X 丸の内トラストタワー N館 14F',
    firmAccess: 'JR東京駅 日本橋口 徒歩1分 / 大手町駅 B7出口 徒歩2分',
    firmPhone: '03-6200-8800',
    firmEmail: 'consulting@lumen-legal.example.com',

    // 2. GAS Webhook 設定（未設定時は決定論的オフラインシミュレーション）
    gasWebhookUrl: '',
    gasTimeoutMs: 8000,

    // 3. 営業時間・定休日・相談枠設定
    businessHours: {
      weekday: '10:00 - 19:00',
      label: '平日 10:00 - 19:00（土日祝は事前予約制または休務）'
    },
    closedDays: [0], // 毎週日曜日定休（0: 日）
    closedDaysLabel: '日曜日・祝日（事前予約時は個別対応可）',
    timeSlots: ['10:00', '13:00', '15:30', '18:00'],
    daysToShow: 14,
    capacityPerSlot: 1,

    // 4. 公式LINE連携
    lineOfficialUrl: 'https://line.me/R/ti/p/@lumen_legal',
    lineAccountId: '@lumen_legal',
    lineOaMessageUrl: 'https://line.me/R/oaMessage/@lumen_legal/?',

    // 5. 動的シミュレーション設定
    fallbackSimulation: true,
    simulationSeedSalt: 'lumen_legal_consulting_2026',

    // 6. 料金・顧問プランマスター（松竹梅）
    planMaster: {
      bamboo: {
        id: 'bamboo',
        name: '竹：月額顧問ライトプラン ★人気No.1',
        fullName: '【竹★人気No.1】月額顧問ライトプラン（月3件レビュー・チャット相談無制限）',
        price: 55000,
        priceLabel: '月額 ¥55,000（税込）',
        targetScale: '従業員 5〜30名規模の急成長企業・スタートアップ',
        isPopular: true,
        summary: '月3通までの契約書レビュー＋Slack/Chatwork相談無制限＋初回優先対応'
      },
      plum: {
        id: 'plum',
        name: '梅：スポット契約書・労務診断プラン',
        fullName: '【梅】スポット契約書レビュー＆労務リスク初期診断プラン',
        price: 33000,
        priceLabel: '1案件 ¥33,000〜（税込）',
        targetScale: '単発の契約締結・トラブルをピンポイントで解決したい企業',
        isPopular: false,
        summary: '秘密保持・業務委託・売買等の契約書精査（最短24時間以内納品）'
      },
      pine: {
        id: 'pine',
        name: '松：総合企業法務パートナープラン',
        fullName: '【松】総合企業法務パートナープラン（役員会同席・労務体制整備・専任弁護士）',
        price: 110000,
        priceLabel: '月額 ¥110,000（税込）',
        targetScale: '従業員 30名以上またはIPO準備・事業拡大中の企業',
        isPopular: false,
        summary: '契約書無制限レビュー＋就業規則・労務体制整備＋月1回役員会同席・戦略法務支援'
      },
      free_trial: {
        id: 'free_trial',
        name: '初回60分 無料法律・労務相談',
        fullName: '【毎月先着10社限定】初回60分 無料法務・労務相談（Zoom / 対面）',
        price: 0,
        priceLabel: '初回 60分 無料（通常 ¥22,000）',
        targetScale: 'まずは課題の整理とリスク診断を行いたい経営者・法務責任者',
        isPopular: false,
        summary: '契約書・未払い・労務・法務課題の整理と解決ロードマップのご提案'
      }
    }
  };

  // 下位互換エイリアス
  LEGAL_CONFIG.firmInfo = {
    name: LEGAL_CONFIG.firmName,
    tagline: LEGAL_CONFIG.firmTagline,
    postalCode: LEGAL_CONFIG.firmPostalCode,
    address: LEGAL_CONFIG.firmAddress,
    access: LEGAL_CONFIG.firmAccess,
    tel: LEGAL_CONFIG.firmPhone,
    email: LEGAL_CONFIG.firmEmail
  };
  LEGAL_CONFIG.calendar = {
    daysToShow: LEGAL_CONFIG.daysToShow,
    slots: [
      { id: '10:00', time: '10:00', label: '10:00〜', period: '午前', durationMin: 60 },
      { id: '13:00', time: '13:00', label: '13:00〜', period: '午後', durationMin: 60 },
      { id: '15:30', time: '15:30', label: '15:30〜', period: '午後', durationMin: 60 },
      { id: '18:00', time: '18:00', label: '18:00〜', period: '夕方', durationMin: 60 }
    ]
  };
  LEGAL_CONFIG.plans = LEGAL_CONFIG.planMaster;

  global.LEGAL_CONFIG = LEGAL_CONFIG;
  // テスト互換用エイリアス
  if (!global.SALON_CONFIG) {
    global.SALON_CONFIG = LEGAL_CONFIG;
  }
})(typeof window !== 'undefined' ? window : this);
```

#### (2) HTMLセマンティクス＆新PASONA構成：`samples/legal/index.html`
- **DOCTYPE & Meta**:
  - `lang="ja"`
  - `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
  - `<meta name="description" content="【東京・丸の内】企業法務・労務トラブル・契約書レビューに強い士業・法務総合事務所 LUMEN LEGAL CONSULTING。初回60分無料相談（Zoom/対面）実施中。">`
  - Open Graph Tags (`og:title`, `og:description`, `og:type`)
  - Google Fonts（Shippori Mincho, Cinzel, Inter, Noto Sans JP）
  - 相対パススタイルシート（`../../css/tokens.css`, `../../css/reset.css`, `./css/legal.css`）
- **Header (`header.site-header`)**:
  - ポータル復帰リンク（`../../index.html`）
  - ロゴ（LUMEN LEGAL CONSULTING）
  - 電話番号（`tel:03-6200-8800`）
  - 初回無料相談CTAボタン（モーダル起動）
- **Section 1: Problem (`section#hero` & `section#problem`, `data-pasona="problem"`)**:
  - 単一の `<h1>`: `事業の成長を守り、<br><span class="gold-accent">法的リスクをゼロにする。</span>`
  - 3大実績バッジ（企業法務支援実績 1,200社突破 / 契約トラブル解決率 94.2% / 初回レスポンス 平均2時間以内）
  - ヒーロー画像: `assets/images/hero_consultation.jpg`
  - 経営者の「潜む法的落とし穴」チェックリスト4項目（契約書トラブル、未払い残業・労務申告、売掛金回収遅延、知財・機密漏洩）
- **Section 2: Affinity (`section#affinity`, `data-pasona="affinity"`)**:
  - 代表パートナー弁護士メッセージ
  - 代表写真: `assets/images/partner_portrait.jpg`
  - 「孤独な決断を迫られる経営者の最も身近な戦略パートナーとして」
- **Section 3: Solution (`section#solution`, `data-pasona="solution"`)**:
  - 3大強み（① 24hスピード初動体制、② AI×専門家ダブルチェックの予防法務、③ 経営目線の明朗定額パートナーシップ）
  - 画像: `assets/images/legal_contract_review.jpg`, `assets/images/boardroom_meeting.jpg`
  - **Before / After 比較テーブル**:
    - *Before*: トラブル発生後の後手対応、不明瞭なタイムチャージ、返信に数日
    - *After*: 予防法務による未然防止、明朗な月額定額制、チャットで即日相談
- **Section 4: Offer (`section#offer`, `data-pasona="offer"`)**:
  - 松竹梅3段階料金カード（梅: スポット ¥33,000〜、竹: 月額顧問ライト ¥55,000【人気No.1】、松: 総合パートナー ¥110,000）
  - 各カードにプラン選択ボタン（`data-plan="bamboo"` 等）
- **Section 5: Narrowing Down (`section#narrowing`, `data-pasona="narrowing"`)**:
  - 毎月先着10社限定「初回60分無料法律・労務相談（Zoom / 丸の内対面）」
  - 厳格な秘密保持契約（NDA）締結確約
- **Section 6: Action (`section#action`, `data-pasona="action"`)**:
  - 2WAY相談形式選択タブ（「💻 Zoomオンライン相談（推奨）」「🏢 丸の内オフィス対面相談」）
  - 直近14日間 4枠/日 リアルタイム空き状況カレンダー（◯・△・✕・休）
  - スロットタップ連動フォーム
  - LINE公式相談ボタン ＆ Web予約ボタンのデュアルCTA
- **Section 7: FAQ (`section#faq`, `data-pasona="faq"`)**:
  - WAI-ARIA準拠のインタラクティブアコーディオン 6問（顧問範囲、スポットとの差、オンライン相談方法、費用発生タイミング、守秘義務、対応エリア）
- **Section 8: Access & Profile (`section#access`)**:
  - 事務所概要、丸の内オフィス所在地、アクセス、代表経歴・所属弁護士会
- **Footer (`footer.site-footer`)**:
  - ポータル復帰リンク、著作権表示、ページ内アンカー
- **Mobile Sticky Bar (`aside#mobile-sticky-cta`)**:
  - LINE相談ボタン ＋ 初回無料WEB予約ボタン
- **Booking Modal Dialog (`div#booking-modal`)**:
  - 入力フォーム（お名前、会社名、役職、電話番号、メールアドレス、相談形式、希望プラン、希望日時、相談概要）
  - サンクス画面（受付番号 `LEG-YYYYMMDD-XXXX`、Googleカレンダー追加ボタン、Apple/Outlook `.ics` ダウンロードボタン、LINE予約確認リンク）

#### (3) スタイルシート：`samples/legal/css/legal.css`
- **デザイン変数**:
  ```css
  :root {
    --color-navy-dark: #081220;
    --color-navy-main: #0B192C;
    --color-navy-surface: #13243C;
    --color-navy-card: rgba(19, 36, 60, 0.85);
    --color-gold-accent: #D4AF37;
    --color-gold-light: #F3E5AB;
    --color-gold-gradient: linear-gradient(135deg, #D4AF37 0%, #AA7C11 100%);
    --color-text-main: #FFFFFF;
    --color-text-sub: #CBD5E1;
    --color-text-muted: #94A3B8;
    --color-border-glass: rgba(212, 175, 55, 0.25);
    --font-serif: 'Shippori Mincho', 'Noto Serif JP', serif;
    --font-sans: 'Inter', 'Noto Sans JP', sans-serif;
  }
  ```
- **完全レスポンシブ**: 375px（モバイル）、768px（タブレット）、1024px（デスクトップ）、1440px+（ワイド）。

#### (4) スクリプト：`samples/legal/js/legal.js`
- **モジュール構成**:
  1. `initLegalCalendar()`: 14日間カレンダー描画、決定論的ステータス判定（`◯: available`, `△: limited`, `✕: full`, `休: closed`）、Zoom/対面タブ切替
  2. `initConsultationForm()`: 必須チェック、メール・電話番号バリデーション、GAS送信（非同期フォールバック）
  3. `initBookingModal()`: フォーカストラップ、Escキー対応、背景クリック閉じ
  4. `generateReservationDetails()`: 受付番号 `LEG-YYYYMMDD-XXXX` 発行、GoogleカレンダーURL生成、RFC 5545 `.ics` 生成（VALARM 2時間前リマインダー付）、LINE確認URL生成
  5. `initStickyCTA()`: スクロール監視によるモバイル追従バー表示切替
  6. `initFAQAccordion()`: `aria-expanded` 連動アコーディオン
  7. `initSmoothScroll()`: スムーズスクロール

#### (5) トップポータル統合：`index.html` 修正計画
- **ヒーロークイックリンク追加**:
  ```html
  <a href="./samples/legal/index.html" class="quick-demo-pill pill-legal" id="hero-quick-legal">
    <span class="pill-dot legal"></span>
    <span>⚖️ 士業・法務LP 実機デモ</span>
    <span class="pill-arrow">→</span>
  </a>
  ```
- **カードの公開中（LIVE DEMO）化**:
  `data-category="pro"` のカードを `lp-card teaser` から `lp-card featured`（`id="card-legal"`）へ昇格。
  実写モックアップ、バッジ（公開中 LIVE DEMO、新PASONA完全準拠、2WAY相談予約）、ハイライト、直接リンク（`./samples/legal/index.html`）を配置。
- **フッターリンク追加**:
  ポータルフッターナビゲーションに `samples/legal/index.html` へのリンクを追加。

---

## 5. Verification Method（検証・テスト手順）

本設計が実装された後、以下の手順で独立して客観的に検証可能です。

### 5.1 自動テスト実行コマンド
ターミナルUTF-8強制ルールに準拠し、以下のPythonテストを実行します。

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8;
$env:PYTHONUTF8=1;

# 1. リンク整合性・404ゼロ検証
python tests/validate_links.py

# 2. 新PASONA 7セクション・DOM階層・SEO・松竹梅検証
python tests/validate_pasona_dom.py

# 3. インタラクティブUI・カレンダーエンジン・.ics・LINE連携検証
python tests/test_interactive_ui.py

# 4. 全4層マスター統合テストスイート実行
python tests/run_all_tests.py
```

### 5.2 合格基準チェックリスト
- [ ] `validate_links.py`: ルート相対パス（`/`）が0件、未解決ローカルファイルが0件、スクリプト順序（`config.js` -> `legal.js`）が正常。
- [ ] `validate_pasona_dom.py`: `samples/legal/index.html` 内の全7セクション（problem, affinity, solution, offer, narrowing, action, faq）、単一の `<h1>`、見出しレベルの連続性、松竹梅3段階料金、Before/After、デュアルCTA、FAQ 3問以上、全 `<img>` の `alt` 属性がすべて合格。
- [ ] `run_all_tests.py`: 115件以上の全テストケースが100% PASS。
- [ ] ブラウザ検証: モバイル（375px）およびPC（1440px）でレイアウト崩れがなく、カレンダースロットタップで希望日時が入力され、サンクスモーダルからGoogleカレンダー登録・.icsダウンロード・LINE連携が正しく動作すること。
