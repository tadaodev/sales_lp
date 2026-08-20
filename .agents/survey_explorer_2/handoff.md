# Handoff Report — Explorer 2 (GAS Backend, Config & Data Exchange Architecture)

## 1. Observation
1. **リポジトリ内のGAS関連ファイル状況**:
   - `find_by_name` (Pattern: `*gas*`) の実行結果: `Found 0 results`。
   - `gas/` ディレクトリおよび `gas/Code.gs`, `gas/README.md` はリポジトリ内に存在せず、新規作成が必要。
2. **設定ファイルおよびフロントエンドJS状況**:
   - `samples/aesthetic/js/config.js` は未作成（`list_dir` で `samples/aesthetic/js` には `aesthetic.js` のみ存在）。
   - `samples/aesthetic/js/aesthetic.js` (lines 187-232): 予約モーダル送信時に `e.preventDefault()` 後、ローカルのバリデーションのみ行い `successState.style.display = 'block'` を切り替えるモック処理となっている。
   - `samples/aesthetic/index.html` (lines 1117-1218): `#booking-modal` に基本的なフォームと固定文言の成功状態カードがあるが、空き枠カレンダー（14日×4枠）UI、Googleカレンダー追加ボタン、.icsダウンロードボタン、LINE公式アカウント連携ボタンは未配置。
3. **テストインフラ状況**:
   - `tests/run_all_tests.py` (lines 8-12) および `tests/test_interactive_ui.py` (lines 248-297): `UI-MOD-01`, `UI-MOD-02` 等でフォーム構造やEscapeキー等の基本動作を検証中。空き枠カレンダーUIやGASフォールバックのテストケースは未追加。

## 2. Logic Chain
- **Step 1 (Observation 1より)**: サーバー代0円でGoogleカレンダーと完全同期し、予約台帳化・自動返信メールを実現するためには、スタンドアロン型またはスプレッドシート紐付きのGoogle Apps Script (`gas/Code.gs`) を新規設計・提供する必要がある。
- **Step 2 (Observation 2より)**: GitHub Pages上の静的サイトからGASへ予約送信を行う際、ブラウザのCORS制限（OPTIONSプリフライト拒否）を回避するため、リクエストは `Content-Type: text/plain;charset=utf-8` によるJSON文字列POSTとし、GAS側で `JSON.parse(e.postData.contents)` して受領するプロトコルを採用する必要がある。
- **Step 3 (Observation 2より)**: サロン情報、営業時間、定休日、14日間の4スロット定義、プランマスター、GAS Webhook URLを一元管理する `samples/aesthetic/js/config.js` を分離作成し、`window.SALON_CONFIG` として提供することで、サイト保守作業を完全ゼロ化・設定変更を容易にする。
- **Step 4 (Observation 2より)**: GAS Webhook未設定時やネットワーク障害時でも予約UIが停止しないよう、日付文字列・時間枠・ソルト値から32bitハッシュを計算する「決定論的フォールバックシミュレーションアルゴリズム」を設計することで、リロードしても同一枠のステータス（◯/△/✕/休）が一貫して自然に表示される。
- **Step 5 (Observation 2より)**: 予約完了画面において、GoogleカレンダーWeb登録URLパラメータ構築、Pure JSによる `.ics` ファイル（VALARM 2時間前リマインド付き）動的Blob生成、および公式LINEの `oaMessage` 予約番号プリセット起動URLを策定し、ドタキャン防止と顧客エンゲージメントを最大化する。

## 3. Caveats
- Google Apps Scriptの初回デプロイ時、Googleのセキュリティ警告（「このアプリはGoogleによって確認されていません」）が表示されます。これは全GAS Web App共通の仕様であり、手順書（`gas/README.md`）で「詳細」→「安全ではないページに移動（続行）」を押す手順を明記する必要があります。
- LINE URL scheme（`https://line.me/R/oaMessage/...`）はスマートフォン向けスキームであるため、PCブラウザ環境では標準の友だち追加URL（`https://line.me/R/ti/p/...`）へのフォールバックを組み込む必要があります。

## 4. Conclusion
GASバックエンド（`gas/Code.gs`）、3分導入手順書（`gas/README.md`）、設定一元管理モジュール（`samples/aesthetic/js/config.js`）、決定論的フォールバックシミュレーション、およびカレンダー/LINE外部連携仕様の調査・設計を完了しました。
詳細な設計仕様書およびコード定義は `c:/Project/事業案/05_LP作成/.agents/survey_explorer_2/survey_report.md` にすべて記載済みです。

## 5. Verification Method
- **調査成果物の確認**:
  - `view_file` で `c:/Project/事業案/05_LP作成/.agents/survey_explorer_2/survey_report.md` を確認。
  - 各セクション（GASバックエンド、README手順書、config.js、フォールバックアルゴリズム、ICS/Google Cal/LINE連携）の仕様整合性を確認。
- **実装時の検証基準**:
  - `gas/Code.gs` および `samples/aesthetic/js/config.js` が配置され、`tests/run_all_tests.py` でカレンダーや設定読み込みがPASSすること。
