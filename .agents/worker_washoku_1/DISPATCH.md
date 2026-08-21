## 2026-08-22T07:18:34Z
You are worker_washoku_1. Your working directory is `c:\Project\事業案\05_LP作成\.agents\worker_washoku_1`.
You own exclusive write permissions for `samples/washoku/` directory.

Read the following files carefully:
- `c:\Project\事業案\05_LP作成\.agents\ORIGINAL_REQUEST.md` (Specifically R2, R3, R4)
- `c:\Project\事業案\05_LP作成\PROJECT.md`
- `c:\Project\事業案\05_LP作成\.agents\spec_miner_washoku_1\handoff.md` (Full specification, copy, tokens, banquet guarantees, pricing, image prompts, config schema)
- `c:\Project\事業案\05_LP作成\.agents\explorer_portal_qa_1\handoff.md`
- Reference existing samples: `samples/italian/` and `samples/legal/`

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your Tasks:
1. Generate/create 4 high-resolution visual image assets under `samples/washoku/assets/images/`:
   - `hero_banquet_nabe.jpg` (16:9 steaming winter wagyu motsunabe/hotpot with fresh seafood, beer cheers, vibrant banquet atmosphere)
   - `sashimi_platter.jpg` (4:3 prime sashimi assortment on ice bed with fresh tuna, salmon, sea bream, botan shrimp, shiso garnish)
   - `yakitori_charcoal.jpg` (4:3 Bincho charcoal grilled yakitori skewers over flames and aromatic smoke with tare glaze)
   - `washoku_private_room.jpg` (16:9 elegant Japanese modern private dining room with horigotatsu seating, washi lantern lighting, wooden screens)
2. Implement `samples/washoku/js/config.js` defining `window.WASHOKU_CONFIG` matching the schema in `spec_miner_washoku_1/handoff.md`.
3. Implement `samples/washoku/index.html` with:
   - Full new PASONA structure.
   - Single `<h1>`, strict heading hierarchy (h1 -> h2 -> h3), meta tags, ogp, `alt` attributes on all images.
   - 3 Organizer Guarantees, 4 Signature Dishes visual grid, Matsutake 3-tier course cards, 14-day banquet seat calendar container, sticky mobile banquet CTA bar, booking modal & thank-you confirmation view, bidirectional link to portal (`../../index.html`).
4. Implement `samples/washoku/css/washoku.css` with Indigo & Amber Japanese Modern Glassmorphism.
5. Implement `samples/washoku/js/washoku.js` with 14-day banquet calendar calculation, slot selection, form validation, dynamic booking ID, Google Calendar, RFC 5545 .ics, LINE deep link, async GAS webhook, FAQ accordion.
6. Verify your implementation by running test scripts and documenting results.
Deliver your detailed report in `c:\Project\事業案\05_LP作成\.agents\worker_washoku_1\handoff.md` and send a message when complete.
