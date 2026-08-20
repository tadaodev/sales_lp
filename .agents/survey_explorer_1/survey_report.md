# Aesthetic Salon LP — UI & Frontend Architecture Survey Report

**Author**: survey_explorer_1 (UI & Frontend Architecture Explorer)  
**Date**: 2026-08-20  
**Target Repository**: `c:/Project/事業案/05_LP作成` (`samples/aesthetic/` & root portal)

---

## 1. Executive Summary

本調査は、エステサロン向けLP（`samples/aesthetic/`）およびトップポータル（`index.html`）を対象に、**「直近14日分×4枠のリアルタイム空き状況カレンダーUI」**、**「タップ連動の日時自動入力＆スムーズスクロール」**、**「上質な予約完了（サンクス）画面（Google/Appleカレンダー追加・LINE公式連携）」**、および**「設定一元管理（`config.js`）と堅牢なフォールバック機能」**を安全かつ美しく導入するためのUI/フロントエンド設計調査報告です。

現行コードベースは新PASONAの法則に基づく7大セクション、3層デザイントークン構造（`tokens.css`）、Glassmorphism調ラグジュアリーデザイン、アクセシブルなモーダルおよびFAQアコーディオンを既に完備しており、これらの既存構造を破壊することなく、外科手術的（Surgical）に高度な予約体験を統合可能な設計仕様を策定しました。

---

## 2. Current Architecture & Codebase Inspection

### 2.1 File Structure & Line Metrics
| File Path | Lines | Size (Bytes) | Role & Status |
|---|---|---|---|
| `samples/aesthetic/index.html` | 1,224 | 68,143 | 新PASONAエステサロンLP本編（Problem〜Action、FAQ、Modal） |
| `samples/aesthetic/css/aesthetic.css` | 2,078 | 45,556 | サロン特化ラグジュアリースタイル、モーダル、固定バー |
| `samples/aesthetic/js/aesthetic.js` | 261 | 7,748 | バニラJS（固定CTA制御、FAQ開閉、モーダル制御、スムーススクロール） |
| `css/tokens.css` | 244 | 9,322 | 3層デザイントークン（Primitive, Semantic, Component） |
| `index.html` (Portal Root) | 487 | 28,789 | 業種別LPポータルハブ（7ジャンルタブ切替、深層リンク） |
| `js/portal.js` | 164 | 5,277 | ポータル用カテゴリフィルタリング＆URLハッシュ連動 |
| `tests/run_all_tests.py` | 563 | 31,042 | 4-Tier（基本機能・境界値・複合・実シナリオ）自動テスト |

### 2.2 Current Booking Form Analysis (`samples/aesthetic/index.html:1115-1218`)
- **モーダル構造**: `<div id="booking-modal" class="modal-overlay">` 内に `<form id="modal-booking-form">` が配置。
- **入力項目**:
  1. `form-name`: お名前（テキスト、`required`）
  2. `form-phone`: お電話番号（tel、`required`）
  3. `form-email`: メールアドレス（email、`required`）
  4. `form-plan`: ご希望プラン（select、`required`、梅/竹/松）
  5. `form-datetime`: ご希望日時（テキスト、`required`、現在プレースホルダー手入力）
  6. `form-notes`: お悩み・ご要望（textarea、任意）
- **バリデーション & 完了制御**:
  - `aesthetic.js` 内で `required` チェックおよび簡易メール正規表現チェック。
  - 成功時は `modal-booking-form` を `display: none` にし、`#modal-success-state` を表示。

---

## 3. Detailed Technical Specifications for New Requirements

### 3.1 R1: 14-Day x 4-Slots Availability Calendar UI (`#availability-calendar`)

#### (1) 配置場所（Layout Placement）
- **メイン設置箇所**: PASONAの「Action（行動喚起）」セクション（`#action`）の直前、または `#action` 内上部。
  - 訪問者がプランや選ばれる理由、限定性を読み進めた直後に、**「直近14日間のリアルタイム空き状況」**をひと目で確認できるように配置。
- **モーダル内連動**: モーダル内でも選択中日時が表示され、再選択やカレンダー展開ができるUIを実装。

#### (2) 時間枠とステータス定義
- **時間枠（4枠/日）**:
  - 枠1: `10:00`
  - 枠2: `13:00`
  - 枠3: `16:00`
  - 枠4: `18:30`
- **ステータス記号と表示仕様**:
  - `◯`（空き / Available）: タップ可能。シャンパンゴールドまたはグリーンの上品な丸バッジ。
  - `△`（残り1枠 / Few Left）: タップ可能。ゴールドのアクセント＋「残り1枠」強調。
  - `✕`（満席 / Fully Booked）: タップ不可（`disabled` / `aria-disabled="true"`）。スレートグレーで透過表示。
  - `休` / `定休`（定休日 / Closed）: タップ不可。毎週火曜日および休業日。斜線パターンまたは落ち着いたグレーアウト。

#### (3) レスポンシブグリッド設計
- **PC/タブレット（768px以上）**:
  - 14日分（または1週間×2段）の横スクロール/グリッド表示。
  - 曜日ヘッダー（月〜日）、土曜日は青（`#2563EB`）、日曜・祝日は赤（`#DC2626`）のラグジュアリートーン。
  - 左端に固定時間ラベル列。
- **スマホ（375px〜767px）**:
  - 時間列を左端固定（`position: sticky; left: 0;`）。
  - 日付列は指先でスムーズにスワイプ可能な横スクロールコンテナ（`-webkit-overflow-scrolling: touch;`）。
  - 各スロットはApple HIG / WCAG基準（最小44px × 44px）のタップターゲットを確保。
  - 上部に「◯: 空き  △: 残り1枠  ✕: 満席  休: 定休日」の視覚的凡例（Legend）を配置。

---

### 3.2 Tap-to-Form Auto-Fill & Smooth Scroll Mechanism

#### (1) スロットタップ時の動作シーケンス
1. **スロットクリック検知**: ユーザーがカレンダーの `◯` または `△` をタップ。
2. **データ抽出**:
   - `data-date="2026-08-22"`
   - `data-day="土"`
   - `data-time="13:00"`
   - `data-status="available"`
3. **アクティブ状態の付与**: クリックされたスロットに `.is-selected` クラスを付与（他スロットの選択状態をクリア）。
4. **フォーム自動入力**:
   - 整形文字列: `2026年8月22日(土) 13:00〜`
   - `#form-datetime`（およびインライン予約フォームの日時フィールド）の `value` に即座にセット。
   - 「選択中日時: 2026年8月22日(土) 13:00〜」を示す確認バッジを表示。
5. **スムーズスクロール連動**:
   - 画面がカレンダー位置にある場合、予約フォーム（またはモーダル）へヘッダー高さを考慮したオフセットでスムーズスクロール（`window.scrollTo({ top: offset, behavior: 'smooth' })`）。
   - お名前入力欄（`#form-name`）へ自動フォーカスを移動。

---

### 3.3 R3: Booking Thank-You Screen, Calendar Sync & LINE Integration

#### (1) 画面遷移アーキテクチャ（Modal View Transition）
GitHub Pages上の静的ホスティングにおいて、外部ページへのフルリロードを伴う遷移を行うと状態保持が困難になるため、**モーダル内 / フォームエリア内のシームレスな上質サンクスビュー切り替え**を採用します。

#### (2) サンクスビューの構成要素
1. **完了ヘッダー**:
   - ゴールドのチェックアニメーションアイコン
   - 「ご予約お申し込みを受け付けました」
2. **自動発行予約番号（Reservation ID）**:
   - 形式: `LUM-YYYYMMDD-XXXX`（例: `LUM-20260822-7842`）
3. **予約内容サマリーカード**:
   - お客様名（例: `銀座 花子 様`）
   - 選択コース（例: `竹プラン（80分）初回 ¥7,980 (税込)`）
   - ご予約日時（例: `2026年8月22日(土) 13:00〜14:20`）
   - サロン所在地・アクセス（銀座駅A3出口 徒歩2分）
4. **Googleカレンダー一発登録ボタン**:
   - Google Calendar Web登録URLを動的生成して別タブ起動:
     ```javascript
     const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('【エステ予約】LUMIÈRE ' + planName)}&dates=${startISO}/${endISO}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(salonAddress)}`;
     ```
5. **Apple / Outlookカレンダー（.icsファイル）ダウンロードボタン**:
   - RFC 5545規格に準拠した `.ics` 文字列をJavaScript `Blob` で動的生成し、1タップでダウンロード・端末カレンダー登録可能に:
     ```javascript
     const icsContent = [
       'BEGIN:VCALENDAR',
       'VERSION:2.0',
       'PRODID:-//LUMIERE//Salon Booking//JA',
       'CALSCALE:GREGORIAN',
       'METHOD:PUBLISH',
       'BEGIN:VEVENT',
       `UID:lum-${resId}@lumiere-salon.jp`,
       `DTSTAMP:${nowUtc}`,
       `DTSTART:${startUtc}`,
       `DTEND:${endUtc}`,
       `SUMMARY:【エステ予約】LUMIÈRE ${planName}`,
       `DESCRIPTION:予約番号: ${resId}\\nコース: ${planName}\\nお名前: ${name}様`,
       `LOCATION:${salonAddress}`,
       'STATUS:CONFIRMED',
       'END:VEVENT',
       'END:VCALENDAR'
     ].join('\r\n');
     ```
6. **LINE公式アカウント 1タップ相談・予約確認ボタン**:
   - トーク画面起動時に予約内容が事前入力されるURLスキームを実装し、無断キャンセル（ドタキャン）を防止:
     ```javascript
     const lineMsg = `【予約確認】\n予約番号: ${resId}\nお名前: ${name}様\n日時: ${datetime}\nコース: ${planName}`;
     const lineUrl = `https://line.me/R/oaMessage/@example_aesthetic/?${encodeURIComponent(lineMsg)}`;
     ```

---

### 3.4 R2: Centralized Config (`config.js`) & Dynamic Fallback Architecture

#### (1) 設定一元管理ファイル（`samples/aesthetic/js/config.js`）
```javascript
window.SALON_CONFIG = {
  salonName: "AESTHETIC SALON LUMIÈRE",
  salonTel: "03-1234-5678",
  salonAddress: "東京都中央区銀座5丁目X-X LUMIÈRE Ginza Building 4F",
  lineOfficialUrl: "https://line.me/R/ti/p/@example_aesthetic",
  lineAccountAt: "@example_aesthetic",
  gasEndpoint: "", // GAS Web App URL (空文字の場合は自動フォールバック計算)
  regularClosedDays: [2], // 0: 日, 1: 月, 2: 火(定休日), ..., 6: 土
  timeSlots: ["10:00", "13:00", "16:00", "18:30"],
  calendarDays: 14,
  plans: {
    bamboo: { name: "竹（Bamboo）人気No.1・贅沢フルコース", duration: 80, price: 7980 },
    plum: { name: "梅（Plum）クイックリフト＆高保湿導入", duration: 60, price: 5800 },
    pine: { name: "松（Pine）プレミアム極上フルスパ", duration: 100, price: 11800 }
  }
};
```

#### (2) 動的フォールバック計算ロジック（Dynamic Fallback Engine）
- **GAS未設定または通信エラー時**:
  - アラートやローディング停止を出さず、日付・定休日・時間帯に基づく決定論的シミュレーションアルゴリズムを実行。
  - 火曜日（定休日）: 自動的に「定休（休）」フラグ。
  - 本日の過ぎた時間帯: 自動的に「✕（満席）」。
  - 人気時間帯（土日の午後等）: ランダム/固定シードで「△」または「✕」を配分し、リアリティのある空き枠を自動生成。
  - 予約送信時: GASが未接続でもローカル完結で予約番号を発行し、カレンダー追加・LINE連携サンクス画面を表示。

---

## 4. Design System & Tokens Alignment

| Element | CSS Token / Value | Notes |
|---|---|---|
| Primary Accent | `var(--primitive-gold-400)` (`#C5A880`) | シャンパンゴールド、ブランド主色 |
| Primary Dark | `var(--primitive-gold-600)` (`#9E7D52`) | ボタンホバー、グラデーション終点 |
| Background Surface | `var(--primitive-offwhite)` (`#FAFAF9`) | ページ全体背景 |
| Card / Glass Surface | `rgba(255, 255, 255, 0.85)` | Glassmorphismカード、`blur(16px)` |
| Text Main | `var(--primitive-slate-800)` (`#1A1A24`) | 高コントラスト視認性 |
| Text Muted | `var(--primitive-slate-500)` (`#5E5E72`) | 補足・注記 |
| LINE Brand Color | `var(--primitive-line-green)` (`#06C755`) | LINE連携ボタン |
| Urgent / Scarcity | `var(--primitive-urgent-red)` (`#E11D48`) | 必須バッジ、残りわずか |
| Typography | `var(--font-serif)` / `var(--font-sans)` | Shippori Mincho × Inter / Noto Sans JP |

---

## 5. Verification & Test Plan

1. **カレンダーUI生成テスト**:
   - 直近14日分のヘッダーが正しく生成されているか。
   - 4つの時間枠（10:00, 13:00, 16:00, 18:30）が正しく行としてレンダリングされているか。
   - 定休日（火曜日）が正しく「休」表記になっているか。
2. **タップ連動テスト**:
   - `◯` または `△` のスロットクリック時に `#form-datetime` に日時文字列が入力されるか。
   - 満席（`✕`）および定休日（`休`）がクリック無効（disabled）になっているか。
3. **サンクス画面＆カレンダーエクスポートテスト**:
   - 予約番号の発行形式（`LUM-`）が正しいか。
   - GoogleカレンダーURLパラメータのエンコーディングが正常か。
   - Appleカレンダー用 `.ics` MIMEタイプ（`text/calendar`）およびVCALENDAR構造がRFC 5545に準拠しているか。
4. **相対パス＆GitHub Pages互換性**:
   - 全CSS/JSおよび画像リンクが相対パス（`./` または `../../`）で完結しているか。
