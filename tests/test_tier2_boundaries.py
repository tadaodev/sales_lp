#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/test_tier2_boundaries.py
Tier 2 Boundary & Corner Cases Test Runner (65 Automated Tests).

Covers:
- Date rollovers: Month-end (8/31->9/1), Year-end (12/31->1/1), Leap year (2/29), Non-leap year (2/28), 14-day boundaries
- Slot states: All-full, all-open, multi-day closed (Mon/Tue, Sat/Sun), past slots, non-integer hours (18:30)
- Taps & Modals: Rapid re-clicks, slot overwrite, collision avoidance
- GAS & Security: XSS sanitization, email validation, timeout safety, JSON error responses
- Config boundaries: Empty strings, 7-day open, custom closedDays, daysToShow
- Thank-You & IDs: 1,000-run collision zero, multi-byte emojis, empty notes, state cleanup
- RFC 5545 & LINE: 30m / 60m / 80m / 120m durations, special characters, 2,000-char limits
- Fallback determinism: 100-run stability, date variations
- Responsive: Mobile 375px viewport, desktop 1920px max-width, NoScript SSR (>1000 chars)
- Legal, Bakery, and Washoku LP Boundaries: 120m / 30m / 60m duration calculations, multi-day holiday closures, party size bounds (2-40), Matsutake pricing mappings

Exit Code: 0 = PASS, 1 = FAIL
"""

import sys
import time
from pathlib import Path

# Ensure tests directory is in sys.path
TESTS_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = TESTS_DIR.parent
if str(TESTS_DIR) not in sys.path:
    sys.path.insert(0, str(TESTS_DIR))

# Set UTF-8 output encoding for Windows compatibility
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from run_all_tests import MasterTestRunner


def run_tier2_suite() -> bool:
    runner = MasterTestRunner(PROJECT_ROOT)
    start_time = time.time()

    print("\n" + "#" * 70)
    print(" [Tier 2] Boundary & Corner Cases Automated Test Suite")
    print(" Robustness, Date Rollovers, Closures, Limits, Collision (65 Test Cases)")
    print("#" * 70)

    runner.run_tier_2_boundary_cases()
    duration = time.time() - start_time

    tier2_results = [r for r in runner.results if r.tier == "Tier 2"]
    total = len(tier2_results)
    passed_count = sum(1 for r in tier2_results if r.passed)
    failed_count = total - passed_count

    print("\n" + "=" * 70)
    print(" [Tier 2] 実行結果サマリー (Execution Summary)")
    print("=" * 70)
    print(f" 実行時間: {duration:.2f} 秒")
    print(f" 総テスト数: {total} 件")
    print(f" 成功    : {passed_count} 件")
    print(f" 失敗    : {failed_count} 件")

    if failed_count == 0:
        print(f"\n [PASS] 全 {total} 件の Tier 2 境界値・堅牢性テストが 100% 合格しました！")
        return True
    else:
        print(f"\n [FAIL] {failed_count} 件のテストが失敗しました。")
        for r in tier2_results:
            if not r.passed:
                print(f"  - {r.test_id}: {r.title} -> {r.message}")
        return False


if __name__ == "__main__":
    success = run_tier2_suite()
    sys.exit(0 if success else 1)
