/**
 * samples/italian/js/config.js
 * Centralized Restaurant & Seat Reservation Configuration
 * Single Source of Truth for TRATTORIA & PIZZERIA BELLA TAVOLA
 */

(function (global) {
  'use strict';

  var RESTAURANT_CONFIG = {
    // ==========================================
    // 1. 店舗基本情報 (Restaurant Metadata)
    // ==========================================
    restaurantName: 'TRATTORIA & PIZZERIA BELLA TAVOLA',
    restaurantJapaneseName: 'トラットリア＆ピッツェリア ベラ・タヴォラ',
    restaurantTagline: '神宮前 薪窯ピッツァ＆毎朝手打ち生パスタ トラットリア',
    restaurantPostalCode: '150-0001',
    restaurantAddress: '東京都渋谷区神宮前5-X-X 表参道テラス 1F',
    restaurantAccess: '明治神宮前駅 徒歩3分 / 表参道駅 徒歩5分 / 原宿駅 徒歩7分',
    restaurantPhone: '03-5678-9012',
    restaurantEmail: 'info@bellatavola.example.com',

    // ==========================================
    // 2. GAS Webhook エンドポイント設定
    // ==========================================
    // GASデプロイ後に発行されたWebアプリURLをここに設定します。
    // 空文字 ("") の場合は自動的に決定論的オフラインシミュレーションモードで動作します。
    gasWebhookUrl: '',
    gasTimeoutMs: 8000,

    // ==========================================
    // 3. 営業時間・定休日・2部制予約枠設定
    // ==========================================
    businessHours: {
      lunch: {
        start: '11:30',
        end: '15:00',
        lastOrder: '14:30',
        label: 'ランチ 11:30 - 15:00（L.O. 14:30）'
      },
      dinner: {
        start: '17:30',
        end: '22:30',
        lastOrder: '21:30',
        label: 'ディナー 17:30 - 22:30（L.O. 21:30）'
      },
      label: 'ランチ 11:30-15:00 (L.O.14:30) / ディナー 17:30-22:30 (L.O.21:30)'
    },

    // 定休日設定 (0: 日, 1: 月, 2: 火, 3: 水, 4: 木, 5: 金, 6: 土)
    closedDays: [2], // 毎週火曜日定休
    closedDaysLabel: '毎週火曜日（祝日の場合は翌水曜日振替休）',

    // ランチ（5枠）＆ディナー（6枠）の予約枠一覧（合計11枠/日）
    timeSlots: {
      lunch: ['11:30', '12:00', '12:30', '13:00', '13:30'],
      dinner: ['17:30', '18:00', '18:30', '19:00', '19:30', '20:00']
    },

    // カレンダー表示日数
    daysToShow: 14,

    // 席数・予約制限
    totalTables: 8,
    totalCapacity: 28,
    capacityPerSlot: 4, // 1枠あたりの受付可能組数
    maxPartySize: 8,    // Web予約での最大人数（9名以上はお電話）
    defaultPartySize: 2,

    // ==========================================
    // 4. 公式LINEアカウント連携設定
    // ==========================================
    lineOfficialUrl: 'https://line.me/R/ti/p/@bella_tavola',
    lineAccountId: '@bella_tavola',
    lineOaMessageUrl: 'https://line.me/R/oaMessage/@bella_tavola/?',

    // ==========================================
    // 5. 動的シミュレーション・フォールバック設定
    // ==========================================
    fallbackSimulation: true,
    simulationSeedSalt: 'bella_tavola_italian_2026',

    // ==========================================
    // 6. 提供コースマスター (Course Master List)
    // ==========================================
    courseMaster: {
      bamboo: {
        id: 'bamboo',
        name: '竹：Classicoコース（全7品）★人気No.1',
        fullName: '【竹★人気No.1】Classico 王道フルコース（全7品 / 乾杯酒付）',
        tier: 'bamboo',
        price: 6800,
        priceLabel: '¥6,800（税込）',
        includesDrink: '乾杯スパークリング付',
        durationMin: 120,
        isPopular: true,
        summary: '水牛モッツァレラマルゲリータDOC＋手打ちボロネーゼ＋特選牛イチボ薪火ビステッカ'
      },
      plum: {
        id: 'plum',
        name: '梅：Stagioneコース（全6品）',
        fullName: '【梅】Stagione 季節のカジュアルコース（全6品）',
        tier: 'plum',
        price: 4800,
        priceLabel: '¥4,800（税込）',
        includesDrink: 'ワンドリンク別',
        durationMin: 90,
        isPopular: false,
        summary: '前菜3種盛り＋薪窯ピッツァ＋手打ちパスタ＋本日のドルチェ'
      },
      pine: {
        id: 'pine',
        name: '松：Specialeコース（全8品）',
        fullName: '【松】Speciale 記念日・極上VIPフルコース（全8品 / 特製プレート付）',
        tier: 'pine',
        price: 9800,
        priceLabel: '¥9,800（税込）',
        includesDrink: '乾杯スプマンテ＆食後酒付',
        durationMin: 150,
        isPopular: false,
        summary: 'サマートリュフピッツァ＋オマール海老手打ちパスタ＋黒毛和牛フィレ薪火グリル'
      },
      lunch_b: {
        id: 'lunch_b',
        name: 'Pranzo B 贅沢ランチコース',
        fullName: '【昼限定】Pranzo B 贅沢ランチコース（前菜5種＋選べる主食＋ドルチェ）',
        tier: 'lunch',
        price: 2800,
        priceLabel: '¥2,800（税込）',
        includesDrink: '食後のカフェ付き',
        durationMin: 60,
        isPopular: false,
        summary: '前菜5種盛り合わせ＋選べる薪窯ピッツァ/手打ちパスタ＋自家製ティラミス＋カフェ'
      },
      seat_only: {
        id: 'seat_only',
        name: 'お席のみのご予約',
        fullName: '【席のみ予約】お料理・お飲み物は当日アラカルトよりご注文',
        tier: 'custom',
        price: 0,
        priceLabel: 'お料理は当日注文',
        includesDrink: 'アラカルト注文',
        durationMin: 120,
        isPopular: false,
        summary: 'ご来店後に薪窯ピッツァや前菜、厳選イタリアワインを自由にお選びいただけます'
      }
    }
  };

  // Aliases for compatibility
  RESTAURANT_CONFIG.courseMaster.cena_stagione = RESTAURANT_CONFIG.courseMaster.bamboo;
  RESTAURANT_CONFIG.courseMaster.cena_classico = RESTAURANT_CONFIG.courseMaster.plum;
  RESTAURANT_CONFIG.courseMaster.cena_speciale = RESTAURANT_CONFIG.courseMaster.pine;
  RESTAURANT_CONFIG.courseMaster.pranzo_speciale = RESTAURANT_CONFIG.courseMaster.lunch_b;

  // 下位互換・構造化エイリアス
  RESTAURANT_CONFIG.restaurantInfo = {
    name: RESTAURANT_CONFIG.restaurantName,
    japaneseName: RESTAURANT_CONFIG.restaurantJapaneseName,
    tagline: RESTAURANT_CONFIG.restaurantTagline,
    postalCode: RESTAURANT_CONFIG.restaurantPostalCode,
    address: RESTAURANT_CONFIG.restaurantAddress,
    access: RESTAURANT_CONFIG.restaurantAccess,
    tel: RESTAURANT_CONFIG.restaurantPhone,
    email: RESTAURANT_CONFIG.restaurantEmail,
    businessHours: RESTAURANT_CONFIG.businessHours.label,
    regularHolidays: RESTAURANT_CONFIG.closedDays,
    regularHolidaysLabel: RESTAURANT_CONFIG.closedDaysLabel
  };

  RESTAURANT_CONFIG.gas = {
    webhookUrl: RESTAURANT_CONFIG.gasWebhookUrl,
    timeoutMs: RESTAURANT_CONFIG.gasTimeoutMs
  };

  RESTAURANT_CONFIG.calendar = {
    daysToShow: RESTAURANT_CONFIG.daysToShow,
    shifts: {
      lunch: RESTAURANT_CONFIG.timeSlots.lunch,
      dinner: RESTAURANT_CONFIG.timeSlots.dinner
    },
    closedDays: RESTAURANT_CONFIG.closedDays,
    capacityPerSlot: RESTAURANT_CONFIG.capacityPerSlot
  };

  RESTAURANT_CONFIG.courses = RESTAURANT_CONFIG.courseMaster;
  RESTAURANT_CONFIG.plans = RESTAURANT_CONFIG.courseMaster; // alias for compatibility

  RESTAURANT_CONFIG.line = {
    accountUrl: RESTAURANT_CONFIG.lineOfficialUrl,
    accountId: RESTAURANT_CONFIG.lineAccountId,
    oaMessageBaseUrl: RESTAURANT_CONFIG.lineOaMessageUrl
  };

  RESTAURANT_CONFIG.fallback = {
    enableSimulation: RESTAURANT_CONFIG.fallbackSimulation,
    simulationSeedSalt: RESTAURANT_CONFIG.simulationSeedSalt
  };

  // Global Export
  global.RESTAURANT_CONFIG = RESTAURANT_CONFIG;

  // CommonJS Support for Test Framework
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = RESTAURANT_CONFIG;
  }
})(typeof window !== 'undefined' ? window : this);
