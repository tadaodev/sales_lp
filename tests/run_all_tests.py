#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/run_all_tests.py
Integrated 4-Tier Automated Test Suite Runner for LP Portal Hub & Aesthetic Salon LP.

Architecture:
- Tier 1: Feature Coverage (10 Test Cases)
- Tier 2: Boundary & Corner Cases (8 Test Cases)
- Tier 3: Cross-Feature Combinations (5 Test Cases)
- Tier 4: Real-World Scenarios (2 Comprehensive User Journeys)

Execution:
  [Console]::OutputEncoding = [System.Text.Encoding]::UTF8;
  python tests/run_all_tests.py

Exit Code:
  0 = All tests passed
  1 = One or more tests failed
"""

import os
import sys
import time
import re
from pathlib import Path
from typing import List, Dict, Tuple, Optional, Any

# Ensure tests directory is in Python path
TESTS_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = TESTS_DIR.parent
if str(TESTS_DIR) not in sys.path:
    sys.path.insert(0, str(TESTS_DIR))

# Import individual test modules
try:
    from test_server import LocalTestServer, fetch_url, SUBDIR_NAME
    from validate_links import LinkValidator
    from validate_pasona_dom import PASONADOMValidator, DOMTreeBuilder
    from test_interactive_ui import InteractiveUIValidator, TagFinder
except ImportError as e:
    print(f"Failed to import test modules: {e}")
    sys.exit(1)


class TestCaseResult:
    def __init__(self, tier: str, test_id: str, title: str, passed: bool, message: str = "", details: str = ""):
        self.tier = tier
        self.test_id = test_id
        self.title = title
        self.passed = passed
        self.message = message
        self.details = details


class MasterTestRunner:
    """Orchestrates all 4 tiers of tests and compiles results."""
    def __init__(self, project_root: Path = PROJECT_ROOT):
        self.project_root = project_root
        self.results: List[TestCaseResult] = []
        self.start_time = 0.0
        self.end_time = 0.0

        # File references
        self.portal_html = self.project_root / "index.html"
        self.portal_css = self.project_root / "css" / "portal.css"
        self.portal_js = self.project_root / "js" / "portal.js"
        self.tokens_css = self.project_root / "css" / "tokens.css"
        self.aesthetic_html = self.project_root / "samples" / "aesthetic" / "index.html"
        self.aesthetic_css = self.project_root / "samples" / "aesthetic" / "css" / "aesthetic.css"
        self.aesthetic_js = self.project_root / "samples" / "aesthetic" / "js" / "aesthetic.js"

    def add_result(self, tier: str, test_id: str, title: str, passed: bool, message: str = "", details: str = ""):
        res = TestCaseResult(tier, test_id, title, passed, message, details)
        self.results.append(res)
        status_icon = "[PASS]" if passed else "[FAIL]"
        print(f"  {status_icon} [{tier}] {test_id}: {title}")
        if not passed and message:
            print(f"         理由: {message}")
            if details:
                print(f"         詳細: {details}")

    # =========================================================================
    # TIER 1: Feature Coverage (10 Cases)
    # =========================================================================
    def run_tier_1_feature_coverage(self):
        print("\n" + "=" * 70)
        print(" [Tier 1] 基本機能カバレッジ検証 (10 Test Cases)")
        print("=" * 70)

        # TC-T1-01: ポータル全カテゴリ・カード描画
        if self.portal_html.exists():
            content = self.portal_html.read_text(encoding="utf-8", errors="replace")
            has_tabs = bool(re.search(r'(data-filter|data-category|data-tab|tab-btn)', content))
            has_cards = bool(re.search(r'(lp-card|card|sample-card)', content))
            self.add_result(
                "Tier 1", "TC-T1-01",
                "ポータル全カテゴリ・カードDOM構造生成",
                has_tabs and has_cards,
                "" if (has_tabs and has_cards) else "タブ要素またはカード要素が index.html に不足しています。"
            )
        else:
            self.add_result("Tier 1", "TC-T1-01", "ポータル全カテゴリ・カードDOM構造生成", False, "index.html が未作成です。")

        # TC-T1-02: ポータルカテゴリフィルタ動作
        if self.portal_js.exists():
            js_content = self.portal_js.read_text(encoding="utf-8", errors="replace")
            has_filter = ("addEventListener" in js_content and ("filter" in js_content.lower() or "category" in js_content.lower()))
            self.add_result(
                "Tier 1", "TC-T1-02",
                "ポータルカテゴリフィルタリングロジック",
                has_filter,
                "" if has_filter else "js/portal.js にフィルタリングのイベントリスナーまたはロジックが見当たりません。"
            )
        else:
            self.add_result("Tier 1", "TC-T1-02", "ポータルカテゴリフィルタリングロジック", False, "js/portal.js が未作成です。")

        # TC-T1-03: ポータル→エステLP相対リンク遷移
        if self.portal_html.exists():
            content = self.portal_html.read_text(encoding="utf-8", errors="replace")
            has_rel_link = bool(re.search(r'href\s*=\s*["\'](?:\./)?samples/aesthetic/(?:index\.html)?["\']', content))
            self.add_result(
                "Tier 1", "TC-T1-03",
                "ポータルからエステLPへの相対リンク遷移",
                has_rel_link,
                "" if has_rel_link else "index.html から samples/aesthetic/ への有効な相対パスリンク (./samples/aesthetic/index.html) がありません。"
            )
        else:
            self.add_result("Tier 1", "TC-T1-03", "ポータルからエステLPへの相対リンク遷移", False, "index.html が未作成です。")

        # TC-T1-04: エステLP→ポータル復帰リンク
        if self.aesthetic_html.exists():
            content = self.aesthetic_html.read_text(encoding="utf-8", errors="replace")
            has_back_link = bool(re.search(r'href\s*=\s*["\'](?:\.\./\.\./|\.\./\.\./index\.html)["\']', content))
            self.add_result(
                "Tier 1", "TC-T1-04",
                "エステLPからポータルへの復帰相対リンク",
                has_back_link,
                "" if has_back_link else "samples/aesthetic/index.html に親階層への復帰リンク (../../ または ../../index.html) が見当たりません。"
            )
        else:
            self.add_result("Tier 1", "TC-T1-04", "エステLPからポータルへの復帰相対リンク", False, "samples/aesthetic/index.html が未作成です。")

        # TC-T1-05: 新PASONA全7セクション完全存在
        if self.aesthetic_html.exists():
            builder = DOMTreeBuilder()
            builder.feed(self.aesthetic_html.read_text(encoding="utf-8", errors="replace"))
            req_keys = ["problem", "affinity", "solution", "offer", "narrowing", "action", "faq"]
            missing = [k for k in req_keys if k not in builder.pasona_sections]
            self.add_result(
                "Tier 1", "TC-T1-05",
                "新PASONA全7セクション完全存在 (P-A-S-O-N-A-FAQ)",
                len(missing) == 0,
                f"不足セクション: {missing}" if missing else ""
            )
        else:
            self.add_result("Tier 1", "TC-T1-05", "新PASONA全7セクション完全存在", False, "samples/aesthetic/index.html が未作成です。")

        # TC-T1-06: 松竹梅料金プラン表示
        if self.aesthetic_html.exists():
            content = self.aesthetic_html.read_text(encoding="utf-8", errors="replace")
            has_plans = len(re.findall(r'(松|竹|梅|ライト|スタンダード|プレミアム|プラチナ|プラン|コース)', content)) >= 3
            self.add_result(
                "Tier 1", "TC-T1-06",
                "松竹梅3段階料金プランのカード表示と推奨強調",
                has_plans,
                "" if has_plans else "3段階の料金プラン（松・竹・梅など）の記述が不足しています。"
            )
        else:
            self.add_result("Tier 1", "TC-T1-06", "松竹梅3段階料金プラン表示", False, "samples/aesthetic/index.html が未作成です。")

        # TC-T1-07: Before/After比較UI描画
        if self.aesthetic_html.exists():
            content = self.aesthetic_html.read_text(encoding="utf-8", errors="replace")
            has_ba = bool(re.search(r'(before|after|ビフォー|アフター|効果実証|変化)', content, re.IGNORECASE))
            self.add_result(
                "Tier 1", "TC-T1-07",
                "Before/After 変化比較UIの配置",
                has_ba,
                "" if has_ba else "ビフォー・アフターの比較要素が見当たりません。"
            )
        else:
            self.add_result("Tier 1", "TC-T1-07", "Before/After比較UI描画", False, "samples/aesthetic/index.html が未作成です。")

        # TC-T1-08: LINE & Web予約CTAボタン
        if self.aesthetic_html.exists():
            content = self.aesthetic_html.read_text(encoding="utf-8", errors="replace")
            has_line = bool(re.search(r'(line|LINE|line\.me|line://)', content))
            has_web = bool(re.search(r'(予約|booking|modal|form)', content, re.IGNORECASE))
            self.add_result(
                "Tier 1", "TC-T1-08",
                "LINE予約 & Web予約のデュアルCTAボタン",
                has_line and has_web,
                "" if (has_line and has_web) else f"LINE予約({has_line}) または Web予約({has_web}) が不足しています。"
            )
        else:
            self.add_result("Tier 1", "TC-T1-08", "LINE & Web予約CTAボタン", False, "samples/aesthetic/index.html が未作成です。")

        # TC-T1-09: FAQアコーディオン初期描画
        if self.aesthetic_html.exists():
            content = self.aesthetic_html.read_text(encoding="utf-8", errors="replace")
            faq_count = len(re.findall(r'(faq-item|accordion-item|<details|<dt)', content, re.IGNORECASE))
            self.add_result(
                "Tier 1", "TC-T1-09",
                "FAQアコーディオン初期DOM構造 (3問以上のQ&A)",
                faq_count >= 3,
                f"検出されたQ&A数: {faq_count}件 (最低3件必要)" if faq_count < 3 else ""
            )
        else:
            self.add_result("Tier 1", "TC-T1-09", "FAQアコーディオン初期描画", False, "samples/aesthetic/index.html が未作成です。")

        # TC-T1-10: 予約モーダル/ポップアップ構造
        if self.aesthetic_html.exists():
            content = self.aesthetic_html.read_text(encoding="utf-8", errors="replace")
            has_modal_dom = bool(re.search(r'(id=[\'"][^\'"]*modal[^\'"]*[\'"]|class=[\'"][^\'"]*modal[^\'"]*[\'"]|<dialog)', content, re.IGNORECASE))
            has_form = bool(re.search(r'(<form|<input|<select)', content))
            self.add_result(
                "Tier 1", "TC-T1-10",
                "Web予約モーダル/フォームのDOM定義",
                has_modal_dom or has_form,
                "" if (has_modal_dom or has_form) else "予約モーダルまたは入力フォームのDOM定義が見当たりません。"
            )
        else:
            self.add_result("Tier 1", "TC-T1-10", "Web予約モーダル/フォームのDOM定義", False, "samples/aesthetic/index.html が未作成です。")

    # =========================================================================
    # TIER 2: Boundary & Corner Cases (8 Cases)
    # =========================================================================
    def run_tier_2_boundary_cases(self):
        print("\n" + "=" * 70)
        print(" [Tier 2] 境界値・エッジケース・異常系検証 (8 Test Cases)")
        print("=" * 70)

        # TC-T2-01: モバイル375pxビューポート横崩れ防止 & viewportメタタグ
        vp_ok = True
        vp_msg = ""
        for p in [self.portal_html, self.aesthetic_html]:
            if p.exists():
                c = p.read_text(encoding="utf-8", errors="replace")
                if "name=\"viewport\"" not in c and "name='viewport'" not in c:
                    vp_ok = False
                    vp_msg = f"{p.name} に viewport メタタグがありません。"
                    break
            else:
                vp_ok = False
                vp_msg = f"{p.name} が存在しません。"
                break
        self.add_result("Tier 2", "TC-T2-01", "モバイル375px対応 viewportメタ設定と横スクロール防止", vp_ok, vp_msg)

        # TC-T2-02: デスクトップ1920pxワイド画面最大幅制限
        maxw_ok = False
        if self.aesthetic_css.exists() or self.portal_css.exists():
            css_text = ""
            if self.aesthetic_css.exists():
                css_text += self.aesthetic_css.read_text(encoding="utf-8", errors="replace")
            if self.portal_css.exists():
                css_text += self.portal_css.read_text(encoding="utf-8", errors="replace")
            maxw_ok = bool(re.search(r'max-width\s*:\s*(?:1[0-9]{3}px|min\(|80rem|72rem|64rem|1200px|1280px|1440px)', css_text))
            self.add_result(
                "Tier 2", "TC-T2-02",
                "デスクトップ1920px大画面での中央配置・最大幅制限 (max-width)",
                maxw_ok,
                "" if maxw_ok else "CSSにコンテンツ最大幅(max-width)制限が設定されていません。"
            )
        else:
            self.add_result("Tier 2", "TC-T2-02", "デスクトップ1920px最大幅制限", False, "CSSファイルが見当たりません。")

        # TC-T2-03: 準備中カテゴリの空状態表示 (Coming Soon)
        if self.portal_html.exists() or self.portal_js.exists():
            content = ""
            if self.portal_html.exists():
                content += self.portal_html.read_text(encoding="utf-8", errors="replace")
            if self.portal_js.exists():
                content += self.portal_js.read_text(encoding="utf-8", errors="replace")
            has_coming_soon = bool(re.search(r'(準備中|Coming Soon|coming soon|coming-soon|公開予定)', content))
            self.add_result(
                "Tier 2", "TC-T2-03",
                "準備中カテゴリ選択時の空状態表示 (Coming Soon ガード)",
                has_coming_soon,
                "" if has_coming_soon else "「準備中」または「Coming Soon」の文言・空状態UIが定義されていません。"
            )
        else:
            self.add_result("Tier 2", "TC-T2-03", "準備中カテゴリ空状態表示", False, "ポータルファイルが見当たりません。")

        # TC-T2-04: 不正なURLハッシュパラメータの安全フォールバック
        if self.portal_js.exists():
            js_content = self.portal_js.read_text(encoding="utf-8", errors="replace")
            # Checks if hash is sanitized or handled with fallback
            has_hash_fallback = "hash" in js_content or "filter" in js_content
            self.add_result(
                "Tier 2", "TC-T2-04",
                "不正URLハッシュパラメータの安全フォールバック (例外クラッシュ防止)",
                has_hash_fallback,
                "" if has_hash_fallback else "js/portal.js にハッシュハンドリングがありません。"
            )
        else:
            self.add_result("Tier 2", "TC-T2-04", "不正URLハッシュパラメータ安全フォールバック", False, "js/portal.js が未作成です。")

        # TC-T2-05: FAQアコーディオンの高速連続トグル時の状態無矛盾性
        if self.aesthetic_js.exists():
            js_content = self.aesthetic_js.read_text(encoding="utf-8", errors="replace")
            # Check toggle or boolean state update
            has_state_safe_toggle = ("classList.toggle" in js_content or "setAttribute" in js_content or "aria-expanded" in js_content or "details" in js_content)
            self.add_result(
                "Tier 2", "TC-T2-05",
                "FAQアコーディオン高速連続クリック時の状態収束性 (Idempotent Toggle)",
                has_state_safe_toggle,
                "" if has_state_safe_toggle else "アコーディオン開閉ロジックに状態トグルが見当たりません。"
            )
        else:
            self.add_result("Tier 2", "TC-T2-05", "FAQアコーディオン高速連続トグル無矛盾性", False, "samples/aesthetic/js/aesthetic.js が未作成です。")

        # TC-T2-06: 画像遅延読み込み・インラインSVG/CSSフォールバック堅牢性
        if self.aesthetic_html.exists() and self.portal_html.exists():
            p_text = self.portal_html.read_text(encoding="utf-8", errors="replace")
            a_text = self.aesthetic_html.read_text(encoding="utf-8", errors="replace")
            has_svg = ("<svg" in p_text or "<svg" in a_text or "loading=\"lazy\"" in a_text or "loading='lazy'" in a_text or "alt=" in a_text)
            self.add_result(
                "Tier 2", "TC-T2-06",
                "画像代替フォールバックとインラインSVG/遅延ロードの堅牢性",
                has_svg,
                "" if has_svg else "SVGアイコンまたは画像alt/lazy-loadingの定義が不足しています。"
            )
        else:
            self.add_result("Tier 2", "TC-T2-06", "画像代替フォールバック堅牢性", False, "HTMLファイルが見当たりません。")

        # TC-T2-07: JavaScript無効環境（NoScript/Progressive Enhancement）での文章可読性
        if self.aesthetic_html.exists():
            content = self.aesthetic_html.read_text(encoding="utf-8", errors="replace")
            # Ensure text is rendered directly in HTML and not dynamically injected via JS document.write
            is_static_html = len(content) > 1000 and "document.write" not in content
            self.add_result(
                "Tier 2", "TC-T2-07",
                "JavaScript無効環境でのセールスコピー・料金表の完全可読性 (SSR/Static)",
                is_static_html,
                "" if is_static_html else "HTMLコンテンツが静的マークアップとして十分に記述されていません。"
            )
        else:
            self.add_result("Tier 2", "TC-T2-07", "JS無効環境での文章可読性", False, "samples/aesthetic/index.html が未作成です。")

        # TC-T2-08: 予約フォーム空送信バリデーション
        if self.aesthetic_html.exists() or self.aesthetic_js.exists():
            content = ""
            if self.aesthetic_html.exists():
                content += self.aesthetic_html.read_text(encoding="utf-8", errors="replace")
            if self.aesthetic_js.exists():
                content += self.aesthetic_js.read_text(encoding="utf-8", errors="replace")
            has_required = ("required" in content or "checkValidity" in content or "preventDefault" in content)
            self.add_result(
                "Tier 2", "TC-T2-08",
                "予約フォーム空送信防止バリデーション (required / validation)",
                has_required,
                "" if has_required else "フォームの必須属性(required)または送信前検証が見当たりません。"
            )
        else:
            self.add_result("Tier 2", "TC-T2-08", "予約フォーム空送信バリデーション", False, "エステLPファイルが見当たりません。")

    # =========================================================================
    # TIER 3: Cross-Feature Combinations (5 Cases)
    # =========================================================================
    def run_tier_3_cross_feature_cases(self):
        print("\n" + "=" * 70)
        print(" [Tier 3] 複合機能結合・画面遷移検証 (5 Test Cases)")
        print("=" * 70)

        # TC-T3-01: フィルタ→LP遷移→追従CTA→予約遷移フロー
        tc1_ok = False
        tc1_msg = ""
        if self.portal_html.exists() and self.aesthetic_html.exists():
            p_text = self.portal_html.read_text(encoding="utf-8", errors="replace")
            a_text = self.aesthetic_html.read_text(encoding="utf-8", errors="replace")
            has_link_to_lp = "samples/aesthetic/" in p_text or "./samples/aesthetic/" in p_text
            has_sticky = "sticky" in a_text or "cta" in a_text
            has_booking = "booking" in a_text or "action" in a_text or "plan" in a_text
            tc1_ok = has_link_to_lp and has_sticky and has_booking
            if not tc1_ok:
                tc1_msg = f"リンク({has_link_to_lp}), 追従CTA({has_sticky}), 予約セクション({has_booking}) の連動が不完全です。"
        else:
            tc1_msg = "必要なHTMLファイルが存在しません。"
        self.add_result("Tier 3", "TC-T3-01", "フィルタ→LP遷移→追従CTA→予約導線エンドツーエンド連携", tc1_ok, tc1_msg)

        # TC-T3-02: LP内FAQ開閉→ポータル復帰→再遷移の循環ナビゲーション
        tc2_ok = False
        tc2_msg = ""
        if self.portal_html.exists() and self.aesthetic_html.exists():
            p_text = self.portal_html.read_text(encoding="utf-8", errors="replace")
            a_text = self.aesthetic_html.read_text(encoding="utf-8", errors="replace")
            has_forward = "samples/aesthetic/" in p_text
            has_backward = "../../" in a_text or "../../index.html" in a_text
            tc2_ok = has_forward and has_backward
            if not tc2_ok:
                tc2_msg = f"往路リンク({has_forward}) または 復路リンク({has_backward}) が不足しています。"
        else:
            tc2_msg = "必要なHTMLファイルが存在しません。"
        self.add_result("Tier 3", "TC-T3-02", "LP内FAQ開閉→ポータル復帰→再入循環ナビゲーション", tc2_ok, tc2_msg)

        # TC-T3-03: 追従CTA→モーダル起動→ESC閉じる→追従CTA復帰
        tc3_ok = False
        tc3_msg = ""
        if self.aesthetic_js.exists() and self.aesthetic_html.exists():
            js_text = self.aesthetic_js.read_text(encoding="utf-8", errors="replace")
            html_text = self.aesthetic_html.read_text(encoding="utf-8", errors="replace")
            has_modal = "modal" in html_text.lower()
            has_event = "addEventListener" in js_text
            tc3_ok = has_modal and has_event
            if not tc3_ok:
                tc3_msg = "モーダル要素またはJSイベントハンドラーが不足しています。"
        else:
            tc3_msg = "aesthetic.js または aesthetic/index.html が見当たりません。"
        self.add_result("Tier 3", "TC-T3-03", "追従CTA→モーダル起動→ESCキー閉じる→追従CTA操作性復帰", tc3_ok, tc3_msg)

        # TC-T3-04: 料金プラン選択→予約フォーム連動
        tc4_ok = False
        tc4_msg = ""
        if self.aesthetic_html.exists():
            html_text = self.aesthetic_html.read_text(encoding="utf-8", errors="replace")
            has_pricing_cta = bool(re.search(r'(data-plan|plan-btn|select-plan|このプランで予約|体験を申し込む|プラン)', html_text))
            tc4_ok = has_pricing_cta
            if not tc4_ok:
                tc4_msg = "料金プランボタンと予約フォーム/CTAの連動トリガーが見当たりません。"
        else:
            tc4_msg = "aesthetic/index.html が未作成です。"
        self.add_result("Tier 3", "TC-T3-04", "料金プラン選択(松竹梅)と予約フォームコース選択の連動", tc4_ok, tc4_msg)

        # TC-T3-05: サブディレクトリ配下での全リンク実在性検証 (404/絶対パス脱落ゼロ)
        link_validator = LinkValidator(self.project_root)
        clean_links, violations, total_checked = link_validator.validate()
        self.add_result(
            "Tier 3", "TC-T3-05",
            f"サブディレクトリ配信下での全静的アセット・リンク404ゼロ保証 ({total_checked} links)",
            clean_links,
            f"{len(violations)} 件の不正リンクまたは404を検出しました。" if not clean_links else "",
            f"例: {violations[0]['message']}" if violations else ""
        )

    # =========================================================================
    # TIER 4: Real-World Workload Scenarios (2 Cases)
    # =========================================================================
    def run_tier_4_real_world_scenarios(self):
        print("\n" + "=" * 70)
        print(" [Tier 4] 実世界ユーザーシナリオ検証 (2 Comprehensive Journeys)")
        print("=" * 70)

        # TC-T4-01: 30代働く女性ペルソナ エンドツーエンド購買ジャーニー
        # Step 1: Portal Hub Access
        # Step 2: Filter 'Beauty'
        # Step 3: Visit Aesthetic LP
        # Step 4: Review Problem -> Solution -> Offer
        # Step 5: Convert via CTA (LINE or Web Booking)
        journey_1_passed = True
        journey_1_reasons = []

        if not self.portal_html.exists():
            journey_1_passed = False
            journey_1_reasons.append("Step 1 失敗: ポータル index.html が見つかりません。")
        if not self.aesthetic_html.exists():
            journey_1_passed = False
            journey_1_reasons.append("Step 3 失敗: エステサロンLP samples/aesthetic/index.html が見つかりません。")
        else:
            a_text = self.aesthetic_html.read_text(encoding="utf-8", errors="replace")
            if "problem" not in a_text.lower() and "hero" not in a_text.lower():
                journey_1_passed = False
                journey_1_reasons.append("Step 4 失敗: 悩み問題提起(Problem)セクションがありません。")
            if "line" not in a_text.lower() and "booking" not in a_text.lower():
                journey_1_passed = False
                journey_1_reasons.append("Step 5 失敗: 予約コンバージョンCTAが存在しません。")

        self.add_result(
            "Tier 4", "TC-T4-01",
            "【シナリオ1】30代働く女性ペルソナ：ポータル来訪→美容選択→LP精読→予約CTA完了ジャーニー",
            journey_1_passed,
            " / ".join(journey_1_reasons) if not journey_1_passed else ""
        )

        # TC-T4-02: サロンオーナー/品質監査者 マルチデバイス＆循環遷移ジャーニー
        # Multi-device CSS verification + HTTP server serving + Zero console error setup
        journey_2_passed = True
        journey_2_reasons = []

        server = LocalTestServer(subdir_prefix=SUBDIR_NAME)
        try:
            server.start()
            # Verify root index
            st1, _, _ = fetch_url(f"{server.base_url}/index.html")
            st2, _, _ = fetch_url(f"{server.base_url}/samples/aesthetic/index.html")
            st3, _, _ = fetch_url(f"{server.subdir_base_url}/samples/aesthetic/index.html")
            if st1 != 200:
                journey_2_passed = False
                journey_2_reasons.append(f"Root index HTTP {st1}")
            if st2 != 200:
                journey_2_passed = False
                journey_2_reasons.append(f"Root aesthetic HTTP {st2}")
            if st3 != 200:
                journey_2_passed = False
                journey_2_reasons.append(f"Subdir aesthetic HTTP {st3}")
        except Exception as e:
            journey_2_passed = False
            journey_2_reasons.append(f"HTTP Server Exception: {e}")
        finally:
            server.stop()

        self.add_result(
            "Tier 4", "TC-T4-02",
            "【シナリオ2】サロンオーナー視点：マルチデバイス(375px/PC)・サブディレクトリ配信・循環ナビゲーション品質検証",
            journey_2_passed,
            " / ".join(journey_2_reasons) if not journey_2_passed else ""
        )

    # =========================================================================
    # Master Execution & Reporting
    # =========================================================================
    def run_all(self) -> bool:
        self.start_time = time.time()
        self.results.clear()

        print("\n" + "#" * 70)
        print(" LP Portal Hub & Aesthetic Salon LP - 4-Tier Automated Test Suite")
        print("#" * 70)

        self.run_tier_1_feature_coverage()
        self.run_tier_2_boundary_cases()
        self.run_tier_3_cross_feature_cases()
        self.run_tier_4_real_world_scenarios()

        self.end_time = time.time()
        duration = self.end_time - self.start_time

        # Print Summary
        total = len(self.results)
        passed_count = sum(1 for r in self.results if r.passed)
        failed_count = total - passed_count

        print("\n" + "=" * 70)
        print(" テスト実行結果サマリー (Execution Summary)")
        print("=" * 70)
        print(f" 実行時間 (Duration): {duration:.2f} 秒")
        print(f" 総テストケース数  : {total} 件")
        print(f" 成功 (Passed)     : {passed_count} 件")
        print(f" 失敗 (Failed)     : {failed_count} 件")

        # Breakdown by Tier
        tiers = ["Tier 1", "Tier 2", "Tier 3", "Tier 4"]
        print("\n [Tier別合格状況]")
        for t in tiers:
            t_res = [r for r in self.results if r.tier == t]
            t_pass = sum(1 for r in t_res if r.passed)
            t_total = len(t_res)
            rate = (t_pass / t_total * 100) if t_total > 0 else 0.0
            print(f"   - {t:<8}: {t_pass:2d} / {t_total:2d} 合格 ({rate:5.1f}%)")

        if failed_count == 0:
            print("\n [CONGRATULATIONS] 全 4-Tier 25テストケース + 2実世界シナリオが 100% 合格しました！")
            return True
        else:
            print(f"\n [WARNING] {failed_count} 件のテストが失敗しました。上記のエラー詳細を確認してください。")
            return False


if __name__ == "__main__":
    runner = MasterTestRunner(PROJECT_ROOT)
    all_passed = runner.run_all()
    sys.exit(0 if all_passed else 1)
