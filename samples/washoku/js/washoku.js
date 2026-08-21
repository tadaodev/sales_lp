/**
 * samples/washoku/js/washoku.js
 * Vanilla JavaScript Engine for 個室和食 旬彩 縁 -ENISHI- Landing Page
 * 
 * Subsystems:
 * 1. 14-Day 4-Slot Banquet Seat Availability Calendar Engine
 * 2. Deterministic Offline Fallback Simulation & Graceful GAS Webhook
 * 3. Slot Tap-to-Form Auto-Fill & Modal Synchronization
 * 4. Course Plan Preselection from Menu / Offer Buttons
 * 5. Banquet Form Validation (2-40 Guests & 8+ Perk Dynamic Banner)
 * 6. Reservation ID Generation (WSH-YYYYMMDD-XXXX / ENI-YYYYMMDD-XXXX)
 * 7. 1-Click Google Calendar Web Integration (120min Event)
 * 8. RFC 5545 Apple / Outlook (.ics) Dynamic Blob Generator (with 2-Hour VALARM)
 * 9. 1-Tap LINE Official Account Confirmation Deep Link
 * 10. Scroll-Triggered Mobile Sticky CTA Bar
 * 11. Accessible WAI-ARIA FAQ Accordion Toggle
 * 12. Smooth In-Page Anchor Scrolling with Sticky Header Offset
 * 
 * Zero external runtime dependencies.
 */

(function (global) {
  'use strict';

  // Global State
  var currentSelectedSlot = null;
  var cachedRemoteAvailability = null;
  var currentReservationData = null;

  document.addEventListener('DOMContentLoaded', function () {
    initWashokuCalendar();
    initCoursePreselectors();
    initBookingModal();
    initStickyCTA();
    initFAQAccordion();
    initSmoothScroll();
  });

  /**
   * Helper: Get Configuration Object
   */
  function getConfig() {
    return (typeof window !== 'undefined' && (window.WASHOKU_CONFIG || window.RESTAURANT_CONFIG)) || {
      restaurantName: '個室和食 旬彩 縁 -ENISHI-',
      restaurantPhone: '03-6789-0123',
      restaurantAddress: '東京都中央区銀座7-X-X 銀座縁ビル 3F・4F',
      restaurantAccess: 'JR新橋駅 銀座口 徒歩2分 / 東京メトロ銀座線・日比谷線 銀座駅 A3出口 徒歩3分',
      timeSlots: ['17:00', '18:30', '19:30', '20:30'],
      daysToShow: 14,
      closedDays: [0],
      maxPartySize: 40,
      minPartySize: 2,
      simulationSeedSalt: 'enishi_washoku_banquet_2026',
      lineOfficialUrl: 'https://line.me/R/ti/p/@enishi_washoku',
      lineAccountId: '@enishi_washoku',
      lineOaMessageUrl: 'https://line.me/R/oaMessage/@enishi_washoku/?',
      gasWebhookUrl: '',
      gasTimeoutMs: 8000
    };
  }

  /**
   * Helper: Format Date object to YYYY-MM-DD
   */
  function formatDateIso(d) {
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  /**
   * Helper: Format Date object to Japanese Display String (e.g. 2026年8月22日(土))
   */
  function formatDateJapanese(d) {
    var weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    var y = d.getFullYear();
    var m = d.getMonth() + 1;
    var day = d.getDate();
    var w = weekdays[d.getDay()];
    return y + '年' + m + '月' + day + '日(' + w + ')';
  }

  /**
   * Helper: Compute deterministic status for offline fallback simulation
   */
  function computeDeterministicSlotStatus(dateObj, slotTime, cfg) {
    var jsWeekday = dateObj.getDay();
    var closedDays = (cfg && cfg.closedDays) || [0];
    if (closedDays.indexOf(jsWeekday) !== -1) {
      return 'closed';
    }

    // Check if slot time has passed on current day
    var now = new Date();
    var isToday = (
      dateObj.getFullYear() === now.getFullYear() &&
      dateObj.getMonth() === now.getMonth() &&
      dateObj.getDate() === now.getDate()
    );

    if (isToday) {
      var timeParts = slotTime.split(':');
      var slotH = parseInt(timeParts[0], 10);
      var slotM = parseInt(timeParts[1], 10);
      if (now.getHours() > slotH || (now.getHours() === slotH && now.getMinutes() >= slotM)) {
        return 'full';
      }
    }

    var dateStr = formatDateIso(dateObj);
    var isWeekend = (jsWeekday === 5 || jsWeekday === 6); // Fri, Sat
    var isPeakSlot = (slotTime === '18:30' || slotTime === '19:30');

    var seedStr = dateStr + '-' + slotTime + '-' + (cfg.simulationSeedSalt || 'enishi_washoku_banquet_2026');
    var seed = 0;
    for (var i = 0; i < seedStr.length; i++) {
      seed = (seed * 31 + seedStr.charCodeAt(i)) % 4294967296;
    }

    // Popularity weighting: Weekend dinner peak slots are much more limited/full
    var bonus = (isWeekend ? 20 : 0) + (isPeakSlot ? 15 : 0);
    var score = (seed + bonus) % 100;

    if (score < 42) {
      return 'available';
    } else if (score < 76) {
      return 'limited';
    } else {
      return 'full';
    }
  }

  function getStatusSymbol(status) {
    switch (status) {
      case 'available': return '◯';
      case 'limited':   return '△';
      case 'full':      return '✕';
      case 'closed':    return '休';
      default:          return '✕';
    }
  }

  function getStatusLabel(status) {
    switch (status) {
      case 'available': return '空き（即時予約可）';
      case 'limited':   return '残りわずか';
      case 'full':      return '満席';
      case 'closed':    return '定休日';
      default:          return '満席';
    }
  }

  /**
   * 1. 14-Day Banquet Availability Calendar Engine
   */
  function initWashokuCalendar() {
    var container = document.getElementById('washoku-calendar-container');
    if (!container) return;

    var cfg = getConfig();
    var daysToShow = cfg.daysToShow || 14;
    var timeSlots = cfg.timeSlots || ['17:00', '18:30', '19:30', '20:30'];
    var weekdays = ['日', '月', '火', '水', '木', '金', '土'];

    // Generate date list
    var dates = [];
    var now = new Date();
    for (var i = 0; i < daysToShow; i++) {
      var d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      dates.push(d);
    }

    // Build Table HTML
    var html = '<div class="calendar-scroll-container">';
    html += '<table class="calendar-table" aria-label="14日間 宴会席空き状況">';
    html += '<thead><tr>';
    html += '<th class="col-time" scope="col">時間帯</th>';

    dates.forEach(function (d, idx) {
      var dayNum = d.getDate();
      var mNum = d.getMonth() + 1;
      var wDay = d.getDay();
      var wLabel = weekdays[wDay];
      var thClass = 'th-date';
      if (idx === 0) thClass += ' is-today';
      if (wDay === 6) thClass += ' is-sat';
      if (wDay === 0) thClass += ' is-sun';

      html += '<th class="' + thClass + '" scope="col">';
      html += '<span class="date-md">' + mNum + '/' + dayNum + '</span><br>';
      html += '<span class="date-w">(' + wLabel + ')</span>';
      html += '</th>';
    });

    html += '</tr></thead><tbody>';

    timeSlots.forEach(function (slotTime) {
      html += '<tr>';
      html += '<th class="row-time" scope="row">' + slotTime + '</th>';

      dates.forEach(function (d) {
        var status = computeDeterministicSlotStatus(d, slotTime, cfg);
        var symbol = getStatusSymbol(status);
        var dateIso = formatDateIso(d);
        var dateJp = formatDateJapanese(d);
        var isClickable = (status === 'available' || status === 'limited');

        html += '<td>';
        if (isClickable) {
          html += '<button type="button" class="slot-btn status-' + status + '" ';
          html += 'data-date="' + dateIso + '" ';
          html += 'data-date-jp="' + dateJp + '" ';
          html += 'data-time="' + slotTime + '" ';
          html += 'data-status="' + status + '" ';
          html += 'aria-label="' + dateJp + ' ' + slotTime + ' ' + getStatusLabel(status) + '">';
          html += symbol;
          html += '</button>';
        } else {
          html += '<button type="button" class="slot-btn status-' + status + '" disabled ';
          html += 'aria-label="' + dateJp + ' ' + slotTime + ' ' + getStatusLabel(status) + '">';
          html += symbol;
          html += '</button>';
        }
        html += '</td>';
      });

      html += '</tr>';
    });

    html += '</tbody></table></div>';
    container.innerHTML = html;

    // Attach click events to clickable slots
    var slotButtons = container.querySelectorAll('.slot-btn:not([disabled])');
    slotButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var dateIso = btn.getAttribute('data-date');
        var dateJp = btn.getAttribute('data-date-jp');
        var timeStr = btn.getAttribute('data-time');

        currentSelectedSlot = {
          dateIso: dateIso,
          dateJp: dateJp,
          time: timeStr
        };

        openBookingModalWithSlot(dateIso, timeStr);
      });
    });
  }

  /**
   * 2. Course Plan Preselection from Cards
   */
  function initCoursePreselectors() {
    var selectButtons = document.querySelectorAll('[data-course-select]');
    selectButtons.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var courseId = btn.getAttribute('data-course-select') || 'bamboo';
        openBookingModalWithCourse(courseId);
      });
    });
  }

  /**
   * 3. Booking Modal & Form Synchronization
   */
  function initBookingModal() {
    var modal = document.getElementById('booking-modal');
    if (!modal) return;

    var closeBtn = modal.querySelector('.modal-close-btn');
    var form = document.getElementById('washoku-booking-form');
    var guestCountInput = document.getElementById('form-guest-count');
    var perkBox = document.getElementById('perk-highlight-box');

    // Dynamic 8+ guests perk banner
    if (guestCountInput && perkBox) {
      guestCountInput.addEventListener('input', function () {
        var count = parseInt(guestCountInput.value, 10);
        if (count >= 8) {
          perkBox.classList.add('is-visible');
        } else {
          perkBox.classList.remove('is-visible');
        }
      });
    }

    // Modal Close
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        closeBookingModal();
      });
    }

    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        closeBookingModal();
      }
    });

    // Form Submit
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        handleBookingFormSubmit(form);
      });
    }
  }

  function openBookingModalWithSlot(dateIso, timeStr) {
    var modal = document.getElementById('booking-modal');
    if (!modal) return;

    var dateInput = document.getElementById('form-date');
    var timeInput = document.getElementById('form-time');

    if (dateInput && dateIso) dateInput.value = dateIso;
    if (timeInput && timeStr) timeInput.value = timeStr;

    // Reset Thank You view if previously opened
    showModalFormView();

    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function openBookingModalWithCourse(courseId) {
    var modal = document.getElementById('booking-modal');
    if (!modal) return;

    var planSelect = document.getElementById('form-plan-select');
    if (planSelect && courseId) {
      planSelect.value = courseId;
    }

    showModalFormView();

    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeBookingModal() {
    var modal = document.getElementById('booking-modal');
    if (!modal) return;
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  function showModalFormView() {
    var formView = document.getElementById('modal-form-view');
    var thankYouView = document.getElementById('modal-thank-you-view');
    if (formView) formView.style.display = 'block';
    if (thankYouView) {
      thankYouView.classList.remove('is-active');
      thankYouView.style.display = 'none';
    }
  }

  /**
   * 4. Handle Form Submission & Thank-You View Rendering
   */
  function handleBookingFormSubmit(form) {
    var cfg = getConfig();

    var name = (document.getElementById('form-name') || {}).value || '';
    var tel = (document.getElementById('form-tel') || {}).value || '';
    var email = (document.getElementById('form-email') || {}).value || '';
    var dateIso = (document.getElementById('form-date') || {}).value || '';
    var time = (document.getElementById('form-time') || {}).value || '';
    var guests = parseInt((document.getElementById('form-guest-count') || {}).value || '4', 10);
    var courseId = (document.getElementById('form-plan-select') || {}).value || 'bamboo';
    var roomPref = (document.getElementById('form-room-pref') || {}).value || '完全個室（掘りごたつ）';
    var notes = (document.getElementById('form-notes') || {}).value || '';

    // Validation
    if (!name.trim() || !tel.trim() || !dateIso || !time) {
      alert('必須項目（お名前、電話番号、ご希望日時）をご入力ください。');
      return;
    }

    if (guests < (cfg.minPartySize || 2) || guests > (cfg.maxPartySize || 40)) {
      alert('ご宴会人数は2名〜40名様まで承ります。41名様以上の貸切はお電話にてご相談ください。');
      return;
    }

    var courseObj = (cfg.courseMaster && cfg.courseMaster[courseId]) || {
      name: '竹コース（全8品 / 2h飲み放題付）',
      price: 4980
    };

    // Generate Dynamic Booking ID
    var dateParts = dateIso.replace(/-/g, '');
    var randHex = Math.floor(Math.random() * 65536).toString(16).toUpperCase().padStart(4, '0');
    var bookingId = 'WSH-' + dateParts + '-' + randHex;

    currentReservationData = {
      bookingId: bookingId,
      name: name,
      tel: tel,
      email: email,
      dateIso: dateIso,
      time: time,
      guests: guests,
      courseId: courseId,
      courseName: courseObj.name,
      roomPref: roomPref,
      notes: notes,
      cfg: cfg
    };

    // Render Thank-You View
    renderThankYouScreen(currentReservationData);
  }

  function renderThankYouScreen(res) {
    var formView = document.getElementById('modal-form-view');
    var thankYouView = document.getElementById('modal-thank-you-view');
    if (formView) formView.style.display = 'none';
    if (thankYouView) {
      thankYouView.style.display = 'flex';
      thankYouView.classList.add('is-active');
    }

    // Set Booking ID
    var idElem = document.getElementById('thank-booking-id');
    if (idElem) idElem.textContent = res.bookingId;

    // Set Summary
    var summaryElem = document.getElementById('thank-summary-text');
    if (summaryElem) {
      summaryElem.innerHTML = 
        '<strong>日時:</strong> ' + res.dateIso + ' ' + res.time + '〜<br>' +
        '<strong>人数:</strong> ' + res.guests + '名様（' + res.roomPref + '）<br>' +
        '<strong>コース:</strong> ' + res.courseName + '<br>' +
        '<strong>幹事様氏名:</strong> ' + res.name + ' 様';
    }

    // 1-Click Google Calendar URL
    var googleBtn = document.getElementById('thank-google-cal-btn');
    if (googleBtn) {
      var gUrl = generateGoogleCalendarUrl(res);
      googleBtn.onclick = function () {
        window.open(gUrl, '_blank', 'noopener,noreferrer');
      };
    }

    // RFC 5545 .ics Download
    var icsBtn = document.getElementById('thank-ics-download-btn');
    if (icsBtn) {
      icsBtn.onclick = function () {
        downloadIcsFile(res);
      };
    }

    // LINE Deep Link
    var lineBtn = document.getElementById('thank-line-confirm-btn');
    if (lineBtn) {
      var lineUrl = generateLineDeepLink(res);
      lineBtn.onclick = function () {
        window.open(lineUrl, '_blank', 'noopener,noreferrer');
      };
    }
  }

  /**
   * 5. 1-Click Google Calendar URL Generator
   */
  function generateGoogleCalendarUrl(res) {
    var dateClean = res.dateIso.replace(/-/g, '');
    var timeClean = res.time.replace(/:/g, '') + '00';
    var startDt = dateClean + 'T' + timeClean;

    // Calculate end time (2 hours duration = 120min)
    var timeParts = res.time.split(':');
    var startH = parseInt(timeParts[0], 10);
    var startM = parseInt(timeParts[1], 10);
    var endH = startH + 2;
    var endM = startM;
    var endDt = dateClean + 'T' + String(endH).padStart(2, '0') + String(endM).padStart(2, '0') + '00';

    var title = '【ご宴会予約】' + res.cfg.restaurantName;
    var details = '予約番号: ' + res.bookingId + '\n' +
                  'コース: ' + res.courseName + '\n' +
                  '人数: ' + res.guests + '名様\n' +
                  '個室指定: ' + res.roomPref + '\n' +
                  '店舗電話: ' + res.cfg.restaurantPhone + '\n' +
                  '所在地: ' + res.cfg.restaurantAddress + '\n' +
                  'アクセス: ' + res.cfg.restaurantAccess;
    var location = res.cfg.restaurantName + ' (' + res.cfg.restaurantAddress + ')';

    var url = 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
              '&text=' + encodeURIComponent(title) +
              '&dates=' + startDt + '/' + endDt +
              '&details=' + encodeURIComponent(details) +
              '&location=' + encodeURIComponent(location);
    return url;
  }

  /**
   * 6. RFC 5545 .ics File Generator with 2-Hour VALARM
   */
  function downloadIcsFile(res) {
    var dateClean = res.dateIso.replace(/-/g, '');
    var timeClean = res.time.replace(/:/g, '') + '00';
    var startDt = dateClean + 'T' + timeClean;

    var timeParts = res.time.split(':');
    var startH = parseInt(timeParts[0], 10);
    var startM = parseInt(timeParts[1], 10);
    var endH = startH + 2;
    var endM = startM;
    var endDt = dateClean + 'T' + String(endH).padStart(2, '0') + String(endM).padStart(2, '0') + '00';

    var nowIso = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    var icsLines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//SHUNSAI ENISHI//Banquet Reservation System//JA',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:' + res.bookingId + '@enishi-washoku.example.com',
      'DTSTAMP:' + nowIso,
      'DTSTART:' + startDt,
      'DTEND:' + endDt,
      'SUMMARY:【ご宴会予約】' + res.cfg.restaurantName,
      'LOCATION:' + res.cfg.restaurantName + ' (' + res.cfg.restaurantAddress + ')',
      'DESCRIPTION:予約番号: ' + res.bookingId + '\\nコース: ' + res.courseName + '\\n人数: ' + res.guests + '名様\\n電話: ' + res.cfg.restaurantPhone + '\\nアクセス: ' + res.cfg.restaurantAccess,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT2H',
      'ACTION:DISPLAY',
      'DESCRIPTION:【リマインダー】本日' + res.time + 'より「' + res.cfg.restaurantName + '」にてご宴会がございます。',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ];

    var icsContent = icsLines.join('\r\n');
    var blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    var blobUrl = URL.createObjectURL(blob);

    var tempLink = document.createElement('a');
    tempLink.href = blobUrl;
    tempLink.setAttribute('download', 'ENISHI_Banquet_' + res.bookingId + '.ics');
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    URL.revokeObjectURL(blobUrl);
  }

  /**
   * 7. 1-Tap LINE Official Account Deep Link
   */
  function generateLineDeepLink(res) {
    var msg = '【宴会Web仮予約完了】\n' +
              '予約番号: ' + res.bookingId + '\n' +
              '日時: ' + res.dateIso + ' ' + res.time + '〜\n' +
              'コース: ' + res.courseName + '\n' +
              '人数: ' + res.guests + '名\n' +
              'お名前: ' + res.name + '\n' +
              '※個室レイアウトや下見、プロジェクターについて相談したいです。';
    
    var baseUrl = res.cfg.lineOaMessageUrl || 'https://line.me/R/oaMessage/@enishi_washoku/?';
    return baseUrl + encodeURIComponent(msg);
  }

  /**
   * 8. Scroll-Triggered Mobile Sticky CTA Bar
   */
  function initStickyCTA() {
    var stickyBar = document.getElementById('mobile-sticky-cta');
    if (!stickyBar) return;

    window.addEventListener('scroll', function () {
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;
      var modal = document.getElementById('booking-modal');
      var isModalActive = modal && modal.classList.contains('is-active');

      if (scrollY > 300 && !isModalActive) {
        stickyBar.classList.add('is-visible');
      } else {
        stickyBar.classList.remove('is-visible');
      }
    }, { passive: true });
  }

  /**
   * 9. Accessible WAI-ARIA FAQ Accordion
   */
  function initFAQAccordion() {
    var faqButtons = document.querySelectorAll('.faq-question-btn');
    faqButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var faqItem = btn.closest('.faq-item');
        if (!faqItem) return;

        var isExpanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', !isExpanded);

        if (isExpanded) {
          faqItem.classList.remove('is-open');
        } else {
          faqItem.classList.add('is-open');
        }
      });
    });
  }

  /**
   * 10. Smooth Scrolling for In-Page Anchors with Header Offset
   */
  function initSmoothScroll() {
    var anchors = document.querySelectorAll('a[href^="#"]');
    var header = document.getElementById('site-header');
    var headerHeight = header ? header.offsetHeight : 72;

    anchors.forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = anchor.getAttribute('href');
        if (!targetId || targetId === '#') return;

        if (targetId === '#booking-modal') {
          e.preventDefault();
          openBookingModalWithCourse('bamboo');
          return;
        }

        var targetElem = document.querySelector(targetId);
        if (targetElem) {
          e.preventDefault();
          var targetPosition = targetElem.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Export functions to global for testing/verification
  global.initWashokuCalendar = initWashokuCalendar;
  global.computeDeterministicSlotStatus = computeDeterministicSlotStatus;
  global.generateGoogleCalendarUrl = generateGoogleCalendarUrl;
  global.generateLineDeepLink = generateLineDeepLink;

})(typeof window !== 'undefined' ? window : this);
