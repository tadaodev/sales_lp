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
    representative: '統括総料理長 佐藤 誠一 / 店長 高橋 健二',

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
      label: '平日 17:00-23:30 / 土日祝 16:00-23:00（日限定休・年末年始除く）'
    },

    // 定休日設定 (0: 日, 1: 月, ..., 6: 土) -> 日曜日定休 (月曜祝日の場合は日曜営業)
    closedDays: [0],
    closedDaysLabel: '毎週日曜日（祝前日の日曜は営業、翌月曜振替休業 / 年末年始12/31〜1/2休）',

    // 宴会予約枠（1日4枠制: 17:00, 18:30, 19:30, 20:30）
    timeSlots: ['17:00', '18:30', '19:30', '20:30'],

    // カレンダー表示日数
    daysToShow: 14,

    // 席数・宴会定員
    totalCapacity: 80,
    maxPartySize: 40,
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

    // 6. 提供コースマスター (松竹梅 料金体系 & アラカルト)
    courseMaster: {
      bamboo: {
        id: 'bamboo',
        tier: 'bamboo',
        tierName: '竹',
        name: '竹：名物鍋＆豊洲鮮魚の王道宴会コース（全8品）★人気No.1',
        fullName: '【竹★人気No.1】名物鍋＆豊洲鮮魚5点盛りの王道宴会コース（全8品 / 2h飲み放題付）',
        price: 4980,
        priceLabel: '¥4,980（税込 / 飲み放題付）',
        includesDrink: '2時間飲み放題付き（★厳選地酒5種含む全50種）',
        durationMin: 120,
        isPopular: true,
        dishesCount: 8,
        summary: '豊洲直送鮮魚5点盛り＋選べる名物鍋（博多和牛もつ鍋orちゃんこ寄せ鍋）＋備長炭火焼き鳥＋大海老天ぷら',
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
        summary: '豊洲直送お造り3点盛り＋備長炭火焼き鳥＋若鶏竜田揚げ＋旬魚炊き込みご飯',
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
      pine: {
        id: 'pine',
        tier: 'pine',
        tierName: '松',
        name: '松：特選和牛＆極上舟盛り 贅沢極みコース（全9品）',
        fullName: '【松コース】特選和牛＆極上舟盛り 贅沢極みコース（全9品 / 2h地酒30種飲み放題付）',
        price: 6500,
        priceLabel: '¥6,500（税込 / 飲み放題付）',
        includesDrink: '2時間プレミアム飲み放題付き（★厳選地酒30種全銘柄含む全70種）',
        durationMin: 120,
        isPopular: false,
        dishesCount: 9,
        summary: '極上鮮魚7点豪華舟盛り＋A5黒毛和牛すき焼き鍋/ステーキ＋名古屋コーチン焼き鳥＋カニ天ぷら',
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
      },
      alacarte: {
        id: 'alacarte',
        tier: 'alacarte',
        tierName: '席のみ',
        name: 'お席のみのご予約（当日アラカルト注文）',
        fullName: 'お席のみのご予約（当日お好きなお料理・地酒をご注文）',
        price: 0,
        priceLabel: 'お料理・お飲み物代金別途（席料・お通し代なし）',
        includesDrink: '当日アラカルト / ドリンク単品注文',
        durationMin: 120,
        isPopular: false,
        dishesCount: 0,
        summary: '全席掘りごたつ個室のお席のみ確保。お料理・厳選地酒は当日メニューから自由にお選びいただけます。',
        dishes: [
          '全席扉付き掘りごたつ完全個室をご用意',
          '当日のおすすめ鮮魚・炭火焼き鳥・名物鍋をアラカルトでご注文可能',
          '厳選地酒30種・プレミアム生ビールを1杯からご注文いただけます'
        ],
        targetAudience: '少人数でのサク飲み、お好みで料理を選びたい会食、二次会'
      }
    }
  };

  // 互換性エイリアス (planMaster / courses / plans)
  WASHOKU_CONFIG.planMaster = WASHOKU_CONFIG.courseMaster;
  WASHOKU_CONFIG.courses = WASHOKU_CONFIG.courseMaster;
  WASHOKU_CONFIG.plans = WASHOKU_CONFIG.courseMaster;

  // グローバルエクスポート
  global.WASHOKU_CONFIG = WASHOKU_CONFIG;
  global.RESTAURANT_CONFIG = WASHOKU_CONFIG; // 互換性エイリアス

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = WASHOKU_CONFIG;
  }

})(typeof window !== 'undefined' ? window : this);
