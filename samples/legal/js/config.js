/**
 * samples/legal/js/config.js
 * Centralized Legal Firm & Consultation Booking System Configuration
 * Single Source of Truth for LUMEN LEGAL CONSULTING
 */

(function (global) {
  'use strict';

  var LEGAL_CONFIG = {
    // ==========================================
    // 1. 事務所基本情報 (Law Firm Metadata)
    // ==========================================
    firmName: 'LUMEN LEGAL CONSULTING',
    firmJapaneseName: 'ルーメン総合法律事務所',
    firmTagline: '企業法務・労務リスク解決特化 総合法律事務所',
    firmPostalCode: '100-0005',
    postalCode: '100-0005',
    firmAddress: '東京都千代田区丸の内1-8-3 丸の内トラストタワーN館 18F',
    address: '東京都千代田区丸の内1-8-3 丸の内トラストタワーN館 18F',
    firmAccess: 'JR東京駅 日本橋口 徒歩1分 / 東京メトロ大手町駅 B7出口 徒歩2分',
    access: 'JR東京駅 日本橋口 徒歩1分 / 東京メトロ大手町駅 B7出口 徒歩2分',
    firmPhone: '03-6890-1234',
    phone: '03-6890-1234',
    firmEmail: 'contact@lumen-legal.example.com',
    email: 'contact@lumen-legal.example.com',
    representative: '代表弁護士 神崎 俊輔（第一東京弁護士会所属）',

    // ==========================================
    // 2. GAS Webhook 設定
    // ==========================================
    // GASデプロイ後に発行されたWebアプリURLをここに設定します。
    // 空文字（""）の場合は自動的に決定論的オフラインシミュレーションモードで動作します。
    gasWebhookUrl: '',
    gasTimeoutMs: 8000,

    // ==========================================
    // 3. 営業時間 & 相談枠設定
    // ==========================================
    businessHours: {
      weekday: '9:30 - 19:30',
      label: '平日 9:30 - 19:30（土日祝 定休 / 顧問先24時間チャット対応）'
    },
    // 定休日設定 (0: 日, 1: 月, 2: 火, 3: 水, 4: 木, 5: 金, 6: 土)
    closedDays: [0, 6], // 土曜日・日曜日 定休
    closedDaysLabel: '土曜日・日曜日・祝日（顧問先は24時間チャット受付）',

    // 1日4枠制の開始時刻一覧（各枠60分）
    timeSlots: ['10:00', '13:00', '15:30', '18:00'],

    // カレンダー表示日数
    daysToShow: 14,

    // 1枠あたりの定員数
    capacityPerSlot: 1,

    // ==========================================
    // 4. 2WAY相談形式定義 (Consultation Modes)
    // ==========================================
    consultationModes: {
      online: {
        id: 'online',
        label: 'Zoomオンライン相談',
        badge: '全国対応・移動ゼロ',
        description: '全国どこからでもZoom等で手軽にご相談いただけます。'
      },
      in_person: {
        id: 'in_person',
        label: '丸の内オフィス対面相談',
        badge: '完全個室・重要書類持参',
        description: '東京駅直結の丸の内オフィスにて完全個室で面談いたします。'
      }
    },

    // ==========================================
    // 5. 公式LINEアカウント連携設定
    // ==========================================
    lineOfficialUrl: 'https://line.me/R/ti/p/@lumen_legal',
    lineAccountId: '@lumen_legal',
    lineOaMessageUrl: 'https://line.me/R/oaMessage/@lumen_legal/?',

    // ==========================================
    // 6. 動的シミュレーション・フォールバック設定
    // ==========================================
    fallbackSimulation: true,
    simulationSeedSalt: 'lumen_legal_consulting_2026',

    // ==========================================
    // 7. 提供プランマスター (松竹梅 料金体系)
    // ==========================================
    planMaster: {
      free_trial: {
        id: 'free_trial',
        name: '初回60分 無料法律相談（毎月先着10社限定）',
        fullName: '【毎月先着10社限定】初回60分 無料法務・労務リスク診断（Zoom / 対面）',
        tier: 'trial',
        price: 0,
        priceLabel: '¥0（通常 ¥15,000）',
        durationMin: 60,
        isPopular: false,
        summary: '契約書・労務・未払いリスクの初回診断＆解決ロードマップのご提示'
      },
      bamboo: {
        id: 'bamboo',
        name: '【竹】スタンダード顧問プラン（労務＋契約＋チャット無制限）★人気No.1',
        fullName: '【竹★人気No.1】スタンダード顧問プラン（労務＋契約＋チャット無制限）',
        tier: 'bamboo',
        price: 50000,
        priceLabel: '¥50,000 / 月（税込 ¥55,000）',
        durationMin: 60,
        isPopular: true,
        summary: '契約書レビュー無制限＋労務・就業規則随時点検＋Slack/Chatwork直結＋月4回面談'
      },
      plum: {
        id: 'plum',
        name: '【梅】ライト顧問プラン（契約書チェック特化）',
        fullName: '【梅】ライト顧問プラン（契約書チェック特化）',
        tier: 'plum',
        price: 30000,
        priceLabel: '¥30,000 / 月（税込 ¥33,000）',
        durationMin: 30,
        isPopular: false,
        summary: '契約書レビュー月3通まで＋月2回オンライン相談＋メール・チャット相談'
      },
      pine: {
        id: 'pine',
        name: '【松】プレミアム顧問プラン（役員会同席＋戦略法務フルサポート）',
        fullName: '【松】プレミアム顧問プラン（役員会同席＋戦略法務フルサポート）',
        tier: 'pine',
        price: 100000,
        priceLabel: '¥100,000 / 月（税込 ¥110,000）',
        durationMin: 60,
        isPopular: false,
        summary: 'スタンダード全内容＋役員会同席＋優先即日対応＋知財/M&A＋専任弁護士2名体制'
      },
      spot_review: {
        id: 'spot_review',
        name: '【スポット】契約書作成・リーガルチェック',
        fullName: '【スポット】契約書作成・リーガルチェック（1案件単発対応）',
        tier: 'spot',
        price: 20000,
        priceLabel: '¥20,000〜 / 通（税込 ¥22,000〜）',
        durationMin: 60,
        isPopular: false,
        summary: '単発での契約書リーガルチェック・修正条項案作成・リスク洗い出し（最短24h納品）'
      }
    }
  };

  // ==========================================
  // 下位互換・構造化エイリアス定義 (Structured Aliases)
  // ==========================================
  LEGAL_CONFIG.firmInfo = {
    name: LEGAL_CONFIG.firmName,
    japaneseName: LEGAL_CONFIG.firmJapaneseName,
    tagline: LEGAL_CONFIG.firmTagline,
    postalCode: LEGAL_CONFIG.postalCode,
    address: LEGAL_CONFIG.address,
    access: LEGAL_CONFIG.access,
    tel: LEGAL_CONFIG.phone,
    email: LEGAL_CONFIG.email,
    representative: LEGAL_CONFIG.representative,
    businessHours: LEGAL_CONFIG.businessHours.label,
    regularHolidays: LEGAL_CONFIG.closedDays,
    regularHolidaysLabel: LEGAL_CONFIG.closedDaysLabel
  };

  LEGAL_CONFIG.gas = {
    webhookUrl: LEGAL_CONFIG.gasWebhookUrl,
    timeoutMs: LEGAL_CONFIG.gasTimeoutMs
  };

  LEGAL_CONFIG.calendar = {
    daysToShow: LEGAL_CONFIG.daysToShow,
    slots: [
      { id: '10:00', time: '10:00', label: '10:00〜', period: '午前', durationMin: 60 },
      { id: '13:00', time: '13:00', label: '13:00〜', period: '午後', durationMin: 60 },
      { id: '15:30', time: '15:30', label: '15:30〜', period: '午後', durationMin: 60 },
      { id: '18:00', time: '18:00', label: '18:00〜', period: '夕方', durationMin: 60 }
    ],
    closedDays: LEGAL_CONFIG.closedDays,
    capacityPerSlot: LEGAL_CONFIG.capacityPerSlot
  };

  LEGAL_CONFIG.plans = LEGAL_CONFIG.planMaster;

  LEGAL_CONFIG.line = {
    accountUrl: LEGAL_CONFIG.lineOfficialUrl,
    accountId: LEGAL_CONFIG.lineAccountId,
    oaMessageBaseUrl: LEGAL_CONFIG.lineOaMessageUrl
  };

  LEGAL_CONFIG.fallback = {
    enableSimulation: LEGAL_CONFIG.fallbackSimulation,
    simulationSeedSalt: LEGAL_CONFIG.simulationSeedSalt
  };

  // Global Export
  global.LEGAL_CONFIG = LEGAL_CONFIG;

  // CommonJS Support for Test Framework
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = LEGAL_CONFIG;
  }
})(typeof window !== 'undefined' ? window : this);
