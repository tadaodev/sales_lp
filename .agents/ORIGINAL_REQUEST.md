# Original User Request

## 2026-08-20T13:28:26Z

GitHub Pages（プロジェクトサイト）での公開に対応した、業種別LPサンプル集のトップポータルページ（ジャンル別選択ハブ）および新PASONAの法則・モダンUIに基づくエステサロン向けサンプルLPを構築・検証する。

Working directory: c:/Project/事業案/05_LP作成
Integrity mode: development

## Requirements

### R1. トップポータル（LPジャンル選択ハブ）
GitHub Pagesサブディレクトリ配信（`https://<username>.github.io/<repo>/`）に対応した相対パス構成で、業種別（美容・SaaS・士業・教育・飲食・不動産等）のフィルタリング/選択ができるポータル画面（`index.html`）を実装する。
エステサロンLP（`samples/aesthetic/index.html`）へのリンクカードおよび将来の拡張を見据えた他ジャンルの予告カードを配置する。

### R2. エステサロン向けサンプルLP（`samples/aesthetic/index.html`）
新PASONAの法則（Problem・Affinity・Solution・Offer・Narrowing Down・Action）に基づいた成約率重視のセールスコピーと、ラグジュアリー感のあるモダンUI（Glassmorphism、サロン特化カラーパレット、フォント）を持つエステサロンLPを実装する。
ファーストビュー、悩み共感リスト、3つの選ばれる理由、Before/After、松竹梅料金プラン、限定オファー、予約フォーム/LINE予約CTA、よくある質問（FAQ）を含む。
プロジェクト内に組み込まれているLP作成スキル（`c:/Project/事業案/05_LP作成/.agents/skills/lp-pasona` や `ui-ux-pro-max` 等）の知見・設計を最大限活用して品質を高めること。

### R3. レスポンシブ＆インタラクティブUI
スマートフォン（375px〜）からデスクトップまで完全対応し、モバイルスクロール時に下部に追従する予約CTAバー、FAQアコーディオン開閉、スムーススクロール、ポータルへの戻りナビゲーションを実装する。

### R4. 客観的検証と品質保証
静的ホスティング環境（ローカルHTTPサーバー）での配信確認、全リンクの相対パス整合性（404エラーなし）、コンソールエラーのゼロ確認、レスポンシブ崩れ防止を検証する自動テスト・チェックを実行し、検証結果を記録する。

## Acceptance Criteria

### 画面・機能要件
- [ ] `index.html`（トップ）から `samples/aesthetic/index.html` への遷移、およびエステLPからトップへの復帰リンクが相対パスで正常に動作する
- [ ] ポータルページでカテゴリ切り替え・LPカード表示が正しく行える
- [ ] エステサロンLPに新PASONA全セクション（Problem/Affinity/Solution/Offer/Narrowing Down/Action/FAQ）が過不足なく含まれている
- [ ] スマホ表示時に下部固定の予約CTAバーが正しく表示・機能する
- [ ] FAQアコーディオン等のインタラクティブ要素がエラーなく動作する

### 検証・品質
- [ ] 外部依存の欠損や404リンクがなく、ブラウザコンソールにエラーが出ない
- [ ] 静的ホスティング互換性が確認されている
