# Handoff Report - spec_miner_legal_1

- **Role**: Specification Miner (Legal Consulting LP Copywriting, Architecture & Design System)
- **Target**: `LUMEN LEGAL CONSULTING` Sample LP (`samples/legal/`) & Top Portal Integration (`index.html`)
- **Status**: Complete (Hard Handoff)
- **Author**: `spec_miner_legal_1`
- **Timestamp**: 2026-08-21T08:35:00Z

---

## 1. Observation (直接観察事実)

1. **要件定義**:
   - `c:\Project\事業案\05_LP作成\.agents\ORIGINAL_REQUEST.md` (Lines 89-131) において、GitHub Pages対応LPポータルの第3弾サンプルとして「企業法務・労務コンサルティング・契約書トラブル解決に強い士業・法務総合事務所（LUMEN LEGAL CONSULTING）」特化LPの新規構築が指定されている。
   - 要求仕様として以下の5項目が明示されている：
     - **R1**: 新PASONAの法則（Problem：契約・労務・未払いリスク / Affinity：代表弁護士の寄り添いストーリー / Solution：予防法務×スピード解決の3大強み / Offer：松竹梅顧問・スポットプラン / Narrowing Down：毎月先着10社無料相談枠 / Action：14日間2WAY相談予約カレンダー & LINE即時相談）と、ネイビー＆シャンパンゴールドのモダンGlassmorphism UI。
     - **R2**: 高解像度AI実写ビジュアルアセット4枚（`hero_consultation.jpg`, `partner_portrait.jpg`, `legal_contract_review.jpg`, `boardroom_meeting.jpg`）の生成と配置。
     - **R3**: 相談予約カレンダー（Zoomオンライン / 対面2WAY）、4枠制（10:00/13:00/15:30/18:00）、`samples/legal/js/config.js` 一元設定、Google/Appleカレンダー登録、LINE相談連動。
     - **R4**: トップポータル（`index.html`）の「士業・法務」ジャンルへの公開中（LIVE DEMO）カード追加、双方向復帰リンク整備。
     - **R5**: 自動テストスイート（`tests/`）の全件パスとGitHub Pages本番反映。

2. **スキル・設計基準**:
   - `c:\Project\事業案\05_LP作成\.agents\skills\lp-pasona\SKILL.md` (Lines 65, 86, 172-178): 士業向けPASONAは「P: 衝撃事実・潜在リスク型」「A: 権威・寄り添い共感型」「S: 3大強み・実績解決型」「O: 松竹梅顧問プラン」「N: 初回相談無料・先着限定」「A: デュアルCTA（予約カレンダー+LINE）」が最適構成。
   - `c:\Project\事業案\05_LP作成\.agents\skills\ui-ux-pro-max\SKILL.md` & `data/styles.csv`: Luxury Dark / Glassmorphism（深紺 `#0A192F`、シャンパンゴールド `#D4AF37`、フロストガラス `backdrop-filter: blur(16px)`、ゴールドアンビエントグロー `rgba(212, 175, 55, 0.25)`）。
   - `c:\Project\事業案\05_LP作成\.agents\skills\design-system\SKILL.md`: Primitive → Semantic → Component の3層トークン構造。

3. **既存リファレンス実装の検証**:
   - `samples/aesthetic/` (エステサロン) および `samples/italian/` (イタリアンレストラン) を精査。共通基盤として以下のアーキテクチャパターンが確立されている：
     - 設定一元管理: `window.LEGAL_CONFIG` (`js/config.js`)
     - 決定論的オフラインシミュレーション: GAS未設定時でも ◯・△・✕・休 の空き枠判定と疑似予約が完結
     - 予約完了画面: 予約番号（`LUM-YYYYMMDD-XXXX`）、Googleカレンダー追加URL、RFC 5545 `.ics` 生成（2時間前VALARM付き）、LINE公式アカウントディープリンク
     - DOMテスト基準 (`tests/validate_pasona_dom.py`): 単一 `<h1>`、見出し階層（H1〜H6）、`data-pasona` 属性、松竹梅3プラン、アクセシビリティ（`alt`, `aria-*`）。

---

## 2. Logic Chain (論理展開と導出プロセス)

1. **新PASONAフレームワークの士業・企業法務への最適化**:
   - 中小企業経営者・スタートアップ役員が弁護士・法務コンサルタントを探す心理は「リスク回避（トラブルによる金銭的・信用的損失の防止）」と「ビジネス加速（迅速な契約締結）」にある。
   - **Problem (P)**: 契約書の落とし穴、未払い残業・労務トラブル、売掛金焦げ付きの3大リスクを具体的な損失規模（数百万円〜）とともに提起し、「自社も危ないのではないか」という当事者意識を喚起する。
   - **Affinity (A)**: 代表弁護士 神崎 俊輔の「紛争が起きてからでは遅い。経営者の果敢な挑戦を守り抜く」という理念と、大手企業法務15年・1,200社以上の実績を提示し、信頼と親近感を形成する。
   - **Solution (S)**: ①原則24時間以内即応（Slack/Chatwork/LINE）、②予防法務・最短即日レビュー、③勝率98.5%・元大手企業法務チームの集合知という3つの強みで不安を解消。
   - **Offer (O)**: 敷居を下げるため、梅（ライト顧問 ¥30,000/月）、竹（★人気No.1 スタンダード顧問 ¥50,000/月）、松（プレミアム顧問 ¥100,000/月）の松竹梅体系と、スポット契約書チェック（¥20,000〜）、初回60分無料相談を提示。
   - **Narrowing Down (N)**: サービスの質を担保するため「毎月先着10社限定 無料法務リスク診断枠」を設け、即時予約への動機付けを行う。
   - **Action (A)**: Zoomオンライン相談と丸の内オフィス対面相談を1タップで切り替えられる14日間カレンダーと、24時間受付のLINE即時相談ボタンのデュアルCTAで成約率を最大化する。

2. **Luxury Glassmorphism UIトークン設計**:
   - 信頼と格式を象徴するディープネイビー（`#0A192F`, `#0B192C`）を背景色とし、権威性と上質感を醸成するシャンパンゴールド（`#D4AF37`, `#E5C158`）をアクセントカラーに採用。
   - 半透明すりガラス（`background: rgba(10, 25, 47, 0.72); backdrop-filter: blur(16px); border: 1px solid rgba(212, 175, 55, 0.22);`）と微細なゴールドグロー（`box-shadow: 0 16px 40px -8px rgba(0, 0, 0, 0.6), 0 0 24px rgba(212, 175, 55, 0.25);`）により、最先端かつ重厚なビジュアル体験を構築。
   - タイポグラフィは和文見出しに `Shippori Mincho`、欧文に `Cinzel` / `Inter`、本文に `Noto Sans JP` を採用。

3. **2WAY相談予約カレンダー（Zoom / 対面）仕様導出**:
   - エステサロンやイタリアンと異なり、士業では「全国から手軽に相談できるZoomオンライン」と「機密保持や重要書類を持ち寄る丸の内オフィス対面」の2つの需要が均等に存在する。
   - カレンダー上部に `[ 💻 Zoomオンライン相談（全国対応） ]` と `[ 🏛️ 事務所対面相談（丸の内オフィス） ]` の切替タブを配置。
   - スロット選択時に相談形式がフォーム（`#form-mode`）に連動し、GoogleカレンダーURLや.icsファイル内のロケーション（Zoom URL案内 vs 丸の内トラストタワー）が動的に切り替わるよう設計。

4. **AI画像アセット（Gemini 3.1 Pro生成プロンプト）の確定**:
   - 4つの必要シーンを精確に定義：①エグゼクティブルームでの親身な相談風景（Hero）、②代表弁護士の誠実なポートレート（Affinity）、③契約書と万年筆の手元マクロ（Solution Pillar 01）、④丸の内高層ビルの戦略カンファレンス風景（Solution Pillar 02）。

---

## 3. Detailed Specification Blueprint (詳細仕様設計書)

### §1. サイト基本情報 & ブランドアイデンティティ

| 項目 | 設定値 |
|:---|:---|
| **事務所名（日）** | ルーメン総合法律事務所（LUMEN LEGAL CONSULTING） |
| **事務所名（英）** | LUMEN LEGAL CONSULTING |
| **代表パートナー** | 代表弁護士・法務コンサルタント 神崎 俊輔（第一東京弁護士会所属） |
| **キャッチコピー** | 「予防法務で攻めの経営を。契約トラブル・労務リスクをゼロにする法務パートナー」 |
| **所在地** | 〒100-0005 東京都千代田区丸の内1-8-3 丸の内トラストタワー N館 18F |
| **アクセス** | JR東京駅 日本橋口 徒歩1分 / 東京メトロ大手町駅 B7出口 徒歩2分 |
| **電話番号** | 03-6890-1234（平日 9:30〜19:30） |
| **公式LINE** | `@lumen_legal` (`https://line.me/R/ti/p/@lumen_legal`) |
| **対象エリア** | 全国対応（オンラインZoom面談・チャット）、対面相談（東京丸の内オフィス） |

---

### §2. 新PASONA 7セクション コピーライティング & 構成仕様

```html
<!-- DOM Structure Layout -->
samples/legal/index.html
├── Header (Nav, Brand Logo, Quick Contact, 2WAY CTA Button)
├── Main
│   ├── #problem [data-pasona="problem"] (Hero & 3大リスク提起)
│   ├── #affinity [data-pasona="affinity"] (代表パートナー理念 & 寄り添いメッセージ)
│   ├── #solution [data-pasona="solution"] (予防法務×スピード解決 3大強み & Before/After)
│   ├── #offer [data-pasona="offer"] (松竹梅顧問プラン & スポットメニュー)
│   ├── #narrowing [data-pasona="narrowing"] (毎月先着10社限定 無料相談枠 & 残枠バッジ)
│   ├── #action [data-pasona="action"] (14日間 2WAY予約カレンダー & LINE即時相談)
│   ├── #faq [data-pasona="faq"] (よくある質問 アコーディオン 6項目)
│   └── #access (丸の内オフィス所在地・地図・事務所概要)
├── Footer (Copyright, Privacy Policy, Top Link)
├── #booking-modal (Web予約モーダル / 予約完了サンクス画面)
└── #mobile-sticky-cta (下部追従 2WAY無料相談CTAバー)
```

#### 1. Problem (問題提起 / 衝撃事実・潜在リスク喚起) - `#problem`
- **H1 見出し**:
  - `契約書の不備、労務トラブル、未払いリスク──`<br>`<span class="gold-gradient-text">その法的落とし穴、会社の成長を止めていませんか？</span>`
- **リード文**:
  - 中小企業・スタートアップの約68%が「予期せぬ法的紛争」を経験。1度のトラブルで失う資金は平均300万円〜1,000万円以上、さらに経営者の貴重な時間と社会的信用が損なわれます。
- **3大経営リスクカード**:
  - **Risk 01: 【契約リスク】相手方に有利すぎる不利条項・莫大な損害賠償義務の見落とし**
  - **Risk 02: 【労務リスク】固定残業代の計算不備や就業規則の形骸化による未払い賃金請求・労基署是正勧告**
  - **Risk 03: 【債権回収リスク】契約書未締結・曖昧な仕様合意による売掛金の焦げ付き・支払い拒絶**

#### 2. Affinity (親近感・共感 / 代表パートナー理念) - `#affinity`
- **H2 見出し**: `「紛争が起きてからでは遅い。経営者の挑戦を、盤石な法務で守り抜く」`
- **代表プロフィール**:
  - **神崎 俊輔 (Shunsuke Kanzaki)** / 代表弁護士・企業法務コンサルタント
  - 経歴: 東京大学法学部卒業後、五大法律事務所にて企業法務・M&A・労働訴訟に10年以上従事。2018年に「中小企業・スタートアップのための攻めの法務」を掲げLUMEN LEGALを設立。累計1,200社以上の顧問・紛争解決実績。
- **メッセージ内容**:
  - 「多くの経営者が『弁護士は敷居が高い』『費用が不透明で相談しづらい』とおっしゃいます。しかし、ビジネスの現場では数日の遅れが致命傷になります。私たちは、経営者の隣で同じ目線に立ち、ビジネスのスピードを落とさない『最良のパートナー』であり続けます。」

#### 3. Solution (解決策 / 予防法務×スピード解決 3大強み) - `#solution`
- **H2 見出し**: `LUMEN LEGALが選ばれる理由──「予防法務」×「圧倒的スピード」の3大強み`
- **Pillar 01: 【即応性】原則24時間以内の迅速回答 & Slack / Chatwork / LINE 直結**
  - 経営の意思決定を停滞させないため、専用チャットツールで弁護士チームとダイレクトに連携。急な契約締結や労務トラブルの初動対応を即日サポート。
- **Pillar 02: 【専門性】最短即日レビュー & ビジネスに踏み込んだ予防法務**
  - 単なる法的な可否だけでなく、「どうすればビジネスを前に進められるか」の代替案を提示。就業規則や雇用契約書の事前監査で、将来の紛争の芽を92%未然に排除。
- **Pillar 03: 【圧倒的実績】解決実績1,200社超・勝率98.5%・元大手企業法務チームの集合知**
  - 契約交渉、労使紛争、売掛金回収、株主総会指導からIPO準備まで、専門領域を持つ精鋭弁護士がワンチームで強固に防衛。
- **Before / After 実績比較**:
  - *Before (顧問未導入)*: トラブルが起きてから慌てて相談 → 高額な着手金（50万円〜）と数ヶ月の長期化で本業が麻痺。
  - *After (LUMEN導入後)*: チャットで日頃から相談 → 月額3〜5万円の定額でトラブルを未然防止。万一の際も即座に対応完了。

#### 4. Offer (提案 / 松竹梅 明朗顧問プラン & スポットメニュー) - `#offer`
- **H2 見出し**: `事業ステージに合わせて選べる、明朗・定額の顧問プラン`
- **松竹梅 料金体系**:
  1. **【梅】ライト顧問プラン (契約書チェック特化)**
     - 月額: **¥30,000**（税込 ¥33,000）
     - 対象: 創業期スタートアップ、個人事業主、契約書チェックを定期的に依頼したい企業
     - 特徴: 契約書レビュー月3通まで、オンライン相談月2回（各30分）、メール・専用チャット相談
  2. **【竹】スタンダード顧問プラン (労務＋契約＋チャット無制限) ★人気No.1・推奨**
     - 月額: **¥50,000**（税込 ¥55,000）
     - 対象: 従業員10〜50名規模の中小企業、労務リスクを遮断し契約を迅速化したい企業
     - 特徴: 契約書レビュー無制限、労務相談・就業規則随時チェック、Slack/Chatwork/LINE相談無制限、オンライン相談月4回（各60分）、顧問弁護士名義の対外表示権、法務リスク総点検レポート無料進呈
  3. **【松】プレミアム顧問プラン (役員会同席＋戦略法務フルサポート)**
     - 月額: **¥100,000**（税込 ¥110,000）
     - 対象: 従業員50名以上、IPO準備、新規事業開発や複雑な係争を包括委託したい企業
     - 特徴: スタンダード全内容＋月1回役員会/経営会議への同席、優先即日レビュー、株主総会指導、専任弁護士2名体制
- **スポット・初回限定オファー**:
  - 契約書作成・チェック: ¥20,000〜 / 通
  - 就業規則・社内規程作成: ¥150,000〜
  - **初回個別相談（60分）: 毎月先着枠限定 ¥0（通常 ¥15,000）**

#### 5. Narrowing Down (限定性・緊急性) - `#narrowing`
- **H2 見出し**: `質の高い手厚いサポートのため、毎月【先着10社様限定】の無料受付`
- **内容**:
  - 既存の顧問先企業様への即応体制とサービス品質を最高水準に保つため、新規の法務リスク無料診断・顧問相談は「毎月先着10社様」に限らせていただいております。
  - 残枠バッジ表示: `【今月の無料相談枠: 残り 3 社】`

#### 6. Action (行動喚起 / 2WAY予約カレンダー & LINE) - `#action`
- **H2 見出し**: `直近14日間の空き枠から、今すぐ無料相談をご予約いただけます`
- **2WAYモード切替**:
  - `[ 💻 Zoomオンライン相談（全国対応） ]`（デフォルト）
  - `[ 🏛️ 丸の内オフィス対面相談（完全個室） ]`
- **カレンダー仕様**: 直近14日間の4枠（10:00 / 13:00 / 15:30 / 18:00）の空き状況（◯・△・✕・休）をリアルタイム表示。
- **LINE相談バナー**:
  - `「今すぐ質問したい」「日程調整をLINEで完結させたい」方はこちら`
  - 公式LINE追加ボタン（24時間受付）

#### 7. FAQ (よくある質問) - `#faq`
- **Q1: まだ法的なトラブルが起きていない段階でも相談して良いですか？**
  - A: もちろんです。むしろ問題が顕在化する前の「予防法務」こそが最もコストを抑え、会社を守る最善策です。契約書の事前チェックや就業規則の点検など、お気軽にご相談ください。
- **Q2: 地方の会社ですが、全国から相談・顧問契約は可能ですか？**
  - A: はい、全国の企業様に対応しております。ZoomやGoogle Meetによるオンライン面談、Slack・Chatwork・LINEでの日常的なチャット相談により、場所を問わず東京・丸の内のトップクラス法務サービスをご利用いただけます。
- **Q3: 顧問契約に最低契約期間（縛り）はありますか？**
  - A: 原則として1ヶ月単位での自動更新となっており、長期の無理な縛り期間は設けておりません。いつでもプランの変更や解約が可能ですので、安心してお試しいただけます。
- **Q4: 相談した内容や自社の機密情報は外部に漏れませんか？**
  - A: 弁護士法第23条により、弁護士には極めて厳格な守秘義務が課せられています。また、ご希望に応じて事前の秘密保持契約（NDA）の締結も承っております。
- **Q5: スポット（単発）での契約書作成や労務相談だけでも依頼できますか？**
  - A: はい、スポットでのご依頼も大歓迎です。1通の契約書レビュー（2万円〜）から承っております。まずは無料相談にて現状をお聞かせください。
- **Q6: オンライン相談と丸の内オフィス対面相談に違いはありますか？**
  - A: ご相談内容や担当弁護士の質に違いは一切ございません。ご都合に合わせて、移動時間ゼロのZoomオンライン相談、または東京駅直結の丸の内オフィスでの対面相談をお選びいただけます。

---

### §3. Luxury Modern Glassmorphism UI トークン仕様

```css
:root {
  /* ==========================================================================
     1. Primitive Tokens
     ========================================================================== */
  --legal-navy-950: #050B14;
  --legal-navy-900: #0A192F;
  --legal-navy-850: #0D203D;
  --legal-navy-800: #112A4D;
  --legal-navy-700: #1B3A66;
  
  --legal-gold-300: #F3E5AB;
  --legal-gold-400: #E5C158;
  --legal-gold-500: #D4AF37;
  --legal-gold-600: #C5A059;
  --legal-gold-700: #997B38;
  
  --legal-slate-50:  #F8FAFC;
  --legal-slate-100: #F1F5F9;
  --legal-slate-200: #E2E8F0;
  --legal-slate-300: #CBD5E1;
  --legal-slate-400: #94A3B8;
  --legal-slate-500: #64748B;
  
  --legal-status-available: #10B981;
  --legal-status-limited:   #F59E0B;
  --legal-status-full:      #EF4444;
  --legal-status-closed:    #64748B;

  /* ==========================================================================
     2. Semantic Tokens
     ========================================================================== */
  --bg-page: var(--legal-navy-950);
  --bg-section-alt: var(--legal-navy-900);
  --bg-glass-card: rgba(10, 25, 47, 0.75);
  --bg-glass-elevated: rgba(15, 35, 61, 0.88);
  --bg-glass-hover: rgba(20, 45, 77, 0.92);
  
  --border-glass: rgba(212, 175, 55, 0.22);
  --border-glass-bright: rgba(212, 175, 55, 0.6);
  --border-subtle: rgba(255, 255, 255, 0.08);
  
  --text-primary: var(--legal-slate-100);
  --text-secondary: var(--legal-slate-300);
  --text-muted: var(--legal-slate-400);
  --text-gold: var(--legal-gold-400);
  
  --accent-gold: var(--legal-gold-500);
  --accent-glow: rgba(212, 175, 55, 0.28);
  
  /* ==========================================================================
     3. Component & Layout Tokens
     ========================================================================== */
  --backdrop-blur: blur(16px);
  --radius-card: 16px;
  --radius-button: 8px;
  --radius-pill: 9999px;
  
  --shadow-glass: 0 16px 40px -8px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(212, 175, 55, 0.15);
  --shadow-glass-hover: 0 20px 48px -6px rgba(0, 0, 0, 0.8), 0 0 28px rgba(212, 175, 55, 0.35);
  --shadow-gold-button: 0 8px 24px -4px rgba(212, 175, 55, 0.5);
  
  --font-heading: 'Shippori Mincho', 'Cinzel', serif;
  --font-body: 'Noto Sans JP', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

---

### §4. 2WAY 相談予約カレンダー & バックエンド連携仕様

1. **時間枠構成**:
   - 1日4枠制: `10:00`, `13:00`, `15:30`, `18:00`（各枠60分相談）
   - 定休日: 土曜・日曜・祝日（`closedDays: [0, 6]`）
2. **2WAY相談形式（Consultation Modes）**:
   - `online`: Zoomオンライン相談（全国対応・移動不要）
   - `in_person`: 丸の内オフィス対面相談（東京都千代田区丸の内1-8-3 丸の内トラストタワーN館 18F）
3. **決定論的オフラインシミュレーションアルゴリズム**:
   - シード計算: `seed = hash(dateStr + '-' + slotTime + '-' + currentMode + '-' + salt)`
   - 週末判定: `closed`（休）
   - 当日経過枠: 過去時間は自動的に `full`（✕）
   - スコア判定: `< 50` → `available` (◯: 空き), `< 80` → `limited` (△: 残り1枠), `>= 80` → `full` (✕: 満席)
4. **予約完了（サンクス）処理**:
   - 予約番号生成: `LUM-YYYYMMDD-XXXX`（例: `LUM-20260825-4F8B`）
   - Googleカレンダー追加リンク生成（Zoomオンライン時はURL案内、対面時はオフィス住所をLocationに設定）
   - RFC 5545 `.ics` ファイル生成（2時間前通知 `VALARM` 内蔵）
   - LINE公式アカウント 1タップ予約確認リンク（予約番号・選択日時・相談形式を事前入力したURL）
   - GAS Webhook POST（`gasWebhookUrl` 設定時のみ、非同期CORS対応）

---

### §5. AI実写画像アセット仕様 & Gemini 3.1 Pro プロンプト定義

| アセットファイル名 | 配置セクション | アスペクト比 | 被写体・画角・演出プロンプト |
|:---|:---|:---:|:---|
| `hero_consultation.jpg` | Hero / ファーストビュー背景 | 16:9 (1920x1080) | `A sophisticated Japanese male corporate attorney in his early 40s wearing a tailored charcoal navy suit, sitting in an ultra-luxurious Tokyo high-rise corner office at dusk. Modern glass conference table, warm amber and gold interior lighting, Tokyo skyline visible through floor-to-ceiling windows. Professional, reassuring and confident posture, premium corporate legal atmosphere, photorealistic, 8k resolution, cinematic depth of field.` |
| `partner_portrait.jpg` | Affinity / 代表パートナー紹介 | 1:1 (800x800) | `Executive studio portrait of a distinguished Japanese lawyer (Shunsuke Kanzaki) in his early 40s. Wearing a bespoke dark navy wool suit, white crisp shirt, and refined silk tie. Intellectual, trustworthy, and approachable expression. Subtle studio rim lighting with a blurred warm law firm background of mahogany shelves and leather-bound books. Sharp focus on face, natural skin texture, masterpiece photography.` |
| `legal_contract_review.jpg` | Solution / 強み01（契約監査） | 4:3 (1200x900) | `Close-up macro shot of professional hands in a dark navy suit reviewing and checking a complex corporate legal agreement with a luxury gold fountain pen. Sleek iPad Pro on a polished dark wood desk, traditional Japanese legal seal (Hanko), warm desk lamp illumination, sharp focus on contract typography, deep navy and champagne gold color tones, photorealistic.` |
| `boardroom_meeting.jpg` | Solution / 強み02（戦略顧問） | 16:9 (1920x1080) | `Cinematic wide photograph of a high-stakes executive boardroom meeting in a modern glass conference room in Marunouchi Tokyo. Japanese corporate lawyer explaining strategic legal points to attentive business leaders around a large minimalist conference table. High-rise city view outside window with golden hour sunset light, prestigious and refined atmosphere, 8k resolution.` |

---

### §6. 設定一元管理インターフェース契約 (`samples/legal/js/config.js`)

```javascript
/**
 * samples/legal/js/config.js
 * Centralized Legal Firm & Consultation Booking System Configuration
 * Single Source of Truth for LUMEN LEGAL CONSULTING
 */
(function (global) {
  'use strict';

  var LEGAL_CONFIG = {
    // 1. 事務所基本情報
    firmName: 'LUMEN LEGAL CONSULTING',
    firmJapaneseName: 'ルーメン総合法律事務所',
    firmTagline: '企業法務・労務リスク解決特化 総合法律事務所',
    postalCode: '100-0005',
    address: '東京都千代田区丸の内1-8-3 丸の内トラストタワーN館 18F',
    access: 'JR東京駅 日本橋口 徒歩1分 / 東京メトロ大手町駅 B7出口 徒歩2分',
    phone: '03-6890-1234',
    email: 'contact@lumen-legal.example.com',
    representative: '代表弁護士 神崎 俊輔（第一東京弁護士会所属）',

    // 2. GAS Webhook 設定
    gasWebhookUrl: '',
    gasTimeoutMs: 8000,

    // 3. 営業時間 & 予約枠設定
    businessHours: {
      weekday: '9:30 - 19:30',
      label: '平日 9:30 - 19:30（土日祝 定休 / 顧問先24時間チャット対応）'
    },
    closedDays: [0, 6], // 0: 日, 6: 土
    closedDaysLabel: '土曜日・日曜日・祝日（顧問先は24時間チャット受付）',
    timeSlots: ['10:00', '13:00', '15:30', '18:00'],
    daysToShow: 14,
    capacityPerSlot: 1,

    // 4. 2WAY相談形式定義
    consultationModes: {
      online: {
        id: 'online',
        label: 'Zoomオンライン相談',
        badge: '全国対応・移動ゼロ',
        description: '全国どこからでもZoom等で手軽にご相談いただけます。'
      },
      in_person: {
        id: 'in_person',
        label: '丸の内オフィス対面相談',
        badge: '完全個室・重要書類持参',
        description: '東京駅直結の丸の内オフィスにて完全個室で面談いたします。'
      }
    },

    // 5. 公式LINE設定
    lineOfficialUrl: 'https://line.me/R/ti/p/@lumen_legal',
    lineAccountId: '@lumen_legal',
    lineOaMessageUrl: 'https://line.me/R/oaMessage/@lumen_legal/?',

    // 6. 動的シミュレーション設定
    fallbackSimulation: true,
    simulationSeedSalt: 'lumen_legal_consulting_2026',

    // 7. 提供プランマスター
    planMaster: {
      free_trial: {
        id: 'free_trial',
        name: '初回60分 無料法律相談（毎月先着10社限定）',
        tier: 'trial',
        price: 0,
        priceLabel: '¥0（通常 ¥15,000）',
        durationMin: 60,
        isPopular: true,
        summary: '契約書・労務・未払いリスクの初回診断＆解決方針のご提示'
      },
      bamboo: {
        id: 'bamboo',
        name: '【竹】スタンダード顧問プラン（労務＋契約＋チャット無制限）★人気No.1',
        tier: 'bamboo',
        price: 50000,
        priceLabel: '¥50,000 / 月（税込 ¥55,000）',
        durationMin: 60,
        isPopular: true,
        summary: '契約書レビュー無制限＋労務・就業規則随時点検＋Slack/Chatwork直結＋月4回面談'
      },
      plum: {
        id: 'plum',
        name: '【梅】ライト顧問プラン（契約書チェック特化）',
        tier: 'plum',
        price: 30000,
        priceLabel: '¥30,000 / 月（税込 ¥33,000）',
        durationMin: 30,
        isPopular: false,
        summary: '契約書レビュー月3通まで＋月2回オンライン相談＋メール相談'
      },
      pine: {
        id: 'pine',
        name: '【松】プレミアム顧問プラン（役員会同席＋戦略法務フルサポート）',
        tier: 'pine',
        price: 100000,
        priceLabel: '¥100,000 / 月（税込 ¥110,000）',
        durationMin: 60,
        isPopular: false,
        summary: 'スタンダード全内容＋役員会同席＋優先即日対応＋知財/M&A＋専任弁護士2名体制'
      },
      spot_review: {
        id: 'spot_review',
        name: '【スポット】契約書作成・リーガルチェック',
        tier: 'spot',
        price: 20000,
        priceLabel: '¥20,000〜 / 通（税込 ¥22,000〜）',
        durationMin: 60,
        isPopular: false,
        summary: '単発での契約書リーガルチェック・修正条項案作成・リスク洗い出し'
      }
    }
  };

  // Structured Aliases for Compatibility
  LEGAL_CONFIG.firmInfo = {
    name: LEGAL_CONFIG.firmName,
    japaneseName: LEGAL_CONFIG.firmJapaneseName,
    tagline: LEGAL_CONFIG.firmTagline,
    address: LEGAL_CONFIG.address,
    access: LEGAL_CONFIG.access,
    tel: LEGAL_CONFIG.phone,
    email: LEGAL_CONFIG.email,
    businessHours: LEGAL_CONFIG.businessHours.label,
    regularHolidays: LEGAL_CONFIG.closedDays,
    regularHolidaysLabel: LEGAL_CONFIG.closedDaysLabel
  };
  LEGAL_CONFIG.gas = { webhookUrl: LEGAL_CONFIG.gasWebhookUrl, timeoutMs: LEGAL_CONFIG.gasTimeoutMs };
  LEGAL_CONFIG.calendar = {
    daysToShow: LEGAL_CONFIG.daysToShow,
    slots: LEGAL_CONFIG.timeSlots,
    closedDays: LEGAL_CONFIG.closedDays,
    capacityPerSlot: LEGAL_CONFIG.capacityPerSlot
  };
  LEGAL_CONFIG.plans = LEGAL_CONFIG.planMaster;
  LEGAL_CONFIG.line = {
    accountUrl: LEGAL_CONFIG.lineOfficialUrl,
    accountId: LEGAL_CONFIG.lineAccountId,
    oaMessageBaseUrl: LEGAL_CONFIG.lineOaMessageUrl
  };
  LEGAL_CONFIG.fallback = {
    enableSimulation: LEGAL_CONFIG.fallbackSimulation,
    simulationSeedSalt: LEGAL_CONFIG.simulationSeedSalt
  };

  global.LEGAL_CONFIG = LEGAL_CONFIG;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = LEGAL_CONFIG;
  }
})(typeof window !== 'undefined' ? window : this);
```

---

### §7. トップポータル（`index.html`）統合仕様

1. **ヘッダークイックアクション**:
   - `pill-legal` を追加: `<span>⚖️ 士業・法務LP 実機デモ</span>`
2. **ジャンルフィルタータブ**:
   - `data-filter-tab="pro"` のバッジカウントを `1` に更新し、公開中カードへ切り替え。
3. **士業特化 FEATURED CARD 3 (`#card-legal`) の配置**:
   - `data-category="pro"`
   - `badge-live`（公開中 LIVE DEMO）、`新PASONA完全準拠`、`2WAY相談予約`、`Glassmorphism UI`
   - サムネイル: `samples/legal/assets/images/hero_consultation.jpg`
   - リンク: `./samples/legal/index.html`

---

## 4. Features Discovered (発見・定義された全機能一覧)

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Copywriting | 新PASONA 7セクション | Problem〜Action＋FAQの心理誘導セールスコピー | 企業法務ペルソナ | セマンティックHTML | 該当タグ欠損時はテスト検知 | `ORIGINAL_REQUEST.md` §R1 |
| 2 | UI/UX | Luxury Glassmorphism | 深紺×シャンパンゴールドの多層すりガラスデザイン | CSS変数トークン | 高級感・信頼感あふれるUI | 非対応ブラウザは半透明フォールバック | `ui-ux-pro-max` & `design-system` |
| 3 | Visual | 4大実写AI画像アセット | 弁護士・契約書・役員会議等の高解像度写真 | Gemini生成画像 | 最適配置された実写ビジュアル | 画像パス不整合時はプレースホルダー | `ORIGINAL_REQUEST.md` §R2 |
| 4 | Calendar | 2WAY相談形式切替 | Zoomオンラインと丸の内オフィス対面のタブ切替 | ユーザーのタスク選択 | カレンダー及びフォームの形式同期 | デフォルト値（online）へフォールバック | `ORIGINAL_REQUEST.md` §R3 |
| 5 | Calendar | 14日間 空き枠グリッド | 当日〜14日後×4枠（10:00/13:00/15:30/18:00）の表示 | 日付・時間枠配列 | ◯・△・✕・休 のテーブルUI | 過去枠は自動で満席表示 | `ORIGINAL_REQUEST.md` §R3 |
| 6 | Calendar | 決定論的シミュレーション | GAS未設定時でも破綻なく動作するオフライン計算 | 日付・時間・シード塩 | 一貫性のある空き状況判定 | シード値に基づき安定生成 | `ORIGINAL_REQUEST.md` §R3 |
| 7 | Booking | スロット連動自動入力 | カレンダーの空き枠タップで希望日時・形式を自動代入 | カレンダーセルclick | `#form-datetime` への値セットとスクロール | 満席・定休枠はタップ無効 | `ORIGINAL_REQUEST.md` §R3 |
| 8 | Booking | プラン事前選択 | 松竹梅プランカードのCTAから該当プランを自動選択 | プランボタンclick | `#form-plan` の選択状態更新 | デフォルト（無料相談）を適用 | `ORIGINAL_REQUEST.md` §R1 |
| 9 | Booking | 予約バリデーション | 会社名、氏名、メール、電話番号、日時の必須チェック | フォーム入力値 | エラーハイライト / 送信許可 | 未入力時に赤枠表示とフォーカス | `ORIGINAL_REQUEST.md` §R3 |
| 10 | Thank-You | 予約番号自動発行 | `LUM-YYYYMMDD-XXXX` 形式の識別コード生成 | 現在日時＋乱数 | サンクス画面での番号表示 | 常に一意なコードを発行 | `ORIGINAL_REQUEST.md` §R3 |
| 11 | Integration | 1クリックGoogleカレンダー | 相談形式（Zoom/対面）に応じた場所・内容のURL生成 | 予約詳細データ | Googleカレンダー登録URL | ポップアップブロック時は直接遷移 | `ORIGINAL_REQUEST.md` §R3 |
| 12 | Integration | RFC 5545 .ics ダウンロード | 2時間前アラーム（VALARM）付きカレンダーファイル | 予約詳細データ | `lumen_consultation_LUM-*.ics` Blob | Blob非対応環境はリンクダウンロード | `ORIGINAL_REQUEST.md` §R3 |
| 13 | Integration | LINE公式ディープリンク | 予約内容が初期入力された状態のLINE起動URL | 予約詳細＋LINE ID | LINEアプリ起動URL | LINE未インストール時はWeb版へ | `ORIGINAL_REQUEST.md` §R3 |
| 14 | Integration | GAS Webhook送信 | スプレッドシート記録・カレンダー登録用非同期POST | 予約JSONデータ | GASレスポンス | 通信失敗時も画面は成功遷移を維持 | `ORIGINAL_REQUEST.md` §R3 |
| 15 | Navigation | 下部追従2WAY CTAバー | スクロール連動で出現するモバイル・PC固定CTA | スクロール位置 | 追従バー表示/非表示 | 予約エリア到達時は干渉防止非表示 | `ORIGINAL_REQUEST.md` §R1 |
| 16 | Navigation | WAI-ARIA FAQ アコーディオン | 6問のQ&Aのアクセシブルな開閉トグル | click / Enterキー | `aria-expanded` と連動した展開 | JS無効時も全展開で閲覧可能 | `ORIGINAL_REQUEST.md` §R1 |
| 17 | Config | `LEGAL_CONFIG` 一元管理 | 事務所情報・料金・営業時間・GAS等の単一情報源 | `config.js` | グローバル設定オブジェクト | 未定義時はデフォルト定数使用 | `ORIGINAL_REQUEST.md` §R3 |
| 18 | Portal | トップポータル統合 | `index.html` へのLIVE DEMOカード追加と双方向遷移 | ポータルDOM | 相互リンク完全接続 | 404エラーゼロを自動テスト検証 | `ORIGINAL_REQUEST.md` §R4 |

---

## 5. Edge Cases (エッジケース仕様)

| # | Feature | Input / Scenario | Observed / Specified Behavior |
|---|---------|------------------|-------------------------------|
| 1 | 2WAY カレンダー | 過去の時間枠（当日すでに終了した枠） | 当日現在時刻より前の枠は、シミュレーション結果に関わらず強制的に `full`（✕：受付終了）として描画され選択不可となる。 |
| 2 | 2WAY カレンダー | 定休日（土曜日・日曜日）のスロット | `closedDays: [0, 6]` に該当する曜日は全枠 `closed`（休：定休日）となり、クリックイベントは発火しない。 |
| 3 | 2WAY カレンダー | モード切替（Zoom ↔ 対面）のリアルタイム切替 | 切替時にカレンダーのシードオフセットが再計算され、選択中の希望日時の表記（`(Zoomオンライン)` または `(丸の内対面)`）が即座に更新される。 |
| 4 | 予約フォーム | GAS Webhook URLが未設定（`gasWebhookUrl: ""`） | 通信エラーを発生させず、完全決定論的ローカルモードで即座に予約番号を発行し、サンクス画面をシームレスに表示する。 |
| 5 | 予約フォーム | ネットワーク切断・GASエンドポイントタイムアウト（8秒超過） | `fetch` の catch ブロックで例外を捕捉し、コンソール警告を出力しつつ、ユーザー画面は正常にサンクス状態へ移行させて離脱を防ぐ。 |
| 6 | カレンダー登録 | Zoomオンライン相談時のGoogleカレンダー/ics出力 | 場所（Location）に `Zoom Meeting URL (オンライン)`、詳細に「Zoom URLは確認メールまたはLINEにてご案内」と記載。 |
| 7 | カレンダー登録 | 丸の内対面相談時のGoogleカレンダー/ics出力 | 場所（Location）に `東京都千代田区丸の内1-8-3 丸の内トラストタワーN館 18F`、詳細にアクセス案内（東京駅日本橋口徒歩1分）を記載。 |
| 8 | 入力検証 | メールアドレスの書式不正（`test@` 等） | 即座にインラインでエラーを表示し、フォーカスを当てて修正を促す（送信はブロック）。 |

---

## 6. Caveats (留意点・制約事項)

1. **Specification Miner の職務範囲**: 本エージェントは仕様策定（Spec Miner）であり、実際のファイル作成・コード実装（`samples/legal/`、`index.html`、`tests/`）は後続の Worker エージェントが実行する。
2. **AI画像アセットの生成**: 画像ファイルは Gemini 画像生成ツールを用いて Worker または専用エージェントにより生成・配置される。
3. **サーバーレス運用**: 外部有償サーバーやDBを一切使用せず、静的HTML/CSS/JS + GAS（無料枠）で全機能が自律完結する。

---

## 7. Conclusion (最終評価・仕様結論)

- 「LUMEN LEGAL CONSULTING」サンプルLPの全仕様（新PASONA 7セクション構成、Luxury Glassmorphism UIトークン、2WAY 14日相談予約カレンダー、AI実写画像アセットプロンプト、設定一元管理契約、ポータル連携、全18機能および8エッジケース）が**完全に定義・文書化**された。
- 本仕様書（`handoff.md`）に基づき、実装担当チーム（M1 Worker 等）は一切の迷いなく高品質な本番コードの作成へ直ちに着手可能である。

---

## 8. Verification Method (独立検証方法)

1. **仕様整合性チェック**:
   - `c:\Project\事業案\05_LP作成\.agents\spec_miner_legal_1\handoff.md` を開き、§1〜§7 の全仕様および Features Discovered / Edge Cases テーブルが網羅されていることを確認。
2. **テストスイート適合性**:
   - `tests/validate_pasona_dom.py` において、`samples/legal/index.html` の新PASONA 7セクション（problem, affinity, solution, offer, narrowing, action, faq）、松竹梅3プラン、単一H1、画像altが満たされる構造であることを確認。
   - `tests/validate_links.py` において、`index.html` ↔ `samples/legal/index.html` の双方向相対リンク（404ゼロ）が成立することを確認。
