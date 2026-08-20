## 2026-08-20T14:23:00Z
You are the Worker for Milestone 1 (M1): GAS Backend & Central Configuration.
Your working directory is: `c:/Project/事業案/05_LP作成/.agents/m1_worker_1/`.
Read `c:/Project/事業案/05_LP作成/.agents/ORIGINAL_REQUEST.md` and `c:/Project/事業案/05_LP作成/PROJECT.md` before starting work.
Refer also to the survey report: `c:/Project/事業案/05_LP作成/.agents/survey_explorer_2/survey_report.md`.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

File Ownership:
You EXCLUSIVELY own:
1. `c:/Project/事業案/05_LP作成/gas/Code.gs`
2. `c:/Project/事業案/05_LP作成/gas/README.md`
3. `c:/Project/事業案/05_LP作成/samples/aesthetic/js/config.js`

Tasks:
1. Implement `gas/Code.gs`:
   - `doGet(e)`: Handle availability query (`action=getAvailability`), parse `days` and `startDate`, check default Google Calendar events within business hours (10:00, 13:00, 16:00, 18:30) and weekly closed days (Tuesday / 2), and return JSON with CORS headers (`ContentService.MimeType.JSON`).
   - `doPost(e)`: Handle booking registration (`action=createBooking`), parse payload (name, phone, email, plan, date, time, notes, reservationId).
     - Check for conflicts in Google Calendar.
     - Create Google Calendar event with full customer details and alert.
     - Append booking record to Google Spreadsheet (`予約台帳` sheet, creating header if absent: 予約日時, 予約番号, お名前, 電話番号, メールアドレス, コース, 備考, 登録日時).
     - Send customer confirmation email and salon notification email via `GmailApp.sendEmail` with luxury template.
     - Return JSON result with proper CORS / error handling.
   - Support test/health-check action `action=ping` or `action=health`.
2. Implement `gas/README.md`:
   - 3-minute beginner-friendly, foolproof setup guide for salon owners.
   - Step 1: Copy Google Spreadsheet template & open Apps Script editor.
   - Step 2: Paste `Code.gs` & configure salon settings.
   - Step 3: Deploy as Web App (Execute as Me, Who has access: Anyone) & handle Google initial authorization warning safely.
   - Step 4: Copy Web App URL into `samples/aesthetic/js/config.js`.
   - FAQ & troubleshooting (CORS, permissions, calendar ID settings).
3. Implement `samples/aesthetic/js/config.js`:
   - Expose `window.SALON_CONFIG` object with:
     - `salonName`, `salonPhone`, `salonEmail`, `salonAddress`
     - `gasWebhookUrl` (empty string by default with placeholder comment)
     - `businessHours` ({ start: "10:00", end: "20:00" })
     - `closedDays` ([2] for Tuesday)
     - `timeSlots` (["10:00", "13:00", "16:00", "18:30"])
     - `daysToShow` (14)
     - `lineOfficialUrl` ("https://line.me/R/ti/p/@lumiera_salon")
     - `fallbackSimulation` (true)
     - `planMaster` list
4. Verify your files: run node/python syntax checks, ensure valid JS and Markdown syntax.
5. Write your handoff report to `c:/Project/事業案/05_LP作成/.agents/m1_worker_1/handoff.md` and send a message to parent when complete.
