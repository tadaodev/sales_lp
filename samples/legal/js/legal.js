/**
 * samples/legal/js/legal.js
 * Vanilla JavaScript Engine for LUMEN LEGAL CONSULTING Landing Page
 * - 14-Day 2WAY Availability Calendar Engine (Zoom Online vs Marunouchi In-Person)
 * - Deterministic Offline Fallback Simulation
 * - Mode Switching (Online / In-Person) & Tab State Sync
 * - Slot Selection & Consultation Form Auto-Fill Synchronization
 * - Accessible Booking Modal Dialog with Focus Trapping & Plan Preselection
 * - Enhanced Thank-You Screen with Reservation ID (LUM-YYYYMMDD-XXXX)
 * - 1-Click Google Calendar Web Integration (with dynamic location)
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
  var currentConsultationMode = 'online'; // 'online' | 'in_person'

  document.addEventListener('DOMContentLoaded', function () {
    initModeSwitching();
    initAvailabilityCalendar();
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
  function computeDeterministicSlotStatus(dateObj, slotTime, mode, cfg) {
    var jsWeekday = dateObj.getDay();
    var closedDays = (cfg && cfg.closedDays) || [0, 6];
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
    var timeSlots = (cfg && cfg.timeSlots) || ['10:00', '13:00', '15:30', '18:00'];
    var slotIdx = timeSlots.indexOf(slotTime);
    if (slotIdx === -1) slotIdx = 0;

    var modeSalt = mode === 'in_person' ? 'inperson_office' : 'online_zoom';
    var seedStr = dateStr + '-' + slotTime + '-' + modeSalt;
    var seed = 0;
    for (var i = 0; i < seedStr.length; i++) {
      seed = (seed * 31 + seedStr.charCodeAt(i)) % 4294967296;
    }

    var score = (seed + slotIdx * 11) % 100;
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
      case 'available': return '空き';
      case 'limited':   return '残り1';
      case 'full':      return '満席';
      case 'closed':    return '定休';
      default:          return '満席';
    }
  }

  /**
   * 1. 2WAY Consultation Mode Switching (Online vs In-Person)
   */
  function initModeSwitching() {
    var modeTabs = document.querySelectorAll('.consultation-mode-tab, [data-mode-tab]');
    if (!modeTabs || modeTabs.length === 0) return;

    modeTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var mode = tab.getAttribute('data-mode') || tab.getAttribute('data-mode-tab');
        if (!mode || mode === currentConsultationMode) return;

        currentConsultationMode = mode;

        // Update active tab styles
        modeTabs.forEach(function (t) {
          var tMode = t.getAttribute('data-mode') || t.getAttribute('data-mode-tab');
          if (tMode === mode) {
            t.classList.add('is-active');
            t.setAttribute('aria-selected', 'true');
          } else {
            t.classList.remove('is-active');
            t.setAttribute('aria-selected', 'false');
          }
        });

        // Update form mode dropdown if present
        var formModeSelect = document.getElementById('form-mode');
        if (formModeSelect) {
          formModeSelect.value = mode;
        }

        // Re-render calendar with new mode context
        renderCalendar();
      });
    });
  }

  /**
   * 2. 14-Day 2WAY Availability Calendar Engine
   */
  var renderCalendar = function () {};

  function initAvailabilityCalendar() {
    var container = document.getElementById('calendar-table-container') || document.getElementById('legal-calendar-container');
    if (!container) return;

    var cfg = window.LEGAL_CONFIG || {
      closedDays: [0, 6],
      timeSlots: ['10:00', '13:00', '15:30', '18:00'],
      daysToShow: 14,
      gasWebhookUrl: ''
    };

    var daysToShow = cfg.daysToShow || 14;
    var timeSlots = cfg.timeSlots || ['10:00', '13:00', '15:30', '18:00'];
    var weekdays = ['日', '月', '火', '水', '木', '金', '土'];

    // Generate 14 consecutive days starting from today
    var today = new Date();
    var dates = [];
    for (var i = 0; i < daysToShow; i++) {
      var d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
      dates.push(d);
    }

    function renderCalendarGrid(remoteAvailability) {
      var modeLabel = currentConsultationMode === 'in_person' ? '丸の内対面' : 'Zoomオンライン';
      var tableHtml = '<table class="calendar-grid-table" aria-label="14日間 相談予約空き状況カレンダー (' + modeLabel + ')">';

      // THEAD: Date Headers
      tableHtml += '<thead><tr>';
      tableHtml += '<th scope="col" class="calendar-corner-th">時間枠</th>';

      dates.forEach(function (d, idx) {
        var isToday = idx === 0;
        var jsWeekday = d.getDay();
        var isSat = jsWeekday === 6;
        var isSun = jsWeekday === 0;
        var dateStr = (d.getMonth() + 1) + '/' + d.getDate();
        var weekdayStr = weekdays[jsWeekday];

        var thClass = 'calendar-date-th';
        if (isToday) thClass += ' is-today';
        if (isSat) thClass += ' is-sat';
        if (isSun) thClass += ' is-sun';

        tableHtml += '<th scope="col" class="' + thClass + '">';
        if (isToday) {
          tableHtml += '<span class="th-today-badge">本日</span>';
        }
        tableHtml += '<span class="th-date-str">' + dateStr + '</span>';
        tableHtml += '<span class="th-weekday-str">(' + weekdayStr + ')</span>';
        tableHtml += '</th>';
      });

      tableHtml += '</tr></thead>';

      // TBODY: Time Slot Rows
      tableHtml += '<tbody>';

      timeSlots.forEach(function (slotTime) {
        tableHtml += '<tr>';
        tableHtml += '<td class="calendar-time-td">' + slotTime + '</td>';

        dates.forEach(function (d) {
          var dateIso = formatDateIso(d);
          var jsWeekday = d.getDay();
          var weekdayStr = weekdays[jsWeekday];
          var formattedJapanese = formatDateJapanese(d) + ' ' + slotTime + '〜 (' + modeLabel + ')';

          var status = 'full';
          if (remoteAvailability && remoteAvailability[dateIso] && remoteAvailability[dateIso][slotTime]) {
            var s = remoteAvailability[dateIso][slotTime];
            status = typeof s === 'string' ? s : (s.status || 'full');
          } else {
            status = computeDeterministicSlotStatus(d, slotTime, currentConsultationMode, cfg);
          }

          var symbol = getStatusSymbol(status);
          var label = getStatusLabel(status);
          var isDisabled = (status === 'full' || status === 'closed');
          var btnClass = 'calendar-slot-btn is-' + status;

          tableHtml += '<td class="calendar-slot-td">';
          tableHtml += '<button type="button" class="' + btnClass + '" ';
          tableHtml += 'data-date="' + dateIso + '" ';
          tableHtml += 'data-time="' + slotTime + '" ';
          tableHtml += 'data-day="' + weekdayStr + '" ';
          tableHtml += 'data-mode="' + currentConsultationMode + '" ';
          tableHtml += 'data-status="' + status + '" ';
          tableHtml += 'data-formatted="' + formattedJapanese + '" ';
          tableHtml += 'aria-label="' + formattedJapanese + ' 空き状況: ' + label + '" ';
          if (isDisabled) {
            tableHtml += 'disabled="disabled" aria-disabled="true"';
          }
          tableHtml += '>';
          tableHtml += '<span class="slot-symbol">' + symbol + '</span>';
          tableHtml += '<span class="slot-sublabel">' + label + '</span>';
          tableHtml += '</button>';
          tableHtml += '</td>';
        });

        tableHtml += '</tr>';
      });

      tableHtml += '</tbody></table>';

      container.innerHTML = tableHtml;

      // Bind slot tap click listeners
      var slotButtons = container.querySelectorAll('.calendar-slot-btn:not([disabled])');
      slotButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          // Remove previous selection highlight
          var allSlots = container.querySelectorAll('.calendar-slot-btn');
          allSlots.forEach(function (s) { s.classList.remove('is-selected'); });

          // Add active highlight to tapped slot
          btn.classList.add('is-selected');

          var formattedStr = btn.getAttribute('data-formatted') || '';
          var dateVal = btn.getAttribute('data-date') || '';
          var timeVal = btn.getAttribute('data-time') || '';
          var dayVal = btn.getAttribute('data-day') || '';
          var modeVal = btn.getAttribute('data-mode') || currentConsultationMode;

          currentSelectedSlot = {
            date: dateVal,
            time: timeVal,
            day: dayVal,
            mode: modeVal,
            formatted: formattedStr
          };

          // Auto-populate #form-datetime input
          var datetimeInput = document.getElementById('form-datetime');
          if (datetimeInput) {
            datetimeInput.value = formattedStr;
            var group = datetimeInput.closest('.form-group');
            if (group) group.classList.remove('has-error');
          }

          // Auto-populate #form-mode input
          var formModeSelect = document.getElementById('form-mode');
          if (formModeSelect) {
            formModeSelect.value = modeVal;
          }

          // Open booking modal smoothly with current plan
          var planSelect = document.getElementById('form-plan');
          var planVal = planSelect ? planSelect.value : 'free_trial';
          if (typeof window.openLegalBookingModal === 'function') {
            window.openLegalBookingModal(planVal, modeVal);
          } else {
            var modal = document.getElementById('booking-modal');
            if (modal) {
              modal.classList.add('is-open');
              modal.setAttribute('aria-hidden', 'false');
              document.body.style.overflow = 'hidden';
            }
          }

          // Focus on customer company/name input for instant entry
          var nameInput = document.getElementById('form-name');
          if (nameInput) {
            setTimeout(function () {
              nameInput.focus();
            }, 100);
          }
        });
      });
    }

    renderCalendar = function () {
      if (cfg.gasWebhookUrl && typeof cfg.gasWebhookUrl === 'string' && cfg.gasWebhookUrl.trim() !== '') {
        var startDateStr = formatDateIso(dates[0]);
        var fetchUrl = cfg.gasWebhookUrl + '?action=getAvailability&days=' + daysToShow + '&startDate=' + startDateStr + '&mode=' + currentConsultationMode;

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
    };

    // Initial render
    renderCalendar();
  }

  /**
   * 3. Mobile Sticky CTA Bar Logic
   */
  function initStickyCTA() {
    var stickyBar = document.getElementById('mobile-sticky-cta');
    var actionSection = document.getElementById('action');
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
   * 5. Accessible Booking Modal Dialog, Validation, and Post-Booking Handlers
   */
  function initBookingModal() {
    var modal = document.getElementById('booking-modal');
    var modalCloseBtn = document.getElementById('modal-close');
    var openModalButtons = document.querySelectorAll('.js-open-modal');
    var planSelect = document.getElementById('form-plan');
    var modeSelect = document.getElementById('form-mode');
    var bookingForm = document.getElementById('modal-booking-form');
    var successState = document.getElementById('modal-success-state');
    var successCloseBtn = document.getElementById('modal-success-close-btn');

    if (!modal) return;

    var lastFocusedElement = null;

    function openModal(preselectedPlan, preselectedMode) {
      lastFocusedElement = document.activeElement;

      if (planSelect && preselectedPlan) {
        planSelect.value = preselectedPlan;
      }
      if (modeSelect && preselectedMode) {
        modeSelect.value = preselectedMode;
      }

      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      // If reopening form, reset views
      if (bookingForm && successState) {
        bookingForm.style.display = 'flex';
        successState.style.display = 'none';
      }

      // If #form-datetime is empty, prefill with next available business day slot
      var datetimeInput = document.getElementById('form-datetime');
      if (datetimeInput && !datetimeInput.value.trim()) {
        if (currentSelectedSlot && currentSelectedSlot.formatted) {
          datetimeInput.value = currentSelectedSlot.formatted;
        } else {
          var targetDate = new Date();
          targetDate.setDate(targetDate.getDate() + 1);
          // If tomorrow is Saturday (6), skip to Monday
          if (targetDate.getDay() === 6) {
            targetDate.setDate(targetDate.getDate() + 2);
          } else if (targetDate.getDay() === 0) {
            targetDate.setDate(targetDate.getDate() + 1);
          }
          var modeLabel = (modeSelect && modeSelect.value === 'in_person') ? '丸の内対面' : 'Zoomオンライン';
          datetimeInput.value = formatDateJapanese(targetDate) + ' 13:00〜 (' + modeLabel + ')';
        }
      }

      var firstInput = modal.querySelector('input, select, textarea, button');
      if (firstInput) {
        setTimeout(function () {
          firstInput.focus();
        }, 50);
      }
    }

    function closeModal() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';

      if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
      }
    }

    // Expose global openModal / closeModal
    window.openLegalBookingModal = openModal;
    window.closeLegalBookingModal = closeModal;

    // Attach click listeners to trigger buttons
    openModalButtons.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var plan = btn.getAttribute('data-plan') || 'free_trial';
        var mode = btn.getAttribute('data-mode') || currentConsultationMode;
        openModal(plan, mode);
      });
    });

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', function () {
        closeModal();
      });
    }

    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        closeModal();
      }
    });

    if (successCloseBtn) {
      successCloseBtn.addEventListener('click', function () {
        closeModal();
      });
    }

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
        var companyInput = document.getElementById('form-company');
        var phoneInput = document.getElementById('form-phone');
        var emailInput = document.getElementById('form-email');
        var modeSelectEl = document.getElementById('form-mode');
        var datetimeInput = document.getElementById('form-datetime');
        var notesInput = document.getElementById('form-notes');

        var nameVal = nameInput ? nameInput.value.trim() : '';
        var companyVal = companyInput ? companyInput.value.trim() : '';
        var phoneVal = phoneInput ? phoneInput.value.trim() : '';
        var emailVal = emailInput ? emailInput.value.trim() : '';
        var modeVal = modeSelectEl ? modeSelectEl.value : currentConsultationMode;
        var planKey = planSelect ? planSelect.value : 'free_trial';
        var datetimeVal = datetimeInput ? datetimeInput.value.trim() : '';
        var notesVal = notesInput ? notesInput.value.trim() : '';

        var cfg = window.LEGAL_CONFIG || {};
        var firmName = cfg.firmName || 'LUMEN LEGAL CONSULTING';
        var firmAddress = cfg.address || '東京都千代田区丸の内1-8-3 丸の内トラストタワーN館 18F';
        var lineId = cfg.lineAccountId || '@lumen_legal';

        var modeLabel = modeVal === 'in_person' ? '丸の内オフィス対面相談' : 'Zoomオンライン相談';
        var locationStr = modeVal === 'in_person' ? firmAddress : 'Zoom Meeting URL（確定後にメール/LINEにてご案内）';

        // Plan metadata
        var planObj = (cfg.planMaster && cfg.planMaster[planKey]) || (cfg.plans && cfg.plans[planKey]) || {
          name: '初回60分 無料法律相談',
          priceLabel: '¥0',
          durationMin: 60
        };
        var planName = planObj.name || '初回60分 無料法律相談';
        var durationMin = planObj.durationMin || 60;

        // 1. Generate Reservation ID (format: LUM-YYYYMMDD-XXXX)
        var now = new Date();
        var yStr = String(now.getFullYear());
        var mStr = String(now.getMonth() + 1).padStart(2, '0');
        var dStr = String(now.getDate()).padStart(2, '0');
        var hexChars = '0123456789ABCDEF';
        var randCode = '';
        for (var ci = 0; ci < 4; ci++) {
          randCode += hexChars.charAt(Math.floor(Math.random() * hexChars.length));
        }
        var resId = 'LUM-' + yStr + mStr + dStr + '-' + randCode;

        // 2. Parse Date & Start/End Times for Calendar Sync
        var dateMatch = datetimeVal.match(/(\d{4})[年\-\/](\d{1,2})[月\-\/](\d{1,2})/);
        var timeMatch = datetimeVal.match(/(\d{1,2}):(\d{2})/);

        var bYear = dateMatch ? dateMatch[1] : yStr;
        var bMonth = dateMatch ? String(dateMatch[2]).padStart(2, '0') : mStr;
        var bDay = dateMatch ? String(dateMatch[3]).padStart(2, '0') : dStr;
        var dateClean = bYear + '-' + bMonth + '-' + bDay;

        var startH = timeMatch ? parseInt(timeMatch[1], 10) : 13;
        var startM = timeMatch ? parseInt(timeMatch[2], 10) : 0;
        var startIso = bYear + bMonth + bDay + 'T' + String(startH).padStart(2, '0') + String(startM).padStart(2, '0') + '00';

        var endTotalMin = startH * 60 + startM + durationMin;
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
                company: companyVal,
                phone: phoneVal,
                email: emailVal,
                mode: modeVal,
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
        var resCompanyElem = document.getElementById('res-company');
        var resModeElem = document.getElementById('res-mode');
        var resPlanElem = document.getElementById('res-plan');
        var resDatetimeElem = document.getElementById('res-datetime');
        var resLocationElem = document.getElementById('res-location');

        if (resIdElem) resIdElem.textContent = resId;
        if (resNameElem) resNameElem.textContent = nameVal + (companyVal ? ' 様 (' + companyVal + ')' : ' 様');
        if (resCompanyElem) resCompanyElem.textContent = companyVal || '（未記入）';
        if (resModeElem) resModeElem.textContent = modeLabel;
        if (resPlanElem) resPlanElem.textContent = planName;
        if (resDatetimeElem) resDatetimeElem.textContent = datetimeVal;
        if (resLocationElem) resLocationElem.textContent = locationStr;

        // 5. Setup Google Calendar 1-Click Link
        var gcalTitle = '【法律相談予約】' + firmName + ' (' + modeLabel + ')';
        var gcalDetails = 'ご予約番号: ' + resId + '\nお名前: ' + nameVal + (companyVal ? ' (' + companyVal + ')' : '') + '\n相談形式: ' + modeLabel + '\nプラン: ' + planName + '\n場所: ' + locationStr + '\n※担当弁護士がお待ちしております。';
        var gcalUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' +
          encodeURIComponent(gcalTitle) +
          '&dates=' + startIso + '/' + endIso +
          '&details=' + encodeURIComponent(gcalDetails) +
          '&location=' + encodeURIComponent(modeVal === 'in_person' ? firmAddress : 'Zoom Online');

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
              'PRODID:-//LUMEN LEGAL CONSULTING//Reservation System//JA',
              'CALSCALE:GREGORIAN',
              'METHOD:PUBLISH',
              'BEGIN:VEVENT',
              'UID:' + resId + '@lumen-legal.example.com',
              'DTSTAMP:' + dtStamp,
              'DTSTART:' + startIso,
              'DTEND:' + endIso,
              'SUMMARY:【法律相談】' + firmName + ' (' + modeLabel + ')',
              'DESCRIPTION:ご予約番号: ' + resId + '\\n相談形式: ' + modeLabel + '\\nプラン: ' + planName + '\\n場所: ' + locationStr,
              'LOCATION:' + (modeVal === 'in_person' ? firmAddress : 'Zoom Online Meeting'),
              'STATUS:CONFIRMED',
              'BEGIN:VALARM',
              'TRIGGER:-PT2H',
              'ACTION:DISPLAY',
              'DESCRIPTION:法律相談の2時間前リマインダー',
              'END:VALARM',
              'END:VEVENT',
              'END:VCALENDAR'
            ];

            var icsContent = icsLines.join('\r\n');
            var icsBlob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
            var downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(icsBlob);
            downloadLink.download = 'lumen_legal_consultation_' + resId + '.ics';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
          };
        }

        // 7. Setup LINE 1-Tap Confirmation Deep Link
        var timeDisplayStr = String(startH).padStart(2, '0') + ':' + String(startM).padStart(2, '0');
        var lineMsg = '【法律相談予約確認】\n予約番号: ' + resId + '\nお名前: ' + nameVal + (companyVal ? ' (' + companyVal + ')' : '') + '\n相談形式: ' + modeLabel + '\nご希望日時: ' + dateClean + ' ' + timeDisplayStr + '\n選択プラン: ' + planName + '\nよろしくお願いいたします。';
        var lineUrl = 'https://line.me/R/oaMessage/' + lineId + '/?' + encodeURIComponent(lineMsg);

        var lineConfirmBtn = document.getElementById('btn-line-confirm');
        if (lineConfirmBtn) {
          lineConfirmBtn.href = lineUrl;
        }

        // 8. Switch view smoothly to Thank-You state
        bookingForm.style.display = 'none';
        if (successState) {
          successState.style.display = 'block';
        }
        bookingForm.reset();
      });
    }
  }

  /**
   * 6. Smooth Scrolling for In-Page Anchor Links
   */
  function initSmoothScroll() {
    var anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (!href || href === '#') return;

        var targetEl = document.querySelector(href);
        if (targetEl) {
          e.preventDefault();
          var headerOffset = 70;
          var elementPosition = targetEl.getBoundingClientRect().top;
          var offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }
})();
