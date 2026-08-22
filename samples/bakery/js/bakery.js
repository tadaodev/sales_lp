/**
 * samples/bakery/js/bakery.js
 * Vanilla JavaScript Engine for BOULANGERIE ARTISANALE Landing Page
 * - 14-Day Takeout Availability Calendar Engine (4 Daily Baking Batches: 08:00 / 11:30 / 14:00 / 16:30)
 * - Deterministic Offline Fallback Simulation
 * - Slot Selection & Reservation Form Auto-Fill Synchronization
 * - Plan Preselection Handlers (Matsutake 3-Tier + Alacarte)
 * - Accessible Booking Modal Dialog with Focus Management
 * - Enhanced Thank-You Screen with Reservation ID (BAK-YYYYMMDD-XXXX)
 * - 1-Click Google Calendar Web Integration
 * - RFC 5545 Apple / Outlook (.ics) Dynamic Blob Generator with 2-Hour Reminder (VALARM)
 * - 1-Tap LINE Official Account Confirmation Deep Link
 * - Scroll-triggered Mobile Sticky CTA Bar
 * - Accessible WAI-ARIA FAQ Accordion Toggle
 * - Smooth Scrolling for In-Page Anchors
 * Zero external runtime dependencies.
 */

(function () {
  'use strict';

  // Global State
  var currentSelectedSlot = null;

  document.addEventListener('DOMContentLoaded', function () {
    initAvailabilityCalendar();
    initPlanCardSelection();
    initStickyCTA();
    initFAQAccordion();
    initBookingModal();
    initSmoothScroll();
  });

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
   * Helper: Compute deterministic status for offline fallback
   */
  function computeDeterministicSlotStatus(dateObj, slotTime, cfg) {
    var jsWeekday = dateObj.getDay();
    var closedDays = (cfg && cfg.closedDays) || [1, 2]; // Mon, Tue
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
    var timeSlots = (cfg && cfg.timeSlots) || ['08:00', '11:00', '14:00', '16:30'];
    var slotIdx = timeSlots.indexOf(slotTime);
    if (slotIdx === -1) slotIdx = 0;

    var salt = (cfg && cfg.simulationSeedSalt) || 'boulangerie_artisanale_bakery_2026';
    var seedStr = dateStr + '-' + slotTime + '-' + salt;
    var seed = 0;
    for (var i = 0; i < seedStr.length; i++) {
      seed = (seed * 31 + seedStr.charCodeAt(i)) % 4294967296;
    }

    // Popularity weighting for weekends (Sat, Sun) and peak slots
    var bonus = 0;
    if (jsWeekday === 0 || jsWeekday === 6) bonus += 15;
    if (slotTime === '11:00' || slotTime === '11:30' || slotTime === '16:30') bonus += 10;

    var score = (seed + slotIdx * 13 + bonus) % 100;
    if (score < 45) {
      return 'available';
    } else if (score < 75) {
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
      case 'available': return '空きあり';
      case 'limited':   return '残りわずか';
      case 'full':      return '完売';
      case 'closed':    return '定休日';
      default:          return '完売';
    }
  }

  /**
   * 1. Availability Calendar Engine
   */
  function initAvailabilityCalendar() {
    var container = document.getElementById('bakery-calendar-container');
    if (!container) return;

    var cfg = window.BAKERY_CONFIG || {};
    var daysToShow = (cfg && cfg.daysToShow) || 14;
    var timeSlots = (cfg && cfg.timeSlots) || ['08:00', '11:00', '14:00', '16:30'];
    var weekdays = ['日', '月', '火', '水', '木', '金', '土'];

    // Generate 14 Date objects starting from today
    var today = new Date();
    var dates = [];
    for (var i = 0; i < daysToShow; i++) {
      var d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push(d);
    }

    function renderCalendarGrid(apiAvailabilityMap) {
      var html = '<table class="bakery-calendar-table" aria-label="14日間 焼き立てパン取り置き空き状況カレンダー">';

      // THEAD: Date Headers
      html += '<thead><tr>';
      html += '<th scope="col" style="min-width: 90px;">受取便 / 時間</th>';

      dates.forEach(function (d, idx) {
        var dayNum = d.getDate();
        var monthNum = d.getMonth() + 1;
        var dayOfWeek = d.getDay();
        var isToday = idx === 0;

        var colClasses = [];
        if (dayOfWeek === 6) colClasses.push('is-sat');
        if (dayOfWeek === 0) colClasses.push('is-sun');
        if (isToday) colClasses.push('is-today');

        var classAttr = colClasses.length > 0 ? ' class="' + colClasses.join(' ') + '"' : '';
        html += '<th scope="col"' + classAttr + '>';
        if (isToday) {
          html += '<span style="font-size:0.7rem;display:block;color:#FFE8A3;">本日</span>';
        }
        html += monthNum + '/' + dayNum + '<br>(' + weekdays[dayOfWeek] + ')';
        html += '</th>';
      });
      html += '</tr></thead>';

      // TBODY: Slot Rows
      html += '<tbody>';
      timeSlots.forEach(function (slotTime) {
        var batchLabel = '';
        if (slotTime === '08:00') batchLabel = '第1便 08:00';
        else if (slotTime === '11:00' || slotTime === '11:30') batchLabel = '第2便 ' + slotTime;
        else if (slotTime === '14:00') batchLabel = '第3便 14:00';
        else if (slotTime === '16:30') batchLabel = '第4便 16:30';
        else batchLabel = slotTime;

        html += '<tr>';
        html += '<th scope="row" class="slot-header-cell">' + batchLabel + '</th>';

        dates.forEach(function (d) {
          var dateIso = formatDateIso(d);
          var status = 'available';

          if (apiAvailabilityMap && apiAvailabilityMap[dateIso] && apiAvailabilityMap[dateIso][slotTime]) {
            status = apiAvailabilityMap[dateIso][slotTime];
          } else {
            status = computeDeterministicSlotStatus(d, slotTime, cfg);
          }

          var symbol = getStatusSymbol(status);
          var label = getStatusLabel(status);
          var cellClass = 'cal-slot-cell slot-' + status;

          var isClickable = (status === 'available' || status === 'limited');
          var dateJp = formatDateJapanese(d);

          if (isClickable) {
            html += '<td class="' + cellClass + '" tabindex="0" role="button" aria-label="' + dateJp + ' ' + slotTime + ' ' + label + '" ' +
              'data-date="' + dateIso + '" data-time="' + slotTime + '" data-status="' + status + '" data-date-jp="' + dateJp + '">';
            html += '<span class="status-symbol">' + symbol + '</span>';
            html += '</td>';
          } else {
            html += '<td class="' + cellClass + '" aria-disabled="true" aria-label="' + dateJp + ' ' + slotTime + ' ' + label + '">';
            html += '<span class="status-symbol">' + symbol + '</span>';
            html += '</td>';
          }
        });
        html += '</tr>';
      });
      html += '</tbody></table>';

      container.innerHTML = html;
      attachCalendarCellListeners();
    }

    function attachCalendarCellListeners() {
      var cells = container.querySelectorAll('.cal-slot-cell.slot-available, .cal-slot-cell.slot-limited');
      cells.forEach(function (cell) {
        cell.addEventListener('click', function () {
          // Remove previous selection highlight
          var prev = container.querySelector('.cal-slot-cell.is-selected');
          if (prev) prev.classList.remove('is-selected');
          cell.classList.add('is-selected');

          var dateIso = cell.getAttribute('data-date');
          var timeVal = cell.getAttribute('data-time');
          var dateJp = cell.getAttribute('data-date-jp');

          currentSelectedSlot = {
            dateIso: dateIso,
            time: timeVal,
            dateJp: dateJp
          };

          var formattedStr = dateJp + ' ' + timeVal + ' 受取';

          // Auto-populate #form-datetime input
          var datetimeInput = document.getElementById('form-datetime');
          if (datetimeInput) {
            datetimeInput.value = formattedStr;
            var group = datetimeInput.closest('.form-group');
            if (group) group.classList.remove('has-error');
          }

          // Open booking modal smoothly with current plan
          var planSelect = document.getElementById('form-plan');
          var planVal = planSelect ? planSelect.value : 'bamboo';
          if (typeof window.openBakeryBookingModal === 'function') {
            window.openBakeryBookingModal(planVal, formattedStr);
          } else {
            var modal = document.getElementById('booking-modal');
            if (modal) {
              modal.classList.add('is-open');
              modal.setAttribute('aria-hidden', 'false');
              document.body.style.overflow = 'hidden';
            }
          }

          // Focus on customer name input
          var nameInput = document.getElementById('form-name');
          if (nameInput) {
            setTimeout(function () {
              nameInput.focus();
            }, 100);
          }
        });
      });
    }

    // Render calendar (GAS check or offline fallback)
    if (cfg.gasWebhookUrl && typeof cfg.gasWebhookUrl === 'string' && cfg.gasWebhookUrl.trim() !== '') {
      var startDateStr = formatDateIso(dates[0]);
      var fetchUrl = cfg.gasWebhookUrl + '?action=getAvailability&days=' + daysToShow + '&startDate=' + startDateStr;

      var timeoutPromise = new Promise(function (_, reject) {
        setTimeout(function () { reject(new Error('GAS fetch timeout')); }, 4500);
      });

      Promise.race([
        fetch(fetchUrl),
        timeoutPromise
      ])
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP status ' + res.status);
          return res.json();
        })
        .then(function (data) {
          if (data && data.status === 'success' && (data.availability || data.slots)) {
            renderCalendarGrid(data.availability || data.slots);
          } else {
            renderCalendarGrid(null);
          }
        })
        .catch(function (err) {
          console.warn('GAS live availability fetch failed, fallback simulation active:', err);
          renderCalendarGrid(null);
        });
    } else {
      // Deterministic Offline Simulation
      renderCalendarGrid(null);
    }
  }

  /**
   * 2. Plan Card Preselection Handlers
   */
  function initPlanCardSelection() {
    var planButtons = document.querySelectorAll('.btn-select-plan, .btn-select-alacarte');
    var planSelect = document.getElementById('form-plan');

    planButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var planId = btn.getAttribute('data-plan-id') || 'bamboo';
        if (planSelect) {
          planSelect.value = planId;
        }

        if (typeof window.openBakeryBookingModal === 'function') {
          window.openBakeryBookingModal(planId);
        } else {
          var modal = document.getElementById('booking-modal');
          if (modal) {
            modal.classList.add('is-open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
          }
        }
      });
    });
  }

  /**
   * 3. Mobile Sticky CTA Bar
   */
  function initStickyCTA() {
    var stickyBar = document.getElementById('mobile-sticky-cta');
    var actionSection = document.getElementById('booking') || document.getElementById('action');
    if (!stickyBar) return;

    var ticking = false;

    function updateStickyVisibility() {
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;
      var showThreshold = 350;

      var actionInView = false;
      if (actionSection) {
        var rect = actionSection.getBoundingClientRect();
        var windowHeight = window.innerHeight || document.documentElement.clientHeight;
        if (rect.top < windowHeight && rect.bottom > 100) {
          actionInView = true;
        }
      }

      if (scrollY > showThreshold && !actionInView) {
        stickyBar.classList.add('is-visible');
      } else {
        stickyBar.classList.remove('is-visible');
      }

      ticking = false;
    }

    window.addEventListener(
      'scroll',
      function () {
        if (!ticking) {
          window.requestAnimationFrame(updateStickyVisibility);
          ticking = true;
        }
      },
      { passive: true }
    );

    updateStickyVisibility();
  }

  /**
   * 4. Accessible WAI-ARIA FAQ Accordion
   */
  function initFAQAccordion() {
    var faqButtons = document.querySelectorAll('.faq-question-btn');

    faqButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var faqItem = button.closest('.faq-item');
        if (!faqItem) return;

        var isExpanded = button.getAttribute('aria-expanded') === 'true';

        if (isExpanded) {
          button.setAttribute('aria-expanded', 'false');
          faqItem.classList.remove('is-active');
        } else {
          button.setAttribute('aria-expanded', 'true');
          faqItem.classList.add('is-active');
        }
      });
    });
  }

  /**
   * 5. Accessible Booking Modal Dialog, Validation & Thank-You View Handlers
   */
  function initBookingModal() {
    var modal = document.getElementById('booking-modal');
    var closeBtn = document.getElementById('modal-close-btn');
    var openBtnMain = document.getElementById('btn-open-modal-main');
    var finalCloseBtn = document.getElementById('modal-success-close-btn');
    var bookingFormView = document.getElementById('booking-form-view');
    var thankyouView = document.getElementById('thankyou-view');
    var bookingForm = document.getElementById('bakery-booking-form');
    var planSelect = document.getElementById('form-plan');

    if (!modal) return;

    window.openBakeryBookingModal = function (preselectPlan, prefilledDatetime) {
      if (planSelect && preselectPlan) {
        planSelect.value = preselectPlan;
      }
      if (prefilledDatetime) {
        var datetimeInput = document.getElementById('form-datetime');
        if (datetimeInput) datetimeInput.value = prefilledDatetime;
      }

      if (bookingFormView) bookingFormView.style.display = 'block';
      if (thankyouView) {
        thankyouView.style.display = 'none';
        thankyouView.classList.remove('is-visible');
      }

      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    function closeModal() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (finalCloseBtn) finalCloseBtn.addEventListener('click', closeModal);
    if (openBtnMain) {
      openBtnMain.addEventListener('click', function () {
        window.openBakeryBookingModal();
      });
    }

    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeModal();
      }
    });

    // Form Submission & Thank-You View Generation
    if (bookingForm) {
      bookingForm.addEventListener('submit', function (e) {
        e.preventDefault();

        var isValid = true;
        var requiredFields = bookingForm.querySelectorAll('[required]');

        requiredFields.forEach(function (field) {
          var group = field.closest('.form-group');
          var value = field.value ? field.value.trim() : '';

          if (!value) {
            isValid = false;
            if (group) group.classList.add('has-error');
          } else {
            if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
              isValid = false;
              if (group) group.classList.add('has-error');
            } else {
              if (group) group.classList.remove('has-error');
            }
          }

          field.addEventListener(
            'input',
            function () {
              if (group) group.classList.remove('has-error');
            },
            { once: true }
          );
        });

        if (!isValid) return;

        // Extract submitted form data
        var nameInput = document.getElementById('form-name');
        var phoneInput = document.getElementById('form-phone');
        var emailInput = document.getElementById('form-email');
        var datetimeInput = document.getElementById('form-datetime');
        var notesInput = document.getElementById('form-notes');

        var nameVal = nameInput ? nameInput.value.trim() : '';
        var phoneVal = phoneInput ? phoneInput.value.trim() : '';
        var emailVal = emailInput ? emailInput.value.trim() : '';
        var planKey = planSelect ? planSelect.value : 'bamboo';
        var datetimeVal = datetimeInput ? datetimeInput.value.trim() : '';
        var notesVal = notesInput ? notesInput.value.trim() : '';

        var cfg = window.BAKERY_CONFIG || {};
        var bakeryName = cfg.bakeryName || 'BOULANGERIE ARTISANALE';
        var bakeryAddress = cfg.address || '東京都目黒区八雲3-12-8 ブーランジェリーテラス 1F';

        // Plan metadata
        var planObj = (cfg.planMaster && cfg.planMaster[planKey]) || (cfg.plans && cfg.plans[planKey]) || {
          name: '【竹★人気No.1】人気定番7種詰め合わせBOX',
          priceLabel: '¥3,480（税込）'
        };
        var planName = planObj.name || '人気定番7種詰め合わせBOX';

        // 1. Generate Reservation ID (format: BAK-YYYYMMDD-XXXX)
        var now = new Date();
        var yStr = String(now.getFullYear());
        var mStr = String(now.getMonth() + 1).padStart(2, '0');
        var dStr = String(now.getDate()).padStart(2, '0');
        var hexChars = '0123456789ABCDEF';
        var randCode = '';
        for (var ci = 0; ci < 4; ci++) {
          randCode += hexChars.charAt(Math.floor(Math.random() * hexChars.length));
        }
        var resId = 'BAK-' + yStr + mStr + dStr + '-' + randCode;

        // 2. Parse Date & Start/End Times for Calendar Sync
        var dateMatch = datetimeVal.match(/(\d{4})[年\-\/](\d{1,2})[月\-\/](\d{1,2})/);
        var timeMatch = datetimeVal.match(/(\d{1,2}):(\d{2})/);

        var bYear = dateMatch ? dateMatch[1] : yStr;
        var bMonth = dateMatch ? String(dateMatch[2]).padStart(2, '0') : mStr;
        var bDay = dateMatch ? String(dateMatch[3]).padStart(2, '0') : dStr;
        var dateClean = bYear + '-' + bMonth + '-' + bDay;

        var startH = timeMatch ? parseInt(timeMatch[1], 10) : 11;
        var startM = timeMatch ? parseInt(timeMatch[2], 10) : 0;
        var startIso = bYear + bMonth + bDay + 'T' + String(startH).padStart(2, '0') + String(startM).padStart(2, '0') + '00';

        var endTotalMin = startH * 60 + startM + 30; // 30 min pickup window
        var endH = Math.floor(endTotalMin / 60) % 24;
        var endM = endTotalMin % 60;
        var endIso = bYear + bMonth + bDay + 'T' + String(endH).padStart(2, '0') + String(endM).padStart(2, '0') + '00';

        // 3. Send Async GAS Request if configured
        if (cfg.gasWebhookUrl && typeof cfg.gasWebhookUrl === 'string' && cfg.gasWebhookUrl.trim() !== '') {
          try {
            fetch(cfg.gasWebhookUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify({
                action: 'createBooking',
                reservationId: resId,
                name: nameVal,
                phone: phoneVal,
                email: emailVal,
                plan: planName,
                planId: planKey,
                date: dateClean,
                time: String(startH).padStart(2, '0') + ':' + String(startM).padStart(2, '0'),
                datetime: datetimeVal,
                notes: notesVal,
                createdAt: new Date().toISOString()
              })
            }).catch(function (err) {
              console.warn('GAS POST booking error (offline fallback handled seamlessly):', err);
            });
          } catch (postErr) {
            console.warn('GAS POST exception:', postErr);
          }
        }

        // 4. Populate Thank-You View Details
        var resIdElem = document.getElementById('res-id');
        var resNameElem = document.getElementById('res-name');
        var resPlanElem = document.getElementById('res-plan');
        var resDatetimeElem = document.getElementById('res-datetime');
        var resLocationElem = document.getElementById('res-location');

        if (resIdElem) resIdElem.textContent = resId;
        if (resNameElem) resNameElem.textContent = nameVal + ' 様';
        if (resPlanElem) resPlanElem.textContent = planName;
        if (resDatetimeElem) resDatetimeElem.textContent = datetimeVal;
        if (resLocationElem) resLocationElem.textContent = bakeryName + '（' + bakeryAddress + '）';

        // 5. Setup Google Calendar 1-Click Link
        var gcalTitle = '【パン受取予約】' + bakeryName;
        var gcalDetails = 'ご予約番号: ' + resId + '\nお名前: ' + nameVal + ' 様\nプラン: ' + planName + '\n受取日時: ' + datetimeVal + '\n場所: ' + bakeryAddress + '\n※焼き立てをご用意してお待ちしております。';
        var gcalUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' +
          encodeURIComponent(gcalTitle) +
          '&dates=' + startIso + '/' + endIso +
          '&details=' + encodeURIComponent(gcalDetails) +
          '&location=' + encodeURIComponent(bakeryAddress);

        var googleCalBtn = document.getElementById('btn-google-cal');
        if (googleCalBtn) {
          googleCalBtn.href = gcalUrl;
        }

        // 6. Setup Apple Calendar / Outlook (.ics) RFC 5545 Generator
        var icsDownloadBtn = document.getElementById('btn-download-ics');
        if (icsDownloadBtn) {
          icsDownloadBtn.onclick = function () {
            var dtStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
            var icsLines = [
              'BEGIN:VCALENDAR',
              'VERSION:2.0',
              'PRODID:-//BOULANGERIE ARTISANALE//Takeout Reservation System//JA',
              'CALSCALE:GREGORIAN',
              'METHOD:PUBLISH',
              'BEGIN:VEVENT',
              'UID:' + resId + '@boulangerie-artisanale.example.com',
              'DTSTAMP:' + dtStamp,
              'DTSTART:' + startIso,
              'DTEND:' + endIso,
              'SUMMARY:【パン受取】' + bakeryName,
              'DESCRIPTION:ご予約番号: ' + resId + '\\nプラン: ' + planName + '\\n受取日時: ' + datetimeVal + '\\n店舗: ' + bakeryAddress,
              'LOCATION:' + bakeryAddress,
              'STATUS:CONFIRMED',
              'BEGIN:VALARM',
              'TRIGGER:-PT2H',
              'ACTION:DISPLAY',
              'DESCRIPTION:焼き立てパン受取の2時間前リマインダー',
              'END:VALARM',
              'END:VEVENT',
              'END:VCALENDAR'
            ];

            var icsContent = icsLines.join('\r\n');
            var blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.setAttribute('download', 'bakery_pickup_' + resId + '.ics');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          };
        }

        // 7. Setup LINE Deep Link with Pre-filled Message
        var lineConfirmBtn = document.getElementById('btn-line-confirm');
        if (lineConfirmBtn) {
          var lineMsg = '【焼き立てパン取り置き予約】\n予約番号: ' + resId + '\nお名前: ' + nameVal + ' 様\nプラン: ' + planName + '\n受取日時: ' + datetimeVal + '\nよろしくお願いいたします。';
          var lineBase = (cfg && cfg.lineOaMessageUrl) || 'https://line.me/R/oaMessage/@boulangerie_art/?';
          lineConfirmBtn.href = lineBase + encodeURIComponent(lineMsg);
        }

        // Switch modal view to Thank-You state
        if (bookingFormView) bookingFormView.style.display = 'none';
        if (thankyouView) {
          thankyouView.style.display = 'block';
          thankyouView.classList.add('is-visible');
        }
      });
    }
  }

  /**
   * 6. Smooth Scrolling for In-Page Anchors
   */
  function initSmoothScroll() {
    var links = document.querySelectorAll('a[href^="#"]');
    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (!href || href === '#' || href.length <= 1) return;

        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          var header = document.getElementById('site-header');
          var headerHeight = header ? header.offsetHeight : 74;
          var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }
})();
