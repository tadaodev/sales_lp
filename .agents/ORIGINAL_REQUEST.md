# Original User Request

## 2026-08-20T14:17:46Z

<USER_REQUEST>
GitHub Pages上でサイトオーナーのWebサイト保守作業を完全ゼロにし、Googleカレンダーと完全自動連動する「空き状況カレンダー（◯・△・✕）」・「WEB予約自動登録」・「顧客台帳自動生成」・「メール通知」機能を備えたエステサロンLPおよびトップポータルの強化・自動検証・GitHub Pages本番反映。

Working directory: c:/Project/事業案/05_LP作成
Integrity mode: development

## Requirements

### R1. リアルタイム空き状況カレンダーUI（`samples/aesthetic/`）
直近14日分の日付 × 4つの時間枠（10:00/13:00/16:00/18:30）の空き状況（◯：空き、△：残り1枠、✕：満席、定休）を視覚的に表示するレスポンシブなカレンダーグリッドを実装する。
「◯」または「△」のスロットをタップすると、予約フォームの希望日時が自動入力され、スムーズに予約入力エリアへスクロール連動すること。

### R2. Googleカレンダー＆スプレッドシート完全自動連動（サーバー代0円）
店舗オーナーが普段スマホで使っているGoogleカレンダーの予定状況を自動取得して空き枠を判定し、フォームからの予約送信時に「Googleカレンダーへの自動予定登録」「Googleスプレッドシートへの予約顧客台帳自動記録」「自動確認メール送信」を行うGoogle Apps Script（`gas/Code.gs`）および誰でも3分で設定できる手順書（`gas/README.md`）を作成する。
また、設定一元管理ファイル（`samples/aesthetic/js/config.js`）でGASのWebhook URLや営業時間、定休日を簡単に切り替え可能にする。

### R3. 予約完了（サンクス）画面 ＆ ドタキャン防止・LINE連携
予約送信後に上質な完了画面を表示し、自動発行予約番号、顧客自身のGoogleカレンダー/Appleカレンダー（.ics）一発追加機能、選択コースが自動入力された状態のLINE公式アカウント起動ボタンを実装する。GAS未設定時や通信障害時でも動的計算モードで破綻なく動作する堅牢なフォールバックを備えること。

### R4. 自動テスト検証 ＆ GitHub Pages本番デプロイ
カレンダー生成・スロット判定・GAS連携ペイロード・相対パス整合性のテストケースを更新・実行し、100%パスを確認した上で、Gitコミットを行いGitHubリポジトリ（`https://github.com/tadaodev/sales_lp.git` の `main` ブランチ）へプッシュしてGitHub Pages本番環境を更新する。

## Acceptance Criteria

### 画面・機能要件
- [ ] エステサロンLPに直近14日間の空き状況カレンダー（◯・△・✕・定休）が表示され、タップで予約フォームに日時が自動連動する
- [ ] `gas/Code.gs` および導入手順書 `gas/README.md` が整備され、Googleカレンダー・スプレッドシート自動台帳化が可能な状態になっている
- [ ] `config.js` でGAS URLや定休日・営業時間を一元設定できる
- [ ] 予約完了画面で顧客用カレンダー追加（Google/Apple .ics）およびLINE 1タップ予約が機能する
- [ ] GAS未接続時でもエラーで画面が停止せずフォールバック動作する

### 検証・デプロイ品質
- [ ] 自動テストスイートが全件PASSする
- [ ] GitHubの `main` ブランチに正常にプッシュされ、GitHub Pagesでアクセス可能になっている

</USER_REQUEST>

## 2026-08-20T23:40:16Z

<USER_REQUEST>
GitHub Pages対応のLPポータルに、第2弾サンプルとして新PASONAの法則とシズル感あふれるモダンUIを採用した「本格石窯ピッツァ＆手打ちパスタの親しみやすいカジュアルイタリアン（TRATTORIA & PIZZERIA BELLA TAVOLA）」のサンプルLPを構築し、生成済み料理画像アセットの組み込み、席予約・カレンダー連動、およびトップポータルからの選択動線を実装・本番デプロイする。

Working directory: c:/Project/事業案/05_LP作成
Integrity mode: development

## 料理・店舗ビジュアルアセット（生成済み）
- `samples/italian/assets/images/trattoria_interior.jpg`（温かみあるトラットリア店内）
- `samples/italian/assets/images/pizza_margherita.jpg`（薪窯焼き立てマルゲリータ）
- `samples/italian/assets/images/handmade_pasta.jpg`（手打ちタリアテッレ ボロネーゼ）
- `samples/italian/assets/images/dolce_tiramisu.jpg`（自家製濃厚ティラミス＆エスプレッソ）

## Requirements

### R1. イタリア料理店 サンプルLP（`samples/italian/index.html`）
新PASONAの法則（Problem・Affinity・Solution・Offer・Narrowing Down・Action）に基づき、食欲とシズル感を刺激するコピーライティング（本場ナポリ仕込みの薪窯ピッツァ・毎朝手打ちの生パスタ・厳選オーガニックワイン・記念日＆歓送迎会プラン）と、暖色系（テラコッタ・ワインレッド・オリーブグリーン・木目調）のモダンUIを持つLPを実装する。
シェフのこだわりストーリー、名物料理・コースメニュー一覧（松竹梅コース＆ランチ）、リアルタイム席空き状況カレンダー、Web席予約/LINE予約、店舗アクセス案内（地図・営業時間）を含む。

### R2. 生成済み料理画像アセットの最適配置とビジュアル演出
`samples/italian/assets/images/` 配下の高解像度実写画像をヒーロー・メニュー紹介・こだわり・ドルチェ各セクションに最適配置し、シズル感のある写真ギャラリーやホバー演出を実装する。

### R3. 設定一元管理（`samples/italian/js/config.js`）＆ Googleカレンダー自動同期対応
エステLPと同様の完全自動化設計を踏襲し、`config.js` でGAS Webhook URL、営業時間（ランチ・ディナー2部制）、定休日、席数設定を一元管理する。未設定時でも動的計算フォールバックで席カレンダー（◯・△・✕）と予約シミュレーションが完結動作すること。

### R4. トップポータル（`index.html`）統合 ＆ 双方向ナビゲーション
トップポータルのジャンルフィルタ「飲食・店舗」に本イタリアンLPのカード（サムネイル・新PASONA特徴タグ・直接リンク）を追加し、エステLPと並ぶ「公開中」サンプルとして連携する。イタリアンLP側からもポータルへの戻りリンクを完備する。

### R5. 自動テスト検証 ＆ GitHub Pages本番デプロイ
リンク整合性（404ゼロ）、DOM構造、レスポンシブ表示（375px〜1920px）、席予約カレンダー連動の自動テストスイートを拡張・全件合格させ、GitHubの `main` ブランチへプッシュして即座にGitHub Pages本番環境を更新する。

## Acceptance Criteria

### 画面・機能要件
- [ ] トップポータル（`index.html`）から `samples/italian/index.html` への遷移、およびイタリアンLPからトップへの復帰リンクが正常に動作する
- [ ] イタリアンLP内に生成済みの料理・店内写真が適切に配置され、シズル感のある洗練されたデザインになっている
- [ ] 新PASONA全セクション（こだわり、コース料金、利用シーン・お客様の声、席予約カレンダー、FAQ等）が実装されている
- [ ] モバイル（375px〜）からPCまで完全レスポンシブで、下部追従の席予約CTAが機能する
- [ ] 席予約完了画面で予約番号発行、Google/Appleカレンダー登録、LINE連動が動作する

### 検証・品質
- [ ] 全自動テストが100%パスする
- [ ] GitHubの `main` ブランチにプッシュされ、GitHub Pagesで公開される

</USER_REQUEST>

## 2026-08-21T08:25:33Z

<USER_REQUEST>
GitHub Pages対応のLPポータルに、第3弾サンプルとして新PASONAの法則（リスク回避・課題解決型）および重厚感と信頼性あふれるモダンUIを採用した「企業法務・労務コンサルティング・契約書トラブル解決に強い士業・法務総合事務所（LUMEN LEGAL CONSULTING）」の特化LPを構築し、AI生成ビジュアルアセット、オンライン＆対面2WAY相談予約カレンダー、料金体系（松竹梅）、ポータル連携、および自動テスト・本番反映を実施する。

Working directory: c:/Project/事業案/05_LP作成
Integrity mode: development

## Requirements

### R1. 士業・法務コンサルティング特化 サンプルLP（`samples/legal/index.html`）
新PASONAの法則（Problem：契約・労務・未払いリスク / Affinity：代表弁護士・専門家の寄り添いストーリー / Solution：予防法務×スピード解決の3大強み / Offer：松竹梅明朗顧問・スポットプラン / Narrowing Down：毎月先着10社無料相談枠 / Action：14日間相談予約カレンダー & LINE即時相談）に基づいた高成約型コピーライティングと、信頼感・権威性のあるネイビー＆シャンパンゴールドのモダンGlassmorphism UIを実装する。

### R2. 高解像度AI実写ビジュアルアセットの生成と組み込み
Gemini画像生成ツールを活用し、以下の高解像度実写画像を生成して `samples/legal/assets/images/` に配置・最適化する。
1. `hero_consultation.jpg`: モダンなエグゼクティブルームで親身に相談を受ける知的な日本人法務コンサルタント・弁護士
2. `partner_portrait.jpg`: 誠実で信頼感あふれる代表パートナーの自然なポートレート
3. `legal_contract_review.jpg`: 契約書・重要書類を緻密にチェックするプロフェッショナルな手元
4. `boardroom_meeting.jpg`: 洗練されたカンファレンスルームでの戦略的コンサルティング風景

### R3. 相談予約カレンダー（Zoomオンライン / 対面2WAY）＆ 設定一元化
`samples/legal/js/config.js` でGAS Webhook URL、相談枠（10:00/13:00/15:30/18:00）、定休日を一元管理し、Googleカレンダー同期・動的フォールバック計算・予約完了画面（Google/Appleカレンダー登録、LINE相談連動）を実装する。

### R4. トップポータル（`index.html`）統合 ＆ 双方向ナビゲーション
トップポータルの「士業・法務」ジャンルに公開中（LIVE DEMO）カードを追加し、エステ・イタリアンと並ぶ3大看板として連携する。ヘッダーのクイックリンクや双方向復帰リンクを整備する。

### R5. 自動テスト検証 ＆ GitHub Pages本番デプロイ
リンク整合性（404ゼロ）、DOM構造、レスポンシブ表示（375px〜1920px）、相談予約カレンダー連動の自動テストスイートを拡張・100%パスさせ、GitHubの `main` ブランチへプッシュして即座にGitHub Pages本番環境を更新する。

## Acceptance Criteria

### 画面・機能要件
- [ ] トップポータル（`index.html`）から `samples/legal/index.html` への遷移、および士業LPからポータルへの復帰リンクが正常に動作する
- [ ] 士業LP内に新PASONA全セクション（リスク提起、代表メッセージ、3大強み、松竹梅料金、14日予約カレンダー、FAQ）が実装されている
- [ ] Gemini生成の弁護士/法務実写写真がヒーロー・代表紹介・強みセクションに美しく配置されている
- [ ] モバイル（375px〜）からPCまで完全レスポンシブで、下部追従の無料相談CTAが機能する
- [ ] 相談予約完了画面で予約番号発行、Google/Appleカレンダー登録、LINE相談連動が動作する

### 検証・品質
- [ ] 全自動テストスイートが100%パスする
- [ ] GitHubの `main` ブランチにプッシュされ、GitHub Pagesで公開される

</USER_REQUEST>
