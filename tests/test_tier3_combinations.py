#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tests/test_tier3_combinations.py
Tier 3 Cross-Feature Combinations & State Transitions Test Runner (19 Automated Tests).

Covers:
- TC-INT-01..10: Aesthetic & Portal Combinations (Slot tap -> form datetime, plan card -> modal auto-fill, dual state retention, validation, .ics, LINE, fallback flow, FAQ accordion -> CTA scroll, portal aesthetic loop)
- TC-INT-11..13: Legal Consulting Combinations (2WAY online/in-person sync, modal submit -> .ics/LINE, portal legal loop)
- TC-INT-14: Italian Table Booking Flow (.ics, LINE, GCal)
- TC-INT-15..16: Bakery Assortment BOX Combinations (Card tap -> modal auto-fill -> 14-day pickup slot, submit -> 30m .ics + LINE)
- TC-INT-17..18: Washoku Banquet Course Combinations (Course card tap -> modal auto-fill -> party size & slot, submit -> 120m .ics + LINE)
- TC-INT-19: Portal 5-Flagship Hub Navigation Loop (All 5 sample LPs 100% bidirectional navigation guarantee)

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


def run_tier3_suite() -> bool:
    runner = MasterTestRunner(PROJECT_ROOT)
    start_time = time.time()

    print("\n" + "#" * 70)
    print(" [Tier 3] Cross-Feature Combinations & State Transitions Test Suite")
    print(" Modal Auto-Fill, .ics, LINE, 5-Flagship Navigation Loop (19 Test Cases)")
    print("#" * 70)

    runner.run_tier_3_cross_feature_cases()
    duration = time.time() - start_time

    tier3_results = [r for r in runner.results if r.tier == "Tier 3"]
    total = len(tier3_results)
    passed_count = sum(1 for r in tier3_results if r.passed)
    failed_count = total - passed_count

    print("\n" + "=" * 70)
    print(" [Tier 3] 実行結果サマリー (Execution Summary)")
    print("=" * 70)
    print(f" 実行時間: {duration:.2f} 秒")
    print(f" 総テスト数: {total} 件")
    print(f" 成功    : {passed_count} 件")
    print(f" 失敗    : {failed_count} 件")

    if failed_count == 0:
        print(f"\n [PASS] 全 {total} 件の Tier 3 複合機能結合テストが 100% 合格しました！")
        return True
    else:
        print(f"\n [FAIL] {failed_count} 件のテストが失敗しました。")
        for r in tier3_results:
            if not r.passed:
                print(f"  - {r.test_id}: {r.title} -> {r.message}")
        return False


if __name__ == "__main__":
    success = run_tier3_suite()
    sys.exit(0 if success else 1)
