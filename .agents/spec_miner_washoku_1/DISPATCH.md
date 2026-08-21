## 2026-08-22T07:14:59Z

You are spec_miner_washoku_1. Your working directory is `c:\Project\事業案\05_LP作成\.agents\spec_miner_washoku_1`.
You are investigating the technical specifications and detailed design requirements for the new Banquet Washoku Izakaya Landing Page: "個室和食 旬彩 縁 -ENISHI-".

Read the following files carefully:
- `c:\Project\事業案\05_LP作成\.agents\ORIGINAL_REQUEST.md` (Specifically the latest request dated 2026-08-21T22:12:24Z / 2026-08-22, Requirements R2, R3, R4)
- `c:\Project\事業案\05_LP作成\PROJECT.md`
- Reference existing samples: `samples/italian/index.html`, `samples/italian/js/config.js`, `samples/italian/js/italian.js`, `samples/legal/index.html`, `samples/legal/js/config.js`, `samples/legal/js/legal.js`

Investigate and document in `c:\Project\事業案\05_LP作成\.agents\spec_miner_washoku_1\handoff.md`:
1. Full new PASONA structure for Washoku Izakaya LP (Problem: Banquet organizer anxieties around budget, seat space, privacy, all-you-can-drink quality; Affinity: store manager & chef promise of seamless banquet hosting; Solution: 3 core reassurances [2min from station, private rooms up to 40 guests, all-inclusive pricing with tax], signature dishes [Toyosu fresh fish 5-platter, Bincho charcoal yakitori, seasonal wagyu motsunabe/hotpot, 30 local sakes]; Offer: Matsutake 3-tier banquet courses; Narrowing: early-bird banquet benefits & prime Friday/Saturday slots; Action: 14-day banquet seat availability calendar & LINE quick consultation; FAQ: private room layout, cancellation policy, invoice support, projector/equipment).
2. UI/UX & Design Tokens: Color palette (Indigo Navy `#0B1B3D` & `#071126`, Lantern Amber Gold `#D99B26`, Washi Cream `#FAF8F5`, Charcoal `#1F1F1F`), Japanese modern Glassmorphism, typography, responsive breakpoints.
3. Matsutake 3-Tier Banquet Course Pricing (All 2h All-You-Can-Drink & Tax Included):
   - 梅: 旬彩カジュアル宴会コース (Casual Banquet 7-course) ¥3,980
   - 竹: 名物鍋＆豊洲鮮魚の王道宴会コース (Signature Hotpot & Sashimi 8-course) ★人気No.1 ¥4,980
   - 松: 特選和牛＆極上舟盛り 贅沢極みコース (Special Wagyu & Sashimi Boat 9-course) ¥6,500
4. Config Schema (`window.WASHOKU_CONFIG`) in `samples/washoku/js/config.js`: restaurant info, business hours (17:00 - 23:30, Sat/Sun/Holidays from 16:00), closed days (Year-end/New Year or Sunday irregular), banquet time slots (17:00, 18:30, 19:30, 20:30), 14-day span, fallback simulation, Google Calendar / Apple Calendar (.ics with alarm) / LINE URL.
5. 4 High-Resolution Visual Image Asset requirements: `hero_banquet_nabe.jpg`, `sashimi_platter.jpg`, `yakitori_charcoal.jpg`, `washoku_private_room.jpg` in `samples/washoku/assets/images/`.

Deliver your report in `handoff.md` and send a message when complete.
