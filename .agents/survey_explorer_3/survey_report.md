# 調査レポート: テスト基盤・Git設定・デプロイ環境・新機能検証要件 (Explorer 3)

## 1. エグゼクティブサマリー

本レポートは、エステサロンLPおよびLPデザインハブ（ポータル）における**テストスイート・テストインフラ・Git構成・GitHub Pagesデプロイ要件・新機能自動テスト要件**を網羅的に調査・整理したものです。

本プロジェクトは**外部ヘビー依存（Node.js / npm / Selenium / Pytest等）を一切持たず、純粋なPython標準ライブラリ（`http.server`, `urllib.request`, `html.parser`, `re`, `json`, `socket`, `threading`, `pathlib`）のみで自律駆動する堅牢な4層（4-Tier）テスト基盤**を採用しています。

今回の「リアルタイム空き状況カレンダー」「Googleカレンダー＆スプレッドシート完全自動連動（GAS）」「予約完了（サンクス）画面・.ics生成・LINE連携」「フォールバック動的計算」の追加に伴い、既存の25テストケース（Tier 1〜3）＋2実世界シナリオ（Tier 4）を拡張し、新機能の完全検証を行うテスト仕様およびデプロイ手順を策定しました。

---

## 2. 既存テストスイート・テストインフラ調査

### 2.1 テストファイル構成と役割
現在、`tests/` ディレクトリ配下に以下の5つのテストモジュールが配備されています。

| ファイルパス | 行数 / サイズ | 役割・検証スコープ |
|:---|:---|:---|
| `tests/run_all_tests.py` | 563行 / 31.0KB | **統合マスターテストランナー**<br>Tier 1（基本機能 10件）、Tier 2（境界値・エッジ 8件）、Tier 3（複合結合 5件）、Tier 4（実世界シナリオ 2件）を順次実行し、サマリーと終了コード（0: Pass, 1: Fail）を出力 |
| `tests/test_server.py` | 269行 / 10.4KB | **静的HTTPテストサーバー**<br>ローカルでエフェメラルポートを確保し、ルート配信およびGitHub Pages特有のサブディレクトリ配信（`/lp-portal-hub/`）をシミュレーションしてHTTP 200/404/MIMEを検証 |
| `tests/validate_links.py` | 318行 / 13.0KB | **厳格相対リンク・アセット検証器**<br>ルート相対パス（`/`）の完全排除（Rule-L1）、ローカルファイル実在性（Rule-L2）、Linux/GitHub Pages対応の大文字小文字完全一致（Case Sensitivity Guard）、ページ内・跨ぎアンカー（#id）実在性（Rule-L3）を検証 |
| `tests/validate_pasona_dom.py` | 360行 / 16.1KB | **新PASONA DOM・見出し階層・SEO検証器**<br>新PASONA全7セクション（P-A-S-O-N-A-FAQ）の存在、H1単一性・階層ジャンプなし、SEOタグ（viewport, title, description, og:*）、アクセシビリティ（img alt, aria）を検証 |
| `tests/test_interactive_ui.py` | 324行 / 14.1KB | **インタラクティブUI・Vanilla JS検証器**<br>ポータルカテゴリ絞り込み（URLハッシュ対応）、FAQアコーディオン開閉、追従CTAスクロール発火、予約モーダルDOM＆必須入力バリデーションを検証 |

### 2.2 依存関係と実行環境
- **Node.js / npm 依存**: なし（`package.json`, `node_modules` は存在しない、完全ゼロ依存アーキテクチャ）
- **Python外部ライブラリ依存**: なし（標準ライブラリ `sys`, `os`, `re`, `html.parser`, `urllib`, `http.server`, `pathlib`, `json`, `socket`, `threading` のみ）
- **実行コマンド**:
  ```powershell
  [Console]::OutputEncoding = [System.Text.Encoding]::UTF8;
  $env:PYTHONUTF8=1;
  python tests/run_all_tests.py
  ```

---

## 3. Gitリポジトリ構成 & GitHub Pages デプロイ仕様

### 3.1 リポジトリ設定
- **リモートリポジトリURL**: `https://github.com/tadaodev/sales_lp.git`
- **対象ブランチ**: `main`
- **作業ディレクトリ**: `c:/Project/事業案/05_LP作成`
- **メタデータ分離**: `.agents/` ディレクトリはエージェント作業ログ・計画メタデータ専用とし、ソースコードや本番アセットには含めない。

### 3.2 GitHub Pages ホスティング要件
GitHub Pagesでは、プロジェクトサイト（`https://tadaodev.github.io/sales_lp/`）として配信されるため、以下の厳格なパス規則が必須となります。

1. **絶対パス（`/`）の完全禁止（Rule-L1）**:
   - `href="/css/style.css"` や `src="/samples/..."` はGitHub Pagesのルート（ユーザードメイン直下）を参照して404になるため厳禁。
   - すべて `./`, `../`, `../../` などの厳格な相対パスで記述する。
2. **大文字小文字の完全一致（Linuxファイルシステム対応）**:
   - Windowsでは大文字小文字を区別しないが、GitHub Pages（Linux環境）では `aesthetic.CSS` と `aesthetic.css` の不一致で404が発生する。テストの `Case Sensitivity Guard` で厳格にチェック。
3. **双方向ナビゲーション整合性**:
   - ポータル（`index.html`） → エステLP: `./samples/aesthetic/index.html`
   - エステLP（`samples/aesthetic/index.html`） → ポータル: `../../index.html`

---

## 4. 相対パス整合性マトリクス

| 参照元ファイル | 参照先ファイル | 許可される相対パス形式 | 禁止される形式（404原因） |
|:---|:---|:---|:---|
| `index.html` | `css/tokens.css` | `./css/tokens.css` / `css/tokens.css` | `/css/tokens.css` |
| `index.html` | `samples/aesthetic/index.html` | `./samples/aesthetic/index.html` / `samples/aesthetic/index.html` | `/samples/aesthetic/index.html` |
| `samples/aesthetic/index.html` | `css/tokens.css` | `../../css/tokens.css` | `/css/tokens.css` / `../css/tokens.css` |
| `samples/aesthetic/index.html` | `samples/aesthetic/css/aesthetic.css` | `./css/aesthetic.css` / `css/aesthetic.css` | `/samples/aesthetic/css/aesthetic.css` |
| `samples/aesthetic/index.html` | `samples/aesthetic/js/config.js` | `./js/config.js` / `js/config.js` | `/js/config.js` / `/samples/.../config.js` |
| `samples/aesthetic/index.html` | `samples/aesthetic/js/aesthetic.js` | `./js/aesthetic.js` / `js/aesthetic.js` | `/js/aesthetic.js` |
| `samples/aesthetic/index.html` | `index.html` (ポータル復帰) | `../../index.html` | `/index.html` / `../index.html` |

---

## 5. 新規要件に対するテスト仕様・検証項目定義

今回追加される4大要件（R1〜R4）に対し、テストスイートに追加すべき検証項目を以下のように定義・策定しました。

### 5.1 【R1】リアルタイム空き状況カレンダーUI & スロット判定テスト
- **TC-CAL-01: 14日間グリッド生成検証**
  - 今日の日付または翌日から起算して正確に14日分の日付ヘッダー（日付・曜日・土日祝スタイル）がDOM生成されること。
- **TC-CAL-02: 4枠スロット生成検証**
  - 各日に対して指定の4つの時間枠（`10:00`, `13:00`, `16:00`, `18:30`）が生成され、合計56枠（14×4）のスロットが存在すること。
- **TC-CAL-03: 空き状況ステータス表示（◯・△・✕・休）検証**
  - `◯`（空き: available）
  - `△`（残り1枠: few）
  - `✕`（満席: full）
  - `休`（定休日: closed / holiday）
  - それぞれに対応するCSSクラス（`.status-available`, `.status-few`, `.status-full`, `.status-closed`）とアクセシビリティ用 `aria-label` が正しく付与されていること。
- **TC-CAL-04: 定休日自動判定ロジック検証**
  - `config.js` で設定された定休日（例: 毎週水曜日、または特定休業日）に該当するスロットが自動的に `休` となり、予約不可状態（`disabled`）になっていること。
- **TC-CAL-05: 過去時間枠の非活性化検証**
  - 当日のすでに経過した時間枠は自動的に予約不可（`disabled` / `✕`）となること。

### 5.2 【R1】カレンダー ↔ 予約フォーム連動テスト
- **TC-INT-01: 予約枠タップ時のフォーム自動反映**
  - `◯` または `△` のスロットをクリックした際、予約モーダル/フォームの「ご希望日時」入力欄に選択された日付と時間（例: `2026年8月22日(土) 13:00`）が自動入力されること。
- **TC-INT-02: スムーズスクロール・モーダル自動連動**
  - スロットタップ時に予約入力セクションへのスムーズスクロールまたは予約モーダルの起動が行われること。
- **TC-INT-03: 満席・定休枠のクリック無効化**
  - `✕` または `休` のスロットをタップしてもフォーム連動や予約起動が発動せず、適切なツールチップまたはトーストが表示されること。
- **TC-INT-04: 選択中スロットのハイライト状態**
  - 選択されたスロットに `.is-selected` クラスが付与され、視覚的に明示されること。

### 5.3 【R2】Google Apps Script (`gas/Code.gs`) ＆ 導入手順書 (`gas/README.md`) 検証
- **TC-GAS-01: `gas/Code.gs` ファイル存在・構文検証**
  - `gas/Code.gs` が存在し、`doGet(e)`（空き枠取得API）および `doPost(e)`（予約登録・カレンダー登録・スプレッドシート記録・メール送信）のエントリポイントが実装されていること。
- **TC-GAS-02: GASペイロードスキーマ検証**
  - 予約送信時のJSONペイロード必須項目（`name`, `phone`, `email`, `plan`, `date`, `time`, `notes`, `bookingId`, `timestamp`）が定義されていること。
- **TC-GAS-03: GASレスポンススキーマ検証**
  - `doGet` で返却される空き枠JSON形式（`{ status: "success", data: { "YYYY-MM-DD": { "10:00": "◯", ... } } }`）の互換性。
- **TC-GAS-04: `gas/README.md` 手順書の完全性検証**
  - スプレッドシート作成、Apps Scriptエディタへの貼り付け、カレンダーID設定、ウェブアプリとしてのデプロイ（アクセス権: 全員）、Webhook URL取得の手順が3分で完了できるよう平易に記載されていること。

### 5.4 【R3】予約完了画面、.icsカレンダー生成、LINE連携テスト
- **TC-TNK-01: 予約完了（サンクス）画面DOM検証**
  - 予約完了時に予約番号（`#booking-id`）、予約内容サマリー、カレンダー追加ボタン、LINE公式ボタンが表示されること。
- **TC-TNK-02: 予約番号生成フォーマット検証**
  - 発行される予約番号が一意性のある形式（例: `LUM-YYYYMMDD-XXXX`）であること。
- **TC-TNK-03: Googleカレンダー追加URL生成検証**
  - `https://calendar.google.com/calendar/render?action=TEMPLATE&text=...&dates=...&details=...&location=...` のパラメータがURLエンコードされて正しく生成されること。
- **TC-TNK-04: Apple/iCal用 `.ics` ファイル生成検証**
  - RFC 5545規格に準拠したiCalendar文字列（`BEGIN:VCALENDAR`, `VERSION:2.0`, `BEGIN:VEVENT`, `SUMMARY`, `DTSTART`, `DTEND`, `DESCRIPTION`, `LOCATION`, `END:VEVENT`, `END:VCALENDAR`）がData URIまたはBlobとして生成・ダウンロード可能であること。
- **TC-TNK-05: LINE予約・問い合わせディープリンク生成検証**
  - LINE公式アカウントの友達追加URL / トーク起動URL（予約番号・選択コース・日時が事前入力されたテキストパラメータ付き）が生成されること。

### 5.5 【R3】フォールバック動的計算モードテスト
- **TC-FBK-01: GAS未設定時（URL空文字）の自動フォールバック**
  - `config.js` の `GAS_ENDPOINT` が空文字またはダミーの場合、JavaScriptエラーで処理が中断せず、自動的に動的計算モード（曜日・営業時間ルールに基づくリアルタイムスロット生成）に切り替わること。
- **TC-FBK-02: 通信エラー・タイムアウト時のフォールバック**
  - GASへのHTTPリクエストがタイムアウトまたはネットワークエラー（オフライン環境等）となった場合でも、画面が崩れずフォールバック表示を維持し、フォーム送信完了画面まで遷移できること。

### 5.6 【R2】設定一元管理ファイル (`samples/aesthetic/js/config.js`) 検証
- **TC-CFG-01: `config.js` ファイル構造・キー検証**
  - `CONFIG.GAS_ENDPOINT`: Webhook URL
  - `CONFIG.SALON_INFO`: サロン名、電話番号、住所、LINE公式URL
  - `CONFIG.BUSINESS_HOURS`: スロット定義（`10:00`, `13:00`, `16:00`, `18:30`）
  - `CONFIG.REGULAR_HOLIDAYS`: 定休日曜日リスト（例: `[3]` 水曜日）
  - `CONFIG.FALLBACK_MODE`: フォールバック有効化フラグ
- **TC-CFG-02: スクリプト読込順序の整合性**
  - `samples/aesthetic/index.html` で `config.js` が `aesthetic.js` より前に読み込まれていること。

---

## 6. テストスイート拡張・実行計画

### 6.1 テストスイート拡張方針
既存のテスト基盤を維持・発展させ、以下の通りテストファイルを更新・追加します。

```
tests/
├── run_all_tests.py         # [更新] 新規テストケース（TC-CAL, TC-GAS, TC-TNK, TC-FBK, TC-CFG）をTier 1〜3に統合
├── test_server.py           # [既存維持] サブディレクトリ＆ルート配信テスト
├── validate_links.py        # [更新] gas/README.md, config.js, 新規アセットのリンク実在性検証
├── validate_pasona_dom.py   # [更新] カレンダーグリッドDOM、サンクス画面DOM、config連動DOMの検証追加
├── test_interactive_ui.py   # [更新] カレンダースロット選択、フォーム自動入力、.ics生成、フォールバック計算ロジック検証追加
└── test_gas_integration.py  # [新規またはtest_interactive_uiに統合] GAS Code.gs構文・ペイロード検証
```

### 6.2 実行・合否判定基準
1. **全テストケース 100% 合格（Exit Code 0）**
2. **404 / ルート相対パス（`/`） 0件**
3. **テスト実行時間: 3秒以内（超高速ローカル検証）**

---

## 7. デプロイ前チェックリスト

- [ ] `samples/aesthetic/js/config.js` が作成され、設定が一元管理されている
- [ ] `gas/Code.gs` および `gas/README.md` が作成され、構文・手順が記載されている
- [ ] `samples/aesthetic/index.html` に空き状況カレンダー、予約フォーム自動連動、予約完了サンクス画面（.ics / Googleカレンダー / LINE連携）が実装されている
- [ ] `samples/aesthetic/js/aesthetic.js` にフォールバック動的計算ロジックが組み込まれている
- [ ] `python tests/run_all_tests.py` を実行し、全テストケースが 100% PASS することを確認
- [ ] `git status` で差分を確認し、コミットメッセージを作成
- [ ] `git push origin main` で GitHub リポジトリ（`https://github.com/tadaodev/sales_lp.git`）へプッシュ
- [ ] GitHub Pages（`https://tadaodev.github.io/sales_lp/`）上でポータルおよびエステサロンLPの動作を確認
