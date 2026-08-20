# GAS Backend, Config & Data Exchange Architecture Survey Report
**Project**: Aesthetic Salon LP & LP Portal Hub (`c:/Project/事業案/05_LP作成`)  
**Surveyed by**: Explorer 2 (GAS Backend & Integration Specialist)  
**Date**: 2026-08-20  

---

## 1. Executive Summary & Repository Status

### 1.1 現状のリポジトリ調査結果
- **`gas/` ディレクトリの存在確認**: 現状、リポジトリ内に `gas/` ディレクトリおよび `.gs` ファイルは存在しません（未作成）。
- **`samples/aesthetic/js/config.js` の存在確認**: 現状、`config.js` は未作成であり、`aesthetic.js` 内に一部のロジックが直書きされています。
- **現在の予約フォーム状態**: `samples/aesthetic/index.html` の `#booking-modal` 内に静的な入力フォーム（お名前、電話番号、メール、プラン、日時、ご要望）が存在し、送信時に単にバリデーション後にサンクス文言を表示するモック実装にとどまっています。直近14日間の空き状況カレンダーUIやGAS通信、Google/Appleカレンダー追加、LINE連携機能は未実装です。

### 1.2 本調査の達成目標
サーバー代0円（完全無料）でGoogleカレンダーと完全自動同期し、顧客台帳（スプレッドシート）記録および自動返信メールを完結させるGASバックエンド、設定一元管理モジュール、動的フォールバックシミュレーション、およびカレンダー/LINE連携の完全なアーキテクチャ仕様を定義します。

---

## 2. GAS Backend Architecture (`gas/Code.gs`)

### 2.1 全体アーキテクチャ図
```
+-----------------------------------------------------------------------------------+
| Browser (GitHub Pages LP / Aesthetic Salon)                                      |
|                                                                                   |
|  [空き状況取得] fetch(GAS_URL + "?action=get_availability&startDate=...")        |
|  [予約送信]     fetch(GAS_URL, { method: "POST", body: JSON.stringify(data) })   |
+------------------------------------+----------------------------------------------+
                                     | (HTTPS Request / 302 Redirect handling)
                                     v
+-----------------------------------------------------------------------------------+
| Google Apps Script (gas/Code.gs) - Web App Deployed as "Anyone"                   |
|                                                                                   |
|  +-----------------------+     +-----------------------------------------------+  |
|  | doGet(e)              |     | doPost(e)                                     |  |
|  | - クエリパラメータ解析 |     | - JSONペイロード解析・バリデーション           |  |
|  | - 定休日・過去枠判定  |     | - Google Calendar 予定自動作成 (重複防止)     |  |
|  | - Google Calendar 照会|     | - Google Spreadsheet 予約台帳 1行追記         |  |
|  | - ◯/△/✕/休 JSON返却   |     | - 自動確認メール送信 (顧客 & サロン管理者)     |  |
|  +-----------------------+     +-----------------------------------------------+  |
+-------------------+-----------------------------------+---------------------------+
                    |                                   |
                    v                                   v
+-----------------------------+       +---------------------------------------------+
| Google Calendar             |       | Google Spreadsheet / Gmail                  |
| - オーナーの既存カレンダー  |       | - 「予約台帳」シート (自動列ヘッダー生成)   |
| - プライベート予定も即時反映 |       | - GmailApp による即時自動確認メール送信     |
+-----------------------------+       +---------------------------------------------+
```

### 2.2 ブラウザ・GAS間のCORS & 通信プロトコル仕様
1. **GAS Webアプリの通信特性**:
   - Google Apps Script Web App は、リクエストに対して `script.googleusercontent.com` への HTTP 302 リダイレクトを返します。
   - ブラウザから `POST` で `Content-Type: application/json` を送信すると、プリフライト（`OPTIONS`）リクエストが発生しますが、GASは `OPTIONS` メソッドを正しく処理できません。
2. **解決策（Best Practice）**:
   - **POST送信時**: フロントエンドから `fetch(gasUrl, { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'text/plain;charset=utf-8' } })` として送信（Simple Request扱いにしてプリフライトを回避）。
   - **GAS側**: `e.postData.contents` を `JSON.parse()` して受領。
   - **レスポンス返却**: `ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON)` を使用。
   - **GET取得時**: `fetch(gasUrl + '?action=get_availability&startDate=...')` によるダイレクトJSON取得、およびJSONPパラメータ（`callback`）のデュアル対応。

### 2.3 `doGet(e)` 処理仕様（空き枠判定）
- **エンドポイント**: `GET https://script.google.com/macros/s/.../exec?action=get_availability&startDate=YYYY-MM-DD&days=14`
- **パラメータ仕様**:
  - `action`: `'get_availability'`
  - `startDate`: 開始日（`YYYY-MM-DD`、省略時は当日）
  - `days`: 取得日数（デフォルト: `14`）
- **処理ステップ**:
  1. `CalendarApp.getDefaultCalendar()`（または設定されたカレンダーID）を取得。
  2. 開始日から指定日数分ループし、各日付の曜日を判定。
  3. 設定された定休日（火曜・水曜等）の場合は該当日の全スロットを `"closed"` (`"休"`) に設定。
  4. 4つの時間枠（10:00, 13:00, 16:00, 18:30）について、各時間帯の開始日時〜終了日時（例: 10:00〜12:00）を生成。
  5. 現在時刻より過去の時間枠は `"past"` (`"✕"`) に設定。
  6. `calendar.getEvents(slotStart, slotEnd)` を実行。
  7. 該当時間枠に予定が 0件 → `"available"` (`"◯"`)、1件以上 → `"full"` (`"✕"`)（定員1名の完全プライベートサロン仕様）。
  8. JSON形式でクライアントに返却。

```json
{
  "status": "success",
  "updatedAt": "2026-08-20T14:30:00Z",
  "slots": {
    "2026-08-21": {
      "10:00": { "status": "available", "symbol": "◯", "remaining": 1 },
      "13:00": { "status": "few", "symbol": "△", "remaining": 1 },
      "16:00": { "status": "full", "symbol": "✕", "remaining": 0 },
      "18:30": { "status": "available", "symbol": "◯", "remaining": 1 }
    },
    "2026-08-22": {
      "10:00": { "status": "closed", "symbol": "休", "remaining": 0 },
      "13:00": { "status": "closed", "symbol": "休", "remaining": 0 },
      "16:00": { "status": "closed", "symbol": "休", "remaining": 0 },
      "18:30": { "status": "closed", "symbol": "休", "remaining": 0 }
    }
  }
}
```

### 2.4 `doPost(e)` 処理仕様（予約登録・カレンダー・スプレッドシート・メール）
- **エンドポイント**: `POST https://script.google.com/macros/s/.../exec`
- **受信ペイロード構造**:
  ```json
  {
    "bookingId": "EST-20260821-4821",
    "name": "銀座 花子",
    "phone": "090-1234-5678",
    "email": "hanako@example.com",
    "planId": "bamboo",
    "planName": "【人気No.1】竹プラン（80分）初回 ¥7,980 (72% OFF)",
    "price": 7980,
    "date": "2026-08-21",
    "time": "10:00",
    "duration": 80,
    "notes": "フェイスラインのたるみが気になります。",
    "createdAt": "2026-08-20T14:30:00Z"
  }
  ```
- **処理ステップ**:
  1. **入力バリデーション**: `name`, `phone`, `email`, `date`, `time`, `planId` の存在およびフォーマット確認。
  2. **カレンダー重複排他チェック（Race Condition Prevention）**:
     - `calendar.getEvents(startTime, endTime)` で直前衝突がないか最終確認。
     - 重複時は `{ "status": "error", "code": "SLOT_OCCUPIED", "message": "申し訳ございません。この時間枠はタッチの差で他のお客様のご予約で埋まりました。" }` を返却。
  3. **Google Calendar 予定登録**:
     - イベント件名: `【予約】[銀座 花子 様] 竹プラン (80分)`
     - 開始日時: `2026-08-21 10:00:00`
     - 終了日時: `2026-08-21 11:20:00` (80分後)
     - 説明文（Description）:
       ```
       【予約番号】EST-20260821-4821
       【お名前】銀座 花子 様
       【お電話】090-1234-5678
       【メール】hanako@example.com
       【プラン】竹プラン（80分）初回 ¥7,980
       【ご要望・お悩み】フェイスラインのたるみが気になります。
       【申込日時】2026-08-20 23:30:00
       ```
     - 場所（Location）: `東京都中央区銀座6-10-1 GINZA SIX 8F Salon de Étoile`
  4. **Google Spreadsheet 予約台帳 1行追加**:
     - シート名 `予約台帳` を検索（存在しない場合は自動作成しヘッダー `[登録日時, 予約番号, ステータス, 予約日, 時間枠, お名前, 電話番号, メール, プラン, 金額, ご要望, カレンダーID]` を自動挿入）。
     - `sheet.appendRow([...])` で新規予約を追記。
  5. **自動確認メール送信（`GmailApp.sendEmail`）**:
     - **お客様宛**:
       - 件名: `【Salon de Étoile】ご体験予約のお申し込みを受け付けました（予約番号: EST-20260821-4821）`
       - 本文: ラグジュアリーサロンのトーンに準拠した丁寧な案内文、日時、当日のアクセス、キャンセルポリシー、注意事項。
     - **サロン管理者宛**:
       - 件名: `【WEB新規予約】EST-20260821-4821 銀座 花子 様（8/21 10:00 竹プラン）`
       - 本文: 顧客連絡先、ご要望、スプレッドシートおよびカレンダーリンク。
  6. **結果返却**:
     ```json
     {
       "status": "success",
       "bookingId": "EST-20260821-4821",
       "eventId": "cal_event_id_xyz",
       "message": "ご予約を受け付け、カレンダーと台帳へ登録いたしました。"
     }
     ```

---

## 3. Non-Technical Salon Owner 3-Minute Setup Guide (`gas/README.md`)

サロンオーナーがIT知識ゼロでも迷わず3分で設定できる手順書テンプレートを策定しました。

### 構成案
1. **はじめに（サーバー代0円・永久無料）**:
   - サーバー契約不要、月額費用ゼロ、Google公式インフラで完全自動化できるメリットの提示。
2. **3ステップ簡単セットアップ**:
   - **Step 1**: Googleスプレッドシートを新規作成（タイトル: `エステサロン予約管理台帳`）。
   - **Step 2**: メニューの「拡張機能」→「Apps Script」を開き、`gas/Code.gs` を全貼り付けして保存。
   - **Step 3**: 画面右上の「デプロイ」→「新しいデプロイ」→「ウェブアプリ」を選択（実行: 自分 / アクセス: 全員）して「デプロイ」。
   - **Step 4**: 発行された「ウェブアプリURL」をコピーし、`samples/aesthetic/js/config.js` の `gasWebhookUrl` に貼り付けるだけ。
3. **日常の運用方法**:
   - プライベートの予定（病院や私用）は普段使っているスマホのGoogleカレンダーに入れるだけで、LPの空き状況が自動的に「✕（満席）」に切り替わる仕組み。
4. **スクリーンショット付きFAQ & トラブルシューティング**:
   - Googleの初回承認画面（「詳細」→「安全ではないページに移動」）の分かりやすい解説。
   - メールの送信元アドレス（オーナーのGmailアドレスから送信される点）の明記。

---

## 4. Centralized Configuration Architecture (`samples/aesthetic/js/config.js`)

設定値を1箇所に集約し、サロン情報の変更やGAS URLの切り替えを容易にするモジュール設計です。

```javascript
/**
 * samples/aesthetic/js/config.js
 * Centralized Salon & Booking System Configuration
 */
(function (global) {
  'use strict';

  var SALON_CONFIG = {
    // 1. サロン基本情報
    salonInfo: {
      name: 'Salon de Étoile（サロン ド エトワール）',
      tagline: '銀座・完全個室 筋膜リフト＆エクソソーム美肌サロン',
      postalCode: '104-0061',
      address: '東京都中央区銀座6-10-1 GINZA SIX 8F',
      access: '東京メトロ銀座駅 A3出口 徒歩2分 / 東銀座駅 A1出口 徒歩3分',
      tel: '03-5555-0192',
      email: 'info@example-etoile.jp',
      businessHours: '10:00 - 21:00（最終受付 19:00）',
      regularHolidays: [2, 3], // 毎週火曜日(2)・水曜日(3)
      regularHolidaysLabel: '毎週火曜日・水曜日'
    },

    // 2. GAS Webhook エンドポイント設定
    gas: {
      // GASデプロイ後に発行されたURLを設定（空文字の場合は動的フォールバックモードで動作）
      webhookUrl: '', 
      timeoutMs: 8000
    },

    // 3. カレンダー & 予約枠設定 (直近14日間 x 4枠)
    calendar: {
      daysToShow: 14,
      slots: [
        { id: '10:00', time: '10:00', label: '10:00〜', period: '午前', durationMin: 80 },
        { id: '13:00', time: '13:00', label: '13:00〜', period: '午後', durationMin: 80 },
        { id: '16:00', time: '16:00', label: '16:00〜', period: '夕方', durationMin: 80 },
        { id: '18:30', time: '18:30', label: '18:30〜', period: '夜間', durationMin: 80 }
      ],
      capacityPerSlot: 1 // 完全個室1名制
    },

    // 4. 提供プランマスター
    plans: {
      plum: {
        id: 'plum',
        name: '梅プラン（60分）',
        fullName: '【梅】筋膜リフト集中ショートコース（60分）',
        originalPrice: 18000,
        trialPrice: 5800,
        discountRate: '68% OFF',
        durationMin: 60,
        isPopular: false
      },
      bamboo: {
        id: 'bamboo',
        name: '竹プラン（80分）★人気No.1',
        fullName: '【竹★人気No.1】極上エクソソーム導入＆筋膜フルリフト（80分）',
        originalPrice: 28500,
        trialPrice: 7980,
        discountRate: '72% OFF',
        durationMin: 80,
        isPopular: true
      },
      pine: {
        id: 'pine',
        name: '松プラン（100分）',
        fullName: '【松】VIPフルオーダーメイド・幹細胞プレミアム再生（100分）',
        originalPrice: 38000,
        trialPrice: 11800,
        discountRate: '69% OFF',
        durationMin: 100,
        isPopular: false
      }
    },

    // 5. 公式LINE設定
    line: {
      accountUrl: 'https://line.me/R/ti/p/@example_aesthetic',
      accountId: '@example_aesthetic',
      oaMessageBaseUrl: 'https://line.me/R/oaMessage/@example_aesthetic/?'
    },

    // 6. フォールバック動作設定
    fallback: {
      enableSimulation: true,
      simulationSeedSalt: 'etoile_luxury_salon_2026'
    }
  };

  // Export to global window object
  global.SALON_CONFIG = SALON_CONFIG;

})(typeof window !== 'undefined' ? window : this);
```

---

## 5. Dynamic Fallback Simulation Algorithm

GAS Webhook URLが未設定の場合、あるいはネットワーク障害やタイムアウトが発生した場合でも、エラーで画面が停止せず、常に極めて自然で安定した空き状況（◯・△・✕・定休）を算出する決定論的シミュレーションアルゴリズムです。

### 5.1 決定論的ハッシュアルゴリズム（Deterministic Hash Logic）
- **要件**: リロードや画面遷移、モーダル開閉を行っても、同じ日付・同じ時間枠のステータスがランダムにチカチカ変化してはならない（決定論的一貫性）。
- **ロジック**:
  1. 日付が定休日（火曜=2、水曜=3）の場合 → 確定で `"closed"` (`"休"`)。
  2. 日時が本日で、スロット開始時刻が過去の場合 → 確定で `"past"` (`"✕"` / 受付終了)。
  3. 日付文字列（`"2026-08-21"`）とスロット時刻（`"10:00"`）およびソルト文字列から 32bitハッシュ値を計算:
     ```javascript
     function getSlotDeterministicHash(dateStr, slotTime, salt) {
       var str = dateStr + '_' + slotTime + '_' + (salt || 'etoile_salt');
       var hash = 0;
       for (var i = 0; i < str.length; i++) {
         hash = ((hash << 5) - hash) + str.charCodeAt(i);
         hash |= 0;
       }
       return Math.abs(hash);
     }
     ```
  4. 曜日・日程ごとの重み付け（リアルな予約傾向を再現）:
     - **直近日（当日・翌日）**: 予約が埋まりやすい（◯: 30%, △: 30%, ✕: 40%）。
     - **土日・祝日**: 人気枠のため△/✕比率高め（◯: 35%, △: 35%, ✕: 30%）。
     - **平日（月・木・金）**: 余裕あり（◯: 60%, △: 25%, ✕: 15%）。
  5. 算出されたステータスに応じたシンボル・残枠数オブジェクトを返却:
     ```javascript
     if (score < thresholdAvailable) {
       return { status: 'available', symbol: '◯', label: '空きあり', remaining: 1 };
     } else if (score < thresholdFew) {
       return { status: 'few', symbol: '△', label: '残り1枠', remaining: 1 };
     } else {
       return { status: 'full', symbol: '✕', label: '満席', remaining: 0 };
     }
     ```

### 5.2 フォールバック予約送信処理
- GAS通信が行えない環境でも、クライアント側で一意な予約番号（例: `EST-20260821-4821`）を発行。
- `sessionStorage` に予約情報を保存し、ラグジュアリーなローディングアニメーション（500ms）を経て、即座に「予約完了（サンクス）画面」を表示。
- 予約完了画面上の「Googleカレンダー追加」「.icsダウンロード」「LINE事前通知」はすべて100%機能するよう設計。

---

## 6. External Integrations Architecture (Google Calendar / Apple .ics / LINE)

予約完了画面（サンクスビュー）において、顧客のドタキャン防止および来店リマインドを徹底するための3大連携ロジックです。

### 6.1 Googleカレンダー Web URL 生成ロジック
顧客がワンクリックで自身のGoogleカレンダーに予定を保存できるURLパラメータ構築仕様です。

```javascript
function generateGoogleCalendarUrl(booking) {
  var baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  
  // 日時フォーマット (YYYYMMDDTHHmmSSZ)
  var startIso = formatIsoForCalendar(booking.date, booking.time);
  var endIso = formatIsoForCalendar(booking.date, calculateEndTime(booking.time, booking.durationMin));
  
  var title = encodeURIComponent('【ご体験予約】Salon de Étoile（' + booking.planName + '）');
  var details = encodeURIComponent(
    '予約番号: ' + booking.bookingId + '\n' +
    'コース: ' + booking.planFullName + '\n' +
    'お名前: ' + booking.name + ' 様\n' +
    'サロン電話: ' + SALON_CONFIG.salonInfo.tel + '\n\n' +
    '【アクセス】\n' +
    SALON_CONFIG.salonInfo.address + '\n' +
    SALON_CONFIG.salonInfo.access + '\n\n' +
    '※ご予約時間の5分前にお越しください。'
  );
  var location = encodeURIComponent(SALON_CONFIG.salonInfo.name + ' (' + SALON_CONFIG.salonInfo.address + ')');
  
  return baseUrl + '&text=' + title + '&dates=' + startIso + '/' + endIso + '&details=' + details + '&location=' + location;
}
```

### 6.2 Apple Calendar / Outlook (.ics) ファイル動的生成ロジック
外部サーバーや外部ライブラリを一切使わず、Pure Vanilla JSで `.ics` ファイル（iCalendarフォーマット）を動的生成し、ブラウザ上で即時ダウンロードさせる仕様です。

```javascript
function generateAndDownloadIcs(booking) {
  var dtStamp = formatUtcTimestamp(new Date());
  var dtStart = formatUtcTimestamp(new Date(booking.date + 'T' + booking.time + ':00'));
  var dtEnd = formatUtcTimestamp(new Date(new Date(booking.date + 'T' + booking.time + ':00').getTime() + booking.durationMin * 60000));
  
  var icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Salon de Etoile//Booking System//JA',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'UID:' + booking.bookingId + '@salon-de-etoile.jp',
    'DTSTAMP:' + dtStamp,
    'DTSTART:' + dtStart,
    'DTEND:' + dtEnd,
    'SUMMARY:【ご体験予約】Salon de Étoile（' + booking.planName + '）',
    'DESCRIPTION:予約番号: ' + booking.bookingId + '\\nコース: ' + booking.planFullName + '\\nサロン電話: ' + SALON_CONFIG.salonInfo.tel + '\\n住所: ' + SALON_CONFIG.salonInfo.address,
    'LOCATION:' + SALON_CONFIG.salonInfo.name + ' ' + SALON_CONFIG.salonInfo.address,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    'DESCRIPTION:【リマインド】Salon de Étoile ご予約の2時間前です',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ];
  
  var icsBlob = new Blob([icsLines.join('\r\n')], { type: 'text/calendar;charset=utf-8;' });
  var downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(icsBlob);
  downloadLink.download = 'etoile_reservation_' + booking.bookingId + '.ics';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
```

### 6.3 LINE URL Scheme & プリセット文言パラメータ仕様
予約完了画面から公式LINEへ遷移する際、予約番号とお名前、選択プランが自動入力された状態でトーク画面を起動する仕様です。

- **URLスキーム**: `https://line.me/R/oaMessage/@example_aesthetic/?` + `encodeURIComponent(messageText)`
- **プリセット文言テンプレート**:
  ```text
  【WEB予約完了のご連絡】
  予約番号：EST-20260821-4821
  お名前：銀座 花子 様
  ご予約日時：2026年8月21日(金) 10:00〜
  コース：竹プラン（80分）初回 ¥7,980
  
  上記の日時でWeb予約を完了しました。
  当日のカウンセリングをよろしくお願いいたします。
  ```
- **フォールバック**: PC等で `oaMessage` スキームに対応していない環境では、友だち追加URL `https://line.me/R/ti/p/@example_aesthetic` へ安全にフォールバック。

---

## 7. Implementation Roadmap & Recommendation for Builder Agents

| 成果物ファイル | 担当役割 / 実装内容 | 依存関係 |
|---|---|---|
| `gas/Code.gs` | Google Apps Script バックエンド本体（`doGet`, `doPost`, Calendar/Sheets/Gmail自動連携） | なし（独立） |
| `gas/README.md` | サロンオーナー向け3分導入手順書（0円サーバー、コピペ手順、FAQ） | `gas/Code.gs` |
| `samples/aesthetic/js/config.js` | サロン情報・Webhook URL・カレンダー枠・プラン一元設定モジュール | なし |
| `samples/aesthetic/index.html` | 空き状況カレンダーUI（14日間×4枠）のDOM追加、予約完了サンクス画面の拡充 | `config.js` |
| `samples/aesthetic/css/aesthetic.css` | カレンダーグリッド、◯/△/✕/休バッジ、サンクス画面・連携ボタンのラグジュアリースタイリング | `index.html` |
| `samples/aesthetic/js/aesthetic.js` | カレンダー描画、スロット選択→フォーム連動、GAS非同期送信＆フォールバック、ICS/Google Cal/LINE連携 | `config.js`, `aesthetic.css` |
| `tests/run_all_tests.py` | カレンダーDOM検証、スロット判定ロジック検証、GASフォールバック検証の自動テスト追加 | すべて |

---
**調査完了**: Explorer 2によるGAS・設定・データ連携アーキテクチャの調査・設計は以上です。
