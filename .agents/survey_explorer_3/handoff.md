# Handoff Report: Test Infrastructure, Git Status & Deployment Survey (Explorer 3)

## 1. Observation

- **テスト基盤構造 (`tests/`)**:
  - `tests/run_all_tests.py` (563行): 4層（Tier 1〜Tier 4）の統合テストランナー。Python標準ライブラリ（`sys`, `os`, `re`, `html.parser`, `urllib`, `http.server`, `pathlib`, `json`, `socket`, `threading`）のみで構成され、外部依存（pytest, npm, selenium等）は一切不要（`PROJECT.md` 4行目, `TEST_READY.md` 4行目）。
  - `tests/test_server.py` (269行): ローカル静的HTTPテストサーバー（ルート配信およびサブディレクトリ `/lp-portal-hub/` 配信の双方を検証）。
  - `tests/validate_links.py` (318行): ルート相対パス（`/`）の検出（Rule-L1）、ローカルファイル実在性（Rule-L2）、Windows/Linux間大文字小文字整合性チェック、ページ内・跨ぎアンカー（#id）検証。
  - `tests/validate_pasona_dom.py` (360行): 新PASONA全7セクション、H1単一性・階層ジャンプなし、SEOタグ、アクセシビリティ検証。
  - `tests/test_interactive_ui.py` (324行): ポータルカテゴリフィルタ、FAQアコーディオン、追従CTA、予約モーダルバリデーションのDOM/JSシミュレーション。

- **プロジェクト構成 & パス規約**:
  - ルートポータル: `index.html`, `css/reset.css`, `css/tokens.css`, `css/portal.css`, `js/portal.js`
  - エステサロンLP: `samples/aesthetic/index.html`, `samples/aesthetic/css/aesthetic.css`, `samples/aesthetic/js/aesthetic.js`
  - ポータル ↔ LP 双方向リンク: `index.html` から `./samples/aesthetic/index.html`、`samples/aesthetic/index.html` から `../../index.html`。
  - 全アセットが厳格な相対パスで統一されており、GitHub Pagesのプロジェクトサブディレクトリ（`/sales_lp/`）で404が発生しない設計になっている。

- **Git & デプロイ設定**:
  - リポジトリURL: `https://github.com/tadaodev/sales_lp.git`
  - 本番ブランチ: `main`
  - ホスティング環境: GitHub Pages（静的ホスティング、サーバー代0円、バックエンドはGAS Webhook連動）

- **新規要件（`ORIGINAL_REQUEST.md` R1〜R4）の差分**:
  - `samples/aesthetic/index.html`: 直近14日間×4時間枠（10:00/13:00/16:00/18:30）の空き状況カレンダーUI、予約完了（サンクス）画面、Googleカレンダー追加ボタン、.icsダウンロードボタン、LINE連携ボタンの追加が必要。
  - `samples/aesthetic/js/config.js`: 新規作成（GAS Webhook URL、営業時間、定休日、フォールバック設定）。
  - `samples/aesthetic/js/aesthetic.js`: カレンダー描画、スロット判定（◯・△・✕・休）、スロットタップ連動フォーム入力、フォールバック動的計算、.icsファイル生成ロジックの追加が必要。
  - `gas/Code.gs` & `gas/README.md`: 新規作成（Googleカレンダー空き枠取得・予定登録・スプレッドシート記録・確認メール送信、3分導入手順書）。

---

## 2. Logic Chain

1. **ゼロ依存テストアーキテクチャの有効性**:
   - `tests/run_all_tests.py` は純粋なPython標準ライブラリのみで実装されているため、環境構築やビルドステップなしに即座に実行可能である。
   - 既存のテストスイート（Tier 1〜4）はDOM構文解析、静的HTTPサーバー、大文字小文字チェック、リンク検証、JSロジックシミュレーションを備えており、拡張性が極めて高い。

2. **新機能検証のテストスイート統合**:
   - 新規要件である「空き状況カレンダー（14日×4枠）」「スロット判定（◯/△/✕/休）」「定休日判定」「スロットタップ→フォーム反映」「GASペイロードスキーマ」「.ics生成」「フォールバック動的計算」「config.js一元管理」は、既存の `tests/run_all_tests.py`, `tests/validate_pasona_dom.py`, `tests/test_interactive_ui.py`, `tests/validate_links.py` にテストケース（`TC-CAL`, `TC-GAS`, `TC-TNK`, `TC-FBK`, `TC-CFG`）として自然に拡張可能である。

3. **GitHub Pages配信と相対パスの安全性**:
   - `validate_links.py` の `Rule-L1`（ルート相対 `/` の禁止）および `Rule-L2`（ローカルファイル実在性＋大文字小文字チェック）により、GitHub Pages（サブディレクトリ配信）での404発生リスクを完全に事前検知・排除できる。

4. **デプロイフローの確立**:
   - 実装完了後、`python tests/run_all_tests.py` を実行して100% PASS（Exit Code 0）を確認した上で、`git commit` & `git push origin main` を行うことで、安全かつ確実にGitHub Pages本番環境を更新できる。

---

## 3. Caveats

1. **GASの実機通信テスト**:
   - Google Apps ScriptのWebアプリURLはユーザーまたはデプロイ担当者がGASエディタ上で発行するものであるため、テストスイート内では「GAS未設定時のフォールバック動的計算テスト」および「GASリクエスト/レスポンスのペイロードスキーマ検証」を行い、実機URLへのライブ通信テストはオプショナル（設定時のみ実行）とする。
2. **Apple Calendar (.ics) のブラウザ互換性**:
   - `.ics` の生成はData URI (`data:text/calendar;charset=utf8,...`) またはBlob URLによるダウンロードリンクとして実装し、iOS Safariおよびデスクトップ環境で標準動作することを確認する。

---

## 4. Conclusion

- **テスト基盤・Git設定・デプロイ環境の全貌が完全に把握され、新機能検証に必要な全テスト要件が定義されました。**
- 既存のPython標準ライブラリによる4層テストスイートを拡張し、新機能（カレンダー・GAS・サンクス画面・フォールバック・config）に対する自動検証テストケースを追加することで、品質を100%担保した状態でのGitHub Pages本番デプロイが可能です。
- 詳細な調査結果およびテストケース定義は `c:/Project/事業案/05_LP作成/.agents/survey_explorer_3/survey_report.md` に記録しました。

---

## 5. Verification Method

### 1. 既存・新規テストスイートの実行コマンド
```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8;
$env:PYTHONUTF8=1;
python tests/run_all_tests.py
```
- **合格基準**: 全テストケースが `[PASS]` となり、終了コードが `0`（Exit Code 0）であること。

### 2. 個別テストモジュールの検証コマンド
```powershell
# 1. 静的HTTPサーバー＆サブディレクトリシミュレーション
python tests/test_server.py

# 2. 厳格相対リンク＆404・大文字小文字検証
python tests/validate_links.py

# 3. 新PASONA DOM＆見出し・SEO検証
python tests/validate_pasona_dom.py

# 4. インタラクティブUI＆JSロジック検証
python tests/test_interactive_ui.py
```

### 3. デプロイ前Git整合性確認
```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8;
git status
git remote -v
```
- **確認事項**: リモートが `https://github.com/tadaodev/sales_lp.git`、ブランチが `main` であること。
