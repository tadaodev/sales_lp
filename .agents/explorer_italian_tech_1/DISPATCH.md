## 2026-08-20T23:41:44Z
You are explorer_italian_tech_1.
Your working directory is: c:\Project\事業案\05_LP作成\.agents\explorer_italian_tech_1
Read ORIGINAL_REQUEST.md at: c:\Project\事業案\05_LP作成\.agents\ORIGINAL_REQUEST.md
Read PROJECT.md at: c:\Project\事業案\05_LP作成\PROJECT.md
Inspect the aesthetic salon implementation at: c:\Project\事業案\05_LP作成\samples\aesthetic\js\
Inspect existing tests at: c:\Project\事業案\05_LP作成\tests\

Your mission:
1. Design the technical architecture for the Italian Restaurant LP:
   - `samples/italian/js/config.js`: Define `window.RESTAURANT_CONFIG` schema including restaurant info, lunch & dinner hours, closed days (e.g. Tuesday), lunch time slots (11:30, 12:00, 12:30, 13:00, 13:30) and dinner time slots (17:30, 18:00, 18:30, 19:00, 19:30, 20:00), daysToShow (14), LINE URL, and fallbackSimulation.
   - `samples/italian/js/italian.js`:
     - 14-day 2-shift (Lunch/Dinner switch or unified matrix) seat reservation calendar engine with symbols (◯: 空きあり, △: 残りわずか, ✕: 満席, 休: 定休日).
     - Tap/Click on ◯/△ slot -> populates date and time into the booking form and smoothly scrolls to `#booking-form`.
     - Form validation & submit handling.
     - Booking confirmation modal showing unique reservation ID (`TAV-YYYYMMDD-XXXX`).
     - 1-click Google Calendar Web URL generation.
     - Apple Calendar / Outlook RFC 5545 `.ics` dynamic Blob download with alarm.
     - 1-tap LINE Official Account reservation chat button.
     - Deterministic offline simulation fallback when GAS webhook is not configured.
   - Portal integration in `index.html` (card under 飲食・店舗 filter) and test runner extension in `tests/run_all_tests.py` and `tests/test_interactive_ui.py`.
2. Write full technical architecture, code templates, and test strategy to c:\Project\事業案\05_LP作成\.agents\explorer_italian_tech_1\tech_analysis.md and c:\Project\事業案\05_LP作成\.agents\explorer_italian_tech_1\handoff.md.
3. Report completion to parent via send_message.
