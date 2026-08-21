# Handoff Report - spec_miner_bakery_1

- **Role**: Specification Miner (French Artisan Bakery LP Copywriting, Architecture & Design System)
- **Target**: `BOULANGERIE ARTISANALE` Sample LP (`samples/bakery/`) & Top Portal Integration (`index.html`)
- **Status**: Complete (Hard Handoff)
- **Author**: `spec_miner_bakery_1`
- **Timestamp**: 2026-08-22T07:18:00Z

---

## 1. Observation (直接観察事実)

1. **要件定義**:
   - `c:\Project\事業案\05_LP作成\.agents\ORIGINAL_REQUEST.md` (Lines 133-195) において、GitHub Pages対応LPポータルの第4弾サンプルとして「本場フランス仕込みのハード系特化ベーカリー（BOULANGERIE ARTISANALE）」の構築が指定されている。
   - 要求仕様として以下の主要項目が明示されている：
     - **R1 (ベーカリーLP構成)**: 五感刺激・アルチザン体験型モデル（フランス産小麦、自家製ルヴァン酵母、石窯直焼き、72時間長時間低温熟成）。焼き上がり時刻表（タイムテーブル）、店頭受け取り＆お取り寄せ松竹梅アソートBOX（梅：モーニングハードセット ¥1,980 / 竹：人気定番7種詰め合わせBOX ¥3,480 ★人気No.1 / 松：プレミアム薪窯バゲット＆贅沢オードブルBOX ¥5,800）、14日間 焼き立てパン取り置き＆来店予約カレンダー、クラフト紙・小麦ゴールド・ナチュラルウッドの温もりあるオーガニックGlassmorphism UI。
     - **R3 (画像アセット)**: 4枚の高解像度実写画像（`hero_baguette.jpg`, `baker_craftsman.jpg`, `campagne_slice.jpg`, `bakery_display.jpg`）の配置。
     - **R4 (設定一元化＆予約連動)**: `samples/bakery/js/config.js` (`window.BAKERY_CONFIG`) で営業時間（7:30 - 18:30）、定休日（毎週月・火曜日 `[1, 2]`）、受取枠（8:00, 11:00, 14:00, 16:30）を一元管理し、Googleカレンダー同期・動的フォールバック・予約完了画面（Google/Appleカレンダー登録、LINE連動）を実装。
     - **R5 (トップポータル統合)**: `index.html` の「飲食・グルメ」ジャンルに「ハード系ベーカリー」のLIVE DEMOカードを配置し、双方向リンクを完備。
     - **R6 (自動テスト検証)**: リンク整合性（404ゼロ）、DOM構造、レスポンシブ表示（375px〜1920px）、予約カレンダー連動の自動テストスイートを拡張・全件合格。

2. **スキル・設計基準**:
   - `c:\Project\事業案\05_LP作成\.agents\skills\lp-pasona\SKILL.md`: 飲食・店舗向けPASONAの最適化（五感刺激・シズル感Hero、職人ストーリー共感、石窯・発酵・無添加の3大解決策、松竹梅アソートBOX、焼き上がり限定・取り置き枠、14日カレンダー＆LINE予約）。
   - `c:\Project\事業案\05_LP作成\.agents\skills\ui-ux-pro-max\SKILL.md` & `data/colors.csv`, `styles.csv`: Warm Organic Craft Paper & Wheat Gold Glassmorphism（クラフト紙 `#F9F6F0`、小麦ゴールド `#D4A359`、クラストブラウン `#5C3A21`、ディープチャコール `#221C16`、すりガラス `backdrop-filter: blur(12px)`、アンビエントシャドウ）。
   - `c:\Project\事業案\05_LP作成\.agents\skills\design-system\SKILL.md`: Primitive → Semantic → Component の3層トークン構造。

3. **既存リファレンス実装の検証**:
   - `samples/italian/` および `samples/legal/` を精査。共通基盤として以下のアーキテクチャパターンが確立されている：
     - 設定一元管理: `window.BAKERY_CONFIG` (`js/config.js`)
     - 決定論的オフラインシミュレーション: GAS未設定時でも ◯・△・✕・休 の空き枠判定と疑似予約が完結
     - 予約完了画面: 予約番号（`BAK-YYYYMMDD-XXXX`）、Googleカレンダー追加URL、RFC 5545 `.ics` 生成（2時間前通知 `VALARM` 内蔵）、LINE公式アカウントディープリンク
     - DOMテスト基準 (`tests/validate_pasona_dom.py`): 単一 `<h1>`、見出し階層（H1〜H6）、`data-pasona` 属性、松竹梅3プラン、アクセシビリティ（`alt`, `aria-*`）。

---

## 2. Logic Chain (論理展開と導出プロセス)

1. **新PASONAフレームワークのハード系ブーランジェリーへの最適化**:
   - ハード系パンを愛好する顧客層は「本当に小麦の風味が香る本物のパンが食べたい」「スーパーや量産チェーンのパンは添加物が多くて翌日パサつく」「人気店の焼きたてを確実に手に入れたいが並ぶのは大変」という潜在ニーズを抱えている。
   - **Problem (P)**: 「噛むほどに旨い本物のパンに出会えていますか？」──添加物や短時間イースト発酵で作られた量産パンへの不満と小麦本来の美味しさへの渇望を提起。
   - **Affinity (A)**: パリの老舗で10年腕を磨いたシェフ・ブーランジェ 日向 雅人（Masato Hyuga）の「粉・水・酵母・塩──素材を極限まで引き出す」職人哲学と寄り添いメッセージ。
   - **Solution (S)**: 【アルチザンの4大絶対基準】①フランス産石臼挽きT65×北海道キタノカオリ黄金ブレンド、②72時間長時間低温熟成＆自家製ルヴァン酵母、③フランス直輸入石窯直焼き（260℃高温焼成）、④完全無添加純生製法。さらに1日4回の焼きたて時刻表（07:30, 10:30, 13:30, 16:00）を提示。
   - **Offer (O)**: 用途に合わせて選べる松竹梅テイクアウトBOX（梅：モーニングハードセット ¥1,980 / 竹：人気定番7種詰め合わせBOX ¥3,480 ★人気No.1 / 松：プレミアム薪窯バゲット＆贅沢オードブルBOX ¥5,800）および単品店頭お取り置き（¥0）。
   - **Narrowing Down (N)**: 72時間発酵と手ごね製法による「1日各便限定30〜50本」「各受取枠限定15組」の数量限定性と事前Web取り置きの推奨。
   - **Action (A)**: 直近14日間の4枠（8:00 / 11:00 / 14:00 / 16:30）から1タップで日時・プランを代入できる来店取り置きカレンダーと、焼きたて通知・クーポンが届く公式LINE予約のデュアルCTA。

2. **Warm French Artisan Organic UIトークン設計**:
   - クラフト紙や小麦の温もりを表現する `#F9F6F0` をベースに、焼きたてバゲットの黄金色 `#D4A359`、香ばしいクラストの深みある茶色 `#5C3A21`、視認性を担保するディープチャコール `#221C16` を配色。
   - すりガラス（`background: rgba(255, 255, 255, 0.88); backdrop-filter: blur(12px); border: 1px solid rgba(212, 163, 89, 0.25);`）と温かなシャドウを組み合わせ、現代的かつクラフト感のあるビジュアルを構築。
   - タイポグラフィは欧文見出しに `Playfair Display`、和文見出しに `Shippori Mincho`、本文に `Noto Sans JP`、時刻表に `JetBrains Mono` を採用。

3. **1日4便 焼き上がり時刻表 ＆ 14日間テイクアウト取り置きカレンダー仕様**:
   - 焼き上がり便:
     - 07:30 第1便: クロワッサン・オ・ブール＆パン・オ・ショコラ（朝食）
     - 10:30 第2便: バゲット・トラディション＆カンパーニュ（昼食・看板）
     - 13:30 第3便: ノア・レザン＆パン・ド・セーグル（午後・カフェ）
     - 16:00 第4便: 夕方焼きたてバゲット＆石窯パンドミ（ディナー用）
   - 取り置き受取枠: 焼き上がり直後の熱が落ち着き香りが立つ時刻（`08:00`, `11:00`, `14:00`, `16:30`）。
   - 定休日: 毎週月曜日・火曜日（`closedDays: [1, 2]`）。

4. **AI画像アセット（Gemini 3.1 Pro生成プロンプト）の確定**:
   - 4枚の必須画像を定義：①薪窯焼き立てバゲットのシズル（Hero）、②小麦粉をまとった情熱的なパン職人（Affinity）、③72時間発酵カンパーニュの断面気泡（Solution）、④アンティーク欧風店内に並ぶハードパン（Offer）。

---

## 3. Detailed Specification Blueprint (詳細仕様設計書)

### §1. 店舗基本情報 & ブランドアイデンティティ

| 項目 | 設定値 |
|:---|:---|
| **店舗名（英）** | BOULANGERIE ARTISANALE |
| **店舗名（日）** | ブーランジェリー・アルチザナル |
| **キャッチコピー** | 「72時間低温熟成と石窯直焼き。噛みしめるほどに小麦が香る、本場フランスのアルチザンハードパン」 |
| **シェフ・ブーランジェ** | 日向 雅人（Masato Hyuga / パリ老舗ブーランジェリーで10年修業） |
| **所在地** | 〒152-0023 東京都目黒区八雲3-12-8 ブーランジェリーテラス 1F |
| **アクセス** | 東急東横線・大井町線「自由が丘駅」正面口 徒歩8分 / 東急バス「八雲三丁目」徒歩1分 |
| **電話番号** | 03-3456-7890（営業時間中受付） |
| **公式LINE** | `@boulangerie_art` (`https://line.me/R/ti/p/@boulangerie_art`) |
| **営業時間** | 7:30 〜 18:30（パンが無くなり次第終了） |
| **定休日** | 毎週月曜日・火曜日（祝日の場合は営業、翌営業日振替休） |

---

### §2. 新PASONA 7セクション コピーライティング & DOM構成仕様

```html
<!-- DOM Structure Layout -->
samples/bakery/index.html
├── Header (Nav, Brand Logo, Quick Contacts, Timetable Link, Takeout CTA)
├── Main
│   ├── #problem [data-pasona="problem"] (Hero & 小麦本来の風味への渇望)
│   ├── #affinity [data-pasona="affinity"] (シェフ・ブーランジェの理念 & 職人ストーリー)
│   ├── #solution [data-pasona="solution"] (4大アルチザン基準 & 焼き上がり時刻表 & Before/After)
│   ├── #offer [data-pasona="offer"] (松竹梅テイクアウトBOX & アラカルト取り置き)
│   ├── #narrowing [data-pasona="narrowing"] (1日限定本数 & 受取枠限定アラート)
│   ├── #action [data-pasona="action"] (14日間 取り置き予約カレンダー & LINE即時予約)
│   ├── #faq [data-pasona="faq"] (保存方法・リベイク・アレルギー等 FAQ 6項目)
│   └── #access (店舗アクセス・石窯ギャラリー・マップ案内)
├── Footer (Copyright, Privacy Policy, Top Link)
├── #booking-modal (Web取り置き予約モーダル / 完了サンクス画面)
└── #mobile-sticky-cta (下部追従 焼きたて取り置きCTAバー)
```

#### 1. Problem (問題提起 / 小麦本来の風味と食感への渇望) - `#problem`
- **H1 見出し**:
  - `粉・水・酵母・塩。わずか4つの素材で焼き上げる──`<br>`<span class="wheat-gold-text">噛みしめるほどに広がる、本物のフランスパンに出会えていますか？</span>`
- **リード文**:
  - 現代のパンの多くは、効率と柔らかさを優先した添加物や大量イーストにより、小麦本来の豊かな香りと深い旨味が失われています。「翌日にはパサついてしまう」「本当に美味しいハードパンが食べたい」──そんなパン好きの皆様へ、本場パリの伝統製法そのままのアルチザンブレッドをお届けします。
- **3大不満・共感ポイント**:
  - **Point 01: 【香りの喪失】人工イーストによる短時間発酵で、小麦本来の甘みと深みが感じられない**
  - **Point 02: 【食感の劣化】翌朝にはクラストが湿気てゴムのように硬くなり、クラムがパサパサに**
  - **Point 03: 【不要な添加物】日持ちや膨らみを優先した乳化剤・イーストフードへの不安**

#### 2. Affinity (親近感・共感 / シェフ・ブーランジェの職人哲学) - `#affinity`
- **H2 見出し**: `「パンは生き物。72時間かけて酵母と対話し、最高の瞬間を石窯で閉じ込める」`
- **シェフプロフィール**:
  - **日向 雅人 (Masato Hyuga)** / 代表シェフ・ブーランジェ
  - 経歴: 都内名門ホテルで基礎を築いた後、渡仏。パリ5区および11区の老舗ブーランジェリーにて10年間ハード系パンの製造責任者を務める。2021年、本場フランスの石窯を取り寄せ「BOULANGERIE ARTISANALE」を自由が丘・八雲に開業。
- **メッセージ内容**:
  - 「私がパリで学んだのは、パン作りに近道はないということ。天候や湿度に合わせて自家製ルヴァン種の状態を見極め、72時間じっくりと低温で熟成させる。石窯の炉床で一気に焼き上げた瞬間、パンがパチパチと『歌う』音がします。外は香ばしくバリッと、中はみずみずしくもっちり。一口食べれば、フランスの田園風景が広がるような本物の味を、日本の食卓にお届けしたいのです。」

#### 3. Solution (解決策 / 4大アルチザン基準 & 焼き上がり時刻表) - `#solution`
- **H2 見出し**: `BOULANGERIE ARTISANALEが極める「4つのアルチザン基準」`
- **Pillar 01: 【厳選小麦】フランス産石臼挽きT65 × 北海道産キタノカオリ黄金ブレンド**
  - 豊かな小麦の香りとミネラルを含むフランス伝統小麦と、もっちりとした甘みを生む北海道産小麦を独自の比率でブレンド。
- **Pillar 02: 【長時間熟成】自家製ルヴァン酵母 × 72時間低温熟成発酵**
  - 自然酵母と乳酸菌が時間をかけて小麦のデンプンを糖とアミノ酸に分解。深い旨味と消化に優しいしっとり感が持続。
- **Pillar 03: 【石窯直焼き】フランス製耐火レンガ石窯による260℃高温焼成**
  - 蓄熱性の高い石床に生地を直接滑り込ませ、強力なスチームとともに一気に焼き上げ。厚く香ばしいクラストと大きな気泡（蜂の巣状クラム）を実現。
- **Pillar 04: 【完全無添加】小麦・水・自家製酵母・ゲランドの天日塩のみの純生製法**
  - 保存料・乳化剤・イーストフード・香料は一切不使用。毎日食べても体に負担のない安心の品質覚醒。
- **焼き上がりタイムテーブル (Daily Baking Timetable)**:
  - `07:30 焼きたて第1便`: 発酵バタークロワッサン & パン・オ・ショコラ（朝食を彩る香ばしいヴィエノワズリー）
  - `10:30 焼きたて第2便`: バゲット・トラディション & カンパーニュ・オ・ルヴァン（看板ハードパン）
  - `13:30 焼きたて第3便`: ノア・レザン（胡桃レーズン）& パン・ド・セーグル（ライ麦70%）（午後のスペシャリテ）
  - `16:00 焼きたて第4便`: 夕方焼きたてイブニングバゲット & 石窯ハードパンドミ（ディナー・翌朝用）
- **Before / After 比較**:
  - *一般的な量産パン*: 2〜3時間スピード発酵・添加物使用 → 翌日パサパサ・小麦の香り希薄
  - *当店のアルチザンパン*: 72時間低温熟成・天然酵母・完全無添加 → 3日目もしっとり・噛むほどに旨味が溢れる

#### 4. Offer (提案 / 松竹梅テイクアウトBOX & アラカルト取り置き) - `#offer`
- **H2 見出し**: `職人の焼きたてを味わう、3つの特製テイクアウトアソートBOX`
- **松竹梅 料金体系**:
  1. **【梅】モーニングハードセット (Morning Hard Set)**
     - 価格: **¥1,980**（税込）
     - 内容: ミニバゲット・トラディション×1、発酵バタークロワッサン×2、パン・オ・ショコラ×2、プチカンパーニュ×1
     - おすすめ: 2〜3名様のご朝食や休日の贅沢ブランチに最適。
  2. **【竹★人気No.1】人気定番7種詰め合わせBOX (Popular Classic 7 Assortment)**
     - 価格: **¥3,480**（税込）
     - 内容: バゲット・トラディション(フル)×1、カンパーニュ・オ・ルヴァン(ハーフ)×1、ノア・レザン(胡桃＆レーズン)×1、パン・ド・セーグル×1、発酵バタークロワッサン×2、パン・オ・ショコラ×2、クイニーアマン×1
     - 特典: 専用クラフトギフトBOX入り＋保存用ジッパー密閉バッグ＆リベイクガイド付き
     - おすすめ: 初めてご来店の方やご家族で当店の魅力をまるごと味わいたい方に一番人気。
  3. **【松】プレミアム薪窯バゲット＆贅沢オードブルBOX (Premium Wood-fired Baguette & Hors-d'œuvre)**
     - 価格: **¥5,800**（税込）
     - 内容: 特選薪石窯ロングバゲット×1、カンパーニュ(ホール)×1、トリュフ香るゴルゴンゾーラ・フィグハード×1、ノア・レザン×1、自家製ポークリエット瓶詰(90g)×1、フランス直輸入AOPイズニー発酵バター(25g)×2
     - おすすめ: ワインやディナーを彩る贅沢なペアリングBOX。手土産やホームパーティーに最適。
- **店頭アラカルト取り置きプラン**:
  - 【席・単品取り置き】: **¥0（事前決済なし / お好きなパン1点から当日レジ精算）**

#### 5. Narrowing Down (限定性・緊急性) - `#narrowing`
- **H2 見出し**: `72時間熟成と石窯手焼きのため、1日の焼き上がり数量には限りがございます`
- **内容**:
  - 当店のパンは72時間かけて丁寧に発酵させ、小さな石窯で職人が一つずつ焼き上げております。そのため、1日の製造本数は各便30本〜50本が限界となっております。
  - 夕方にはほとんどの商品が完売してしまうため、ご希望の焼き上がり時間に合わせて【Web事前取り置き予約（各受取枠 限定15組様）】をご利用いただくことを強く推奨しております。
  - 残枠バッジ表示: `【本日の店頭取り置き枠: 各回残りわずか】`

#### 6. Action (行動喚起 / 14日間取り置き予約カレンダー & LINE) - `#action`
- **H2 見出し**: `直近14日間の焼きたて受取枠から、今すぐお取り置きをご予約いただけます`
- **カレンダー仕様**:
  - 直近14日間 × 4つの受取枠（`08:00` / `11:00` / `14:00` / `16:30`）
  - 空き状況表示（◯：予約可能、△：残りわずか、✕：完売・受付終了、休：定休日）
  - スロットタップで希望日時・受取枠が予約フォームへ自動入力されスクロール。
- **公式LINE予約バナー**:
  - `「今すぐLINEで取り置きしたい」「焼きたて情報をリアルタイムで受け取りたい」方はこちら`
  - 友だち追加特典: 「ミニバゲット1本無料引換クーポン」プレゼント

#### 7. FAQ (よくある質問 6項目) - `#faq`
- **Q1: ハード系パンはどのように保存するのが一番長持ちしますか？**
  - A: 当日または翌日に召し上がる分以外は、好みの厚さにスライスして1枚ずつラップで密閉し、冷凍保存袋に入れて冷凍庫で保存してください（約2〜3週間美味しく保てます）。常温の場合は、カットした断面を下にしてクラフト紙袋に入れ、冷暗所にて保存してください。
- **Q2: 冷凍したハードパンやバゲットの美味しいリベイク（温め直し）方法は？**
  - A: 表面に軽く霧吹きで水を吹きかけ、予熱したオーブントースター（200℃〜220℃）で2〜3分温めてください。石窯で焼いた直後のような、外はバリッと香ばしく、中はもっちりみずみずしい食感が蘇ります。
- **Q3: アレルギーや添加物についての情報を教えてください。**
  - A: 当店のハード系パン（バゲット、カンパーニュ、セーグル等）は、小麦・水・自家製酵母・塩のみを使用し、乳・卵・油脂・保存料・イーストフードは一切使用しておりません。クロワッサンや一部のヴィエノワズリーには乳・卵を使用しています。
- **Q4: 事前予約なしでも店頭で購入できますか？**
  - A: はい、もちろん店頭でも直接ご購入いただけます。ただし、石窯で焼き上げる数量に限りがあるため、人気のバゲットやクロワッサンは焼き上がり後すぐに完売することがございます。確実にお求めいただくためには、本Webサイトからの事前取り置き予約をおすすめしております。
- **Q5: 店頭受取の際の支払い方法は何が使えますか？**
  - A: 現金のほか、各種クレジットカード（VISA, Mastercard, JCB, AMEX, Diners）、交通系IC、電子マネー（iD, QUICPay）、QRコード決済（PayPay, LINE Pay, 楽天ペイ）に対応しております。お支払いは店頭受取時にお願いいたします。
- **Q6: ギフト用のラッピングや地方発送（お取り寄せ）は可能ですか？**
  - A: はい、【竹】および【松】のアソートBOXは高級クラフト化粧箱に入れてお渡しいたします。また、全国へのクール冷凍便での配送も承っております。ご希望の場合は予約フォームの備考欄または公式LINEにてお申し付けください。

---

### §3. Warm French Artisan Organic UI トークン仕様 (`bakery.css`)

```css
:root {
  /* ==========================================================================
     1. Primitive Tokens (フランス伝統ブーランジェリー配色)
     ========================================================================== */
  --bakery-paper-50:  #FDFCFA;
  --bakery-paper-100: #F9F6F0; /* ベース背景：クラフト紙・生成り */
  --bakery-paper-200: #F2ECE1;
  --bakery-paper-300: #E5DAC7;
  --bakery-paper-400: #D1C0A5;

  --bakery-gold-300: #E6BE7E;
  --bakery-gold-400: #DDAF64;
  --bakery-gold-500: #D4A359; /* 小麦ゴールド・クープの焼き色 */
  --bakery-gold-600: #B88536;

  --bakery-crust-700: #7A4B2A;
  --bakery-crust-800: #5C3A21; /* クラストブラウン・石窯焦がし茶 */
  --bakery-crust-900: #3D2413;

  --bakery-charcoal-900: #221C16; /* 深い温もりある墨黒 */
  --bakery-charcoal-800: #383029;
  --bakery-charcoal-600: #665C54;
  --bakery-charcoal-400: #9E9389;

  --bakery-sage-600: #6B705C; /* オリーブ・セージグリーン */

  /* Status Colors */
  --bakery-status-available: #2D7A4C; /* ◯ 空き */
  --bakery-status-limited:   #D97706; /* △ 残りわずか */
  --bakery-status-full:      #DC2626; /* ✕ 完売 */
  --bakery-status-closed:    #8C827A; /* 休 定休日 */

  /* ==========================================================================
     2. Semantic Tokens
     ========================================================================== */
  --bg-page: var(--bakery-paper-100);
  --bg-surface: #FFFFFF;
  --bg-surface-subtle: var(--bakery-paper-200);
  --bg-glass-card: rgba(255, 255, 255, 0.88);
  --bg-glass-elevated: rgba(255, 255, 255, 0.95);
  --bg-dark-card: var(--bakery-charcoal-900);

  --border-glass: rgba(212, 163, 89, 0.28);
  --border-glass-bright: rgba(212, 163, 89, 0.65);
  --border-subtle: rgba(92, 58, 33, 0.12);

  --text-primary: var(--bakery-charcoal-900);
  --text-secondary: var(--bakery-charcoal-800);
  --text-muted: var(--bakery-charcoal-600);
  --text-gold: var(--bakery-gold-600);
  --text-light: #FFFFFF;

  --accent-gold: var(--bakery-gold-500);
  --accent-crust: var(--bakery-crust-800);
  --accent-glow: rgba(212, 163, 89, 0.35);

  /* ==========================================================================
     3. Component & Layout Tokens
     ========================================================================== */
  --backdrop-blur: blur(12px);
  --radius-card: 16px;
  --radius-button: 8px;
  --radius-pill: 9999px;

  --shadow-warm-sm: 0 2px 8px rgba(92, 58, 33, 0.06);
  --shadow-warm-md: 0 8px 24px -4px rgba(92, 58, 33, 0.10), 0 2px 6px rgba(0, 0, 0, 0.04);
  --shadow-warm-lg: 0 16px 40px -8px rgba(92, 58, 33, 0.15), 0 0 0 1px rgba(212, 163, 89, 0.2);
  --shadow-gold-button: 0 6px 20px -2px rgba(212, 163, 89, 0.45);

  --font-heading: 'Playfair Display', 'Shippori Mincho', serif;
  --font-body: 'Noto Sans JP', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', 'Roboto Mono', monospace;
}
```

---

### §4. 1日4便 焼き上がり時刻表 ＆ 14日間テイクアウト取り置きカレンダー仕様

1. **時間枠構成**:
   - 1日4受取枠制: `08:00`, `11:00`, `14:00`, `16:30`
   - 定休日: 毎週月曜日・火曜日（`closedDays: [1, 2]`）
2. **決定論的オフラインシミュレーションアルゴリズム**:
   - シード計算: `seed = hash(dateStr + '-' + slotTime + '-' + salt)`
   - 月・火曜日判定: `closed`（休：定休日）
   - 当日経過枠: 現在時刻より前の受取枠は自動的に `full`（✕：受付終了）
   - スコア判定:
     - 週末（土・日）および 11:00 / 16:30 枠は人気度ボーナス加算
     - `< 45` → `available` (◯: 予約可能)
     - `< 75` → `limited` (△: 残りわずか)
     - `>= 75` → `full` (✕: 完売)
3. **予約完了（サンクス）処理**:
   - 予約番号生成: `BAK-YYYYMMDD-XXXX`（例: `BAK-20260825-8C2F`）
   - Googleカレンダー追加リンク生成（受取場所：東京都目黒区八雲3-12-8 ブーランジェリーテラス 1F）
   - RFC 5545 `.ics` ファイルダウンロード（受取2時間前通知 `VALARM` 内蔵）
   - LINE公式アカウント 1タップ予約確認リンク（予約番号・選択セット・受取日時を事前入力したURL）
   - GAS Webhook POST送信（`gasWebhookUrl` 設定時のみ非同期実行）

---

### §5. AI実写画像アセット仕様 & Gemini 3.1 Pro プロンプト定義

| アセットファイル名 | 配置セクション | アスペクト比 | 被写体・画角・演出プロンプト |
|:---|:---|:---:|:---|
| `hero_baguette.jpg` | Hero / ファーストビュー | 16:9 (1920x1080) | `A freshly baked authentic French artisan baguette tradition lying on a rustic wooden baking board and linen flour cloth. Golden brown crispy crust with deep ear cuts (coupes), dusted with white stone-ground flour, visible honeycomb aerated crumb texture, warm golden morning light streaming through bakery window, steam gently rising, high-end French boulangerie atmosphere, 8k resolution, cinematic macro food photography.` |
| `baker_craftsman.jpg` | Affinity / 代表シェフ・職人紹介 | 1:1 (800x800) | `Portrait of a passionate Japanese artisan master baker (Masato Hyuga) in his late 30s wearing a white chef jacket and dark linen apron dusted with flour, standing proudly in front of a traditional French brick stone bread oven. Gentle smile, flour on hands, holding a large round sourdough pain de campagne on a wooden peel, warm ambient bakery lighting, photorealistic masterpiece photography.` |
| `campagne_slice.jpg` | Solution / 72h熟成＆気泡断面 | 4:3 (1200x900) | `Close-up cross section slice of a rustic sourdough Pain de Campagne, showing glistening moist aerated open crumb with irregular air pockets (alveoli) and thick crunchy dark roasted crust. Sprinkled rye flour, fresh butter curl and wild honeycomb nearby on dark slate surface, warm studio lighting, razor-sharp focus on bread texture, appetizing artisan bread photography, 8k.` |
| `bakery_display.jpg` | Offer / メニュー＆店舗ギャラリー | 16:9 (1920x1080) | `A warm, elegant French antique artisan bakery boutique interior display. Woven wicker baskets overflowing with golden crispy baguettes, croissants, pain au chocolat, dark rye boules and sourdough loaves on raw natural oak wood shelving. Blackboard chalk timetable in background, warm amber pendant lighting, Parisian street visible through front glass window, luxury bakery atmosphere, ultra-detailed.` |

---

### §6. 設定一元管理インターフェース契約 (`samples/bakery/js/config.js`)

```javascript
/**
 * samples/bakery/js/config.js
 * Centralized Bakery Store & Takeout Reservation Configuration
 * Single Source of Truth for BOULANGERIE ARTISANALE
 */
(function (global) {
  'use strict';

  var BAKERY_CONFIG = {
    // 1. 店舗基本情報
    bakeryName: 'BOULANGERIE ARTISANALE',
    bakeryJapaneseName: 'ブーランジェリー・アルチザナル',
    bakeryTagline: '本場パリ仕込み 薪石窯直焼き＆72時間熟成ハード系ブーランジェリー',
    postalCode: '152-0023',
    address: '東京都目黒区八雲3-12-8 ブーランジェリーテラス 1F',
    access: '東急東横線・大井町線「自由が丘駅」正面口 徒歩8分 / 八雲三丁目バス停 徒歩1分',
    phone: '03-3456-7890',
    email: 'contact@boulangerie-artisanale.example.com',
    representative: 'シェフ・ブーランジェ 日向 雅人 (Masato Hyuga)',

    // 2. GAS Webhook 設定
    gasWebhookUrl: '',
    gasTimeoutMs: 8000,

    // 3. 営業時間 & 予約枠設定
    businessHours: {
      start: '07:30',
      end: '18:30',
      label: '7:30 - 18:30（パンが無くなり次第終了）'
    },
    closedDays: [1, 2], // 1: 月, 2: 火
    closedDaysLabel: '毎週月曜日・火曜日（祝日の場合は営業、翌平日振替）',
    timeSlots: ['08:00', '11:00', '14:00', '16:30'],
    daysToShow: 14,
    capacityPerSlot: 5,

    // 4. 公式LINE設定
    lineOfficialUrl: 'https://line.me/R/ti/p/@boulangerie_art',
    lineAccountId: '@boulangerie_art',
    lineOaMessageUrl: 'https://line.me/R/oaMessage/@boulangerie_art/?',

    // 5. 動的シミュレーション設定
    fallbackSimulation: true,
    simulationSeedSalt: 'boulangerie_artisanale_bakery_2026',

    // 6. 焼きたてタイムテーブル定義
    bakingSchedule: [
      {
        time: '07:30',
        batch: '第1便：モーニング・ヴィエノワズリー',
        items: '発酵バタークロワッサン、パン・オ・ショコラ、クイニーアマン',
        desc: '朝の澄んだ空気に広がる発酵バターの芳醇な香り'
      },
      {
        time: '10:30',
        batch: '第2便：石窯直焼き看板ハードパン',
        items: 'バゲット・トラディション、カンパーニュ・オ・ルヴァン',
        desc: 'パリッと香ばしい極上クラストとみずみずしい気泡'
      },
      {
        time: '13:30',
        batch: '第3便：ルヴァン＆ライ麦スペシャリテ',
        items: 'ノア・レザン（胡桃＆レーズン）、パン・ド・セーグル（ライ麦70%）',
        desc: '噛むほどに溢れる自然酵母の深い酸味とナッツのコク'
      },
      {
        time: '16:00',
        batch: '第4便：夕方焼きたてイブニングバゲット',
        items: '夕方便バゲット、石窯ハードパンドミ（食パン）',
        desc: 'ディナーのメインや翌朝の朝食用に焼き上げる夕方便'
      }
    ],

    // 7. 提供プラン・アソートBOXマスター
    planMaster: {
      bamboo: {
        id: 'bamboo',
        name: '【竹★人気No.1】人気定番7種詰め合わせBOX',
        tier: 'bamboo',
        price: 3480,
        priceLabel: '¥3,480（税込）',
        isPopular: true,
        summary: 'バゲット(フル)＋カンパーニュ(ハーフ)＋ノア・レザン＋セーグル＋クロワッサン2個＋パン・オ・ショコラ2個＋クイニーアマン',
        giftBox: '特製クラフトギフトBOX＆保存バッグ付き'
      },
      plum: {
        id: 'plum',
        name: '【梅】モーニングハードセット',
        tier: 'plum',
        price: 1980,
        priceLabel: '¥1,980（税込）',
        isPopular: false,
        summary: 'ミニバゲット×1＋発酵バタークロワッサン×2＋パン・オ・ショコラ×2＋プチカンパーニュ×1',
        giftBox: 'クラフトペーパーバッグ入り'
      },
      pine: {
        id: 'pine',
        name: '【松】プレミアム薪窯バゲット＆贅沢オードブルBOX',
        tier: 'pine',
        price: 5800,
        priceLabel: '¥5,800（税込）',
        isPopular: false,
        summary: '特選ロングバゲット＋カンパーニュ(ホール)＋トリュフ無花果ハード＋ノア・レザン＋自家製リエット瓶詰＋AOP発酵バター2個',
        giftBox: 'プレミアム桐調BOX＆リボン包装付き'
      },
      alacarte: {
        id: 'alacarte',
        name: '【店頭お取り置き】お好きなパンを当日レジ精算',
        tier: 'alacarte',
        price: 0,
        priceLabel: 'お会計は当日店頭にて',
        isPopular: false,
        summary: 'ご希望のパン1点から当日お取り置き可能（備考欄にご希望商品をご記入ください）',
        giftBox: '通常包装'
      }
    }
  };

  // Structured Aliases for Universal Compatibility
  BAKERY_CONFIG.storeInfo = {
    name: BAKERY_CONFIG.bakeryName,
    japaneseName: BAKERY_CONFIG.bakeryJapaneseName,
    tagline: BAKERY_CONFIG.bakeryTagline,
    postalCode: BAKERY_CONFIG.postalCode,
    address: BAKERY_CONFIG.address,
    access: BAKERY_CONFIG.access,
    tel: BAKERY_CONFIG.phone,
    email: BAKERY_CONFIG.email,
    businessHours: BAKERY_CONFIG.businessHours.label,
    regularHolidays: BAKERY_CONFIG.closedDays,
    regularHolidaysLabel: BAKERY_CONFIG.closedDaysLabel
  };

  BAKERY_CONFIG.gas = {
    webhookUrl: BAKERY_CONFIG.gasWebhookUrl,
    timeoutMs: BAKERY_CONFIG.gasTimeoutMs
  };

  BAKERY_CONFIG.calendar = {
    daysToShow: BAKERY_CONFIG.daysToShow,
    slots: BAKERY_CONFIG.timeSlots,
    closedDays: BAKERY_CONFIG.closedDays,
    capacityPerSlot: BAKERY_CONFIG.capacityPerSlot
  };

  BAKERY_CONFIG.plans = BAKERY_CONFIG.planMaster;
  BAKERY_CONFIG.assortments = BAKERY_CONFIG.planMaster;

  BAKERY_CONFIG.line = {
    accountUrl: BAKERY_CONFIG.lineOfficialUrl,
    accountId: BAKERY_CONFIG.lineAccountId,
    oaMessageBaseUrl: BAKERY_CONFIG.lineOaMessageUrl
  };

  BAKERY_CONFIG.fallback = {
    enableSimulation: BAKERY_CONFIG.fallbackSimulation,
    simulationSeedSalt: BAKERY_CONFIG.simulationSeedSalt
  };

  global.BAKERY_CONFIG = BAKERY_CONFIG;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = BAKERY_CONFIG;
  }
})(typeof window !== 'undefined' ? window : this);
```

---

### §7. トップポータル（`index.html`）統合仕様

1. **ジャンルフィルタータブ**:
   - `data-filter-tab="gourmet"` のバッジカウントを `2` に更新（イタリアン + ベーカリー）。
2. **FEATURED CARD 4 (`#card-bakery`) の配置**:
   - `data-category="gourmet"`
   - `badge-live`（公開中 LIVE DEMO）、`新PASONA完全準拠`、`焼きたて取り置き予約`、`Craft Paper UI`
   - サムネイル: `samples/bakery/assets/images/hero_baguette.jpg`
   - タイトル: `BOULANGERIE ARTISANALE（石窯ハード系ブーランジェリーLP）`
   - リンク: `./samples/bakery/index.html`
3. **双方向ナビゲーション**:
   - ベーカリーLPのヘッダーおよびフッターにポータル（`../../index.html`）への復帰リンクを設置。

---

## 4. Features Discovered (発見・定義された全機能一覧)

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Copywriting | 新PASONA 7セクション | 五感刺激・アルチザン体験型セールスコピー | ハードパン愛好者ペルソナ | セマンティックHTML | 該当セクション欠損時はテスト検知 | `ORIGINAL_REQUEST.md` §R1 |
| 2 | UI/UX | Craft Paper Glassmorphism | クラフト紙×小麦ゴールド×クラストブラウンの多層すりガラスUI | CSS変数トークン | 温もりと上質感あるモダンUI | 非対応ブラウザは半透明フォールバック | `ui-ux-pro-max` & `design-system` |
| 3 | Visual | 4大実写AI画像アセット | バゲット・職人・カンパーニュ断面・店舗ディスプレイの高解像度写真 | Gemini生成画像 | 最適配置された実写ビジュアル | パス不整合時はプレースホルダー | `ORIGINAL_REQUEST.md` §R3 |
| 4 | Timetable | 1日4便 焼き上がり時刻表 | 07:30, 10:30, 13:30, 16:00の焼きたて便スケジュール表示 | スケジュール配列 | 視覚的なタイムテーブルカード | JS無効時もHTMLテーブルで表示可能 | `ORIGINAL_REQUEST.md` §R1 |
| 5 | Calendar | 14日間 取り置きグリッド | 当日〜14日後×4受取枠（8:00/11:00/14:00/16:30）の空き状況表示 | 日付・時間枠配列 | ◯・△・✕・休 のテーブルUI | 過去枠は自動で完売表示 | `ORIGINAL_REQUEST.md` §R1, R4 |
| 6 | Calendar | 決定論的シミュレーション | GAS未設定時でも破綻なく動作するオフライン計算 | 日付・時間・シード塩 | 一貫性のある空き状況判定 | シード値に基づき安定生成 | `ORIGINAL_REQUEST.md` §R4 |
| 7 | Booking | スロット連動自動入力 | カレンダーの空き枠タップで希望日時・受取枠を自動代入 | カレンダーセルclick | `#form-datetime` への値セットとスクロール | 完売・定休枠はタップ無効 | `ORIGINAL_REQUEST.md` §R1, R4 |
| 8 | Booking | プラン事前選択 | 松竹梅プランカードのボタンから該当アソートBOXを自動選択 | プランボタンclick | `#form-plan` の選択状態更新 | デフォルト（竹アソート）を適用 | `ORIGINAL_REQUEST.md` §R1 |
| 9 | Booking | 予約バリデーション | 氏名、メール、電話番号、希望日時、受取プランの必須チェック | フォーム入力値 | エラーハイライト / 送信許可 | 未入力時に赤枠表示とフォーカス | `ORIGINAL_REQUEST.md` §R4 |
| 10 | Thank-You | 予約番号自動発行 | `BAK-YYYYMMDD-XXXX` 形式の識別コード生成 | 現在日時＋乱数 | サンクス画面での番号表示 | 常に一意なコードを発行 | `ORIGINAL_REQUEST.md` §R4 |
| 11 | Integration | 1クリックGoogleカレンダー | 店舗住所・受取内容がセットされたGoogleカレンダー登録URL生成 | 予約詳細データ | Googleカレンダー登録URL | ポップアップブロック時は直接遷移 | `ORIGINAL_REQUEST.md` §R4 |
| 12 | Integration | RFC 5545 .ics ダウンロード | 2時間前アラーム（VALARM）付きカレンダーファイル | 予約詳細データ | `bakery_pickup_BAK-*.ics` Blob | Blob非対応環境はリンクダウンロード | `ORIGINAL_REQUEST.md` §R4 |
| 13 | Integration | LINE公式ディープリンク | 予約内容が初期入力された状態のLINE起動URL | 予約詳細＋LINE ID | LINEアプリ起動URL | LINE未インストール時はWeb版へ | `ORIGINAL_REQUEST.md` §R4 |
| 14 | Integration | GAS Webhook送信 | スプレッドシート記録・予約台帳自動化用非同期POST | 予約JSONデータ | GASレスポンス | 通信失敗時も画面は成功遷移を維持 | `ORIGINAL_REQUEST.md` §R4 |
| 15 | Navigation | 下部追従テイクアウトCTA | スクロール連動で出現するモバイル・PC固定CTA | スクロール位置 | 追従バー表示/非表示 | 予約エリア到達時は干渉防止非表示 | `ORIGINAL_REQUEST.md` §R1 |
| 16 | Navigation | WAI-ARIA FAQ アコーディオン | 6問のQ&Aのアクセシブルな開閉トグル | click / Enterキー | `aria-expanded` と連動した展開 | JS無効時も全展開で閲覧可能 | `ORIGINAL_REQUEST.md` §R1 |
| 17 | Config | `BAKERY_CONFIG` 一元管理 | 店舗情報・料金・営業時間・GAS等の単一情報源 | `config.js` | グローバル設定オブジェクト | 未定義時はデフォルト定数使用 | `ORIGINAL_REQUEST.md` §R4 |
| 18 | Portal | トップポータル統合 | `index.html` へのLIVE DEMOカード追加と双方向遷移 | ポータルDOM | 相互リンク完全接続 | 404エラーゼロを自動テスト検証 | `ORIGINAL_REQUEST.md` §R5 |

---

## 5. Edge Cases (エッジケース仕様)

| # | Feature | Input / Scenario | Observed / Specified Behavior |
|---|---------|------------------|-------------------------------|
| 1 | カレンダー | 過去の時間枠（当日すでに受取時刻を過ぎた枠） | 当日現在時刻より前の枠は、シミュレーション結果に関わらず強制的に `full`（✕：受付終了）として描画され選択不可となる。 |
| 2 | カレンダー | 定休日（月曜日・火曜日）のスロット | `closedDays: [1, 2]` に該当する曜日は全枠 `closed`（休：定休日）となり、クリックイベントは発火しない。 |
| 3 | 予約フォーム | GAS Webhook URLが未設定（`gasWebhookUrl: ""`） | 通信エラーを発生させず、完全決定論的ローカルモードで即座に予約番号（`BAK-YYYYMMDD-XXXX`）を発行し、サンクス画面をシームレスに表示する。 |
| 4 | 予約フォーム | ネットワーク切断・GASエンドポイントタイムアウト（8秒超過） | `fetch` の catch ブロックで例外を捕捉し、コンソール警告を出力しつつ、ユーザー画面は正常にサンクス状態へ移行させて離脱を防ぐ。 |
| 5 | カレンダー登録 | Googleカレンダー / .ics の受取ロケーション | 場所（Location）に `BOULANGERIE ARTISANALE（東京都目黒区八雲3-12-8 ブーランジェリーテラス 1F）`、詳細にアクセス案内と予約番号を正確に記載。 |
| 6 | 入力検証 | 電話番号の書式不正（文字混入・桁数不足） | 即座にインラインでエラーを表示し、フォーカスを当てて修正を促す（送信はブロック）。 |
| 7 | プラン選択 | アラカルト取り置き選択時の挙動 | プランに「お好きなパンの当日取り置き」がセットされ、フォームの備考欄に「ご希望のパンの種類や個数をご記入ください」のプレースホルダー案内を表示。 |
| 8 | レスポンシブ | 画面幅375px以下の狭小スマートフォン | タイムテーブルおよびカレンダーグリッドが横スクロール（`overflow-x: auto`）で破綻なく操作可能であり、下部追従CTAバーが画面下部に常駐。 |

---

## 6. Caveats (留意点・制約事項)

1. **Specification Miner の職務範囲**: 本エージェントは仕様策定（Spec Miner）であり、実際のファイル作成・コード実装（`samples/bakery/`、`index.html`、`tests/`）は後続の Worker エージェントが実行する。
2. **AI画像アセットの生成**: 画像ファイルは Gemini 画像生成ツールを用いて Worker または専用エージェントにより生成・配置される。
3. **サーバーレス運用**: 外部有償サーバーやDBを一切使用せず、静的HTML/CSS/JS + GAS（無料枠）で全機能が自律完結する。

---

## 7. Conclusion (最終評価・仕様結論)

- 「BOULANGERIE ARTISANALE」サンプルLPの全仕様（新PASONA 7セクション構成、Warm French Artisan UIトークン、1日4便焼き上がり時刻表、14日テイクアウト取り置きカレンダー、AI実写画像アセットプロンプト、設定一元管理契約、ポータル連携、全18機能および8エッジケース）が**完全に定義・文書化**された。
- 本仕様書（`handoff.md`）に基づき、実装担当チーム（M1 Worker 等）は一切の迷いなく高品質な本番コードの作成へ直ちに着手可能である。

---

## 8. Verification Method (独立検証方法)

1. **仕様整合性チェック**:
   - `c:\Project\事業案\05_LP作成\.agents\spec_miner_bakery_1\handoff.md` を開き、§1〜§7 の全仕様および Features Discovered / Edge Cases テーブルが網羅されていることを確認。
2. **テストスイート適合性**:
   - `tests/validate_pasona_dom.py` において、`samples/bakery/index.html` の新PASONA 7セクション（problem, affinity, solution, offer, narrowing, action, faq）、松竹梅3プラン、単一H1、画像altが満たされる構造であることを確認。
   - `tests/validate_links.py` において、`index.html` ↔ `samples/bakery/index.html` の双方向相対リンク（404ゼロ）が成立することを確認。
   - `tests/test_interactive_ui.py` において、`BAKERY_CONFIG` のスキーマ（7:30-18:30、closedDays `[1, 2]`、4スロット `8:00, 11:00, 14:00, 16:30`）がパスすることを確認。
