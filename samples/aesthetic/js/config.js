/**
 * samples/aesthetic/js/config.js
 * Centralized Salon & Booking System Configuration
 * 
 * This file serves as the single source of truth for:
 * 1. Salon identity and contact metadata
 * 2. Google Apps Script (GAS) Webhook endpoint URL
 * 3. Business hours, closed days, and appointment time slots
 * 4. Master pricing plans
 * 5. Official LINE deep links and cancellation prevention URLs
 * 6. Dynamic offline fallback simulation settings
 */

(function (global) {
  'use strict';

  var SALON_CONFIG = {
    // ==========================================
    // 1. サロン基本情報 (Salon Metadata)
    // ==========================================
    salonName: 'Salon de Étoile（サロン ド エトワール）',
    salonTagline: '銀座・完全個室 筋膜リフト＆エクソソーム美肌サロン',
    salonPostalCode: '104-0061',
    salonAddress: '東京都中央区銀座6-10-1 GINZA SIX 8F',
    salonAccess: '東京メトロ銀座駅 A3出口 徒歩2分 / 東銀座駅 A1出口 徒歩3分',
    salonPhone: '03-5555-0192',
    salonEmail: 'info@example-etoile.jp',
    
    // ==========================================
    // 2. GAS Webhook エンドポイント設定
    // ==========================================
    // GASデプロイ後に発行されたWebアプリURLをここに貼り付けてください。
    // 空文字（""）の場合は自動的に高精度な「動的シミュレーションモード（オフラインフォールバック）」で動作します。
    gasWebhookUrl: '',
    gasTimeoutMs: 8000,

    // ==========================================
    // 3. 営業時間・定休日・予約枠設定
    // ==========================================
    businessHours: {
      start: '10:00',
      end: '20:00',
      label: '10:00 - 20:00（最終受付 18:30）'
    },
    // 定休日設定 (0: 日, 1: 月, 2: 火, 3: 水, 4: 木, 5: 金, 6: 土)
    closedDays: [2], // 毎週火曜日定休
    closedDaysLabel: '毎週火曜日',
    
    // 1日4枠制の開始時刻一覧
    timeSlots: ['10:00', '13:00', '16:00', '18:30'],
    
    // カレンダー表示日数
    daysToShow: 14,
    
    // 1枠あたりの定員数
    capacityPerSlot: 1,

    // ==========================================
    // 4. 公式LINEアカウント連携設定
    // ==========================================
    lineOfficialUrl: 'https://line.me/R/ti/p/@lumiera_salon',
    lineAccountId: '@lumiera_salon',
    lineOaMessageUrl: 'https://line.me/R/oaMessage/@lumiera_salon/?',

    // ==========================================
    // 5. 動的シミュレーション・フォールバック設定
    // ==========================================
    fallbackSimulation: true,
    simulationSeedSalt: 'etoile_luxury_salon_2026',

    // ==========================================
    // 6. 提供プランマスター (Plan Master List)
    // ==========================================
    planMaster: {
      bamboo: {
        id: 'bamboo',
        name: '竹プラン（80分）★人気No.1',
        fullName: '【竹★人気No.1】極上エクソソーム導入＆筋膜フルリフト（80分）',
        originalPrice: 28500,
        trialPrice: 7980,
        discountRate: '72% OFF',
        durationMin: 80,
        isPopular: true,
        summary: '筋膜リリース×高濃度ヒト幹細胞エクソソーム導入の極上フルコース'
      },
      plum: {
        id: 'plum',
        name: '梅プラン（60分）',
        fullName: '【梅】筋膜リフト集中ショートコース（60分）',
        originalPrice: 18000,
        trialPrice: 5800,
        discountRate: '68% OFF',
        durationMin: 60,
        isPopular: false,
        summary: 'お顔のたるみ・フェイスラインのむくみを速攻ケアするショートコース'
      },
      pine: {
        id: 'pine',
        name: '松プラン（100分）',
        fullName: '【松】VIPフルオーダーメイド・幹細胞プレミアム再生（100分）',
        originalPrice: 38000,
        trialPrice: 11800,
        discountRate: '69% OFF',
        durationMin: 100,
        isPopular: false,
        summary: 'デコルテ・首肩・頭皮まで徹底アプローチするVIP最上級エイジングケア'
      }
    }
  };

  // ==========================================
  // 下位互換・構造化エイリアス定義 (Structured Aliases)
  // ==========================================
  SALON_CONFIG.salonInfo = {
    name: SALON_CONFIG.salonName,
    tagline: SALON_CONFIG.salonTagline,
    postalCode: SALON_CONFIG.salonPostalCode,
    address: SALON_CONFIG.salonAddress,
    access: SALON_CONFIG.salonAccess,
    tel: SALON_CONFIG.salonPhone,
    email: SALON_CONFIG.salonEmail,
    businessHours: SALON_CONFIG.businessHours.label,
    regularHolidays: SALON_CONFIG.closedDays,
    regularHolidaysLabel: SALON_CONFIG.closedDaysLabel
  };

  SALON_CONFIG.gas = {
    webhookUrl: SALON_CONFIG.gasWebhookUrl,
    timeoutMs: SALON_CONFIG.gasTimeoutMs
  };

  SALON_CONFIG.calendar = {
    daysToShow: SALON_CONFIG.daysToShow,
    slots: [
      { id: '10:00', time: '10:00', label: '10:00〜', period: '午前', durationMin: 80 },
      { id: '13:00', time: '13:00', label: '13:00〜', period: '午後', durationMin: 80 },
      { id: '16:00', time: '16:00', label: '16:00〜', period: '夕方', durationMin: 80 },
      { id: '18:30', time: '18:30', label: '18:30〜', period: '夜間', durationMin: 80 }
    ],
    capacityPerSlot: SALON_CONFIG.capacityPerSlot
  };

  SALON_CONFIG.plans = SALON_CONFIG.planMaster;

  SALON_CONFIG.line = {
    accountUrl: SALON_CONFIG.lineOfficialUrl,
    accountId: SALON_CONFIG.lineAccountId,
    oaMessageBaseUrl: SALON_CONFIG.lineOaMessageUrl
  };

  SALON_CONFIG.fallback = {
    enableSimulation: SALON_CONFIG.fallbackSimulation,
    simulationSeedSalt: SALON_CONFIG.simulationSeedSalt
  };

  // Global Export
  global.SALON_CONFIG = SALON_CONFIG;

  // Node.js commonjs support for testing
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SALON_CONFIG;
  }

})(typeof window !== 'undefined' ? window : this);
