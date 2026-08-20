/**
 * Google Apps Script (GAS) Backend for Aesthetic Salon Landing Page
 * 
 * Functions:
 * 1. doGet(e): Returns real-time availability (14 days x 4 slots) by querying Google Calendar
 * 2. doPost(e): Creates Google Calendar event, records booking in Spreadsheet ledger, sends luxury confirmation emails
 * 
 * Zero server cost, 100% Google infrastructure.
 */

// ==========================================
// 1. サロン共通設定 (Salon Configuration)
// ==========================================
var CONFIG = {
  // サロン基本情報
  SALON_NAME: 'Salon de Étoile（サロン ド エトワール）',
  SALON_PHONE: '03-5555-0192',
  SALON_EMAIL: 'info@example-etoile.jp', // サロン管理者受信用メールアドレス（空欄時はスクリプト実行者のGmail）
  SALON_ADDRESS: '東京都中央区銀座6-10-1 GINZA SIX 8F',
  SALON_ACCESS: '東京メトロ銀座駅 A3出口 徒歩2分 / 東銀座駅 A1出口 徒歩3分',
  
  // Googleカレンダー設定 ('primary' は実行ユーザーのメインカレンダー)
  CALENDAR_ID: 'primary',
  
  // スプレッドシート設定
  SHEET_NAME: '予約台帳',
  
  // 定休日設定 (0: 日, 1: 月, 2: 火, 3: 水, 4: 木, 5: 金, 6: 土)
  CLOSED_DAYS: [2], // 毎週火曜日定休
  
  // 提供時間枠設定 (1日4枠制)
  TIME_SLOTS: ['10:00', '13:00', '16:00', '18:30'],
  
  // デフォルト施術時間（分）
  DEFAULT_DURATION_MIN: 80,
  
  // 1枠あたりの定員数（完全個室プライベートサロンは 1）
  CAPACITY_PER_SLOT: 1,
  
  // カレンダー表示日数
  DAYS_TO_SHOW: 14,
  
  // プランマスター
  PLANS: {
    'bamboo': { name: '竹プラン（80分）★人気No.1', fullName: '【竹★人気No.1】極上エクソソーム導入＆筋膜フルリフト（80分）', price: 7980, duration: 80 },
    'plum': { name: '梅プラン（60分）', fullName: '【梅】筋膜リフト集中ショートコース（60分）', price: 5800, duration: 60 },
    'pine': { name: '松プラン（100分）', fullName: '【松】VIPフルオーダーメイド・幹細胞プレミアム再生（100分）', price: 11800, duration: 100 }
  }
};

// ==========================================
// 2. GETリクエスト処理 (doGet)
//    空き状況カレンダーの照会 / ヘルスチェック
// ==========================================
function doGet(e) {
  try {
    var params = (e && e.parameter) ? e.parameter : {};
    var action = params.action || 'getAvailability';
    var callback = params.callback; // JSONP対応

    // ヘルスチェック
    if (action === 'ping' || action === 'health') {
      return createJsonResponse({
        status: 'success',
        message: 'GAS Salon Booking Backend is online and active.',
        timestamp: new Date().toISOString(),
        salon: CONFIG.SALON_NAME
      }, callback);
    }

    // 空き状況取得 (action === 'getAvailability' または 'get_availability')
    if (action === 'getAvailability' || action === 'get_availability') {
      var days = parseInt(params.days, 10) || CONFIG.DAYS_TO_SHOW;
      var startDateStr = params.startDate; // 'YYYY-MM-DD'
      
      var availabilityData = calculateAvailability(startDateStr, days);
      return createJsonResponse(availabilityData, callback);
    }

    return createJsonResponse({
      status: 'error',
      message: 'Unknown action: ' + action
    }, callback);

  } catch (error) {
    return createJsonResponse({
      status: 'error',
      message: 'Server error in doGet: ' + error.toString()
    }, callback);
  }
}

// ==========================================
// 3. POSTリクエスト処理 (doPost)
//    WEB予約登録・カレンダー登録・台帳追記・メール送信
// ==========================================
function doPost(e) {
  try {
    var payload = {};
    
    // リクエストボディの解析 (text/plain または application/json)
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        payload = parseQueryString(e.postData.contents);
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    var action = payload.action || 'createBooking';

    if (action === 'createBooking') {
      return handleCreateBooking(payload);
    }

    return createJsonResponse({
      status: 'error',
      message: 'Unknown action: ' + action
    });

  } catch (error) {
    return createJsonResponse({
      status: 'error',
      message: 'Server error in doPost: ' + error.toString()
    });
  }
}

// ==========================================
// 4. 空き状況算出ロジック
// ==========================================
function calculateAvailability(startDateStr, days) {
  var now = new Date();
  var start = new Date();

  if (startDateStr) {
    var parts = startDateStr.split('-');
    if (parts.length === 3) {
      start = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), 0, 0, 0, 0);
    }
  } else {
    // 本日00:00:00起点
    start.setHours(0, 0, 0, 0);
  }

  var calendar = getTargetCalendar();
  var availability = {};
  var slots = {};

  for (var i = 0; i < days; i++) {
    var currentDate = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
    var dateKey = formatDateKey(currentDate);
    var dayOfWeek = currentDate.getDay(); // 0: 日 〜 6: 土
    var isClosedDay = CONFIG.CLOSED_DAYS.indexOf(dayOfWeek) !== -1;

    availability[dateKey] = {};
    slots[dateKey] = {};

    CONFIG.TIME_SLOTS.forEach(function (timeSlot) {
      if (isClosedDay) {
        availability[dateKey][timeSlot] = 'closed';
        slots[dateKey][timeSlot] = {
          status: 'closed',
          symbol: '休',
          label: '定休日',
          remaining: 0
        };
        return;
      }

      var timeParts = timeSlot.split(':');
      var slotStart = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        parseInt(timeParts[0], 10),
        parseInt(timeParts[1], 10),
        0,
        0
      );
      var slotEnd = new Date(slotStart.getTime() + CONFIG.DEFAULT_DURATION_MIN * 60 * 1000);

      // 過去の日時判定（本日かつ現在時刻より前のスロット）
      if (slotStart.getTime() <= now.getTime()) {
        availability[dateKey][timeSlot] = 'closed';
        slots[dateKey][timeSlot] = {
          status: 'past',
          symbol: '✕',
          label: '受付終了',
          remaining: 0
        };
        return;
      }

      // Googleカレンダー上の重複イベントを取得
      var events = [];
      if (calendar) {
        events = calendar.getEvents(slotStart, slotEnd);
      }

      var activeEventsCount = events.length;

      if (activeEventsCount >= CONFIG.CAPACITY_PER_SLOT) {
        availability[dateKey][timeSlot] = 'full';
        slots[dateKey][timeSlot] = {
          status: 'full',
          symbol: '✕',
          label: '満席',
          remaining: 0
        };
      } else if (activeEventsCount === 0) {
        availability[dateKey][timeSlot] = 'available';
        slots[dateKey][timeSlot] = {
          status: 'available',
          symbol: '◯',
          label: '空きあり',
          remaining: CONFIG.CAPACITY_PER_SLOT
        };
      } else {
        var remaining = CONFIG.CAPACITY_PER_SLOT - activeEventsCount;
        availability[dateKey][timeSlot] = 'limited';
        slots[dateKey][timeSlot] = {
          status: 'limited',
          symbol: '△',
          label: '残り' + remaining + '枠',
          remaining: remaining
        };
      }
    });
  }

  return {
    status: 'success',
    updatedAt: new Date().toISOString(),
    days: days,
    availability: availability,
    slots: slots
  };
}

// ==========================================
// 5. 予約受付・作成ロジック (handleCreateBooking)
// ==========================================
function handleCreateBooking(payload) {
  var name = (payload.name || '').trim();
  var phone = (payload.phone || '').trim();
  var email = (payload.email || '').trim();
  var planKey = (payload.plan || payload.planId || 'bamboo').trim();
  var planInfo = CONFIG.PLANS[planKey] || {
    name: payload.planName || '竹プラン（80分）',
    fullName: payload.planFullName || payload.planName || '竹プラン（80分）',
    price: payload.price || 7980,
    duration: payload.duration || CONFIG.DEFAULT_DURATION_MIN
  };
  var dateStr = (payload.date || '').trim(); // 'YYYY-MM-DD'
  var timeStr = (payload.time || '').trim(); // 'HH:MM'
  var notes = (payload.notes || '').trim();
  var reservationId = payload.reservationId || payload.bookingId || generateReservationId(dateStr);

  // 1. 入力必須バリデーション
  if (!name || !phone || !email || !dateStr || !timeStr) {
    return createJsonResponse({
      status: 'error',
      code: 'MISSING_FIELDS',
      message: 'お名前、お電話番号、メールアドレス、ご希望日時は必須項目です。'
    });
  }

  // 日時パース
  var dateParts = dateStr.split('-');
  var timeParts = timeStr.split(':');
  if (dateParts.length !== 3 || timeParts.length < 2) {
    return createJsonResponse({
      status: 'error',
      code: 'INVALID_DATETIME',
      message: '予約日時の形式が正しくありません。'
    });
  }

  var startTime = new Date(
    parseInt(dateParts[0], 10),
    parseInt(dateParts[1], 10) - 1,
    parseInt(dateParts[2], 10),
    parseInt(timeParts[0], 10),
    parseInt(timeParts[1], 10),
    0,
    0
  );
  var durationMin = planInfo.duration || CONFIG.DEFAULT_DURATION_MIN;
  var endTime = new Date(startTime.getTime() + durationMin * 60 * 1000);

  var calendar = getTargetCalendar();

  // 2. カレンダー重複チェック（タッチの差による重複防止）
  if (calendar) {
    var existingEvents = calendar.getEvents(startTime, endTime);
    if (existingEvents.length >= CONFIG.CAPACITY_PER_SLOT) {
      return createJsonResponse({
        status: 'error',
        code: 'SLOT_OCCUPIED',
        message: '申し訳ございません。ご指定の時間枠は直前に別のご予約で満席となりました。別の日時をお選びください。'
      });
    }
  }

  // 3. Googleカレンダーへ予定を自動登録
  var eventId = '';
  if (calendar) {
    var eventTitle = '【予約】' + name + ' 様（' + planInfo.name + '）';
    var eventDescription = [
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '【Salon de Étoile WEB予約受付】',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '■ 予約番号: ' + reservationId,
      '■ お名前: ' + name + ' 様',
      '■ お電話番号: ' + phone,
      '■ メールアドレス: ' + email,
      '■ ご予約コース: ' + planInfo.fullName,
      '■ 初回体験価格: ¥' + planInfo.price.toLocaleString(),
      '■ ご予約日時: ' + dateStr + ' ' + timeStr + ' 〜 ' + formatTimeOnly(endTime),
      '■ 所要時間: ' + durationMin + '分',
      '■ お悩み・ご要望:\n' + (notes ? notes : '（特になし）'),
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '受付日時: ' + Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss')
    ].join('\n');

    var event = calendar.createEvent(eventTitle, startTime, endTime, {
      description: eventDescription,
      location: CONFIG.SALON_ADDRESS
    });

    // 2時間前と前日（24時間前）にポップアップ通知を設定
    try {
      event.removeAllReminders();
      event.addPopupReminder(120);
      event.addPopupReminder(1440);
    } catch (reminderErr) {
      Logger.log('Reminder setting warning: ' + reminderErr.toString());
    }

    eventId = event.getId();
  }

  // 4. Googleスプレッドシート「予約台帳」へ追記
  var spreadsheetApp = SpreadsheetApp.getActiveSpreadsheet();
  if (spreadsheetApp) {
    var sheet = spreadsheetApp.getSheetByName(CONFIG.SHEET_NAME);
    if (!sheet) {
      sheet = spreadsheetApp.insertSheet(CONFIG.SHEET_NAME);
      // ヘッダー行を作成
      var headers = [
        '予約日時',
        '予約番号',
        'ステータス',
        'お名前',
        '電話番号',
        'メールアドレス',
        'コース名',
        '体験価格',
        '所要時間',
        'ご要望・備考',
        'カレンダーID',
        '申込受付日時'
      ];
      sheet.appendRow(headers);
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#2C2A29');
      headerRange.setFontColor('#FFFFFF');
      headerRange.setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    var nowFormatted = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss');
    var bookingDateTimeStr = dateStr + ' ' + timeStr;

    sheet.appendRow([
      bookingDateTimeStr,
      reservationId,
      '受付済',
      name,
      phone,
      email,
      planInfo.fullName,
      planInfo.price,
      durationMin + '分',
      notes,
      eventId,
      nowFormatted
    ]);
  }

  // 5. 自動確認メールの送信 (GmailApp)
  try {
    sendCustomerConfirmationEmail({
      reservationId: reservationId,
      name: name,
      email: email,
      phone: phone,
      planName: planInfo.fullName,
      price: planInfo.price,
      dateStr: dateStr,
      timeStr: timeStr,
      endTimeStr: formatTimeOnly(endTime),
      durationMin: durationMin,
      notes: notes
    });

    sendSalonAdminNotificationEmail({
      reservationId: reservationId,
      name: name,
      email: email,
      phone: phone,
      planName: planInfo.fullName,
      price: planInfo.price,
      dateStr: dateStr,
      timeStr: timeStr,
      durationMin: durationMin,
      notes: notes
    });
  } catch (mailErr) {
    Logger.log('Email sending error: ' + mailErr.toString());
  }

  return createJsonResponse({
    status: 'success',
    reservationId: reservationId,
    eventId: eventId,
    message: 'ご予約を受け付けました。ご登録のメールアドレスに確認メールをお送りしました。'
  });
}

// ==========================================
// 6. メール送信テンプレート (Luxury Styling)
// ==========================================
function sendCustomerConfirmationEmail(booking) {
  var subject = '【' + CONFIG.SALON_NAME + '】ご体験予約のお申し込みを受け付けました（予約番号: ' + booking.reservationId + '）';
  
  var body = [
    booking.name + ' 様',
    '',
    'この度は、' + CONFIG.SALON_NAME + ' のWEB予約をお申し込みいただき、誠にありがとうございます。',
    '',
    '以下の内容にてご予約を受け付けいたしました。',
    '当サロンの熟練セラピストが、極上の癒やしと至高の美肌体験をご用意してお待ち申し上げております。',
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '■ ご予約内容詳細',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '【予約番号】: ' + booking.reservationId,
    '【お名前】: ' + booking.name + ' 様',
    '【ご予約日時】: ' + booking.dateStr + ' ' + booking.timeStr + ' 〜 ' + booking.endTimeStr,
    '【ご予約コース】: ' + booking.planName,
    '【初回体験料金】: ¥' + booking.price.toLocaleString() + ' (税込・カウンセリング込)',
    '【施術所要時間】: 約' + booking.durationMin + '分',
    '【お悩み・ご要望】: ' + (booking.notes ? booking.notes : '（特になし）'),
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '■ サロン情報・アクセス',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '【店名】: ' + CONFIG.SALON_NAME,
    '【所在地】: ' + CONFIG.SALON_ADDRESS,
    '【アクセス】: ' + CONFIG.SALON_ACCESS,
    '【お電話】: ' + CONFIG.SALON_PHONE,
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '■ ご来店にあたってのご案内',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '・丁寧なカウンセリングとお着替えのため、ご予約時間の【5分前】にお越しいただけますと幸いです。',
    '・メイク落とし・スキンケア・ドライヤー等のアメニティはすべて完備しております。手ぶらでお気軽にお越しください。',
    '・万が一の日時変更やキャンセルの場合は、前日までにサロンお電話または公式LINEよりご連絡をお願いいたします。',
    '',
    'お目にかかれますことを、スタッフ一同心より楽しみにお待ち申し上げております。',
    '',
    '────────────────────────────',
    CONFIG.SALON_NAME,
    '住所: ' + CONFIG.SALON_ADDRESS,
    'TEL: ' + CONFIG.SALON_PHONE,
    '────────────────────────────'
  ].join('\n');

  GmailApp.sendEmail(booking.email, subject, body, {
    name: CONFIG.SALON_NAME
  });
}

function sendSalonAdminNotificationEmail(booking) {
  var adminEmail = CONFIG.SALON_EMAIL;
  if (!adminEmail || adminEmail.indexOf('@') === -1) {
    adminEmail = Session.getEffectiveUser().getEmail();
  }

  var subject = '【WEB新規予約】' + booking.reservationId + ' ' + booking.name + ' 様（' + booking.dateStr + ' ' + booking.timeStr + '）';
  
  var body = [
    'WEBサイトより新しい初回体験予約が入りました。',
    'Googleカレンダーおよびスプレッドシート予約台帳へ自動記録済みです。',
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '■ 予約詳細',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '【予約番号】: ' + booking.reservationId,
    '【お名前】: ' + booking.name + ' 様',
    '【お電話番号】: ' + booking.phone,
    '【メールアドレス】: ' + booking.email,
    '【ご予約日時】: ' + booking.dateStr + ' ' + booking.timeStr,
    '【ご予約コース】: ' + booking.planName,
    '【初回体験料金】: ¥' + booking.price.toLocaleString(),
    '【お悩み・ご要望】:\n' + (booking.notes ? booking.notes : '（特になし）'),
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '受付時刻: ' + Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss')
  ].join('\n');

  GmailApp.sendEmail(adminEmail, subject, body, {
    name: CONFIG.SALON_NAME + ' 予約通知システム'
  });
}

// ==========================================
// 7. ユーティリティ関数群 (Utilities)
// ==========================================
function getTargetCalendar() {
  try {
    if (CONFIG.CALENDAR_ID && CONFIG.CALENDAR_ID !== 'primary') {
      var cal = CalendarApp.getCalendarById(CONFIG.CALENDAR_ID);
      if (cal) return cal;
    }
    return CalendarApp.getDefaultCalendar();
  } catch (err) {
    Logger.log('Calendar fetch error: ' + err.toString());
    return null;
  }
}

function formatDateKey(dateObj) {
  var y = dateObj.getFullYear();
  var m = ('0' + (dateObj.getMonth() + 1)).slice(-2);
  var d = ('0' + dateObj.getDate()).slice(-2);
  return y + '-' + m + '-' + d;
}

function formatTimeOnly(dateObj) {
  var h = ('0' + dateObj.getHours()).slice(-2);
  var m = ('0' + dateObj.getMinutes()).slice(-2);
  return h + ':' + m;
}

function generateReservationId(dateStr) {
  var cleanDate = (dateStr || '').replace(/[^0-9]/g, '');
  if (!cleanDate || cleanDate.length !== 8) {
    cleanDate = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyyMMdd');
  }
  var randomNum = Math.floor(1000 + Math.random() * 9000);
  return 'EST-' + cleanDate + '-' + randomNum;
}

function parseQueryString(queryString) {
  var params = {};
  var pairs = (queryString || '').split('&');
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split('=');
    if (pair.length === 2) {
      params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1].replace(/\+/g, ' '));
    }
  }
  return params;
}

function createJsonResponse(data, callback) {
  var jsonString = JSON.stringify(data);
  
  if (callback && /^[a-zA-Z0-9_]+$/.test(callback)) {
    // JSONPレスポンス
    return ContentService.createTextOutput(callback + '(' + jsonString + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  
  return ContentService.createTextOutput(jsonString)
    .setMimeType(ContentService.MimeType.JSON);
}
