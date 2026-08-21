# Handoff Report - spec_miner_washoku_1

- **Role**: Specification Miner (Washoku Banquet Izakaya LP Copywriting, Architecture & Design System)
- **Target**: 「個室和食 旬彩 縁 -ENISHI-」特化LP (`samples/washoku/`) & トップポータル連携 (`index.html`)
- **Status**: Complete (Hard Handoff)
- **Author**: `spec_miner_washoku_1`
- **Timestamp**: 2026-08-22T07:18:00Z

---

## 1. Observation (直接観察事実)

1. **要件定義と背景**:
   - `c:\Project\事業案\05_LP作成\.agents\ORIGINAL_REQUEST.md` (Lines 133-195) において、GitHub Pages対応LPポータルの第5弾サンプルとして「忘年会・歓送迎会に使えるリーズナブルな本格和食居酒屋（個室和食 旬彩 縁 -ENISHI-）」特化LPの新規構築が指定されている。
   - 要求仕様として以下の主要要件が明示されている：
     - **R2 (和食居酒屋LP)**: 幹事悩み解決（予算・席数・個室・飲み放題）× 旬の本格和食シズル体験モデル。
       - 幹事様必見の3大安心保証（駅チカ徒歩2分、完全個室最大40名、2時間飲み放題付き税込明朗会計）。
       - 名物料理（豊洲直送鮮魚5点盛り、備長炭火焼き鳥、博多和牛もつ鍋/季節の寄せ鍋、地酒30種飲み放題）。
       - 忘年会・宴会松竹梅コース（梅：旬彩カジュアル宴会 ¥3,980 / 竹：名物鍋＆鮮魚の王道忘年会 ¥4,980 / 松：特選和牛＆極上舟盛り贅沢極みコース ¥6,500 - すべて2時間飲み放題・税込）。
       - 14日間 宴会席空き状況カレンダー（◯・△・✕・休）＆ LINE即時仮予約。
       - 藍色（インディゴネイビー `#0B1B3D` / `#071126`）× 提灯の琥珀ゴールド (`#D99B26`) × 和紙生成り (`#FAF8F5`) の和モダンGlassmorphism UI。
     - **R3 (画像アセット)**: 4枚の高解像度実写画像（`hero_banquet_nabe.jpg`, `sashimi_platter.jpg`, `yakitori_charcoal.jpg`, `washoku_private_room.jpg`）を `samples/washoku/assets/images/` に配置。
     - **R4 (設定一元化 & カレンダー連動)**: `samples/washoku/js/config.js` (`window.WASHOKU_CONFIG`) による営業時間（平日 17:00-23:30 / 土日祝 16:00-23:00）、4枠制（17:00, 18:30, 19:30, 20:30）、GAS連携/動的フォールバック、Google/Appleカレンダー(.ics)、LINE連携。
     - **R5 (ポータル統合)**: `index.html` に「忘年会・個室和食居酒屋」のLIVE DEMOカード追加、双方向ナビゲーション。
     - **R6 (テスト検証)**: 150+件の自動テスト全件パス、GitHub Pages本番反映。

2. **スキル・設計基準の観察**:
   - `c:\Project\事業案\05_LP作成\.agents\skills\lp-pasona\SKILL.md` (Lines 55-98): 飲食・店舗LPは通常「体験・魅力訴求型」とされるが、本件「宴会・忘年会特化和食居酒屋」は**「幹事のプレッシャーや失敗恐怖を解消する課題解決型（Problem-Agitation & Relief）」**のハイブリッドモデルが極めて有効。
   - `c:\Project\事業案\05_LP作成\.agents\skills\ui-ux-pro-max\SKILL.md`: Japanese Modern × Glassmorphism（深藍 `#071126` / `#0B1B3D`、提灯琥珀 `#D99B26`、和紙白 `#FAF8F5`、すりガラス `backdrop-filter: blur(16px)`、微細金箔ボーダー `rgba(217, 155, 38, 0.25)`）。
   - `c:\Project\事業案\05_LP作成\.agents\skills\design-system\SKILL.md`: トークン3層構造（Primitive → Semantic → Component）の遵守。

3. **既存リファレンス実装の検証**:
   - `samples/italian/` および `samples/legal/` の共通アーキテクチャ：
     - 設定一元管理: `window.WASHOKU_CONFIG` (`samples/washoku/js/config.js`)。
     - 決定論的オフラインシミュレーション: GAS未接続時でも日付・時間枠・シード値に基づくリアルタイム空席判定（◯・△・✕・休）。
     - 予約完了サンクス画面: 予約番号（`ENI-YYYYMMDD-XXXX`）、Googleカレンダー連携URL、RFC 5545 `.ics` 生成（2時間前VALARM付き）、LINE公式アカウントディープリンク。
     - 自動テスト基準 (`tests/validate_pasona_dom.py`, `tests/validate_links.py`, `tests/test_interactive_ui.py`): 単一 `<h1>`、見出し階層（H1〜H6）、`data-pasona` 属性、松竹梅3プラン、アクセシビリティ（`alt`, `aria-*`）、相対パス整合性（404ゼロ）。

---

## 2. Logic Chain (論理展開と導出プロセス)

1. **新PASONAフレームワークの和食宴会居酒屋への最適化**:
   - 宴会幹事（企業部署・サークル・同窓会）が直面する最大の心理的ハードルは「失敗への恐怖（予算超過での自腹、席が狭くてクレーム、個室じゃなくて会話が聞こえない、飲み放題が来ない）」である。
   - **Problem (P)**: 幹事の4大不安（①予算オーバー・追加請求、②周囲の騒音・非個室、③狭い席・荷物置き場不足、④飲み放題の提供遅延・質の低さ）を提示し、「幹事経験者の74%が店選びで後悔」というデータで強い共感と当事者意識を喚起。
   - **Affinity (A)**: 店長・統括料理長からの「幹事様を絶対に一人にさせない、恥をかかせない」という約束と、創業12年・年間1,500組の宴会実績（満足度98.2%）を提示し、安心感と信頼関係を構築。
   - **Solution (S)**: ①駅チカ徒歩2分、②最大40名掘りごたつ完全個室、③税込・2h飲み放題込みの明朗会計という「3大安心保証」と、豊洲直送鮮魚5点盛り・備長炭火焼き鳥・和牛もつ鍋・地酒30種という「4大シズル名物料理」で不安を完全払拭。Before/After比較で一般居酒屋との圧倒的差別化を明示。
   - **Offer (O)**: 予算やシーンに応じて選びやすい松竹梅3プラン（梅 ¥3,980 / 竹 ★人気No.1 ¥4,980 / 松 ¥6,500、全て2h飲み放題＆税込）を明示。
   - **Narrowing Down (N)**: 「8名様以上で幹事1名無料」などの早期予約特典と、「金・土・祝前日のゴールデンタイム枠の残席カウントダウン」で早期予約を促進。
   - **Action (A)**: 直近14日間の4枠制宴会空き状況カレンダー（◯・△・✕・休）と、24時間受付のLINE即時仮予約のデュアルCTAで離脱を防ぎ成約を最大化。
   - **FAQ (よくある質問)**: 個室レイアウト、人数変更・キャンセル規定、インボイス対応領収書、プロジェクター設備など、幹事が稟議・手配時に確認したい6項目を完全網羅。

2. **Japanese Modern Glassmorphism UIトークン設計**:
   - 格式と落ち着きを演出する夜の藍色（`#071126`, `#0B1B3D`）をベースとし、提灯の温もりと高級感を醸成する琥珀ゴールド（`#D99B26`, `#F3C669`）をアクセントカラーに採用。
   - すりガラス（`rgba(11, 27, 61, 0.78)`, `backdrop-filter: blur(16px)`）と金箔をイメージした繊細なボーダー（`rgba(217, 155, 38, 0.25)`）により、大人の上質な和モダン空間をWeb上で再現。
   - 和文見出しに `Shippori Mincho`、欧文・数字に `Cinzel` / `Inter`、本文に `Noto Sans JP` を適用。

3. **14日間 4枠制 宴会カレンダー・予約エンジン設計**:
   - 宴会ピーク時間帯に合わせた1日4枠制（17:00 / 18:30 / 19:30 / 20:30）を採用。
   - 週末（金・土）および祝前日の18:30 / 19:30スロットに対する人気重み付け（シミュレーションスコア加算）を実装し、リアリティのある混雑状況（△や✕）を演出。
   - 予約完了時に発行される予約番号は `ENI-YYYYMMDD-XXXX` 形式。Googleカレンダー追加URLおよびRFC 5545準拠の `.ics` ファイル（2時間前VALARM付き）、LINE公式アカウントディープリンクを自動生成。

4. **AI画像アセット（4シーン）の要件確定**:
   - ① 湯気立つ和牛もつ鍋と乾杯の宴会シズル（`hero_banquet_nabe.jpg`）
   - ② 豊洲直送の極上鮮魚5点盛り（`sashimi_platter.jpg`）
   - ③ 備長炭火の炎と煙に包まれる職人の焼き鳥（`yakitori_charcoal.jpg`）
   - ④ 落ち着いた灯りの掘りごたつ完全個室（`washoku_private_room.jpg`）

---

## 3. Caveats (留意事項・前提条件)

1. **GAS連携の独立性**:
   - `samples/washoku/js/config.js` の `gasWebhookUrl` は初期値で空文字（`""`）となっており、バックエンド未設定時でも決定論的オフラインシミュレーションモードで完全動作する。
2. **画像生成アセットの配置場所**:
   - 画像生成ツールで作成される4枚のJPG画像は、必ず `samples/washoku/assets/images/` に配置され、HTMLおよびCSSから相対パス `./assets/images/...` で参照される。
3. **テスト検証環境**:
   - 自動テストスイート（`tests/`）は外部ライブラリ不要のPython標準ライブラリのみで動作し、M4でWashoku用のDOMバリデーションおよびカレンダーシミュレータが追加される。

---

## 4. Conclusion (結論と次期マイルストーンへの指示)

- 「個室和食 旬彩 縁 -ENISHI-」特化LPの設計仕様、新PASONAコピーライティング原稿、UI/UXトークン、松竹梅コース体系、設定スキーマ、カレンダー/予約エンジン仕様、AI画像プロンプト、およびエッジケース対策の全貌が確定した。
- 本レポートに基づき、**Milestone 2 (Washoku LP Implementation & Assets)** を担当する `worker_washoku_1` は、迷いなく `samples/washoku/index.html`, `washoku.css`, `js/config.js`, `js/washoku.js`, `assets/images/*` の実装に着手可能である。

---

## 5. Verification Method (検証方法)

1. **静的コード・リンク検証**:
   - `python tests/validate_links.py` を実行し、`samples/washoku/` 関連リンクおよび画像パスが404エラーなく100%解決することを確認。
2. **DOM構造・PASONA適合性検証**:
   - `python tests/validate_pasona_dom.py` を実行し、単一 `<h1>`、見出し階層、新PASONA 7セクション（`problem`, `affinity`, `solution`, `offer`, `narrowing`, `action`, `faq`）、松竹梅3プラン、アクセシビリティ（`alt`, `aria-*`）が合格することを確認。
3. **カレンダー・予約エンジン検証**:
   - `python tests/test_interactive_ui.py` を実行し、`window.WASHOKU_CONFIG` のスキーマ、14日間 4枠（17:00, 18:30, 19:30, 20:30）の空き枠判定、GoogleカレンダーURL、.ics（VALARM付き）、LINEディープリンクの正常生成を確認。
4. **統合マスターテスト実行**:
   - `python tests/run_all_tests.py` を実行し、全150+テストケースの100% PASSを確認。

---

## Features Discovered (発見・定義された全機能一覧)

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|:---|:---|:---|:---|:---|:---|:---|:---|
| 1 | PASONA Core | Problem (問題提起 / 幹事の不安喚起) | 忘年会・宴会幹事の4大不安（予算・個室・席間隔・飲み放題品質）をデータと共に提示 | なし（ページロード） | 幹事共感コンテンツ、不安チェックリスト | セクション未定義時はDOMテストで検出 | ORIGINAL_REQUEST §R2 |
| 2 | PASONA Core | Affinity (共感・店長メッセージ) | 創業12年・年間1,500組実績を持つ店長・統括料理長からの「幹事様を絶対に恥をかかせない」約束 | なし | 店長・料理長写真、実績バッジ、メッセージ | セクション欠落時はPASONAバリデータ違反 | lp-pasona SKILL |
| 3 | PASONA Core | Solution (3大安心保証 & 4大名物料理) | 駅チカ徒歩2分・最大40名個室・明朗会計の3大保証と、豊洲鮮魚・炭火焼き鳥・もつ鍋・地酒30種のシズル紹介 | なし | 3大安心カード、4大名物料理ギャラリー、Before/After比較表 | Before/After未設置時はテスト警告 | ORIGINAL_REQUEST §R2 |
| 4 | PASONA Core | Offer (松竹梅 宴会コース体系) | 梅(¥3,980)、竹(¥4,980 ★人気No.1)、松(¥6,500)の全品2h飲み放題＆税込価格の松竹梅コース一覧 | コース選択ボタン操作 | コース詳細カード、品数一覧、予約フォーム自動連動 | 3プラン未満の場合はDOMテスト不合格 | ORIGINAL_REQUEST §R2 |
| 5 | PASONA Core | Narrowing Down (早期予約特典 & 残席警告) | 8名様以上幹事1名無料などの早期予約特典と、金土祝前日スロットの残席カウントダウン | なし | 特典バッジ、残席警告通知、仮予約無料保証 | 特典表記漏れはUIテストで検出 | ORIGINAL_REQUEST §R2 |
| 6 | PASONA Core | Action (14日カレンダー & LINE即時予約) | 直近14日×4枠制のリアルタイム宴会空席カレンダーと、LINE相談・Web予約のデュアルCTA | 日付・時間枠スロットクリック | 予約モーダル表示、日時自動入力、LINEアプリ起動 | 過去日時・定休日はボタン無効化(disabled) | ORIGINAL_REQUEST §R2 |
| 7 | PASONA Core | FAQ (よくある質問アコーディオン) | 個室人数、キャンセル規定、インボイス領収書、プロジェクター等6項目のQ&A | アコーディオン開閉タップ | 回答展開、`aria-expanded` 状態変更 | 3項目未満の場合はテスト不合格 | validate_pasona_dom.py |
| 8 | PASONA Core | Access & 店舗情報 | 所在地、新橋駅・銀座駅アクセス、営業時間、インボイス番号（T1234567890123）の明示 | なし | 店舗詳細テーブル、地図、電話・LINEボタン | 必須連絡先欠落時は静的テストで検出 | ORIGINAL_REQUEST §R4 |
| 9 | Calendar Engine | 14-Day 4-Slot Grid Generator | 17:00, 18:30, 19:30, 20:30 の宴会枠を14日間分動的生成するグリッド | `window.WASHOKU_CONFIG` | HTMLテーブル（◯・△・✕・休） | 不正日付はスキップ・今日開始に正規化 | samples/italian/js/italian.js |
| 10 | Calendar Engine | Deterministic Offline Fallback | GAS未設定時にシード値（`enishi_washoku_banquet_2026`）に基づき金土ディナーを重み付け計算 | 日付、時間枠、曜日 | `available` / `limited` / `full` / `closed` 判定 | シード値欠落時はデフォルト定数で計算 | test_interactive_ui.py |
| 11 | Booking Flow | Course Preselection Sync | お品書きの各コースボタンタップで、予約モーダルのコース選択プルダウンが自動同期 | コースID (`plum`, `bamboo`, `pine`) | モーダル起動、`<select>` 該当コース選択 | 不正なIDはデフォルト（竹）にフォールバック | samples/italian/js/italian.js |
| 12 | Booking Flow | Web予約モーダル & バリデーション | 幹事氏名、電話番号、人数(2〜40名)、個室希望、ご要望の入力と検証 | ユーザーフォーム入力 | 入力エラー表示 / 予約送信処理 | 未入力・形式不正時はインラインエラー表示 | samples/legal/js/legal.js |
| 13 | Thank-You View | Reservation ID Generator | 予約完了時に `ENI-YYYYMMDD-XXXX` 形式の固有予約番号を発行 | 送信タイムスタンプ | 画面表示、カレンダーメモへの埋め込み | 重複防止にタイムスタンプ+乱数ハッシュ | samples/aesthetic/js/aesthetic.js |
| 14 | Thank-You View | 1-Click Google Calendar Integration | GoogleカレンダーのWEB登録画面を別タブで開き、日時・店名・アクセス・コース名を自動反映 | 予約情報 | Google Calendar URL (`action=TEMPLATE`) | URLエンコード漏れ防止（urllib/encodeURIComponent） | tests/test_interactive_ui.py |
| 15 | Thank-You View | RFC 5545 Apple / Outlook (.ics) Blob | 2時間前アラーム（`VALARM`）付きの `.ics` ファイルを動的生成・ダウンロード | 予約情報 | `.ics` MIMEタイプ Blob URL | Safari / Chrome双方でダウンロード発火 | tests/test_interactive_ui.py |
| 16 | Thank-You View | LINE Official Deep Link | 予約内容をあらかじめ入力した状態で公式LINEアカウントのチャット画面を起動 | 予約内容テキスト | `https://line.me/R/oaMessage/@enishi_washoku/?...` | LINEアプリ未インストール時はWeb版にフォールバック | ORIGINAL_REQUEST §R3 |
| 17 | Sticky CTA | Scroll-Triggered Mobile Sticky Bar | モバイル画面で300pxスクロール時に画面下部に追従する「空席確認・Web予約 / LINE」バー | スクロール位置 (Y座標) | 固定バーのフェードイン表示 / モーダル時非表示 | 画面最下部・モーダルオープン時は非表示制御 | samples/italian/js/italian.js |
| 18 | Design System | Japanese Modern Glassmorphism | 深藍色背景、提灯琥珀アクセント、すりガラスエフェクト、和紙質感のCSSトークン体系 | CSSカスタムプロパティ | 統一された和モダンUIビジュアル | CSS未対応ブラウザは半透明単色フォールバック | ui-ux-pro-max SKILL |
| 19 | Configuration | Centralized Config (`window.WASHOKU_CONFIG`) | 店舗情報、営業時間、定休日、時間枠、コースマスター、GAS URLを一元管理 | `samples/washoku/js/config.js` | グローバル設定オブジェクト | 設定未定義時は安全なデフォルト値を使用 | ORIGINAL_REQUEST §R4 |
| 20 | Visual Assets | 4 High-Resolution AI Image Assets | 宴会鍋、刺身盛り合わせ、炭火焼き鳥、完全個室の実写画像を最適配置 | Gemini AI画像生成 | `samples/washoku/assets/images/*.jpg` | 画像未ロード時はCSS背景グラデーション表示 | ORIGINAL_REQUEST §R3 |

---

## Edge Cases (境界値・異常系・特殊入力マトリクス)

| # | Feature | Input / Condition | Observed / Expected Behavior | Handling / Test Strategy |
|:---|:---|:---|:---|:---|
| 1 | カレンダー時間判定 | 当日（Today）の過去時間枠（例: 現在19:00の時点で17:00枠や18:30枠を表示） | 過去スロットは自動的に `full`（✕）および `disabled` 状態となり、予約選択不可になる | `now.getHours()` / `now.getMinutes()` とスロット開始時刻を比較し即座に満席判定 |
| 2 | 金土・祝前日混雑シミュレーション | 金曜・土曜・祝前日の18:30 / 19:30枠のステータス計算 | 決定論的シード計算にボーナス値（+15〜+25点）を加算し、高い確率で `limited`（△）または `full`（✕）を算出 | 週末ゴールデンタイムのリアルな残席少表示を演出し、緊急性を喚起 |
| 3 | 宴会人数の境界値 | フォームで 1名 または 41名以上 を入力しようとした場合 | HTML5 `<input type="number" min="2" max="40">` で制限し、41名以上はお電話（03-6789-0123）またはLINE相談へ誘導する注記を表示 | バリデーションエラーメッセージ「Web予約は2名〜40名様まで承ります。41名様以上の貸切はお電話にてご相談ください」を表示 |
| 4 | 早期予約特典の人数連動 | フォームで 8名様以上 が選択された場合 | フォーム内に「🎁 【8名様以上特典】幹事様1名無料または地酒30種アップグレード対象です」というハイライトチップが自動表示 | 人数変更イベント（`input` / `change`）でDOMのクラス/表示を動的に切り替え |
| 5 | 年末年始・特別休業日判定 | 12月31日〜1月2日など特定の日付が指定された場合 | スロットステータスが `closed`（休）となり、ボタンが無効化される | `closedDays` 配列または特別休業日リストと日付マッチングを行い「休業日」表示 |
| 6 | 月跨ぎ・閏年の日付計算 | 8月31日 → 9月1日、2月28日 → 3月1日などの日付跨ぎ | JavaScriptの `new Date(year, month, date + i)` は自動的に翌月・閏年を正確に繰り越し計算 | `formatDateIso()` および `formatDateJapanese()` で `YYYY-MM-DD` 形式を破綻なく出力 |
| 7 | 特殊文字を含む予約者名 | 氏名やご要望に `&`, `"`, `'`, `<script>`, 改行、絵文字が含まれる場合 | HTMLエスケープ処理によりXSSを防止し、GoogleカレンダーURLや `.ics` には `encodeURIComponent()` および改行 `\n` エスケープを適用 | `SUMMARY` および `DESCRIPTION` の文字列サニタイズを徹底 |
| 8 | モバイル小画面でのカレンダー横スクロール | 幅375px（iPhone SE等）での14列テーブル表示 | 時間軸列（左端）を固定またはテーブルコンテナを `overflow-x: auto` とし、スムーズな横スワイプとタップ操作を保証 | `table-layout: auto` と `-webkit-overflow-scrolling: touch` で操作性を確保 |
| 9 | GAS Webhook URL未設定（空文字） | `config.js` の `gasWebhookUrl: ""` の場合 | エラーで停止せず、即座にローカル決定論的シミュレーション（擬似予約成功）へ分岐し、サンクス画面を表示 | `fetch()` をスキップし `setTimeout(..., 600)` で自然なローディング演出後に完了画面へ遷移 |
| 10 | 通信タイムアウト・ネットワーク切断 | GAS送信中に8秒以上応答がない、またはオフライン状態 | タイムアウト検知（`AbortController`）により自動的にフォールバック処理を実行し、画面フリーズを完全防止 | ユーザーに「仮予約を受け付けました」として予約番号・カレンダー登録・LINEリンクを提示 |

---

## Detailed Specification Blueprint (詳細仕様設計書)

### §1. 店舗基本情報 & ブランドアイデンティティ

| 項目 | 設定値 | 備考 |
|:---|:---|:---|
| **店舗名（和文）** | 個室和食 旬彩 縁 -ENISHI- | 忘年会・歓送迎会向け本格個室和食居酒屋 |
| **店舗名（カナ）** | コシツワショク シュンサイ エニシ | |
| **店舗名（欧文）** | SHUNSAI ENISHI - Modern Japanese Dining | |
| **キャッチコピー** | 「幹事様を絶対に恥をかかせない。駅チカ2分・全席掘りごたつ個室と豊洲鮮魚・和牛もつの極上宴会」 | 幹事安心×シズル訴求 |
| **所在地** | 〒104-0061 東京都中央区銀座7-X-X 銀座縁ビル 3F・4F | 新橋・銀座の好立地 |
| **アクセス** | JR新橋駅 銀座口 徒歩2分 / 東京メトロ銀座線・日比谷線 銀座駅 A3出口 徒歩3分 | 雨の日も安心の駅チカ |
| **電話番号** | 03-6789-0123（全日 14:00〜23:30 受付） | |
| **公式LINE** | `@enishi_washoku` (`https://line.me/R/ti/p/@enishi_washoku`) | 24時間即時仮予約・下見相談 |
| **営業時間** | 平日: 17:00 - 23:30 (L.O. 料理22:30 / ドリンク23:00)<br>土日祝: 16:00 - 23:00 (L.O. 料理22:00 / ドリンク22:30) | 年中無休（年末年始12/31〜1/2除く） |
| **席数・設備** | 総席数80席（2名〜最大40名様まで全席掘りごたつ完全個室）/ プロジェクター・マイク完備 | クローク・荷物預かりあり |
| **インボイス登録番号** | T1234567890123（適格請求書発行事業者登録済み） | 会社精算・領収書即時発行 |

---

### §2. 新PASONA 7セクション コピーライティング & DOM構造

```html
<!-- DOM Structure Blueprint -->
samples/washoku/index.html
├── Header (Nav, Brand Logo, Quick Tel, Web Booking & LINE CTA Buttons)
├── Main
│   ├── #problem [data-pasona="problem"] (Hero & 幹事の4大不安提起)
│   ├── #affinity [data-pasona="affinity"] (店長・統括料理長の約束 & 宴会実績・寄り添い)
│   ├── #solution [data-pasona="solution"] (3大安心保証 & 4大名物料理シズル & Before/After)
│   ├── #offer [data-pasona="offer"] (松竹梅 宴会コース一覧 全2h飲み放題＆税込明朗価格)
│   ├── #narrowing [data-pasona="narrowing"] (早期予約特典 & 金土祝前日スロット残席カウントダウン)
│   ├── #action [data-pasona="action"] (14日間 4枠制 宴会席空き状況カレンダー & LINE即時仮予約)
│   ├── #faq [data-pasona="faq"] (よくある質問 アコーディオン 6項目)
│   └── #access (店舗所在地・アクセス案内・営業時間・インボイス情報)
├── Footer (Copyright, Privacy Policy, Top Link, LP Portal Return Link)
├── #booking-modal (Web宴会予約モーダル / 予約完了サンクス画面)
└── #mobile-sticky-cta (下部追従 空席確認・即時予約CTAバー)
```

#### 1. Problem (問題提起 / 幹事の4大不安喚起) - `#problem`
- **H1 見出し**:
  - `「予算オーバー」「狭い席」「追加料金」「飲み放題が遅い」──`<br>`<span class="gold-gradient-text">今年の宴会・忘年会、お店選びで失敗したくない幹事様へ</span>`
- **リード文**:
  - 幹事経験者の約74%が「店選びで後悔した・参加者から不満が出た」と回答。大切な会社の忘年会や部署の歓送迎会で、幹事様が自腹を切ったり恥をかいたりするリスクを、当店がゼロにします。
- **幹事の4大不安カード**:
  - **Risk 01: 【予算・会計の不安】お通し代や席料、飲み放題延長で想定外の追加請求…集金で自腹を切る羽目に**
  - **Risk 02: 【空間・騒音の不安】大広間の仕切りなしで隣の声がうるさく、乾杯の挨拶や役員の話が全く聞こえない**
  - **Risk 03: 【席間隔・荷物の不安】席がギチギチで移動や席替えができない、冬のコートやカバンを置く場所がない**
  - **Risk 04: 【ドリンク提供の不満】頼んだドリンクが全然来ない、ビールがぬるい・薄い、地酒が選べず参加者の空気が悪化**

#### 2. Affinity (親近感・共感 / 店長・料理長からの約束) - `#affinity`
- **H2 見出し**: `「幹事様を絶対に一人にさせない、恥をかかせない。スタッフ一同が幹事様の専属黒子です」`
- **店長・料理長メッセージ**:
  - **店長 高橋 健二 & 統括料理長 佐藤 誠一**
  - 「私自身、会社員時代に幹事を務めて大変な思いをした経験があります。だからこそ『縁 -ENISHI-』では、幹事様が参加者と一緒に心から楽しめる宴会づくりに徹底的にこだわっています。下見（ロケハン）のご相談から当日の進行、乾杯のタイミング、アレルギー対応、プロジェクターの接続まで、私たちが全力でサポートいたします。」
- **安心の実績バッジ**:
  - 🏆 **創業12年・年間宴会実績 1,500組突破**
  - ⭐ **幹事様アンケート満足度 98.2% / リピート率 89.6%**
  - 🥇 **企業公式宴会・忘年会 指定利用店舗 320社登録**

#### 3. Solution (解決策 / 3大安心保証 ＆ 4大名物料理シズル) - `#solution`
- **H2 見出し**: `『縁 -ENISHI-』が選ばれる理由──幹事様必見の「3大安心保証」と「極上の和食体験」`
- **3大安心保証 (3 Pillars of Reassurance)**:
  - **Pillar 01: 【好立地】JR新橋駅・地下鉄銀座駅「徒歩2分」で集合・解散が圧倒的にスムーズ**
    - 駅から迷わず到着できる駅前立地。急な雨の日や二次会への移動も極めて快適です。
  - **Pillar 02: 【全席個室】2名様〜最大40名様まで全席掘りごたつ完全個室（クローク完備）**
    - 扉付きの完全個室で周囲の騒音を完全遮断。足を伸ばしてくつろげる掘りごたつ席で、人数に合わせた最適なレイアウトに変更可能です。
  - **Pillar 03: 【明朗会計】全コース「2時間飲み放題・消費税・席料込み」の完全ポッキリ価格**
    - お通し代やサービス料の追加請求は一切なし。記載価格そのままの明朗会計で、予算オーバーの心配がありません。
- **4大名物料理・シズル体験 (Signature Dishes)**:
  - ① **豊洲市場直送 鮮魚の極上5点盛り合わせ**: 毎朝料理長が自ら買い付ける本マグロ・活〆真鯛・旬魚の豪華お造り。
  - ② **職人手打ち 備長炭火焼き鳥**: 土佐備長炭の強火で旨味を閉じ込めた、外パリ中ジューシーな本格焼き鳥。
  - ③ **博多直送 国産和牛もつ鍋 & 季節の寄せ鍋**: ぷりぷりの和牛白モツと秘伝あご出汁スープが染み渡る、冬宴会の主役。
  - ④ **全国厳選地酒・日本酒30種プレミアム飲み放題**: 獺祭・作・黒龍・八海山など、銘酒を惜しみなくラインナップ。
- **Before / After 比較**:
  - *Before (一般的な大衆居酒屋)*: 狭い席、大部屋仕切りなし、追加料金で予算オーバー、ドリンクが遅い → 参加者から不満。
  - *After (個室和食 旬彩 縁)*: 掘りごたつ完全個室、駅チカ2分、完全定額・税サ込、地酒30種＆爆速提供 → 「今年の幹事、最高だった！」と大絶賛。

#### 4. Offer (提案 / 松竹梅 宴会コース一覧) - `#offer`
- **H2 見出し**: `ご予算とシーンに合わせて選べる、全席個室・飲み放題付き宴会コース`
- **松竹梅 料金体系**:
  1. **【梅】旬彩カジュアル宴会コース (全7品 / 2h飲み放題付)**
     - 価格: **¥3,980（税込）**
     - 内容: 先付2種、有機野菜胡麻サラダ、豊洲直送お造り3点盛り、備長炭火焼き鳥、若鶏竜田揚げ、旬魚炊き込みご飯、甘味
     - 飲み放題: 生ビール含む全35種
     - 対象: 部署の気軽な飲み会、二次会、コスパ重視の懇親会
  2. **【竹】名物鍋＆豊洲鮮魚の王道宴会コース (全8品 / 2h飲み放題付) ★人気No.1・幹事様推奨**
     - 価格: **¥4,980（税込）**
     - 内容: 前菜3種盛り、海鮮サラダ、**豊洲鮮魚の極上5点盛り（本マグロ入り）**、備長炭火焼き鳥2種、大海老天ぷら、**選べる名物鍋（博多和牛もつ鍋 or 季節のちゃんこ寄せ鍋）**、〆の熟成ちゃんぽん/雑炊、黒蜜きな粉わらび餅
     - 飲み放題: **全国厳選地酒5種追加＋生ビール等全50種**
     - 対象: 忘年会、新年会、歓送迎会、会社公式宴会
  3. **【松】特選和牛＆極上舟盛り 贅沢極みコース (全9品 / 2hプレミアム飲み放題付)**
     - 価格: **¥6,500（税込）**
     - 内容: 酒肴前菜5種、炙りホタテ贅沢サラダ、**極上鮮魚7点豪華舟盛り（本マグロ中トロ・雲丹・活鮑入り）**、黒毛和牛炭火ステーキ、名古屋コーチン焼き鳥、ズワイガニ天ぷら、**特選A5黒毛和牛すき焼き鍋**、トリュフ雑炊/うどん、宇治抹茶フォンダンショコラ
     - 飲み放題: **全国厳選地酒30種全銘柄＋プレミアムウイスキー等全70種**
     - 対象: 役員参加の特別宴会、達成会、接待・会食、プレミアム忘年会

#### 5. Narrowing Down (限定性・緊急性) - `#narrowing`
- **H2 見出し**: `早期ご予約限定の特別特典 ＆ 金・土・祝前日スロットの残席状況`
- **早期予約特典**:
  - 🎁 **特典①: 8名様以上のご予約で「幹事様1名分 無料」または「地酒30種プレミアム飲み放題へ無料アップグレード」**
  - 🎁 **特典②: 20名様以上のご予約で「乾杯用 金箔入り特選日本酒（1升瓶）」プレゼント**
  - 🛡️ **安心保証: Web仮予約はご宴会7日前までキャンセル料無料（席の仮押さえが可能）**
- **週末スロット緊急性**:
  - 「11月・12月・3月の金曜・土曜・祝前日のゴールデンタイム（18:30〜 / 19:30〜）は毎年早期に満席となります。個室レイアウトの確保はお早めの仮予約をおすすめいたします。」

#### 6. Action (行動喚起 / 14日間 空席カレンダー & LINE即時仮予約) - `#action`
- **H2 見出し**: `直近14日間の宴会空き状況カレンダー ＆ 即時Web予約 / LINE仮予約`
- **カレンダー仕様**:
  - 直近14日間 × 1日4枠制（17:00 / 18:30 / 19:30 / 20:30）
  - ◯（空席あり・即時予約可）、△（残りわずか・要相談）、✕（満席）、休（休業日）
  - スロットタップで予約モーダル起動＆日時自動反映
- **LINE即時相談ボタン**:
  - `「店長直通！ LINEで宴会人数・空き状況を相談する（24時間受付）」`

#### 7. FAQ (よくある質問 6項目) - `#faq`
- **Q1. 何名から完全個室を利用できますか？ 人数の増減は何日前まで対応可能ですか？**
  - A1. 2名様の少人数から最大40名様まで、すべて扉付きの完全個室でご案内いたします。人数の最終確定はご宴会当日の正午（12:00）まで承ります。急な体調不良や参加者の増減にも柔軟に対応いたします。
- **Q2. 宴会のキャンセル規定はどうなっていますか？ 仮押さえは可能ですか？**
  - A2. コース予約のキャンセル・日程変更はご宴会日の3日前まで無料です。人数変更（±2名程度）は当日12:00まで無料で調整可能です。全キャンセルの場合は2日前50%、前日80%、当日100%（仕入れ実費）を頂戴いたします。WebまたはLINEからの仮予約（席押さえ）も可能です。
- **Q3. インボイス制度（適格請求書）に対応した領収書は発行できますか？ 法人請求書払いは可能ですか？**
  - A3. はい、当店は適格請求書発行事業者（登録番号: T1234567890123）に登録済みです。インボイス対応のレシート・領収書を即時発行いたします。また、法人企業様の事前審査による請求書払い（月末締め翌月末払い）も対応しております。
- **Q4. プロジェクター、マイク、音響設備などの貸出はありますか？ 横断幕の持ち込みは？**
  - A4. 20名様以上の大型個室には、大型モニター/プロジェクター、ワイヤレスマイクを無料でご用意可能です（要事前予約）。また、主役への花束・色紙の事前お預かりや、宴会用横断幕の設置も無料でサポートいたします。
- **Q5. 飲み放題のラストオーダーや時間延長はできますか？**
  - A5. 飲み放題のラストオーダーは終了30分前（90分経過時点）にお伺いします。ドリンクはグラス交換制で、スタッフが迅速にお運びします。また、お一人様＋500円（税込）で飲み放題を30分延長（事前相談）することも可能です。
- **Q6. アレルギー対応やベジタリアン、お肉が苦手な参加者の個別メニュー変更は可能ですか？**
  - A6. はい、専任の料理人がおりますので、甲殻類アレルギー、生魚が苦手な方、お肉を魚料理に変更するなど、個別のお食事変更に柔軟に対応いたします。ご予約時にご要望欄にご記入いただくか、LINEでお気軽にご相談ください。

---

### §3. UI/UX Design System & Tokens

```css
/* samples/washoku/css/washoku.css Token Architecture */
:root {
  /* 1. Color Tokens (Japanese Modern & Indigo Gold) */
  --color-bg-primary: #071126;           /* 極上夜紺 (Deep Night Indigo) */
  --color-bg-secondary: #0B1B3D;         /* 伝統藍色 (Traditional Indigo) */
  --color-bg-surface: rgba(7, 17, 38, 0.88);
  --color-bg-card: rgba(11, 27, 61, 0.78);
  --color-bg-card-hover: rgba(16, 37, 80, 0.85);

  --color-accent-gold: #D99B26;          /* 提灯琥珀 (Lantern Amber Gold) */
  --color-accent-gold-light: #F3C669;    /* 黄金色 (Bright Amber Gold) */
  --color-accent-gold-dark: #A87415;
  --color-accent-vermilion: #C53D25;     /* 朱赤 (Traditional Vermilion - Urgency) */

  --color-text-primary: #FAF8F5;         /* 和紙生成り (Washi Cream White) */
  --color-text-secondary: #D0D7DE;       /* 淡雪銀 (Light Mist Silver) */
  --color-text-muted: #8B949E;           /* 煤竹 (Muted Charcoal) */
  --color-text-dark: #1F1F1F;

  --color-border-gold: rgba(217, 155, 38, 0.25);
  --color-border-subtle: rgba(255, 255, 255, 0.12);
  --color-border-focus: #D99B26;

  --color-glass-highlight: rgba(255, 255, 255, 0.06);
  --color-shadow-ambient: rgba(0, 0, 0, 0.55);
  --color-glow-amber: rgba(217, 155, 38, 0.28);

  /* Status Colors for Calendar */
  --color-status-avail-bg: rgba(46, 160, 67, 0.18);
  --color-status-avail-text: #3FB950;
  --color-status-limit-bg: rgba(217, 155, 38, 0.20);
  --color-status-limit-text: #F3C669;
  --color-status-full-bg: rgba(248, 81, 73, 0.15);
  --color-status-full-text: #F85149;
  --color-status-closed-bg: rgba(110, 118, 129, 0.15);
  --color-status-closed-text: #8B949E;

  /* 2. Typography Tokens */
  --font-family-serif: 'Shippori Mincho', 'Yu Mincho', 'Hiragino Mincho ProN', serif;
  --font-family-heading: 'Shippori Mincho', 'Cinzel', serif;
  --font-family-sans: 'Noto Sans JP', 'Hiragino Sans', 'Meiryo', sans-serif;
  --font-family-accent: 'Cinzel', 'Inter', sans-serif;

  /* 3. Spacing Scale */
  --space-xs: 0.25rem;   /* 4px */
  --space-sm: 0.5rem;    /* 8px */
  --space-md: 1rem;      /* 16px */
  --space-lg: 1.5rem;    /* 24px */
  --space-xl: 2.5rem;    /* 40px */
  --space-2xl: 4rem;     /* 64px */
  --space-3xl: 6rem;     /* 96px */

  /* 4. Radius Tokens */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 14px;
  --radius-xl: 20px;
  --radius-full: 9999px;

  /* 5. Glassmorphism Recipe */
  --glass-card: linear-gradient(135deg, rgba(11, 27, 61, 0.78) 0%, rgba(7, 17, 38, 0.88) 100%);
  --glass-backdrop-blur: blur(16px);
  --glass-box-shadow: 0 12px 32px -4px rgba(0, 0, 0, 0.5), 0 0 20px rgba(217, 155, 38, 0.15);
}
```

---

### §4. Matsutake 3-Tier Banquet Pricing Master Specification

```javascript
courseMaster: {
  plum: {
    id: 'plum',
    tier: 'plum',
    tierName: '梅',
    name: '梅：旬彩カジュアル宴会コース（全7品）',
    fullName: '【梅コース】旬彩カジュアル宴会コース（全7品 / 2h飲み放題付）',
    price: 3980,
    priceLabel: '¥3,980（税込 / 飲み放題付）',
    includesDrink: '2時間飲み放題付き（全35種）',
    durationMin: 120,
    isPopular: false,
    dishesCount: 7,
    dishes: [
      '本日の先付2種（季節の小鉢）',
      '蒸し鶏と有機野菜の胡麻ドレッシングサラダ',
      '豊洲直送 本日のお造り3点盛り',
      '職人手打ち 備長炭火焼き鳥（タレ・塩2種盛り）',
      '若鶏の竜田揚げ 〜自家製和風香味おろし〜',
      '出汁香る 旬魚の炊き込みご飯',
      '本日の甘味（ほうじ茶アイス）'
    ],
    targetAudience: '二次会、気軽な部署飲み会、若手懇親会、カジュアル歓送迎会'
  },
  bamboo: {
    id: 'bamboo',
    tier: 'bamboo',
    tierName: '竹',
    name: '竹：名物鍋＆豊洲鮮魚の王道宴会コース（全8品）★人気No.1',
    fullName: '【竹★人気No.1】名物鍋＆豊洲鮮魚5点盛りの王道宴会コース（全8品 / 2h飲み放題付）',
    price: 4980,
    priceLabel: '¥4,980（税込 / 飲み放題付）',
    includesDrink: '2時間飲み放題付き（★全国厳選地酒5種含む全50種）',
    durationMin: 120,
    isPopular: true,
    dishesCount: 8,
    dishes: [
      '旬の前菜3種盛り合わせ（合鴨ロース・湯葉刺し・旬野菜のお浸し）',
      'ズワイガニと豆腐の和風海鮮サラダ',
      '【名物】豊洲市場直送 極上鮮魚の5点盛り合わせ（本マグロ入り）',
      '職人手打ち 備長炭火焼き鳥2種（大山どり ねぎま・特製つくね卵黄添え）',
      '旬の揚げ物（大海老と季節野菜の天ぷら盛り）',
      '【主役】選べる名物鍋（博多国産和牛もつ鍋 or 旬魚と地鶏の極上ちゃんこ寄せ鍋）',
      '鍋の〆（旨味凝縮 熟成ちゃんぽん麺 or 雑炊セット）',
      '季節の甘味（自家製黒蜜きな粉わらび餅）'
    ],
    targetAudience: '忘年会、新年会、歓送迎会、会社公式宴会、同窓会（幹事様推奨★人気No.1）'
  },
  pine: {
    id: 'pine',
    tier: 'pine',
    tierName: '松',
    name: '松：特選和牛＆極上舟盛り 贅沢極みコース（全9品）',
    fullName: '【松コース】特選和牛＆極上舟盛り 贅沢極みコース（全9品 / 2h地酒30種飲み放題付）',
    price: 6500,
    priceLabel: '¥6,500（税込 / 飲み放題付）',
    includesDrink: '2時間プレミアム飲み放題付き（★全国厳選地酒30種全銘柄含む全70種）',
    durationMin: 120,
    isPopular: false,
    dishesCount: 9,
    dishes: [
      '料理長特製 季節の酒肴前菜5種盛り',
      '炙りホタテと有機クレソンの贅沢サラダ',
      '【豪華】料理長厳選 豪華舟盛り極上鮮魚7点盛り合わせ（本マグロ中トロ・雲丹・活鮑・真鯛等）',
      '極上黒毛和牛の備長炭火ステーキ 〜特製山葵醤油と岩塩〜',
      '職人手打ち 備長炭火焼き鳥（名古屋コーチン 特上もも肉＆白レバー）',
      'ズワイガニと車海老のサクサク天ぷら',
      '【極上鍋】特選A5黒毛和牛のすき焼き鍋 or 旬の寒鰤しゃぶしゃぶ鍋',
      '〆の逸品（讃岐うどん or 極上出汁のトリュフ雑炊）',
      '匠のデザート（宇治抹茶フォンダンショコラと季節の果実）'
    ],
    targetAudience: '役員参加の特別宴会、達成会、接待・会食、プレミアム忘年会'
  }
}
```

---

### §5. Config Schema (`samples/washoku/js/config.js`)

```javascript
/**
 * samples/washoku/js/config.js
 * Centralized Washoku Izakaya & Banquet Booking System Configuration
 * Single Source of Truth for 個室和食 旬彩 縁 -ENISHI-
 */

(function (global) {
  'use strict';

  var WASHOKU_CONFIG = {
    // 1. 店舗基本情報 (Restaurant Metadata)
    restaurantName: '個室和食 旬彩 縁 -ENISHI-',
    restaurantJapaneseName: '個室和食 旬彩 縁（えにし）',
    restaurantTagline: '新橋・銀座 豊洲鮮魚と備長炭火焼き・全席掘りごたつ個室',
    restaurantPostalCode: '104-0061',
    postalCode: '104-0061',
    restaurantAddress: '東京都中央区銀座7-X-X 銀座縁ビル 3F・4F',
    address: '東京都中央区銀座7-X-X 銀座縁ビル 3F・4F',
    restaurantAccess: 'JR新橋駅 銀座口 徒歩2分 / 東京メトロ銀座線・日比谷線 銀座駅 A3出口 徒歩3分',
    access: 'JR新橋駅 銀座口 徒歩2分 / 東京メトロ銀座線・日比谷線 銀座駅 A3出口 徒歩3分',
    restaurantPhone: '03-6789-0123',
    phone: '03-6789-0123',
    restaurantEmail: 'banquet@enishi-washoku.example.com',
    email: 'banquet@enishi-washoku.example.com',
    invoiceRegistrationNumber: 'T1234567890123',

    // 2. GAS Webhook 設定
    gasWebhookUrl: '',
    gasTimeoutMs: 8000,

    // 3. 営業時間 & 宴会時間枠設定
    businessHours: {
      weekday: {
        start: '17:00',
        end: '23:30',
        lastOrderFood: '22:30',
        lastOrderDrink: '23:00',
        label: '平日 17:00 - 23:30（L.O. 料理 22:30 / ドリンク 23:00）'
      },
      holiday: {
        start: '16:00',
        end: '23:00',
        lastOrderFood: '22:00',
        lastOrderDrink: '22:30',
        label: '土日祝 16:00 - 23:00（L.O. 料理 22:00 / ドリンク 22:30）'
      },
      label: '平日 17:00-23:30 / 土日祝 16:00-23:00（年中無休・年末年始除く）'
    },

    // 定休日設定 (0: 日, 1: 月, ..., 6: 土) -> 年中無休
    closedDays: [],
    closedDaysLabel: '年中無休（年末年始12/31〜1/2を除く）',

    // 宴会予約枠（1日4枠制: 17:00, 18:30, 19:30, 20:30）
    timeSlots: ['17:00', '18:30', '19:30', '20:30'],

    // カレンダー表示日数
    daysToShow: 14,

    // 席数・宴会定員
    totalCapacity: 80,
    maxBanquetPartySize: 40,
    minPartySize: 2,
    defaultPartySize: 4,
    capacityPerSlot: 4,

    // 4. 公式LINEアカウント連携
    lineOfficialUrl: 'https://line.me/R/ti/p/@enishi_washoku',
    lineAccountId: '@enishi_washoku',
    lineOaMessageUrl: 'https://line.me/R/oaMessage/@enishi_washoku/?',

    // 5. 動的シミュレーション・フォールバック
    fallbackSimulation: true,
    simulationSeedSalt: 'enishi_washoku_banquet_2026',

    // 6. 提供コースマスター (松竹梅 料金体系)
    courseMaster: {
      bamboo: {
        id: 'bamboo',
        name: '竹：名物鍋＆豊洲鮮魚の王道宴会コース（全8品）★人気No.1',
        fullName: '【竹★人気No.1】名物鍋＆豊洲鮮魚5点盛りの王道宴会コース（全8品 / 2h飲み放題付）',
        tier: 'bamboo',
        price: 4980,
        priceLabel: '¥4,980（税込 / 飲み放題付）',
        includesDrink: '2時間飲み放題付き（★厳選地酒5種含む全50種）',
        durationMin: 120,
        isPopular: true,
        summary: '豊洲直送鮮魚5点盛り＋選べる名物鍋（和牛もつ鍋or寄せ鍋）＋備長炭火焼き鳥＋大海老天ぷら'
      },
      plum: {
        id: 'plum',
        name: '梅：旬彩カジュアル宴会コース（全7品）',
        fullName: '【梅コース】旬彩カジュアル宴会コース（全7品 / 2h飲み放題付）',
        tier: 'plum',
        price: 3980,
        priceLabel: '¥3,980（税込 / 飲み放題付）',
        includesDrink: '2時間飲み放題付き（全35種）',
        durationMin: 120,
        isPopular: false,
        summary: '豊洲直送お造り3点盛り＋備長炭火焼き鳥＋若鶏竜田揚げ＋旬魚炊き込みご飯'
      },
      pine: {
        id: 'pine',
        name: '松：特選和牛＆極上舟盛り 贅沢極みコース（全9品）',
        fullName: '【松コース】特選和牛＆極上舟盛り 贅沢極みコース（全9品 / 2h地酒30種飲み放題付）',
        tier: 'pine',
        price: 6500,
        priceLabel: '¥6,500（税込 / 飲み放題付）',
        includesDrink: '2時間プレミアム飲み放題付き（★厳選地酒30種全銘柄含む全70種）',
        durationMin: 120,
        isPopular: false,
        summary: '極上鮮魚7点豪華舟盛り＋A5黒毛和牛すき焼き鍋/ステーキ＋名古屋コーチン焼き鳥＋カニ天ぷら'
      }
    }
  };

  // グローバルエクスポート
  global.WASHOKU_CONFIG = WASHOKU_CONFIG;
  global.RESTAURANT_CONFIG = WASHOKU_CONFIG; // 互換性エイリアス

})(typeof window !== 'undefined' ? window : this);
```

---

### §6. 4 High-Resolution Visual Image Asset Requirements & Generation Prompts

| ファイル名 | 配置パス | 推奨アスペクト比 | 詳細仕様 & 生成プロンプト (Gemini AI / Photorealistic) |
|:---|:---|:---:|:---|
| `hero_banquet_nabe.jpg` | `samples/washoku/assets/images/` | `16:9` または `3:2` | **忘年会・歓送迎会のシズル感あふれる乾杯＆鍋風景**<br>*Prompt*: A warm, vibrant, and appetizing Japanese izakaya banquet scene. In the center of a beautiful dark natural wood table sits a bubbling, steaming hotpot (Wagyu Motsunabe with plump beef offal, tofu, garlic chives, and rich broth). Around the hotpot are small Japanese ceramic sake cups, chilled draft beer glasses being clinked in a cheerful toast, and freshly prepared sashimi plates. Warm ambient paper lantern lighting (andon), softly blurred background showing happy Japanese business colleagues enjoying their company banquet in a private dining room with traditional wooden lattice. Ultra-realistic culinary photography, cinematic warm lighting, rich appetizing steam, 8k resolution, photorealistic depth of field. |
| `sashimi_platter.jpg` | `samples/washoku/assets/images/` | `4:3` または `1:1` | **豊洲市場直送 極上鮮魚の豪華お造り盛り合わせ**<br>*Prompt*: A masterfully crafted Japanese sashimi platter (assorted 5 fresh fish varieties from Toyosu fish market) artfully arranged on a bed of crushed glistening ice, green shiso leaves, and decorative bamboo leaves. Highlighting glistening thick slices of Hon-Maguro bluefin tuna, sea bream, salmon, and scallops, garnished with freshly grated wasabi and delicate yellow edible chrysanthemum flowers. Served on an exquisite dark navy Japanese ceramic platter. Moody authentic izakaya table background, crisp macro focus, glistening fresh seafood texture, studio culinary lighting, 8k resolution. |
| `yakitori_charcoal.jpg` | `samples/washoku/assets/images/` | `4:3` または `1:1` | **備長炭の炎と香ばしい煙に包まれる職人の炭火焼き鳥**<br>*Prompt*: A skilled Japanese yakitori master chef grilling skewered chicken yakitori (negima and tsukune) over glowing red-hot Binchotan charcoal grill. Rising fragrant smoke, glowing charcoal sparks, sizzling glossy tare sauce dripping and caramelizing over the crispy golden-brown grilled chicken skin. Close-up action shot capturing the intense craftsmanship and authentic artisan kitchen ambiance. Dramatic lighting, vivid orange embers, rich textures, high-speed photography, 8k resolution. |
| `washoku_private_room.jpg` | `samples/washoku/assets/images/` | `16:9` または `4:3` | **落ち着いた行灯が灯る掘りごたつ式の完全個室**<br>*Prompt*: An elegant and tranquil modern Japanese private dining room (Horigotatsu sunken floor seating with clean tatami mats) ready for an exclusive banquet of up to 40 guests. Warm ambient lighting from traditional Japanese amber paper lanterns (andon), dark cedar wood latticework (shoji screens), spotless polished wooden tables with neatly arranged lacquer chopstick rests, sake cups, and linen napkins. Luxurious, cozy, and private hospitable atmosphere, perfectly inviting for corporate parties and memorable gatherings. Architectural interior photography, wide-angle lens, warm tones. |

---

### §7. 予約完了サンクス画面 & カレンダー・LINE連携フォーマット仕様

#### 1. 予約番号フォーマット
- `ENI-YYYYMMDD-XXXX` (例: `ENI-20260822-7F3A`)

#### 2. 1-Click Googleカレンダー連携URLパラメータ
```text
https://calendar.google.com/calendar/render?action=TEMPLATE
  &text=【ご宴会予約】個室和食 旬彩 縁 -ENISHI-
  &dates=20260822T183000/20260822T203000
  &details=予約番号: ENI-20260822-7F3A%0Aコース: 【竹★人気No.1】名物鍋＆豊洲鮮魚5点盛りの王道宴会コース（全8品 / 2h飲み放題付）%0A人数: 12名様（完全個室）%0A店舗電話: 03-6789-0123%0A所在地: 東京都中央区銀座7-X-X 銀座縁ビル 3F・4F
  &location=個室和食 旬彩 縁 -ENISHI- (東京都中央区銀座7-X-X 銀座縁ビル 3F・4F)
```

#### 3. RFC 5545 `.ics` (Apple / Outlook / Google) フォーマット (VALARM 2時間前アラーム付き)
```ics
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SHUNSAI ENISHI//Banquet Reservation System//JA
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:ENI-20260822-7F3A@enishi-washoku.example.com
DTSTAMP:20260822T071800Z
DTSTART:20260822T093000Z
DTEND:20260822T113000Z
SUMMARY:【ご宴会予約】個室和食 旬彩 縁 -ENISHI-
LOCATION:個室和食 旬彩 縁 -ENISHI- (東京都中央区銀座7-X-X 銀座縁ビル 3F・4F)
DESCRIPTION:予約番号: ENI-20260822-7F3A\nコース: 竹コース（全8品 / 2h飲み放題付）\n人数: 12名様\n電話: 03-6789-0123\nアクセス: JR新橋駅 銀座口 徒歩2分
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-PT2H
ACTION:DISPLAY
DESCRIPTION:【リマインダー】本日18:30より「個室和食 旬彩 縁」にてご宴会のご予約がございます。
END:VALARM
END:VEVENT
END:VCALENDAR
```

#### 4. LINE公式アカウント ディープリンク URL
```text
https://line.me/R/oaMessage/@enishi_washoku/?【宴会Web仮予約完了】%0A予約番号: ENI-20260822-7F3A%0A日時: 2026年8月22日(土) 18:30〜%0Aコース: 竹コース%0A人数: 12名%0Aお名前: 田中 太郎%0A※下見や個室レイアウト、プロジェクター利用について相談したいです。
```
