## 2026-08-21T22:28:15Z
You are worker_portal_m3. Your working directory is `c:\Project\事業案\05_LP作成\.agents\worker_portal_m3`.
You own exclusive write permissions for `index.html` and `css/portal.css`.

Read the following files carefully:
- `c:\Project\事業案\05_LP作成\.agents\ORIGINAL_REQUEST.md` (Specifically R5)
- `c:\Project\事業案\05_LP作成\PROJECT.md`
- `c:\Project\事業案\05_LP作成\.agents\explorer_portal_qa_1\handoff.md` (Portal Hub 5-Flagship specifications, IDs, classes, badge counts)
- Existing `index.html` and `css/portal.css`

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your Tasks:
1. Update `index.html`:
   - Hero section quick links: Add `#hero-quick-bakery` (`./samples/bakery/index.html`, class `quick-demo-pill pill-bakery`, dot `pill-dot bakery`, text `🥖 ハード系ベーカリーLP 実機デモ`) and `#hero-quick-washoku` (`./samples/washoku/index.html`, class `quick-demo-pill pill-washoku`, dot `pill-dot washoku`, text `🍶 個室和食居酒屋LP 実機デモ`).
   - Filter tabs: Update `tab-all` count badge to `9` (5 featured + 4 teasers). Update `tab-dining` count badge to `3` (Italian, Bakery, Washoku). Ensure `tab-beauty` is 1, `tab-pro` is 1, teasers (saas, edu, realestate, ec) remain 1.
   - Featured Showcase Grid:
     - Keep Card 1 (`#card-aesthetic`, `data-category="beauty"`), Card 2 (`#card-italian`, `data-category="dining"`), Card 3 (`#card-legal`, `data-category="pro"`).
     - Add Card 4: `id="card-bakery"`, `data-category="dining"`, mock visual `background-image: url(./samples/bakery/assets/images/hero_baguette.jpg)`, LIVE DEMO badge, PASONA feature badges (五感刺激・アルチザン体験型モデル, 14日焼きたて取り置き ◯・△・✕, 自家製ルヴァン酵母・無添加), title `BOULANGERIE ARTISANALE（石窯ハード系ブーランジェリーLP）`, 3 bullet points, CTA button `id="link-bakery-demo"`, `href="./samples/bakery/index.html"`, target audience.
     - Add Card 5: `id="card-washoku"`, `data-category="dining"`, mock visual `background-image: url(./samples/washoku/assets/images/hero_banquet_nabe.jpg)`, LIVE DEMO badge, PASONA feature badges (幹事悩み解決・忘年会特化モデル, 14日宴会席予約 ◯・△・✕, 最大40名完全個室), title `個室和食 旬彩 縁 -ENISHI-（忘年会・個室和食居酒屋LP）`, 3 bullet points, CTA button `id="link-washoku-demo"`, `href="./samples/washoku/index.html"`, target audience.
   - Footer Navigation: Add `./samples/bakery/index.html` (ベーカリーLP実機デモ) and `./samples/washoku/index.html` (和食居酒屋LP実機デモ).
   - Ensure all relative links use strict `./` and no root-relative `/` links.
2. Update `css/portal.css`:
   - Add styles for `.quick-demo-pill.pill-bakery` (amber/wheat border and glow), `.quick-demo-pill.pill-washoku` (indigo/amber border and glow), `.pill-dot.bakery` (`#D97706`), `.pill-dot.washoku` (`#2563EB` or `#D4AF37`).
3. Verify `index.html` structure and layout.

Deliver your detailed report in `c:\Project\事業案\05_LP作成\.agents\worker_portal_m3\handoff.md` and send a message when complete.
