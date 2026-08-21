/**
 * samples/italian/js/italian.js
 * Vanilla JavaScript for TRATTORIA & PIZZERIA BELLA TAVOLA Landing Page
 * 
 * Subsystems:
 * 1. 14-Day 2-Shift (Lunch / Dinner) Seat Availability Calendar Engine
 * 2. Deterministic Offline Fallback Simulation & Optional GAS Sync
 * 3. Slot Tap-to-Form Auto-Fill & Smooth Scroll Navigation
 * 4. Course Plan Preselection from Menu / Offer Buttons
 * 5. Booking Form Validation & Submit Handling
 * 6. Reservation ID Generation (TAV-YYYYMMDD-XXXX)
 * 7. 1-Click Google Calendar Web Integration
 * 8. RFC 5545 Apple / Outlook (.ics) Dynamic Blob Generator (with 2-Hour VALARM)
 * 9. 1-Tap LINE Official Account Deep Link Confirmation
 * 10. Scroll-triggered Mobile Sticky CTA Bar
 * 11. Accessible FAQ Accordion Toggle (WAI-ARIA compliant)
 * 12. Smooth In-Page Anchor Scrolling with Sticky Header Offset
 * 
 * Zero external runtime dependencies.
 */

(function () {
  'use strict';

  // Global State
  var currentSelectedShift = 'dinner'; // default active shift tab
  var currentSelectedSlot = null;
  var cachedRemoteAvailability = null;

  document.addEventListener('DOMContentLoaded', function () {
    initItalianCalendar();
    initCoursePreselectors();
    initBookingForm();
    initStickyCTA();
    initFAQAccordion();
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
   * Helper: Compute deterministic status for offline fallback simulation
   */
  function computeDeterministicSlotStatus(dateObj, slotTime, shift, cfg) {
    var jsWeekday = dateObj.getDay();
    var closedDays = (cfg && cfg.closedDays) || [2];
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
    var isDinner = shift === 'dinner';
    var isWeekend = (jsWeekday === 0 || jsWeekday === 6);

    var seedStr = dateStr + '-' + slotTime + '-' + (cfg.simulationSeedSalt || 'bella_tavola_italian_2026');
    var seed = 0;
    for (var i = 0; i < seedStr.length; i++) {
      seed = (seed * 31 + seedStr.charCodeAt(i)) % 4294967296;
    }

    // Popularity weighting: weekend dinners are more limited/full
    var bonus = (isDinner ? 12 : 0) + (isWeekend ? 18 : 0);
    var score = (seed + bonus) % 100;

    if (score < 48) {
      return 'available';
    } else if (score < 78) {
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
      case 'available': return '空席あり';
      case 'limited':   return '残りわずか';
      case 'full':      return '満席';
      case 'closed':    return '定休日';
      default:          return '満席';
    }
  }

  /**
   * 1. 14-Day 2-Shift Seat Availability Calendar Engine
   */
  function initItalianCalendar() {
    var container = document.getElementById('calendar-table-container');
    var shiftTabs = document.querySelectorAll('[data-shift-tab]');
    if (!container) return;

    var cfg = window.RESTAURANT_CONFIG || {
      closedDays: [2],
      timeSlots: {
        lunch: ['11:30', '12:00', '12:30', '13:00', '13:30'],
        dinner: ['17:30', '18:00', '18:30', '19:00', '19:30', '20:00']
      },
      daysToShow: 14,
      gasWebhookUrl: ''
    };

    var daysToShow = cfg.daysToShow || 14;
    var weekdays = ['日', '月', '火', '水', '木', '金', '土'];

    // Generate 14 consecutive dates starting from today
    var today = new Date();
    var dates = [];
    for (var i = 0; i < daysToShow; i++) {
      var d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
      dates.push(d);
    }

    function renderGrid(shift) {
      var slots = (cfg.timeSlots && cfg.timeSlots[shift]) || (shift === 'lunch'
        ? ['11:30', '12:00', '12:30', '13:00', '13:30']
        : ['17:30', '18:00', '18:30', '19:00', '19:30', '20:00']);

      var shiftLabel = shift === 'lunch' ? 'ランチ席予約' : 'ディナー席予約';
      var tableHtml = '<table class="calendar-grid-table" aria-label="14日間 ' + shiftLabel + ' 空き状況カレンダー">';

      // THEAD
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

      // TBODY
      tableHtml += '<tbody>';

      slots.forEach(function (slotTime) {
        tableHtml += '<tr>';
        tableHtml += '<td class="calendar-time-td">' + slotTime + '</td>';

        dates.forEach(function (d) {
          var dateIso = formatDateIso(d);
          var jsWeekday = d.getDay();
          var weekdayStr = weekdays[jsWeekday];
          var shiftJp = shift === 'lunch' ? 'ランチ' : 'ディナー';
          var formattedJapanese = formatDateJapanese(d) + ' ' + slotTime + '〜 (' + shiftJp + ')';

          var status = 'full';
          if (cachedRemoteAvailability && cachedRemoteAvailability[dateIso] && cachedRemoteAvailability[dateIso][slotTime]) {
            var s = cachedRemoteAvailability[dateIso][slotTime];
            status = typeof s === 'string' ? s : (s.status || 'full');
          } else {
            status = computeDeterministicSlotStatus(d, slotTime, shift, cfg);
          }

          var symbol = getStatusSymbol(status);
          var label = getStatusLabel(status);
          var isDisabled = (status === 'full' || status === 'closed');
          var isSelected = currentSelectedSlot && currentSelectedSlot.date === dateIso && currentSelectedSlot.time === slotTime;
          var btnClass = 'calendar-slot-btn is-' + status + (isSelected ? ' is-selected' : '');

          tableHtml += '<td class="calendar-slot-td">';
          tableHtml += '<button type="button" class="' + btnClass + '" ';
          tableHtml += 'data-date="' + dateIso + '" ';
          tableHtml += 'data-time="' + slotTime + '" ';
          tableHtml += 'data-shift="' + shift + '" ';
          tableHtml += 'data-day="' + weekdayStr + '" ';
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

      // Attach Click Listeners to Available / Limited slots
      var slotButtons = container.querySelectorAll('.calendar-slot-btn:not([disabled])');
      slotButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          // Update selection styling
          var allSlots = container.querySelectorAll('.calendar-slot-btn');
          allSlots.forEach(function (s) { s.classList.remove('is-selected'); });
          btn.classList.add('is-selected');

          var formattedStr = btn.getAttribute('data-formatted') || '';
          var dateVal = btn.getAttribute('data-date') || '';
          var timeVal = btn.getAttribute('data-time') || '';
          var shiftVal = btn.getAttribute('data-shift') || 'dinner';
          var dayVal = btn.getAttribute('data-day') || '';

          currentSelectedSlot = {
            date: dateVal,
            time: timeVal,
            shift: shiftVal,
            day: dayVal,
            formatted: formattedStr
          };

          // Populate Form Inputs
          var datetimeInput = document.getElementById('form-datetime');
          var dateHidden = document.getElementById('form-date');
          var timeHidden = document.getElementById('form-time');
          var shiftHidden = document.getElementById('form-shift');

          if (datetimeInput) {
            datetimeInput.value = formattedStr;
            var group = datetimeInput.closest('.form-group');
            if (group) group.classList.remove('has-error');
          }
          if (dateHidden) dateHidden.value = dateVal;
          if (timeHidden) timeHidden.value = timeVal;
          if (shiftHidden) shiftHidden.value = shiftVal;

          // If course is not set, select sensible default based on shift
          var courseSelect = document.getElementById('form-course');
          if (courseSelect) {
            if (shiftVal === 'lunch' && courseSelect.value !== 'lunch_b') {
              courseSelect.value = 'lunch_b';
            } else if (shiftVal === 'dinner' && courseSelect.value === 'lunch_b') {
              courseSelect.value = 'bamboo';
            }
          }

          // Smoothly scroll down to the booking form
          var bookingFormSection = document.getElementById('booking-form-section') || document.getElementById('booking-form') || document.getElementById('action');
          if (bookingFormSection) {
            var headerOffset = 70;
            var elementPosition = bookingFormSection.getBoundingClientRect().top;
            var offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }

          // Focus on name input
          var nameInput = document.getElementById('form-name');
          if (nameInput) {
            setTimeout(function () { nameInput.focus(); }, 450);
          }
        });
      });
    }

    // Shift Tab Switching Listener
    shiftTabs.forEach(function (tab) {
      tab.addEventListener('click', function (e) {
        e.preventDefault();
        var shift = this.getAttribute('data-shift-tab') || 'dinner';
        currentSelectedShift = shift;

        shiftTabs.forEach(function (t) {
          var isActive = t === tab;
          t.classList.toggle('is-active', isActive);
          t.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        renderGrid(shift);
      });
    });

    // Remote GAS Fetch (Optional with instant fallback)
    if (cfg.gasWebhookUrl && typeof cfg.gasWebhookUrl === 'string' && cfg.gasWebhookUrl.trim() !== '') {
      var startDateStr = formatDateIso(dates[0]);
      var fetchUrl = cfg.gasWebhookUrl + '?action=getAvailability&days=' + daysToShow + '&startDate=' + startDateStr;

      var timeoutPromise = new Promise(function (_, reject) {
        setTimeout(function () { reject(new Error('GAS fetch timeout')); }, 4500);
      });

      Promise.race([fetch(fetchUrl), timeoutPromise])
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.json();
        })
        .then(function (data) {
          if (data && data.status === 'success' && (data.availability || data.slots)) {
            cachedRemoteAvailability = data.availability || data.slots;
            renderGrid(currentSelectedShift);
          } else {
            renderGrid(currentSelectedShift);
          }
        })
        .catch(function (err) {
          console.warn('GAS live availability fetch failed, fallback simulation active:', err);
          renderGrid(currentSelectedShift);
        });
    } else {
      renderGrid(currentSelectedShift);
    }
  }

  /**
   * 2. Course Preselection from Menu / Offer Buttons
   */
  function initCoursePreselectors() {
    var courseButtons = document.querySelectorAll('.js-select-course');
    var courseSelect = document.getElementById('form-course');

    courseButtons.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var courseId = btn.getAttribute('data-course');
        if (courseSelect && courseId) {
          courseSelect.value = courseId;
        }

        // Adjust active shift tab based on course
        if (courseId === 'lunch_b' || courseId === 'pranzo_speciale') {
          var lunchTab = document.querySelector('[data-shift-tab="lunch"]');
          if (lunchTab && !lunchTab.classList.contains('is-active')) {
            lunchTab.click();
          }
        } else if (courseId === 'bamboo' || courseId === 'plum' || courseId === 'pine') {
          var dinnerTab = document.querySelector('[data-shift-tab="dinner"]');
          if (dinnerTab && !dinnerTab.classList.contains('is-active')) {
            dinnerTab.click();
          }
        }

        // Smooth scroll to calendar section so user selects date
        var targetSection = document.getElementById('availability-calendar') || document.getElementById('action');
        if (targetSection) {
          var headerOffset = 70;
          var elementPosition = targetSection.getBoundingClientRect().top;
          var offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  /**
   * 3. Booking Form Validation, Submission & Thank-You Modal
   */
  function initBookingForm() {
    var bookingForm = document.getElementById('booking-form');
    var modal = document.getElementById('booking-modal');
    var modalCloseBtn = document.getElementById('modal-close');
    var modalSuccessCloseBtn = document.getElementById('modal-success-close-btn');

    if (!bookingForm) return;

    function openModal() {
      if (!modal) return;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      if (!modal) return;
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalSuccessCloseBtn) modalSuccessCloseBtn.addEventListener('click', closeModal);

    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) closeModal();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
        closeModal();
      }
    });

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
          } else if (field.type === 'tel' && !/^[0-9\-+]{10,15}$/.test(value.replace(/[\s\(\)]/g, ''))) {
            isValid = false;
            if (group) group.classList.add('has-error');
          } else {
            if (group) group.classList.remove('has-error');
          }
        }

        field.addEventListener('input', function () {
          if (group) group.classList.remove('has-error');
        }, { once: true });
      });

      if (!isValid) {
        var firstErr = bookingForm.querySelector('.has-error input, .has-error select');
        if (firstErr) firstErr.focus();
        return;
      }

      // Extract Form Values
      var nameVal = (document.getElementById('form-name') || {}).value || '';
      var phoneVal = (document.getElementById('form-phone') || {}).value || '';
      var emailVal = (document.getElementById('form-email') || {}).value || '';
      var guestsVal = (document.getElementById('form-guests') || {}).value || '2';
      var courseSelect = document.getElementById('form-course');
      var courseKey = courseSelect ? courseSelect.value : 'bamboo';
      var seatingSelect = document.getElementById('form-seating');
      var seatingVal = seatingSelect ? seatingSelect.options[seatingSelect.selectedIndex].text : 'テーブル席';
      var datetimeVal = (document.getElementById('form-datetime') || {}).value || '';
      var notesVal = (document.getElementById('form-notes') || {}).value || '';

      var cfg = window.RESTAURANT_CONFIG || {};
      var restaurantName = cfg.restaurantName || 'TRATTORIA & PIZZERIA BELLA TAVOLA';
      var restaurantAddress = cfg.restaurantAddress || '東京都渋谷区神宮前5-X-X 表参道テラス 1F';
      var restaurantPhone = cfg.restaurantPhone || '03-5678-9012';
      var lineId = cfg.lineAccountId || '@bella_tavola';

      var courseObj = (cfg.courseMaster && cfg.courseMaster[courseKey]) || {
        name: '竹：Classicoコース（全7品）',
        durationMin: 120,
        priceLabel: '¥6,800'
      };
      var courseName = courseObj.name || (courseSelect ? courseSelect.options[courseSelect.selectedIndex].text : '竹：Classicoコース');
      var durationMin = courseObj.durationMin || 120;

      // 1. Generate Reservation ID (format: TAV-YYYYMMDD-XXXX)
      var now = new Date();
      var yStr = String(now.getFullYear());
      var mStr = String(now.getMonth() + 1).padStart(2, '0');
      var dStr = String(now.getDate()).padStart(2, '0');
      var hexChars = '0123456789ABCDEF';
      var randCode = '';
      for (var ci = 0; ci < 4; ci++) {
        randCode += hexChars.charAt(Math.floor(Math.random() * hexChars.length));
      }
      var resId = 'TAV-' + yStr + mStr + dStr + '-' + randCode;

      // 2. Parse Date & Start/End Timestamps
      var dateMatch = datetimeVal.match(/(\d{4})[年\-\/](\d{1,2})[月\-\/](\d{1,2})/);
      var timeMatch = datetimeVal.match(/(\d{1,2}):(\d{2})/);

      var bYear = dateMatch ? dateMatch[1] : yStr;
      var bMonth = dateMatch ? String(dateMatch[2]).padStart(2, '0') : mStr;
      var bDay = dateMatch ? String(dateMatch[3]).padStart(2, '0') : dStr;
      var dateClean = bYear + '-' + bMonth + '-' + bDay;

      var startH = timeMatch ? parseInt(timeMatch[1], 10) : 18;
      var startM = timeMatch ? parseInt(timeMatch[2], 10) : 30;
      var startIso = bYear + bMonth + bDay + 'T' + String(startH).padStart(2, '0') + String(startM).padStart(2, '0') + '00';

      var endTotalMin = startH * 60 + startM + durationMin;
      var endH = Math.floor(endTotalMin / 60) % 24;
      var endM = endTotalMin % 60;
      var endIso = bYear + bMonth + bDay + 'T' + String(endH).padStart(2, '0') + String(endM).padStart(2, '0') + '00';

      // 3. Optional Async GAS Webhook Dispatch (Graceful fallback)
      if (cfg.gasWebhookUrl && typeof cfg.gasWebhookUrl === 'string' && cfg.gasWebhookUrl.trim() !== '') {
        try {
          fetch(cfg.gasWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
              action: 'createBooking',
              restaurant: restaurantName,
              reservationId: resId,
              name: nameVal,
              phone: phoneVal,
              email: emailVal,
              guests: guestsVal,
              course: courseName,
              courseId: courseKey,
              seating: seatingVal,
              date: dateClean,
              time: String(startH).padStart(2, '0') + ':' + String(startM).padStart(2, '0'),
              datetime: datetimeVal,
              shift: currentSelectedShift,
              notes: notesVal,
              createdAt: new Date().toISOString()
            })
          }).catch(function (err) {
            console.warn('GAS POST booking error (fallback handled seamlessly):', err);
          });
        } catch (postErr) {
          console.warn('GAS POST exception:', postErr);
        }
      }

      // 4. Populate Thank-You View Details in Modal
      var resIdElem = document.getElementById('res-id');
      var resNameElem = document.getElementById('res-name');
      var resGuestsElem = document.getElementById('res-guests');
      var resCourseElem = document.getElementById('res-course');
      var resDatetimeElem = document.getElementById('res-datetime');
      var resSeatingElem = document.getElementById('res-seating');
      var resRestaurantElem = document.getElementById('res-restaurant');

      if (resIdElem) resIdElem.textContent = resId;
      if (resNameElem) resNameElem.textContent = nameVal + ' 様';
      if (resGuestsElem) resGuestsElem.textContent = guestsVal + ' 名様';
      if (resCourseElem) resCourseElem.textContent = courseName;
      if (resDatetimeElem) resDatetimeElem.textContent = datetimeVal;
      if (resSeatingElem) resSeatingElem.textContent = seatingVal;
      if (resRestaurantElem) resRestaurantElem.textContent = restaurantName + ' (' + restaurantAddress + ')';

      // 5. Setup Google Calendar 1-Click Link
      var gcalTitle = '【席予約完了】' + restaurantName + ' (' + guestsVal + '名様)';
      var gcalDetails = 'ご予約番号: ' + resId + '\nお名前: ' + nameVal + ' 様\n人数: ' + guestsVal + '名様\nコース: ' + courseName + '\nお席: ' + seatingVal + '\n店舗: ' + restaurantName + '\n電話: ' + restaurantPhone + '\n※ご来店を心よりお待ち申し上げております。';
      var gcalUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' +
        encodeURIComponent(gcalTitle) +
        '&dates=' + startIso + '/' + endIso +
        '&details=' + encodeURIComponent(gcalDetails) +
        '&location=' + encodeURIComponent(restaurantAddress);

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
            'PRODID:-//BELLA TAVOLA//Restaurant Reservation System//JA',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH',
            'BEGIN:VEVENT',
            'UID:' + resId + '@bellatavola.example.com',
            'DTSTAMP:' + dtStamp,
            'DTSTART:' + startIso,
            'DTEND:' + endIso,
            'SUMMARY:【席予約】' + restaurantName + ' (' + guestsVal + '名様)',
            'DESCRIPTION:ご予約番号: ' + resId + '\\nお名前: ' + nameVal + ' 様\\n人数: ' + guestsVal + '名様\\nコース: ' + courseName + '\\n場所: ' + restaurantAddress + '\\n電話: ' + restaurantPhone,
            'LOCATION:' + restaurantAddress,
            'STATUS:CONFIRMED',
            'BEGIN:VALARM',
            'TRIGGER:-PT2H',
            'ACTION:DISPLAY',
            'DESCRIPTION:BELLA TAVOLA ご予約の2時間前リマインダー',
            'END:VALARM',
            'END:VEVENT',
            'END:VCALENDAR'
          ];

          var icsContent = icsLines.join('\r\n');
          var icsBlob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
          var downloadLink = document.createElement('a');
          downloadLink.href = URL.createObjectURL(icsBlob);
          downloadLink.download = 'bella_tavola_reservation_' + resId + '.ics';
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        };
      }

      // 7. Setup LINE 1-Tap Confirmation Deep Link
      var timeDisplayStr = String(startH).padStart(2, '0') + ':' + String(startM).padStart(2, '0');
      var shiftJp = currentSelectedShift === 'lunch' ? 'ランチ' : 'ディナー';
      var lineMsg = '【席予約確認】\n予約番号: ' + resId + '\nお名前: ' + nameVal + ' 様\nご予約日時: ' + dateClean + ' ' + timeDisplayStr + ' (' + shiftJp + ')\n人数: ' + guestsVal + '名様\n選択コース: ' + courseName + '\nお席希望: ' + seatingVal + (notesVal ? '\nご要望: ' + notesVal : '') + '\nよろしくお願いいたします。';
      var lineUrl = 'https://line.me/R/oaMessage/' + lineId + '/?' + encodeURIComponent(lineMsg);

      var lineConfirmBtn = document.getElementById('btn-line-confirm');
      if (lineConfirmBtn) {
        lineConfirmBtn.href = lineUrl;
      }

      // 8. Open Confirmation Modal & Reset Form
      openModal();
      bookingForm.reset();
    });
  }

  /**
   * 4. Mobile Sticky CTA Bar Logic
   */
  function initStickyCTA() {
    var stickyBar = document.getElementById('mobile-sticky-cta');
    var actionSection = document.getElementById('action') || document.getElementById('booking-form-section');
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

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(updateStickyVisibility);
        ticking = true;
      }
    }, { passive: true });

    updateStickyVisibility();
  }

  /**
   * 5. Accessible FAQ Accordion
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
