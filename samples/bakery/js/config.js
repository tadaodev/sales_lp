/**
 * samples/bakery/js/config.js
 * Centralized Bakery Store & Takeout Reservation Configuration
 * Single Source of Truth for BOULANGERIE ARTISANALE
 */
(function (global) {
  'use strict';

  var BAKERY_CONFIG = {
    // 1. 店舗基本情報
    bakeryName: 'BOULANGERIE ARTISANALE',
    bakeryJapaneseName: 'ブーランジェリー・アルチザナル',
    bakeryTagline: '本場パリ仕込み 薪石窯直焼き＆72時間熟成ハード系ブーランジェリー',
    bakeryPostalCode: '152-0023',
    postalCode: '152-0023',
    bakeryAddress: '東京都目黒区八雲3-12-8 ブーランジェリーテラス 1F',
    address: '東京都目黒区八雲3-12-8 ブーランジェリーテラス 1F',
    bakeryAccess: '東急東横線・大井町線「自由が丘駅」正面口 徒歩8分 / 八雲三丁目バス停 徒歩1分',
    access: '東急東横線・大井町線「自由が丘駅」正面口 徒歩8分 / 八雲三丁目バス停 徒歩1分',
    bakeryPhone: '03-3456-7890',
    phone: '03-3456-7890',
    bakeryEmail: 'contact@boulangerie-artisanale.example.com',
    email: 'contact@boulangerie-artisanale.example.com',
    representative: 'シェフ・ブーランジェ 日向 雅人 (Masato Hyuga)',

    // 2. GAS Webhook 設定
    gasWebhookUrl: '',
    gasTimeoutMs: 8000,

    // 3. 営業時間 & 予約枠設定
    businessHours: {
      start: '07:30',
      end: '18:30',
      weekday: '7:30 - 18:30',
      label: '7:30 - 18:30（パンが無くなり次第終了）'
    },
    closedDays: [1, 2], // 1: 月, 2: 火
    closedDaysLabel: '毎週月曜日・火曜日（祝日の場合は営業、翌平日振替）',
    timeSlots: ['08:00', '11:00', '14:00', '16:30'],
    daysToShow: 14,
    capacityPerSlot: 5,

    // 4. 公式LINE設定
    lineOfficialUrl: 'https://line.me/R/ti/p/@boulangerie_art',
    lineAccountId: '@boulangerie_art',
    lineOaMessageUrl: 'https://line.me/R/oaMessage/@boulangerie_art/?',

    // 5. 動的シミュレーション設定
    fallbackSimulation: true,
    simulationSeedSalt: 'boulangerie_artisanale_bakery_2026',

    // 6. 焼きたてタイムテーブル定義
    bakingSchedule: [
      {
        time: '07:30',
        batch: '第1便：モーニング・ヴィエノワズリー',
        items: '発酵バタークロワッサン、パン・オ・ショコラ、クイニーアマン',
        desc: '朝の澄んだ空気に広がる発酵バターの芳醇な香り'
      },
      {
        time: '10:30',
        batch: '第2便：石窯直焼き看板ハードパン',
        items: 'バゲット・トラディション、カンパーニュ・オ・ルヴァン',
        desc: 'パリッと香ばしい極上クラストとみずみずしい気泡'
      },
      {
        time: '13:30',
        batch: '第3便：ルヴァン＆ライ麦スペシャリテ',
        items: 'ノア・レザン（胡桃＆レーズン）、パン・ド・セーグル（ライ麦70%）',
        desc: '噛むほどに溢れる自然酵母の深い酸味とナッツのコク'
      },
      {
        time: '16:00',
        batch: '第4便：夕方焼きたてイブニングバゲット',
        items: '夕方便バゲット、石窯ハードパンドミ（食パン）',
        desc: 'ディナーのメインや翌朝の朝食用に焼き上げる夕方便'
      }
    ],

    // 7. 提供プラン・アソートBOXマスター (松竹梅 料金体系)
    planMaster: {
      bamboo: {
        id: 'bamboo',
        name: '【竹★人気No.1】人気定番7種詰め合わせBOX',
        fullName: '【竹★人気No.1】人気定番7種詰め合わせBOX（特製ギフトBOX＆保存袋付）',
        tier: 'bamboo',
        price: 3480,
        priceLabel: '¥3,480（税込）',
        isPopular: true,
        summary: 'バゲット(フル)＋カンパーニュ(ハーフ)＋ノア・レザン＋セーグル＋クロワッサン2個＋パン・オ・ショコラ2個＋クイニーアマン',
        giftBox: '特製クラフトギフトBOX＆保存バッグ付き'
      },
      plum: {
        id: 'plum',
        name: '【梅】モーニングハードセット',
        fullName: '【梅】モーニングハードセット（朝食・ブランチ用）',
        tier: 'plum',
        price: 1980,
        priceLabel: '¥1,980（税込）',
        isPopular: false,
        summary: 'ミニバゲット×1＋発酵バタークロワッサン×2＋パン・オ・ショコラ×2＋プチカンパーニュ×1',
        giftBox: 'クラフトペーパーバッグ入り'
      },
      pine: {
        id: 'pine',
        name: '【松】プレミアム薪窯バゲット＆贅沢オードブルBOX',
        fullName: '【松】プレミアム薪窯バゲット＆贅沢オードブルBOX（AOP発酵バター＆リエット付）',
        tier: 'pine',
        price: 5800,
        priceLabel: '¥5,800（税込）',
        isPopular: false,
        summary: '特選ロングバゲット＋カンパーニュ(ホール)＋トリュフ無花果ハード＋ノア・レザン＋自家製リエット瓶詰＋AOP発酵バター2個',
        giftBox: 'プレミアム桐調BOX＆リボン包装付き'
      },
      alacarte: {
        id: 'alacarte',
        name: '【店頭お取り置き】お好きなパンを当日レジ精算',
        fullName: '【店頭お取り置き】お好きなパンを当日レジ精算（1点からOK）',
        tier: 'alacarte',
        price: 0,
        priceLabel: 'お会計は当日店頭にて',
        isPopular: false,
        summary: 'ご希望のパン1点から当日お取り置き可能（備考欄にご希望商品をご記入ください）',
        giftBox: '通常包装'
      }
    }
  };

  // Structured Aliases for Universal Compatibility
  BAKERY_CONFIG.storeInfo = {
    name: BAKERY_CONFIG.bakeryName,
    japaneseName: BAKERY_CONFIG.bakeryJapaneseName,
    tagline: BAKERY_CONFIG.bakeryTagline,
    postalCode: BAKERY_CONFIG.postalCode,
    address: BAKERY_CONFIG.address,
    access: BAKERY_CONFIG.access,
    tel: BAKERY_CONFIG.phone,
    email: BAKERY_CONFIG.email,
    representative: BAKERY_CONFIG.representative,
    businessHours: BAKERY_CONFIG.businessHours.label,
    regularHolidays: BAKERY_CONFIG.closedDays,
    regularHolidaysLabel: BAKERY_CONFIG.closedDaysLabel
  };

  BAKERY_CONFIG.gas = {
    webhookUrl: BAKERY_CONFIG.gasWebhookUrl,
    timeoutMs: BAKERY_CONFIG.gasTimeoutMs
  };

  BAKERY_CONFIG.calendar = {
    daysToShow: BAKERY_CONFIG.daysToShow,
    slots: [
      { id: '08:00', time: '08:00', label: '08:00〜', period: '朝便', batch: '第1便受取' },
      { id: '11:00', time: '11:00', label: '11:00〜', period: '昼前便', batch: '第2便受取' },
      { id: '14:00', time: '14:00', label: '14:00〜', period: '午後便', batch: '第3便受取' },
      { id: '16:30', time: '16:30', label: '16:30〜', period: '夕方便', batch: '第4便受取' }
    ],
    closedDays: BAKERY_CONFIG.closedDays,
    capacityPerSlot: BAKERY_CONFIG.capacityPerSlot
  };

  BAKERY_CONFIG.plans = BAKERY_CONFIG.planMaster;
  BAKERY_CONFIG.assortments = BAKERY_CONFIG.planMaster;
  BAKERY_CONFIG.boxMaster = BAKERY_CONFIG.planMaster;

  BAKERY_CONFIG.line = {
    accountUrl: BAKERY_CONFIG.lineOfficialUrl,
    accountId: BAKERY_CONFIG.lineAccountId,
    oaMessageBaseUrl: BAKERY_CONFIG.lineOaMessageUrl
  };

  BAKERY_CONFIG.fallback = {
    enableSimulation: BAKERY_CONFIG.fallbackSimulation,
    simulationSeedSalt: BAKERY_CONFIG.simulationSeedSalt
  };

  // Global Export
  global.BAKERY_CONFIG = BAKERY_CONFIG;

  // CommonJS Support for Test Suite
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = BAKERY_CONFIG;
  }
})(typeof window !== 'undefined' ? window : this);
