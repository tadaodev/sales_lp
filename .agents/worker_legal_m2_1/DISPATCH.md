## 2026-08-21T08:39:28Z
You are a specialized implementation worker (worker_legal_m2_1) assigned to Milestone 2 (M2): Top Portal Integration & Bidirectional Navigation.
Your working directory is c:\Project\事業案\05_LP作成\.agents\worker_legal_m2_1.

Read the authoritative documents first:
1. c:\Project\事業案\05_LP作成\.agents\ORIGINAL_REQUEST.md (§R4)
2. c:\Project\事業案\05_LP作成\PROJECT.md
3. c:\Project\事業案\05_LP作成\.agents\explorer_legal_arch_1\handoff.md (§4.2.(5))
4. c:\Project\事業案\05_LP作成\.agents\spec_miner_legal_1\handoff.md (§7)
5. `index.html` (top portal) and `samples/legal/index.html`

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Scope & Tasks:
1. Top Portal (`index.html`):
   - Hero Quick Links: Add quick demo pill for Legal LP (`#hero-quick-legal`) pointing to `./samples/legal/index.html` with title "⚖️ 士業・法務LP 実機デモ".
   - Category Filter: Update "士業・法務" (`data-filter-tab="pro"`) badge count to 1.
   - Featured Showcase Cards: Upgrade the "士業・法務" card (`data-category="pro"`) from `lp-card teaser` to a full `lp-card featured` (`id="card-legal"`):
     - Thumbnail image: `samples/legal/assets/images/hero_consultation.jpg`
     - Badges: `公開中 LIVE DEMO`, `新PASONA完全準拠`, `2WAY相談予約`, `Glassmorphism UI`
     - Title: `LUMEN LEGAL CONSULTING（ルーメン総合法律事務所）`
     - Description: `企業法務・労務コンサルティング・契約書トラブル解決に強い士業・法務総合事務所。2WAY相談予約カレンダー（Zoomオンライン/丸の内対面）搭載。`
     - Action buttons: "実機デモを見る" pointing to `./samples/legal/index.html`, and preview modal trigger.
   - Footer Navigation: Add link to `./samples/legal/index.html` under sample LPs.
2. Verify bidirectional navigation between `index.html` and `samples/legal/index.html` with zero 404s and strictly relative paths (`./`, `../../`).

Write your handoff report to `c:\Project\事業案\05_LP作成\.agents\worker_legal_m2_1\handoff.md` and report back with `send_message`.
